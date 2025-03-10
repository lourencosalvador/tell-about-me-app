import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const VoiceIcon = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M9 .25a.75.75 0 0 1 .75.75v16a.75.75 0 0 1-1.5 0V1A.75.75 0 0 1 9 .25Zm-4 3a.75.75 0 0 1 .75.75v10a.75.75 0 0 1-1.5 0V4A.75.75 0 0 1 5 3.25Zm8 0a.75.75 0 0 1 .75.75v10a.75.75 0 0 1-1.5 0V4a.75.75 0 0 1 .75-.75Zm-12 4a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8A.75.75 0 0 1 1 7.25Zm16 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default VoiceIcon
