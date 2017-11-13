function scatterplot_dataset(first_idx, second_idx){

    var svg;

    //Atributos do dataset
    var data_params = ["Teaching_Rating", "Inter_Outlook_Rating", "Research_Rating",
                   "Citations_Rating", "Industry_Income_Rating", "Num_Students",
                   "Student/Staff_Ratio", "%_Inter_Students", "%_Female_Students"];

    //Tamanho e margem da cena.
    var margin = {top: 20, right: 20, bottom: 80, left: 40},
        width = (window.innerWidth-20) - margin.left - margin.right,
        height = (window.innerHeight-20) - margin.top - margin.bottom;

    //Modo com o qual o eixo x varia.
    var x = d3.scale.linear()
        .range([0, width]);

    //Modo com o qual o eixo y varia.
    var y = d3.scale.linear()
        .range([height, 0]);

    //Escala de cor para os pontos que serão plotados. Essa escala vai do valor 1
    //ao 156 pois as posições do ranking variam dentro deste intervalo.
    var color = d3.scale.linear().domain([1, 156]).range(["brown", "steelblue"]);

    //Configuração para o eixo x aparecer na parte de baixo.
    var xAxis = d3.svg.axis()
        .scale(x).orient("bottom");

    //Configuração para o eixo y aparecer na parte no lado esquerdo.
    var yAxis = d3.svg.axis()
        .scale(y).orient("left");

    //Remove qualquer svg criado anteriormente nesta div.
    d3.select("#scatterplot-dataset").selectAll("svg").remove();

    //Cria um svg nesta div.
    svg = d3.select("#scatterplot-dataset").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Lê o arquivo tsv e constroi o gráfico
    d3.tsv("dataset.tsv", function(error, data) {
      if (error) throw error;


       data.forEach(function(d) {
          d.component1 = +d[data_params[first_idx]];
          d.component2 = +d[data_params[second_idx]];
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
          .text(data_params[first_idx]);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(data_params[second_idx])

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

    });
}