const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

const replacement = `            {Array.from({ length: 30 }).map((_, i) => {
              const dotX = 16 + i * ((SW - 32) / 30);
              const isLeftSide = i < 15;

              if (isLeftSide) {
                const manOpacity = leftX.interpolate({
                  inputRange: [dotX - 30, dotX, dotX + 30],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                // Continuous shake after man passes
                const manInp = [0, dotX];
                const manOut = [0, 0];
                for (let j = 1; j <= 20; j++) {
                  manInp.push(dotX + j * 10);
                  manOut.push(j % 2 === 0 ? -2 : 2);
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
                        textShadowColor: C.accent, textShadowRadius: 6, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              } else {
                const womanOpacity = rightX.interpolate({
                  inputRange: [dotX - 30, dotX, dotX + 30],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                
                // Continuous shake after woman passes (she moves right to left, so rightX decreases)
                const womInp = [dotX];
                const womOut = [0];
                for (let j = 1; j <= 20; j++) {
                  womInp.unshift(dotX - j * 10); // Insert at beginning since inputRange must be monotonically increasing
                  womOut.unshift(j % 2 === 0 ? -2 : 2);
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
                        textShadowColor: C.pink, textShadowRadius: 6, textShadowOffset: { width: 0, height: 0 },
                      }}>{'✦'}</RNAnimated.Text>
                    </RNAnimated.View>
                  </View>
                );
              }
            })}`;

const regex = /\{Array\.from\(\{ length: 30 \}\)\.map\(\(\_, i\) => \{[\s\S]*?return \([\s\S]*?\);\s*\}\s*\}\)\}/m;

code = code.replace(regex, replacement);
fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed continuous shake!');
