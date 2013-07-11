google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

  // var data = new google.visualization.DataTable();
  // //var graph_data = chart_data["dates"];

  // data.addColumn('string', 'День');
  // data.addColumn('number', "name2");
  // data.addColumn('number', "name1");

  // var rows = []
  // // for (var i = graph_data.length - 1; i >= 0; i--) {
  // //     rows.push([graph_data[i]["date"], graph_data[i]["former_visits"], graph_data[i]["visits"]]);
  // // }
  // rows.push("2013-07-01", 10, 15);
  // rows.push("2013-07-02", 12, 13);
  // rows.push("2013-07-03", 5, 15);

  // data.addRows(rows);

  var data = google.visualization.arrayToDataTable(gdata);

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, {
                    width: '100%',
                    height: '70%',
                    title: 'Сравнение посещаемости',
                    pointSize: 12,
                    colors:['green','red'],
                    lineWidth: 6,
                    legend: "top",
                    vAxis: {title: 'Визиты', titleTextStyle: {color: '#FF0000'}}
                   }
         );
}

$(document).ready(function () {
  $(window).resize(function(){
    drawChart();
  });
});