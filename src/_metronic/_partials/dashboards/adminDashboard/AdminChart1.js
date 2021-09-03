import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  PieSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { Tooltip } from '@devexpress/dx-react-chart-material-ui';

const series = [
  { country: 'Russia', area: 12 },
  { country: 'Canada', area: 7 },
  { country: 'USA', area: 7 },
  { country: 'China', area: 7 },
  { country: 'Brazil', area: 6 },
  { country: 'Australia', area: 5 },
  { country: 'India', area: 2 },
  { country: 'Others', area: 55 },
];

// const TooltipContent = ({
//   data, text, style, ...props
// }) => {
//   const alignStyle = {
//     ...style,
//     paddingLeft: '10px',
//   };
//   const items = series.map(({ country, area  }) => {
//     const val = data[area];
//     return (
//       <tr key={country}>
//         {/* <td>
//           <svg width="10" height="10">
//             <circle cx="5" cy="5" r="5" fill={} />
//           </svg>
//         </td> */}
//         <td>
//           <Tooltip.Content style={alignStyle} text={country} {...props} />
//         </td>
//         <td align="right">
//           <Tooltip.Content style={alignStyle} text={val ? formatTooltip(val) : 'N/A'} {...props} />
//         </td>
//       </tr>
//     );
//   });
//   return (
//     <table>
//       {items}
//     </table>
//   );
// };

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: series,
    };
  }

  render() {
    const { data: chartData } = this.state;

    return (
      <Paper>
        <Chart
          data={chartData}
        >
          <PieSeries
            name="Expenses"
            valueField="area"
            argumentField="country"
          />
          {/* <Tooltip
            targetItem={target}
            contentComponent={this.TooltipContent}
          /> */}
        </Chart>
      </Paper>
    );
  }
}
