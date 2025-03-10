import * as React from "react"
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const ChatIconPlayground = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="url(#a)" rx={10} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="m21.087 29.388.542-.916c.42-.71.63-1.066.968-1.262.338-.197.763-.204 1.613-.219 1.256-.021 2.043-.098 2.703-.372a5 5 0 0 0 2.706-2.706C30 22.995 30 21.83 30 19.5v-1c0-3.273 0-4.91-.737-6.113a5 5 0 0 0-1.65-1.65C26.41 10 24.773 10 21.5 10h-3c-3.273 0-4.91 0-6.113.737a5 5 0 0 0-1.65 1.65C10 13.59 10 15.227 10 18.5v1c0 2.33 0 3.495.38 4.413a5 5 0 0 0 2.707 2.706c.66.274 1.447.35 2.703.372.85.015 1.275.022 1.613.219.338.196.548.551.968 1.262l.542.916c.483.816 1.69.816 2.174 0ZM20 14.25a.75.75 0 0 1 .75.75v8a.75.75 0 0 1-1.5 0v-8a.75.75 0 0 1 .75-.75ZM16.75 17a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm7.25-.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={20}
        x2={20}
        y1={0}
        y2={40}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#835AE6" />
        <Stop offset={1} stopColor="#493280" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default ChatIconPlayground
