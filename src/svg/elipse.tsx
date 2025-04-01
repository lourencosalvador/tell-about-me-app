import * as React from "react"
import Svg, { SvgProps, G, Circle, Defs } from "react-native-svg"
const Elipse = (props: SvgProps) => (
  <Svg
    width={375}
    height={617}
    fill="none"
    {...props}
  >
    <G filter="url(#a)" opacity={0.3}>
      <Circle cx={220} cy={525} r={125} fill="#A099FF" />
    </G>
    <Defs></Defs>
  </Svg>
)
export default Elipse
