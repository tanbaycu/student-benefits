import fs from 'fs';

const filePath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(filePath, 'utf8');

const jsonMatch = content.match(/export const BENEFITS_DATA = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Match error");
  process.exit(1);
}

const data = eval(jsonMatch[1]);
console.log(`TOTAL ITEMS IN DATASET: ${data.length}`);

// Tự động kiểm tra danh sách item chưa có bản dịch hoàn chỉnh
let unTranslatedCount = 0;
data.forEach((item, index) => {
  const isEnValid = item.titleEn && item.valueEn && item.descriptionEn && item.requirementsEn &&
                    !/[àáảãạâầấẩẫậăằắẳẵặnèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(item.descriptionEn);
  if (!isEnValid) {
    unTranslatedCount++;
  }
});

console.log(`UNTRANSLATED OR PARTIAL ITEMS COUNT: ${unTranslatedCount}`);
