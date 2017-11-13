 function table(){

	 d3.tsv("dataset.tsv", function(error, data) {
			  if (error) throw error;

			  var margin = {top: 20, right: 20, bottom: 80, left: 40},
		      width = (window.innerWidth-20) - margin.left - margin.right,
		      height = (window.innerHeight-20) - margin.top - margin.bottom;
			  
			  var sortAscending = true;
			  var table = d3.select('#table').append('table');
			  var titles = d3.keys(data[0]);
			  var headers = table.append('thead').append('tr')
			                   .selectAll('th')
			                   .attr("transform", "translate(0,20)")
			                   .data(titles).enter()
			                   .append('th')
			                   .text(function (d) {
				                    return d;
			                    })
			                   .on('click', function (d) {
			                	   headers.attr('class', 'header');
			                	   
			                	   if (sortAscending) {
			                	     rows.sort(function(a, b) { return b[d] < a[d]; });
			                	     sortAscending = false;
			                	     this.className = 'aes';
			                	   } else {
			                		 rows.sort(function(a, b) { return b[d] > a[d]; });
			                		 sortAscending = true;
			                		 this.className = 'des';
			                	   }
			                	   
			                   });
			  
			  var rows = table.append('tbody').selectAll('tr')
			               .data(data).enter()
			               .append('tr');
			  rows.selectAll('td')
			    .data(function (d) {
			    	return titles.map(function (k) {
			    		return { 'value': d[k], 'name': k};
			    	});
			    }).enter()
			    .append('td')
			    .attr('data-th', function (d) {
			    	return d.name;
			    })
			    .text(function (d) {
			    	return d.value;
			    });
		  });

}