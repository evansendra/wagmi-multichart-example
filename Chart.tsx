import {LineChart, useLineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {curveLinear} from "d3-shape";
import {useMemo, useState} from "react";
import {runOnJS, useAnimatedReaction} from "react-native-reanimated";
import {Dimensions, View} from "react-native";

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