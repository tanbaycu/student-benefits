import fs from 'fs';

const filePath = 'c:/Users/ACER/studentbenefits/src/data/benefitsData.js';
let content = fs.readFileSync(filePath, 'utf8');

const jsonMatch = content.match(/export const BENEFITS_DATA = (\[[\s\S]*\]);/);
const data = eval(jsonMatch[1]);

// Loại bỏ hoàn toàn các thuộc tính EN thừa, khôi phục 100% Tiếng Việt nguyên bản
data.forEach((item) => {
  delete item.titleEn;
  delete item.valueEn;
  delete item.descriptionEn;
  delete item.requirementsEn;
});

const newContent = `// Exported BENEFITS_DATA module (295 items - Pure 100% Vietnamese Original Dataset)
export const BENEFITS_DATA = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`REVERT SUCCESS: Cleaned all English fields from ${data.length} items!`);
