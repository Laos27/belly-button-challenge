const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

function buildMetadata(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      var result = metadata.find((sampleObject) => sampleObject.id == sample);
      var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    });
  }
  
  // Function to plot charts
  function buildCharts(sample) {
    d3.json(url).then((data) => {
      var samples = data.samples;
      var result = samples.find((sampleObject) => sampleObject.id == sample);
  
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
  
      // Bybble Chart
      var bubbleLayout = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest"
      };
  
      var bubbleData = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Bar Chart
      var barData = [
        {
          y: ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
          x: values.slice(0, 10).reverse(),
          text: labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
        }
      ];
      
      //Apply a Title to the Layout
      var barLayout = {
        title: "Top 10 OTUs Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  function init() {
    var selector = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialise the dashboard
  init();