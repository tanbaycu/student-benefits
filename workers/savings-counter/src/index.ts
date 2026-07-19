/**
 * Collective Savings Counter — Cloudflare Worker + Durable Object + WebSocket
 *
 * Architecture:
 *   - Worker (fetch handler): routes HTTP requests, upgrades WebSocket connections
 *   - SavingsCounter (Durable Object): single instance, holds globalSavings in
 *     persistent storage, broadcasts updates to all connected WebSocket clients
 *
 * Endpoints:
 *   GET  /current          → { globalSavings: number, connectedUsers: number }
 *   POST /increment        → body: { amount: number } → increments, broadcasts
 *   POST /decrement        → body: { amount: number } → decrements (min 0), broadcasts
 *   GET  /ws               → WebSocket upgrade → receives live broadcasts
 */

export interface Env {
  SAVINGS_COUNTER: DurableObjectNamespace;
}

// ─── Main Worker (request router) ────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsResponse(new Response(null, { status: 204 }));
    }

    // Always route to the single shared Durable Object instance
    const id = env.SAVINGS_COUNTER.idFromName("global");
    const stub = env.SAVINGS_COUNTER.get(id);

    return corsResponse(await stub.fetch(request));
  },
} satisfies ExportedHandler<Env>;

function corsResponse(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// ─── Durable Object ───────────────────────────────────────────────────────────

export class SavingsCounter {
  private state: DurableObjectState;
  private sessions: Set<WebSocket> = new Set();
  private globalSavings: number = 0;

  constructor(state: DurableObjectState) {
    this.state = state;
    // Restore persisted value on cold start
    this.state.blockConcurrencyWhile(async () => {
      this.globalSavings = (await this.state.storage.get<number>("globalSavings")) ?? 0;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── WebSocket upgrade ──────────────────────────────────────────────────
    if (path === "/ws") {
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected WebSocket upgrade", { status: 426 });
      }

      const { 0: client, 1: server } = new WebSocketPair();
      this.state.acceptWebSocket(server);
      this.sessions.add(server);

      // Send current state immediately on connect
      server.send(
        JSON.stringify({
          type: "state",
          globalSavings: this.globalSavings,
          connectedUsers: this.sessions.size,
        })
      );

      return new Response(null, { status: 101, webSocket: client });
    }

    // ── REST: GET /current ─────────────────────────────────────────────────
    if (path === "/current" && request.method === "GET") {
      return Response.json({
        globalSavings: this.globalSavings,
        connectedUsers: this.sessions.size,
      });
    }

    // ── REST: POST /increment ──────────────────────────────────────────────
    if (path === "/increment" && request.method === "POST") {
      const body = await request.json<{ amount?: number }>();
      const amount = Math.max(0, Number(body?.amount ?? 0));
      this.globalSavings += amount;
      await this.persistAndBroadcast("add", amount);
      return Response.json({ globalSavings: this.globalSavings });
    }

    // ── REST: POST /decrement ──────────────────────────────────────────────
    if (path === "/decrement" && request.method === "POST") {
      const body = await request.json<{ amount?: number }>();
      const amount = Math.max(0, Number(body?.amount ?? 0));
      this.globalSavings = Math.max(0, this.globalSavings - amount);
      await this.persistAndBroadcast("remove", amount);
      return Response.json({ globalSavings: this.globalSavings });
    }

    // ── REST: POST /submit ──────────────────────────────────────────────
    if (path === "/submit" && request.method === "POST") {
      try {
        const body = await request.json<{ brandName?: string; brandUrl?: string }>();
        const submissions = (await this.state.storage.get<any[]>("submissions")) ?? [];
        const newEntry = {
          id: "sub_" + Date.now(),
          brandName: body.brandName || "N/A",
          brandUrl: body.brandUrl || "",
          submittedAt: new Date().toISOString(),
        };
        submissions.unshift(newEntry);
        // Persist top 100 latest user contributions
        await this.state.storage.put("submissions", submissions.slice(0, 100));
        return Response.json({ success: true, message: "Submitted successfully to public ledger", entry: newEntry });
      } catch {
        return Response.json({ success: false, error: "Invalid payload" }, { status: 400 });
      }
    }

    // ── REST: GET /submissions ──────────────────────────────────────────────
    if (path === "/submissions" && request.method === "GET") {
      const submissions = (await this.state.storage.get<any[]>("submissions")) ?? [];
      return Response.json({ count: submissions.length, submissions });
    }

    return new Response("Not found", { status: 404 });
  }

  // Called by the runtime when a hibernated WebSocket message arrives
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    // Clients can send ping to keep alive; ignore other messages
    if (message === "ping") ws.send("pong");
  }

  // Called by the runtime when a WebSocket closes
  async webSocketClose(ws: WebSocket): Promise<void> {
    this.sessions.delete(ws);
    // Notify remaining clients of updated user count
    this.broadcast({
      type: "users",
      connectedUsers: this.sessions.size,
    });
  }

  // Persist to storage and push update to all WebSocket clients
  private async persistAndBroadcast(action: "add" | "remove", amount: number): Promise<void> {
    await this.state.storage.put("globalSavings", this.globalSavings);
    this.broadcast({
      type: "update",
      action,
      amount,
      globalSavings: this.globalSavings,
      connectedUsers: this.sessions.size,
    });
  }

  private broadcast(payload: object): void {
    const message = JSON.stringify(payload);
    const dead: WebSocket[] = [];
    for (const ws of this.sessions) {
      try {
        ws.send(message);
      } catch {
        dead.push(ws);
      }
    }
    // Clean up broken connections
    for (const ws of dead) this.sessions.delete(ws);
  }
}
