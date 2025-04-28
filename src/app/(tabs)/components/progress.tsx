import {Text, View} from "react-native"
import Svg, { Circle } from 'react-native-svg';

export default function ProgressCircle ({ percentage }: { percentage: number }) {
    const size = 70; 
    const strokeWidth = 10; 
    const radius = (size - strokeWidth) / 2; 
    const circumference = 2 * Math.PI * radius; 
    const progress = (percentage / 100) * circumference; 
  
    return (
      <View className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#333"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#8257E5"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <Text className="absolute text-white text-lg font-bold">{percentage}%</Text>
      </View>
    );
  };
  