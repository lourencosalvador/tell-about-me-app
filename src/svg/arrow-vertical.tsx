import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ArrowVertical = (props: SvgProps) => (
  <Svg
    width={16}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M.18.512A.75.75 0 0 1 1.239.43L7.75 6.012 14.262.431a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6A.75.75 0 0 1 .18.512Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default ArrowVertical
