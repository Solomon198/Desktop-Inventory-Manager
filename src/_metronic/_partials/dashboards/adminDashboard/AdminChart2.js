import React from 'react'
import { Card } from '../../controls';
import {
    // main component
    Chart, 
    // graphs
    Bars, Cloud, Dots, Labels, Lines, Pies, RadialLines, Ticks, Title,
    // wrappers
    Layer, Animate, Transform, Handlers,
    // helpers
    helpers, DropShadow, Gradient
  } from 'rumble-charts';

  const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

export default function AdminBarChart2(){
    return(
        <Card>
            <Chart width={600} height={250} series={series} minY={0} maxY={20}>
                <Bars innerPadding={5} groupPadding={10} />
                <Lines />
                <Dots />
            </Chart>
        </Card>
    )
}