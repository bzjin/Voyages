// Read in the data and construct the timeline
d3.csv("ships.csv", function(dataset) {
    makeTimeline(dataset)
});

function makeTimeline(dataset){
    var w = 1500;
    var h = 900;
    var timeline = d3.select('#ships')
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .style("stroke", "1")
    
    var base = d3.select("#scatter");

    var chart = base.append("canvas")
                  .attr("width", w)
                  .attr("height", h);

    var context = chart.node().getContext("2d");

    var blues = ["#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]

    var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return d.label; });
    
    timeline.call(tip);

    timeline.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 900)
        .attr("height", 900)
        .style("fill", "white")//blues[2])

    var color = d3.scaleLinear()
                .domain([1, 1200])
                .range(["#543005", "#bf812d"])
   /* 
    var color = d3.scaleQuantize()
                .domain([1, 1200])
                .range(["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3"])
    */
    var yearScale = d3.scaleLinear()
                    .domain([1815, 1850])
                    .range([100, w-50])

    var yScale = d3.scaleLinear()
                    .domain([0, 1200])
                    .range([h-50, 50])

    var yearAxisBot = d3.axisBottom(yearScale).tickFormat(d3.format("d")); 
    var yearAxisTop = d3.axisTop(yearScale).tickFormat(d3.format("d")).tickSize(-(h-100)); 
    var yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d")).tickSize(-(w-150)); 

    timeline.append("g")
        .attr("class", "axis x--axis")
        .attr("transform", "translate(0," + (h-50) + ")")
        .call(yearAxisBot)

    timeline.append("g")
        .attr("class", "axis x--axis")
        .attr("transform", "translate(0, 50)")
        .call(yearAxisTop)

    timeline.append("g")
        .attr("class", "axis y--axis")
        .attr("transform", "translate(100, 0)")
        .call(yAxis)
        .selectAll("text").remove()
    /*
    dataset.forEach(function(d){
        for (i = 0; i < +d.passengers; i++){
        var randAngle = Math.random()*2*Math.PI;
        var randRadius = Math.random()*Math.sqrt(d.passengers*2)

        timeline
            .append("circle")
            .attr("r", 1)
            .attr("cx", Math.cos(randAngle)*randRadius + yearScale(d.start))
            .attr("cy", Math.sin(randAngle)*randRadius + yScale(d.passengers))
            .style("fill", color(d.passengers))
            .style("opacity", 1)
        }
    })*/

    dataset.forEach(function(d, i) {
        for (i = 0; i < +d.passengers; i++){
            var randAngle = Math.random()*2*Math.PI;
            var randRadius = Math.random()*Math.sqrt(d.passengers*2)
            
            context.beginPath();
            context.arc(Math.cos(randAngle)*randRadius + yearScale(d.start), Math.sin(randAngle)*randRadius + yScale(d.passengers), 1, 0, 2 * Math.PI, false);
            context.fillStyle=color(d.passengers);
            context.fill();
            context.closePath();
        }
    })

    timeline.selectAll("circle")
        .data(dataset)
        .enter()
            .append("circle")
            .attr("r", function(d){return Math.sqrt(d.passengers/4)})
            .attr("cx", function(d){return yearScale(d.start)})
            .attr("cy", function(d){return yScale(d.passengers)})
            .style("fill", function(d){return color(d.passengers)})
            .style("opacity", 1)
            .style("fill-opacity", .5)
            .style("stroke-width", function(d){return d.passengers/100})
            .style("stroke", function(d){return color(d.passengers)})
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    const type = d3.annotationCalloutElbow

    const annotations = [
    {
      note: {
        label: "434 people",
        title: "Esperanza"
      },
      data: { date: 1819, close: 434 },
      dy: -30, dx: -50,
      connector: { lineType : "horizontal" }
    },{
      note: {
        label: "1089 people",
        title: "Carolina"
      },
      data: { date: 1829, close: 1089 },
      dy: 0, dx: 150,
      connector: { lineType : "horizontal" }
    }, {
      note: {
        label: "876 people",
        title: "Maria"
      },
      data: { date: 1830, close: 876 },
      dy: 0, dx: 150,
      connector: { lineType : "horizontal" }
    }, {
      note: {
        label: "886 people",
        title: "Emilia"
      },
      data: { date: 1827, close: 886 },
      dy: -30, dx: 50,
      connector: { lineType : "horizontal" }
    }, {
      note: {
        label: "844 people",
        title: "Vingador"
      },
      data: { date: 1828, close: 844 },
      dy: 30, dx: 50,
      connector: { lineType : "horizontal" }
    }]

    const parseTime = d3.timeParse("%d-%b-%y")
    const timeFormat = d3.timeFormat("%d-%b-%y")

    //Skipping setting domains for sake of example
    const x = d3.scaleLinear()
            .domain([1815, 1850])
            .range([100, w-50])

    const y = d3.scaleLinear()
            .domain([0, 1200])
            .range([850, 50])

    const makeAnnotations = d3.annotation()
      .editMode(true)
      .type(type)
      .accessors({
            x: d => x(d.date),
            y: d => y(d.close)
          })
      .accessorsInverse({
             date: d => timeFormat(x.invert(d.x)),
             close: d => y.invert(d.y)
          })
       .annotations(annotations)

    d3.select("svg")
      .append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations)


}