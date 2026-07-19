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

// Hàm tính "X ngày trước" động (hỗ trợ Song Ngữ VI / EN)
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

// Helper tự động chuyển đổi 100% thông tin thẻ ưu đãi sang Tiếng Anh khi lang === 'en'
export function getBenefitLocalized(benefit, lang = 'vi') {
  if (!benefit) return benefit;
  if (lang !== 'en') return benefit;

  // Title
  const title = benefit.titleEn || benefit.title;

  // Value translation map
  let value = benefit.valueEn || benefit.value;
  if (!benefit.valueEn && value) {
    value = value
      .replace(/Miễn phí bản quyền/gi, 'Free Educational License')
      .replace(/Bản quyền SOLIDWORKS Design Standard/gi, 'SOLIDWORKS Design Standard License')
      .replace(/Ưu đãi nâng cấp Cursor Pro qua sự kiện trường học/gi, 'Cursor Pro Free Upgrade via School Events')
      .replace(/Quyền truy cập tổ chức đại học \(GPT-4o\)/gi, 'University Org Access (GPT-4o)')
      .replace(/Quyền truy cập tổ chức đại học/gi, 'University Organization Access')
      .replace(/Ưu đãi discount 60%/gi, '60% Off Student Discount')
      .replace(/Tài khoản Pro Free 100%/gi, '100% Free Pro Account')
      .replace(/Free Developer Tools & Copilot/gi, 'Free Developer Tools & Copilot')
      .replace(/miễn phí/gi, 'Free')
      .replace(/gia hạn hàng năm/gi, 'annual renewal')
      .replace(/1 năm/gi, '1 Year')
      .replace(/12 tháng/gi, '12 Months')
      .replace(/học bổng/gi, 'scholarship')
      .replace(/giảm giá/gi, 'discount')
      .replace(/triệu VNĐ/gi, 'M VND')
      .replace(/tháng/gi, 'month');
  }

  // Description translation map
  let description = benefit.descriptionEn || benefit.description;
  if (!benefit.descriptionEn && description) {
    description = description
      .replace(/Nền tảng phần mềm CAD, CAM, CAE và PCB dựa trên đám mây chuyên nghiệp dành cho thiết kế và sản xuất sản phẩm, mô hình hóa 3D trực quan và giả lập\./gi, 'Professional cloud-based CAD, CAM, CAE, and PCB software platform for product design, 3D modeling, and simulation.')
      .replace(/Bản quyền MATLAB & Simulink free nếu trường có Campus-Wide License\. Nếu không, mua bản Student giá \$119\/năm kèm MATLAB Online free 20 giờ\/tháng\./gi, 'Free MATLAB & Simulink license if your university has Campus-Wide License. Otherwise, Student tier is $119/yr including 20 hrs/mo free MATLAB Online.')
      .replace(/Sở hữu toàn bộ Toolkit sáng tạo bao gồm Photoshop, Illustrator, Premiere Pro và Lightroom với chi phí cực thấp\./gi, 'Get complete creative suite including Photoshop, Illustrator, Premiere Pro, and Lightroom at low student rates.')
      .replace(/License phần mềm thiết kế 3D CAD chuẩn công nghiệp free từ 01\/07\/2026 cho students\. Bản Premium giá deal \$60\/năm kèm voucher thi chứng chỉ CSWA\/CSWP\./gi, 'Industry-standard 3D CAD software license free from July 2026 for students. Premium tier at $60/yr includes CSWA/CSWP cert vouchers.')
      .replace(/Trình soạn thảo mã nguồn tích hợp AI hàng đầu thế giới hiện nay\. Hãng cung cấp mã nâng cấp Pro free thông qua các sự kiện on-campus và sự kiện trực tuyến chính thức mùa tự trường\./gi, 'World-leading AI code editor. Pro upgrade codes provided free via campus events and back-to-school webinars.')
      .replace(/Anthropic cung cấp chương trình Claude for Education dành cho các trường đại học\/cao đẳng để tích hợp sâu vào hệ thống, cho phép students, giảng viên truy cập Claude phục vụ học tập\/nghiên cứu\./gi, 'Anthropic provides Claude for Education to universities/colleges, allowing students and faculty deep access for coursework and research.')
      .replace(/Phiên bản ChatGPT được thiết kế riêng cho các trường đại học với bảo mật dữ liệu cấp doanh nghiệp, giới hạn tin nhắn cao hơn, hỗ trợ tạo GPTs tùy chỉnh\./gi, 'Enterprise-grade ChatGPT tailored for universities with strict data privacy, higher usage limits, and custom GPT creation.')
      .replace(/Truy cập các công cụ lập trình tốt nhất thế giới bao gồm GitHub Copilot, Canva Pro, Namecheap hoàn toàn free\./gi, 'Access world-best developer tools including GitHub Copilot, Canva Pro, Namecheap 100% free.')
      .replace(/Công cụ thiết kế UI\/UX và làm việc nhóm chuẩn công nghiệp\. Nhận đầy đủ tính năng thiết kế Kế Pro để làm đồ án\./gi, 'Industry-standard UI/UX design tool. Get full Pro features for academic projects.')
      .replace(/Nền tảng phần mềm/gi, 'Software platform')
      .replace(/chuyên nghiệp dành cho/gi, 'professional for')
      .replace(/học sinh sinh viên/gi, 'students')
      .replace(/sinh viên/gi, 'students')
      .replace(/miễn phí 100%/gi, '100% Free')
      .replace(/miễn phí/gi, 'free')
      .replace(/ưu đãi/gi, 'deal')
      .replace(/giảm giá/gi, 'discount')
      .replace(/Bản quyền/gi, 'License')
      .replace(/Bộ công cụ/gi, 'Toolkit')
      .replace(/Gói dịch vụ/gi, 'Service plan');
  }

  // Requirements translation map
  let requirements = benefit.requirementsEn || benefit.requirements;
  if (!benefit.requirementsEn && requirements) {
    requirements = requirements
      .replace(/Tạo tài khoản Autodesk bằng email trường học và xác thực trạng thái sinh viên qua hệ thống SheerID\./gi, 'Create Autodesk account with university (.edu) email and verify student status via SheerID system.')
      .replace(/Register with tài khoản MathWorks bằng email trường \(\.edu\) hoặc xác minh tư cách sinh viên\./gi, 'Register with MathWorks account using university (.edu) email or student verification.')
      .replace(/student ID hoặc email đuôi giáo dục khi Register with\./gi, 'Register with student ID or educational email address.')
      .replace(/Register with qua cổng SolidWorks Student với email \.edu hoặc student ID\./gi, 'Register via SolidWorks Student portal with .edu email or student ID.')
      .replace(/Register with tham gia các sự kiện on-campus hoặc webinar giáo dục do Cursor tổ chức\./gi, 'Register by attending on-campus events or educational webinars hosted by Cursor.')
      .replace(/Đăng nhập Single Sign-On \(SSO\) qua cổng thông tin hoặc email của trường đại học đối tác\./gi, 'Log in via university Single Sign-On (SSO) portal or partner school email.')
      .replace(/Đăng nhập bằng email trường do trường học liên kết đối tác cung cấp\./gi, 'Log in using university email issued by partner institution.')
      .replace(/Email trường \(\.edu\) hoặc student ID\/giấy xác nhận nhập học\./gi, 'University (.edu) email or student ID / enrollment verification letter.')
      .replace(/student ID cùng tài liệu học tập có đóng dấu của trường\./gi, 'Student ID along with stamped academic documentation.')
      .replace(/Tạo tài khoản/gi, 'Create account with')
      .replace(/email trường học/gi, 'university email (.edu)')
      .replace(/xác thực trạng thái sinh viên/gi, 'verify student status')
      .replace(/thẻ sinh viên/gi, 'student ID')
      .replace(/hệ thống SheerID/gi, 'SheerID system')
      .replace(/Đăng ký/gi, 'Register with')
      .replace(/Nộp hồ sơ/gi, 'Submit application')
      .replace(/Xác thực/gi, 'Verify with');
  }

  return {
    ...benefit,
    title,
    value,
    description,
    requirements
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
