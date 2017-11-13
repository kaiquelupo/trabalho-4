var selected_points = []
var svgs = []


$("#menu-bottom").hide();

$('#selection').on('change', function() {
  var value = $(this).val();
  show(value);
});

function isPoint(value){
	for(i = 0; i < selected_points.length; i++){
		if(parseInt(value) == parseInt(selected_points[i])) return true;
	}

	return false;
}

function coordinates(){
	scatterplot_dataset(parseInt($("#selection_scatterplot_1").val()), 
			parseInt($("#selection_scatterplot_2").val()));
}

function draw_points(s){
	if(selected_points.length > 0){
		var color = d3.scale.linear().domain([1, 156]).range(["brown", "steelblue"]);

		console.log("entrou");
		s.selectAll(".dot").style("fill", function(d) {
			return (isPoint(d.id)) ? color(d.class) : "#CCC";
		});
	}
}

function show(idx){

	if(idx == 2) $("#menu-bottom").show();
	else $("#menu-bottom").hide();


	if(idx == 0){
		if(document.getElementById("scatterplot-pca").innerHTML == "") svgs[0] = scatterplot();
		else draw_points(svgs[0]);
	}

  	if(idx == 1 && document.getElementById("parallel-coordinates").innerHTML == "") parallel_coordinates();

  	if(idx == 2){
  		if(document.getElementById("scatterplot-dataset").innerHTML == "") svgs[1] = scatterplot_dataset();
  		else draw_points(svgs[1]);
  	}

  	if(idx == 3 && document.getElementById("table").innerHTML == "") table();


	if(idx != -1){
		ids = ["#scatterplot-pca", "#parallel-coordinates", "#scatterplot-dataset", "#table"]

		for(i = 0; i < ids.length; i++){
			if(i != idx){
				$(ids[i]).hide("fade");
				$(ids[i] + "-css").attr("disabled", "disabled");
			}
		}

		$(ids[idx] + "-css").removeAttr("disabled");
		$(ids[idx]).show("fade");
	}
}
