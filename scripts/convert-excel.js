const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取Excel文件
const workbook = XLSX.readFile(path.join(__dirname, '../public/test1.xlsx'));

// 获取第一个工作表
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// 转换为JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// 输出文件路径
const outputPath = path.join(__dirname, '../public/data.json');

// 写入JSON文件
fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`✅ 成功转换 ${jsonData.length} 条记录`);
console.log(`📁 输出文件: ${outputPath}`);
console.log('🎉 转换完成！'); 