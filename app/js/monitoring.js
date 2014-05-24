var n = 40,
    // random = d3.random.normal(25, );
    random = function() {
      return Math.floor(Math.random() * 50);
    };

function chart(domain, interpolation, tick) {
  var data = d3.range(n).map(random);
  var data2 = d3.range(n).map(random);

  var margin = {top: 6, right: 0, bottom: 6, left: 40},
      width = 960 - margin.right,
      height = 120 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain(domain)
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, 50])
      .range([height, 0]);

  var line = d3.svg.line()
      .interpolate(interpolation)
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  var line2 = d3.svg.line()
      .interpolate(interpolation)
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", -margin.left + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).tickValues([50]).orient("left"));

  var path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

  var path2 = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .data([data2])
  .attr("class", "line2")
  .attr("stroke", "red")
  .attr("stroke-width", "1.5px")
  .attr("fill", "none")
  .attr("d", line2);

  tick(path, line, data, x);
  tick(path2, line2, data2, x);
}