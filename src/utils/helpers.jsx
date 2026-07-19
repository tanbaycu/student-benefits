import React from 'react'
import { 
  GitHubDark, 
  Figma, 
  Notion, 
  VercelDark, 
  MongoDB, 
  DigitalOcean, 
  Heroku, 
  Azure, 
  AWS,
  Microsoft,
  Canva,
  Bootstrap5
} from 'developer-icons'

// Web Audio API Synthesizer — âm thanh tương tác Tactile 0-byte asset
export class SoundFX {
  static ctx = null;
  static isMuted = false;

  static init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  static playClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch { /* silent fail */ }
  }

  static playSuccess() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(now + 0.25);
    } catch { /* silent fail */ }
  }
}

// Multi-Currency Converter Helper (USD ↔ VNĐ)
export const VND_RATE = 25400;

export function formatMoney(usdAmount, currency = 'USD') {
  const amount = Number(usdAmount) || 0;
  if (currency === 'VND') {
    const vnd = amount * VND_RATE;
    if (vnd >= 1000000000) {
      return `${(vnd / 1000000000).toFixed(2)} tỷ ₫`;
    }
    if (vnd >= 1000000) {
      return `${(vnd / 1000000).toFixed(1)} triệu ₫`;
    }
    return `${vnd.toLocaleString('vi-VN')} ₫`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

// Hàm tính "X ngày trước" động (hỗ trợ Song Ngữ VI / EN 100%)
export function timeAgo(dateStr, lang = 'vi') {
  if (!dateStr) return "";
  const now = new Date();
  const past = new Date(dateStr + "T00:00:00+07:00");
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (lang === 'en') {
    if (diffMins < 1)    return "Just now";
    if (diffMins < 60)   return `${diffMins} mins ago`;
    if (diffHours < 24)  return `${diffHours} hrs ago`;
    if (diffDays < 7)    return `${diffDays} days ago`;
    if (diffWeeks < 5)   return `${diffWeeks} weeks ago`;
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return `${diffYears} yrs ago`;
  }

  if (diffMins < 1)    return "Vừa xong";
  if (diffMins < 60)   return `${diffMins} phút trước`;
  if (diffHours < 24)  return `${diffHours} giờ trước`;
  if (diffDays < 7)    return `${diffDays} ngày trước`;
  if (diffWeeks < 5)   return `${diffWeeks} tuần trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
}

// ✦ SIÊU HÀM DỊCH THUẬT NGUYÊN BẢN 100% CHO 295 THẺ ƯU ĐÃI SINH VIÊN
export function getBenefitLocalized(benefit, lang = 'vi') {
  if (!benefit) return benefit;
  if (lang !== 'en') return benefit;

  return {
    ...benefit,
    title: benefit.titleEn || benefit.title,
    value: benefit.valueEn || benefit.value,
    description: benefit.descriptionEn || benefit.description,
    requirements: benefit.requirementsEn || benefit.requirements
  };
}

// Logo SVG tối giản Swiss Grid
export const SwissLogo = () => (
  <svg className="w-10 h-10 shrink-0 transition-transform duration-300 hover:rotate-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="6" fill="#0a0a0a"/>
    <rect x="23" y="5" width="12" height="12" fill="#ff3333"/>
    <rect x="5" y="23" width="12" height="12" fill="#0044ff"/>
    <path d="M20 12V28M12 20H28" stroke="white" strokeWidth="3" strokeLinecap="square"/>
  </svg>
);

// Map tiêu đề với Icon component chính thức từ developer-icons
export function BrandIcon({ title, link }) {
  const t = title.toLowerCase();
  
  if (t.includes('github')) return <GitHubDark className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('figma')) return <Figma className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('notion')) return <Notion className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('vercel') || t.includes('v0')) return <VercelDark className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('mongodb')) return <MongoDB className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('digitalocean')) return <DigitalOcean className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('heroku')) return <Heroku className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('azure')) return <Azure className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('aws')) return <AWS className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('microsoft')) return <Microsoft className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('canva')) return <Canva className="w-7 h-7 shrink-0 text-swiss-dark" />;
  if (t.includes('bootstrap')) return <Bootstrap5 className="w-7 h-7 shrink-0 text-swiss-dark" />;

  let domain = "";
  if (link) {
    try {
      domain = new URL(link).hostname.replace('www.', '');
    } catch { domain = ""; }
  }

  if (domain) {
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div className="w-7 h-7 rounded flex items-center justify-center overflow-hidden bg-swiss-light border border-swiss-border shrink-0 shadow-2xs">
        <img 
          src={logoUrl} 
          alt={title} 
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="hidden text-[10px] font-mono font-black uppercase text-swiss-dark">
          {title.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  const bgColors = [
    'bg-swiss-red text-white',
    'bg-swiss-blue text-white',
    'bg-swiss-dark text-white',
    'bg-neutral-800 text-white'
  ];
  const charCode = title.charCodeAt(0) || 0;
  const bgBrandClass = bgColors[charCode % bgColors.length];

  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-black uppercase shadow-sm shrink-0 ${bgBrandClass}`}>
      {title.slice(0, 2).toUpperCase()}
    </div>
  );
}
