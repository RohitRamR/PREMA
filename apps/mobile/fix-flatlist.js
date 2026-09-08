const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

code = code.replace(/<FlatList\n/g, '<RNAnimated.FlatList\n');
code = code.replace(/<\/FlatList>/g, '</RNAnimated.FlatList>');

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed FlatList!');
