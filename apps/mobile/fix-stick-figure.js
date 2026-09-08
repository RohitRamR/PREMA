const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

const replacement = `function SideStickFigure({
  color = C.pri,
  facingLeft = false,
  isFemale = false,
  walkCycle,
  scale = 1,
}: {
  color?: string;
  facingLeft?: boolean;
  isFemale?: boolean;
  walkCycle?: any;
  scale?: number;
}) {
  const s = scale;
  
  const headR = 8 * s;
  const gap = 2 * s;
  
  const maleTorsoW = 10 * s;
  const torsoH = 24 * s;
  
  const dressTop = 6 * s;
  const dressFlare = 8 * s;
  
  const limbW = 5.5 * s;
  const armH = 20 * s;
  const legH = 22 * s;

  // If walkCycle isn't provided, use a dummy value that doesn't move
  const animValue = walkCycle || new RNAnimated.Value(0);

  const frontLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['10deg', '45deg', '10deg', '-25deg', '10deg']
  });
  const backLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-10deg', '-45deg', '-10deg', '25deg', '-10deg']
  });
  const frontArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['15deg', '-20deg', '15deg', '50deg', '15deg']
  });
  const backArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-15deg', '20deg', '-15deg', '-50deg', '-15deg']
  });

  const centerX = 20 * s;

  return (
    <View style={{
      width: 40 * s,
      height: 64 * s,
      transform: [{ scaleX: facingLeft ? -1 : 1 }],
    }}>
      {/* Back Arm */}
      <RNAnimated.View style={{
        position: 'absolute', top: headR * 2 + gap + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backArmAngle }], zIndex: 1,
      }} />

      {/* Back Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: headR * 2 + gap + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backLegAngle }], zIndex: 1,
      }} />

      {/* Torso/Body */}
      {isFemale ? (
        <View style={{
          position: 'absolute', top: headR * 2 + gap, left: centerX - dressFlare / 2,
          borderBottomWidth: torsoH, borderBottomColor: color,
          borderLeftWidth: dressFlare / 2 - dressTop / 2, borderLeftColor: 'transparent',
          borderRightWidth: dressFlare / 2 - dressTop / 2, borderRightColor: 'transparent',
          width: dressTop, zIndex: 2,
        }} />
      ) : (
        <View style={{
          position: 'absolute', top: headR * 2 + gap, left: centerX - maleTorsoW / 2,
          width: maleTorsoW, height: torsoH, backgroundColor: color,
          borderRadius: maleTorsoW / 2, zIndex: 2,
        }} />
      )}

      {/* Head */}
      <View style={{
        position: 'absolute', top: 0, left: centerX - headR,
        width: headR * 2, height: headR * 2, borderRadius: headR,
        backgroundColor: color, zIndex: 3,
      }}>
        {isFemale && (
          <View style={{
            position: 'absolute', top: 2 * s, right: -4 * s,
            width: 8 * s, height: 10 * s, borderRadius: 5 * s,
            backgroundColor: color, transform: [{ rotate: '15deg' }],
          }} />
        )}
      </View>

      {/* Front Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: headR * 2 + gap + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontLegAngle }], zIndex: 3,
      }} />

      {/* Front Arm */}
      <RNAnimated.View style={{
        position: 'absolute', top: headR * 2 + gap + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontArmAngle }], zIndex: 4,
      }} />
    </View>
  );
}`;

const regex = /function SideStickFigure\([\s\S]*?\)\s*\{[\s\S]*?return \([\s\S]*?<\/View>\s*\);\s*\}/m;

code = code.replace(regex, replacement);

fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed SideStickFigure!');
