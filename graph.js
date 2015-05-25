//Stuff!
function doStuff(){
  var height=630,
      width=1260;
  var toBorder = loadCoords(data);
  var borders = getBorders(data,toBorder);

  var zoom=d3.behavior.zoom()
    .on("zoom",function(){console.log("zoomed");});

  var visualisation=d3.select("#world").append("svg")
    .attr("width", width)
    .attr("height",height)
    .append("g")
    .attr("transform","translate("+(width/2)+","+(height/2)+")")
    .call(zoom);
  visualisation.append("rect")
    .attr("x",-width/2)
    .attr("y",-height/2)
    .attr("width",width)
    .attr("height",height)
    .attr("fill","white");

  var borders=visualisation.selectAll("line")
    .data(borders)
    .enter().append("line")
    .attr("x1",function(d){return latitude(d['source']);})
    .attr("y1",function(d){return longitude(d['source']);})
    .attr("x2",function(d){return latitude(d['target']===undefined?d['source']:d['target']);})
    .attr("y2",function(d){return longitude(d['target']===undefined?d['source']:d['target']);})
    .attr("stroke","blue")
    .attr("stroke-width",1);
  var circle=visualisation.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cy", function(d){return longitude(d.coords);})
    .attr("cx", function(d){return latitude(d.coords);})
    //.attr("r",function(d){return Math.max(1,Math.sqrt(d.pop/1000000));})
    .attr("r",function(d){return Math.max(1,Math.sqrt(d.area/10000));})
    .on("mouseover", displayData)
    .on("mouseout", removeData);

}
function getBorders(d, coords){
  var borders=[];
  d.forEach(function(country) {
    borders = borders.concat(country.borders.map(function(border) {
      return {
        sourcename: country.name,
        source: country.coords,
        target: coords[border],
        targetname: border
      }
    }));
  });
  return borders
}
function displayData(d){
  var x = d3.event.x;
  var y = d3.event.y;
  var tooltip = d3.select('#tooltip')
    .style({display:"block",top:y,left:x})

  tooltip
    .append("div").html(d.name)
    .append("div").html("Area: "+d.area.toLocaleString()+"km\xb2")
    .append("div").html("Population: "+d.pop.toLocaleString());
}
function removeData(d) {
  d3.select('#tooltip')
    .style({display:"none"})
    .html("");
}

function latitude(d){
  return d[1]*3.5;
}
function longitude(d){
  return d[0]*-3.5;
}

function loadCoords(d) {
  var coords = {};
  d.forEach(function(country) {
    coords[country.name] = country.coords
  });
  return coords;
}

