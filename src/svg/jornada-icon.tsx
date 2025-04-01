import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const JornadaIcon = (props: SvgProps) => (
  <Svg
    width={15}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M.75 0a.75.75 0 0 1 .75.75V2.6l1.72-.344a8.677 8.677 0 0 1 4.925.452l.413.165a7.3 7.3 0 0 0 4.482.304.73.73 0 0 1 .803 1.084l-1.278 2.131c-.342.57-.513.854-.553 1.163-.017.13-.017.26 0 .39.04.309.211.594.553 1.163l1.56 2.6a.9.9 0 0 1-.553 1.336l-.1.025a8.677 8.677 0 0 1-5.327-.361 8.676 8.676 0 0 0-4.924-.452L1.5 12.6v8.15a.75.75 0 0 1-1.5 0v-20A.75.75 0 0 1 .75 0Z"
    />
  </Svg>
)
export default JornadaIcon
