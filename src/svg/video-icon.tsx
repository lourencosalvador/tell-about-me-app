import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const VideoIcon = (props: SvgProps) => (
  <Svg
    width={61}
    height={60}
    fill="none"
    {...props}
  >
    <Rect width={56} height={56} x={2.5} y={2} fill="url(#a)" rx={28} />
    <Rect
      width={56}
      height={56}
      x={2.5}
      y={2}
      stroke="#2A2A2E"
      strokeWidth={4}
      rx={28}
    />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M20.5 30.5v-1c0-3.288 0-4.931.908-6.038.166-.202.352-.388.554-.554C23.07 22 24.712 22 28 22c3.288 0 4.931 0 6.038.908.202.166.388.352.554.554.702.855.861 2.031.897 4.038l.67-.33c1.945-.972 2.918-1.459 3.63-1.019.711.44.711 1.527.711 3.703v.292c0 2.175 0 3.263-.711 3.703-.712.44-1.685-.047-3.63-1.02l-.67-.329c-.036 2.007-.195 3.183-.897 4.038a4.001 4.001 0 0 1-.554.554C32.93 38 31.288 38 28 38c-3.288 0-4.931 0-6.038-.908a4.001 4.001 0 0 1-.554-.554c-.908-1.107-.908-2.75-.908-6.038Zm7.5-3.75a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5h-1.75v1.75a.75.75 0 0 1-1.5 0v-1.75H25.5a.75.75 0 0 1 0-1.5h1.75V27.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={30.5}
        x2={30.5}
        y1={4}
        y2={56}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#8258E5" />
        <Stop offset={1} stopColor="#48317F" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default VideoIcon
