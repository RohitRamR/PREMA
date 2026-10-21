const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

code = code.replace(
  /onScroll=\{RNAnimated\.event\([\s\S]*?\{ useNativeDriver: true \}\s*\)\}/,
  `onScroll={RNAnimated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}`
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed onScroll useNativeDriver!');
