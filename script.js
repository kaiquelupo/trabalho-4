var selected_points = []
var svgs = []


$("#menu-bottom").hide();

$('#selection').on('change', function() {
  var value = $(this).val();
  show(value);
});

function coordinates(){
	scatterplot_dataset(parseInt($("#selection_scatterplot_1").val()), 
			parseInt($("#selection_scatterplot_2").val()));
}

function draw_points(svg){
	svg.selectAll(".dot").style("fill", function(d) {
		return "#CCC";
	});
}

function show(idx){

	if(idx == 2) $("#menu-bottom").show();
	else $("#menu-bottom").hide();


	if(idx == 0 && document.getElementById("scatterplot-pca").innerHTML == "") svgs[0] = scatterplot();
	else draw_points(svgs[0]);
  	if(idx == 1 && document.getElementById("parallel-coordinates").innerHTML == "") parallel_coordinates();
  	if(idx == 2 && document.getElementById("scatterplot-dataset").innerHTML == "") svgs[1] = scatterplot_dataset();
  	else draw_points(svgs[1]);
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
