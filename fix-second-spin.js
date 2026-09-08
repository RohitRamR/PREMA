const fs = require('fs');
let code = fs.readFileSync('apps/mobile/app/(onboarding)/index.tsx', 'utf8');

// 1. Update interpolation to allow spinning multiple times (up to 2 rotations = 720deg)
code = code.replace(
  /flowerRotation\.interpolate\(\{ inputRange: \[0, 1\], outputRange: \['0deg', '360deg'\] \}\)/,
  `flowerRotation.interpolate({ inputRange: [0, 1, 2], outputRange: ['0deg', '360deg', '720deg'] })`
);

// 2. Update the animation block to sequence the second spin
const oldBlockRegex = /\/\/ 1\. Float, grow, AND rotate simultaneously![\s\S]*?\}, 3500\); \/\/ 3000ms for animation \+ 500ms pause to let it land/m;

const newBlock = `
            // 1. Float, grow, AND rotate simultaneously!
            RNAnimated.parallel([
              RNAnimated.timing(flowerY, {
                toValue: -290, // Positioned exactly below "have aligned"
                duration: 3000, // Slow, majestic float
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(flowerScale, {
                toValue: 2.2,
                duration: 3000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(flowerRotation, {
                toValue: 1, // First full rotation while floating
                duration: 3000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              RNAnimated.timing(messageOpacity, {
                toValue: 1, // Fade text in 
                duration: 1000, 
                useNativeDriver: true,
              })
            ]).start(() => {
              // 2. Once the flower reaches the destination, SPIN AGAIN!
              RNAnimated.timing(flowerRotation, {
                toValue: 2, // Second full rotation (360deg to 720deg)
                duration: 1000, // Quick celebratory spin!
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }).start(() => {
                // 3. After the second spin finishes, route to home!
                setTimeout(() => {
                  router.replace('/(tabs)');
                }, 300); // Tiny pause before transitioning
              });
            });
`;

code = code.replace(oldBlockRegex, newBlock);

fs.writeFileSync('apps/mobile/app/(onboarding)/index.tsx', code);
console.log('Fixed second spin successfully!');
