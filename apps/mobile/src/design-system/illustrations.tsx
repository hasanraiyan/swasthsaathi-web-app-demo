import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors } from './tokens';

const g = colors.palette;

/** Heart with a medical cross held by two hands, surrounded by leaves. */
export function CareHeroIllustration({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      {/* soft backdrop */}
      <Circle cx={130} cy={132} r={112} fill={g.green50} />
      {/* leaves */}
      <G fill={g.green400} opacity={0.9}>
        <Path d="M46 120c-8-30 10-52 34-56-2 26-12 46-34 56z" />
        <Path d="M40 168c-14-20-6-44 14-54 6 22 2 42-14 54z" opacity={0.75} />
        <Path d="M214 120c8-30-10-52-34-56 2 26 12 46 34 56z" />
        <Path d="M220 168c14-20 6-44-14-54-6 22-2 42 14 54z" opacity={0.75} />
        <Path d="M188 70c16-18 34-18 44-10-12 14-28 18-44 10z" opacity={0.6} />
      </G>
      {/* hands */}
      <G fill={g.green200}>
        <Path d="M36 176c10 24 44 46 80 50l8-30c-22-4-40-16-52-34-8-10-22-10-30-4-8 5-9 12-6 18z" />
        <Path d="M224 176c-10 24-44 46-80 50l-8-30c22-4 40-16 52-34 8-10 22-10 30-4 8 5 9 12 6 18z" />
      </G>
      {/* heart */}
      <Path
        d="M130 196c-4 0-8-2-11-5-30-26-54-46-54-76 0-22 17-38 38-38 12 0 22 6 27 14 5-8 15-14 27-14 21 0 38 16 38 38 0 30-24 50-54 76-3 3-7 5-11 5z"
        fill={g.green600}
      />
      {/* cross */}
      <Rect x={118} y={104} width={24} height={62} rx={5} fill="#fff" />
      <Rect x={99} y={123} width={62} height={24} rx={5} fill="#fff" />
      {/* sparkles */}
      <G fill={g.green600}>
        <Rect x={54} y={48} width={6} height={20} rx={3} />
        <Rect x={47} y={55} width={20} height={6} rx={3} />
      </G>
      <G fill={g.green400}>
        <Rect x={196} y={36} width={5} height={16} rx={2.5} />
        <Rect x={190.5} y={41.5} width={16} height={5} rx={2.5} />
      </G>
      {/* little people */}
      <Circle cx={172} cy={46} r={9} fill={g.green200} />
      <Path d="M158 76c0-10 6-18 14-18s14 8 14 18z" fill={g.green200} />
      <Circle cx={212} cy={92} r={7} fill={g.green200} />
      <Path d="M201 116c0-8 5-14 11-14s11 6 11 14z" fill={g.green200} />
    </Svg>
  );
}

/** Friendly doctor bust. `variant` changes hair so list rows feel varied. */
export function DoctorAvatar({ size = 64, variant = 'female' }: { size?: number; variant?: 'female' | 'male' }) {
  const hair = g.gray900;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={32} fill={g.green50} />
      {/* coat */}
      <Path d="M10 64c0-14 9-22 22-22s22 8 22 22z" fill="#fff" />
      <Path d="M26 43l6 9 6-9" fill={g.green100} />
      <Path d="M22 45l10 19 10-19" fill="none" stroke={g.green200} strokeWidth={1.5} />
      {/* stethoscope */}
      <Path d="M24 46c-2 6 0 12 6 12" fill="none" stroke={g.gray700} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={31} cy={58} r={2} fill={g.gray700} />
      {/* neck + face */}
      <Rect x={28} y={36} width={8} height={8} rx={3} fill="#EFC7A8" />
      {variant === 'female' && <Path d="M17 32c0-12 6-20 15-20s15 8 15 20v10H17z" fill={hair} />}
      <Ellipse cx={32} cy={28} rx={10} ry={12} fill="#F6D5BA" />
      {variant === 'female' ? (
        <Path d="M22 26c1-8 5-12 10-12s9 4 10 12c-4-2-8-6-10-9-2 3-6 7-10 9z" fill={hair} />
      ) : (
        <Path d="M22 25c0-8 4-12 10-12s10 4 10 12c-2-3-5-5-10-5s-8 2-10 5z" fill={hair} />
      )}
      <Circle cx={28} cy={29} r={1.2} fill={g.gray900} />
      <Circle cx={36} cy={29} r={1.2} fill={g.gray900} />
      <Path d="M29 34c2 1.5 4 1.5 6 0" fill="none" stroke="#C98A6B" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

/** Larger doctor used on the promo card. */
export function DoctorPromoIllustration({ size = 130 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.15} viewBox="0 0 120 138">
      <Circle cx={80} cy={40} r={36} fill={g.green200} opacity={0.5} />
      <Path d="M18 138c0-30 18-50 44-50s44 20 44 50z" fill="#fff" />
      <Path d="M48 90l14 22 14-22" fill={g.green100} />
      <Path d="M52 92c-6 14-2 26 10 30" fill="none" stroke={g.gray700} strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={63} cy={122} r={4} fill={g.gray700} />
      <Rect x={55} y={70} width={14} height={16} rx={6} fill="#EFC7A8" />
      <Path d="M34 58c0-26 12-40 28-40s28 14 28 40v22H34z" fill={g.gray900} />
      <Ellipse cx={62} cy={52} rx={18} ry={22} fill="#F6D5BA" />
      <Path d="M44 48c2-14 9-22 18-22s16 8 18 22c-8-3-14-10-18-16-4 6-10 13-18 16z" fill={g.gray900} />
      <Circle cx={55} cy={54} r={2} fill={g.gray900} />
      <Circle cx={69} cy={54} r={2} fill={g.gray900} />
      <Path d="M57 63c3 2.5 7 2.5 10 0" fill="none" stroke="#C98A6B" strokeWidth={2} strokeLinecap="round" />
      {/* tablet */}
      <Rect x={20} y={96} width={30} height={40} rx={4} fill={g.green900} transform="rotate(-14 35 116)" />
    </Svg>
  );
}

/** Calendar with a check badge, used on the booking confirmation screen. */
export function CalendarCheckIllustration({ size = 200 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.85} viewBox="0 0 240 204">
      <Path
        d="M40 96c-8-48 30-84 84-86 56-2 98 28 104 76 6 50-30 96-88 104-60 8-92-40-100-94z"
        fill={g.green100}
      />
      {/* sparkle lines */}
      <G stroke={g.green600} strokeWidth={4} strokeLinecap="round">
        <Path d="M48 92l12 6" />
        <Path d="M50 122l12-4" />
        <Path d="M192 88l-12 6" />
        <Path d="M190 118l-12-4" />
      </G>
      {/* calendar */}
      <Rect x={72} y={52} width={96} height={96} rx={12} fill={g.green700} />
      <Rect x={80} y={72} width={80} height={68} rx={6} fill={g.green50} />
      <G fill={g.green700}>
        <Rect x={90} y={42} width={8} height={20} rx={4} />
        <Rect x={112} y={42} width={8} height={20} rx={4} />
        <Rect x={134} y={42} width={8} height={20} rx={4} />
      </G>
      <Path d="M96 104l14 14 26-28" fill="none" stroke={g.green500} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      {/* badge */}
      <Circle cx={160} cy={144} r={26} fill={g.green800} stroke="#fff" strokeWidth={5} />
      <Path d="M148 144l8 8 16-16" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Smiling person holding a heart, used on the "Your Health Matters" promo. */
export function HealthMattersIllustration({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 120 132">
      <G fill={g.green400} opacity={0.8}>
        <Path d="M10 120c-6-22 4-40 22-46 2 20-6 36-22 46z" />
        <Path d="M104 40c10-10 12-22 8-30-10 6-14 18-8 30z" opacity={0.6} />
      </G>
      <G fill={g.green400}>
        <Rect x={98} y={62} width={4} height={14} rx={2} />
        <Rect x={93} y={67} width={14} height={4} rx={2} />
        <Rect x={16} y={48} width={4} height={14} rx={2} />
        <Rect x={11} y={53} width={14} height={4} rx={2} />
      </G>
      <Path d="M22 132c0-26 16-44 38-44s38 18 38 44z" fill="#fff" />
      <Rect x={53} y={70} width={14} height={18} rx={6} fill="#EFC7A8" />
      <Ellipse cx={60} cy={52} rx={18} ry={21} fill="#F6D5BA" />
      <Path d="M42 48c0-16 8-24 18-24s18 8 18 24c-4-6-10-10-18-10s-14 4-18 10z" fill={g.gray900} />
      <Circle cx={53} cy={54} r={2} fill={g.gray900} />
      <Circle cx={67} cy={54} r={2} fill={g.gray900} />
      <Path d="M54 62c4 3 8 3 12 0" fill="none" stroke="#C98A6B" strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M60 128c-2 0-4-1-5-2-14-12-25-21-25-35 0-10 8-17 17-17 6 0 10 3 13 7 3-4 7-7 13-7 9 0 17 7 17 17 0 14-11 23-25 35-1 1-3 2-5 2z"
        fill={g.green700}
      />
    </Svg>
  );
}
