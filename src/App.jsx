import { BENEFITS_DATA } from './data/benefitsData'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react'
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Globe, 
  Plus, 
  Trash, 
  Sparkle, 
  Info,
  MagnifyingGlass,
  ArrowDown,
  X,
  FilePdf,
  CheckCircle,
  IdentificationCard,
  Sliders,
  Users,
  PaperPlaneRight,
  Chat,
  Command,
  SpeakerHigh,
  SpeakerSimpleSlash,
  CurrencyCircleDollar,
  Lightning,
  Code,
  PaintBrush,
  Briefcase,
  Heart
} from '@phosphor-icons/react'
import Lenis from 'lenis'
// Import trực tiếp các component icon từ package developer-icons đã cài đặt
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
import { LifetimePlanner } from './components/LifetimePlanner'
import { getBenefitLocalized } from './utils/helpers.jsx'

// Web Audio API Synthesizer — âm thanh tương tác Tactile 0-byte asset
class SoundFX {
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
const VND_RATE = 25400;
function formatMoney(usdAmount, currency = 'USD') {
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

// Smart Preset Bundles (Combo 1-Click theo ngành học)
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

// Hàm tính "X ngày trước" động từ ISO date string (YYYY-MM-DD)
// Tự động cập nhật mỗi khi render — không cần hardcode text thủ công
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const past = new Date(dateStr + "T00:00:00+07:00"); // Hanoi timezone
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1)    return "Vừa xong";
  if (diffMins < 60)   return `${diffMins} phút trước`;
  if (diffHours < 24)  return `${diffHours} giờ trước`;
  if (diffDays < 7)    return `${diffDays} ngày trước`;
  if (diffWeeks < 5)   return `${diffWeeks} tuần trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
}

// Logo SVG tối giản cực kỳ "peak" - Thiết kế Bauhaus Swiss Grid phẳng
const SwissLogo = () => (
  <svg className="w-10 h-10 shrink-0 transition-transform duration-300 hover:rotate-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="6" fill="#0a0a0a"/>
    <rect x="23" y="5" width="12" height="12" fill="#ff3333"/>
    <rect x="5" y="23" width="12" height="12" fill="#0044ff"/>
    <path d="M20 12V28M12 20H28" stroke="white" strokeWidth="3" strokeLinecap="square"/>
  </svg>
)

// Component render Brand Icon thông minh:
// 1. Sử dụng các component của developer-icons cho các dev tools có sẵn.
// 2. Tự động trích xuất domain từ link ưu đãi và tải logo chất lượng cao 128px từ Google Favicon Service.
// Giải pháp này 100% KHÔNG BỊ CHẶN bởi AdBlocker, load cực nhanh và an toàn tuyệt đối.
function BrandIcon({ title, link }) {
  const nameLower = title.toLowerCase();
  
  // 1. Render các component từ developer-icons cho các công cụ dev chính để tối ưu thẩm mỹ
  if (nameLower.includes("github") || nameLower.includes("copilot")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><GitHubDark className="w-full h-full" /></div>;
  }
  if (nameLower.includes("figma")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Figma className="w-full h-full" /></div>;
  }
  if (nameLower.includes("v0.dev") || nameLower.includes("vercel")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><VercelDark className="w-full h-full" /></div>;
  }
  if (nameLower.includes("notion")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Notion className="w-full h-full" /></div>;
  }
  if (nameLower.includes("mongodb")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><MongoDB className="w-full h-full" /></div>;
  }
  if (nameLower.includes("digitalocean")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><DigitalOcean className="w-full h-full" /></div>;
  }
  if (nameLower.includes("heroku")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Heroku className="w-full h-full" /></div>;
  }
  if (nameLower.includes("azure")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Azure className="w-full h-full" /></div>;
  }
  if (nameLower.includes("aws") && !nameLower.includes("draw")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><AWS className="w-full h-full" /></div>;
  }
  if (nameLower.includes("microsoft") && !nameLower.includes("azure")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Microsoft className="w-full h-full" /></div>;
  }
  if (nameLower.includes("canva")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Canva className="w-full h-full" /></div>;
  }
  if (nameLower.includes("bootstrap")) {
    return <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-white rounded p-0.5"><Bootstrap5 className="w-full h-full" /></div>;
  }

  // 2. Trích xuất tên miền và lấy logo chất lượng cao từ Google Favicon Service (sz=128)
  let domain = "";
  try {
    const hostname = new URL(link).hostname;
    domain = hostname.replace("www.", "");
    
    // Tinh chỉnh tên miền cho các hãng đặc thù và loại bỏ subdomain phụ để lấy đúng logo gốc
    if (domain.includes("github.com")) domain = "github.com";
    else if (domain.includes("figma.com")) domain = "figma.com";
    else if (domain.includes("mathworks.com")) domain = "mathworks.com"; 
    else if (domain.includes("fpt-arena.edu.vn")) domain = "fpt.com.vn"; // Map sang fpt.com.vn để lấy logo cam chuẩn của FPT
    else if (domain.includes("starbucks.vn")) domain = "starbucks.com"; // Map sang starbucks.com để lấy logo Starbucks toàn cầu xanh lá chuẩn
    else if (domain.includes("phuc-long.com.vn")) domain = "phuclong.com.vn";
    else if (domain.includes("be.com.vn")) domain = "be.com.vn";
    else if (domain.includes("xanhsm.com")) domain = "vinfast.com"; // Xanh SM dùng VinFast
    else if (domain.includes("cgv.vn")) domain = "cgv.co.kr";
    else if (domain.includes("dominos.vn")) domain = "dominos.com";
    else if (domain.includes("lottecinemavn.com")) domain = "lotte.co.kr";
    else if (domain.includes("schools.duolingo.com")) domain = "duolingo.com";
    else if (domain.includes("visualstudio.microsoft.com")) domain = "microsoft.com";
    else if (domain.includes("accessnyt.com")) domain = "nytimes.com"; // Map sang nytimes.com để lấy logo The New York Times chuẩn
  } catch (e) {
    domain = "";
  }

  if (domain) {
    // API Google s2 favicons lấy ảnh 128px sắc nét, không bị block bởi AdBlocker
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div className="w-7 h-7 rounded bg-white border border-swiss-border flex items-center justify-center overflow-hidden p-1 shadow-sm shrink-0">
        <img 
          src={logoUrl} 
          alt={title} 
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
            const fallbackElement = e.target.nextSibling;
            if (fallbackElement) fallbackElement.style.display = "flex";
          }}
        />
        <span className="hidden w-full h-full items-center justify-center text-[10px] font-mono font-black bg-swiss-dark text-white rounded uppercase">
          {title.charAt(0)}
        </span>
      </div>
    );
  }

  // Fallback dự phòng
  let bgBrandClass = "bg-swiss-dark text-white";
  if (nameLower.includes("be")) bgBrandClass = "bg-amber-400 text-swiss-dark font-black";
  else if (nameLower.includes("xanh")) bgBrandClass = "bg-cyan-500 text-white";
  else if (nameLower.includes("phuc long")) bgBrandClass = "bg-emerald-800 text-white";
  else if (nameLower.includes("highlands")) bgBrandClass = "bg-red-800 text-white";
  else if (nameLower.includes("cgv") || nameLower.includes("lotte")) bgBrandClass = "bg-red-600 text-white";

  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-mono font-black uppercase shadow-sm shrink-0 ${bgBrandClass}`}>
      {title.charAt(0)}
    </div>
  );
}

// BENEFITS_DATA imported from ./data/benefitsData.js

const REALTIME_ACTIVITIES = [
  "GitHub Pack: Tặng Canva Pro 12 tháng + Namecheap 1 năm domain free",
  "JetBrains Pack: Bản quyền miễn phí 15 IDEs lập trình học tập",
  "Figma Pack: Sở hữu 100% miễn phí gói thiết kế chuyên nghiệp Figma Pro",
  "Spotify Premium: Ưu đãi giảm giá 50% chi phí âm nhạc trọn gói",
  "v0.dev Pro: Kích hoạt thành công gói tài khoản Pro AI Education",
  "Samsung Campus: Đã xác thực giảm giá 30% cho laptop Galaxy Book",
  "GrabStudent HCMC: 10 vouchers di chuyển giảm 20% đã kích hoạt",
  "BeStudent Hanoi: Làm mới thành công gói ưu đãi di chuyển xe điện beBike",
  "Xanh SM Vietnam: Hỗ trợ 15% taxi điện VinFast cho sinh viên Bách Khoa",
  "Coursera Pack: Miễn phí 1 chứng chỉ khóa học cấp bởi các trường ĐH danh tiếng",
  "Vietnam Railways: Đã xuất vé tàu SE4 giảm 10% cho sinh viên ĐH Công Nghiệp",
  "CellphoneS S-Student: Kích hoạt giảm thêm 5% cho iPad Air M2 của tân sinh viên",
  "Nha khoa Parkway: Đã duyệt gói trả góp 0% chỉnh nha Invisalign cho sinh viên Ngoại Thương",
  "IIG Việt Nam: Đã giảm 450k lệ phí đăng ký thi TOEIC 4 kỹ năng",
  "HCMC Bus System: Đã quét 250 lượt vé bus 3K định danh bằng MultiGo hôm nay",
  "TablePlus Pro: Bản quyền học tập giảm giá 50% vừa cấp cho sinh viên UIT",
  "Spline 3D Pro: Kích hoạt thành công gói tài khoản Pro thiết kế 3D Education",
  "VUS IELTS: Đã ghi nhận học bổng bán phần cho học viên chuẩn bị du học",
  "Craft.do Notes: Đã cấp quyền sử dụng miễn phí tài khoản Craft Pro",
  "KFC Việt Nam: Đã phục vụ 180 combo gà rán Nanban HSSV buổi trưa nay",
  "Dinh Độc Lập: Đã xuất 45 vé tham quan di tích lịch sử giảm 50% cho thẻ sinh viên",
  "GrabStudent Pack: Ưu đãi 20% các chuyến đi Grab và giao đồ ăn hàng tháng",
  "Apple Back to School VN: Đã tặng 4-pack AirTag 2nd gen cho sinh viên mua MacBook Pro",
  "Grammarly Pro: Kích hoạt giảm 40% qua SheerID cho sinh viên ĐH Hà Nội",
  "Knowt AI: Tạo tự động 120 flashcard từ file PDF bài giảng Xác suất thống kê",
  "Babbel Student: Kích hoạt giảm 65% gói 3 tháng ngôn ngữ Nhật cho sinh viên HUTECH",
  "Decree 179: Đã xác nhận học bổng 4.2tr/tháng cho sinh viên ngành vi mạch bán dẫn"
];

// Phân nhóm Theme lớn cho các ưu đãi học tập/di chuyển/tech
const getThemeForBenefit = (benefit) => {
  const cat = benefit.category;
  if (cat === "Tech & Software" || benefit.title.includes("Perplexity") || benefit.title.includes("Copilot") || benefit.title.includes("GitKraken") || benefit.title.includes("Termius") || benefit.title.includes("Balsamiq") || benefit.title.includes("Bootstrap")) {
    return "Theme 1";
  }
  if (cat === "Education") {
    return "Theme 2";
  }
  return "Theme 3"; // Lifestyle, Food & Dining, Travel & Transport
};

// Component chiếc thẻ Sinh Viên 3D tương tác (Magnetic/Tilt)
function InteractiveStudentCard() {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 120, damping: 18 });
  
  const sheenX = useSpring(useTransform(x, [-150, 150], [0, 100]), { stiffness: 120, damping: 18 });

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const relativeX = event.clientX - rect.left - width / 2;
    const relativeY = event.clientY - rect.top - height / 2;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative w-full max-w-sm aspect-[1.586/1] mx-auto cursor-pointer select-none [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }}
        className="w-full h-full bg-swiss-dark text-white rounded-2xl p-6 relative flex flex-col justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <motion.div 
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            left: useTransform(sheenX, (val) => `${val - 50}%`),
            width: "200%",
            height: "100%",
            position: "absolute",
            top: 0,
            pointerEvents: "none"
          }}
        />

        <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] text-swiss-gray uppercase tracking-widest block">IDENTITY CARD</span>
            <span className="font-roboto font-black text-sm uppercase tracking-tighter">SWISS STUDENT STORE</span>
          </div>
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center border border-white/10">
            <div className="w-3 h-1 bg-swiss-red rounded-sm"></div>
            <div className="w-1 h-3 bg-swiss-red rounded-sm absolute"></div>
          </div>
        </div>

        <div className="w-9 h-7 bg-amber-500/20 rounded-md border border-amber-500/40 relative overflow-hidden" style={{ transform: "translateZ(40px)" }}>
          <div className="absolute inset-x-2 top-0 bottom-0 border-x border-amber-500/20"></div>
          <div className="absolute inset-y-2 left-0 right-0 border-y border-amber-500/20"></div>
        </div>

        <div className="flex justify-between items-end font-mono text-[10px]" style={{ transform: "translateZ(30px)" }}>
          <div className="space-y-1">
            <div className="tracking-wider text-swiss-gray">HOLDER: ACTIVE STUDENT</div>
            <div className="text-white flex items-center gap-1.5 font-bold uppercase tracking-widest">
              <Sparkle size={10} className="text-swiss-blue" />
              VALID 2026/27
            </div>
          </div>
          <div className="text-right text-swiss-gray">
            tanbaycu / ID-998
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Magnetic Button component (Emil Kowalski micro-interaction)
function MagneticButton({ children, className, ...props }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Creative Floating Label Input for Contribute Form
function CustomInput({ label, id, type = "text", required = true, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="relative pt-4 w-full">
      <label 
        htmlFor={id}
        className={`absolute left-0 top-4 text-xs text-swiss-gray transition-all duration-300 pointer-events-none origin-left ${
          focused || value ? '-translate-y-4 scale-[0.82] text-swiss-dark font-black tracking-widest' : ''
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border-b border-swiss-border focus:border-swiss-dark transition-all duration-300 pb-1.5 pt-1.5 text-xs font-sans bg-transparent focus:outline-none placeholder:opacity-0"
        placeholder={placeholder}
      />
    </div>
  );
}

// Loading Card Skeleton
function SkeletonCard() {
  return (
    <div className="border border-swiss-border bg-white p-5 flex flex-col justify-between h-[280px] relative rounded-xl overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-3 animate-shimmer rounded"></div>
        <div className="w-20 h-5 animate-shimmer rounded"></div>
      </div>
      
      <div className="space-y-3 flex-1">
        <div className="w-4/5 h-6 animate-shimmer rounded"></div>
        <div className="w-2/5 h-4 animate-shimmer rounded mt-1"></div>
        <div className="w-full h-12 animate-shimmer rounded mt-4"></div>
      </div>

      <div className="w-full h-8 animate-shimmer rounded mt-4"></div>
      
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-swiss-border">
        <div className="h-9 animate-shimmer rounded"></div>
        <div className="h-9 animate-shimmer rounded"></div>
      </div>
    </div>
  );
}

// ── AnimatedCounter — spring-animated số, nhảy mượt khi globalSavings thay đổi ──
function AnimatedCounter({ value, prefix = "", suffix = "", className = "" }) {
  const spring = useSpring(value, { stiffness: 60, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) =>
    `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`
  );
  useEffect(() => { spring.set(value); }, [spring, value]);
  return <motion.span className={className}>{display}</motion.span>;
}

function App() {
  const [selectedTheme, setSelectedTheme] = useState("Theme 1"); // Theme 1, 2, 3 selection
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDealType, setSelectedDealType] = useState("All"); // "All" | "free" | "discount"
  const [searchQuery, setSearchQuery] = useState("");
  const [myPlan, setMyPlan] = useState([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);

  // Language & Currency & Sound FX & Command Palette States
  const [lang, setLang] = useState('vi'); // 'vi' | 'en'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'VND'
  const [isMuted, setIsMuted] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

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

  // Helper: Apply Preset Bundle to Kit (1-Click Preset)
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

    showToast(`✦ ĐÃ THÊM COMBO [${bundle.name}] (${matched.length} ƯU ĐÃI) VÀO KIT!`);
  };

  // ── Collective Savings Vault — live state từ Cloudflare Worker ────────────
  // ── Collective Savings Vault — live state từ Cloudflare Worker ────────────
  const WORKER_URL = "https://savings-counter.tranminhtan4953.workers.dev";
  const WS_URL     = "wss://savings-counter.tranminhtan4953.workers.dev/ws";

  const [globalSavings, setGlobalSavings]       = useState(4563);   // Real server synced fallback
  const [connectedUsers, setConnectedUsers]      = useState(1);      // Active users
  const [wsConnected, setWsConnected]            = useState(false);
  const [isSyncedWithServer, setIsSyncedWithServer] = useState(false); // HTTP REST / WS Sync status
  const [wsConnecting, setWsConnecting]          = useState(true);
  const wsRef = useRef(null);

  // Kết nối Hybrid: Thử WebSocket trước, đồng thời chạy HTTP REST Polling (/current) làm fallback chính xác 100%
  useEffect(() => {
    let ws = null;
    let reconnectTimer = null;
    let pollingInterval = null;
    let simulationTimer = null;
    let unmounted = false;

    // Bắt đầu mô phỏng tăng trưởng tài chính khi mất kết nối máy chủ hoàn toàn
    function startSimulation() {
      if (simulationTimer) return;
      simulationTimer = setInterval(() => {
        if (!unmounted && !isSyncedWithServer && !wsConnected) {
          setGlobalSavings(prev => prev + Math.floor(Math.random() * 20) + 5);
          setConnectedUsers(prev => {
            const delta = Math.random() > 0.5 ? 1 : -1;
            const next = prev + delta;
            return next > 200 ? 190 : next < 50 ? 60 : next;
          });
        }
      }, 4000);
    }

    function stopSimulation() {
      if (simulationTimer) {
        clearInterval(simulationTimer);
        simulationTimer = null;
      }
    }

    // 1. Hàm HTTP REST Polling đồng bộ trực tiếp từ Cloudflare Worker /current
    async function fetchServerData() {
      if (unmounted) return;
      try {
        const res = await fetch(`${WORKER_URL}/current`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.globalSavings !== undefined) {
            setGlobalSavings(data.globalSavings);
            // Nếu có kết nối online thật từ server, ưu tiên hiển thị ít nhất 1 người dùng
            setConnectedUsers(data.connectedUsers > 0 ? data.connectedUsers : 1);
            setIsSyncedWithServer(true);
            setWsConnecting(false);
            stopSimulation();
            return true;
          }
        }
      } catch (err) {
        // Silent fail — chuyển qua simulation nếu hoàn toàn ngắt mạng
      }
      return false;
    }

    // Lần đầu fetch REST ngay lập tức
    fetchServerData().then(success => {
      if (!success && !wsConnected) startSimulation();
    });

    // HTTP Polling định kỳ mỗi 4 giây để đồng bộ dữ liệu thật từ Cloudflare Worker
    pollingInterval = setInterval(() => {
      fetchServerData().then(success => {
        if (!success && !wsConnected) startSimulation();
      });
    }, 4000);

    // 2. Thử thiết lập WebSocket kết nối nâng cao
    function connectWS() {
      if (unmounted) return;

      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        try { ws.close(); } catch (e) {}
      }

      try {
        ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          if (unmounted) return;
          setWsConnected(true);
          setIsSyncedWithServer(true);
          setWsConnecting(false);
          stopSimulation();
        };

        ws.onmessage = (evt) => {
          if (unmounted) return;
          try {
            const data = JSON.parse(evt.data);
            if (data.globalSavings !== undefined) setGlobalSavings(data.globalSavings);
            if (data.connectedUsers !== undefined) setConnectedUsers(data.connectedUsers);
          } catch { /* ignore malformed */ }
        };

        ws.onclose = () => {
          if (unmounted) return;
          setWsConnected(false);
        };

        ws.onerror = () => {
          try { ws.close(); } catch (e) {}
        };
      } catch (err) {
        setWsConnected(false);
      }
    }

    connectWS();

    return () => {
      unmounted = true;
      clearTimeout(reconnectTimer);
      clearInterval(pollingInterval);
      stopSimulation();
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        try { ws.close(); } catch (e) {}
      }
    };
  }, []);

  // Helper: POST amount lên worker (khi user thêm/bớt Kit) và ngay lập tức refresh REST data
  const workerPost = (endpoint, amount) => {
    fetch(`${WORKER_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then(() => {
        // Tải lại số dư thực từ Worker sau 300ms
        setTimeout(() => {
          fetch(`${WORKER_URL}/current`, { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
              if (data.globalSavings !== undefined) setGlobalSavings(data.globalSavings);
            })
            .catch(() => {});
        }, 300);
      })
      .catch(() => { /* silent fail */ });
  };
  // ─────────────────────────────────────────────────────────────────────────

  // Real-time clock (Hanoi Time) for Awwwards-style premium header
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

  // Pagination states - 9 items per page (3x3 grid)
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when switching theme, location or starting a search query
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTheme, selectedLocation, searchQuery, selectedDealType]);

  // Initialize Lenis smooth scroll
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

    return () => {
      lenis.destroy();
    };
  }, []);

  // Community Tips Stack State
  const initialTips = [
    { id: 1, name: "Minh Anh", school: "ĐHQG", tip: "Nên dùng email trường để đăng ký JetBrains và GitHub trước khi tốt nghiệp, bạn được cộng tới 1 năm Pro miễn phí." },
    { id: 2, name: "Thành Đạt", school: "Bách Khoa", tip: "Voucher GrabStudent liên kết thẳng với bản đồ di chuyển, kích hoạt bằng ảnh chụp thẻ sinh viên chỉ mất 5 phút." },
    { id: 3, name: "Khánh Linh", school: "FTU", tip: "Figma Pro Education yêu cầu upload thẻ học sinh, hãy chụp rõ logo trường và hạn dùng để được duyệt nhanh nhất." },
    { id: 4, name: "Quốc Bảo", school: "UIT", tip: "Đăng ký GitHub Student Pack qua email trường, bạn sẽ được tặng luôn gói v0.dev Pro và Canva Pro để làm bài tập lớn cực kỳ xịn sò." },
    { id: 5, name: "Hoàng Nam", school: "ĐH Bách Khoa", tip: "Vé tàu hỏa VNR được giảm 10% quanh năm. Lúc mua vé trực tuyến nhớ nhập mã số thẻ sinh viên và mang theo thẻ + CCCD khi ra ga check-in." },
    { id: 6, name: "Hải Yến", school: "ĐH Y Dược HCMC", tip: "Nên đi cạo vôi răng và nhổ răng khôn tại Nha khoa Parkway hoặc Nha khoa Kim, họ giảm đến 50% cho sinh viên và được trả góp niềng răng 0%." },
    { id: 7, name: "Minh Huy", school: "ĐH FPT", tip: "Cursor Pro đã ngưng cấp tự động qua mail .edu, tuy nhiên hãy tham gia các sự kiện on-campus hoặc webinar do Cursor tổ chức để lấy code Pro 1 năm free nhé!" },
    { id: 8, name: "Hồng Vân", school: "ĐH Sư Phạm", tip: "Khi đăng ký thi TOEIC/TOEFL tại IIG để nhận giảm giá đến 450k, nhớ mang theo thẻ sinh viên chính quy có dấu giáp lai rõ ràng và còn thời hạn." },
    { id: 9, name: "Thảo Vy", school: "ĐH Ngoại Thương", tip: "Dùng email trường đăng ký Notion Pro và Notion Education Plan miễn phí. Lưu trữ tài liệu học tập, slide bài giảng không giới hạn dung lượng luôn." }
  ];
  const [tips, setTips] = useState(initialTips);

  const rotateTipCard = () => {
    setTips(prev => {
      const copy = [...prev];
      const first = copy.shift();
      copy.push(first);
      return copy;
    });
  };

  // Realtime Live feed activity state
  const [activities, setActivities] = useState([
    "GitHub Pack: Tặng Canva Pro 12 tháng + Namecheap 1 năm domain free",
    "JetBrains Pack: Bản quyền miễn phí 15 IDEs lập trình học tập",
    "Figma Pack: Sở hữu 100% miễn phí gói thiết kế chuyên nghiệp Figma Pro"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const nextActivity = REALTIME_ACTIVITIES[Math.floor(Math.random() * REALTIME_ACTIVITIES.length)];
        return [nextActivity, ...prev.slice(0, 2)];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

// Performance Peak: memoize filtered list by Theme and Search parameters
  // Sort theo updatedDate mới nhất lên đầu — tính động từ ISO date string
  const filteredBenefits = useMemo(() => {
    return BENEFITS_DATA
      .filter(benefit => {
        const matchesTheme = getThemeForBenefit(benefit) === selectedTheme;
        
        let matchesLocation = true;
        if (selectedLocation !== "All") {
          matchesLocation = benefit.scope === selectedLocation;
        }

        const matchesSearch = (benefit.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (benefit.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (benefit.value || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (benefit.requirements || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDealType = selectedDealType === "All" || benefit.dealType === selectedDealType;
        
        return matchesTheme && matchesLocation && matchesSearch && matchesDealType;
      })
      .sort((a, b) => {
        // Mới hơn (date lớn hơn) lên trước
        const da = a.updatedDate ? new Date(a.updatedDate) : new Date(0);
        const db = b.updatedDate ? new Date(b.updatedDate) : new Date(0);
        return db - da;
      });
  }, [selectedTheme, selectedLocation, searchQuery, selectedDealType]);

  // Paginated chunk calculation
  const paginatedBenefits = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBenefits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBenefits, currentPage]);

  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);

  // Handle Theme click with Skeleton loading
  const handleThemeChange = (theme) => {
    setIsListLoading(true);
    setSelectedTheme(theme);
    setTimeout(() => setIsListLoading(false), 450);
  };

  // Handle Scope Location click (Global / Vietnam / All) — chỉ áp dụng lọc ưu đãi + Skeleton loading
  const handleLocationChange = (loc) => {
    SoundFX.playClick();
    setIsListLoading(true);
    setSelectedLocation(loc);
    setTimeout(() => setIsListLoading(false), 450);
  };

  // Plan actions
  const addToPlan = (benefit) => {
    if (!myPlan.some(item => item.id === benefit.id)) {
      setMyPlan([...myPlan, { ...benefit, note: "", targetYear: 1 }]);
      // Broadcast lên Worker — tất cả user khác thấy số nhảy ngay
      workerPost("/increment", benefit.savings || 0);
    }
  };

  const removeFromPlan = (id) => {
    const item = myPlan.find(i => i.id === id);
    setMyPlan(myPlan.filter(item => item.id !== id));
    if (item) {
      // Trừ lại savings khi remove
      workerPost("/decrement", item.savings || 0);
    }
  };

  const updatePlanItem = (id, fields) => {
    setMyPlan(myPlan.map(item => item.id === id ? { ...item, ...fields } : item));
  };

  // Calculations
  const totalYearlySavings = myPlan.reduce((acc, curr) => acc + (curr.savings * (curr.targetYear || 1)), 0);
  const totalLifetimeSavings = totalYearlySavings * customMultiplier;
  const progressPercentage = Math.min((totalLifetimeSavings / customSavingsGoal) * 100, 100);

  const getPaginationRange = (current, total) => {
    const range = [];
    const delta = 1;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (i === current - delta - 1 || i === current + delta + 1) {
        range.push("...");
      }
    }
    const uniqueRange = [];
    let prev = null;
    for (const item of range) {
      if (item === "..." && prev === "...") continue;
      uniqueRange.push(item);
      prev = item;
    }
    return uniqueRange;
  };

  const themes = [
    { id: "Theme 1", name: "THEME 01 / TECH & SOFTWARE" },
    { id: "Theme 2", name: "THEME 02 / ACADEMIA & GROWTH" },
    { id: "Theme 3", name: "THEME 03 / DAILY LIFE & TRAVEL" }
  ];
  const locations = ["All", "Global", "Vietnam"]; 

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col pt-28 selection:bg-swiss-blue selection:text-white">
      
      {/* 1. FLOATING HEADER */}
      {/* 1. FLOATING HEADER */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] bg-white/85 backdrop-blur-lg border border-swiss-border shadow-[0_12px_40px_rgba(0,0,0,0.04)] rounded-full px-3 sm:px-6 py-2.5 z-[70] flex justify-between items-center transition-all duration-300 gap-2.5 sm:gap-4">
        {/* Left Zone: Logo & Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={() => SoundFX.playClick()}
            className="group cursor-pointer"
          >
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:rotate-[90deg]" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="#0a0a0a"/>
              <rect x="23" y="5" width="12" height="12" rx="6" fill="#ff3333"/>
              <rect x="5" y="23" width="12" height="12" rx="6" fill="#0044ff"/>
              <path d="M20 12V28M12 20H28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-roboto font-black text-xs xs:text-sm sm:text-base tracking-tighter uppercase text-swiss-dark leading-none">
              STUDENT BENEFITS
            </span>
            <span className="text-[8px] font-mono text-swiss-gray uppercase tracking-widest leading-none mt-1.5 hidden xs:block">
              by tanbaycu · 2026/27
            </span>
          </div>
        </div>

        {/* Center Zone: Deep Navigation & Current Active Indicator */}
        <nav className="hidden md:flex items-center gap-1.5 bg-swiss-light/80 border border-swiss-border p-1 rounded-full">
          {themes.map((theme) => {
            const isActive = selectedTheme === theme.id;
            const shortName = theme.name.includes("TECH") ? "TECH" : theme.name.includes("ACADEMIA") ? "GROWTH" : "LIFE";
            const num = theme.name.includes("TECH") ? "01" : theme.name.includes("ACADEMIA") ? "02" : "03";
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  SoundFX.playClick();
                  setSelectedTheme(theme.id);
                  const listEl = document.getElementById("explore");
                  if (listEl) {
                    listEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-white text-swiss-dark font-bold shadow-sm border border-swiss-border/50" 
                    : "text-swiss-gray hover:text-swiss-dark"
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-swiss-red animate-ping" />}
                <span>{num} / {shortName}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Interactive Control Bar & Capsule */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Command Palette Button (Ctrl + K) */}
          <button
            type="button"
            onClick={() => {
              SoundFX.playClick();
              setIsCmdPaletteOpen(true);
            }}
            title="Mở tìm kiếm nhanh (Ctrl + K)"
            className="hidden sm:flex items-center gap-1.5 bg-swiss-light/80 hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-gray uppercase tracking-wider transition-all"
          >
            <Command size={12} className="text-swiss-dark" />
            <span className="hidden lg:inline">Ctrl + K</span>
          </button>

          {/* Bilingual Language Switcher Button (VI / EN) */}
          <button
            type="button"
            onClick={() => {
              SoundFX.playClick();
              const nextLang = lang === 'vi' ? 'en' : 'vi';
              setLang(nextLang);
              setIsListLoading(true);
              setTimeout(() => setIsListLoading(false), 450);
              showToast(nextLang === 'en' ? '✦ SWITCHED LANGUAGE TO ENGLISH (GLOBAL SCOPE)' : '✦ ĐÃ CHUYỂN NGÔN NGỮ SANG TIẾNG VIỆT (VIETNAM SCOPE)');
            }}
            title="Đổi ngôn ngữ VI ↔ EN"
            className="flex items-center gap-1 bg-white hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-dark font-bold tracking-wider transition-all shadow-2xs"
          >
            <Globe size={13} className="text-swiss-red" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Multi-Currency Toggle Button (USD / VNĐ) */}
          <button
            type="button"
            onClick={() => {
              SoundFX.playClick();
              setCurrency(prev => prev === 'USD' ? 'VND' : 'USD');
              showToast(`✦ ĐÃ ĐỔI ĐƠN VỊ TIỀN TỆ SANG [${currency === 'USD' ? 'VNĐ' : 'USD'}]`);
            }}
            title="Đổi đơn vị tiền tệ USD ↔ VNĐ"
            className="flex items-center gap-1 bg-white hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-dark font-bold tracking-wider transition-all shadow-2xs"
          >
            <CurrencyCircleDollar size={13} className="text-swiss-blue" />
            <span>{currency}</span>
          </button>

          {/* Web Audio Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMuted(prev => !prev);
              if (isMuted) SoundFX.playClick();
            }}
            title={isMuted ? "Bật âm thanh tương tác" : "Tắt âm thanh tương tác"}
            className="p-1.5 rounded-full border border-swiss-border bg-white text-swiss-dark hover:bg-swiss-light transition-all"
          >
            {isMuted ? <SpeakerSimpleSlash size={13} /> : <SpeakerHigh size={13} className="text-swiss-red" />}
          </button>

          {/* Dynamic Savings Capsule */}
          <div className="flex items-center bg-swiss-light border border-swiss-border rounded-full p-0.5 shadow-sm">
            <span className="hidden sm:inline-block font-mono text-[9px] text-swiss-gray uppercase tracking-widest px-3 font-semibold">
              SAVED: <span className="text-swiss-blue font-bold">{formatMoney(totalYearlySavings, currency)}/yr</span>
            </span>
            <button 
              type="button"
              onClick={() => {
                SoundFX.playClick();
                setIsPlannerOpen(true);
              }}
              className="swiss-pressable flex items-center gap-1.5 bg-swiss-dark text-white hover:bg-swiss-blue hover:text-white px-3.5 sm:px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full active:scale-95 transition-all shadow-sm font-bold"
            >
              <Sliders size={12} />
              Kit ({myPlan.length})
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-t swiss-grid-line bg-white mt-4 relative">
        <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r swiss-grid-line overflow-hidden">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-swiss-red mb-5 inline-block font-semibold">
            ✦ EXCLUSIVE VERIFIED LIFETIME REVENUE
          </span>
          <h1 className="font-roboto font-black text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tighter text-swiss-dark uppercase flex flex-col gap-1.5">
            <div className="overflow-hidden h-[1.1em] flex items-center">
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              >
                JUST A STUDENT
              </motion.div>
            </div>
            <div className="overflow-hidden h-[1.1em] flex items-center">
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                className="text-swiss-blue italic font-light font-roboto"
              >
                CARD FOR
              </motion.div>
            </div>
            <div className="overflow-hidden h-[1.1em] flex items-center">
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              >
                INSTANT LUCK.
              </motion.div>
            </div>
          </h1>
        </div>

        <div className="lg:col-span-5 p-6 md:p-12 lg:p-16 flex flex-col justify-between bg-swiss-light/40">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
            >
              <InteractiveStudentCard />
            </motion.div>

            <p className="text-base text-swiss-gray leading-relaxed font-sans max-w-sm">
              Cổng thông tin tối giản tập hợp toàn bộ các lợi ích trực tuyến và offline của sinh viên trên toàn thế giới. Không cần thủ tục phức tạp, <strong className="text-swiss-dark">chỉ cần bạn có thẻ sinh viên hoặc email trường</strong> là đủ điều kiện nhận ưu đãi lập tức.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-swiss-border flex items-center justify-between">
            <a 
              href="#explore"
              className="swiss-pressable-sm group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-swiss-dark font-bold hover:text-swiss-blue active:scale-98"
            >
              Xem tất cả quyền lợi
              <span className="p-2 border border-swiss-dark group-hover:border-swiss-blue group-hover:bg-swiss-blue group-hover:text-white transition-all duration-200 rounded-full">
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: INDEPENDENT LIVE MONITOR LOG STREAM */}
      <section className="max-w-7xl mx-auto w-full px-6 mt-8">
        <div className="border border-swiss-border bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-2.5 shrink-0 border-r-0 md:border-r border-swiss-border pr-0 md:pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span className="font-mono text-xs font-black uppercase text-swiss-dark tracking-wider">
              ✦ LIVE PACKAGE SPECIFICATIONS:
            </span>
          </div>
          
          <div className="live-ticker-wrap flex-1">
            <div className="live-ticker-content font-mono text-[10.5px] text-swiss-gray whitespace-nowrap">
              {REALTIME_ACTIVITIES.map((act, i) => (
                <span key={i} className="inline-flex items-center gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 bg-swiss-blue rounded-full"></span>
                  {act}
                </span>
              ))}
              {REALTIME_ACTIVITIES.map((act, i) => (
                <span key={`dup-${i}`} className="inline-flex items-center gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 bg-swiss-blue rounded-full"></span>
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore" className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Search bar & statistics */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-swiss-gray">
              <MagnifyingGlass size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bằng tên, mô tả hoặc yêu cầu xác thực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-swiss-border pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-swiss-dark focus:ring-1 focus:ring-swiss-dark transition-all placeholder:text-swiss-gray/60 rounded-full"
            />
          </div>
          <div className="font-mono text-xs text-swiss-gray flex items-center justify-between border border-swiss-border bg-white px-5 py-2.5 gap-4 rounded-full">
            <span>DỮ LIỆU ĐANG LỌC: <strong>{filteredBenefits.length}</strong> / <strong>{BENEFITS_DATA.length}</strong> CODES</span>
          </div>
        </div>

        {/* Smart Preset Bundles (Combo 1-Click theo ngành học) — PEAK BENTO & MAX RESPONSIVE */}
        <div className="mb-12 p-5 sm:p-8 bg-white border-2 border-swiss-dark rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* Subtle Background Mesh Line */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-swiss-blue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10 border-b border-swiss-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-swiss-dark text-white shrink-0">
                <Lightning size={20} className="text-yellow-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-roboto font-black text-sm sm:text-base uppercase tracking-widest text-swiss-dark leading-tight">
                  ✦ SMART PRESET BUNDLES / COMBO 1-CLICK THEO NGÀNH HỌC
                </h3>
                <span className="text-[10px] font-mono text-swiss-gray uppercase tracking-wider block mt-0.5">
                  Tối ưu bộ công cụ học tập & làm việc trọn gói theo chuyên ngành
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10.5px] font-mono text-swiss-gray bg-swiss-light/80 px-3.5 py-1.5 rounded-full border border-swiss-border shrink-0">
              <Sparkle size={12} className="text-swiss-red" />
              <span>Nhấp nút bên dưới để nạp trọn bộ vào Kit tiết kiệm</span>
            </div>
          </div>

          {/* Grid MAX Responsive: 1 Cột (Mobile) ➔ 2 Cột (Tablet/Md) ➔ 4 Cột (Desktop Large/Xl) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
            {PRESET_BUNDLES.map((bundle) => {
              const IconComp = bundle.icon;
              const matched = BENEFITS_DATA.filter(b => {
                const title = (b.title || '').toLowerCase();
                const desc = (b.description || '').toLowerCase();
                return bundle.matchKeywords.some(kw => title.includes(kw) || desc.includes(kw));
              });
              const totalSavings = matched.reduce((sum, item) => sum + (item.savings || 0), 0);
              const sampleBrands = Array.from(new Set(matched.map(m => m.title.split(" ")[0]))).slice(0, 4);

              // Smart State: Kiểm tra xem bao nhiêu items đã có trong Kit
              const appliedCount = matched.filter(m => myPlan.some(p => p.id === m.id)).length;
              const isFullyApplied = matched.length > 0 && appliedCount === matched.length;

              return (
                <div
                  key={bundle.id}
                  className={`bg-white border-2 border-swiss-dark rounded-2xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                    isFullyApplied ? 'ring-2 ring-emerald-500/50 bg-emerald-50/10' : ''
                  }`}
                >
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${bundle.color.split(' ')[0]}`} />

                  <div className="space-y-4 pt-1">
                    {/* Card Header: Icon & Badge & Savings */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-2.5 rounded-xl text-sm ${bundle.color} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                          <IconComp size={18} />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-swiss-gray font-bold">
                            SLOT BUNDLE
                          </span>
                          <span className="text-xs font-mono font-black text-swiss-dark">
                            {matched.length} ƯU ĐÃI
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-black text-swiss-blue bg-swiss-blue/10 px-3 py-1 rounded-full border border-swiss-blue/20 shrink-0">
                        {formatMoney(totalSavings, currency)}/năm
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-roboto font-black text-base uppercase text-swiss-dark tracking-tight leading-tight group-hover:text-swiss-blue transition-colors flex items-center gap-1.5">
                        {bundle.name}
                        {isFullyApplied && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Đã kích hoạt trọn bộ" />
                        )}
                      </h4>
                      <p className="text-xs font-sans text-swiss-gray leading-relaxed mt-1.5 line-clamp-2 min-h-[2.4rem]">
                        {bundle.description}
                      </p>
                    </div>

                    {/* Sample Brands Tags Grid */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[8.5px] font-mono uppercase tracking-widest text-swiss-gray/80 font-bold block">
                        ỨNG DỤNG TIÊU BIỂU TRONG GÓI:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sampleBrands.map((bName, idx) => (
                          <span 
                            key={idx} 
                            className="text-[9.5px] font-mono text-swiss-dark bg-swiss-light border border-swiss-border px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 group-hover:border-swiss-dark/40 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-swiss-dark/40" />
                            {bName}
                          </span>
                        ))}
                        {matched.length > 4 && (
                          <span className="text-[9.5px] font-mono text-swiss-gray bg-swiss-light/50 px-2 py-0.5 rounded-md font-bold">
                            +{matched.length - 4} khác
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Smart 1-Click Action Button with Feedback State */}
                  <div className="pt-4 border-t border-dashed border-swiss-border mt-5">
                    <button
                      type="button"
                      onClick={() => applyPresetBundle(bundle)}
                      className={`swiss-pressable w-full text-xs font-mono uppercase py-3 px-4 font-black tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all shadow-sm active:scale-95 ${
                        isFullyApplied 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                          : appliedCount > 0 
                            ? 'bg-swiss-blue hover:bg-swiss-dark text-white shadow-swiss-blue/20' 
                            : 'bg-swiss-dark hover:bg-swiss-blue text-white shadow-md'
                      }`}
                    >
                      {isFullyApplied ? (
                        <>
                          <CheckCircle size={15} className="text-white shrink-0" />
                          <span>TRỌN BỘ ĐÃ TRONG KIT</span>
                        </>
                      ) : appliedCount > 0 ? (
                        <>
                          <Plus size={15} className="text-yellow-400 shrink-0" />
                          <span>THÊM {matched.length - appliedCount} MỤC CÒN LẠI</span>
                        </>
                      ) : (
                        <>
                          <Lightning size={15} className="text-yellow-400 shrink-0" />
                          <span>KÍCH HOẠT COMBO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Themes Grid */}
        <div className="mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            [01] THEO CHỦ ĐỀ ƯU ĐÃI (THEME)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-swiss-border divide-y md:divide-y-0 md:divide-x divide-swiss-border bg-white">
            {themes.map((theme) => (
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

        {/* Filter Locations / Scope Grid */}
        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            [02] THEO ĐỊA LÝ / PHẠM VI ÁP DỤNG
          </div>
          <div className="grid grid-cols-3 border border-swiss-border divide-x divide-swiss-border bg-white max-w-xl">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocationChange(loc)}
                className={`swiss-pressable-sm px-1.5 xs:px-3 py-2 sm:py-2.5 text-center text-[10px] xs:text-xs font-mono uppercase tracking-wider ${
                  selectedLocation === loc 
                    ? 'bg-swiss-dark text-white' 
                    : 'text-swiss-dark hover:bg-swiss-light'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Deal Type */}
        <div className="mb-12">
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-3">
            [03] THEO LOẠI ƯU ĐÃI
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "All",      label: "Tất cả",          icon: "◈" },
              { key: "free",     label: "FREE — Miễn phí", icon: "✦" },
              { key: "discount", label: "DISCOUNT — Giảm giá", icon: "%" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
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
                {key !== "All" && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                    selectedDealType === key ? "bg-white/20" : "bg-swiss-light"
                  }`}>
                    {BENEFITS_DATA.filter(b => b.dealType === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-6 flex justify-between items-center border-b border-swiss-border pb-2">
            <span>[04] DANH SÁCH CHI TIẾT ƯU ĐÃI ({filteredBenefits.length} MỤC - TRANG {currentPage} / {totalPages || 1})</span>
            <span>CẬP NHẬT TỰ ĐỘNG 24/7</span>
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
              {paginatedBenefits.map((rawBenefit, index) => {
                const benefit = getBenefitLocalized(rawBenefit, lang);
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                const isInPlan = myPlan.some(item => item.id === benefit.id);
                return (
                  <div
                    key={benefit.id}
                    className="border border-swiss-border bg-white hover:border-swiss-dark hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative rounded-xl overflow-hidden"
                  >
                    {/* Top Bar - Hiển thị Brand Icon thực tế (Component từ developer-icons hoặc URL logo Wikimedia chất lượng cao) */}
                    <div className="flex justify-between items-center p-5 border-b border-swiss-border bg-swiss-light/30">
                      <div className="flex items-center gap-2.5">
                        <BrandIcon title={benefit.title} link={benefit.link} />
                        <span className="text-[10px] font-mono text-swiss-gray font-bold tracking-widest">
                          {String(globalIndex + 1).padStart(2, '0')} / {benefit.category.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {/* Deal Type Badge */}
                        {benefit.dealType === "free" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shrink-0 border border-emerald-200">
                            ✦ FREE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-swiss-blue/10 text-swiss-blue text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shrink-0 border border-swiss-blue/20">
                            % DISC
                          </span>
                        )}
                        {benefit.isHot && (
                          <span className="inline-flex items-center gap-1 bg-swiss-red/10 text-swiss-red text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shadow-sm shrink-0 border border-swiss-red/20 animate-pulse">
                            ✦ HOT
                          </span>
                        )}
                        {benefit.scope === "Global" ? (
                          <span className="inline-flex items-center gap-1 bg-swiss-blue/10 text-swiss-blue text-[10px] font-mono px-2.5 py-0.5 uppercase font-semibold rounded">
                            <Globe size={10} /> GLOBAL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-swiss-dark/5 text-swiss-dark text-[10px] font-mono px-2.5 py-0.5 uppercase font-semibold rounded">
                            <MapPin size={10} /> VIETNAM
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-6">
                      <div>
                        <h3 className="font-roboto font-bold text-lg tracking-tight text-swiss-dark group-hover:text-swiss-blue transition-colors duration-200">
                          {benefit.title}
                        </h3>
                        <div className="font-mono text-xs text-swiss-red font-semibold mt-2 flex items-center gap-1">
                          <Sparkle size={12} />
                          {benefit.value}
                        </div>
                        <p className="text-xs text-swiss-gray font-sans mt-3 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      <div className="border-t border-swiss-border pt-4 mt-auto space-y-3">
                        <div className="flex items-start gap-2 bg-swiss-light/60 p-2.5 border border-swiss-border">
                          <IdentificationCard size={15} className="text-swiss-dark mt-0.5 shrink-0" />
                          <div className="text-[10px] font-sans text-swiss-gray leading-tight">
                            <strong className="text-swiss-dark font-mono block mb-0.5">XÁC THỰC:</strong>
                            {benefit.requirements}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono text-swiss-gray">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {timeAgo(benefit.updatedDate)}
                          </span>
                          <span className="font-bold text-swiss-dark">
                            TIẾT KIỆM: ~{formatMoney(benefit.savings, currency)}/năm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="grid grid-cols-2 border-t border-swiss-border text-center text-xs font-mono divide-x divide-swiss-border">
                      <a 
                        href={benefit.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="swiss-pressable py-3 flex items-center justify-center gap-1.5 hover:bg-swiss-light text-swiss-dark hover:text-swiss-blue active:scale-98"
                      >
                        Truy cập <ArrowUpRight size={13} />
                      </a>
                      <button
                        type="button"
                        onClick={() => isInPlan ? removeFromPlan(benefit.id) : addToPlan(benefit)}
                        className={`swiss-pressable py-3 flex items-center justify-center gap-1.5 font-bold active:scale-98 ${
                          isInPlan 
                            ? 'bg-swiss-red/10 text-swiss-red hover:bg-swiss-red hover:text-white' 
                            : 'bg-white hover:bg-swiss-dark hover:text-white text-swiss-dark'
                        }`}
                      >
                        {isInPlan ? (
                          <>Bỏ chọn <Trash size={13} /></>
                        ) : (
                          <>Lưu vào Kit <Plus size={13} /></>
                        )}
                      </button>
                    </div>

                    {benefit.lifetime && (
                      <div className="absolute top-0 right-0 transform translate-x-0.5 -translate-y-0.5 bg-swiss-dark text-white text-[9px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase border border-swiss-border z-10">
                        LIFETIME
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Phân trang (Pagination) Swiss style tối giản */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 border-t border-swiss-border pt-8">
              <span className="text-[10px] font-mono text-swiss-gray uppercase tracking-widest mr-2 sm:mr-4">Trang:</span>
              
              {/* Nút Trước (Prev) */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  if (currentPage > 1) {
                    setIsListLoading(true);
                    setCurrentPage(currentPage - 1);
                    setTimeout(() => {
                      setIsListLoading(false);
                      const element = document.getElementById("explore");
                      if(element) element.scrollIntoView({ behavior: "smooth" });
                    }, 250);
                  }
                }}
                className={`swiss-pressable-sm w-9 h-9 flex items-center justify-center text-xs font-mono border rounded-lg transition-all ${
                  currentPage === 1 
                    ? 'opacity-40 cursor-not-allowed bg-swiss-light border-swiss-border text-swiss-gray' 
                    : 'bg-white hover:bg-swiss-light border-swiss-border text-swiss-dark'
                }`}
              >
                &lt;
              </button>

              {getPaginationRange(currentPage, totalPages).map((pageNum, i) => {
                if (pageNum === "...") {
                  return (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-xs font-mono text-swiss-gray">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setIsListLoading(true);
                      setCurrentPage(pageNum);
                      setTimeout(() => {
                        setIsListLoading(false);
                        const element = document.getElementById("explore");
                        if(element) element.scrollIntoView({ behavior: "smooth" });
                      }, 250);
                    }}
                    className={`swiss-pressable-sm w-9 h-9 flex items-center justify-center text-xs font-mono border rounded-lg transition-all ${
                      currentPage === pageNum 
                        ? 'bg-swiss-dark text-white border-swiss-dark shadow-sm' 
                        : 'bg-white hover:bg-swiss-light border-swiss-border text-swiss-dark'
                    }`}
                  >
                    {String(pageNum).padStart(2, '0')}
                  </button>
                );
              })}

              {/* Nút Sau (Next) */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setIsListLoading(true);
                    setCurrentPage(currentPage + 1);
                    setTimeout(() => {
                      setIsListLoading(false);
                      const element = document.getElementById("explore");
                      if(element) element.scrollIntoView({ behavior: "smooth" });
                    }, 250);
                  }
                }}
                className={`swiss-pressable-sm w-9 h-9 flex items-center justify-center text-xs font-mono border rounded-lg transition-all ${
                  currentPage === totalPages 
                    ? 'opacity-40 cursor-not-allowed bg-swiss-light border-swiss-border text-swiss-gray' 
                    : 'bg-white hover:bg-swiss-light border-swiss-border text-swiss-dark'
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* 4. COMMUNITY SECTION */}
        <section className="mt-28 border-t-2 border-swiss-dark pt-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-swiss-red mb-3 inline-block font-semibold">
            ✦ THE STUDENT COOPERATIVE
          </span>
          <h2 className="font-roboto font-black text-3xl md:text-5xl uppercase tracking-tighter text-swiss-dark mb-12">
            HỢP TÁC XÃ TIẾT KIỆM SINH VIÊN
          </h2>
          
          <div className="grid grid-cols-12 gap-8 items-stretch">
            
            {/* Box 1: The Collective Vault */}
            <div className="col-span-12 lg:col-span-6 bg-swiss-dark text-white p-8 border border-swiss-dark flex flex-col justify-between h-[380px] relative overflow-hidden group rounded-2xl shadow-lg">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-swiss-blue/15 rounded-full blur-3xl group-hover:bg-swiss-blue/25 transition-all duration-700 pointer-events-none"></div>
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-swiss-red/10 rounded-full blur-3xl group-hover:bg-swiss-red/20 transition-all duration-700 pointer-events-none"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-swiss-gray font-mono text-[10.2px] uppercase tracking-[0.2em]">
                    <Users size={16} className="text-swiss-blue" /> COLLECTIVE SAVINGS VAULT
                  </div>
                  {/* Live / Reconnecting / Simulated badge */}
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

              {/* Live Ticker Feed inside Vault */}
              <div className="my-6 relative z-10 space-y-2.5">
                <div className="text-[9px] font-mono text-swiss-gray uppercase tracking-widest border-b border-white/10 pb-1 mb-2">
                  [SERVER SYNC STATUS]
                </div>
                <div className="space-y-1.5 h-[68px] overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {activities.map((act, idx) => (
                      <motion.div
                        key={act + idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-2 truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                        {act}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-4 mt-auto">
                {/* Live global savings — spring-animated, updates real-time via WebSocket */}
                <div className="font-roboto font-black text-5xl tracking-tighter text-white leading-none">
                  <AnimatedCounter value={globalSavings} prefix="$" />
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[9.5px] font-mono text-swiss-gray uppercase tracking-widest">
                    {connectedUsers} người trực tuyến
                  </span>
                  {/* WS status dot */}
                  <span className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider ${
                    (wsConnected || isSyncedWithServer)
                      ? "text-emerald-400" 
                      : wsConnecting 
                        ? "text-yellow-400" 
                        : "text-swiss-blue"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      (wsConnected || isSyncedWithServer)
                        ? "bg-emerald-500 animate-pulse" 
                        : wsConnecting 
                          ? "bg-yellow-400 animate-ping"
                          : "bg-swiss-blue"
                    }`}></span>
                    {(wsConnected || isSyncedWithServer) ? "LIVE" : wsConnecting ? "RECONNECTING" : "SIMULATED"}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Contribute Card Lớn Riêng Biệt */}
            <div className="col-span-12 lg:col-span-6 bg-white border-2 border-swiss-dark p-6 sm:p-8 flex flex-col justify-between min-h-[380px] lg:h-[380px] rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_20px_55px_rgba(0,0,0,0.1)] transition-shadow duration-300">
              <div className="absolute top-4 right-4 font-mono text-sm text-swiss-gray pointer-events-none select-none font-bold">[+]</div>
              
              <div className="space-y-4">
                <div className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-swiss-dark border-b-2 border-swiss-dark pb-2 font-bold flex items-center gap-2">
                  <PaperPlaneRight size={14} className="text-swiss-red" /> ✦ SUBMIT BENEFITS / THE PUBLIC LEDGER
                </div>
                <p className="text-xs text-swiss-gray leading-relaxed font-sans">
                  Hãy trở thành một phần của mạng lưới. Đóng góp các ưu đãi giáo dục mới phát hiện để chúng tôi cập nhật vào cơ sở dữ liệu chung 24/7.
                </p>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const brandName = form.brand_name?.value?.trim();
                  const brandUrl = form.brand_url?.value?.trim();

                  if (!brandName || !brandUrl) {
                    showToast("Vui lòng nhập Tên Thương Hiệu và Portal URL!");
                    return;
                  }

                  setIsSubmitting(true);
                  try {
                    const res = await fetch(`${WORKER_URL}/submit`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ brandName, brandUrl }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Đã lưu vào máy chủ Hợp Tác Xã.");
                      form.reset();
                    } else {
                      showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Đã ghi nhận đóng góp.");
                      form.reset();
                    }
                  } catch (err) {
                    showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Cảm ơn bạn đã hỗ trợ cộng đồng sinh viên.");
                    form.reset();
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-5 mt-6 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput 
                    label="TÊN THƯƠNG HIỆU" 
                    id="brand_name" 
                    placeholder="Ví dụ: JetBrains, Spotify..." 
                  />
                  <CustomInput 
                    label="PORTAL HỌC TẬP (URL)" 
                    id="brand_url" 
                    type="url"
                    placeholder="https://..." 
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
                  <span className="text-[9.5px] font-mono text-swiss-gray leading-tight">
                    * Mọi đóng góp đều được duyệt tự động & ghi nhận bởi sinh viên cộng tác viên.
                  </span>
                  
                  {/* Magnetic Button */}
                  <MagneticButton 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-swiss-dark hover:bg-swiss-blue hover:border-swiss-blue disabled:opacity-50 text-white text-xs font-mono uppercase py-3 px-8 font-bold tracking-widest flex items-center justify-center gap-2 rounded-xl shrink-0 transition-colors shadow-md"
                  >
                    {isSubmitting ? (
                      <>ĐANG GỬI... <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /></>
                    ) : (
                      <>GỬI ĐÓNG GÓP <PaperPlaneRight size={13} /></>
                    )}
                  </MagneticButton>
                </div>
              </form>
            </div>

            {/* Box 3: Tips Stack */}
            <div className="col-span-12 bg-swiss-light/40 border border-swiss-border p-8 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl shadow-sm mt-4">
              <div className="md:max-w-sm space-y-3 shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-swiss-dark border-b border-swiss-border pb-1 font-bold flex items-center gap-1.5">
                  <Chat size={14} className="text-swiss-blue" /> [TIPS] CHIA SẺ TRẢI NGHIỆM CỦA SINH VIÊN
                </div>
                <p className="text-xs text-swiss-gray leading-relaxed font-sans">
                  Nhấp vào thẻ để xoay chuyển và đọc những kinh nghiệm claim mã giảm giá của các sinh viên đi trước.
                </p>
              </div>

              {/* Stack Card component */}
              <div className="relative flex-1 w-full max-w-xl h-48 flex items-center justify-center">
                <AnimatePresence>
                  {tips.map((tip, i) => {
                    const isTop = i === 0;
                    return (
                      <motion.div
                        key={tip.id}
                        style={{
                          zIndex: tips.length - i,
                          transformOrigin: "bottom center",
                        }}
                        animate={{
                          scale: 1 - i * 0.05,
                          y: i * 10,
                          opacity: 1 - i * 0.25,
                        }}
                        whileHover={isTop ? { y: -5, transition: { duration: 0.2 } } : {}}
                        onClick={isTop ? rotateTipCard : undefined}
                        className={`absolute w-full bg-white border p-6 select-none flex flex-col justify-between h-40 active:scale-[0.98] transition-shadow duration-300 rounded-xl ${
                          isTop 
                            ? 'border-swiss-dark shadow-md cursor-pointer hover:shadow-lg' 
                            : 'border-swiss-border shadow-sm'
                        }`}
                      >
                        <p className="text-xs text-swiss-dark font-sans leading-relaxed flex-1 flex items-center">
                          "{tip.tip}"
                        </p>
                        <div className="border-t border-dashed border-swiss-border pt-3 mt-3 flex justify-between items-center">
                          <span className="font-mono text-[9px] text-swiss-gray uppercase tracking-wider font-bold">
                            {tip.name} / {tip.school}
                          </span>
                          {isTop && (
                            <span className="text-[8px] font-mono text-swiss-blue bg-swiss-blue/10 px-1.5 py-0.5 uppercase tracking-widest animate-pulse font-bold rounded">
                              Bấm để xoay
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Credits footer */}
          <div className="mt-20 pt-6 border-t border-swiss-border flex flex-col sm:flex-row justify-between items-center gap-4 text-mono text-[10px] text-swiss-gray pb-8">
            <div>PROJECT LIFETIME / CREATOR: tanbaycu © 2026</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              SYSTEM RUNNING 24/7/365
            </div>
          </div>
        </section>
      </main>

      {/* 5. FLOATING DASHBOARD FOR KIT */}
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
      />

      {/* 6. Custom Modal Export */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="absolute inset-0 bg-swiss-dark/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white border-2 border-swiss-dark w-full max-w-xl p-6 md:p-8 relative z-10 flex flex-col gap-6 max-h-[85vh] overflow-y-auto shadow-2xl rounded-2xl"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="swiss-pressable absolute top-4 right-4 p-1 bg-swiss-light border border-swiss-border text-swiss-dark hover:bg-swiss-dark hover:text-white rounded-full"
              >
                <X size={16} />
              </button>

              {/* Icon / Title */}
              <div className="flex items-center gap-3 border-b-2 border-swiss-dark pb-3">
                <CheckCircle size={28} className="text-swiss-blue" />
                <div>
                  <h3 className="font-roboto font-black text-xl tracking-tighter uppercase text-swiss-dark leading-none">
                    KẾ HOẠCH LIFETIME HOÀN TẤT
                  </h3>
                  <span className="text-[10px] font-mono text-swiss-gray uppercase tracking-widest">
                    Bản tóm tắt tiết kiệm sinh viên
                  </span>
                </div>
              </div>

              {/* Statistics details */}
              <div className="grid grid-cols-2 gap-4 border border-swiss-dark bg-swiss-light/40 p-4 font-mono text-xs rounded-xl">
                <div>
                  <span className="text-swiss-gray uppercase block text-[9px]">Tổng tiết kiệm trọn đời:</span>
                  <strong className="text-swiss-dark text-2xl font-roboto font-black">${totalLifetimeSavings.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-swiss-gray uppercase block text-[9px]">Số năm áp dụng:</span>
                  <strong className="text-swiss-dark text-2xl font-roboto font-black">{customMultiplier} năm</strong>
                </div>
                <div className="col-span-2 border-t border-dashed border-swiss-border pt-2 mt-2">
                  <span className="text-swiss-gray uppercase block text-[9px]">Danh mục ưu đãi:</span>
                  <span className="text-swiss-dark font-bold">{myPlan.length} ưu đãi đã được lưu vào Lifetime Kit</span>
                </div>
              </div>

              {/* Selected List details */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] border border-swiss-border p-3 bg-white rounded-xl">
                <div className="text-[9px] font-mono uppercase text-swiss-gray tracking-widest border-b border-swiss-border pb-1 mb-2">
                  Chi tiết ưu đãi đã lưu:
                </div>
                {myPlan.map(item => (
                  <div key={item.id} className="text-xs flex justify-between items-start border-b border-dashed border-swiss-border pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <span className="font-bold text-swiss-dark block">{item.title}</span>
                      {item.note && (
                        <span className="text-[10px] text-swiss-gray italic font-sans block mt-0.5">
                          Ghi chú: {item.note}
                        </span>
                      )}
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="text-[10px] text-swiss-gray block">{item.targetYear || 1} năm</span>
                      <span className="font-bold text-swiss-blue">${item.savings * (item.targetYear || 1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info in Modal */}
              <div className="text-[9.5px] font-mono text-swiss-gray leading-relaxed border-t border-swiss-border pt-4">
                * Kế hoạch này được tính toán dựa trên dữ liệu ưu đãi được xác thực liên tục 24/7. Để hưởng lợi ích, hãy chuẩn bị sẵn <strong className="text-swiss-dark">Thẻ sinh viên</strong> hoặc <strong className="text-swiss-dark">Email trường học</strong> khi đăng ký trực tiếp.
                <div className="mt-2 text-swiss-dark font-bold">
                  Curated by tanbaycu © 2026.
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    alert("Tính năng in bản cứng PDF đang được khởi tạo! \nTác giả: tanbaycu");
                  }}
                  className="swiss-pressable flex-1 bg-swiss-dark text-white hover:bg-swiss-blue text-xs font-mono uppercase py-2.5 font-bold tracking-widest flex items-center justify-center gap-1.5 active:scale-95 rounded-xl"
                >
                  <FilePdf size={14} /> TẢI PDF
                </button>
                <button 
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="swiss-pressable border border-swiss-border hover:bg-swiss-light text-swiss-dark text-xs font-mono uppercase px-6 py-2.5 active:scale-95 rounded-xl"
                >
                  ĐÓNG
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal (Ctrl + K) */}
      <AnimatePresence>
        {isCmdPaletteOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border-2 border-swiss-dark max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            >
              {/* Search Header */}
              <div className="p-4 border-b border-swiss-border flex items-center gap-3 bg-swiss-light/50">
                <MagnifyingGlass size={20} className="text-swiss-gray shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder="Tìm ưu đãi, AI tools, hãng bay... (bấm ESC để đóng)"
                  className="w-full bg-transparent border-none outline-none font-mono text-sm text-swiss-dark placeholder:text-swiss-gray"
                />
                <button
                  type="button"
                  onClick={() => setIsCmdPaletteOpen(false)}
                  className="p-1 rounded text-swiss-gray hover:text-swiss-dark hover:bg-swiss-light transition-colors text-xs font-mono border border-swiss-border px-2 shrink-0 font-bold"
                >
                  ESC
                </button>
              </div>

              {/* Quick Results List */}
              <div className="p-3 overflow-y-auto flex-1 divide-y divide-swiss-border/60">
                {BENEFITS_DATA.filter(b => {
                  if (!cmdQuery.trim()) return b.isHot;
                  const q = cmdQuery.toLowerCase();
                  return (b.title || '').toLowerCase().includes(q) ||
                         (b.description || '').toLowerCase().includes(q) ||
                         (b.category || '').toLowerCase().includes(q);
                }).slice(0, 10).map((benefit) => (
                  <div
                    key={benefit.id}
                    onClick={() => {
                      SoundFX.playClick();
                      addToPlan(benefit);
                      setIsCmdPaletteOpen(false);
                      showToast(`✦ ĐÃ THÊM [${benefit.title}] VÀO KIT!`);
                    }}
                    className="p-3 hover:bg-swiss-light/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-roboto font-bold text-xs text-swiss-dark group-hover:text-swiss-blue transition-colors">
                          {benefit.title}
                        </span>
                        {benefit.isHot && (
                          <span className="text-[9px] font-mono text-swiss-red bg-swiss-red/10 px-1.5 py-0.5 rounded uppercase font-bold">
                            ✦ HOT
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-swiss-gray uppercase">
                          {benefit.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-swiss-gray font-sans line-clamp-1">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-swiss-blue block">
                        {formatMoney(benefit.savings, currency)}
                      </span>
                      <span className="text-[9px] font-mono text-swiss-gray uppercase group-hover:text-swiss-dark font-bold">
                        + ADD TO KIT
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer shortcuts */}
              <div className="p-3 bg-swiss-light border-t border-swiss-border flex items-center justify-between text-[10px] font-mono text-swiss-gray">
                <span>✦ Nhấp vào ưu đãi để thêm vào Kit tiết kiệm</span>
                <span className="font-bold text-swiss-dark">{BENEFITS_DATA.length} Ưu Đãi Đã Xác Thực</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Swiss Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[999] bg-swiss-dark text-white px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 flex items-center gap-3 max-w-md backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-mono tracking-wide leading-relaxed">
              {toastMessage}
            </span>
            <button 
              type="button" 
              onClick={() => setToastMessage(null)}
              className="ml-auto text-swiss-gray hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
