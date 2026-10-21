const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../app');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix <Textath> -> <Path>
  if (content.includes('Textath')) {
    content = content.replace(/<Textath/g, '<Path');
    content = content.replace(/<\/Textath>/g, '</Path>');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed Textath in ${file}`);
  }
}
