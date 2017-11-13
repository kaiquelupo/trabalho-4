function parallel_coordinates(){
    var species = ["setosa", "versicolor", "virginica"],
        traits = ["Teaching_Rating", "Inter_Outlook_Rating", "Research_Rating", 
                  "Citations_Rating", "Industry_Income_Rating", "Num_Students",  
                  "Student/Staff_Ratio", "%_Inter_Students",  "%_Female_Students"];


    var color = d3.scale.linear().domain([1, 156]).range(["brown", "steelblue"]);

    var m = [80, 60, 10, window.innerWidth/25],
        w = (window.innerWidth-20) - m[1] - m[3],
        h = (window.innerHeight-20) - m[0] - m[2];

    var x = d3.scale.ordinal().domain(traits).rangePoints([0, w]),
        y = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground;


    d3.select("#parallel-coordinates").selectAll("svg").remove(); 

    var svg = d3.select("#parallel-coordinates").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    d3.tsv("dataset.tsv", function(flowers) {

      // Create a scale and brush for each trait.
      traits.forEach(function(d) {
        // Coerce values to numbers.
        flowers.forEach(function(p) { p[d] = +p[d]; });

        y[d] = d3.scale.linear()
            .domain(d3.extent(flowers, function(p) { return p[d]; }))
            .range([h, 0]);

        y[d].brush = d3.svg.brush()
            .y(y[d])
            .on("brush", brush);
     });

      // Add foreground lines.
      foreground = svg.append("svg:g")
          .attr("class", "foreground")
        .selectAll("path")
          .data(flowers)
        .enter().append("svg:path")
          .attr("d", path)
          .attr("stroke", function(d) { return color(d.class); })
          //.attr("class", function(d) { return d.species; });

      // Add a group element for each trait.
      var g = svg.selectAll(".trait")
          .data(traits)
        .enter().append("svg:g")
          .attr("class", "trait")
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
          .call(d3.behavior.drag()
          .origin(function(d) { return {x: x(d)}; })
          .on("dragstart", dragstart)
          .on("drag", drag)
          .on("dragend", dragend));

      // Add an axis and title.
      g.append("svg:g")
          .attr("class", "axis")
          .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("svg:text")
          .attr("text-anchor", "middle")
          .attr("y", -9)
          .text(String);

      // Add a brush for each axis.
      g.append("svg:g")
          .attr("class", "brush")
          .each(function(d) { d3.select(this).call(y[d].brush); })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

      function dragstart(d) {
        i = traits.indexOf(d);
      }

      function drag(d) {
        x.range()[i] = d3.event.x;
        traits.sort(function(a, b) { return x(a) - x(b); });
        g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        foreground.attr("d", path);
      }

      function dragend(d) {
        x.domain(traits).rangePoints([0, w]);
        var t = d3.transition().duration(500);
        t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        t.selectAll(".foreground path").attr("d", path);
      }
    });

    // Returns the path for a given data point.
    function path(d) {
      return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = traits.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      foreground.classed("fade", function(d) {
        return !actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        });
      });
    }


}