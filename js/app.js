var width = window.innerWidth,
    height = window.innerHeight;

var plotData = [];
var mapPath = "fixtures/us.json";
var sliderWidth = window.innerWidth - 20;

var projection = d3.geo.albersUsa()
    .scale(1400)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

    var tooltip = d3.select('#map')
        .append('div')
        .attr('class', 'hidden tooltip'),
        tooltipDateFormat=d3.time.format("%b %e, %Y %X");

d3.json(mapPath, function(error, us) {
    if (error) return console.error(error);

    svg.append("path")
        .datum(topojson.feature(us, us.objects.land))
        .attr("d", path)
        .attr("class", "land-boundary");

    var maxDate,minDate;
    d3.json("fixtures/walmart.json", function (error, collection) {
            plotData = collection;
            //console.log(minDate);

    });

var displayStores = function(data) {
    var stores = svg.selectAll(".store")
            .data(data, function(d) {
            return d.name;
            });

  stores.enter().append("circle")
        .attr("class", "store")
        .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
              })
        .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
              })
              .on('mousemove', function(d) {
                   var mouse = d3.mouse(svg.node()).map(function(d){
                       return parseInt(d);
                   });
                  tooltip.style("right", "");
                  tooltip.style("left", "");
                  tooltip.style("bottom", "");
                  tooltip.style("top", "");
                  if (mouse[0] > window.scrollX + width/2 ){
                      tooltip.style("right", (width - mouse[0] + 10) + "px");
                  }
                  else {
                      tooltip.style("left", (mouse[0] + 10) + "px");
                  }
                  if (mouse[1] > window.scrollY + height/2 ){
                      tooltip.style("bottom", (height - mouse[1] + 10) + "px");
                  }
                  else {
                      tooltip.style("top", (mouse[1] + 10) + "px");
                  }
                  tooltip.classed('hidden',false)
                      .style("color","black")
                      .style("background-color","white")
                      .html('<div>' +
                          '<div><span>Store Number: '+d.store_num+'</span></div>' +
                          '<div><span>Store Address: '+d.street_address+','+d.postal_code+'</span></div>' +
                          '<div><span>Store Open Year: '+d.opening_date+'</span></div>'+
                          '</div>')
              })
              .on('mouseout', function(){
                  tooltip.classed('hidden',true);
              })
        .attr("r", 12)
        .attr("fill","#007dc6")
        .attr("opacity",1)
        .transition().duration(800)
        .attr("r", 5)
        .attr("fill","#ffc220")
        .attr("opacity",0.5);

    stores.exit()
      .transition().duration(200)
         .attr("r",0)
        .remove();
};//displayStores

var dateTimeOutput = d3.select('#year').append('p');
var storeCountOutput = d3.select('#storenum').append('p');
var dFormat = d3.time.format("%Y");
d3.select('#slider')
  .append('div')
  .append('class','slider')
  .call(
    chroniton()
    .width(sliderWidth)
    .domain([new Date("1961"),new Date("2007")])
      // hours and minutes - time format
      .labelFormat(d3.time.format('%Y'))
      .on('change', function(d) {
                dateTimeOutput.text("Year: "+dFormat(d3.time.day(d)));

              var newData = plotData.filter( function(t) {
              if (moment(t.opening_date,"YYYY-MM-DD HH:mm:ss").unix() < moment(d).unix()){
                  storeCountOutput.text("Store Count: "+d3.format(",")(t.store_num));
                  return t.opening_date;}
              })
            displayStores(newData);
      })
      .keybindings(true)
      .playButton(true)
      .playbackRate(0.5)
    );
});
