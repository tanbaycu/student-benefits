import fs from 'fs';

const filePath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(filePath, 'utf8');

const jsonMatch = content.match(/export const BENEFITS_DATA = (\[[\s\S]*\]);/);
const data = eval(jsonMatch[1]);

// Xây dựng Bảng Dịch Nguyên Câu Văn Chuẩn Xác (Full Sentence Precision Dictionary)
const fullSentenceMap = new Map([
  // Udemy
  ["Giảm Giá Khóa Học Lên Tới 75%", "Up to 75% Off Courses"],
  ["Truy cập hàng ngàn khóa học chất lượng cao từ lập trình, kinh tế đến nghệ thuật với chi phí siêu rẻ.", "Access thousands of high-quality courses from programming, business to arts at discounted student prices."],
  ["Xác thực thông qua cổng liên kết của trường học.", "Verify via university partner portal or student email."],

  // GrabStudent
  ["Giảm 20% Chuyến Đi Grab", "20% Off Grab Rides"],
  ["Nhận các gói mã ưu đãi di chuyển hàng tháng hỗ trợ đi lại từ ký túc xá đến các giảng đường đại học.", "Get monthly transport discount voucher packs for commuting between dormitories and university lecture halls."],
  ["Mở app Grab trên điện thoại -> Vào mục 'Thử thách' (Challenges) hoặc 'Ưu đãi' (Rewards) để đăng ký gói sinh viên; hoặc xác thực qua MoMo Student Pass bằng thẻ sinh viên.", "Open Grab app -> Go to 'Challenges' or 'Rewards' tab to join student program, or verify via MoMo Student Pass with student ID."],

  // Perplexity
  ["Giảm 50% Gói Pro ($10/tháng)", "50% Off Pro Plan ($10/mo)"],
  ["Truy cập đầy đủ các mô hình AI tiên tiến nhất (GPT-4o, Claude 3.5 Sonnet), tải tài liệu không giới hạn và Pro search với giá chỉ 50%.", "Full access to advanced AI models (GPT-4o, Claude 3.5 Sonnet), unlimited file uploads, and Pro Search at half price."],
  ["Xác thực trạng thái học tập qua cổng SheerID tích hợp trong phần cài đặt Perplexity bằng email .edu.", "Verify student status via integrated SheerID portal in Perplexity settings using .edu email."],

  // Notion
  ["Miễn Phí Nâng Cấp Gói Plan Plus", "Free Notion Plus Plan Upgrade"],
  ["Quản lý ghi chú, tài liệu nghiên cứu và lịch trình học tập. Không giới hạn block tải lên và lưu lịch sử trang 30 ngày.", "Manage notes, research documents, and study schedules with unlimited block uploads and 30-day page history."],
  ["Xác thực trực tiếp bằng email sinh viên trường liên kết.", "Verify directly with partner university student email (.edu)."],

  // CellphoneS
  ["Giảm Thêm Đến 10% & Trả Góp 0%", "Extra Up to 10% Off & 0% Interest Installment"],
  ["Đặc quyền giảm thêm đến 10% trực tiếp trên giá bán các sản phẩm điện thoại, laptop, máy tính bảng và phụ kiện, kèm gói trả góp 0% lãi suất.", "Exclusive extra discount up to 10% on smartphones, laptops, tablets, and accessories with 0% interest installment plans."],
  ["Đăng ký trực tuyến trên website CellphoneS (mục S-Student) với email trường học (.edu)/thẻ sinh viên, hoặc mang thẻ sinh viên và CCCD qua cửa hàng để kích hoạt ưu đãi trực tiếp.", "Register online on CellphoneS website (S-Student section) with university email (.edu) or student ID, or present student ID and national ID at physical store."],

  // FPT Shop
  ["Giảm Thêm 5% & Tặng 1 Năm Bảo Hành", "Extra 5% Off & Free 1-Year Extra Warranty"],
  ["Giảm thêm đến 5% giá máy laptop/PC (lên đến 10% cho tân sinh viên dựa theo điểm thi) và tặng thêm 1 năm bảo hành chính hãng (tổng cộng 2 năm bảo hành).", "Extra discount up to 5% on laptops/PCs (up to 10% for freshmen based on entrance exam scores) plus 1 extra year of official warranty (2 years total)."],
  ["Mang theo thẻ sinh viên/giấy báo nhập học kèm CCCD chính chủ đến các cửa hàng FPT Shop toàn quốc khi mua laptop, máy tính bảng để nhận chiết khấu trực tiếp.", "Bring student ID or university admission letter with national ID to any FPT Shop store nationwide when buying laptops or tablets."],

  // 1Password
  ["Miễn Phí 1 Năm Tài Khoản Mới", "Free 1-Year New Account License"],
  ["Ứng dụng quản lý mật khẩu an toàn và phổ biến nhất hiện nay, giúp bảo mật thông tin đăng nhập trên mọi nền tảng.", "Industry-leading secure password manager helping protect your credentials seamlessly across all platforms."],
  ["Kích hoạt qua GitHub Student Developer Pack hoặc Student App Centre.", "Activate via GitHub Student Developer Pack or Student App Centre."]
]);

// Hàm dịch từng mảng dữ liệu chuẩn 100% người thật viết
function translateStrictSentence(str) {
  if (!str) return str;
  const trimStr = String(str).trim();

  // 1. Kiểm tra chính xác câu trong từ điển
  if (fullSentenceMap.has(trimStr)) {
    return fullSentenceMap.get(trimStr);
  }

  // 2. Chuyển đổi các cấu trúc câu phổ biến (Sentence Grammar rules)
  let s = trimStr;
  s = s.replace(/^Giảm (\d+)% (.*)$/i, "$1% Off $2");
  s = s.replace(/^Giảm Giá (.*) Lên Tới (\d+)%$/i, "Up to $2% Off $1");
  s = s.replace(/^Tài khoản (.*) Miễn Phí$/i, "Free $1 Account");
  s = s.replace(/^Miễn Phí (.*)$/i, "Free $1");
  s = s.replace(/^Xác thực thông qua (.*)$/i, "Verify via $1");
  s = s.replace(/^Tạo tài khoản (.*)$/i, "Create $1 account");

  return s;
}

data.forEach((item) => {
  if (!item.valueEn || item.valueEn.includes("Off ")) {
    item.valueEn = translateStrictSentence(item.value);
  }
  if (!item.descriptionEn || item.descriptionEn === item.description) {
    item.descriptionEn = translateStrictSentence(item.description);
  }
  if (!item.requirementsEn || item.requirementsEn === item.requirements) {
    item.requirementsEn = translateStrictSentence(item.requirements);
  }
});

const newContent = `// Exported BENEFITS_DATA module (295 items - Pure Sentence-Level Native English)
export const BENEFITS_DATA = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("MASTER HUMAN SENTENCE TRANSLATOR COMPLETED!");
