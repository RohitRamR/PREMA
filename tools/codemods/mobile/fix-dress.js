const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

code = code.replace(
  /borderRightWidth: dressFlare \/ 2 - dressTop \/ 2, borderRightColor: 'transparent',\s+width: dressTop, zIndex: 2,/,
  `borderRightWidth: dressFlare / 2 - dressTop / 2, borderRightColor: 'transparent',
          width: dressTop, height: 0, borderStyle: 'solid', backgroundColor: 'transparent', zIndex: 2,`
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed dress triangle!');
