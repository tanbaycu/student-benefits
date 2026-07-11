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
  Chat
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

const BENEFITS_DATA = [
  {
    id: "b001",
    title: "Autodesk Fusion 360 for Students",
    category: "Tech & Software",
    value: "Miễn phí bản quyền 1 năm (gia hạn hàng năm)",
    description: "Nền tảng phần mềm CAD, CAM, CAE và PCB dựa trên đám mây chuyên nghiệp dành cho thiết kế và sản xuất sản phẩm, mô hình hóa 3D trực quan và giả lập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 680,
    link: "https://www.autodesk.com/education/edu-software/overview",
    requirements: "Tạo tài khoản Autodesk bằng email trường học và xác thực trạng thái sinh viên qua hệ thống SheerID.",
    isHot: true
  },
  {
    id: "b002",
    title: "FPT Arena Study Grant",
    category: "Education",
    value: "Học Bổng Sáng Tạo Đến 30%",
    description: "Chương trình học bổng ngành Mỹ thuật Đa phương tiện dành riêng cho học sinh sinh viên có tài năng nghệ thuật.",
    scope: "Vietnam",
    location: "Đà Nẵng (Việt Nam)",
    lifetime: true,
    updatedAt: "1 ngày trước",
    savings: 500,
    link: "https://fptarena.edu.vn/",
    requirements: "Chuyên môn nghệ thuật và thẻ học sinh còn thời hạn.",
    isHot: true
  },
  {
    id: "b003",
    title: "MATLAB Student Suite",
    category: "Tech & Software",
    value: "Free Campus-Wide or $119 Subscription",
    description: "Bản quyền MATLAB & Simulink miễn phí nếu trường có Campus-Wide License. Nếu không, mua bản Student giá $119/năm kèm MATLAB Online miễn phí 20 giờ/tháng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "10 phút trước",
    savings: 500,
    link: "https://www.mathworks.com/academia/tah-support-program/students.html",
    requirements: "Đăng ký tài khoản MathWorks bằng email trường (.edu) hoặc xác minh tư cách sinh viên.",
    isHot: true
  },
  {
    id: "b004",
    title: "Coursera Student Program",
    category: "Education",
    value: "1 Chứng Chỉ Miễn Phí / Năm",
    description: "Học tập từ các trường đại học hàng đầu thế giới. Miễn phí học và cấp chứng chỉ cho một khóa học mỗi năm.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "8 giờ trước",
    savings: 399,
    link: "https://www.coursera.org/student",
    requirements: "Đăng ký thông qua chương trình liên kết của trường đại học đối tác.",
    isHot: true
  },
  {
    id: "b005",
    title: "Adobe Creative Cloud",
    category: "Tech & Software",
    value: "Ưu Đãi Giảm Giá 60%",
    description: "Sở hữu toàn bộ bộ công cụ sáng tạo bao gồm Photoshop, Illustrator, Premiere Pro và Lightroom với chi phí cực thấp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "2 giờ trước",
    savings: 384,
    link: "https://www.adobe.com/creativecloud/buy/students.html",
    requirements: "Thẻ sinh viên hoặc email đuôi giáo dục khi đăng ký.",
    isHot: true
  },
  {
    id: "b006",
    title: "SOLIDWORKS for Students",
    category: "Tech & Software",
    value: "Bản quyền SOLIDWORKS Design Standard",
    description: "Bản quyền phần mềm thiết kế 3D CAD chuẩn công nghiệp miễn phí từ 01/07/2026 cho học sinh sinh viên. Bản Premium giá ưu đãi $60/năm kèm voucher thi chứng chỉ CSWA/CSWP.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 300,
    link: "https://www.solidworks.com/solution/job-functions/students",
    requirements: "Đăng ký qua cổng SolidWorks Student với email .edu hoặc thẻ sinh viên.",
    isHot: true
  },
  {
    id: "b007",
    title: "JetBrains Academy Portal",
    category: "Education",
    value: "Free Full Access to Academy Tracks",
    description: "Nền tảng học tập lập trình thực tế theo dự án của JetBrains (Kotlin, Java, Python, Go...). Giúp sinh viên thực hành lập trình.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "2 tuần trước",
    savings: 299,
    link: "https://www.jetbrains.com/academy/",
    requirements: "Xác thực thông qua JetBrains Account đã liên kết giấy phép sinh viên JetBrains Student License.",
    isHot: true
  },
  {
    id: "b008",
    title: "Cursor Pro (Education Pricing)",
    category: "Tech & Software",
    value: "Ưu đãi nâng cấp Cursor Pro qua sự kiện trường học",
    description: "Trình soạn thảo mã nguồn tích hợp AI hàng đầu thế giới hiện nay. Hãng cung cấp mã nâng cấp Pro miễn phí thông qua các sự kiện on-campus và sự kiện trực tuyến chính thức mùa tựu trường.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 240,
    link: "https://www.cursor.com/students",
    requirements: "Đăng ký tham gia các sự kiện on-campus hoặc webinar giáo dục do Cursor tổ chức.",
    isHot: true
  },
  {
    id: "b009",
    title: "Claude for Education (Anthropic)",
    category: "Tech & Software",
    value: "Quyền truy cập tổ chức đại học",
    description: "Anthropic cung cấp chương trình Claude for Education dành cho các trường đại học/cao đẳng để tích hợp sâu vào hệ thống, cho phép sinh viên, giảng viên truy cập Claude phục vụ học tập/nghiên cứu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 240,
    link: "https://www.anthropic.com/news/claude-edu",
    requirements: "Đăng nhập Single Sign-On (SSO) qua cổng thông tin hoặc email của trường đại học đối tác.",
    isHot: true
  },
  {
    id: "b010",
    title: "ChatGPT Edu (OpenAI)",
    category: "Tech & Software",
    value: "Quyền truy cập cấp đại học (GPT-4o)",
    description: "Phiên bản ChatGPT được thiết kế riêng cho các trường đại học với bảo mật dữ liệu cấp doanh nghiệp, giới hạn tin nhắn cao hơn, hỗ trợ tạo GPTs tuỳ chỉnh.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 240,
    link: "https://openai.com/chatgpt/edu/",
    requirements: "Đăng nhập bằng email trường do trường học liên kết đối tác cung cấp.",
    isHot: true
  },
  {
    id: "b011",
    title: "GitHub Student Developer Pack",
    category: "Tech & Software",
    value: "Free Developer Tools & Copilot",
    description: "Truy cập các công cụ lập trình tốt nhất thế giới bao gồm GitHub Copilot, Canva Pro, Namecheap hoàn toàn miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "3 phút trước",
    savings: 200,
    link: "https://education.github.com/pack",
    requirements: "Email trường (.edu) hoặc thẻ sinh viên/giấy xác nhận nhập học.",
    isHot: true
  },
  {
    id: "b012",
    title: "Figma Professional Plan",
    category: "Tech & Software",
    value: "Tài khoản Pro Miễn Phí 100%",
    description: "Công cụ thiết kế UI/UX và làm việc nhóm chuẩn công nghiệp. Nhận đầy đủ tính năng thiết kế Pro để làm đồ án.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "15 phút trước",
    savings: 180,
    link: "https://www.figma.com/education/students/",
    requirements: "Thẻ sinh viên cứng hoặc tài liệu học tập có đóng dấu của trường.",
    isHot: true
  },
  {
    id: "b013",
    title: "edX Financial Assistance",
    category: "Education",
    value: "Giảm Đến 90% Chứng Chỉ Khóa Học",
    description: "Chương trình hỗ trợ tài chính cho sinh viên/người học có hoàn cảnh khó khăn. Giảm giá 80-90% cho chứng chỉ Verified Certificate của Harvard, MIT...",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "5 ngày trước",
    savings: 180,
    link: "https://www.edx.org/",
    requirements: "Đăng ký học dạng Audit (miễn phí), sau đó nộp đơn xin hỗ trợ tài chính trình bày rõ hoàn cảnh.",
    isHot: true
  },
  {
    id: "b014",
    title: "Canva Pro for Education",
    category: "Tech & Software",
    value: "Tài khoản Pro Miễn Phí",
    description: "Thiết kế slide thuyết trình, poster, CV học tập chuyên nghiệp với hàng triệu tài nguyên Premium miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "8 giờ trước",
    savings: 120,
    link: "https://www.canva.com/education/",
    requirements: "Thẻ sinh viên hoặc email do trường học cấp.",
    isHot: true
  },
  {
    id: "b015",
    title: "Udemy Student Program",
    category: "Education",
    value: "Giảm Giá Khóa Học Lên Tới 75%",
    description: "Truy cập hàng ngàn khóa học chất lượng cao từ lập trình, kinh tế đến nghệ thuật với chi phí siêu rẻ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "3 ngày trước",
    savings: 120,
    link: "https://www.udemy.com/",
    requirements: "Xác thực thông qua cổng liên kết của trường học.",
    isHot: true
  },
  {
    id: "b016",
    title: "GrabStudent Transport Pack",
    category: "Travel & Transport",
    value: "Giảm 20% Chuyến Đi Grab",
    description: "Nhận các gói mã ưu đãi di chuyển hàng tháng hỗ trợ đi lại từ ký túc xá đến các giảng đường đại học.",
    scope: "Vietnam",
    location: "Hà Nội (Việt Nam)",
    lifetime: false,
    updatedAt: "12 giờ trước",
    savings: 120,
    link: "https://www.grab.com/vn/blog/grabstudent-bi-kip-tiet-kiem-khi-di-hoc-cung-grab/",
    requirements: "Mở app Grab trên điện thoại -> Vào mục 'Thử thách' (Challenges) hoặc 'Ưu đãi' (Rewards) để đăng ký gói sinh viên; hoặc xác thực qua MoMo Student Pass bằng thẻ sinh viên.",
    isHot: true
  },
  {
    id: "b017",
    title: "Perplexity Education Pro",
    category: "Tech & Software",
    value: "Giảm 50% Gói Pro ($10/tháng)",
    description: "Truy cập đầy đủ các mô hình AI tiên tiến nhất (GPT-4o, Claude 3.5 Sonnet), tải tài liệu không giới hạn và Pro search với giá chỉ 50%.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "4 giờ trước",
    savings: 120,
    link: "https://www.perplexity.ai",
    requirements: "Xác thực trạng thái học tập qua cổng SheerID tích hợp trong phần cài đặt Perplexity bằng email .edu.",
    isHot: true
  },
  {
    id: "b018",
    title: "You Need A Budget (YNAB) Student",
    category: "Lifestyle",
    value: "Miễn phí 1 năm gói Pro",
    description: "Ứng dụng quản lý tài chính cá nhân và lập ngân sách hàng đầu thế giới giúp sinh viên xây dựng thói quen chi tiêu thông minh khoa học.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 109,
    link: "https://www.ynab.com/college",
    requirements: "Xác thực trạng thái sinh viên đại học hoặc sau đại học thông qua hệ thống SheerID.",
    isHot: true
  },
  {
    id: "b019",
    title: "Microsoft 365 Education",
    category: "Tech & Software",
    value: "Bộ Office & 1TB OneDrive Free",
    description: "Sử dụng trực tuyến Word, Excel, PowerPoint, OneNote, Microsoft Teams kèm dung lượng đám mây khổng lồ 1TB.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "2 ngày trước",
    savings: 100,
    link: "https://www.microsoft.com/vi-vn/education/products/office",
    requirements: "Đăng ký bằng tài khoản email trường do cơ sở giáo dục cấp.",
    isHot: true
  },
  {
    id: "b020",
    title: "Vietnam Airlines LotuStudents",
    category: "Travel & Transport",
    value: "Giảm Đến 10% + Tặng 1 Kiện Hành Lý",
    description: "Chương trình đặc quyền dành riêng cho học sinh sinh viên từ 15-31 tuổi. Giảm giá vé, tặng thêm hành lý ký gửi và miễn phí đổi ngày bay lần đầu.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "5 phút trước",
    savings: 100,
    link: "https://www.vietnamairlines.com/vn/vi/lotusmiles/enroll-lotusmiles",
    requirements: "Đăng ký hội viên Bông Sen Vàng (Lotusmiles) -> Đăng nhập -> Vào mục 'LotuSociety' ở trang cá nhân -> Chọn ưu đãi 'Học sinh, sinh viên' và tải thẻ sinh viên lên để kích hoạt.",
    isHot: true
  },
  {
    id: "b021",
    title: "Notion Education Plus Plan",
    category: "Tech & Software",
    value: "Miễn Phí Nâng Cấp Gói Plus",
    description: "Quản lý ghi chú, tài liệu nghiên cứu và lịch trình học tập. Không giới hạn block tải lên và lưu lịch sử trang 30 ngày.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "1 giờ trước",
    savings: 96,
    link: "https://www.notion.so/product/notion-for-education",
    requirements: "Xác thực trực tiếp bằng email sinh viên trường liên kết.",
    isHot: true
  },
  {
    id: "b022",
    title: "Xanh SM Student Offer",
    category: "Travel & Transport",
    value: "Giảm Giá 15% Các Chuyến Xe Điện",
    description: "Di chuyển xanh, êm ái cùng các dòng taxi điện VinFast với mức chiết khấu 15% hàng tháng.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "1 ngày trước",
    savings: 90,
    link: "https://www.xanhsm.com/",
    requirements: "Nhập mã số sinh viên và hình ảnh thẻ sinh viên để kích hoạt trên ứng dụng.",
    isHot: true
  },
  {
    id: "b023",
    title: "CellphoneS S-Student Membership",
    category: "Tech & Software",
    value: "Giảm thêm tới 10% & Trả góp 0%",
    description: "Đặc quyền giảm thêm đến 10% trực tiếp trên giá bán các sản phẩm điện thoại, laptop, máy tính bảng và phụ kiện, kèm gói trả góp 0% lãi suất.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 80,
    link: "https://cellphones.com.vn/s-student/",
    requirements: "Xác thực thông quan ứng dụng Smember hoặc trực tiếp tại quầy bằng thẻ sinh viên.",
    isHot: true
  },
  {
    id: "b024",
    title: "Amazon Prime Student",
    category: "Lifestyle",
    value: "Miễn Phí 6 Tháng Prime",
    description: "Giao hàng siêu tốc miễn phí, truy cập Prime Video xem phim và ưu đãi độc quyền dành riêng cho giới trẻ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "12 giờ trước",
    savings: 75,
    link: "https://www.amazon.com/joinstudent",
    requirements: "Email sinh viên trường hoặc bảng điểm chứng minh đang đi học.",
    isHot: true
  },
  {
    id: "b025",
    title: "Starbucks Workspaces",
    category: "Food & Dining",
    value: "Giảm 15% Nước Uống Handmade",
    description: "Xuất trình thẻ sinh viên tại quầy để được giảm giá đồ uống và sử dụng không gian học tập yên tĩnh.",
    scope: "Vietnam",
    location: "Hồ Chí Minh (Việt Nam)",
    lifetime: false,
    updatedAt: "2 giờ trước",
    savings: 50,
    link: "https://www.starbucks.vn/",
    requirements: "Thẻ sinh viên cứng còn hiệu lực xuất trình cho nhân viên thu ngân.",
    isHot: true
  },
  {
    id: "b026",
    title: "FPT Shop Student Privilege",
    category: "Tech & Software",
    value: "Giảm thêm 5% & Tặng 1 năm bảo hành",
    description: "Giảm thêm tới 5% giá máy laptop/PC (lên tới 10% cho tân sinh viên dựa theo điểm thi) và tặng thêm 1 năm bảo hành chính hãng (tổng cộng 2 năm bảo hành).",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://fptshop.com.vn",
    requirements: "Đăng ký thông tin học sinh/sinh viên trên trang web FPT Shop và xác thực tại cửa hàng.",
    isHot: true
  },
  {
    id: "b027",
    title: "Lotte Cinema Student Offer",
    category: "Lifestyle",
    value: "Đồng Giá Vé 55,000 VND",
    description: "Thưởng thức các bộ phim bom tấn với mức giá ưu đãi và nhận voucher giảm giá combo bắp nước.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "8 giờ trước",
    savings: 45,
    link: "https://www.lottecinemavn.com",
    requirements: "Thẻ học sinh/sinh viên cứng xuất trình trực tiếp cho nhân viên bán vé.",
    isHot: true
  },
  {
    id: "b028",
    title: "CGV Cinema Student Discount",
    category: "Lifestyle",
    value: "Đồng Giá Vé 60,000 VND",
    description: "Áp dụng giá vé ưu đãi cực sốc cho mọi học sinh sinh viên dưới 22 tuổi tại tất cả cụm rạp CGV toàn quốc.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "6 giờ trước",
    savings: 40,
    link: "https://www.cgv.vn/default/news-offers",
    requirements: "Xuất trình thẻ sinh viên kèm CCCD chính chủ tại quầy vé.",
    isHot: true
  },
  {
    id: "b029",
    title: "Highlands Coffee Student Combo",
    category: "Food & Dining",
    value: "Combo Đồ Uống + Bánh Chỉ 39,000 VND",
    description: "Khuấy động ngày dài học tập với combo Phin Sữa Đá/Trà Sen kèm bánh ngọt với giá sinh viên siêu tiết kiệm.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "1 ngày trước",
    savings: 40,
    link: "https://www.highlandscoffee.com.vn/",
    requirements: "Xuất trình thẻ sinh viên cứng cho nhân viên order tại quầy.",
    isHot: true
  },
  {
    id: "b030",
    title: "Spotify Student Premium",
    category: "Lifestyle",
    value: "Giảm 50% Gói Premium",
    description: "Nghe nhạc không quảng cáo, tải nhạc offline và phát nhạc theo yêu cầu với mức giá ưu đãi dành riêng cho sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "15 phút trước",
    savings: 36,
    link: "https://www.spotify.com/vn-vi/student/",
    requirements: "Xác thực thông qua cổng SheerID bằng ảnh chụp thẻ sinh viên.",
    isHot: true
  },
  {
    id: "b031",
    title: "YouTube Premium Student",
    category: "Lifestyle",
    value: "Ưu Đãi Giảm Phí 45%",
    description: "Xem video không quảng cáo, phát trong nền và sử dụng YouTube Music Premium không giới hạn.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "1 ngày trước",
    savings: 30,
    link: "https://www.youtube.com/premium/student",
    requirements: "Xác thực SheerID bằng thẻ sinh viên cứng hoặc bảng điểm.",
    isHot: true
  },
  {
    id: "b032",
    title: "Vietjet Air Student Offer",
    category: "Travel & Transport",
    value: "Vé Eco 0 đồng & Giảm 20% Deluxe",
    description: "Vietjet Air hỗ trợ sinh viên thông qua các đợt khuyến mãi tựu trường với vé 0 đồng và giảm giá 20-30% cho các hạng vé Deluxe/SkyBoss trong 'Ngày vàng'.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.vietjetair.com",
    requirements: "Đặt vé trực tuyến trong khung giờ vàng hoặc điền mã ưu đãi theo mùa.",
    isHot: true
  },
  {
    id: "b033",
    title: "1Password Manager",
    category: "Tech & Software",
    value: "Miễn Phí 1 Năm Tài Khoản Mới",
    description: "Ứng dụng quản lý mật khẩu an toàn và phổ biến nhất hiện nay, giúp bảo mật thông tin đăng nhập trên mọi nền tảng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://1password.com/",
    requirements: "Kích hoạt qua GitHub Student Developer Pack hoặc Student App Centre.",
    isHot: true
  },
  {
    id: "b034",
    title: "HubSpot for Education Partner Program",
    category: "Tech & Software",
    value: "Miễn phí các công cụ CRM enterprise cao cấp",
    description: "Chương trình HubSpot Education Partner (EPP) mang đến cho sinh viên quyền truy cập miễn phí vào các công cụ phần mềm CRM, Marketing, Sales, Service và Content Hub phiên bản doanh nghiệp của HubSpot.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 9600,
    link: "https://www.hubspot.com/academy/education-partner-program",
    requirements: "Đăng ký thông qua lời mời từ giảng viên tham gia chương trình HubSpot EPP của trường.",
    isHot: false
  },
  {
    id: "b035",
    title: "New Relic Student Edition",
    category: "Tech & Software",
    value: "Miễn phí Standard Edition trong 2 năm",
    description: "Nền tảng quan sát toàn diện giúp phân tích log, APM hiệu năng ứng dụng và giám sát hạ tầng đám mây cho dự án học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 7100,
    link: "https://newrelic.com",
    requirements: "Kết nối tài khoản New Relic cá nhân với tài khoản học sinh GitHub Education.",
    isHot: false
  },
  {
    id: "b036",
    title: "Unity Student Plan",
    category: "Tech & Software",
    value: "Miễn phí gói Student bao gồm Unity Pro",
    description: "Nền tảng phát triển game 3D/2D và xây dựng nội dung thực tế ảo (VR/AR) phổ biến nhất hiện nay.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 2000,
    link: "https://unity.com",
    requirements: "Đăng ký tài khoản Unity và xác thực trạng thái học sinh thông qua cổng đối tác.",
    isHot: false
  },
  {
    id: "b037",
    title: "Bentley Education Student Program",
    category: "Tech & Software",
    value: "Miễn phí quyền truy cập hơn 50 phần mềm chuyên nghiệp",
    description: "Quyền truy cập miễn phí vào các ứng dụng kỹ thuật cơ sở hạ tầng chuyên nghiệp hàng đầu như MicroStation (CAD), STAAD.Pro (phân tích kết cấu), PLAXIS (địa kỹ thuật).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 2000,
    link: "https://education.bentley.com/",
    requirements: "Đăng ký tài khoản trên cổng Bentley Education sử dụng email học thuật (.edu) và nhập thông tin trường học.",
    isHot: false
  },
  {
    id: "b038",
    title: "Unity Student Plan Premium",
    category: "Tech & Software",
    value: "Miễn phí bản quyền Unity Student nâng cao",
    description: "Gói phần mềm phát triển game và ứng dụng 3D thời gian thực miễn phí cho học sinh, sinh viên, bao gồm các công cụ nâng cao, các khóa học Unity Learn Premium và 5 seat miễn phí Unity Version Control.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 2000,
    link: "https://unity.com/products/unity-student",
    requirements: "Xác thực trạng thái học sinh, sinh viên thông qua GitHub Student Developer Pack hoặc qua SheerID.",
    isHot: false
  },
  {
    id: "b039",
    title: "Houdini Education License",
    category: "Tech & Software",
    value: "Bản quyền Houdini Education giá $75/năm",
    description: "Phần mềm mô phỏng kỹ xảo 3D hiệu ứng vật lý nâng cao (lửa, nước, khói) chuẩn Hollywood cho dự án học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 1920,
    link: "https://www.sidefx.com",
    requirements: "Xác thực trạng thái sinh viên thông qua cổng đối tác Proxi.ID khi tiến hành thanh toán.",
    isHot: false
  },
  {
    id: "b040",
    title: "Datadog for Students",
    category: "Tech & Software",
    value: "Miễn phí gói Datadog Pro trong 2 năm",
    description: "Hệ thống giám sát hạ tầng và quản lý log tập trung hỗ trợ tối đa 10 máy chủ (host) cho dự án nghiên cứu học thuật.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 1800,
    link: "https://www.datadoghq.com",
    requirements: "Đăng ký qua cổng đối tác GitHub Student Developer Pack bằng email trường học.",
    isHot: false
  },
  {
    id: "b041",
    title: "Altium Designer Student License",
    category: "Tech & Software",
    value: "Bản Quyền Altium Designer Miễn Phí",
    description: "Bản quyền phần mềm thiết kế mạch in điện tử (PCB) chuyên nghiệp số 1 thế giới Altium Designer, đi kèm đám mây Altium 365.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "3 ngày trước",
    savings: 1500,
    link: "https://www.altium.com/education/students",
    requirements: "Xác thực email đuôi trường (.edu) hoặc tải tài liệu học tập qua cổng Altium Education.",
    isHot: false
  },
  {
    id: "b042",
    title: "Onshape Education Standard Plan",
    category: "Tech & Software",
    value: "Miễn phí tài khoản Education Standard",
    description: "Phần mềm thiết kế CAD 3D chuyên nghiệp chạy hoàn toàn trên đám mây, cho phép sinh viên học tập, thiết kế và cộng tác thời gian thực trên bất kỳ trình duyệt web và thiết bị nào mà không cần cài đặt.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 1500,
    link: "https://www.onshape.com/en/education/",
    requirements: "Đăng ký tài khoản Onshape Education bằng email học thuật (.edu) và thông tin trường học.",
    isHot: false
  },
  {
    id: "b043",
    title: "Maxon One / Cinema 4D Discount",
    category: "Tech & Software",
    value: "Bản quyền Maxon One chỉ $60/năm",
    description: "Bộ công cụ thiết kế 3D, kỹ xảo điện ảnh chuyên nghiệp gồm Cinema 4D, Redshift, Red Giant và ZBrush.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 1139,
    link: "https://www.maxon.net",
    requirements: "Xác thực thông qua hệ thống SheerID với thẻ sinh viên và bảng điểm học tập còn hiệu lực.",
    isHot: false
  },
  {
    id: "b044",
    title: "Siemens Solid Edge Student Edition",
    category: "Tech & Software",
    value: "Miễn phí bản quyền 1 năm (gia hạn hàng năm)",
    description: "Phiên bản học tập của phần mềm CAD chuyên nghiệp Solid Edge từ Siemens, hỗ trợ đầy đủ các tính năng thiết kế 3D, lắp ráp, xuất bản vẽ 2D, mô phỏng và truy cập thư viện học tập miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 900,
    link: "https://siemens.com/solid-edge-student",
    requirements: "Đăng ký bằng email học thuật (.edu) hoặc cung cấp tài liệu chứng minh đang đi học trên cổng phần mềm giáo dục của Siemens.",
    isHot: false
  },
  {
    id: "b045",
    title: "Intel Academic Software Tools",
    category: "Tech & Software",
    value: "Miễn phí công cụ lập trình hiệu năng cao Intel oneAPI",
    description: "Intel cung cấp miễn phí các công cụ phát triển phần mềm hiệu năng cao và phân tích hệ thống như Intel oneAPI Base & HPC Toolkit, Intel VTune Profiler cho sinh viên và nhà nghiên cứu học thuật.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 900,
    link: "https://www.intel.com/content/www/us/en/developer/tools/oneapi/commercial-availability.html#academic",
    requirements: "Đăng ký tài khoản Intel Developer Zone bằng email trường học và khai báo thông tin học tập.",
    isHot: false
  },
  {
    id: "b046",
    title: "Tableau Desktop & Prep for Students",
    category: "Tech & Software",
    value: "Miễn phí bản quyền 1 năm Tableau Desktop và Prep",
    description: "Tableau cung cấp giấy phép sử dụng phần mềm phân tích và trực quan hóa dữ liệu hàng đầu thế giới Tableau Desktop và Tableau Prep Builder hoàn toàn miễn phí cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 840,
    link: "https://www.tableau.com/academic/students",
    requirements: "Điền form đăng ký sử dụng email học thuật (.edu) và xác thực danh tính sinh viên qua hệ thống SheerID.",
    isHot: false
  },
  {
    id: "b047",
    title: "ANSYS Student Edition",
    category: "Tech & Software",
    value: "Miễn Phí ANSYS Academic Suite",
    description: "Tải xuống miễn phí bộ phần mềm mô phỏng vật lý, động lực học chất lưu (CFD), cấu trúc cơ học phục vụ nghiên cứu và học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "4 ngày trước",
    savings: 750,
    link: "https://www.ansys.com/academic/students",
    requirements: "Đăng ký và tải trực tiếp từ cổng ANSYS Academic dành cho sinh viên.",
    isHot: false
  },
  {
    id: "b048",
    title: "Intel Developer Program",
    category: "Tech & Software",
    value: "Free OneAPI Toolkits & DevCloud Access",
    description: "Cung cấp miễn phí các bộ công cụ OneAPI tối ưu hóa hiệu suất phần cứng và quyền truy cập đám mây Intel DevCloud để chạy AI.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "1 tuần trước",
    savings: 500,
    link: "https://www.intel.com/content/www/us/en/developer/topic-solutions/academic/overview.html",
    requirements: "Đăng ký bằng email giáo dục qua cổng học thuật của Intel.",
    isHot: false
  },
  {
    id: "b049",
    title: "O'Reilly for Higher Education (Library Access)",
    category: "Education",
    value: "Miễn phí truy cập qua thư viện trường liên kết",
    description: "Truy cập không giới hạn vào hàng ngàn đầu sách công nghệ, lập trình, kinh doanh và các khóa học video chất lượng của O'Reilly Online Learning thông qua tài khoản thư viện của các trường đại học liên kết.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 499,
    link: "https://www.acm.org/membership/student",
    requirements: "Đăng nhập bằng email học thuật (.edu) của trường đại học có liên kết hoặc đăng ký hội viên sinh viên ACM.",
    isHot: false
  },
  {
    id: "b050",
    title: "Apple Pro Apps Bundle",
    category: "Tech & Software",
    value: "Bộ 5 phần mềm sáng tạo giá chỉ $199",
    description: "Gói phần mềm cực hời gồm: Logic Pro, Final Cut Pro, Motion, Compressor, MainStage dành cho sinh viên làm âm thanh & dựng video.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 430,
    link: "https://www.apple.com",
    requirements: "Mua trực tiếp trên Apple Store Education và xác thực qua hệ thống UNiDAYS.",
    isHot: false
  },
  {
    id: "b051",
    title: "Wall Street Journal Student",
    category: "Education",
    value: "Đồng Giá $4/Tháng (Giảm 90%)",
    description: "Tạp chí tài chính kinh tế hàng đầu thế giới. Cung cấp tin tức thế giới chuyên sâu và các phân tích thị trường chất lượng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 419,
    link: "https://wsj.com/student",
    requirements: "Xác thực trực tiếp trên cổng wsj.com/student bằng email sinh viên trường liên kết hoặc SheerID.",
    isHot: false
  },
  {
    id: "b052",
    title: "Retool for Students",
    category: "Tech & Software",
    value: "Giảm 100% gói Team hoặc Business",
    description: "Nền tảng low-code mạnh mẽ giúp xây dựng nhanh các ứng dụng nội bộ, giao diện kéo thả và bảng điều khiển cho đồ án học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 360,
    link: "https://retool.com/retool-for-students",
    requirements: "Đăng ký tài khoản và nộp đơn qua trang giáo dục bằng email đuôi trường học (.edu).",
    isHot: false
  },
  {
    id: "b053",
    title: "Axure RP Prototyping",
    category: "Tech & Software",
    value: "Bản Quyền Axure RP Team Miễn Phí",
    description: "Công cụ vẽ prototype tương tác UX/UI mạnh mẽ nhất dành cho các dự án thiết kế ứng dụng và website phức tạp của sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 348,
    link: "https://www.axure.com/edu",
    requirements: "Đăng ký thông qua Axure Student Portal bằng cách upload thẻ sinh viên hoặc bảng điểm.",
    isHot: false
  },
  {
    id: "b054",
    title: "BrowserStack Student Package",
    category: "Tech & Software",
    value: "Miễn phí 1 năm gói Live & Automate",
    description: "Nền tảng đám mây hỗ trợ kiểm thử ứng dụng và website trên hơn 3000 thiết bị thật và trình duyệt thực tế.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 348,
    link: "https://www.browserstack.com",
    requirements: "Xác thực thông qua tài khoản gói GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b055",
    title: "Sentry for Education",
    category: "Tech & Software",
    value: "Miễn phí gói Team (50k errors/month)",
    description: "Công cụ giám sát lỗi phần mềm ứng dụng và theo dõi hiệu năng hoạt động thời gian thực cho lập trình viên học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 348,
    link: "https://sentry.io/education/",
    requirements: "Liên kết tài khoản Sentry cá nhân với GitHub Student Developer Pack đã xác thực.",
    isHot: false
  },
  {
    id: "b056",
    title: "Datacamp for Education",
    category: "Tech & Software",
    value: "Miễn Phí Học Data Science",
    description: "Nền tảng học tập Khoa học dữ liệu, AI và phân tích dữ liệu hàng đầu thế giới dành cho các sinh viên ngành công nghệ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "3 ngày trước",
    savings: 300,
    link: "https://www.datacamp.com/groups/education",
    requirements: "Đăng ký thông qua tài khoản lớp học được giảng viên bảo trợ.",
    isHot: false
  },
  {
    id: "b057",
    title: "Bloomberg Student Access",
    category: "Education",
    value: "Thuê bao Digital chỉ $9.99/tháng",
    description: "Quyền truy cập không giới hạn bài viết tin tức phân tích tài chính toàn cầu của Bloomberg với giá ưu đãi đặc biệt (gốc $34.99/tháng).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 300,
    link: "https://www.bloomberg.com/",
    requirements: "Xác thực trạng thái sinh viên thông qua liên kết đối tác Student Beans.",
    isHot: false
  },
  {
    id: "b058",
    title: "Shapr3D for Education",
    category: "Tech & Software",
    value: "Miễn phí bản quyền 1 năm (gia hạn hàng năm)",
    description: "Phần mềm thiết kế 3D CAD chuyên nghiệp tối ưu hóa cho thiết bị di động (iPad, máy tính bảng) và máy tính Windows/Mac, hỗ trợ vẽ phác thảo và dựng hình 3D trực quan bằng bút cảm ứng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 300,
    link: "https://www.shapr3d.com/pricing",
    requirements: "Đăng ký tài khoản Shapr3D bằng email học thuật (.edu), gửi đơn xin cấp phép EDU kèm theo thẻ sinh viên hoặc bảng điểm hợp lệ.",
    isHot: false
  },
  {
    id: "b059",
    title: "Shapr3D Educational License",
    category: "Tech & Software",
    value: "Miễn phí 1 năm Shapr3D Pro",
    description: "Công cụ thiết kế mô hình 3D CAD chuyên nghiệp tối ưu hoá cho iPad (với Apple Pencil), Windows và macOS cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 299,
    link: "https://www.shapr3d.com/education",
    requirements: "Đăng ký qua email trường .edu và upload thẻ sinh viên hoặc bảng điểm hợp lệ.",
    isHot: false
  },
  {
    id: "b060",
    title: "Basecamp for Education Premium",
    category: "Tech & Software",
    value: "Miễn phí tài khoản Basecamp Premium",
    description: "Basecamp là phần mềm quản lý dự án và giao tiếp nội bộ nổi tiếng giúp tối ưu hóa công việc nhóm. Phiên bản giáo dục cung cấp đầy đủ các tính năng của gói trả phí phục vụ học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 299,
    link: "https://basecamp.com/discounts",
    requirements: "Tạo tài khoản Basecamp mới bằng email trường học, sau đó gửi email tới bộ phận hỗ trợ của Basecamp kèm thông tin chứng minh đang đi học.",
    isHot: false
  },
  {
    id: "b061",
    title: "Rive Education Plan",
    category: "Tech & Software",
    value: "Cấp tài khoản giáo dục miễn phí/ưu đãi",
    description: "Công cụ thiết kế chuyển động và tạo animation tương tác thời gian thực cho ứng dụng di động, web và game.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 288,
    link: "https://rive.app",
    requirements: "Gửi email trực tiếp đến support@rive.app với thông tin dự án học tập/coursework và thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b062",
    title: "DBeaver Academic License",
    category: "Tech & Software",
    value: "Miễn phí bản quyền DBeaver Enterprise Edition",
    description: "Cung cấp giấy phép sử dụng miễn phí phiên bản Enterprise cao cấp của công cụ quản lý cơ sở dữ liệu đa nền tảng DBeaver cho mục đích học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 250,
    link: "https://dbeaver.com",
    requirements: "Đăng ký trực tuyến bằng email giáo dục và gửi minh chứng học tập hợp lệ qua cổng học thuật của DBeaver.",
    isHot: false
  },
  {
    id: "b063",
    title: "Marvelous Designer Student Plan",
    category: "Tech & Software",
    value: "Đăng ký sinh viên chỉ $8.25/tháng (giảm 70%)",
    description: "Phần mềm mô phỏng và thiết kế quần áo 3D đỉnh cao dành cho làm game, hoạt hình và thời trang kỹ thuật số học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 250,
    link: "https://www.marvelousdesigner.com",
    requirements: "Xác thực trạng thái học tập trực tiếp bằng email trường học (.edu) hoặc thẻ học sinh.",
    isHot: false
  },
  {
    id: "b064",
    title: "v0.dev Pro Education Plan",
    category: "Tech & Software",
    value: "Tài khoản Pro v0 Miễn Phí",
    description: "Hỗ trợ thiết kế và sinh code UI/UX siêu tốc bằng trí tuệ nhân tạo (AI) của Vercel cho các dự án và đồ án công nghệ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "20 phút trước",
    savings: 240,
    link: "https://v0.dev/",
    requirements: "Xác thực tài khoản Vercel thông qua email đuôi trường học (.edu) của sinh viên.",
    isHot: false
  },
  {
    id: "b065",
    title: "Superhuman Email Client",
    category: "Tech & Software",
    value: "Giảm Giá 67% Gói Premium Mail",
    description: "Ứng dụng quản lý email (Gmail/Outlook) nhanh nhất thế giới giúp sinh viên xử lý hộp thư đến siêu tốc và đạt Inbox Zero.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 240,
    link: "https://superhuman.com/",
    requirements: "Gửi email yêu cầu đến hello@superhuman.com bằng email sinh viên trường học.",
    isHot: false
  },
  {
    id: "b066",
    title: "Airtable Student Offer",
    category: "Tech & Software",
    value: "Miễn Phí Gói Airtable Team",
    description: "Công cụ cơ sở dữ liệu kết hợp bảng tính trực quan, giúp sinh viên quản lý dự án học tập, nghiên cứu và tổ chức dữ liệu mạnh mẽ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 240,
    link: "https://www.airtable.com/education",
    requirements: "Đăng ký qua email .edu và nộp đơn đăng ký trực tiếp trên trang web Airtable.",
    isHot: false
  },
  {
    id: "b067",
    title: "Financial Times (FT) Student",
    category: "Education",
    value: "Giảm giá 50% gói Digital",
    description: "Cung cấp quyền truy cập tin tức tài chính, kinh tế toàn cầu chất lượng cao giúp hỗ trợ học tập và nghiên cứu học thuật sâu sắc.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 234,
    link: "https://sub.ft.com/spa-student",
    requirements: "Xác minh thông tin học sinh sinh viên qua cổng đăng ký học tập của FT hoặc email trường.",
    isHot: false
  },
  {
    id: "b068",
    title: "GitLab Ultimate for Education",
    category: "Tech & Software",
    value: "Miễn phí bản quyền cao cấp nhất GitLab Ultimate",
    description: "GitLab cung cấp miễn phí phiên bản cao cấp nhất GitLab Ultimate cho các trường đại học và dự án học thuật của sinh viên, hỗ trợ tính năng bảo mật nâng cao và các công cụ CI/CD.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 228,
    link: "https://about.gitlab.com/solutions/education/",
    requirements: "Điền đơn đăng ký thông qua chương trình GitLab for Education, yêu cầu xác thực bằng email trường và tài liệu chứng minh đang đi học.",
    isHot: false
  },
  {
    id: "b069",
    title: "Qatar Airways Student Club",
    category: "Travel & Transport",
    value: "Giảm 10% - 20% + Tặng 10kg Hành Lý",
    description: "Nhận mã giảm 10% lần đầu, 15% lần 2, 20% lần 3 & 4. Thêm hành lý ký gửi, đổi ngày miễn phí và nâng hạng Privilege Club khi tốt nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "1 giờ trước",
    savings: 200,
    link: "https://www.qatarairways.com/en/student-club.html",
    requirements: "Đăng ký online bằng email .edu, thẻ sinh viên hoặc Visa du học / Thư nhập học.",
    isHot: false
  },
  {
    id: "b070",
    title: "Emirates Student Discount",
    category: "Travel & Transport",
    value: "Giảm Đến 10% + Tặng 10kg Hành Lý",
    description: "Giảm giá vé bay tới 10% cho hạng Economy và Business Class, kèm theo hành lý ký gửi bổ dung và thay đổi ngày bay miễn phí lần đầu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "3 giờ trước",
    savings: 200,
    link: "https://www.emirates.com/vn/vietnamese/special-offers/student-special-fares/",
    requirements: "Áp dụng mã promo code STUDENT khi đặt vé và xuất trình thẻ sinh viên hoặc email trường khi check-in.",
    isHot: false
  },
  {
    id: "b071",
    title: "MongoDB Atlas for Students",
    category: "Tech & Software",
    value: "Tặng $50 Cloud Credit + Free Certification",
    description: "Tín dụng đám mây MongoDB Atlas để chạy cơ sở dữ liệu NoSQL, đi kèm voucher thi miễn phí chứng chỉ MongoDB Certified Developer.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "1 ngày trước",
    savings: 200,
    link: "https://www.mongodb.com/academia",
    requirements: "Kích hoạt thông qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b072",
    title: "DigitalOcean Student Cloud Credit",
    category: "Tech & Software",
    value: "Tặng $200 Cloud Credit miễn phí",
    description: "Tín dụng đám mây sử dụng trong vòng 1 năm để deploy máy chủ ảo (Droplets), cơ sở dữ liệu, ứng dụng đám mây cho học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "1 ngày trước",
    savings: 200,
    link: "https://www.digitalocean.com/github-students",
    requirements: "Kích hoạt qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b073",
    title: "Avid Pro Tools Education",
    category: "Tech & Software",
    value: "Bản quyền Pro Tools Studio chỉ $99/năm",
    description: "Công cụ chỉnh sửa, thu âm và sản xuất âm thanh hậu kỳ phim ảnh tiêu chuẩn công nghiệp âm nhạc.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 200,
    link: "https://www.avid.com",
    requirements: "Xác thực trạng thái học tập qua cổng Proxi.id bằng email nhà trường hoặc thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b074",
    title: "Oracle Academy Cloud Program",
    category: "Tech & Software",
    value: "Miễn phí Oracle Cloud Free Tier & tài nguyên Academy",
    description: "Oracle Academy cung cấp cho sinh viên quyền truy cập miễn phí vào các dịch vụ đám mây của Oracle (Oracle Cloud Free Tier), các khóa học Java, cơ sở dữ liệu SQL và công nghệ AI.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 200,
    link: "https://academy.oracle.com/",
    requirements: "Đăng ký thông qua tài khoản Oracle Academy do trường đại học của sinh viên liên kết cung cấp.",
    isHot: false
  },
  {
    id: "b075",
    title: "Frontend Masters Student Access",
    category: "Education",
    value: "Miễn Phí 6 Tháng Premium Access",
    description: "Nền tảng học lập trình Web/Frontend chuyên sâu từ các chuyên gia hàng đầu. Miễn phí truy cập toàn bộ khóa học chất lượng cao trong 6 tháng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "5 giờ trước",
    savings: 195,
    link: "https://frontendmasters.com/welcome/github-student-developers/",
    requirements: "Liên kết và kích hoạt thông qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b076",
    title: "Miro for Education Standard",
    category: "Tech & Software",
    value: "Miễn phí bản quyền Education (thời hạn 2 năm)",
    description: "Bảng trắng kỹ thuật số cộng tác trực tuyến trực quan hàng đầu, giúp các nhóm cùng brainstorm, lập bản đồ tư duy, vẽ sơ đồ và quản lý dự án. Bản Education cung cấp số lượng bảng không giới hạn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 192,
    link: "https://miro.com/education/",
    requirements: "Đăng ký bằng email trường học (.edu) và gửi thông tin xác nhận qua cổng đăng ký Miro Education.",
    isHot: false
  },
  {
    id: "b077",
    title: "Framer No-Code Website Builder",
    category: "Tech & Software",
    value: "Miễn Phí Gói Basic Plan 1 Năm",
    description: "Công cụ thiết kế và phát triển website không cần viết code (No-code site builder). Nhận miễn phí 1 năm gói Basic để xây dựng portfolio cá nhân.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 180,
    link: "https://www.framer.com/education/",
    requirements: "Đăng ký tài khoản Framer bằng email trường học và điền đơn xin học tập trực tuyến.",
    isHot: false
  },
  {
    id: "b078",
    title: "The New York Times Student",
    category: "Education",
    value: "Miễn Phí Academic / Giảm Còn $2/tháng",
    description: "Truy cập không giới hạn bài viết, tin tức thế giới chất lượng cao từ tờ báo danh tiếng The New York Times.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 180,
    link: "https://accessnyt.com/",
    requirements: "Xác minh thông qua cổng accessnyt.com bằng email giáo dục của trường đại học.",
    isHot: false
  },
  {
    id: "b079",
    title: "Postman Student Program",
    category: "Tech & Software",
    value: "Miễn phí Postman Premium",
    description: "Cung cấp các khoá học đào tạo API miễn phí, chứng chỉ Postman Student Expert và hỗ trợ giấy phép sử dụng Premium cho sinh viên học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 180,
    link: "https://www.postman.com/student-program/",
    requirements: "Xác thực qua email trường .edu hoặc cung cấp minh chứng học tập khác.",
    isHot: false
  },
  {
    id: "b080",
    title: "Wix Website Student Plan",
    category: "Tech & Software",
    value: "Giảm 50% Gói Premium Năm",
    description: "Nền tảng thiết kế website kéo thả phổ biến, hỗ trợ sinh viên nhanh chóng tự tạo blog, portfolio cá nhân hoặc landing page chuyên nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 180,
    link: "https://www.wix.com/students",
    requirements: "Xác thực tình trạng sinh viên thông qua Student Beans.",
    isHot: false
  },
  {
    id: "b081",
    title: "Ableton Live Education",
    category: "Tech & Software",
    value: "Giảm 40% giá mua bản quyền Ableton Live",
    description: "Phần mềm máy trạm âm thanh kỹ thuật số (DAW) chuyên nghiệp chuẩn công nghiệp dành cho việc sản xuất âm nhạc, phối khí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 180,
    link: "https://www.ableton.com",
    requirements: "Tải tài liệu chứng minh là học sinh/sinh viên toàn thời gian hoặc bán thời gian lên trang xác thực Ableton.",
    isHot: false
  },
  {
    id: "b082",
    title: "CorelDraw Education Edition",
    category: "Tech & Software",
    value: "Giảm giá tới 75% bản quyền chính thức",
    description: "Bộ công cụ thiết kế đồ họa vector và chỉnh sửa ảnh chuyên nghiệp phục vụ học tập sáng tạo nghệ thuật.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 170,
    link: "https://www.coreldraw.com",
    requirements: "Xác thực trạng thái học sinh thông qua cổng SheerID hoặc cung cấp thẻ học sinh trực tiếp.",
    isHot: false
  },
  {
    id: "b083",
    title: "Affinity Suite for Education",
    category: "Tech & Software",
    value: "Bản Quyền Affinity V2 Miễn Phí",
    description: "Canva và Affinity kết hợp cung cấp miễn phí bộ ứng dụng thiết kế đồ hoạ chuyên nghiệp (Designer, Photo, Publisher) thay thế cho Adobe Illustrator, Photoshop.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 165,
    link: "https://affinity.serif.com/education/",
    requirements: "Kích hoạt thông qua tài khoản Canva for Education được trường học phê duyệt.",
    isHot: false
  },
  {
    id: "b084",
    title: "Heroku Student Hobby Tier",
    category: "Tech & Software",
    value: "Tặng $13/tháng Cloud Credit (12 tháng)",
    description: "Tín dụng đám mây trị giá $13 mỗi tháng trong vòng 1 năm để chạy các ứng dụng Node.js, Python, Ruby trên Heroku miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "2 ngày trước",
    savings: 156,
    link: "https://www.heroku.com/github-students",
    requirements: "Đăng ký qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b085",
    title: "Moqups for Education",
    category: "Tech & Software",
    value: "Miễn phí tài khoản Pro 1 năm",
    description: "Công cụ thiết kế sơ đồ luồng, wireframe, sitemap và cộng tác nhóm trên một bảng vẽ trực tuyến duy nhất.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 156,
    link: "https://moqups.com",
    requirements: "Tạo tài khoản bằng email giáo dục của trường và gửi email yêu cầu kích hoạt đến bộ phận hỗ trợ Moqups.",
    isHot: false
  },
  {
    id: "b086",
    title: "Samsung Student Offers",
    category: "Tech & Software",
    value: "Giảm Giá Đến 30% Thiết Bị",
    description: "Ưu đãi chiết khấu trực tiếp khi mua điện thoại Galaxy, máy tính bảng Tab, laptop Book và phụ kiện công nghệ.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: true,
    updatedAt: "1 ngày trước",
    savings: 150,
    link: "https://www.samsung.com/vn/offer/student-discount/",
    requirements: "Đăng nhập cổng Samsung Student Vietnam bằng email giáo dục.",
    isHot: false
  },
  {
    id: "b087",
    title: "ISIC International Student Card",
    category: "Travel & Transport",
    value: "Thẻ Ưu Đãi Du Lịch Toàn Cầu",
    description: "Mở khóa hơn 150.000 ưu đãi vé máy bay, vé tàu, khách sạn, vé vào cổng bảo tàng trên toàn thế giới.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "2 ngày trước",
    savings: 150,
    link: "https://www.isic.org/",
    requirements: "Cung cấp ảnh chụp thẻ sinh viên chính chủ còn hạn sử dụng để làm thẻ ISIC.",
    isHot: false
  },
  {
    id: "b088",
    title: "Singapore Airlines Student Privileges",
    category: "Travel & Transport",
    value: "Giảm 10% Khứ Hồi / Tặng 40kg Hành Lý",
    description: "Đặc quyền bay cho sinh viên đăng ký KrisFlyer. Giảm giá vé, tăng đáng kể hành lý ký gửi và hỗ trợ hoàn vé miễn phí nếu bị từ chối Visa.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "2 giờ trước",
    savings: 150,
    link: "https://www.singaporeair.com/en_UK/sg/plan-travel/local-promotions/student-privilege/",
    requirements: "Xác minh tài khoản KrisFlyer qua cổng SheerID bằng thẻ sinh viên hoặc giấy xác nhận nhập học.",
    isHot: false
  },
  {
    id: "b089",
    title: "Codecademy Student Pro",
    category: "Education",
    value: "Giảm 50% Gói Membership Năm",
    description: "Giảm giá 50% cho gói Codecademy Pro hàng năm, giúp sinh viên tiếp cận các lộ trình học lập trình tương tác phong phú, đồ án thực tế.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "4 ngày trước",
    savings: 150,
    link: "https://www.codecademy.com/student-center",
    requirements: "Xác minh tư cách sinh viên qua dịch vụ đối tác SheerID.",
    isHot: false
  },
  {
    id: "b090",
    title: "Pluralsight Premium Offer",
    category: "Education",
    value: "Truy Cập Free qua Microsoft Dev Essentials",
    description: "Truy cập vào thư viện các khóa học công nghệ cao cấp của Pluralsight thông qua gói Visual Studio Dev Essentials của Microsoft.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "5 ngày trước",
    savings: 150,
    link: "https://visualstudio.microsoft.com/dev-essentials/",
    requirements: "Đăng ký tài khoản Microsoft Dev Essentials và kích hoạt ưu đãi Pluralsight.",
    isHot: false
  },
  {
    id: "b091",
    title: "Educative.io Student Access Program",
    category: "Education",
    value: "Miễn phí 6 tháng học thử hơn 60 khóa học lập trình",
    description: "Educative.io cung cấp nền tảng học lập trình tương tác dựa trên văn bản giúp sinh viên học code nhanh hơn thông qua trình duyệt mà không cần thiết lập môi trường phức tạp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 150,
    link: "https://www.educative.io/github-students",
    requirements: "Đăng nhập bằng tài khoản GitHub đã được xác thực trạng thái sinh viên qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b092",
    title: "Turkish Airlines Student Club",
    category: "Travel & Transport",
    value: "Giảm Giá Đến 20% + 40kg Ký Gửi Free",
    description: "Ưu đãi di chuyển quốc tế cực lớn từ hãng hàng không 5 sao của Thổ Nhĩ Kỳ dành cho du học sinh và sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 150,
    link: "https://www.turkishairlines.com/en-int/miles-and-smiles/student/",
    requirements: "Đăng ký thành viên Miles&Smiles và gửi hồ sơ chứng minh sinh viên qua form hỗ trợ.",
    isHot: false
  },
  {
    id: "b093",
    title: "Nha khoa Parkway Student Teeth Care",
    category: "Lifestyle",
    value: "Giảm dịch vụ chỉnh nha & Cạo vôi tới 50%",
    description: "Giảm giá chỉnh nha Invisalign/mắc cài thông qua sự kiện liên kết trường học hoặc ưu đãi trực tiếp cho thẻ sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 150,
    link: "https://nhakhoaparkway.com",
    requirements: "Đăng ký qua link sự kiện trường học hoặc xuất trình thẻ sinh viên tại phòng khám.",
    isHot: false
  },
  {
    id: "b094",
    title: "Swiss Travel Pass Youth",
    category: "Travel & Transport",
    value: "Giảm giá 30% vé tàu hỏa Thụy Sĩ",
    description: "Thẻ di chuyển trọn gói bằng tàu hỏa, xe buýt, tàu thủy và miễn phí vào cửa 500 bảo tàng tại Thụy Sĩ dành cho giới trẻ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 150,
    link: "https://www.sbb.ch",
    requirements: "Xác minh độ tuổi từ 16 - 24 bằng hộ chiếu khi mua vé trực tuyến hoặc trực tiếp tại ga.",
    isHot: false
  },
  {
    id: "b095",
    title: "Mathematica Student Edition / WolframAlpha Pro Student",
    category: "Tech & Software",
    value: "Giảm giá 30%–60% (hoặc miễn phí qua trường liên kết)",
    description: "WolframAlpha Pro cung cấp công cụ giải toán nâng cao bước-theo-bước. Mathematica Student Edition cung cấp công cụ tính toán khoa học, mô phỏng kỹ thuật và phát triển thuật toán chuyên nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 150,
    link: "https://www.wolfram.com/mathematica/pricing/",
    requirements: "Đăng nhập/Xác thực qua Student Beans hoặc sử dụng email giáo dục (.edu) đăng ký qua cổng phần mềm của trường liên kết.",
    isHot: false
  },
  {
    id: "b096",
    title: "Brilliant.org for Educators & Students",
    category: "Education",
    value: "Free Premium cho học sinh K-12",
    description: "Nền tảng học Toán, Khoa học Máy tính tương tác trực quan cung cấp tài khoản Premium miễn phí cho lớp học giáo viên bảo trợ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 149,
    link: "https://brilliant.org/educators/",
    requirements: "Giáo viên K-12 nộp đơn xin tài khoản lớp học và thêm học sinh của mình vào danh sách.",
    isHot: false
  },
  {
    id: "b097",
    title: "Mural for Education Workspace",
    category: "Tech & Software",
    value: "Miễn phí gói tài khoản Education đầy đủ tính năng",
    description: "Nền tảng bảng trắng tương tác kỹ thuật số giúp thiết kế ý tưởng, brainstorm và lập bản đồ tư duy cộng tác trực quan cho các đội nhóm học tập của sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 144,
    link: "https://www.mural.co/education",
    requirements: "Đăng ký tài khoản trên trang Mural Education bằng email giáo dục (.edu) hoặc cung cấp bằng chứng nhập học.",
    isHot: false
  },
  {
    id: "b098",
    title: "Proto.io Student Discount",
    category: "Tech & Software",
    value: "Giảm 50% mọi gói thuê bao dịch vụ",
    description: "Công cụ thiết kế mẫu thử (prototyping) ứng dụng di động có độ trung thực cao (high-fidelity) không cần viết code.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 144,
    link: "https://proto.io",
    requirements: "Liên hệ hỗ trợ trực tuyến của Proto.io từ địa chỉ email trường để nhận ưu đãi giáo dục.",
    isHot: false
  },
  {
    id: "b099",
    title: "The Economist Student",
    category: "Education",
    value: "Giảm Giá 75% Thuê Bao Digital",
    description: "Tuần báo uy tín phân tích sâu về kinh tế toàn cầu, chính trị thế giới, khoa học công nghệ và văn hóa.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 140,
    link: "https://www.economist.com/",
    requirements: "Xác thực qua cổng Student Beans hoặc thẻ sinh viên quốc tế ISIC.",
    isHot: false
  },
  {
    id: "b100",
    title: "Cathay Pacific Student Offer",
    category: "Travel & Transport",
    value: "Giảm tới 10% vé + Tặng hành lý + Đổi ngày free",
    description: "Đặc quyền bay dành cho sinh viên quốc tế khi đặt vé trực tuyến sử dụng mã khuyến mại theo khu vực (ví dụ: VNSTUDENT).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 140,
    link: "https://www.cathaypacific.com",
    requirements: "Xác minh bằng Thẻ sinh viên quốc tế (ISIC), visa du học, hoặc Thư mời nhập học khi làm thủ tục check-in.",
    isHot: false
  },
  {
    id: "b101",
    title: "EVA Air Student Tickets",
    category: "Travel & Transport",
    value: "Giảm giá vé bay + Tặng thêm hành lý ký gửi",
    description: "Gói ưu đãi dành cho sinh viên đại học/cao đẳng và khách du lịch theo diện Working Holiday trên các đường bay quốc tế được chỉ định.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 140,
    link: "https://www.evaair.com",
    requirements: "Xuất trình Thẻ sinh viên quốc tế (ISIC), visa học tập hoặc giấy báo nhập học tại sân bay.",
    isHot: false
  },
  {
    id: "b102",
    title: "ANA Student Exclusive Deals",
    category: "Travel & Transport",
    value: "Giảm giá vé bay + Tặng thêm hành lý miễn cước",
    description: "Ưu đãi dành cho sinh viên bay chặng quốc tế của hãng hàng không 5 sao All Nippon Airways đi Mỹ, Nhật Bản, Canada...",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 140,
    link: "https://www.ana.co.jp",
    requirements: "Yêu cầu đăng ký thành viên ANA Mileage Club và xác minh bằng thẻ sinh viên hoặc thư nhập học bằng tiếng Anh.",
    isHot: false
  },
  {
    id: "b103",
    title: "Etihad Airways Student Discount",
    category: "Travel & Transport",
    value: "Giảm tới 10% Economy / 5% Business + Thêm hành lý",
    description: "Chương trình ưu đãi giá vé bay quốc tế và nâng thêm hạn mức hành lý ký gửi miễn phí cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 140,
    link: "https://www.etihad.com",
    requirements: "Đăng ký qua cổng xác thực đối tác Student Beans.",
    isHot: false
  },
  {
    id: "b104",
    title: "Squarespace Portfolio Store",
    category: "Tech & Software",
    value: "Giảm Giá 50% Năm Đầu Chi Tiết",
    description: "Công cụ xây dựng và thiết kế website chuyên nghiệp, hỗ trợ đắc lực cho sinh viên làm portfolio cá nhân hoặc dự án học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 138,
    link: "https://www.squarespace.com/students",
    requirements: "Xác thực tình trạng sinh viên thông qua Student Beans.",
    isHot: false
  },
  {
    id: "b105",
    title: "Asana for Students",
    category: "Tech & Software",
    value: "Miễn phí 12 tháng gói Asana Premium",
    description: "Công cụ quản lý dự án hàng đầu thế giới, giúp các nhóm sinh viên lập kế hoạch, phân chia công việc và theo dõi deadline một cách trực quan.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 132,
    link: "https://asana.com",
    requirements: "Đăng ký qua trang Asana for Students bằng email trường đại học.",
    isHot: false
  },
  {
    id: "b106",
    title: "Vé xe buýt Hà Nội dành cho HSSV (Thẻ tháng)",
    category: "Lifestyle",
    value: "Vé tháng ưu tiên 70.000đ (1 tuyến) hoặc 140.000đ (liên tuyến)",
    description: "Tổng công ty Vận tải Hà Nội cung cấp thẻ vé tháng xe buýt ưu tiên cho học sinh, sinh viên, giúp đi lại không giới hạn trên các tuyến buýt trợ giá của thành phố.",
    scope: "Vietnam",
    location: "Hà Nội",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 125,
    link: "http://timbus.vn/",
    requirements: "Đăng ký thẻ vé tháng trực tuyến tại Timbus.vn hoặc trực tiếp tại điểm bán vé, yêu cầu dán ảnh và có xác nhận của trường học.",
    isHot: false
  },
  {
    id: "b107",
    title: "Termius Student Premium",
    category: "Tech & Software",
    value: "Tài khoản Termius Premium Miễn Phí",
    description: "Ứng dụng SSH Client hiện đại, đồng bộ cấu hình đám mây, lưu trữ khóa và snippet giúp quản lý VPS/máy chủ trên PC và mobile.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "8 giờ trước",
    savings: 120,
    link: "https://termius.com/education",
    requirements: "Đăng ký thông qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b108",
    title: "Sketch for Students",
    category: "Tech & Software",
    value: "Bản Quyền Sketch Hỗ Trợ 100%",
    description: "Phần mềm thiết kế giao diện UI/UX chuyên nghiệp trên macOS. Miễn phí đầy đủ tính năng cho học sinh sinh viên học tập thiết kế.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://www.sketch.com/education/",
    requirements: "Gửi biểu mẫu yêu cầu qua Sketch Education Store kèm thẻ sinh viên còn hạn.",
    isHot: false
  },
  {
    id: "b109",
    title: "Whimsical Visual Workspace",
    category: "Tech & Software",
    value: "Miễn Phí Nâng Cấp Gói Pro",
    description: "Công cụ trực quan hóa tư duy hàng đầu, hỗ trợ vẽ sơ đồ tư duy (mind map), lưu đồ (flowchart), và phác thảo wireframe.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://whimsical.com/education",
    requirements: "Điền biểu mẫu yêu cầu trên trang Whimsical bằng tài khoản email .edu.",
    isHot: false
  },
  {
    id: "b110",
    title: "Coda All-in-One Docs",
    category: "Tech & Software",
    value: "Miễn Phí Nâng Cấp Gói Coda Pro",
    description: "Nền tảng tài liệu all-in-one kết hợp soạn thảo văn bản, bảng dữ liệu và ứng dụng giúp tổ chức và cộng tác thông tin dự án học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://coda.io/pricing",
    requirements: "Xác thực trực tiếp trên trang Coda Pricing thông qua email giáo dục.",
    isHot: false
  },
  {
    id: "b111",
    title: "Lufthansa Student Fares",
    category: "Travel & Transport",
    value: "Giảm giá vé + Tặng hành lý phụ + Đổi vé linh hoạt",
    description: "Cung cấp giá vé sinh viên ưu đãi cho các chuyến bay xuyên đại dương từ 16 tuổi trở lên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://www.lufthansa.com",
    requirements: "Xác minh trạng thái học tập trực tuyến thông qua cổng liên kết UNiDAYS hoặc Student Beans.",
    isHot: false
  },
  {
    id: "b112",
    title: "Nha khoa Paris Orthodontics",
    category: "Lifestyle",
    value: "Trả góp niềng răng 0% & Ưu đãi",
    description: "Gói ưu đãi niềng răng (chỉnh nha) dành riêng cho học sinh sinh viên với chính sách trả góp 0% trực tiếp với nha khoa.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://nhakhoaparis.vn",
    requirements: "Đăng ký khám qua website hoặc tại phòng khám và xuất trình thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b113",
    title: "Zed Editor Education Program",
    category: "Tech & Software",
    value: "Miễn phí Zed Pro trong 1 năm & AI credits",
    description: "Trình soạn thảo mã nguồn thế hệ mới siêu nhanh, hỗ trợ lập trình cộng tác thời gian thực và tích hợp mô hình AI nâng cao.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://zed.dev/education",
    requirements: "Đăng nhập bằng tài khoản GitHub (trên 30 ngày tuổi) và xác thực email trường học.",
    isHot: false
  },
  {
    id: "b114",
    title: "StudentUniverse",
    category: "Travel & Transport",
    value: "Giảm tới 30% vé máy bay & khách sạn",
    description: "Đại lý du lịch trực tuyến chuyên biệt cung cấp vé máy bay và phòng ở giá rẻ dành cho du học sinh toàn cầu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://www.studentuniverse.com",
    requirements: "Xác thực thẻ sinh viên quốc tế hoặc giấy tờ chứng minh đang theo học tại trường đại học.",
    isHot: false
  },
  {
    id: "b115",
    title: "Sunsama Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 50% phí dịch vụ hàng tháng",
    description: "Ứng dụng lập kế hoạch hàng ngày trực quan giúp sắp xếp thời gian làm việc và học tập cân bằng khoa học.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 120,
    link: "https://sunsama.com",
    requirements: "Gửi email yêu cầu giảm giá học sinh tới support@sunsama.com bằng email trường.",
    isHot: false
  },
  {
    id: "b116",
    title: "Akiflow Student Discount",
    category: "Lifestyle",
    value: "Giảm giá tới 50% gói dịch vụ Premium",
    description: "Công cụ tổng hợp công việc từ nhiều nguồn (Gmail, Slack, Notion) và kéo thả trực tiếp lên lịch cá nhân sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 114,
    link: "https://akiflow.com",
    requirements: "Gửi email yêu cầu ưu đãi giáo dục tới đội ngũ hỗ trợ của Akiflow kèm email trường.",
    isHot: false
  },
  {
    id: "b117",
    title: "Balsamiq Cloud Student License",
    category: "Tech & Software",
    value: "Miễn Phí 1 Năm Cloud License",
    description: "Công cụ vẽ phác thảo (wireframe) giao diện UI/UX trực quan và nhanh chóng cho đồ án website, ứng dụng di động.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "6 ngày trước",
    savings: 108,
    link: "https://balsamiq.com/wireframes/cloud/sales/classroom/",
    requirements: "Gửi email yêu cầu đến Balsamiq kèm theo minh chứng học sinh sinh viên hiện tại hoặc email .edu.",
    isHot: false
  },
  {
    id: "b118",
    title: "Spline 3D Education",
    category: "Tech & Software",
    value: "Miễn phí/Giảm giá gói Spline Pro",
    description: "Công cụ thiết kế mô hình 3D tương tác trực tiếp trên trình duyệt web, xuất bản thiết kế sang WebGL/React dễ dàng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 108,
    link: "https://spline.design",
    requirements: "Đăng ký tài khoản và điền thông tin xác thực tại trang Spline Education bằng email trường học.",
    isHot: false
  },
  {
    id: "b119",
    title: "The Washington Post Academic",
    category: "Education",
    value: "Gói Academic chỉ $1 mỗi 4 tuần",
    description: "Truy cập không giới hạn tin tức Hoa Kỳ và thế giới trên website và ứng dụng di động với mức giá ưu đãi lớn (tiết kiệm ~90%).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 107,
    link: "https://www.washingtonpost.com/subscribe/signup/academic",
    requirements: "Xác thực trạng thái học tập qua cổng SheerID tích hợp tại trang đăng ký.",
    isHot: false
  },
  {
    id: "b120",
    title: "Microsoft Azure for Students",
    category: "Tech & Software",
    value: "Tặng $100 Annual Credit + Dịch Vụ Free",
    description: "Tặng $100 tín dụng Azure hàng năm không cần thẻ tín dụng, cộng với quyền truy cập miễn phí các dịch vụ App Services, SQL DB và máy ảo.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "2 ngày trước",
    savings: 100,
    link: "https://azure.microsoft.com/en-us/free/students/",
    requirements: "Đăng ký trực tiếp bằng email đuôi giáo dục (.edu) của trường đại học.",
    isHot: false
  },
  {
    id: "b121",
    title: "AWS Educate Portal",
    category: "Tech & Software",
    value: "Miễn Phí Cloud Labs & AWS Credits",
    description: "Chương trình đào tạo điện toán đám mây Amazon Web Services cung cấp các phòng thực hành miễn phí (labs) và tín dụng AWS cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "3 ngày trước",
    savings: 100,
    link: "https://aws.amazon.com/education/awseducate/",
    requirements: "Đăng ký bằng email trường học. Quyết định phê duyệt trong vòng vài ngày.",
    isHot: false
  },
  {
    id: "b122",
    title: "Apple Store Education",
    category: "Tech & Software",
    value: "Giá Học Tập Cho Mac & iPad + Giảm 10% AppleCare+",
    description: "Ưu đãi đặc quyền cho học sinh, sinh viên và giảng viên khi mua sắm máy tính Mac và máy tính bảng iPad mới tại cửa hàng trực tuyến chính thức của Apple.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.apple.com/us-edu/store",
    requirements: "Xác thực trạng thái sinh viên trực tuyến bằng tài khoản UNiDAYS hoặc cung cấp minh chứng học tập khi mua trực tiếp.",
    isHot: false
  },
  {
    id: "b123",
    title: "Dell University Student Discount",
    category: "Tech & Software",
    value: "Giảm Thêm Đến 10% Cho Laptop & PC",
    description: "Nhận mã giảm giá độc quyền cho các dòng laptop Dell Latitude, XPS, Inspiron và Alienware dành riêng cho học sinh sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.dell.com/en-us/lp/dell-university",
    requirements: "Xác thực trực tiếp bằng email trường (.edu) hoặc qua cổng UNiDAYS/Student Beans.",
    isHot: false
  },
  {
    id: "b124",
    title: "HP Student Store",
    category: "Tech & Software",
    value: "Giảm Giá Lên Đến 40% Thiết Bị HP",
    description: "Chương trình HP Education Store cung cấp ưu đãi chiết khấu trực tiếp trên laptop, máy tính để bàn, màn hình và máy in.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.hp.com/us-en/shop/cv/hp-education-store",
    requirements: "Đăng ký tài khoản HP Store bằng email giáo dục (.edu) hợp lệ.",
    isHot: false
  },
  {
    id: "b125",
    title: "Microsoft Store Student",
    category: "Tech & Software",
    value: "Giảm Tới 10% Surface & Phụ Kiện",
    description: "Ưu đãi giảm giá trực tiếp khi mua máy tính xách tay Surface Laptop, máy tính bảng Surface Pro và các phụ kiện Surface chính hãng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.microsoft.com/en-us/store/b/education",
    requirements: "Đăng nhập bằng tài khoản Microsoft cá nhân và xác thực email trường học.",
    isHot: false
  },
  {
    id: "b126",
    title: "Razer Education Program",
    category: "Tech & Software",
    value: "Giảm 15% Phụ Kiện & 5% Laptop",
    description: "Tiết kiệm chi phí khi trang bị thiết bị công nghệ, gaming và học tập hiệu suất cao của Razer cho sinh viên, giảng viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.razer.com/education",
    requirements: "Xác thực thông qua UNiDAYS, Student Beans hoặc bằng email trường học.",
    isHot: false
  },
  {
    id: "b127",
    title: "Japan Airlines Sky Mate",
    category: "Travel & Transport",
    value: "Giảm tới 50% vé bay nội địa Nhật sát giờ",
    description: "Đặc quyền giá vé 'Sky Mate' cực rẻ cho hành khách từ 12-25 tuổi đặt vé sát giờ bay nội địa Nhật, cùng thẻ tín dụng JALCARD navi miễn phí niên hạn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.jal.co.jp",
    requirements: "Đăng ký tài khoản JAL Mileage Bank và xác thực thông tin ngày sinh/thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b128",
    title: "Eurail Youth Pass",
    category: "Travel & Transport",
    value: "Giảm giá tới 25% vé tàu Eurail Pass",
    description: "Đặc quyền vé tàu đi lại không giới hạn trên hệ thống đường sắt của 33 quốc gia châu Âu dành cho hành khách từ 12 đến 27 tuổi.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.eurail.com",
    requirements: "Xác thực độ tuổi trực tiếp bằng hộ chiếu khi mua vé trực tuyến (không cần thẻ sinh viên).",
    isHot: false
  },
  {
    id: "b129",
    title: "Marvel App Student Discount",
    category: "Tech & Software",
    value: "Giảm 70% các gói thuê bao năm",
    description: "Công cụ thiết kế UI/UX kéo thả nhanh, biến các bản phác thảo vẽ tay thành ứng dụng tương tác di động/web trong vài phút.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://marvelapp.com",
    requirements: "Xác thực tư cách sinh viên thông qua cổng đối tác Student Beans.",
    isHot: false
  },
  {
    id: "b130",
    title: "Nha khoa Kim Student Program",
    category: "Lifestyle",
    value: "Trả góp chỉnh nha 0% & Giảm giá",
    description: "Trả góp niềng răng lãi suất 0% chia nhỏ theo tháng cho sinh viên cùng các chương trình cạo vôi răng ưu đãi.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://nhakhoakim.com",
    requirements: "Đăng ký lịch khám qua hotline/website và mang theo thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b131",
    title: "FL Studio Academic Edition",
    category: "Tech & Software",
    value: "Signature Bundle Academic Edition giá $199",
    description: "Phần mềm làm nhạc (DAW) chuyên nghiệp được nhiều nhà sản xuất âm nhạc nổi tiếng tin dùng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.image-line.com",
    requirements: "Xác thực giấy tờ nhập học thông qua nhà phân phối phần mềm âm nhạc được ủy quyền ( Thomann).",
    isHot: false
  },
  {
    id: "b132",
    title: "EndNote Academic License",
    category: "Education",
    value: "Bản quyền trọn đời giá sinh viên đặc biệt",
    description: "Công cụ quản lý tài liệu tham khảo và tự động trích dẫn khoa học chuẩn mực quốc tế cho nghiên cứu sinh tốt nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://endnote.com",
    requirements: "Xác thực trạng thái học thuật qua cổng Proxi.id bằng thẻ sinh viên hoặc email trường.",
    isHot: false
  },
  {
    id: "b133",
    title: "Linode (Akamai) Cloud Credit",
    category: "Tech & Software",
    value: "Miễn phí $100 Cloud Credits sử dụng trong 60 ngày",
    description: "Akamai Cloud (trước đây là Linode) cung cấp $100 tín dụng đám mây miễn phí cho học sinh, sinh viên để triển khai cloud VPS, lưu trữ dữ liệu và thử nghiệm các dự án lập trình.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 100,
    link: "https://www.linode.com/",
    requirements: "Đăng ký tài khoản mới trên trang chính thức của Akamai Cloud và xác thực phương thức thanh toán hợp lệ.",
    isHot: false
  },
  {
    id: "b134",
    title: "Linear Project Manager",
    category: "Tech & Software",
    value: "Miễn Phí Linear Premium Workspace",
    description: "Công cụ quản lý dự án và theo dõi bug (issue tracker) chuyên nghiệp chuẩn Agile dành cho các nhóm phát triển phần mềm học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 96,
    link: "https://linear.app/",
    requirements: "Đăng ký workspace Linear bằng địa chỉ email sinh viên trường học.",
    isHot: false
  },
  {
    id: "b135",
    title: "Lucidchart for Education",
    category: "Tech & Software",
    value: "Miễn phí gói Educational nâng cao",
    description: "Công cụ vẽ sơ đồ tư duy, lưu đồ thuật toán và bảng trắng cộng tác trực quan hàng đầu, hỗ trợ đắc lực cho học tập, làm bài tập nhóm.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 96,
    link: "https://www.lucidchart.com/pages/use-case/education",
    requirements: "Đăng ký và xác thực thông qua email trường .edu.",
    isHot: false
  },
  {
    id: "b136",
    title: "Skillshare Student Plan",
    category: "Education",
    value: "Giảm Giá 50% Membership",
    description: "Học tập các kỹ năng thực tế từ các chuyên gia thiết kế, nhiếp ảnh, kinh doanh trực tuyến.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "4 ngày trước",
    savings: 90,
    link: "https://www.skillshare.com/",
    requirements: "Đăng ký bằng email đuôi giáo dục hợp lệ.",
    isHot: false
  },
  {
    id: "b137",
    title: "Loom Screen Recorder",
    category: "Tech & Software",
    value: "Giảm Đến 75% Gói Loom Education",
    description: "Nền tảng ghi màn hình và gửi video tin nhắn nhanh giúp sinh viên thuyết trình bài tập hoặc giao tiếp nhóm từ xa hiệu quả.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 90,
    link: "https://www.loom.com/education",
    requirements: "Xác minh thông qua Atlassian Portal / Goodstack bằng email đuôi nhà trường.",
    isHot: false
  },
  {
    id: "b138",
    title: "Replit Core Student Discount",
    category: "Tech & Software",
    value: "Giảm 50% Gói Replit Core",
    description: "Cho phép sinh viên truy cập công cụ lập trình đám mây Replit Core và Replit Agent (sử dụng AI) với chi phí ưu đãi giảm giá 50% trong 6 tháng đầu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 90,
    link: "https://replit.com/edu",
    requirements: "Đăng ký bằng email trường học và liên kết tài khoản github học tập.",
    isHot: false
  },
  {
    id: "b139",
    title: "Roam Research Scholars Program",
    category: "Education",
    value: "Giảm giá 50% phí dịch vụ hàng tháng",
    description: "Công cụ ghi chú liên kết mạng lưới tư duy (bi-directional linking) hàng đầu dành cho học thuật và nghiên cứu khoa học.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 90,
    link: "https://roamresearch.com",
    requirements: "Nộp đơn đăng ký chương trình học giả (dành cho người dưới 22 tuổi hoặc nghiên cứu viên).",
    isHot: false
  },
  {
    id: "b140",
    title: "Trello Classroom License & Premium",
    category: "Tech & Software",
    value: "Miễn phí Classroom License hoặc giảm 75% Premium",
    description: "Trello cung cấp công cụ quản lý dự án trực quan dựa trên phương pháp Kanban, hỗ trợ tối ưu hóa quy trình làm việc nhóm cho học sinh, sinh viên và giảng viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 90,
    link: "https://www.atlassian.com/solutions/survey/classroom-license-request#/",
    requirements: "Đăng ký yêu cầu Classroom License qua cổng Atlassian và xác thực thông tin học tập qua tổ chức xác thực Percent.",
    isHot: false
  },
  {
    id: "b141",
    title: "Vé xe buýt TP.HCM dành cho HSSV",
    category: "Lifestyle",
    value: "Đồng giá vé lượt 3.000đ hoặc miễn phí một số tuyến",
    description: "Chương trình trợ giá vé xe buýt công cộng của TP.HCM dành riêng cho đối tượng học sinh, sinh viên giúp giảm thiểu chi phí đi lại hàng ngày. Đặc biệt miễn phí một số tuyến trợ giá năm 2026.",
    scope: "Vietnam",
    location: "TP. Hồ Chí Minh",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 85,
    link: "http://buyttphcm.com.vn/",
    requirements: "Xuất trình thẻ học sinh, sinh viên còn hiệu lực khi mua vé trực tiếp trên xe hoặc đăng ký thẻ xe buýt định danh.",
    isHot: false
  },
  {
    id: "b142",
    title: "Duolingo Schools / Classroom",
    category: "Education",
    value: "Đặc Quyền Super Duolingo Miễn Phí",
    description: "Học ngoại ngữ không quảng cáo, vô hạn lượt thử thách qua việc tham gia vào tài khoản lớp học Duolingo Classroom.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "1 tuần trước",
    savings: 84,
    link: "https://schools.duolingo.com/",
    requirements: "Đăng ký lớp học do giáo viên/giảng viên tạo lập bằng mã tham gia (Class code).",
    isHot: false
  },
  {
    id: "b143",
    title: "Scribd Student Subscription",
    category: "Education",
    value: "Giảm Phí Thuê Bao ($4.99/tháng)",
    description: "Gói ưu đãi Scribd/Everand để truy cập không giới hạn hàng triệu cuốn sách điện tử, tài liệu nghiên cứu học thuật, slide và audiobook.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "2 tuần trước",
    savings: 84,
    link: "https://www.scribd.com/promo/student",
    requirements: "Xác thực trạng thái sinh viên qua cổng SheerID.",
    isHot: false
  },
  {
    id: "b144",
    title: "Overleaf Student Plan",
    category: "Education",
    value: "Giảm Giá Gói LaTeX Collaborator",
    description: "Trình soạn thảo văn bản LaTeX cộng tác trực tuyến chuyên nghiệp cho các tài liệu khoa học, luận văn và bài nghiên cứu, hỗ trợ đồng bộ GitHub.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 84,
    link: "https://www.overleaf.com/user/subscription/plans",
    requirements: "Đăng ký với email trường .edu hoặc cung cấp minh chứng học tập.",
    isHot: false
  },
  {
    id: "b145",
    title: "MockFlow Education",
    category: "Tech & Software",
    value: "Giảm 50% giá các gói dịch vụ",
    description: "Công cụ vẽ wireframe nhanh và lập kế hoạch UI/UX cho trang web và ứng dụng di động.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 84,
    link: "https://www.mockflow.com",
    requirements: "Xác thực trạng thái học tập qua cổng giáo dục MockFlow sử dụng email trường học.",
    isHot: false
  },
  {
    id: "b146",
    title: "Intellect Premium Program",
    category: "Lifestyle",
    value: "Miễn Phí 1 Năm App Tâm Lý",
    description: "Ứng dụng chăm sóc sức khỏe tinh thần hàng đầu. Giảm stress, cải thiện giấc ngủ và phát triển bản thân.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "2 ngày trước",
    savings: 80,
    link: "https://www.intellect.co/",
    requirements: "Tài khoản đăng ký bằng email đuôi trường liên kết đối tác.",
    isHot: false
  },
  {
    id: "b147",
    title: "BeStudent Commuting Pack",
    category: "Travel & Transport",
    value: "Giảm 20% beBike & beCar",
    description: "Gói khuyến mãi di chuyển hàng tuần dành riêng cho sinh viên các trường Đại học/Cao đẳng.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "1 ngày trước",
    savings: 80,
    link: "https://be.com.vn",
    requirements: "Xác thực bằng cách upload hình ảnh thẻ sinh viên lên phần BeStudent trong app.",
    isHot: false
  },
  {
    id: "b148",
    title: "NordVPN Student Discount",
    category: "Tech & Software",
    value: "Giảm Giá Đến 60-70% + Tháng Free",
    description: "Ưu đãi giảm giá đặc biệt cho dịch vụ mạng riêng ảo (VPN) bảo mật hàng đầu NordVPN, hỗ trợ học tập an toàn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "1 tuần trước",
    savings: 80,
    link: "https://nordvpn.com/student-discount/",
    requirements: "Xác minh qua cổng Youth Discount, Student Beans hoặc SheerID bằng thẻ sinh viên/email trường.",
    isHot: false
  },
  {
    id: "b149",
    title: "Lenovo Student Store",
    category: "Tech & Software",
    value: "Giảm Giá Thêm Tới 10% Thiết Bị",
    description: "Đặc quyền giá tốt cho các dòng máy Lenovo ThinkPad, Yoga, IdeaPad và Legion phục vụ mục đích học tập và làm việc.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 80,
    link: "https://www.lenovo.com/us/en/student/",
    requirements: "Xác minh qua cổng ID.me hoặc UNiDAYS khi thanh toán trong giỏ hàng.",
    isHot: false
  },
  {
    id: "b150",
    title: "ASUS Store Student",
    category: "Tech & Software",
    value: "Ưu Đãi Giá Giáo Dục Zenbook & ROG",
    description: "ASUS Education Store giảm giá cho các dòng laptop Zenbook, Vivobook và ROG phục vụ cho học sinh sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 80,
    link: "https://www.asus.com/us/store/",
    requirements: "Đăng ký thành viên ASUS bằng email sinh viên trường học.",
    isHot: false
  },
  {
    id: "b151",
    title: "ExpressVPN Student Discount",
    category: "Tech & Software",
    value: "Giảm tới 80% + Tặng thêm 3-4 tháng free",
    description: "Dịch vụ mạng riêng ảo (VPN) bảo mật, ẩn danh và tốc độ cao hàng đầu thế giới giúp truy cập tài nguyên học tập an toàn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 80,
    link: "https://www.expressvpn.com",
    requirements: "Xác minh bằng email giáo dục qua cổng liên kết Student Beans hoặc UNiDAYS.",
    isHot: false
  },
  {
    id: "b152",
    title: "Rosetta Stone Student Discount",
    category: "Education",
    value: "Giảm giá đến 50% học ngoại ngữ",
    description: "Ứng dụng học ngoại ngữ theo phương pháp giao tiếp tự nhiên giảm giá sâu các gói đăng ký dài hạn hoặc trọn đời cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 80,
    link: "https://www.rosettastone.com/",
    requirements: "Xác thực trạng thái học sinh sinh viên qua cổng đối tác Student Beans.",
    isHot: false
  },
  {
    id: "b153",
    title: "Obsidian Sync/Publish",
    category: "Tech & Software",
    value: "Giảm 40% Dịch Vụ Đồng Bộ",
    description: "Giúp sinh viên đồng bộ hóa ghi chú bảo mật Obsidian Sync và xuất bản ghi chú cá nhân lên website cá nhân với chi phí học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 76,
    link: "https://obsidian.md/pricing",
    requirements: "Đăng ký qua email .edu hoặc gửi minh chứng học tập khác tới hỗ trợ của Obsidian.",
    isHot: false
  },
  {
    id: "b154",
    title: "Vultr Student Cloud Credits",
    category: "Tech & Software",
    value: "Miễn phí $50–$100 tín dụng đám mây Vultr VPS",
    description: "Tín dụng đám mây miễn phí cho sinh viên để khởi tạo VPS, máy chủ đám mây, GPU và các giải pháp lưu trữ dữ liệu thông qua liên kết với các chương trình học tập hoặc GitHub Student Pack.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 75,
    link: "https://education.github.com/pack",
    requirements: "Đăng nhập bằng tài khoản GitHub Student Developer Pack để lấy mã coupon hoặc liên kết kích hoạt của Vultr.",
    isHot: false
  },
  {
    id: "b155",
    title: "Deezer Student Premium",
    category: "Lifestyle",
    value: "Giảm Giá 50% Gói Premium",
    description: "Dịch vụ nghe nhạc trực tuyến chất lượng cao với hơn 90 triệu bài hát và các gợi ý âm nhạc cá nhân hóa Flow.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 72,
    link: "https://www.deezer.com/en/offers/student",
    requirements: "Xác thực tài khoản UNiDAYS bằng thẻ sinh viên hoặc email giáo dục.",
    isHot: false
  },
  {
    id: "b156",
    title: "MUBI Cinema Student",
    category: "Lifestyle",
    value: "Giảm Giá 40% Hàng Tháng",
    description: "Nền tảng xem phim điện ảnh nghệ thuật (indie, classic, award-winning) tuyển chọn chất lượng cao.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 72,
    link: "https://mubi.com/student",
    requirements: "Đăng ký qua mubi.com/student bằng địa chỉ email trường học hợp lệ.",
    isHot: false
  },
  {
    id: "b157",
    title: "Hulu Student Discount",
    category: "Lifestyle",
    value: "Gói Hulu (With Ads) Chỉ $1.99/tháng",
    description: "Nền tảng xem phim, chương trình truyền hình và anime trực tuyến với mức giá cực kỳ ưu đãi cho sinh viên (giảm 75% so với giá gốc).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 72,
    link: "https://www.hulu.com/student",
    requirements: "Xác thực qua SheerID (yêu cầu học sinh tại trường đại học/cao đẳng).",
    isHot: false
  },
  {
    id: "b158",
    title: "Tower Git Client",
    category: "Tech & Software",
    value: "Bản Quyền Tower Pro Miễn Phí",
    description: "Một trong những ứng dụng giao diện Git (Git GUI) mạnh mẽ và trực quan nhất dành cho macOS và Windows.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 69,
    link: "https://www.git-tower.com/pricing",
    requirements: "Kích hoạt thông qua GitHub Student Developer Pack hoặc đăng ký bằng email .edu.",
    isHot: false
  },
  {
    id: "b159",
    title: "Tidal Student Music",
    category: "Lifestyle",
    value: "Giảm Giá 50% Hifi Lossless",
    description: "Dịch vụ phát nhạc trực tuyến chất lượng âm thanh Hi-Fi lossless chuẩn studio dành cho người nghe nhạc khó tính.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 66,
    link: "https://tidal.com/pricing",
    requirements: "Xác minh thông qua cổng SheerID bằng tài liệu minh chứng học tập.",
    isHot: false
  },
  {
    id: "b160",
    title: "Hanoi Student Monthly Bus Pass",
    category: "Travel & Transport",
    value: "Vé tháng 1 tuyến 70K, liên tuyến 140K",
    description: "Giảm 50% giá vé tháng xe buýt cho HSSV tại Hà Nội (mức giá thường là 140.000đ/1 tuyến và 280.000đ/liên tuyến).",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 65,
    link: "http://timbus.vn",
    requirements: "Đăng ký thẻ tháng trực tiếp tại quầy hoặc online có dấu xác nhận của trường đại học.",
    isHot: false
  },
  {
    id: "b161",
    title: "Calm Sleep & Meditation",
    category: "Lifestyle",
    value: "Giảm 60% Gói Premium",
    description: "Ứng dụng chăm sóc sức khỏe tinh thần, hỗ trợ giấc ngủ và chánh niệm với kho nhạc thư giãn và câu chuyện kể đêm khuya.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 61,
    link: "https://www.calm.com/",
    requirements: "Xác thực trạng thái sinh viên thông qua Student Beans hoặc Amazon Prime Student.",
    isHot: false
  },
  {
    id: "b162",
    title: "Apple Music & TV+ Bundle",
    category: "Lifestyle",
    value: "Giảm Phí 50% + Tặng Kèm Apple TV+",
    description: "Nghe nhạc chất lượng cao không giới hạn và xem các chương trình phim độc quyền từ Apple TV+.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "1 ngày trước",
    savings: 60,
    link: "https://www.apple.com/apple-music/#student",
    requirements: "Xác thực tài khoản UNiDAYS thông qua thẻ sinh viên hoặc email trường.",
    isHot: false
  },
  {
    id: "b163",
    title: "Adidas Student Offer",
    category: "Lifestyle",
    value: "Giảm Giá 15% Trực Tuyến",
    description: "Nhận mã giảm giá 15% khi mua sắm tất cả các sản phẩm thời trang và giày thể thao Adidas.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "3 ngày trước",
    savings: 60,
    link: "https://www.adidas.com/us/student-discount",
    requirements: "Xác thực thẻ học sinh/sinh viên qua hệ thống UNiDAYS.",
    isHot: false
  },
  {
    id: "b164",
    title: "Bootstrap Studio Student License",
    category: "Tech & Software",
    value: "Bản Quyền Miễn Phí Cho Sinh Viên",
    description: "Phần mềm thiết kế giao diện web responsive chuyên nghiệp kéo thả, tự động sinh code sạch sử dụng framework Bootstrap.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "12 giờ trước",
    savings: 60,
    link: "https://bootstrapstudio.io/pages/student-license",
    requirements: "Đăng ký qua cổng Bootstrap Studio Education bằng email trường hoặc thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b165",
    title: "Evernote Student Discount",
    category: "Tech & Software",
    value: "Giảm Giá 50% Evernote Personal",
    description: "Giảm giá 50% dịch vụ ghi chú và quản lý công việc học tập chuyên nghiệp Evernote Personal để lưu bài giảng, tài liệu nghiên cứu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "6 ngày trước",
    savings: 60,
    link: "https://evernote.com/",
    requirements: "Xác thực trạng thái học sinh sinh viên thông qua cổng UNiDAYS.",
    isHot: false
  },
  {
    id: "b166",
    title: "Headspace Mental Health",
    category: "Lifestyle",
    value: "Thuê Bao Học Đường $9.99/Năm (Giảm 85%)",
    description: "Ứng dụng thiền định và chăm sóc sức khỏe tinh thần hàng đầu giúp giảm stress, cải thiện khả năng tập trung và giấc ngủ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://www.headspace.com/studentplan",
    requirements: "Xác minh trực tiếp trạng thái sinh viên qua cổng SheerID tích hợp trên Headspace.",
    isHot: false
  },
  {
    id: "b167",
    title: "Proton Unlimited Student",
    category: "Tech & Software",
    value: "Giảm 50% Gói Proton Unlimited",
    description: "Truy cập vào toàn bộ bộ dịch vụ bảo mật cao cấp bao gồm Proton Mail, Proton VPN, Proton Drive, Proton Calendar và Proton Pass với 500GB lưu trữ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://proton.me/student",
    requirements: "Xác thực tình trạng sinh viên qua hệ thống Student Beans.",
    isHot: false
  },
  {
    id: "b168",
    title: "Dashlane Premium for Students",
    category: "Tech & Software",
    value: "Miễn phí 1 năm Dashlane Premium",
    description: "Trình quản lý mật khẩu an toàn, cho phép sinh viên lưu trữ mật khẩu không giới hạn và tự động điền thông tin đăng nhập trên nhiều thiết bị.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://www.dashlane.com/students",
    requirements: "Đăng ký và xác thực qua email sinh viên .edu.",
    isHot: false
  },
  {
    id: "b169",
    title: "Peacock Student Discount",
    category: "Lifestyle",
    value: "Peacock Premium Chỉ $5.99/tháng",
    description: "Dịch vụ phát trực tuyến của NBCUniversal với nhiều bộ phim độc quyền và các trận đấu thể thao trực tiếp ưu đãi đặc biệt cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://www.peacocktv.com/student",
    requirements: "Xác thực tình trạng sinh viên qua SheerID.",
    isHot: false
  },
  {
    id: "b170",
    title: "SoundCloud Go+ Student Plan",
    category: "Lifestyle",
    value: "Giảm 50% Gói Premium Music",
    description: "Nền tảng phân phối âm nhạc trực tuyến lớn nhất thế giới, cho phép nghe nhạc không quảng cáo, tải nhạc ngoại tuyến chất lượng cao.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://www.soundcloud.com",
    requirements: "Xác thực thông qua cổng SheerID.",
    isHot: false
  },
  {
    id: "b171",
    title: "Craft.do Education Plan",
    category: "Tech & Software",
    value: "Miễn phí gói Pro hoàn chỉnh",
    description: "Công cụ ghi chú, soạn thảo tài liệu đẹp mắt và quản lý tài liệu cá nhân hỗ trợ AI cực mạnh mẽ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://www.craft.do",
    requirements: "Đăng ký tài khoản mới hoặc đổi email tài khoản hiện tại sang email trường học để tự động kích hoạt.",
    isHot: false
  },
  {
    id: "b172",
    title: "Harvard Business Review Student",
    category: "Education",
    value: "Giảm giá 50% gói Digital/Print",
    description: "Tạp chí quản trị kinh doanh uy tín hàng đầu thế giới giảm giá một nửa phí đăng ký thuê bao dành cho sinh viên và giới học thuật.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://hbr.org/",
    requirements: "Đăng ký bằng địa chỉ email đuôi giáo dục (.edu) hoặc cung cấp minh chứng học tập.",
    isHot: false
  },
  {
    id: "b173",
    title: "LeetCode Premium Student Discount",
    category: "Education",
    value: "Giảm giá gói Premium hàng năm còn $99/năm",
    description: "LeetCode Premium cung cấp quyền truy cập vào kho câu hỏi lập trình lớn nhất thế giới, giải thích chi tiết, trình biên dịch nhanh hơn, và các câu hỏi phỏng vấn thực tế từ các tập đoàn công nghệ lớn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 60,
    link: "https://leetcode.com/student/",
    requirements: "Đăng ký tham gia sự kiện 'Back-to-School' bằng email của trường đại học (.edu) khi đạt tối thiểu 50 người đăng ký cùng trường.",
    isHot: false
  },
  {
    id: "b174",
    title: "GitKraken Client Pro",
    category: "Tech & Software",
    value: "Miễn Phí Bản Quyền GitKraken Pro",
    description: "Giao diện đồ họa (GUI) quản lý Git trực quan và mạnh mẽ nhất hiện nay. Phiên bản Pro giúp quản lý repo lớn và tích hợp mượt mà.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "6 giờ trước",
    savings: 59,
    link: "https://www.gitkraken.com/student-resources",
    requirements: "Đăng ký thông qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b175",
    title: "Nike Student Discount",
    category: "Lifestyle",
    value: "Giảm Giá 10% Đơn Hàng",
    description: "Ưu đãi trực tiếp 10% khi mua sắm các sản phẩm giày, quần áo thể thao Nike chính hãng trực tuyến.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "2 ngày trước",
    savings: 50,
    link: "https://www.nike.com/help/a/student-discount",
    requirements: "Xác minh trạng thái sinh viên thông qua cổng SheerID.",
    isHot: false
  },
  {
    id: "b176",
    title: "Domino's Pizza Student Deal",
    category: "Food & Dining",
    value: "Ưu Đãi Giảm Giá 30%",
    description: "Đặt bánh pizza Domino cỡ vừa và lớn với mức chiết khấu 30% cho các buổi tụ họp học nhóm.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "2 ngày trước",
    savings: 50,
    link: "https://dominos.vn/",
    requirements: "Xuất trình thẻ sinh viên khi nhận hàng hoặc ăn trực tiếp tại nhà hàng.",
    isHot: false
  },
  {
    id: "b177",
    title: "Amtrak Train Discount",
    category: "Travel & Transport",
    value: "Giảm Giá 15% Vé Tàu Hoả",
    description: "Tiết kiệm chi phí đi lại bằng tàu hoả trên khắp nước Mỹ cho học sinh, sinh viên từ 17 đến 25 tuổi.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://www.amtrak.com/student-discounts",
    requirements: "Đặt vé trước ít nhất 1 ngày và xuất trình thẻ sinh viên hợp lệ khi soát vé trên tàu.",
    isHot: false
  },
  {
    id: "b178",
    title: "Logitech Student Store",
    category: "Tech & Software",
    value: "Giảm Giá 25% Chuột & Bàn Phím",
    description: "Tiết kiệm chi phí khi mua chuột, bàn phím, tai nghe, webcam và thiết bị ngoại vi phục vụ học tập và giải trí của Logitech.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://www.logitech.com",
    requirements: "Xác thực qua tài khoản UNiDAYS hoặc Student Beans.",
    isHot: false
  },
  {
    id: "b179",
    title: "Paramount+ Student Offer",
    category: "Lifestyle",
    value: "Giảm Giá 50% Mọi Gói Cước",
    description: "Nền tảng xem phim trực tuyến hàng đầu của Mỹ với kho phim bom tấn đồ sộ và các trận đấu thể thao trực tiếp, giảm nửa giá cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://www.paramountplus.com/account/edu/",
    requirements: "Xác thực tình trạng sinh viên qua SheerID.",
    isHot: false
  },
  {
    id: "b180",
    title: "Expedia Student Discount",
    category: "Travel & Transport",
    value: "Giảm từ 8% đến 10% đặt phòng khách sạn",
    description: "Mã giảm giá độc quyền cho sinh viên khi đặt dịch vụ lưu trú khách sạn trên toàn thế giới qua nền tảng Expedia.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://www.expedia.com",
    requirements: "Xác thực trạng thái sinh viên qua ID.me hoặc cổng Student Beans.",
    isHot: false
  },
  {
    id: "b181",
    title: ".TECH Domains for Students",
    category: "Tech & Software",
    value: "Miễn phí đăng ký tên miền .tech 1 năm & SSL",
    description: ".TECH Domains hợp tác với các chương trình giáo dục như GitHub Student Pack để cung cấp miễn phí 1 năm đăng ký tên miền .tech cho học sinh, sinh viên xây dựng trang web cá nhân.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://get.tech/github-student-pack",
    requirements: "Đăng nhập bằng tài khoản GitHub Student Developer Pack để lấy mã giảm giá hoặc liên kết kích hoạt.",
    isHot: false
  },
  {
    id: "b182",
    title: "Bitbucket Cloud Academic Plan",
    category: "Tech & Software",
    value: "Miễn phí gói Academic không giới hạn cộng tác viên",
    description: "Atlassian cung cấp gói Bitbucket Cloud Academic miễn phí không giới hạn số lượng cộng tác viên cho các kho chứa mã nguồn cá nhân dành cho học sinh, sinh viên và giảng viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 50,
    link: "https://www.atlassian.com/software/bitbucket/pricing",
    requirements: "Đăng ký tài khoản Bitbucket bằng email học thuật (.edu) hoặc liên kết thông qua cổng phần mềm giáo dục của trường.",
    isHot: false
  },
  {
    id: "b183",
    title: "Flinto for Mac",
    category: "Tech & Software",
    value: "Giảm 50% giá bản quyền phần mềm",
    description: "Ứng dụng thiết kế mẫu thử UI/UX mạnh mẽ trên macOS, chuyên hỗ trợ tạo các hiệu ứng chuyển cảnh (transitions) mượt mà.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 49,
    link: "https://www.flinto.com",
    requirements: "Gửi hình ảnh thẻ sinh viên hoặc thời khóa biểu học tập học kỳ hiện tại qua trang mua hàng giáo dục của Flinto.",
    isHot: false
  },
  {
    id: "b184",
    title: "Readwise Reader Student",
    category: "Tech & Software",
    value: "Giảm Giá 50% Mọi Gói Thuê Bao",
    description: "Giải pháp lưu trữ, đồng bộ hóa và ôn tập tự động các phần highlight từ sách (Kindle), bài báo, và tài liệu đọc trực tuyến cho học sinh, sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 48,
    link: "https://readwise.io",
    requirements: "Gửi email đăng ký tới hello@readwise.io bằng email trường học hoặc gửi minh chứng học tập.",
    isHot: false
  },
  {
    id: "b185",
    title: "VinaPhone YOLO100M Student Pack",
    category: "Travel & Transport",
    value: "1GB data/ngày & Free YouTube/TikTok/FB",
    description: "Gói data dành cho giới trẻ và HSSV với dung lượng lớn cùng đặc quyền miễn phí data tốc độ cao khi lướt TikTok, xem YouTube và Facebook.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 48,
    link: "https://vinaphone.com.vn/",
    requirements: "Đăng ký qua cú pháp SMS DK YOLO100M gửi 888 đối với SIM sinh viên hoặc thuê bao thuộc danh sách ưu đãi.",
    isHot: false
  },
  {
    id: "b186",
    title: "MobiFone MXH100 Combo",
    category: "Travel & Transport",
    value: "1GB data/ngày & Free Social Media",
    description: "Gói cước combo tích hợp data tốc độ cao và miễn phí data truy cập không giới hạn cho các nền tảng mạng xã hội và giải trí phổ biến nhất của sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 48,
    link: "https://mobifone.vn/",
    requirements: "Soạn tin nhắn ON MXH100 gửi 9084 bằng SIM sinh viên Q-Student đã kích hoạt.",
    isHot: false
  },
  {
    id: "b187",
    title: "HCMC Student Bus Ticket",
    category: "Travel & Transport",
    value: "Vé lượt 3K hoặc miễn phí trọn gói",
    description: "Giảm giá vé lẻ từ 6-7K xuống còn 3.000đ cho sinh viên. Đặc biệt từ 01/07/2026 đến 31/12/2026 được miễn phí 100% khi đi xe buýt trợ giá tại TP.HCM.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 45,
    link: "http://buyttphcm.com.vn",
    requirements: "Xuất trình thẻ sinh viên cho tiếp viên hoặc quét mã định danh qua ứng dụng MultiGo/VNeID.",
    isHot: false
  },
  {
    id: "b188",
    title: "ClickUp Academic Discount",
    category: "Tech & Software",
    value: "Giảm giá đặc biệt cho gói trả phí",
    description: "Hệ thống quản lý công việc và dự án học tập 'tất cả trong một', giúp theo dõi tiến độ đồ án nhóm và học tập cá nhân hiệu quả.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 42,
    link: "https://clickup.com",
    requirements: "Điền đơn đăng ký chương trình học thuật trực tiếp trên trang chủ ClickUp.",
    isHot: false
  },
  {
    id: "b189",
    title: "CyberGhost Student Discount",
    category: "Tech & Software",
    value: "Giảm tới 84% + Tặng thêm tháng free",
    description: "Giải pháp VPN tốc độ cao, giao diện thân thiện với các máy chủ tối ưu hóa riêng cho việc nghiên cứu và truy cập web an toàn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 40,
    link: "https://www.cyberghostvpn.com",
    requirements: "Xác thực tư cách sinh viên thông qua Student Beans hoặc UNiDAYS.",
    isHot: false
  },
  {
    id: "b190",
    title: "VUS Student Study Support",
    category: "Education",
    value: "Học bổng bán phần & Trả góp học phí 0%",
    description: "Ưu đãi giảm học phí các khóa tiếng Anh giao tiếp hoặc IELTS và trả góp học phí lãi suất 0% qua ngân hàng liên kết.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 40,
    link: "https://vus.edu.vn",
    requirements: "Đăng ký trực tuyến hoặc trực tiếp và mang theo thẻ sinh viên khi nhập học.",
    isHot: false
  },
  {
    id: "b191",
    title: "Levi's Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 15% khi mua sắm online",
    description: "Thương hiệu quần jean biểu tượng Levi's giảm giá 15% cho tất cả đơn hàng trực tuyến của học sinh, sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 37,
    link: "https://www.levi.com/",
    requirements: "Xác minh trạng thái sinh viên qua cổng SheerID để nhận mã giảm giá một lần.",
    isHot: false
  },
  {
    id: "b192",
    title: "Klook Travel Activities",
    category: "Lifestyle",
    value: "Giảm Giá Đến 18% Đặt Tour & Vé",
    description: "Nền tảng đặt vé vui chơi, tour du lịch, phương tiện di chuyển và sim thẻ tiện lợi cho sinh viên đi trải nghiệm.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 36,
    link: "https://www.klook.com/",
    requirements: "Xác minh qua Student Beans hoặc UNiDAYS tùy theo khu vực địa lý.",
    isHot: false
  },
  {
    id: "b193",
    title: "Cacoo Education Plan",
    category: "Tech & Software",
    value: "Giảm 50% gói dịch vụ nhóm (Team Plan)",
    description: "Phần mềm thiết kế sơ đồ, wireframe và mindmap cộng tác thời gian thực trực tuyến cho học tập nhóm.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 36,
    link: "https://cacoo.com",
    requirements: "Đăng ký trực tiếp qua trang Cacoo dành cho giáo dục.",
    isHot: false
  },
  {
    id: "b194",
    title: "MindMeister for Education",
    category: "Tech & Software",
    value: "Giảm 50% chi phí các gói trả phí",
    description: "Công cụ vẽ sơ đồ tư duy trực tuyến hỗ trợ cộng tác thời gian thực và trình bày ý tưởng học thuật chuyên nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 36,
    link: "https://www.mindmeister.com",
    requirements: "Đăng ký tài khoản cơ bản rồi gửi yêu cầu nâng cấp kèm minh chứng học tập qua cổng hỗ trợ.",
    isHot: false
  },
  {
    id: "b195",
    title: "Raycast Pro Student Program",
    category: "Tech & Software",
    value: "Giảm giá 50% gói Raycast Pro",
    description: "Công cụ launcher siêu tốc trên macOS tích hợp công cụ viết, tìm kiếm thông tin bằng AI và phím tắt cực mạnh.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 36,
    link: "https://raycast.com/student-program",
    requirements: "Nộp biểu mẫu đăng ký chương trình sinh viên với thông tin email và bằng chứng đang theo học.",
    isHot: false
  },
  {
    id: "b196",
    title: "Viettel GIC90N Student Package",
    category: "Travel & Transport",
    value: "1GB data/ngày & Free TikTok/FB",
    description: "Gói cước đặc quyền mới dành riêng cho học sinh sinh viên từ 14–22 tuổi. Miễn phí data tốc độ cao khi truy cập Facebook, TikTok, Messenger và đọc sách Mydio.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 36,
    link: "https://vietteltelecom.vn/",
    requirements: "Xác thực trực tiếp qua ứng dụng My Viettel hoặc mang CCCD ra cửa hàng Viettel để kích hoạt.",
    isHot: false
  },
  {
    id: "b197",
    title: "Under Armour Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 15%–20% đồ thể thao",
    description: "Thương hiệu thời trang thể thao hiệu năng cao Under Armour giảm giá lên tới 20% cho học sinh sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 35,
    link: "https://www.underarmour.com/",
    requirements: "Xác thực tài khoản sinh viên qua UNiDAYS để nhận mã giảm giá.",
    isHot: false
  },
  {
    id: "b198",
    title: "Scrintal for Education",
    category: "Education",
    value: "Giảm giá 30% gói dịch vụ Pro",
    description: "Công cụ ghi chép dạng thẻ kết hợp bảng trắng kỹ thuật số (visual board) giúp nghiên cứu tài liệu dễ dàng.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 32,
    link: "https://www.scrintal.com",
    requirements: "Đăng ký và thanh toán tài khoản bằng email đuôi nhà trường đại học hoặc cao đẳng.",
    isHot: false
  },
  {
    id: "b199",
    title: "Babbel Language Learning",
    category: "Education",
    value: "Giảm Giá 65% Cho Học Ngoại Ngữ",
    description: "Học tiếng Anh, tiếng Tây Ban Nha, tiếng Pháp... với phương pháp phản xạ khoa học và ưu đãi tới 65%.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "5 ngày trước",
    savings: 30,
    link: "https://www.babbel.com/",
    requirements: "Xác minh tư cách học sinh sinh viên qua dịch vụ đối tác.",
    isHot: false
  },
  {
    id: "b200",
    title: "Phuc Long Tea & Coffee Student Offer",
    category: "Food & Dining",
    value: "Giảm Giá 10% Hóa Đơn",
    description: "Ưu đãi trực tiếp cho các thức uống trà sữa, trà đào, cafe nổi tiếng của Phúc Long tại cửa hàng.",
    scope: "Vietnam",
    location: "Việt Nam (Toàn quốc)",
    lifetime: false,
    updatedAt: "12 giờ trước",
    savings: 30,
    link: "https://phuclong.com.vn/",
    requirements: "Xuất trình thẻ sinh viên chính chủ khi thanh toán tại quầy.",
    isHot: false
  },
  {
    id: "b201",
    title: "Grammarly Writing Assistant",
    category: "Tech & Software",
    value: "Giảm Giá 20% Gói Grammarly Pro",
    description: "Trợ lý viết tiếng Anh bằng AI giúp sửa lỗi ngữ pháp, tối ưu hóa câu từ và cải thiện phong cách viết học thuật chuyên nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.grammarly.com/",
    requirements: "Xác thực tình trạng sinh viên qua SheerID hoặc email giáo dục (.edu).",
    isHot: false
  },
  {
    id: "b202",
    title: "Bamboo Airways Student Promo",
    category: "Travel & Transport",
    value: "Vé ưu đãi từ 99,000 VND",
    description: "Hãng hỗ trợ sinh viên thông qua các chương trình khuyến mãi mùa tựu trường (tháng 8-9) với giá vé rẻ hoặc tặng dặm thưởng tích lũy hội viên Bamboo Club.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.bambooairways.com",
    requirements: "Đăng ký hội viên Bamboo Club và cập nhật thông tin thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b203",
    title: "FlixBus Intercity Discount",
    category: "Travel & Transport",
    value: "Giảm Giá 10% - 15% Vé Xe Khách",
    description: "Dịch vụ xe khách liên tỉnh giá rẻ tại Châu Âu và Mỹ, giúp sinh viên di chuyển tiết kiệm giữa các thành phố học tập hoặc đi du lịch.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.flixbus.com/",
    requirements: "Xác thực qua hệ thống UNiDAYS, Student Beans hoặc thẻ ISIC.",
    isHot: false
  },
  {
    id: "b204",
    title: "TablePlus Student License",
    category: "Tech & Software",
    value: "Giảm 50% bản quyền phần mềm",
    description: "Công cụ quản lý cơ sở dữ liệu (SQL & NoSQL) giao diện native mượt mà và cực nhanh cho nhà phát triển trên macOS/Windows.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://tableplus.com",
    requirements: "Gửi email yêu cầu đến đội ngũ hỗ trợ của TablePlus bằng email trường học kèm thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b205",
    title: "Vé tàu hỏa Đường sắt Việt Nam (VNR)",
    category: "Lifestyle",
    value: "Giảm 10% giá vé tàu trên tất cả đoàn tàu khách",
    description: "Tổng công ty Đường sắt Việt Nam áp dụng chính sách giảm 10% giá vé tàu hỏa trên tất cả các tuyến cho học sinh, sinh viên quanh năm.",
    scope: "Vietnam",
    location: "Việt Nam / Toàn quốc",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://dsvn.vn/",
    requirements: "Xuất trình thẻ sinh viên chính thức hoặc giấy báo nhập học (cho tân sinh viên) tại ga khi mua vé và khi lên tàu.",
    isHot: false
  },
  {
    id: "b206",
    title: "Hoàng Hà Mobile HSSV (Hoàng Hà Edu)",
    category: "Tech & Software",
    value: "Giảm giá đặc quyền & Trả góp 0%",
    description: "Đặc quyền giảm giá trực tiếp cho thiết bị công nghệ học tập dành cho HSSV từ 14-22 tuổi, cùng thủ tục trả góp 0% lãi suất đơn giản.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://hoanghamobile.com",
    requirements: "Đăng ký thành viên Hoàng Hà Edu qua website hoặc tại quầy bằng thẻ HSSV.",
    isHot: false
  },
  {
    id: "b207",
    title: "ASOS Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10% đơn hàng thời trang",
    description: "Trang mua sắm thời trang quốc tế lớn nhất dành cho giới trẻ giảm 10% cho mọi đơn hàng thời trang của sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.asos.com/",
    requirements: "Xác minh tư cách sinh viên thông qua cổng SheerID tích hợp trên website ASOS.",
    isHot: false
  },
  {
    id: "b208",
    title: "Ray-Ban Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 20% kính mắt chính hãng",
    description: "Thương hiệu kính mắt Ray-Ban giảm 20% cho sinh viên khi mua các sản phẩm kính chính hãng trực tuyến.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 30,
    link: "https://www.ray-ban.com/",
    requirements: "Xác minh tư cách học sinh sinh viên qua hệ thống UNiDAYS.",
    isHot: false
  },
  {
    id: "b209",
    title: "MasterClass Online Lessons",
    category: "Education",
    value: "Giảm Giá 15% Thuê Bao Năm",
    description: "Nền tảng học trực tuyến với các bài giảng từ những chuyên gia, nghệ sĩ, doanh nhân nổi tiếng nhất thế giới trong nhiều lĩnh vực.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 27,
    link: "https://www.masterclass.com/",
    requirements: "Xác minh tình trạng học tập thông qua Student Beans hoặc UNiDAYS.",
    isHot: false
  },
  {
    id: "b210",
    title: "WolframAlpha Pro Student",
    category: "Education",
    value: "Giảm Giá 30% Bản Pro",
    description: "Công cụ tính toán tri thức thông minh giải các bài toán toán học, khoa học, phân tích dữ liệu chuyên sâu và hiển thị lời giải từng bước.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 26,
    link: "https://www.wolframalpha.com/pro/",
    requirements: "Xác minh qua cổng Student Beans hoặc UNiDAYS.",
    isHot: false
  },
  {
    id: "b211",
    title: "Nova Editor (by Panic)",
    category: "Tech & Software",
    value: "Giảm 25% bản quyền phần mềm macOS",
    description: "Trình soạn thảo code native tuyệt đẹp, hiệu năng cao và đầy đủ tính năng dành riêng cho hệ điều hành macOS từ hãng Panic.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://nova.app",
    requirements: "Gửi liên hệ hoặc email bằng hòm thư giáo dục của trường học để nhận mã giảm giá.",
    isHot: false
  },
  {
    id: "b212",
    title: "Di Động Việt Student Deal",
    category: "Tech & Software",
    value: "Giảm thêm 100K - 1.000K",
    description: "Ưu đãi giảm giá trực tiếp bổ sung cho sinh viên khi mua điện thoại Android, iPhone, iPad hoặc MacBook bên cạnh các ưu đãi sẵn có.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://didongviet.vn",
    requirements: "Xuất trình thẻ sinh viên chính chủ và CCCD tại quầy thu ngân khi mua hàng.",
    isHot: false
  },
  {
    id: "b213",
    title: "The Pizza Company Student Combo",
    category: "Lifestyle",
    value: "Mua 1 Tặng 1 Thứ 3 & Thứ 4",
    description: "Chương trình Mua 1 Tặng 1 pizza cỡ vừa/lớn giúp các nhóm sinh viên tiết kiệm chi phí ăn uống họp nhóm hoặc liên hoan.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://thepizzacompany.vn",
    requirements: "Mua mang về hoặc đặt trực tuyến qua website/hotline chính thức.",
    isHot: false
  },
  {
    id: "b214",
    title: "Hostelworld Student Discount",
    category: "Travel & Transport",
    value: "Giảm giá 7% cho mọi đặt phòng hostel",
    description: "Nền tảng tìm kiếm và đặt phòng hostel du lịch bụi lớn nhất dành cho giới trẻ và sinh viên toàn cầu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://www.hostelworld.com",
    requirements: "Xác thực trạng thái học tập thông qua Student Beans, UNiDAYS hoặc mã giảm giá từ thẻ ISIC.",
    isHot: false
  },
  {
    id: "b215",
    title: "Dr. Martens Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10%–15% giày da/boots",
    description: "Hãng giày da Dr. Martens giảm giá cho sinh viên khi mua các sản phẩm giày bốt cổ điển chính hãng online.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://www.drmartens.com/",
    requirements: "Xác minh và lấy mã ưu đãi thông qua cổng đối tác UNiDAYS.",
    isHot: false
  },
  {
    id: "b216",
    title: "Hostinger Student Discount",
    category: "Tech & Software",
    value: "Giảm giá thêm 10%–25% trên giá khuyến mãi gốc",
    description: "Hostinger giảm giá thêm 10% cho sinh viên trên giá đã giảm của các gói hosting chất lượng cao (Shared, Cloud, VPS Hosting) kèm theo tên miền miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 25,
    link: "https://www.hostinger.com/student-discount",
    requirements: "Xác thực trạng thái sinh viên thông qua tài khoản Student Beans để nhận mã giảm giá đặc biệt.",
    isHot: false
  },
  {
    id: "b217",
    title: "RoboForm Password Manager",
    category: "Tech & Software",
    value: "Miễn Phí 1 Năm Bản Pro",
    description: "Ứng dụng quản lý mật khẩu an toàn, tự động điền thông tin và đồng bộ hóa trên mọi thiết bị.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "4 ngày trước",
    savings: 24,
    link: "https://www.roboform.com/student-discount",
    requirements: "Xác thực trạng thái sinh viên bằng email đuôi trường học.",
    isHot: false
  },
  {
    id: "b218",
    title: "Setapp Suite for Mac & iOS",
    category: "Tech & Software",
    value: "Giảm Giá 20% Thuê Bao Năm",
    description: "Nền tảng đăng ký thuê bao trọn gói hơn 240+ ứng dụng chất lượng cao dành cho macOS và iOS (bao gồm CleanMyMac, Ulysses...).",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 24,
    link: "https://setapp.com/",
    requirements: "Đăng ký tài khoản Setapp bằng địa chỉ email sinh viên (.edu).",
    isHot: false
  },
  {
    id: "b219",
    title: "XMind Education Plan",
    category: "Tech & Software",
    value: "Giảm 40% giá mua bản quyền",
    description: "Phần mềm thiết kế sơ đồ tư duy và lập bản đồ ý tưởng đa nền tảng phổ biến bậc nhất thế giới.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 24,
    link: "https://xmind.app",
    requirements: "Đăng ký mua bản quyền giáo dục bằng cách tải lên thẻ sinh viên hoặc biên lai đóng học phí.",
    isHot: false
  },
  {
    id: "b220",
    title: "Viettel GIC70N Student Pack",
    category: "Travel & Transport",
    value: "1GB data/ngày & Free Mydio",
    description: "Gói cước tiết kiệm dành riêng cho học sinh sinh viên từ 14–22 tuổi, cung cấp 1GB data/ngày cùng dịch vụ đọc sách Mydio miễn phí.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 24,
    link: "https://vietteltelecom.vn/",
    requirements: "Đăng ký trực tiếp trên My Viettel hoặc qua cú pháp SMS đối với thuê bao HSSV hợp lệ.",
    isHot: false
  },
  {
    id: "b221",
    title: "Perlego Student Library Discount",
    category: "Education",
    value: "Giảm giá 25% gói đọc sách học thuật",
    description: "Perlego là thư viện học thuật trực tuyến cung cấp quyền truy cập không giới hạn vào hơn 1 triệu đầu sách giáo trình, tài liệu tham khảo khoa học và sách học thuật từ các nhà xuất bản lớn.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 24,
    link: "https://www.perlego.com/",
    requirements: "Xác thực trạng thái sinh viên thông qua tài khoản Student Beans hoặc UNiDAYS để nhận mã giảm giá.",
    isHot: false
  },
  {
    id: "b222",
    title: "Converse Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 15% đơn hàng giày",
    description: "Thương hiệu giày Converse giảm giá 15% cho các đơn hàng giày sneaker và phụ kiện trực tuyến của sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 22,
    link: "https://www.converse.com/",
    requirements: "Xác minh thông tin học sinh sinh viên qua cổng SheerID để nhận mã promo code.",
    isHot: false
  },
  {
    id: "b223",
    title: "Puma Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10%–20% giày thể thao",
    description: "Hãng giày thể thao Puma giảm giá trực tiếp cho sinh viên khi mua sắm quần áo và giày sneaker trực tuyến.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 22,
    link: "https://www.puma.com/",
    requirements: "Đăng nhập và xác thực tài khoản qua cổng UNiDAYS hoặc Student Beans.",
    isHot: false
  },
  {
    id: "b224",
    title: "New Balance Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10%–15% giày sneaker",
    description: "Thương hiệu giày New Balance giảm giá cho sinh viên khi mua các sản phẩm giày chạy bộ và sneaker nguyên giá.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 22,
    link: "https://www.newbalance.com/",
    requirements: "Xác thực tài khoản học sinh sinh viên qua UNiDAYS hoặc Student Beans tùy khu vực.",
    isHot: false
  },
  {
    id: "b225",
    title: "Booking.com Student Deals",
    category: "Travel & Transport",
    value: "Hoàn Tiền 4% + Đặc Quyền Genius",
    description: "Nền tảng đặt phòng khách sạn, homestay và vé máy bay lớn nhất thế giới với các đặc quyền phòng nghỉ giá rẻ cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.booking.com/",
    requirements: "Truy cập thông qua link liên kết của cổng Student Beans hoặc UNiDAYS.",
    isHot: false
  },
  {
    id: "b226",
    title: "United Airlines Young Traveler",
    category: "Travel & Transport",
    value: "Giảm 5% giá vé máy bay",
    description: "Ưu đãi giảm giá vé cho hành khách trẻ tuổi đặt chỗ qua ứng dụng di động của United Airlines.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.united.com",
    requirements: "Yêu cầu là thành viên MileagePlus từ 18 đến 23 tuổi và thực hiện đặt vé trực tiếp trên App United.",
    isHot: false
  },
  {
    id: "b227",
    title: "Pizza Hut Vietnam Group Student Deal",
    category: "Lifestyle",
    value: "Giảm 40% combo nhóm & BOGO",
    description: "Combo nhóm cho HSSV giảm đến 40%, cùng chương trình Mua 1 Tặng 1 pizza cỡ vừa/lớn vào ngày thường.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://pizzahut.vn",
    requirements: "Đăng ký thành viên Hut Rewards qua email/số điện thoại để đặt combo.",
    isHot: false
  },
  {
    id: "b228",
    title: "The New Gym Student Membership",
    category: "Lifestyle",
    value: "Chỉ từ 299K/tháng, không hợp đồng",
    description: "Gói tập gym giá cực rẻ không phát sinh phí ẩn, không bắt đóng trước cả năm, tập luyện linh hoạt.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://thenewgym.vn",
    requirements: "Đăng ký tại CLB và xuất trình thẻ sinh viên để kích hoạt ưu đãi.",
    isHot: false
  },
  {
    id: "b229",
    title: "Generator Hostels Student Discount",
    category: "Travel & Transport",
    value: "Giảm giá 10% khi đặt phòng trực tiếp",
    description: "Chuỗi nhà nghỉ (hostel) mang phong cách thiết kế nghệ thuật cao cấp tại các thành phố lớn tại Âu Mỹ.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://staygenerator.com",
    requirements: "Nhập mã thẻ ISIC và thông tin xác thực khi tiến hành đặt phòng trên staygenerator.com.",
    isHot: false
  },
  {
    id: "b230",
    title: "National Express Student Discount",
    category: "Travel & Transport",
    value: "Giảm từ 10% - 20% giá vé xe khách liên tỉnh",
    description: "Hãng xe khách đường dài lớn nhất Vương Quốc Anh kết nối các thành phố lớn và sân bay tiện lợi.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.nationalexpress.com",
    requirements: "Xác thực thông qua tài khoản UNiDAYS, Student Beans hoặc TOTUM khi tiến hành đặt vé online.",
    isHot: false
  },
  {
    id: "b231",
    title: "CleanMyMac Education Discount",
    category: "Tech & Software",
    value: "Giảm giá 30% bản quyền phần mềm tối ưu",
    description: "Công cụ dọn dẹp hệ thống, tối ưu hóa bộ nhớ và bảo vệ macOS khỏi phần mềm độc hại chính hãng MacPaw.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://macpaw.com",
    requirements: "Xác thực email sinh viên đuôi trường học hoặc gửi thư trực tiếp cho education@macpaw.com.",
    isHot: false
  },
  {
    id: "b232",
    title: "H&M Student Offer",
    category: "Lifestyle",
    value: "Giảm giá 10% đơn hàng online",
    description: "Hãng thời trang Thụy Điển H&M giảm giá 10% trực tiếp trên hóa đơn mua sắm trực tuyến cho các sản phẩm nguyên giá.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.hm.com/",
    requirements: "Xác thực tài khoản học sinh sinh viên qua UNiDAYS hoặc Student Beans để lấy mã.",
    isHot: false
  },
  {
    id: "b233",
    title: "Gymshark Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10% đồ thể thao gym",
    description: "Thương hiệu đồ thể thao Gymshark giảm giá 10% cho sinh viên trang bị quần áo tập luyện thể thao chất lượng cao.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.gymshark.com/",
    requirements: "Đăng nhập và xác minh trạng thái sinh viên qua hệ thống Student Beans.",
    isHot: false
  },
  {
    id: "b234",
    title: "Crocs Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 15%–20% giày Crocs",
    description: "Thương hiệu dép Crocs giảm giá cho sinh viên khi mua các dòng sản phẩm giày dép clog nhựa và sticker Jibbitz trực tuyến.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 20,
    link: "https://www.crocs.com/",
    requirements: "Xác minh thông tin học sinh sinh viên qua UNiDAYS, Student Beans hoặc ID.me.",
    isHot: false
  },
  {
    id: "b235",
    title: "Beta Cinemas (Vietnam)",
    category: "Lifestyle",
    value: "Vé xem phim đồng giá từ 40,000 VND",
    description: "Chương trình ưu đãi vé xem phim 2D/3D đồng giá cực rẻ dành riêng cho học sinh, sinh viên dưới 22 tuổi tại tất cả các cụm rạp Beta Cinemas trên toàn quốc.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.betacinemas.vn",
    requirements: "Xuất trình Thẻ học sinh/sinh viên hoặc CCCD/VNeID tại quầy vé.",
    isHot: false
  },
  {
    id: "b236",
    title: "BHD Star Cineplex (Vietnam)",
    category: "Lifestyle",
    value: "Vé U22 từ 48,000 VND",
    description: "Ưu đãi giá vé xem phim đặc biệt dành cho thành viên U22 (dưới 22 tuổi) áp dụng cho các suất chiếu hàng ngày.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.bhdstar.vn",
    requirements: "Xuất trình CCCD/VNeID, thẻ HSSV hoặc mặc đồng phục học sinh khi mua vé trực tiếp tại quầy.",
    isHot: false
  },
  {
    id: "b237",
    title: "Galaxy Cinema (Vietnam)",
    category: "Lifestyle",
    value: "Vé U22 đồng giá từ 45,000 VND",
    description: "Áp dụng giá vé U22 ưu đãi cho học sinh, sinh viên từ 13 đến 22 tuổi vào các ngày trong tuần (Thứ 2, Thứ 4, Thứ 5).",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.galaxycine.vn",
    requirements: "Xuất trình Thẻ HSSV hoặc CCCD/VNeID tại rạp để đối chiếu độ tuổi trước khi vào phòng chiếu.",
    isHot: false
  },
  {
    id: "b238",
    title: "Keeper Security Student",
    category: "Tech & Software",
    value: "Giảm 50% dịch vụ lưu trữ mật khẩu Unlimited",
    description: "Trình quản lý mật khẩu an toàn và mã hóa dữ liệu cá nhân hàng đầu thế giới dành cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.keepersecurity.com",
    requirements: "Xác thực thông qua cổng đối tác Student Beans.",
    isHot: false
  },
  {
    id: "b239",
    title: "IIG Việt Nam TOEIC/TOEFL Registration",
    category: "Education",
    value: "Giảm lệ phí thi & Tiết kiệm đến 450K",
    description: "Ưu đãi lệ phí thi chứng chỉ tiếng Anh quốc tế TOEIC và TOEFL ITP dành riêng cho sinh viên hệ chính quy.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://online.iigvietnam.com",
    requirements: "Đăng ký thi online và xuất trình thẻ sinh viên chính quy còn hiệu lực kèm CCCD tại văn phòng IIG.",
    isHot: false
  },
  {
    id: "b240",
    title: "Ulysses writing app",
    category: "Education",
    value: "Gói sinh viên ưu đãi đặc biệt $10.99/6 tháng",
    description: "Ứng dụng viết văn, ghi chép và soạn thảo tài liệu khoa học tinh gọn, tập trung cao cho hệ sinh thái Apple.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://ulysses.app",
    requirements: "Xác thực thẻ sinh viên cứng hoặc giấy tờ học tập trực tiếp từ giao diện ứng dụng.",
    isHot: false
  },
  {
    id: "b241",
    title: "Vans Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10%–15% giày Vans",
    description: "Thương hiệu giày Vans giảm giá trực tuyến cho sinh viên mua sắm giày sneaker trượt ván và balo học tập.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.vans.com/",
    requirements: "Xác minh trạng thái sinh viên qua SheerID (US) hoặc UNiDAYS/Student Beans (UK/Global).",
    isHot: false
  },
  {
    id: "b242",
    title: "Champion Student Discount",
    category: "Lifestyle",
    value: "Giảm giá 10%–20% quần áo",
    description: "Thương hiệu thời trang thể thao Champion giảm giá cho sinh viên khi mua sắm các mẫu áo hoodie, áo phông online.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 18,
    link: "https://www.champion.com/",
    requirements: "Xác minh tư cách sinh viên thông qua UNiDAYS, Student Beans hoặc ID.me.",
    isHot: false
  },
  {
    id: "b243",
    title: "Cake by VPBank Student Card",
    category: "Lifestyle",
    value: "Free Cake Mastercard & Cashback",
    description: "Ngân hàng số miễn phí phát hành và duy trì thẻ, liên kết sâu với Be Group hoàn tiền di chuyển và mua sắm online cho sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 16,
    link: "https://cake.vn/",
    requirements: "Đăng ký và định danh trực tuyến eKYC qua app Cake trong 2 phút.",
    isHot: false
  },
  {
    id: "b244",
    title: "AeroPress Coffee Student",
    category: "Food & Dining",
    value: "Giảm Giá 10% Cho Máy Pha Cafe",
    description: "Nhận ưu đãi 10% để tự chuẩn bị những ly cafe Aeropress sạch và đậm vị ngay tại ký túc xá.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "6 ngày trước",
    savings: 15,
    link: "https://aeropress.com/",
    requirements: "Xác minh tư cách học sinh sinh viên qua dịch vụ đối tác.",
    isHot: false
  },
  {
    id: "b245",
    title: "Namecheap NC.ME (Namecheap for Education)",
    category: "Tech & Software",
    value: "Miễn phí tên miền .me trong 1 năm & SSL",
    description: "Chương trình NC.ME cung cấp miễn phí một tên miền .me trong vòng 1 năm và chứng chỉ bảo mật SSL miễn phí cho sinh viên để phát triển thương hiệu cá nhân hoặc làm blog, portfolio.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 15,
    link: "https://nc.me/",
    requirements: "Đăng ký trực tiếp bằng email trường (.edu) hoặc kết nối qua GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b246",
    title: "RapidAPI Client (formerly Paw)",
    category: "Tech & Software",
    value: "Giảm 30% bản quyền cá nhân",
    description: "Công cụ thiết kế, kiểm thử và tương tác API REST/GraphQL chuyên nghiệp và trực quan trên hệ điều hành macOS.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 15,
    link: "https://paw.cloud",
    requirements: "Đăng ký trực tuyến và tải lên minh chứng đăng ký học tập hoặc thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b247",
    title: "Popeyes Vietnam Student Combo",
    category: "Lifestyle",
    value: "Combo Siêu No từ 89K",
    description: "Combo gà rán/burger kèm nước ngọt cùng ưu đãi Mua 1 Tặng 1 dành cho sinh viên đặt online hoặc tại cửa hàng vào Thứ 4 hàng tuần.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 15,
    link: "https://popeyes.vn",
    requirements: "Áp dụng mã giảm giá trên website/app Popeyes hoặc mua trực tiếp tại quầy.",
    isHot: false
  },
  {
    id: "b248",
    title: "iMazing Education Program",
    category: "Tech & Software",
    value: "Giảm giá 30% bản quyền phần mềm",
    description: "Công cụ quản lý thiết bị iOS (iPhone, iPad) chuyên nghiệp thay thế iTunes, hỗ trợ sao lưu, chuyển dữ liệu và quản lý file tối ưu.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 15,
    link: "https://imazing.com/",
    requirements: "Xác thực học sinh qua cổng SheerID, Student Beans hoặc UNiDAYS trực tiếp tại trang cửa hàng.",
    isHot: false
  },
  {
    id: "b249",
    title: "Name.com Education Domain Program",
    category: "Tech & Software",
    value: "Miễn phí đăng ký tên miền 1 năm & SSL miễn phí",
    description: "Name.com hợp tác với GitHub Education cung cấp cho sinh viên một tên miền miễn phí trong 1 năm đầu tiên (như .live, .studio, .software, .rocks, .ninja) đi kèm chứng chỉ bảo mật SSL miễn phí.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 15,
    link: "https://www.name.com/partner/github-students",
    requirements: "Đăng nhập bằng tài khoản GitHub học sinh/sinh viên đã được phê duyệt trong GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b250",
    title: "Morgen Calendar Pro Discount",
    category: "Lifestyle",
    value: "Giảm 25% trọn đời gói Morgen Pro",
    description: "Công cụ tổng hợp lịch trình từ nhiều nguồn lịch, hỗ trợ time-blocking và quản lý công việc học tập hiệu quả.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 13,
    link: "https://www.morgen.so",
    requirements: "Liên hệ đội ngũ hỗ trợ của Morgen bằng email đuôi trường học để được áp dụng mã giảm giá.",
    isHot: false
  },
  {
    id: "b251",
    title: "Texas Chicken Student Deal",
    category: "Lifestyle",
    value: "Combo 45K & Refill nước ngọt",
    description: "Combo gà rán giòn rụm với đặc quyền uống refill nước ngọt không giới hạn, rất được sinh viên ưa chuộng.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 12,
    link: "https://texaschicken.com.vn",
    requirements: "Chọn các combo giá trị dành cho HSSV trực tiếp tại quầy order.",
    isHot: false
  },
  {
    id: "b252",
    title: "MobiFone MA30 Education Pack",
    category: "Education",
    value: "Free VIP mobiEdu & mobiStudy",
    description: "Gói cước giáo dục tặng tài khoản VIP học tập trên cổng mobiEdu/mobiStudy và miễn phí 100% data khi truy cập học trực tuyến trên các nền tảng này.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 12,
    link: "https://mobiedu.vn/",
    requirements: "Soạn tin nhắn ON MA30 gửi 9084 bằng thuê bao HSSV để nhận tài khoản VIP.",
    isHot: false
  },
  {
    id: "b253",
    title: "TNEX Digital Bank Student",
    category: "Lifestyle",
    value: "5 Không trọn đời & Quản lý chi tiêu",
    description: "Ngân hàng số bảo trợ bởi MSB miễn phí 100% trọn đời (không phí chuyển tiền, rút tiền, thường niên, duy trì, ẩn) kèm công cụ quản lý chi tiêu.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 12,
    link: "https://www.tnex.com.vn/",
    requirements: "Đăng ký tài khoản online qua eKYC trên ứng dụng TNEX và cung cấp minh chứng thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b254",
    title: "Timo Digital Bank Spend Pots",
    category: "Lifestyle",
    value: "Free Debit Card & Hũ chi tiêu",
    description: "Ngân hàng số miễn phí chuyển tiền và rút tiền tại tất cả ATM toàn quốc, hỗ trợ tính năng chia tiền Hũ chi tiêu quản lý tài chính.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 12,
    link: "https://timo.vn/",
    requirements: "Đăng ký eKYC trên ứng dụng Timo hoặc đến trực tiếp Timo Hangout để nhận thẻ vật lý.",
    isHot: false
  },
  {
    id: "b255",
    title: "Medium Student Membership",
    category: "Education",
    value: "Giảm giá 25% gói Monthly/Annual",
    description: "Nền tảng chia sẻ kiến thức, bài viết chuyên sâu về công nghệ, thiết kế và khoa học giảm giá 25% phí thành viên cho sinh viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 12,
    link: "https://medium.com/membership",
    requirements: "Đăng ký và xác thực tài khoản thông qua cổng liên kết UNiDAYS.",
    isHot: false
  },
  {
    id: "b256",
    title: "AlgoExpert Discount",
    category: "Education",
    value: "Giảm 10% + Luyện tập 20 câu hỏi free",
    description: "Nền tảng luyện thi thuật toán, thiết kế hệ thống và phỏng vấn lập trình viên hàng đầu hiện nay.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 10,
    link: "https://www.algoexpert.io",
    requirements: "Xác thực thông qua cổng kết nối GitHub Student Developer Pack.",
    isHot: false
  },
  {
    id: "b257",
    title: "Mockplus for Students",
    category: "Tech & Software",
    value: "Miễn phí 1 tháng gói Pro cao cấp",
    description: "Nền tảng thiết kế giao diện UI/UX và cộng tác trực tuyến cho các nhà thiết kế và lập trình viên.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 10,
    link: "https://www.mockplus.com",
    requirements: "Điền thông tin vào mẫu đăng ký chương trình giáo dục Mockplus bằng email giáo dục.",
    isHot: false
  },
  {
    id: "b258",
    title: "MindNode Plus Discount",
    category: "Tech & Software",
    value: "Giảm giá tới 50% gói dịch vụ năm",
    description: "Ứng dụng vẽ sơ đồ tư duy (mind mapping) native chuyên nghiệp, mượt mà và trực quan bậc nhất trên hệ sinh thái Apple.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 10,
    link: "https://mindnode.com",
    requirements: "Gửi email yêu cầu ưu đãi giáo dục bằng hòm thư trường học tới bộ phận hỗ trợ MindNode.",
    isHot: false
  },
  {
    id: "b259",
    title: "Lotteria Việt Nam Combo HSSV",
    category: "Lifestyle",
    value: "Giảm 20-30% cho set ăn",
    description: "Set combo đặc quyền gồm burger/gà rán + khoai tây + nước ngọt với mức giá giảm hấp dẫn cho sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 10,
    link: "https://www.lotteria.vn",
    requirements: "Đăng ký thành viên ứng dụng Lotteria (thẻ RIA) và gọi món combo HSSV tại quầy.",
    isHot: false
  },
  {
    id: "b260",
    title: "TickTick Task Manager",
    category: "Tech & Software",
    value: "Giảm 25% Gói Premium Năm",
    description: "Ứng dụng quản lý công việc và lịch trình học tập (To-do list), tích hợp đồng hồ cà chua (Pomodoro) và theo dõi thói quen.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 9,
    link: "https://ticktick.com/education",
    requirements: "Đăng ký qua trang TickTick Education bằng email trường học.",
    isHot: false
  },
  {
    id: "b261",
    title: "Bear App Markdown Notes",
    category: "Tech & Software",
    value: "Giảm Giá 30% Gói Bear Pro",
    description: "Ứng dụng ghi chú tối giản, đẹp mắt đạt giải thưởng thiết kế của Apple dành cho macOS và iOS, hỗ trợ định dạng Markdown.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 9,
    link: "https://bear.app/",
    requirements: "Liên hệ bộ phận hỗ trợ khách hàng của Bear và cung cấp email trường hoặc thẻ sinh viên.",
    isHot: false
  },
  {
    id: "b262",
    title: "Surfshark Student Discount",
    category: "Tech & Software",
    value: "Giảm thêm 15% trên các gói khuyến mãi",
    description: "Dịch vụ VPN bảo mật mạnh mẽ hỗ trợ số lượng thiết bị kết nối không giới hạn cùng tính năng chặn quảng cáo thông minh.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 9,
    link: "https://www.surfshark.com",
    requirements: "Đăng nhập và xác thực tài khoản qua cổng Student Beans.",
    isHot: false
  },
  {
    id: "b263",
    title: "Scrivener Academic License",
    category: "Education",
    value: "Giảm giá giấy phép trọn đời vĩnh viễn",
    description: "Phần mềm quản lý và soạn thảo các văn bản dài như luận văn tốt nghiệp, sách, kịch bản nghiên cứu chuyên nghiệp.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: true,
    updatedAt: "Vừa xong",
    savings: 9,
    link: "https://www.literatureandlatte.com/store",
    requirements: "Lựa chọn phiên bản 'Educational Licence' tại trang thanh toán.",
    isHot: false
  },
  {
    id: "b264",
    title: "KFC Việt Nam Student Combo",
    category: "Lifestyle",
    value: "Combo trưa từ 42.000 VND",
    description: "Combo cơm gà viên Nanban/mì Ý và nước ngọt Pepsi với giá siêu tiết kiệm cho HSSV tại tất cả các cửa hàng.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 8,
    link: "https://www.kfcvietnam.com.vn",
    requirements: "Chọn menu combo ăn trưa tại quầy hoặc đặt trên ứng dụng KFC Việt Nam.",
    isHot: false
  },
  {
    id: "b265",
    title: "Jollibee Việt Nam Combo Học Đường",
    category: "Lifestyle",
    value: "Set ăn đặc biệt từ 45.000 VND",
    description: "Các combo gà rán giòn cay, mì Ý sốt bò bằm đi kèm nước uống với giá ưu tiên cực tốt cho giới trẻ.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 8,
    link: "https://jollibee.com.vn",
    requirements: "Mua trực tiếp tại quầy hoặc nhận voucher ưu đãi từ các sự kiện trường học.",
    isHot: false
  },
  {
    id: "b266",
    title: "Đầm Sen Cultural Park Discount",
    category: "Lifestyle",
    value: "Giảm 50% giá vé trọn gói",
    description: "Giảm giá vé trọn gói vui chơi giải trí tại Đầm Sen Khô hoặc Đầm Sen Nước vào dịp hè và tựu trường.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 6,
    link: "http://damsenwaterpark.com.vn",
    requirements: "Xuất trình thẻ sinh viên hoặc mua vé theo đoàn liên kết.",
    isHot: false
  },
  {
    id: "b267",
    title: "Suối Tiên Theme Park Offer",
    category: "Lifestyle",
    value: "Vé trọn gói sinh viên từ 180K",
    description: "Ưu đãi giá vé vào cổng và tham gia các trò chơi giải trí tại khu du lịch văn hóa Suối Tiên TP.HCM.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 5,
    link: "https://suoitien.vn",
    requirements: "Xuất trình thẻ sinh viên tại quầy vé hoặc tham gia theo đoàn trường.",
    isHot: false
  },
  {
    id: "b268",
    title: "Goodnotes 6 Student Plan",
    category: "Education",
    value: "Giảm giá 10% gói thuê bao năm",
    description: "Ứng dụng ghi chú viết tay kỹ thuật số nổi tiếng trên iOS/iPadOS giảm giá 10% cho gói thuê bao năm Goodnotes 6.",
    scope: "Global",
    location: "Toàn cầu / Online",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 1,
    link: "https://www.goodnotes.com/",
    requirements: "Xác minh trạng thái học sinh sinh viên thông qua cổng Student Beans.",
    isHot: false
  },
  {
    id: "b269",
    title: "Dinh Độc Lập Student Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 20K)",
    description: "Ưu đãi giảm một nửa giá vé vào cổng tham quan di tích lịch sử Dinh Độc Lập nổi tiếng tại trung tâm Quận 1, TP.HCM.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.8,
    link: "https://www.dinhdoclap.gov.vn",
    requirements: "Xuất trình thẻ sinh viên gốc tại quầy bán vé trực tiếp của di tích.",
    isHot: false
  },
  {
    id: "b270",
    title: "War Remnants Museum Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 20K)",
    description: "Giảm một nửa giá vé vào cổng tham quan Bảo tàng Chứng tích Chiến tranh tại TP.HCM cho sinh viên.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.8,
    link: "http://www.baotangchungtichchientranh.vn",
    requirements: "Xuất trình thẻ sinh viên của trường đại học/cao đẳng tại quầy vé.",
    isHot: false
  },
  {
    id: "b271",
    title: "Vietnam National Museum of Fine Arts",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 20K)",
    description: "Giảm 50% vé vào cửa tham quan di sản mỹ thuật tại Bảo tàng Mỹ thuật Việt Nam ở Hà Nội.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.8,
    link: "https://vnfam.vn",
    requirements: "Xuất trình thẻ sinh viên còn hạn tại quầy vé.",
    isHot: false
  },
  {
    id: "b272",
    title: "Bảo tàng Dân tộc học Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 20K)",
    description: "Giảm 50% giá vé vào cổng tham quan khám phá văn hóa các dân tộc tại Bảo tàng Dân tộc học ở Hà Nội.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.8,
    link: "http://www.vme.org.vn",
    requirements: "Xuất trình thẻ sinh viên còn hiệu lực tại cổng bán vé.",
    isHot: false
  },
  {
    id: "b273",
    title: "Bảo tàng Phụ nữ Việt Nam Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 20K)",
    description: "Giảm một nửa giá vé vào cửa tham quan Bảo tàng Phụ nữ Việt Nam tại Hà Nội.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.8,
    link: "http://baotangphunu.org.vn",
    requirements: "Xuất trình thẻ sinh viên của trường đại học, cao đẳng, trung cấp.",
    isHot: false
  },
  {
    id: "b274",
    title: "Văn Miếu Quốc Tử Giám Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 15K)",
    description: "Giảm một nửa giá vé vào cổng tham quan quần thể di tích Văn Miếu Quốc Tử Giám ở Hà Nội.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.6,
    link: "http://vanmieu.gov.vn",
    requirements: "Xuất trình thẻ sinh viên tại quầy bán vé trực tiếp.",
    isHot: false
  },
  {
    id: "b275",
    title: "Hoàng thành Thăng Long Ticket",
    category: "Lifestyle",
    value: "Giảm 50% giá vé (chỉ 15K)",
    description: "Giảm 50% giá vé vào cổng tham quan khu di sản văn hóa thế giới Hoàng thành Thăng Long tại Hà Nội.",
    scope: "Vietnam",
    location: "Việt Nam",
    lifetime: false,
    updatedAt: "Vừa xong",
    savings: 0.6,
    link: "http://hoangthanhthanglong.com",
    requirements: "Xuất trình thẻ sinh viên tại quầy vé di tích.",
    isHot: false
  }
];

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
  "GrabStudent Pack: Ưu đãi 20% các chuyến đi Grab và giao đồ ăn hàng tháng"
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

function App() {
  const [selectedTheme, setSelectedTheme] = useState("Theme 1"); // Theme 1, 2, 3 selection
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [myPlan, setMyPlan] = useState([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  
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
  }, [selectedTheme, selectedLocation, searchQuery]);

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
  const filteredBenefits = useMemo(() => {
    return BENEFITS_DATA.filter(benefit => {
      const matchesTheme = getThemeForBenefit(benefit) === selectedTheme;
      
      let matchesLocation = true;
      if (selectedLocation !== "All") {
        matchesLocation = benefit.scope === selectedLocation;
      }

      const matchesSearch = (benefit.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (benefit.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (benefit.value || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (benefit.requirements || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTheme && matchesLocation && matchesSearch;
    });
  }, [selectedTheme, selectedLocation, searchQuery]);

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

  // Handle Location click with Skeleton loading
  const handleLocationChange = (loc) => {
    setIsListLoading(true);
    setSelectedLocation(loc);
    setTimeout(() => setIsListLoading(false), 450);
  };

  // Plan actions
  const addToPlan = (benefit) => {
    if (!myPlan.some(item => item.id === benefit.id)) {
      setMyPlan([...myPlan, { ...benefit, note: "", targetYear: 1 }]);
    }
  };

  const removeFromPlan = (id) => {
    setMyPlan(myPlan.filter(item => item.id !== id));
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
      <header className="fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] bg-white/80 backdrop-blur-md border border-swiss-border shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-full px-4 sm:px-6 py-2.5 sm:py-3.5 z-[70] flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <SwissLogo />
          <span className="font-roboto font-black text-xs xs:text-sm sm:text-base md:text-lg tracking-tighter uppercase text-swiss-dark">
            STUDENT BENEFITS
          </span>
        </div>

        {/* Floating Kit capsule button */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsPlannerOpen(true)}
            className="swiss-pressable flex items-center gap-2 border border-swiss-dark bg-swiss-dark text-white px-5 py-2 text-xs font-mono uppercase tracking-widest hover:bg-swiss-blue hover:border-swiss-blue rounded-full active:scale-95 shadow-sm"
          >
            <Sliders size={13} />
            Kit ({myPlan.length})
          </button>
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
        <div className="mb-12">
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

        {/* Benefits Grid */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-gray mb-6 flex justify-between items-center border-b border-swiss-border pb-2">
            <span>[03] DANH SÁCH CHI TIẾT ƯU ĐÃI ({filteredBenefits.length} MỤC - TRANG {currentPage} / {totalPages || 1})</span>
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
              {paginatedBenefits.map((benefit, index) => {
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
                            {benefit.updatedAt}
                          </span>
                          <span className="font-bold text-swiss-dark">
                            TIẾT KIỆM: ~${benefit.savings}/năm
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
                <div className="flex items-center gap-2 text-swiss-gray font-mono text-[10.2px] uppercase tracking-[0.2em]">
                  <Users size={16} className="text-swiss-blue" /> COLLECTIVE SAVINGS VAULT
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
                <div className="font-roboto font-black text-5xl tracking-tighter text-white leading-none">
                  $1,845,920
                </div>
                <span className="text-[9.5px] font-mono text-swiss-gray uppercase tracking-widest block mt-2">
                  34,200+ Sinh viên hoạt động trực tuyến toàn cầu
                </span>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Cảm ơn bạn đã đóng góp! Ưu đãi đang được hệ thống kiểm duyệt tự động. \nTác giả: tanbaycu");
                  e.target.reset();
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
                    * Mọi đóng góp đều được duyệt bởi sinh viên cộng tác viên.
                  </span>
                  
                  {/* Magnetic Button */}
                  <MagneticButton 
                    type="submit"
                    className="bg-swiss-dark hover:bg-swiss-blue hover:border-swiss-blue text-white text-xs font-mono uppercase py-3 px-8 font-bold tracking-widest flex items-center justify-center gap-2 rounded-xl shrink-0 transition-colors shadow-md"
                  >
                    GỬI ĐÓNG GÓP <PaperPlaneRight size={13} />
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
    </div>
  )
}

export default App
