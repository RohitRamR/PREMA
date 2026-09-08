const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

// 1. Move the ground line up
code = code.replace(
  /bottom: 18, left: 16, right: 16, height: 2/,
  `bottom: 35, left: 16, right: 16, height: 2`
);

// 2. Move stick figures up
code = code.replace(
  /bottom: 20,(\s+)left: leftX/,
  `bottom: 37,$1left: leftX`
);
code = code.replace(
  /bottom: 20,(\s+)left: rightX/,
  `bottom: 37,$1left: rightX`
);

// 3. Move the hanging dots up
// It appears as `bottom: 0, left: dotX` for both man and woman
code = code.replace(
  /bottom: 0, left: dotX/g,
  `bottom: 17, left: dotX`
);
// And the inner glow overlay which also has `bottom: 0`
code = code.replace(
  /position: 'absolute', bottom: 0, width: 8, height: 8/g,
  `position: 'absolute', bottom: 17, width: 8, height: 8`
); // wait, inner absolute is relative to the container which is at bottom: 17, so its inner bottom should still be 0!

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed ground positions!');
