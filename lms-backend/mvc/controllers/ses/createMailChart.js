const QuickChart = require("quickchart-js");

let createMailChart = (data, type) => {
  try {
    // console.log(data);
    let chartImageUrl = "";
    const myChart = new QuickChart();
    if (type == "verticalbar") {
      myChart
        .setConfig({
          type: "bar",
          data: {
            labels: data.sectionwiseScore.categories,
            datasets: [
              {
                label: "correct",
                data: data.sectionwiseScore.correctScore,
                backgroundColor: ["#7CFC00"],
              },
              {
                label: "Incorrect",
                data: data.sectionwiseScore.incorrectScore,
                backgroundColor: ["#ff0000"],
              },
            ],
          },
        })
        .setWidth(200)
        .setHeight(200)
        .setBackgroundColor("transparent");
      chartImageUrl = myChart.getUrl();
    }
    if (type == "horizontalbar") {
      let data = [];
      let incorrect = data.totalQuestions - data.totalCorrect;
      let correct = data.totalCorrect;
      data.push(correct);
      data.push(incorrect);
      myChart
        .setConfig({
          type: "horizontalBar",
          data: {
            labels: ["Correct", "Incorrect"],
            datasets: [
              {
                label: "Correct",
                data: data,
                backgroundColor: ["#7CFC00", "#ff0000"],
              },
            ],
          },
        })
        .setWidth(200)
        .setHeight(200)
        .setBackgroundColor("transparent");
      chartImageUrl = myChart.getUrl();
    }

    return chartImageUrl;
  } catch (err) {
    console.log(err);
    return "unable";
  }
};
module.exports = {
  createMailChart,
};
