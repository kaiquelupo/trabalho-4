var selected_points = []


$("#menu-bottom").hide();

$('#selection').on('change', function() {
  var value = $(this).val();
  show(value);
});

function coordinates(){
	scatterplot(0, parseInt($("#selection_scatterplot_1").val()), 
			parseInt($("#selection_scatterplot_2").val()));
}

function show(idx){

	if(idx == 2) $("#menu-bottom").show();
	else $("#menu-bottom").hide();


	if(idx == 0 && document.getElementById("scatterplot-pca").innerHTML == "") scatterplot(1);
  	if(idx == 1 && document.getElementById("parallel-coordinates").innerHTML == "") parallel_coordinates();
  	if(idx == 2 && document.getElementById("scatterplot-dataset").innerHTML == "") scatterplot(0);
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
