import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ArrowHorizontal = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M8.512 19.57a.75.75 0 0 1-.081-1.058L14.012 12 8.431 5.488a.75.75 0 1 1 1.138-.976l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.057.081Z"
      clipRule="evenodd"
      opacity={0.5}
    />
  </Svg>
)
export default ArrowHorizontal
