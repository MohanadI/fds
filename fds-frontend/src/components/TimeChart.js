import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function TimeChart(predictions) {
  /*
1-> fraud (3)
2-> abuse (2)
6-> waste (1)
else -> normal(0)
  */
  // const finalTransactions = predictions.data.map((prediction) => {
  //   if (prediction["Scaled Cluster"] === "0") {
  //     return 3.5;
  //   } else if (
  //     prediction["Scaled Cluster"] === "1" ||
  //     prediction["Scaled Cluster"] === "4"
  //   ) {
  //     return 2.5;
  //   } else if (prediction["Scaled Cluster"] === "5") {
  //     return 1.5;
  //   }
  //   return 0.5;
  // });

  const filteredData = predictions?.data.map((item) => {
    return item.PATIENT_CLUSTER
  });

  console.log(filteredData);
  
  let options = {
    chart: {
      type: "spline",
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: "Transactions over time",
      align: "left",
    },
    subtitle: {
      text: "These values represents the predictions made by the system",
      align: "left",
    },
    xAxis: {
      type: "datetime",
      labels: {
        overflow: "justify",
      },
    },
    yAxis: {
      title: {
        text: "Fraud Risk ( > high )",
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      alternateGridColor: null,
      plotBands: [
        {
          // Low Risk fraud
          from: 0,
          to: 1,
          color: "rgba(68, 170, 213, 0.1)",
          label: {
            text: "Normal",
            style: {
              color: "#606060",
            },
          },
        },
        {
          // Gentle Risk fraud
          from: 1,
          to: 2,
          color: "rgba(186, 235, 255, 0.1)",
          label: {
            text: "Waste",
            style: {
              color: "#606060",
            },
          },
        },
        {
          // Moderate Risk
          from: 2,
          to: 3,
          color: "rgba(186, 235, 255, 0.3)",
          label: {
            text: "Abuse",
            style: {
              color: "#606060",
            },
          },
        },
        {
          // High Risk
          from: 3,
          to: 4,
          color: "rgba(255, 220, 220, 0.2)",
          label: {
            text: "Fraud",
            style: {
              color: "#606060",
            },
          },
        },
      ],
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        let self = this;
        let formattedString = "<small></small><table>";
        self.points.forEach((elem) => {
          formattedString +=
            '<tr><td style="color: {series.color}">' +
            elem.series.seqId +
            ": </td>";
          formattedString +=
            '<td style="text-align: right"><b>' +
            elem.patientCluster +
            "</b></td>";
          formattedString +=
            '<td style="text-align: right">cts: <b>' +
            elem.point.doctorCluster +
            "</b></td></tr>";
        });
        return formattedString;
      },
    },
    plotOptions: {
      spline: {
        lineWidth: 4,
        states: {
          hover: {
            lineWidth: 5,
          },
        },
        marker: {
          enabled: false,
        },
        pointInterval: 36000, // one hour
        pointStart: Date.now(),
      },
    },
    series: [
      {
        name: "Transaction",
        data: filteredData,
      },
    ],
    navigation: {
      menuItemStyle: {
        fontSize: "10px",
      },
    },
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default TimeChart;
