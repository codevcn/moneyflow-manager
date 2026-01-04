import Svg, { Circle, Path } from "react-native-svg"

type IconProps = {
  size?: number
  color?: string
}

export function ListIcon({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M3 12h18M3 18h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ChartIcon({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function PlusIcon({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  )
}

export function MoneyFlowIcon({ size = 120, color = "#000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="40" fill={color} opacity="0.1" />
      <Path
        d="M40 20C28.954 20 20 28.954 20 40C20 51.046 28.954 60 40 60C51.046 60 60 51.046 60 40C60 28.954 51.046 20 40 20ZM40 55C31.729 55 25 48.271 25 40C25 31.729 31.729 25 40 25C48.271 25 55 31.729 55 40C55 48.271 48.271 55 40 55Z"
        fill={color}
      />
      <Path
        d="M40 30V40L47 47"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function EmptyStateIcon({ size = 120, color = "#000", backgroundColor = "#f0f0f0" }: IconProps & { backgroundColor?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="50" fill={backgroundColor} />
      <Path
        d="M60 30v40M40 60h40"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  )
}
