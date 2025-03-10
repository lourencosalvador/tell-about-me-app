import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const PenIcon = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M0 20C0 12.523 0 8.785 1.608 6A12 12 0 0 1 6 1.608C8.785 0 12.523 0 20 0s11.215 0 14 1.608A12 12 0 0 1 38.392 6C40 8.785 40 12.523 40 20s0 11.215-1.608 14A12 12 0 0 1 34 38.392C31.215 40 27.477 40 20 40S8.785 40 6 38.392A12 12 0 0 1 1.608 34C0 31.215 0 27.477 0 20Z"
    />
    <Path
      fill="#fff"
      d="M13.75 9a.75.75 0 0 1 .75.75v1.85l1.72-.344a8.676 8.676 0 0 1 4.925.452l.413.165a7.3 7.3 0 0 0 4.482.305.73.73 0 0 1 .803 1.083l-1.278 2.131c-.342.57-.513.854-.553 1.163-.017.13-.017.26 0 .39.04.31.211.594.553 1.163l1.56 2.6a.9.9 0 0 1-.553 1.337l-.1.024a8.677 8.677 0 0 1-5.327-.361 8.676 8.676 0 0 0-4.924-.452L14.5 21.6v8.15a.75.75 0 0 1-1.5 0v-20a.75.75 0 0 1 .75-.75Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={20}
        x2={20}
        y1={0}
        y2={40}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#8258E5" />
        <Stop offset={1} stopColor="#48317F" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default PenIcon
