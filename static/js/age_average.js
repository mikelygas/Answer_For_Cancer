function plotAgeChart() {
var margin = {
    top: 20,
    right: 200,
    bottom: 30,
    left: 50
},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {
        return x(d.year);
    })
    .y(function(d) {
        return y(d.count);
    });

var svg = d3.select("#age-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var url = "/age-pivot"
d3.json(url,function(err, data){ 
    console.log(data);
// d3.csv("age_pivot.csv", function(error, data) {

    function unpack(data, key) {
        return data.map(function(data) { return data[key]; });
    }
    var twenty_years = unpack(data, '20 - 29 years'),
        thirty_years = unpack(data, '30 - 30 years'),
        fourty_years = unpack(data, '40 - 49 years'),
        fifty_years = unpack(data, '50 - 59 years'),
        sixty_years = unpack(data, '60 - 69 years'),
        seventy_years = unpack(data, '70 - 79 years'),
        eigthy_years = unpack(data, '80 - 89 years'),
        year = unpack(data, 'year'),
        year_list = [],
        twenty = [],
        thirty = [],
        fourty = [],
        fifty = [],
        sixty = [],
        seventy = [],
        eighty = [];
   
    // for (var i = 0; i < year.length; i++ ){
    //     if (list.indexOf(year[i]) === -1 ){
    //         list.push(year[i]);
    //         }
    //     }
    // console.log(list);

    function averageAge(currentYear) {
        year_list = [];
        twenty = [];
        thirty = [];
        fourty = [];
        fifty = [];
        sixty = [];
        seventy = [];
        eighty = [];
       
        for (var i = 0 ; i < year.length ; i++){
            if (year[i] === currentYear[i]) {
                year_list.push(year[i]);
                twenty.push(twenty_years[i]);
                thirty.push(thirty_years[i]);
                fourty.push(fourty_years[i]);
                fifty.push(fifty_years[i]);
                sixty.push(sixty_years[i]);
                seventy.push(seventy_years[i]);
                eigthy.push(eigthy_years[i]);
                console.log(twenty);

            }
        }
    };
        

    for (var i = 0; i < twenty_years.length; i++ ){
        if (twenty.indexOf(twenty_years[i]) === -1 ){
           twenty.push(twenty_years[i]);
            }
        }
    console.log(twenty);

    data.forEach(function(d) {
        console.log(d);
        d.year = parseDate(d.year);
        console.log(d.year);
    });

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "year";
    }));

    var cities = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year,
                    count: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data, function(d) {
        return d.year;
    }));

    y.domain([
        d3.min(cities, function(c) {
            return d3.min(c.values, function(v) {
                return v.count;
            });
        }),
        d3.max(cities, function(c) {
            return d3.max(c.values, function(v) {
                return v.count;
            });
        })
    ]);

    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Average Crude Rate");

    var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke", function(d) {
            return color(d.name);
        });

    city.append("text")
        .datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.year) + "," + y(d.value.count) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name;
        });

    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });

            d3.selectAll(".mouse-per-line")
                .attr("transform", function(d, i) {
                    console.log(width/mouse[0])
                    var xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.date; }).right;
                    idx = bisect(d.values, xDate);

                    var beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(y.invert(pos.y).toFixed(2));

                    return "translate(" + mouse[0] + "," + pos.y +")";
                });
        });
});
}

plotAgeChart();
