import {LineChart, useLineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {curveLinear} from "d3-shape";
import {useState} from "react";
import {runOnJS, useAnimatedReaction} from "react-native-reanimated";
import {View} from "react-native";

const data = [
    {
        timestamp: 1625945400000,
        value: 33575.25,
    },
    {
        timestamp: 1625945850000,
        value: 33565.25,
    },
    {
        timestamp: 1625946300000,
        value: 33545.25,
    },
    {
        timestamp: 1625946750000,
        value: 33535.25,
    },
    {
        timestamp: 1625947200000,
        value: 33510.25,
    },
    {
        timestamp: 1625948100000,
        value: 33215.25,
    },
];

const data2 = data.map((point, idx, arr) => {
    return arr[arr.length - 1 - idx];
});

const ChartData = function ChartData() {
    const [textWidth, setTextWidth] = useState<number>(0);

    // remove from here to see that errors disappear without hook usage

    const { currentX, isActive } = LineChart.useChart();


    const [xDisplacement, setXDisplacement] = useState<number>(0);

    useAnimatedReaction(() => currentX.value,
    () => {
      console.log(`x: `, currentX.value);
        runOnJS(setXDisplacement)(currentX.value);
    });

    // end removal

    const onTextLayout = (e: any) => {
        setTextWidth(e.nativeEvent.layout.width);
    }

    return (
        <LineChart.Group>
            <LineChart id="one" shape={curveLinear}>
                <LineChart.Path />
                <LineChart.CursorCrosshair snapToPoint>
                    <LineChart.Tooltip />
                </LineChart.CursorCrosshair>
            </LineChart>
            <LineChart id="two" shape={curveLinear}>
                <LineChart.Path color="green" />
                <LineChart.CursorCrosshair snapToPoint>
                    <LineChart.Tooltip position="bottom" />
                    <LineChart.CursorLine />
                </LineChart.CursorCrosshair>
                <View style={{
                    position: 'absolute',
                    bottom: -25,
                    // left: xDisplacement,
                    left: '50%',
                    transform: [{ translateX: -(textWidth / 2) }],
                }} onLayout={onTextLayout}>
                    <LineChart.DatetimeText style={{ textAlign: 'center' }} />
                </View>
            </LineChart>
        </LineChart.Group>
    )
}

const Chart = function Chart() {
    return (
        <GestureHandlerRootView>
            <LineChart.Provider data={{
                one: data,
                two: data2,
            }}>
                <ChartData />
            </LineChart.Provider>
        </GestureHandlerRootView>
    );
}

export default Chart;