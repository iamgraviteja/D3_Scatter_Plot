/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */
//INITIAL SETUP
var margin = {
	top: 50,
	right: 50,
	bottom: 80,
	left: 80
};
var width = document.documentElement.offsetWidth - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;
var t = d3.transition().duration(300);

var graph = d3.select('#chart-area')
	.append('svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//SCALES
var x = d3.scaleLog()
	.base(10)
	.domain([300, 150000])
	.range([0, width]);

var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var continentColor = d3.scaleOrdinal(d3.schemePastel1);

var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

//AXES GROUP

var xAxisGroup = graph.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0,' + height + ')');

var yAxisGroup = graph.append('g')
	.attr('class', 'y-axis')


//ADDING AXES
var xAxis = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"))
	.tickSizeOuter(0);
xAxisGroup.call(xAxis);

var yAxis = d3.axisLeft(y)
	.tickSizeOuter(0);
yAxisGroup.call(yAxis);


//LABELS
var xLabel = graph.append("text")
	.attr("y", height + margin.top)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");
var yLabel = graph.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expectancy (Years)")


d3.json("data/data.json").then(function (data) {
	console.log(data[0]);

	var updatedCountries = data[0].countries.filter(cn => cn.income > 0 && cn.life_exp > 0);
	var newData = updatedCountries;
	update(newData, data[0].year);
})

function update(data, year) {

	//JOIN NEW DATA WITH OLD
	var circles = graph.selectAll('circle')
		.data(data, function (d) {
			return d.country;
		});

	//CLEARING THE OLD ELEMENTS WHICH ARE NOT PRESENT IN NEW DATA
	circles.exit()
		.attr('fill', 'red')
		.transition(t)
		.attr('cy', y(0))
		.remove();

	//ENTER NEW ELEMENTS PRESENT IN NEW DATA
	circles
		.enter()
		.append('circle')
		.attr('fill', function (d) {
			return continentColor(d.continent);
		})
		.attr('cx', function (d) {
			return x(d.income);
		})
		.attr('cy', y(0))
		.merge(circles)
		.transition(t)
		.attr('r', function (d) {
			return Math.sqrt(area(d.population) / Math.PI);
		})
		.attr('cx', function (d) {
			return x(d.income);
		})
		.attr('cy', function (d) {
			return y(d.life_exp);
		})
}