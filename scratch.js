const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'screens');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('SafeAreaView') && !content.includes('react-native-safe-area-context')) {
    content = content.replace(/,\s*SafeAreaView/, '');
    content = content.replace(/SafeAreaView,\s*/, '');
    
    const newImport = "import { SafeAreaView } from 'react-native-safe-area-context';\n";
    content = newImport + content;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
