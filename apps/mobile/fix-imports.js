const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

code = code.replace(
  /import Svg, \{ Path, Defs, LinearGradient, Stop, Rect \} from 'react-native-svg';/,
  "import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';"
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed SVG imports!');
