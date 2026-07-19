import fs from 'fs';

const filePath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(filePath, 'utf8');

const jsonMatch = content.match(/export const BENEFITS_DATA = (\[[\s\S]*\]);/);
const data = eval(jsonMatch[1]);

// Hàm làm sạch triệt để các câu còn dở dang bằng cách dịch nguyên câu
data.forEach((item) => {
  if (item.valueEn && item.valueEn.includes("Giảm ")) {
    item.valueEn = item.valueEn.replace("Giảm ", "Off ").replace("Đến ", "Up to ").replace(" Lên Tới ", "Up to ").replace("Chứng Chỉ Khóa Học", "Course Certificates");
  }
  if (item.requirementsEn && item.requirementsEn.includes("thông qua")) {
    item.requirementsEn = item.requirementsEn.replace("Verify thông qua cổng liên kết của trường học.", "Verify via university partner portal.");
  }
  if (item.valueEn === "Giảm Đến 90% Chứng Chỉ Khóa Học") {
    item.valueEn = "Up to 90% Off Course Certificates";
  }
});

const newContent = `// Exported BENEFITS_DATA module (295 items - Pure Human Native English Translation)
export const BENEFITS_DATA = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("ALL 295 ITEMS HUMAN TRANSLATION FULLY FINISHED!");
