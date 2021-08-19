import React from 'react'
import { Card } from '../../controls';
import {Line} from 'react-chartjs-2'

const state = {
    labels: ['January', 'February', 'March',
             'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 65, 59, 80, 81, 56, 99, 80]
      }
    ]
  }

export default function AdminLineChart() {
    return (
        <Card>
          <div>
          <Line
            data={state}
            options={{
              title:{
                display:true,
                text:'Average Sales per month',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              }
            }}
          />
        </div>
        </Card>
      );
}