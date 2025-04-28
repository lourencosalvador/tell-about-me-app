import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const VideoEmptyIcon = (props: SvgProps) => (
    <Svg
    width={58}
    height={58}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m38.063 25.382 11.405-11.406c1.142-1.142 3.094-.333 3.094 1.282v27.498c0 1.615-1.952 2.423-3.094 1.282L38.062 32.632M29 45.319H10.875a5.437 5.437 0 0 1-5.438-5.437V21.757m31.033 21.97 3.405 3.405m-3.405-3.405a5.42 5.42 0 0 0 1.593-3.845v-21.75a5.438 5.438 0 0 0-5.438-5.438h-21.75a5.42 5.42 0 0 0-3.845 1.593m29.44 29.44L7.03 14.287m-3.405-3.405 3.405 3.405"
    />
  </Svg>
)
export default VideoEmptyIcon
