import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  MagnifyingGlass, 
  Info, 
  FilePdf, 
  CheckCircle, 
  PaperPlaneRight, 
  Chat, 
  X 
} from '@phosphor-icons/react'
import Lenis from 'lenis'

// Import Modules Riêng Biệt (Carmack Refactored Architecture)
import { BENEFITS_DATA } from './data/benefitsData'
import { translations } from './data/i18n'
import { SoundFX, formatMoney, timeAgo } from './utils/helpers'
import { Header } from './components/Header'
import { PresetBundles } from './components/PresetBundles'
import { BenefitCard, SkeletonCard } from './components/BenefitCard'
import { CommandPalette } from './components/CommandPalette'
import { SubmitForm } from './components/SubmitForm'
import { ToastNotification } from './components/ToastNotification'
import { LifetimePlanner } from './components/LifetimePlanner'
import { Code, PaintBrush, Briefcase, Heart } from '@phosphor-icons/react'

// Smart Preset Bundles Data Definition
const PRESET_BUNDLES = [
  {
    id: "bundle_dev",
    name: "DEV & CS STACK",
    icon: Code,
    color: "bg-swiss-blue text-white",
    description: "Bộ công cụ lập trình đỉnh cao dành cho sinh viên IT & Khoa Học Máy Tính",
    matchKeywords: ["github", "jetbrains", "kiro", "cursor", "supabase", "termius", "mongodb", "postman"]
  },
  {
    id: "bundle_design",
    name: "CREATIVE & DESIGN",
    icon: PaintBrush,
    color: "bg-swiss-red text-white",
    description: "Combo sáng tạo cho sinh viên ngành Thiết Kế Đồ Họa, UI/UX và Truyền Thông",
    matchKeywords: ["figma", "canva", "adobe", "spline", "axure", "craft", "sketch"]
  },
  {
    id: "bundle_business",
    name: "BUSINESS & FINTECH",
    icon: Briefcase,
    color: "bg-swiss-dark text-white",
    description: "Gói công cụ ghi chú, kế toán và tài chính chuyên nghiệp cho sinh viên Kinh Tế",
    matchKeywords: ["notion", "quickbooks", "microsoft", "financial times", "tableplus", "grammarly"]
  },
  {
    id: "bundle_life",
    name: "LIFESTYLE & TRAVEL",
    icon: Heart,
    color: "bg-emerald-600 text-white",
    description: "Ưu đãi giải trí, phim ảnh, di chuyển và F&B hàng ngày cho sinh viên Việt Nam",
    matchKeywords: ["spotify", "youtube", "apple music", "grabstudent", "vietnam airlines", "cinestar"]
  }
];

// ── AnimatedCounter — spring-animated số, nhảy mượt ──
function AnimatedCounter({ value, prefix = "", suffix = "", className = "" }) {
  return <span className={className}>{prefix}{value.toLocaleString("en-US")}{suffix}</span>;
}

function App() {
  const [lang, setLang] = useState("vi"); // "vi" | "en"
  const [currency, setCurrency] = useState("USD"); // "USD" | "VND"
  const [selectedTheme, setSelectedTheme] = useState("Theme 1");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDealType, setSelectedDealType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [myPlan, setMyPlan] = useState([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);

  // Currency & Sound FX & Command Palette States
  const [isMuted, setIsMuted] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

  // i18n Translation object
  const t = useMemo(() => translations[lang] || translations.vi, [lang]);

  // Synchronize SoundFX muted state
  useEffect(() => {
    SoundFX.isMuted = isMuted;
  }, [isMuted]);

  // Command Palette Shortcut Listener (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        SoundFX.playClick();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Contribute & Toast Notification State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Helper trigger skeleton loading animation mượt mà
  const triggerSkeleton = () => {
    setIsListLoading(true);
    setTimeout(() => setIsListLoading(false), 450);
  };

  // ── Collective Savings Vault — live state từ Cloudflare Worker ────────────
  const WORKER_URL = "https://savings-counter.tranminhtan4953.workers.dev";
  const WS_URL     = "wss://savings-counter.tranminhtan4953.workers.dev/ws";

  const [globalSavings, setGlobalSavings]          = useState(4563);
  const [connectedUsers, setConnectedUsers]         = useState(1);
  const [wsConnected, setWsConnected]               = useState(false);
  const [isSyncedWithServer, setIsSyncedWithServer] = useState(false);
  const [wsConnecting, setWsConnecting]             = useState(true);
  const wsRef = useRef(null);

  useEffect(() => {
    let ws = null;
    let pollingInterval = null;
    let unmounted = false;

    async function fetchServerData() {
      if (unmounted) return;
      try {
        const res = await fetch(`${WORKER_URL}/current`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.globalSavings !== undefined) {
            setGlobalSavings(data.globalSavings);
            setConnectedUsers(data.connectedUsers > 0 ? data.connectedUsers : 1);
            setIsSyncedWithServer(true);
            setWsConnecting(false);
            return true;
          }
        }
      } catch { /* silent fallback */ }
      return false;
    }

    fetchServerData();
    pollingInterval = setInterval(fetchServerData, 4000);

    return () => {
      unmounted = true;
      if (pollingInterval) clearInterval(pollingInterval);
      if (ws) try { ws.close(); } catch {}
    };
  }, []);

  const workerPost = (endpoint, amount = 0) => {
    fetch(`${WORKER_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    }).catch(() => {});
  };

  // Real-time clock (Hanoi Time)
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setCurrentTime(new Intl.DateTimeFormat('vi-VN', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Customizations for Plan
  const [customMultiplier, setCustomMultiplier] = useState(1); 
  const [customSavingsGoal, setCustomSavingsGoal] = useState(1000); 
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Pagination states
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTheme, selectedLocation, searchQuery, selectedDealType, lang]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Community Tips Stack
  const initialTips = [
    { id: 1, name: "Minh Anh", school: "ĐHQG", tip: "Nên dùng email trường để đăng ký JetBrains và GitHub trước khi tốt nghiệp, bạn được cộng tới 1 năm Pro miễn phí." },
    { id: 2, name: "Thành Đạt", school: "Bách Khoa", tip: "Voucher GrabStudent liên kết thẳng với bản đồ di chuyển, kích hoạt bằng ảnh chụp thẻ sinh viên chỉ mất 5 phút." },
    { id: 3, name: "Khánh Linh", school: "FTU", tip: "Figma Pro Education yêu cầu upload thẻ học sinh, hãy chụp rõ logo trường và hạn dùng để được duyệt nhanh nhất." },
    { id: 4, name: "Quốc Bảo", school: "UIT", tip: "Đăng ký GitHub Student Pack qua email trường, bạn sẽ được tặng luôn gói v0.dev Pro và Canva Pro để làm bài tập lớn cực kỳ xịn sò." },
    { id: 5, name: "Hoàng Nam", school: "ĐH Bách Khoa", tip: "Vé tàu hỏa VNR được giảm 10% quanh năm. Lúc mua vé trực tuyến nhớ nhập mã số thẻ sinh viên và mang theo thẻ + CCCD khi ra ga check-in." }
  ];
  const [tips, setTips] = useState(initialTips);

  // Live feed activities
  const [activities] = useState([
    "GitHub Pack: Tặng Canva Pro 12 tháng + Namecheap 1 năm domain free",
    "JetBrains Pack: Bản quyền miễn phí 15 IDEs lập trình học tập",
    "Figma Pack: Sở hữu 100% miễn phí gói thiết kế chuyên nghiệp Figma Pro"
  ]);

  // Apply Preset Bundle
  const applyPresetBundle = (bundle) => {
    SoundFX.playSuccess();
    const matched = BENEFITS_DATA.filter(b => {
      const title = (b.title || '').toLowerCase();
      const desc = (b.description || '').toLowerCase();
      return bundle.matchKeywords.some(kw => title.includes(kw) || desc.includes(kw));
    });
    if (matched.length === 0) return;

    setMyPlan(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const toAdd = matched.filter(b => !existingIds.has(b.id));
      return [...prev, ...toAdd];
    });

    showToast(`✦ ĐÃ THÊM COMBO [${bundle.name}] (${matched.length} ${t.codesCountLabel}) VÀO KIT!`);
  };

  // Filter Benefits Data
  const filteredBenefits = useMemo(() => {
    return BENEFITS_DATA
      .filter((b) => {
        let matchTheme = true;
        if (selectedTheme === "Theme 1") {
          matchTheme = ["Dev", "Design", "Productivity", "AI", "Cloud"].includes(b.category);
        } else if (selectedTheme === "Theme 2") {
          matchTheme = ["Education", "Courses"].includes(b.category);
        } else if (selectedTheme === "Theme 3") {
          matchTheme = ["Entertainment", "Travel", "Health", "Food", "Shopping", "Telecom"].includes(b.category);
        }

        let matchLocation = true;
        if (selectedLocation === "Global") matchLocation = b.scope === "Global";
        if (selectedLocation === "Vietnam") matchLocation = b.scope === "Vietnam";

        let matchDealType = true;
        if (selectedDealType !== "All") matchDealType = b.dealType === selectedDealType;

        let matchQuery = true;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          matchQuery = 
            b.title.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.requirements.toLowerCase().includes(q);
        }

        return matchTheme && matchLocation && matchDealType && matchQuery;
      })
      .sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        const da = a.updatedDate ? new Date(a.updatedDate) : new Date(0);
        const db = b.updatedDate ? new Date(b.updatedDate) : new Date(0);
        return db - da;
      });
  }, [selectedTheme, selectedLocation, searchQuery, selectedDealType]);

  const paginatedBenefits = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBenefits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBenefits, currentPage]);

  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);

  // Xử lý khi chọn Tab Địa Lý (Global / Vietnam / All) — Đổi Ngôn Ngữ + Tiền Tệ + Load Skeleton!
  const handleLocationChange = (loc) => {
    SoundFX.playClick();
    setSelectedLocation(loc);
    triggerSkeleton();

    if (loc === "Global") {
      setLang("en");
      setCurrency("USD");
      showToast(t.toastLangEn);
    } else if (loc === "Vietnam") {
      setLang("vi");
      setCurrency("VND");
      showToast(t.toastLangVi);
    }
  };

  const handleThemeChange = (theme) => {
    SoundFX.playClick();
    setSelectedTheme(theme);
    triggerSkeleton();
  };

  // Plan Actions
  const addToPlan = (benefit) => {
    if (!myPlan.some(item => item.id === benefit.id)) {
      setMyPlan([...myPlan, { ...benefit, note: "", targetYear: 1 }]);
      workerPost("/increment", benefit.savings || 0);
    }
  };

  const removeFromPlan = (id) => {
    const item = myPlan.find(i => i.id === id);
    setMyPlan(myPlan.filter(item => item.id !== id));
    if (item) {
      workerPost("/decrement", item.savings || 0);
    }
  };

  const updatePlanItem = (id, fields) => {
    setMyPlan(myPlan.map(item => item.id === id ? { ...item, ...fields } : item));
  };

  const totalYearlySavings = myPlan.reduce((acc, curr) => acc + (curr.savings * (curr.targetYear || 1)), 0);
  const totalLifetimeSavings = totalYearlySavings * customMultiplier;
  const progressPercentage = Math.min((totalLifetimeSavings / customSavingsGoal) * 100, 100);

  const locations = [
    { key: "All", label: t.scopeAll },
    { key: "Global", label: t.scopeGlobal },
    { key: "Vietnam", label: t.scopeVietnam }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col pt-28 selection:bg-swiss-blue selection:text-white">
      {/* 1. FLOATING HEADER */}
      <Header 
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        totalYearlySavings={totalYearlySavings}
        myPlanLength={myPlan.length}
        currentTime={currentTime}
        setIsCmdPaletteOpen={setIsCmdPaletteOpen}
        setIsPlannerOpen={setIsPlannerOpen}
        showToast={showToast}
        t={t}
        triggerSkeleton={triggerSkeleton}
      />

      {/* 2. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-t swiss-grid-line bg-white mt-4 relative">
        <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r swiss-grid-line overflow-hidden">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-swiss-red mb-5 inline-block font-semibold">
            ✦ EXCLUSIVE VERIFIED LIFETIME REVENUE
          </span>
          <h1 className="font-roboto font-black text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tighter text-swiss-dark uppercase flex flex-col gap-1.5">
            <div>STUDENT</div>
            <div className="text-swiss-blue">BENEFITS</div>
            <div className="text-swiss-dark font-light text-2xl xs:text-3xl sm:text-4xl md:text-5xl tracking-normal border-t-2 border-swiss-dark pt-3 mt-1">
              & SAVINGS LEDGER
            </div>
          </h1>
          <p className="mt-6 text-xs sm:text-sm font-sans text-swiss-gray max-w-xl leading-relaxed">
            Hệ thống tra cứu và quản lý bản quyền phần mềm, công cụ AI, dịch vụ hàng không và ưu đãi giáo dục chính thức dành riêng cho học sinh sinh viên.
          </p>
        </div>

        {/* Collective Savings Vault */}
        <div className="lg:col-span-5 p-6 md:p-8 bg-swiss-dark text-white flex flex-col justify-between relative overflow-hidden min-h-[360px]">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray">
                [COLLECTIVE SAVINGS VAULT]
              </span>
              <span className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                (wsConnected || isSyncedWithServer)
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" 
                  : wsConnecting 
                    ? "border-yellow-400/40 text-yellow-400 bg-yellow-400/10"
                    : "border-swiss-blue/40 text-swiss-blue bg-swiss-blue/10"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  (wsConnected || isSyncedWithServer)
                    ? "bg-emerald-500 animate-pulse" 
                    : wsConnecting 
                      ? "bg-yellow-400 animate-ping"
                      : "bg-swiss-blue"
                }`}></span>
                {(wsConnected || isSyncedWithServer) ? "LIVE" : wsConnecting ? "CONNECTING" : "SIMULATED"}
              </span>
            </div>
            <p className="text-xs text-swiss-gray leading-relaxed font-sans max-w-md">
              Tổng lượng tài chính trọn đời tích lũy dự kiến từ toàn bộ các thành viên tham gia cấu hình Kit. Dữ liệu live từ máy chủ giáo dục.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-4 mt-auto">
            <div className="font-roboto font-black text-5xl tracking-tighter text-white leading-none">
              <AnimatedCounter value={globalSavings} prefix="$" />
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-[9.5px] font-mono text-swiss-gray uppercase tracking-widest">
                {connectedUsers} người trực tuyến
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore" className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Search Bar & Statistics */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-swiss-gray">
              <MagnifyingGlass size={16} />
            </span>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-swiss-border pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-swiss-dark focus:ring-1 focus:ring-swiss-dark transition-all placeholder:text-swiss-gray/60 rounded-full"
            />
          </div>
          <div className="font-mono text-xs text-swiss-gray flex items-center justify-between border border-swiss-border bg-white px-5 py-2.5 gap-4 rounded-full">
            <span>{t.filteringData} <strong>{filteredBenefits.length}</strong> / <strong>{BENEFITS_DATA.length}</strong> {t.codesCount}</span>
          </div>
        </div>

        {/* 3. SMART PRESET BUNDLES (BENTO MAX RESPONSIVE) */}
        <PresetBundles 
          bundles={PRESET_BUNDLES}
          benefitsData={BENEFITS_DATA}
          myPlan={myPlan}
          applyPresetBundle={applyPresetBundle}
          currency={currency}
          t={t}
        />

        {/* 4. FILTER THEMES GRID */}
        <div className="mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            [01] THEO CHỦ ĐỀ ƯU ĐÃI (THEME)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-swiss-border divide-y md:divide-y-0 md:divide-x divide-swiss-border bg-white">
            {[
              { id: "Theme 1", name: t.theme01 },
              { id: "Theme 2", name: t.theme02 },
              { id: "Theme 3", name: t.theme03 }
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={`swiss-pressable-sm px-4 py-4 text-center text-xs font-mono uppercase tracking-widest font-black transition-all duration-200 ${
                  selectedTheme === theme.id 
                    ? 'bg-swiss-dark text-white' 
                    : 'text-swiss-dark hover:bg-swiss-light'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* 5. FILTER REGIONAL SCOPE — Song Ngữ VI / EN & Auto Currency Switcher */}
        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            {t.scopeTitle}
          </div>
          <div className="grid grid-cols-3 border border-swiss-border divide-x divide-swiss-border bg-white max-w-xl">
            {locations.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLocationChange(key)}
                className={`swiss-pressable-sm px-1.5 xs:px-3 py-2 sm:py-2.5 text-center text-[10px] xs:text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                  selectedLocation === key 
                    ? 'bg-swiss-dark text-white' 
                    : 'text-swiss-dark hover:bg-swiss-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. FILTER DEAL TYPE */}
        <div className="mb-12">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            {t.dealTypeTitle}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "All",      label: t.dealAll,      icon: "◈" },
              { key: "free",     label: t.dealFree,     icon: "✦" },
              { key: "discount", label: t.dealDiscount, icon: "%" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  SoundFX.playClick();
                  setIsListLoading(true);
                  setSelectedDealType(key);
                  setTimeout(() => setIsListLoading(false), 350);
                }}
                className={`swiss-pressable-sm flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-wider border rounded-full transition-all font-bold ${
                  selectedDealType === key
                    ? key === "free"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : key === "discount"
                      ? "bg-swiss-blue text-white border-swiss-blue shadow-sm"
                      : "bg-swiss-dark text-white border-swiss-dark shadow-sm"
                    : "bg-white text-swiss-gray border-swiss-border hover:border-swiss-dark hover:text-swiss-dark"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. BENEFITS GRID & SKELETON LOADER */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-6 flex justify-between items-center border-b border-swiss-border pb-2">
            <span>{t.listTitle} ({filteredBenefits.length} MỤC - {t.page} {currentPage} / {totalPages || 1})</span>
            <span>{t.autoUpdated}</span>
          </div>

          {isListLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginatedBenefits.length === 0 ? (
            <div className="border border-dashed border-swiss-border p-16 text-center bg-white rounded-xl">
              <Info size={32} className="mx-auto text-swiss-gray mb-3" />
              <p className="text-sm font-mono text-swiss-gray">Không tìm thấy quyền lợi nào phù hợp với bộ lọc hiện tại.</p>
              <button 
                type="button"
                onClick={() => { setSelectedTheme("Theme 1"); setSelectedLocation("All"); setSearchQuery(""); }}
                className="swiss-pressable mt-4 border border-swiss-dark px-5 py-2 text-xs font-mono uppercase hover:bg-swiss-dark hover:text-white transition-all rounded-full"
              >
                Reset bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedBenefits.map((benefit, index) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                const isInPlan = myPlan.some(item => item.id === benefit.id);
                return (
                  <BenefitCard 
                    key={benefit.id}
                    benefit={benefit}
                    globalIndex={globalIndex}
                    isInPlan={isInPlan}
                    addToPlan={addToPlan}
                    removeFromPlan={removeFromPlan}
                    currency={currency}
                    lang={lang}
                    t={t}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2 font-mono text-xs">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    SoundFX.playClick();
                    triggerSkeleton();
                    setCurrentPage(p);
                  }}
                  className={`w-9 h-9 flex items-center justify-center border rounded-lg font-bold transition-all ${
                    currentPage === p ? "bg-swiss-dark text-white border-swiss-dark" : "bg-white text-swiss-dark border-swiss-border hover:bg-swiss-light"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 8. CONTRIBUTE FORM & TIPS SECTION */}
        <section className="mt-20 border-t-2 border-swiss-dark pt-12">
          <div className="grid grid-cols-12 gap-8">
            <SubmitForm 
              WORKER_URL={WORKER_URL}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              showToast={showToast}
              t={t}
            />

            {/* Community Tips */}
            <div className="col-span-12 lg:col-span-6 bg-swiss-light/40 border border-swiss-border p-8 flex flex-col justify-between rounded-2xl shadow-sm">
              <div className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-swiss-dark border-b border-swiss-border pb-1 font-bold flex items-center gap-1.5">
                  <Chat size={14} className="text-swiss-blue" /> [TIPS] CHIA SẺ TRẢI NGHIỆM CỦA SINH VIÊN
                </div>
                <p className="text-xs text-swiss-gray leading-relaxed font-sans">
                  Nhấp vào thẻ để đọc những kinh nghiệm claim ưu đãi của các sinh viên đi trước.
                </p>
              </div>

              <div className="relative flex-1 w-full max-w-xl h-48 flex items-center justify-center mt-4">
                <AnimatePresence>
                  {tips.map((tip, i) => {
                    if (i > 0) return null;
                    return (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          SoundFX.playClick();
                          setTips(prev => [...prev.slice(1), prev[0]]);
                        }}
                        className="bg-white border-2 border-swiss-dark p-6 rounded-xl shadow-md cursor-pointer w-full"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-xs text-swiss-dark">{tip.name}</span>
                          <span className="text-[9px] font-mono text-swiss-blue bg-swiss-blue/10 px-2 py-0.5 rounded font-bold">{tip.school}</span>
                        </div>
                        <p className="text-xs text-swiss-gray font-sans leading-relaxed">
                          "{tip.tip}"
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING PLANNER MODAL */}
      <LifetimePlanner
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        myPlan={myPlan}
        removeFromPlan={removeFromPlan}
        updatePlanItem={updatePlanItem}
        customMultiplier={customMultiplier}
        setCustomMultiplier={setCustomMultiplier}
        customSavingsGoal={customSavingsGoal}
        setCustomSavingsGoal={setCustomSavingsGoal}
        totalLifetimeSavings={totalLifetimeSavings}
        totalYearlySavings={totalYearlySavings}
        progressPercentage={progressPercentage}
        setIsExportModalOpen={setIsExportModalOpen}
        setMyPlan={setMyPlan}
        currency={currency}
      />

      {/* COMMAND PALETTE MODAL (Ctrl + K) */}
      <CommandPalette 
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        cmdQuery={cmdQuery}
        setCmdQuery={setCmdQuery}
        benefitsData={BENEFITS_DATA}
        addToPlan={addToPlan}
        showToast={showToast}
        currency={currency}
        t={t}
      />

      {/* FLOATING TOAST BANNER */}
      <ToastNotification 
        toastMessage={toastMessage} 
        setToastMessage={setToastMessage} 
      />
    </div>
  )
}

export default App
