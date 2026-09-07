const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllTsxFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const baseDir = path.join(__dirname, '..');
const tsxFiles = getAllTsxFiles(baseDir);

const OLD_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1VM45GEZBPj60GU3lUxrX02_9csI3xGwJGj1_YRcDcPBcjkFd1AlMfbMGppvASCkdI81DZeJFFxjjJQFBOHy5aW2Vhlyn5_kFM81B4CaiRW2A8r18PFj5FmiUDGoVXED_w8UmZ5LXAumb1C3F55WsxJZoIVU1eeJoJXMpRn7DzyG9LkCGLHwrohKxElpqq1RmqF3ZtaOIS4bnShH6qd2uCELI2sQXoRigEq-KEclY_sRN-WKipyLKp81aQ';

let updatedCount = 0;

tsxFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(OLD_URL)) {
    const relativeToAssets = path.relative(path.dirname(filePath), path.join(baseDir, 'assets/images/logo.png'));
    const requirePath = relativeToAssets.startsWith('.') ? relativeToAssets : './' + relativeToAssets;
    const replacement = `source={require('${requirePath}')}`;
    
    // Replace all occurrences of the old remote logo URL
    const updated = content.split(`source={{ uri: '${OLD_URL}' }}`).join(replacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated logo in:', path.relative(baseDir, filePath));
    updatedCount++;
  }
});

console.log(`Finished updating ${updatedCount} files.`);
