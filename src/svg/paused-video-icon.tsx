import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const PausedVideoIcon = (props: SvgProps) => (
  <Svg
    width={27}
    height={27}
    fill="none"
    {...props}
  >
    <Path
      fill="#8258E5"
      d="M2.25 6.75c0-2.121 0-3.182.659-3.841.659-.659 1.72-.659 3.841-.659 2.121 0 3.182 0 3.841.659.659.659.659 1.72.659 3.841v13.5c0 2.121 0 3.182-.659 3.841-.659.659-1.72.659-3.841.659-2.121 0-3.182 0-3.841-.659-.659-.659-.659-1.72-.659-3.841V6.75ZM15.75 6.75c0-2.121 0-3.182.659-3.841.659-.659 1.72-.659 3.841-.659 2.121 0 3.182 0 3.841.659.659.659.659 1.72.659 3.841v13.5c0 2.121 0 3.182-.659 3.841-.659.659-1.72.659-3.841.659-2.121 0-3.182 0-3.841-.659-.659-.659-.659-1.72-.659-3.841V6.75Z"
    />
  </Svg>
)
export default PausedVideoIcon
