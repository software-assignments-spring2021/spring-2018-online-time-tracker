let bkg = chrome.extension.getBackgroundPage();
const port = chrome.extension.connect({
    name: "Sample Communication"
});




let name;
let password;


//Draw Pie Chart
function drawPieChart() {
    chrome.storage.local.get(function(result) {

        //set up piechart
        var piechart = new CanvasJS.Chart("chart", {
            animationEnabled: true,

            title: {

                text: "Time Tracker : pie chart",
                fontSize: 12
            },

            data: [{

                type: "doughnut",
                startAngle: 0,
                indexLabel: "{label} - #percent%",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: []
            }]
        });

        //collect data for pie chart
        var index = 0;

        for (var prop in result.domains) {

            if (result.domains.hasOwnProperty(prop)) {

                //add time and website to pie chart
                piechart.options.data[0].dataPoints.push({ y: result.domains[prop].time, label: prop });

                index++;
            }
        }

        //compare functions 
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint1.y - dataPoint2.y);
        }

        //sort pie chart 
        piechart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        //draw pie chart 
        piechart.render();
    });
}

//Draw Bar Chart
function drawBarChart() {

    chrome.storage.local.get(function(result) {

        // setup bar chart
        var chart = new CanvasJS.Chart("chart", {

            animationEnabled: true,

            axisX: {
                interval: 1
            },

            axisY2: {
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Time Tracker : bar chart"
            },
            data: [{
                type: "bar",
                name: "websites",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: []
            }]
        });

        // collect data for bar chart
        var index = 0;

        for (var prop in result) {

            if (result.hasOwnProperty(prop)) {

                // add time and website to bar chart
                chart.options.data[0].dataPoints.push({ y: result[prop].time, label: prop });
                index++;
            }
        }


        // compare function for sort
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint1.y - dataPoint2.y);
        }

        // sort bar chart
        chart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        // draw chart
        chart.render();

    });
}

//Draw Column Chart
function drawColumnChart() {

    chrome.storage.local.get(function(result) {

        // setup column chart
        var chart = new CanvasJS.Chart("chart", {

            animationEnabled: true,

            title: {
                text: "Time Tracker : column chart",
                fontSize: 12
            },

            data: [{
                type: "column",
                color: "#014D65",
                dataPoints: []
            }]
        });

        // collect data for bar chart
        var index = 0;

        for (var prop in result.domains) {

            if (result.domains.hasOwnProperty(prop)) {
                // add time and website to bar chart
                chart.options.data[0].dataPoints.push({ y: result.domains[prop].time, label: prop });
                index++;
            }
        }

        // compare function
        function compareDataPointYDescend(dataPoint1, dataPoint2) {

            return (dataPoint2.y - dataPoint1.y);
        }

        // sort column chart
        chart.options.data[0].dataPoints.sort(compareDataPointYDescend);

        // draw column chart
        chart.render();

    });
}

//Draw Chart Class
class DrawChart {

    //initialize with piechart display
    constructor() {

        this.currentState = "pieChart";

    }

    //Goes to next state when draw() is done
    nextState() {

        //if piechart, go to barchart
        if (this.currentState == "pieChart") {

            this.currentState = "barChart";
        }

        //if barchart, go to column chart
        else if (this.currentState == "barChart") {

            this.currentState = "columnChart";

        }

        //if none of above, go to pie chart
        else {
            this.currentState = "pieChart";
        }
    }

    draw() {

        //if piechart, draw
        if (this.currentState == "pieChart") {

            drawPieChart();

        }

        //if barchart, draw
        else if (this.currentState == "barChart") {

            drawBarChart();
        }

        //draw column
        else {

            drawColumnChart();

        }

        //go to nextState function if done
        this.nextState();
    }
};


let drawChart = new DrawChart();

document.addEventListener('DOMContentLoaded', function(event) {

    // function getRecordingValue() {
    //     let isRecording;
    //     chrome.storage.local.get('isRecording', function(result) {
    //         isRecording = result.isRecording;
    //         console.log(isRecording);
    //         return isRecording;
    //     });


    // }
    // let recording = getRecordingValue();
    recording = true;
    // if (recording) {
    //     $("#Recording").prop("checked", true);
    // } else {
    //     $("#Recording").prop("checked", false);
    // }


    chrome.storage.local.get(function(result) {

        if (result.isRecording == undefined) {
            chrome.storage.local.set({ isRecording: true }, function() {});

        }
        if (result.isRecording) {
            $('#Recording').prop('checked', true);
            console.log(result);
            //upload result for inspection in console

            var counter = 1;
            var table = document.getElementById("timetable");
            var totalTime = 0;
            //iterates through recieved data by property

            //loop through first time to find total time
            for (var prop in result.domains) {
                if (result.domains.hasOwnProperty(prop)) {

                    //find total time to do calculations for percentage
                    totalTime = totalTime + result.domains[prop].time;
                }
            }

            //loop through second time to display data
            for (var prop in result.domains) {

                if (result.domains.hasOwnProperty(prop)) {

                    var row = table.insertRow(counter);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);

                    cell1.innerHTML = prop;

                    //display time rounded to 2nd decimail

                    cell2.innerHTML = result.domains[prop].time.toFixed(2);

                    //display percentage rounded to whole number
                    cell3.innerHTML = Math.round(result.domains[prop].time / totalTime * 100) + "%";
                    counter++;
                }
            }

            drawChart.draw();


            // chrome.runtime.sendMessage({ greeting: "GetURL" },
            //     function(response) {
            //         console.log('hello')
            //     });
        } else {
            $('#Recording').prop('checked', false);
        }
    });


    document.getElementById('form').addEventListener('submit', function(event) {
        name = document.getElementById('name').value
        password = document.getElementById('password').value
        port.postMessage(name);
        port.onMessage.addListener(function(msg) {
            console.log("message recieved" + msg);
        });

        alert(password);
    })

    document.getElementById('charts').addEventListener('click', function() {

        drawChart.draw();

    })




    $("#Recording").change(
        function() {
            if ($(this).prop('checked') == true) {
                chrome.storage.local.set({ isRecording: true }, function() {})

            } else {
                console.log("here");
                chrome.storage.local.clear();
                chrome.storage.local.set({ isRecording: false }, function() {})

            }
        });

});