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

d3.json(mapPath, function(error, us) {
    if (error) return console.error(error);

    svg.append("path")
        .datum(topojson.feature(us, us.objects.land))
        .attr("d", path)
        .attr("class", "land-boundary");

    var maxDate,minDate;
    d3.json("fixtures/target.json", function (error, collection) {
            plotData = collection;
            console.log(minDate);

    });

var displayStores = function(data) {
    var stores = svg.selectAll(".store")
            .data(data, function(d) {
            return d.store_num;
            });

  stores.enter().append("circle")
        .attr("class", "store")
        .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
              })
        .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
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
    .domain([new Date("1962"),new Date("2008")])
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
