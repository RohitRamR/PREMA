const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

// ── FIX 1: Memoize the dummy animated value in SideStickFigure ──
// Instead of creating `new RNAnimated.Value(0)` every render, use a stable ref
code = code.replace(
  `  const animValue = walkCycle || new RNAnimated.Value(0);`,
  `  // Use a stable ref to avoid creating new Animated.Value on every render
  const dummyWalk = useRef(new RNAnimated.Value(0)).current;
  const animValue = walkCycle || dummyWalk;`
);

// ── FIX 2: Wrap SideStickFigure in React.memo to prevent unnecessary re-renders ──
code = code.replace(
  `function SideStickFigure({`,
  `const SideStickFigure = React.memo(function SideStickFigure({`
);
code = code.replace(
  /^(    <\/View>\n  \);\n\})\n/m,
  `    </View>
  );
});\n`
);

// ── FIX 3: Reduce star count from 30 to 20 and simplify vibration arrays ──
// Fewer stars = fewer interpolation calculations per frame
// Reduce oscillation points from 20 to 8 for much lighter computation

const oldStarBlock = /\{Array\.from\(\{ length: 30 \}\)\.map\(\(\_, i\) => \{[\s\S]*?const isLeftSide = i < 15;[\s\S]*?\}\)\}/m;

const newStarBlock = `{Array.from({ length: 20 }).map((_, i) => {
              const dotX = 16 + i * ((SW - 32) / 20);
              const isLeftSide = i < 10;

              if (isLeftSide) {
                const manOpacity = leftX.interpolate({
                  inputRange: [dotX - 25, dotX, dotX + 25],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                // Simplified vibration: fewer interpolation points for smoother perf
                const manInp = [0, dotX];
                const manOut = [0, 0];
                for (let j = 1; j <= 8; j++) {
                  manInp.push(dotX + j * 20);
                  manOut.push(j % 2 === 0 ? -1.5 : 1.5);
                }
                const manVibrate = leftX.interpolate({
                  inputRange: manInp,
                  outputRange: manOut,
                  extrapolate: 'clamp',
                });

                return (
                  <View key={\`d\${i}\`} style={{ position: 'absolute', bottom: 15, left: dotX - 4, alignItems: 'center' }}>
                    <View style={{ width: 1, height: 6, backgroundColor: 'rgba(44,73,106,0.15)' }} />
                    <RNAnimated.View style={{ transform: [{ translateY: manVibrate }] }}>
                      <Text style={{ fontSize: 10, color: '#B8D8F0', marginTop: -2 }}>{'✦'}</Text>
                      <RNAnimated.Text style={{
                        position: 'absolute', top: 0, left: 0,
                        fontSize: 10, color: C.pri,
                        opacity: manOpacity,
                        textShadowColor: C.accent, textShadowRadius: 4, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              } else {
                const womanOpacity = rightX.interpolate({
                  inputRange: [dotX - 25, dotX, dotX + 25],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                const womInp = [dotX];
                const womOut = [0];
                for (let j = 1; j <= 8; j++) {
                  womInp.unshift(dotX - j * 20);
                  womOut.unshift(j % 2 === 0 ? -1.5 : 1.5);
                }
                womInp.push(9999);
                womOut.push(0);
                
                const womanVibrate = rightX.interpolate({
                  inputRange: womInp,
                  outputRange: womOut,
                  extrapolate: 'clamp',
                });

                return (
                  <View key={\`d\${i}\`} style={{ position: 'absolute', bottom: 15, left: dotX - 4, alignItems: 'center' }}>
                    <View style={{ width: 1, height: 6, backgroundColor: 'rgba(44,73,106,0.15)' }} />
                    <RNAnimated.View style={{ transform: [{ translateY: womanVibrate }] }}>
                      <Text style={{ fontSize: 10, color: '#FFB8C6', marginTop: -2 }}>{'✦'}</Text>
                      <RNAnimated.Text style={{
                        position: 'absolute', top: 0, left: 0,
                        fontSize: 10, color: '#E0415C',
                        opacity: womanOpacity,
                        textShadowColor: C.pink, textShadowRadius: 4, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              }
            })}`;

code = code.replace(oldStarBlock, newStarBlock);

// ── FIX 4: Remove unnecessary state setters that cause re-renders ──
// setIsWalking triggers a full re-render but the value is never read
code = code.replace(
  `    const [, setIsWalking] = useState(false);`,
  `    const isWalkingRef = useRef(false);`
);
code = code.replace(/setIsWalking\(true\)/g, 'isWalkingRef.current = true');
code = code.replace(/setIsWalking\(false\)/g, 'isWalkingRef.current = false');

// setShowMessage also triggers a re-render but is never read in JSX
code = code.replace(
  `  const [, setShowMessage] = useState(false);`,
  `  const showMessageRef = useRef(false);`
);
code = code.replace(/setShowMessage\(true\)/g, 'showMessageRef.current = true');

// ── FIX 5: Make all walk animation durations slightly longer for smoother feel ──
// The step walk was 800ms which can feel jerky on slower devices
code = code.replace(
  /RNAnimated\.timing\(leftX, \{\s*toValue: leftTarget,\s*duration: 800,/,
  `RNAnimated.timing(leftX, {
        toValue: leftTarget,
        duration: 1000,`
);
code = code.replace(
  /RNAnimated\.timing\(rightX, \{\s*toValue: rightTarget,\s*duration: 800,/,
  `RNAnimated.timing(rightX, {
        toValue: rightTarget,
        duration: 1000,`
);

// ── FIX 6: Use Easing.bezier for smoother easing on the walk ──
code = code.replace(
  /easing: Easing\.inOut\(Easing\.quad\),(\s+)useNativeDriver: true,(\s+)\}\),(\s+)RNAnimated\.timing\(rightX,/,
  `easing: Easing.out(Easing.sin),$1useNativeDriver: true,$2}),$3RNAnimated.timing(rightX,`
);

// Second occurrence for rightX
code = code.replace(
  /easing: Easing\.inOut\(Easing\.quad\),(\s+)useNativeDriver: true,(\s+)\}\),(\s+)\]\)\.start\(\(\) => \{\s*stopWalkCycle/,
  `easing: Easing.out(Easing.sin),$1useNativeDriver: true,$2}),$3]).start(() => {
      stopWalkCycle`
);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('All animation smoothness fixes applied!');
