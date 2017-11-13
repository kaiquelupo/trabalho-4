function scatterplot(){

    var svg;

    var margin = {top: 20, right: 20, bottom: 80, left: 40},
        width = (window.innerWidth-20) - margin.left - margin.right,
        height = (window.innerHeight-20) - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.linear().domain([1, 156]).range(["brown", "steelblue"]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y).orient("left");

    d3.select("#scatterplot-pca").selectAll("svg").remove();
    svg = d3.select("#scatterplot-pca").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("pca.tsv", function(error, data) {
      if (error) throw error;


       data.forEach(function(d) {
          d.component1 = +d.component1;
          d.component2 = +d.component2;
      });

      x.domain(d3.extent(data, function(d) { return d.component1; })).nice();
      y.domain(d3.extent(data, function(d) { return d.component2; })).nice();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Primeiro Componente");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Segundo Componente")

      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", window.innerWidth/244)
          .attr("cx", function(d) { return x(d.component1); })
          .attr("cy", function(d) { return y(d.component2); })
          .style("fill", function(d) { return color(d.class); });

       // Brush.
      var brush = d3.svg.brush()
          .on("brushstart", brushstart)
          .on("brush", brush)
          .on("brushend", brushend);

      // Plot brush.
      svg.call(brush.x(x).y(y));

      // Clear the previously-active brush, if any.
      function brushstart(p) {
        if (brush.data !== p) {
          svg.call(brush.clear());
          brush.x(p.x).y(p.y).data = p;
        }
      }

      // Highlight the selected circles.
      function brush(p) {
        selected_points = [];

        var e = brush.extent();
        svg.selectAll(".dot").style("fill", function(d) {
            if(e[0][0] <= d.component1 && d.component1 <= e[1][0]
                && e[0][1] <= d.component2 && d.component2 <= e[1][1]){
                return color(d.class);
              }else{
                return "#CCC";
              }
        });
      }

      // If the brush is empty, select all circles.
      function brushend() {
        if (brush.empty()) svg.selectAll(".dot").style("fill", function(d) {
          return color(d.class); 
        });
      }




      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });*/

    });
}