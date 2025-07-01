const fs = require('fs');
const path = require('path');

// Folders and files to target for .ts extension
const folders = ['stores', 'services', 'utils', 'types', 'lib'];
const files = [
  'api.service', 'integration.service', 'settings.service', 'organization.service', 'jobs.service', 'auth.service', 'subscription.service', 'demo.service', 'passdown.service', 'admin.service', 'integration', 'index', 'date.utils', 'format.utils', 'offline', 'platform', 'validation.utils'
];
const vueComponents = ['components', 'views', 'admin', 'org', 'team'];
const fileTypes = ['.vue', '.ts'];

const deletedFiles = ['chatApi.service'];

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

  // Fix for folders and files
  [...folders, ...files].forEach(name => {
    // from '../services/integration.service'
    const regex = new RegExp(`from ['"](\.\.?\/?[\w-]+\/${name})['"]`, 'g');
    content = content.replace(regex, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
    // from '../services/integration.service.js'
    const regexJs = new RegExp(`from ['"](\.\.?\/?[\w-]+\/${name})\.js['"]`, 'g');
    content = content.replace(regexJs, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
  });

  // Fix for direct file imports (e.g., './integration.service')
  files.forEach(name => {
    const regex = new RegExp(`from ['"](\.?\.\/?${name})['"]`, 'g');
    content = content.replace(regex, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
    const regexJs = new RegExp(`from ['"](\.?\.\/?${name})\.js['"]`, 'g');
    content = content.replace(regexJs, (match, p1) => {
      changed = true;
      return `from '${p1}.ts'`;
    });
  });

  // Fix for Vue SFC imports
  vueComponents.forEach(folder => {
    const regexVue = new RegExp(`from ['"](\.\./${folder}/[\w-]+)['"]`, 'g');
    content = content.replace(regexVue, (match, p1) => {
      if (fs.existsSync(path.join(path.dirname(file), p1 + '.vue'))) {
        changed = true;
        return `from '${p1}.vue'`;
      }
      return match;
    });
  });

  // Remove or warn about deleted/renamed files
  deletedFiles.forEach(name => {
    const regexDel = new RegExp(`from ['"][^'"]*${name}[^'"]*['"];?`, 'g');
    if (regexDel.test(content)) {
      changed = true;
      content = content.replace(regexDel, '// [AUTO-FIX] Removed import for deleted file: ' + name);
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}

walk(path.join(__dirname, 'src'), file => {
  if (fileTypes.includes(path.extname(file))) fixImports(file);
}); 