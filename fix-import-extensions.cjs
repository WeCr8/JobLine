const fs = require('fs');
const path = require('path');

const exts = ['stores', 'services', 'utils'];
const fileTypes = ['.vue', '.ts'];

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, callback);
    else callback(full);
  });
}

function fixImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  exts.forEach(folder => {
    // Match: from '../stores/auth';
    const regex = new RegExp(`from ['"](\.\./${folder}/[\w-]+)['"]`, 'g');
    content = content.replace(regex, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
    // Match: from '../stores/auth.js';
    const regexJs = new RegExp(`from ['"](\.\./${folder}/[\w-]+)\.js['"]`, 'g');
    content = content.replace(regexJs, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
    // Match: from '../utils/offline';
    const regexMulti = new RegExp(`from ['"](\.\./${folder}/[\w-]+)['"]`, 'g');
    content = content.replace(regexMulti, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
  });
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}

walk(path.join(__dirname, 'src'), file => {
  if (fileTypes.includes(path.extname(file))) fixImports(file);
}); 