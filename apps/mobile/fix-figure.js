const fs = require('fs');
let code = fs.readFileSync('app/(onboarding)/index.tsx', 'utf8');

const replacement = `const SideStickFigure = React.memo(function SideStickFigure({
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
  
  const headR = 7.5 * s;
  const neckH = 1 * s;
  
  const maleTorsoW = 9 * s;
  const torsoH = 21 * s;
  
  const dressTopW = 4 * s;
  const dressBottomW = 16 * s;
  
  const limbW = 4.5 * s;
  const armH = 17 * s;
  const legH = 20 * s;

  const dummyWalk = useRef(new RNAnimated.Value(0)).current;
  const animValue = walkCycle || dummyWalk;

  const frontLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['10deg', '35deg', '10deg', '-20deg', '10deg']
  });
  const backLegAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-10deg', '-35deg', '-10deg', '20deg', '-10deg']
  });
  const frontArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['10deg', '-15deg', '10deg', '25deg', '10deg']
  });
  const backArmAngle = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['-10deg', '15deg', '-10deg', '-25deg', '-10deg']
  });

  const containerW = 40 * s;
  const centerX = containerW / 2;
  const bodyTop = headR * 2 + neckH;

  return (
    <View style={{
      width: containerW,
      height: 64 * s,
      transform: [{ scaleX: facingLeft ? -1 : 1 }],
    }}>
      {/* Back Arm */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backArmAngle }], zIndex: 1,
      }} />

      {/* Back Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: backLegAngle }], zIndex: 1,
      }} />

      {/* Torso/Body */}
      {isFemale ? (
        <View style={{ position: 'absolute', top: bodyTop, left: centerX - dressBottomW / 2, width: dressBottomW, height: torsoH, alignItems: 'center', zIndex: 2 }}>
          {/* Main Triangle */}
          <View style={{
            width: dressTopW, height: 0,
            borderBottomWidth: torsoH - 4 * s, borderBottomColor: color,
            borderLeftWidth: (dressBottomW - dressTopW) / 2, borderLeftColor: 'transparent',
            borderRightWidth: (dressBottomW - dressTopW) / 2, borderRightColor: 'transparent',
            borderStyle: 'solid', backgroundColor: 'transparent',
          }} />
          {/* Flared Hem (like the reference image) */}
          <View style={{ width: dressBottomW, height: 4 * s, backgroundColor: color, borderRadius: 2 * s, marginTop: -1 }} />
        </View>
      ) : (
        <View style={{
          position: 'absolute', top: bodyTop, left: centerX - maleTorsoW / 2,
          width: maleTorsoW, height: torsoH, backgroundColor: color,
          borderRadius: maleTorsoW / 2, zIndex: 2,
        }} />
      )}

      {/* Head & Ponytail */}
      <View style={{
        position: 'absolute', top: 0, left: centerX - headR,
        width: headR * 2 + (isFemale ? 14 * s : 0), height: headR * 2 + (isFemale ? 4 * s : 0),
        zIndex: 3,
      }}>
        {isFemale ? (
          <Svg width={26 * s} height={20 * s} viewBox="0 0 26 20">
            {/* Round Head */}
            <Circle cx="8" cy="8" r="8" fill={color} />
            {/* Elegant curved ponytail matching the reference image */}
            <Path d="M 13 3 C 22 1, 24 10, 18 16 C 16 18, 14 18, 17 14 C 19 11, 16 7, 13 8 Z" fill={color} />
          </Svg>
        ) : (
          <View style={{ width: headR * 2, height: headR * 2, borderRadius: headR, backgroundColor: color }} />
        )}
      </View>

      {/* Front Leg */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + torsoH - 2 * s, left: centerX - limbW / 2,
        width: limbW, height: legH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontLegAngle }], zIndex: 3,
      }} />

      {/* Front Arm */}
      <RNAnimated.View style={{
        position: 'absolute', top: bodyTop + 2 * s, left: centerX - limbW / 2,
        width: limbW, height: armH, backgroundColor: color, borderRadius: limbW / 2,
        transformOrigin: 'top', transform: [{ rotate: frontArmAngle }], zIndex: 4,
      }} />
    </View>
  );
});`;

const regex = /const SideStickFigure = React\.memo\(function SideStickFigure\(\{[\s\S]*?\}\);\n\}\);/m;

code = code.replace(regex, replacement);
fs.writeFileSync('app/(onboarding)/index.tsx', code);
console.log('Fixed stick figure!');
