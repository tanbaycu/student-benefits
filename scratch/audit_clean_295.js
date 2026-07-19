import fs from 'fs';

const filePath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(filePath, 'utf8');

const jsonMatch = content.match(/export const BENEFITS_DATA = (\[[\s\S]*\]);/);
const data = eval(jsonMatch[1]);

console.log(`TOTAL ITEMS IN DATASET: ${data.length}`);

let untranslated = 0;
data.forEach((item, index) => {
  const d = item.descriptionEn || "";
  const v = item.valueEn || "";
  const r = item.requirementsEn || "";

  // Thẻ chưa được dịch nếu còn chứa các từ tiếng Việt tiêu biểu
  if (/[àáảãạâầấẩẫậăằắẳẵặnèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(d) ||
      d.includes("Chương trình") || d.includes("Ứng dụng") || d.includes("truy cập") || d.includes("hỗ trợ")) {
    untranslated++;
    console.log(`[Item #${index + 1} (${item.title})] Needs deeper translation:`);
    console.log(`  descEn: ${d.slice(0, 80)}...`);
  }
});

console.log(`TOTAL UNTRANSLATED ITEMS: ${untranslated}`);
