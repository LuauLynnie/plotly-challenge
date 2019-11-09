function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
               
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);

        console.log(`${key}: ${value}`)
    })
  })
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let plotData = `/samples/${sample}`;
  d3.json(plotData).then(function(data){

    // @TODO: Build a Bubble Chart using the sample data
    let x_axis = data.otu_ids;
    let y_axis = data.sample_values;
    let size = data.sample_values;
    let color = data.otu_ids;
    let texts = data.otu_labels;

    let bubble = {
        x: x_axis,
        y: y_axis,
        text: texts,
        mode: `markers`,
        marker: {
          size: size,
          color: color
        }
      };
  
      let dataBubble = [bubble];
      let layout = {
        title: "Belly Button Bacteria",
        xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", dataBubble, layout);


    // @TODO: Build a Pie Chart
    d3.json(plotData).then(function(data){
    // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
      let values = data.sample_values.slice(0,10);
      let labels = data.otu_ids.slice(0,10);
      let display = data.otu_labels.slice(0,10);

      let pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
};


function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);