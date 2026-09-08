const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

code = code.replace(
  /position: 'absolute', bottom: 17, width: 8, height: 8/g,
  `position: 'absolute', bottom: 0, width: 8, height: 8`
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed inner glow overlay position!');
