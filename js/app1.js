mapboxgl.accessToken = 'pk.eyJ1Ijoibml6YW50eiIsImEiOiJjajN6YjltOWEwMXllMnFtdTRnNnpqYmh4In0.7ViiLaZGMeIa7c8zeHgLMg';
// var width = window.innerWidth,
//     height = window.innerHeight;

 var mapWidth = window.innerWidth,
 mapHeight = window.innerHeight;

var plotData = [];
//var mapPath = "fixtures/us.json";
var sliderWidth = window.innerWidth - 20;
var tooltip = d3.select('#map')
    .append('div')
    .attr('class', 'hidden tooltip'),
    tooltipDateFormat=d3.time.format("%b %e, %Y %X");

// var projection = d3.geo.albersUsa()
//     .scale(1400)
//     .translate([mapWidth / 2, mapHeight / 2]);

// var path = d3.geo.path()
//     .projection(projection);

// var svg = d3.select("#map").append("svg")
//     .attr("width", width)
//     .attr("height", height);

var map;
loadMap();
//d3.json(mapPath, function(error, us) {
//    if (error) return console.error(error);

function loadMap(){
  map = new mapboxgl.Map({
                    container: 'map', // container id
                    style: 'mapbox://styles/mapbox/dark-v9',
                    //center: [34.8951,98.0364],
                    center: [-98.0364,34.8951],
                    zoom: 4
                });
  map.scrollZoom.disable();
  //map.doubleClickZoom.disable();
  //map.addControl(new mapboxgl.Navigation());
                // Setup our svg layer that we can manipulate with d3
                var container = map.getCanvasContainer();
                var svg1 = d3.select(container).append("svg").attr("width", mapWidth).attr("height", mapHeight);
    // svg.append("path")
    //     .datum(topojson.feature(us, us.objects.land))
    //     .attr("d", path)
    //     .attr("class", "land-boundary");

    var maxDate,minDate;
    d3.json("fixtures/walmart.json", function (error, collection) {
            plotData = collection;
            console.log(minDate);

    });

    function project(d) {
                console.log(d.latitude+" : "+d.longitude);
                return map.project(getLL(d));
            }

            function getLL(d) {
                return new mapboxgl.LngLat(+d.longitude, +d.latitude)
            }

var displayStores = function(data) {
    var stores = svg1.selectAll(".store")
            .data(data, function(d) {
            return d.name;
            });

  stores.enter().append("circle")
        .attr("class", "store")
        .attr("cx", function (d) { var x = project(d).x;
          return x;
            })
        .attr("cy", function (d) { var y = project(d).y;
          return y;
            })
            .on('mousemove', function(d) {
                 var mouse = d3.mouse(svg1.node()).map(function(d){
                     return parseInt(d);
                 });
                tooltip.style("right", "");
                tooltip.style("left", "");
                tooltip.style("bottom", "");
                tooltip.style("top", "");
                if (mouse[0] > window.scrollX + mapWidth/2 ){
                    tooltip.style("right", (mapWidth - mouse[0] + 10) + "px");
                }
                else {
                    tooltip.style("left", (mouse[0] + 10) + "px");
                }
                if (mouse[1] > window.scrollY + mapHeight/2 ){
                    tooltip.style("bottom", (mapHeight - mouse[1] + 10) + "px");
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
                    // .attr("cx", function(d) {
        //       return projection([d.longitude, d.latitude])[0];
        //       })
        // .attr("cy", function(d) {
        //       return projection([d.longitude, d.latitude])[1];
        //       })
        .attr("r", 12)
        .attr("fill","#007dc6")
        .attr("opacity",1)
        .transition().duration(800)
        .attr("r", 5)
        .attr("fill","#ffc220")
        .attr("opacity",0.8);

    stores.exit()
      .transition().duration(200)
         .attr("r",0)
        .remove();
                    function render() {
                        stores
                            .attr({
                                cx: function(d) {
                                    var x = project(d).x;
                                    return x
                                },
                                cy: function(d) {
                                    var y = project(d).y;
                                    return y
                                }
                            })
                    }
                    render();

                    map.on("move", function() {
                        render()
                    });
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
};
