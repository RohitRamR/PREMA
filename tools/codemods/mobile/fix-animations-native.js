const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

// 1. Enable Native Driver on walkCycle
code = code.replace(
  /duration: 500,\s*easing: Easing.linear,\s*useNativeDriver: false,/,
  `duration: 500, easing: Easing.linear, useNativeDriver: true,`
);

// 2. Enable Native Driver on leftX and rightX (there are 2 places where they are animated in parallel)
code = code.replace(/useNativeDriver: false/g, 'useNativeDriver: true');

// 3. Remove legVal, armVal state and listeners
code = code.replace(/const \[legVal, setLegVal\] = useState\(0\);\n\s*const \[armVal, setArmVal\] = useState\(0\);\n/, '');
code = code.replace(/if \(walkListenerId\.current\) \{[\s\S]*?\}\n/, '');
code = code.replace(/walkListenerId\.current = walkCycle\.addListener\(\(\{ value \}\) => \{[\s\S]*?\}\);\n/, '');
code = code.replace(/const walkListenerId = useRef<string \| null>\(null\);\n/, '');

// 4. Update the SideStickFigure calls
code = code.replace(
  /<SideStickFigure\s*color=\{C\.pri\}\s*facingLeft=\{false\}\s*legAnim=\{legVal\}\s*armAnim=\{armVal\}\s*scale=\{0\.9\}\s*\/>/,
  `<SideStickFigure color={C.pri} facingLeft={false} walkCycle={walkCycle} scale={0.9} />`
);
code = code.replace(
  /<SideStickFigure\s*color=\{C\.pink\}\s*isFemale=\{true\}\s*facingLeft=\{true\}\s*legAnim=\{legVal\}\s*armAnim=\{armVal\}\s*scale=\{0\.9\}\s*\/>/,
  `<SideStickFigure color={C.pink} isFemale={true} facingLeft={true} walkCycle={walkCycle} scale={0.9} />`
);

// 5. Change leftX and rightX from `left: leftX` to `left: 0, transform: [{ translateX: leftX }]`
code = code.replace(
  /bottom: 37,\s*left: leftX,/,
  `bottom: 37, left: 0, transform: [{ translateX: leftX }],`
);
code = code.replace(
  /bottom: 37,\s*left: rightX,/,
  `bottom: 37, left: 0, transform: [{ translateX: rightX }],`
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed native driver and layout!');
