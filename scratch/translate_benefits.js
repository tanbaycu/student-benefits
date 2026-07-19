import fs from 'fs';
import path from 'path';

const benefitsPath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(benefitsPath, 'utf8');

// Từ điển thay thế các cụm từ tiếng Việt sang tiếng Anh
const dict = [
  // Value
  [/Miễn phí bản quyền (\d+) năm/gi, 'Free Educational License $1 Year'],
  [/Miễn phí bản quyền/gi, 'Free Educational License'],
  [/Bản quyền miễn phí/gi, 'Free License'],
  [/Miễn phí 100%/gi, '100% Free'],
  [/Miễn phí/gi, 'Free'],
  [/Học Bổng Sáng Tạo Đến (\d+)%/gi, 'Creative Scholarship Up To $1%'],
  [/Học bổng/gi, 'Scholarship'],
  [/Ưu đãi discount/gi, 'Discount Deal'],
  [/Giảm giá (\d+)%/gi, '$1% Off Discount'],
  [/Giảm (\d+)%/gi, '$1% Off'],
  [/Giảm đến (\d+)%/gi, 'Up to $1% Off'],
  [/Tài khoản Pro Free 100%/gi, '100% Free Pro Account'],
  [/Quyền truy cập tổ chức đại học/gi, 'University Org Access'],
  [/Tặng (\d+) vouchers/gi, 'Free $1 Vouchers'],
  [/Vé xem phim sinh viên/gi, 'Student Movie Ticket'],
  [/Vé xe bus/gi, 'Bus Ticket'],
  [/Vé tàu/gi, 'Train Ticket'],
  [/Đồng giá/gi, 'Flat Rate'],
  [/trả góp 0%/gi, '0% Installment Plan'],

  // Descriptions Common Terms
  [/Nền tảng phần mềm CAD, CAM, CAE và PCB dựa trên đám mây chuyên nghiệp dành cho thiết kế và sản xuất sản phẩm, mô hình hóa 3D trực quan và giả lập\./gi, 'Professional cloud-based CAD, CAM, CAE, and PCB software platform for product design, 3D modeling, and simulation.'],
  [/Chương trình học bổng ngành Mỹ thuật Đa phương tiện dành riêng cho học sinh sinh viên có tài năng nghệ thuật\./gi, 'Multimedia Arts scholarship program dedicated to artistic and creative students.'],
  [/Bản quyền MATLAB & Simulink miễn phí nếu trường có Campus-Wide License\. Nếu không, mua bản Student giá \$119\/năm kèm MATLAB Online miễn phí 20 giờ\/tháng\./gi, 'Free MATLAB & Simulink license if your school has Campus-Wide License. Otherwise, Student tier is $119/yr with 20 hrs/mo free MATLAB Online.'],
  [/Sở hữu toàn bộ Toolkit sáng tạo bao gồm Photoshop, Illustrator, Premiere Pro và Lightroom với chi phí cực thấp\./gi, 'Access full creative toolkit including Photoshop, Illustrator, Premiere Pro, and Lightroom at low student rates.'],
  [/License phần mềm thiết kế 3D CAD chuẩn công nghiệp free từ 01\/07\/2026 cho students\. Bản Premium giá deal \$60\/năm kèm voucher thi chứng chỉ CSWA\/CSWP\./gi, 'Industry-standard 3D CAD design software license free for students. Premium plan at $60/yr includes CSWA/CSWP cert vouchers.'],
  [/Trình soạn thảo mã nguồn tích hợp AI hàng đầu thế giới hiện nay\. Hãng cung cấp mã nâng cấp Pro free thông qua các sự kiện on-campus và sự kiện trực tuyến chính thức mùa tự trường\./gi, 'World-leading AI code editor. Free Pro upgrade codes provided via campus events and official back-to-school webinars.'],
  [/Anthropic cung cấp chương trình Claude for Education dành cho các trường đại học\/cao đẳng để tích hợp sâu vào hệ thống, cho phép students, giảng viên truy cập Claude phục vụ học tập\/nghiên cứu\./gi, 'Anthropic provides Claude for Education for universities/colleges for deep integration, offering students and faculty access for learning and research.'],
  [/Phiên bản ChatGPT được thiết kế riêng cho các trường đại học với bảo mật dữ liệu cấp doanh nghiệp, giới hạn tin nhắn cao hơn, hỗ trợ tạo GPTs tùy chỉnh\./gi, 'Enterprise-grade ChatGPT tailored for universities with data privacy, higher message limits, and custom GPTs support.'],
  [/Truy cập các công cụ lập trình tốt nhất thế giới bao gồm GitHub Copilot, Canva Pro, Namecheap hoàn toàn free\./gi, 'Access top global developer tools including GitHub Copilot, Canva Pro, Namecheap completely free.'],
  [/Công cụ thiết kế UI\/UX và làm việc nhóm chuẩn công nghiệp\. Nhận đầy đủ tính năng thiết kế Kế Pro để làm đồ án\./gi, 'Industry-standard UI/UX and collaborative design tool. Get full Pro features for academic coursework.'],

  // Words & Clauses
  [/dành riêng cho sinh viên/gi, 'tailored for students'],
  [/dành cho sinh viên/gi, 'for students'],
  [/dành cho học sinh sinh viên/gi, 'for students'],
  [/cho sinh viên/gi, 'for students'],
  [/hoàn toàn miễn phí/gi, 'completely free'],
  [/miễn phí 100%/gi, '100% free'],
  [/miễn phí/gi, 'free'],
  [/giảm giá/gi, 'discount'],
  [/ưu đãi/gi, 'special deal'],
  [/bản quyền/gi, 'license'],
  [/tài khoản/gi, 'account'],
  [/sinh viên/gi, 'students'],
  [/trường đại học/gi, 'universities'],
  [/học sinh/gi, 'students'],
  [/học phí/gi, 'tuition fee'],
  [/vé xe/gi, 'transit ticket'],
  [/vé xem phim/gi, 'movie ticket'],

  // Requirements Common
  [/Tạo tài khoản Autodesk bằng email trường học và xác thực trạng thái sinh viên qua hệ thống SheerID\./gi, 'Create Autodesk account with university email (.edu) and verify student status via SheerID system.'],
  [/Đăng ký tài khoản MathWorks bằng email trường \(\.edu\) hoặc xác minh tư cách sinh viên\./gi, 'Register with MathWorks account using university email (.edu) or student verification.'],
  [/Đăng ký qua cổng SolidWorks Student với email \.edu hoặc thẻ sinh viên\./gi, 'Register via SolidWorks Student portal with .edu email or student ID.'],
  [/Đăng ký tham gia các sự kiện on-campus hoặc webinar giáo dục do Cursor tổ chức\./gi, 'Register by attending on-campus events or educational webinars hosted by Cursor.'],
  [/Đăng nhập Single Sign-On \(SSO\) qua cổng thông tin hoặc email của trường đại học đối tác\./gi, 'Log in via university Single Sign-On (SSO) portal or partner school email.'],
  [/Đăng nhập bằng email trường do trường học liên kết đối tác cung cấp\./gi, 'Log in using university email provided by partner institution.'],
  [/Email trường \(\.edu\) hoặc thẻ sinh viên\/giấy xác nhận nhập học\./gi, 'University (.edu) email or student ID / enrollment verification letter.'],
  [/Thẻ sinh viên cùng tài liệu học tập có đóng dấu của trường\./gi, 'Student ID along with stamped academic documentation.'],
  [/Tạo tài khoản/gi, 'Create account with'],
  [/Đăng ký/gi, 'Register with'],
  [/Xác thực/gi, 'Verify with'],
  [/thẻ sinh viên/gi, 'student ID'],
  [/email trường/gi, 'university email (.edu)'],
  [/hoặc/gi, 'or']
];

function translateString(str) {
  if (!str) return str;
  let res = str;
  for (const [pattern, replacement] of dict) {
    res = res.replace(pattern, replacement);
  }
  return res;
}

console.log('Script initialized for benefit translation inspection.');
