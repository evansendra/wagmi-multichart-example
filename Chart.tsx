import {LineChart, useLineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {curveLinear} from "d3-shape";
import {useMemo, useState} from "react";
import {runOnJS, useAnimatedReaction} from "react-native-reanimated";
import {Dimensions, View} from "react-native";

// const data = [
//     {
//         timestamp: 1625945400000,
//         value: 33575.25,
//     },
//     {
//         timestamp: 1625945850000,
//         value: 33565.25,
//     },
//     {
//         timestamp: 1625946300000,
//         value: 33545.25,
//     },
//     {
//         timestamp: 1625946750000,
//         value: 33535.25,
//     },
//     {
//         timestamp: 1625947200000,
//         value: 33510.25,
//     },
//     {
//         timestamp: 1625948100000,
//         value: 33215.25,
//     },
// ];
const data = [
    {"timestamp": 1708473600000, "value": 133.12},
    {"timestamp": 1708473660000, "value": 105.34},
    {"timestamp": 1708473720000, "value": 117.53},
    {"timestamp": 1708473780000, "value": 143.80},
    {"timestamp": 1708473840000, "value": 136.40},
]

const data2 = [
    {"timestamp": 1708473600000, "value": 61.01},
    {"timestamp": 1708473660000, "value": 107.40},
    {"timestamp": 1708473720000, "value": 56.51},
    {"timestamp": 1708473780000, "value": 52.27},
    {"timestamp": 1708473840000, "value": 55.69},
]

// const data2 = data.map((point, idx, arr) => {
//     return arr[arr.length - 1 - idx];
// });

const LineChartOne = function LineChartOne() {
    return (
        <>
            <LineChart.Path />
            <LineChart.CursorCrosshair snapToPoint>
                <LineChart.Tooltip />
            </LineChart.CursorCrosshair>
        </>
    )
}

const screenWidth = Dimensions.get('window').width;

const LineChartTwo = function LineChartTwo() {
    const [textWidth, setTextWidth] = useState<number>(0);
    const [xDisplacement, setXDisplacement] = useState<number>(0);

    const { currentX, isActive } = LineChart.useChart();

    useAnimatedReaction(() => currentX.value,
    () => {
      console.log(`x: `, currentX.value);
        runOnJS(setXDisplacement)(currentX.value);
    });

    const onTextLayout = (e: any) => {
        setTextWidth(e.nativeEvent.layout.width);
    }

    const safeXDisplacement= useMemo(() => {
        const halfTextWidth = textWidth / 2;
        if (xDisplacement < halfTextWidth) {
            return halfTextWidth;
        }

        if (xDisplacement > screenWidth - halfTextWidth) {
            return screenWidth - halfTextWidth;
        }

        return xDisplacement;
    }, [xDisplacement, textWidth]);

    return (
        <>
            <LineChart.Path color="green" />
            <LineChart.CursorCrosshair snapToPoint>
                <LineChart.Tooltip position="bottom" />
                <LineChart.CursorLine />
            </LineChart.CursorCrosshair>
            <View style={{
                position: 'absolute',
                bottom: -25,
                left: safeXDisplacement,
                transform: [{ translateX: -(textWidth / 2) }],
            }} onLayout={onTextLayout}>
                <LineChart.DatetimeText style={{ textAlign: 'center' }} />
            </View>
        </>
    )
}

const ChartData = function ChartData() {
        return (
        <LineChart.Group>
            <LineChart id="one" shape={curveLinear}>
                <LineChartOne />
            </LineChart>
            <LineChart id="two" shape={curveLinear}>
                <LineChartTwo />
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