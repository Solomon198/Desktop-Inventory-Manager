import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "../../controls";
export default class AdminChart5 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "candle",
          data: [
            {
              x: new Date(1538866800000),
              y: [6591.97, 6596.07, 6585, 6588.39]
            },
            {
              x: new Date(1538868600000),
              y: [6587.6, 6598.21, 6587.6, 6594.27]
            },
            {
              x: new Date(1538870400000),
              y: [6596.44, 6601, 6590, 6596.55]
            },
            {
              x: new Date(1538872200000),
              y: [6598.91, 6605, 6596.61, 6600.02]
            },
            {
              x: new Date(1538874000000),
              y: [6600.55, 6605, 6589.14, 6593.01]
            },
            {
              x: new Date(1538875800000),
              y: [6593.15, 6605, 6592, 6603.06]
            },
            {
              x: new Date(1538877600000),
              y: [6603.07, 6604.5, 6599.09, 6603.89]
            },
            {
              x: new Date(1538879400000),
              y: [6604.44, 6604.44, 6600, 6603.5]
            },
            {
              x: new Date(1538881200000),
              y: [6603.5, 6603.99, 6597.5, 6603.86]
            },
            {
              x: new Date(1634883000000),
              y: [6603.85, 6605, 6600, 6604.07]
            },
            {
              x: new Date(1648884800000),
              y: [6604.98, 6606, 6604.07, 6606]
            }
          ]
        }
      ],
      options: {
        chart: {
          height: 350,
          type: "candlestick"
        },
        xaxis: {
          type: "category"
          //tickPlacement: 'between',
        },
        yaxis: {
          legend: {
            title: "dan"
          }
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            return (
              '<div class="arrow_box">' +
              "<span>" +
              //the whole series is offered as a prop
              //plus the relevant series in the data if there are more than one
              //plus the index of where this sits on the x axis
              //plus a global object w to extract other chart data.
              //apexcharts.js/src/modules/settings/Globals.js
              //usw W for better access rather than series[seriesindex][datapointindex]
              JSON.stringify(w.globals.categoryLabels[dataPointIndex]) +
              "</span>" +
              "</div>"
            );
          }
        }
      }
    };
  }

  render() {
    return (
      <div id="chart">
          <Card>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="candlestick"
          height={350}
        />
      </Card>
      </div>
    );
  }
}