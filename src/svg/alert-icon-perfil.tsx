import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const AlertIconPerfil = (props: SvgProps) => (
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
      fill="#fff"
      d="M20 14.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75ZM20 25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
    />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M9.25 20c0-5.937 4.813-10.75 10.75-10.75S30.75 14.063 30.75 20 25.937 30.75 20 30.75 9.25 25.937 9.25 20ZM20 10.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default AlertIconPerfil
