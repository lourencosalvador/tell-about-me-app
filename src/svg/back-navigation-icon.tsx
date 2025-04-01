import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const BackNavigationButtom = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="#262626"
      d="M0 20C0 12.523 0 8.785 1.608 6A12 12 0 0 1 6 1.608C8.785 0 12.523 0 20 0s11.215 0 14 1.608A12 12 0 0 1 38.392 6C40 8.785 40 12.523 40 20s0 11.215-1.608 14A12 12 0 0 1 34 38.392C31.215 40 27.477 40 20 40S8.785 40 6 38.392A12 12 0 0 1 1.608 34C0 31.215 0 27.477 0 20Z"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m22 25.28-4.347-4.347a1.324 1.324 0 0 1 0-1.866L22 14.72"
    />
  </Svg>
)
export default BackNavigationButtom
