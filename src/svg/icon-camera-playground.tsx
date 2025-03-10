import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const CameraIconPlayground = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="url(#a)" rx={10} />
    <Path
      fill="#fff"
      d="M19.25 10c-1.366.001-2.519.01-3.5.069v4.18h3.5V10ZM14.25 10.221c-1.223.195-2.101.56-2.786 1.243-.684.684-1.048 1.563-1.242 2.786h4.028V10.22Z"
    />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M10 20c0-1.7 0-3.094.069-4.25H29.93C30 16.906 30 18.3 30 20c0 1.7 0 3.094-.069 4.25H10.07C10 23.094 10 21.7 10 20Zm10.411-1.596C21.471 19.116 22 19.472 22 20s-.53.884-1.589 1.596c-1.074.721-1.61 1.082-2.01.817C18 22.148 18 21.433 18 20c0-1.432 0-2.148.4-2.413.4-.265.938.096 2.011.817Z"
      clipRule="evenodd"
    />
    <Path
      fill="#fff"
      d="M29.778 14.25c-.194-1.223-.558-2.102-1.242-2.786-.684-.684-1.563-1.048-2.786-1.243v4.029h4.028ZM20.75 10c1.366.001 2.519.01 3.5.069v4.18h-3.5V10ZM29.778 25.75H25.75v4.028c1.223-.194 2.102-.559 2.785-1.243.685-.684 1.05-1.563 1.243-2.785ZM24.25 25.75v4.181c-.981.058-2.134.067-3.5.069v-4.25h3.5ZM19.25 30v-4.25h-3.5v4.181c.981.058 2.134.067 3.5.069ZM14.25 25.75v4.028c-1.223-.194-2.101-.559-2.786-1.243-.684-.684-1.048-1.563-1.242-2.785h4.028Z"
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
        <Stop stopColor="#835AE6" />
        <Stop offset={1} stopColor="#493280" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default CameraIconPlayground
