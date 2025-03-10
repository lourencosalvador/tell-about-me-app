import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const ArrowUpIcon = (props: SvgProps) => (
  <Svg
    width={16}
    height={17}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m4.667 11.833 6.666-6.666M4.667 5.167h6.666v6.666"
    />
  </Svg>
)
export default ArrowUpIcon
