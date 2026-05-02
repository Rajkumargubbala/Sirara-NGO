const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', '.git', 'scratch'];
const targetExts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.html'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.some(ex => file.includes(ex))) {
        results = results.concat(walk(file));
      }
    } else {
      if (targetExts.some(ext => file.endsWith(ext))) {
        results.push(file);
      }
    }
  });
  return results;
}

const clientFiles = walk('c:/Users/Raj Kumar/Desktop/Sirara/client');
const serverFiles = walk('c:/Users/Raj Kumar/Desktop/Sirara/server');
const allFiles = [...clientFiles, ...serverFiles];

let replacedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/SITATRA/g, 'Sitara');
  newContent = newContent.replace(/sitatra/g, 'sitara');
  newContent = newContent.replace(/Sitatra/g, 'Sitara');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated: ${file}`);
    replacedCount++;
  }
});

console.log(`Replacement complete. Updated ${replacedCount} files.`);
