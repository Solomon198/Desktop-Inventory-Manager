import React, { Component } from "react";
import { Card } from '../../controls';
import Chart from "react-apexcharts";

class AdminChart4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: ['January', 'February', 'March',
          'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91, 30, 40, 45, 50]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
          <Card>
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="1000"
            />
          </div>
        </div>
      </Card>
      </div>
    );
  }
}

export default AdminChart4;