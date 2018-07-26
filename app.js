// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 90
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "margin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("./data.csv", function (error, povhcareData) {

  // Log an error if one exists
  if (error) return console.warn(error);

  // Print the tvData
  //console.log(povhcareData);

  // Cast the hours value to a number for each piece of tvData
  povhcareData.forEach(function (data) {
     data.poverty = +data.poverty;
     data.healthcare = +data.healthcare;
     //console.log(data.abbr);
  });

   // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([9, d3.max(povhcareData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povhcareData, d => d.healthcare)])
    .range([height, 0]);

    // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(povhcareData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    //.attr("opacity", ".5")

    chartGroup.selectAll("text")
    .data(povhcareData)
    .enter()
    .append("text")
    .text(function(d) {
       console.log(d.abbr);
       return d.abbr;
    })
    .style("text-anchor", "middle")
    .attr("x", d =>  { return xLinearScale(d.poverty); } ) // * 20 - 10 //-.1
    .attr("y", function (d) { return yLinearScale(d.healthcare -.2 ); } ) //- .3
    .attr("font-size", "10px")
    .attr("fill", "white");
     

  // Step 6: Initialize tool tip
  // ==============================
  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([80, -60])
  //   .html(function (d) {
  //     return (`${d.state}<br> Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
  //   });

  // // Step 7: Create tooltip in the chart
  // // ==============================
  // chartGroup.call(toolTip);

  // circlesGroup.on("click", function (data) {
  //   toolTip.show(data);
  // })
  // // onmouseout event
  // .on("mouseout", function (data, index) {
  //   toolTip.hide(data);
  // });

// Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

chartGroup.append("text")
  .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");



 });