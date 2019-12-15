<template>
    <div class="pa-4">
        <div class="ma-4">
            <v-btn @click="buildChart">Build</v-btn>
        </div>
        <v-btn-toggle v-model="filter">
            <v-btn>full</v-btn>
            <v-btn>1y</v-btn>
            <v-btn>6m</v-btn>
            <v-btn>3m</v-btn>
            <v-btn>1m</v-btn>
            <v-btn>MTD</v-btn>
        </v-btn-toggle>
        <!-- <div id="my-svg"></div> -->
        <div>
            <svg id="my-svg" width="960" height="500"></svg>
        </div>
    </div>
</template>
<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import * as d3 from 'd3';
export default {
    name: 'D3Playground',
    data() {
        return {
            filter: 0,
        };
    },
    methods: {
        buildChart2() {
            var svg = d3.select('#my-svg'),
                margin = { top: 20, right: 20, bottom: 110, left: 40 },
                margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
                width = +svg.attr('width') - margin.left - margin.right,
                height = +svg.attr('height') - margin.top - margin.bottom,
                height2 = +svg.attr('height') - margin2.top - margin2.bottom;

            var x = d3.scaleTime().range([0, width]),
                x2 = d3.scaleTime().range([0, width]),
                y = d3.scaleLinear().range([height, 0]),
                y2 = d3.scaleLinear().range([height2, 0]);

            var xAxis = d3.axisBottom(x),
                xAxis2 = d3.axisBottom(x2),
                yAxis = d3.axisLeft(y);

            var brush = d3
                .brushX()
                .extent([
                    [0, 0],
                    [width, height2],
                ])
                .on('brush end', brushed);

            var zoom = d3
                .zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([
                    [0, 0],
                    [width, height],
                ])
                .extent([
                    [0, 0],
                    [width, height],
                ])
                .on('zoom', zoomed);

            var line = d3
                .line()
                .x(function(d) {
                    return x(d.date);
                })
                .y(function(d) {
                    return y(d.price);
                });

            var contextLine = d3
                .line()
                .x(function(d) {
                    return x2(d.date);
                })
                .y(function(d) {
                    return y2(d.price);
                });

            svg.append('defs')
                .append('clipPath')
                .attr('id', 'clip')
                .append('rect')
                .attr('width', width)
                .attr('height', height);

            var focus = svg
                .append('g')
                .attr('class', 'focus')
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')'
                );

            var context = svg
                .append('g')
                .attr('class', 'context')
                .attr(
                    'transform',
                    'translate(' + margin2.left + ',' + margin2.top + ')'
                );

            let dates = [];
            for (var i = 1; i < 400; i++) {
                let theDate = new Date('2018-12-12');
                let currentDate = theDate.setDate(theDate.getDate() + i);
                dates.push(currentDate);
            }
            let data = dates.map((date) => {
                return {
                    date: new Date(date),
                    price: Math.floor(Math.random() * 28) + 1,
                };
            });
            x.domain(
                d3.extent(data, function(d) {
                    return d.date;
                })
            );
            y.domain([
                0,
                d3.max(data, function(d) {
                    return d.price;
                }),
            ]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            focus
                .append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line);

            focus
                .append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            focus
                .append('g')
                .attr('class', 'axis axis--y')
                .call(yAxis);

            context
                .append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', contextLine);

            context
                .append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + height2 + ')')
                .call(xAxis2);

            context
                .append('g')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, x.range());

            svg.append('rect')
                .attr('class', 'zoom')
                .attr('width', width)
                .attr('height', height)
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')'
                )
                .call(zoom);

            function brushed() {
                if (
                    d3.event.sourceEvent &&
                    d3.event.sourceEvent.type === 'zoom'
                )
                    return; // ignore brush-by-zoom
                var s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
                focus.select('.line').attr('d', line);
                focus.select('.axis--x').call(xAxis);
                svg.select('.zoom').call(
                    zoom.transform,
                    d3.zoomIdentity
                        .scale(width / (s[1] - s[0]))
                        .translate(-s[0], 0)
                );
            }

            function zoomed() {
                if (
                    d3.event.sourceEvent &&
                    d3.event.sourceEvent.type === 'brush'
                )
                    return; // ignore zoom-by-brush
                var t = d3.event.transform;
                x.domain(t.rescaleX(x2).domain());
                focus.select('.line').attr('d', line);
                focus.select('.axis--x').call(xAxis);
                context
                    .select('.brush')
                    .call(brush.move, x.range().map(t.invertX, t));
            }
        },
        buildChart() {
            const width = 960;
            const height = 500;
            const margin = 5;
            const padding = 5;
            const adj = 30;
            // building the svg
            const svg = d3
                .select('#my-svg')
                .append('svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr(
                    'viewBox',
                    '-' +
                        adj +
                        ' -' +
                        adj +
                        ' ' +
                        (width + adj * 3) +
                        ' ' +
                        (height + adj * 3)
                )
                .style('padding', padding)
                .style('margin', margin)
                .classed('svg-content', true);

            // creating the data
            const timeConv = d3.timeParse('%d-%b-%Y');
            let data = ['A', 'B'];
            let dates = [];
            for (var i = 1; i < 4000; i++) {
                let theDate = new Date('2018-07-07');
                let currentDate = theDate.setDate(theDate.getDate() + i);
                dates.push(currentDate);
            }
            // value: Math.floor(Math.random() * 100) + 1,
            let slices = data.map((id) => {
                return {
                    id,
                    values: dates.map((date) => {
                        return {
                            date: new Date(date),
                            measurement: Math.floor(Math.random() * 28) + 1,
                        };
                    }),
                };
            });
            // console.log(slices);
            // building scales
            const xScale = d3.scaleTime().range([0, width]);
            const yScale = d3.scaleLinear().rangeRound([height, 0]);
            xScale.domain(
                d3.extent(dates, function(d) {
                    return d;
                })
            );
            yScale.domain([
                0,
                d3.max(slices, function(c) {
                    return d3.max(c.values, function(d) {
                        return d.measurement + 4;
                    });
                }),
            ]);
            //axes
            const yaxis = d3
                .axisLeft()
                .ticks(Math.floor(slices[0].values.length * 0.1))
                .scale(yScale);

            const xaxis = d3.axisBottom().scale(xScale);

            //lines
            const line = d3
                .line()
                .x(function(d) {
                    return xScale(d.date);
                })
                .y(function(d) {
                    return yScale(d.measurement);
                });

            let id = 0;
            const ids = function() {
                return 'line-' + id++;
            };
            // // draw
            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xaxis);

            svg.append('g')
                .attr('class', 'axis')
                .call(yaxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '.75em')
                .attr('y', 6)
                .style('text-anchor', 'end')
                .text('Frequency');
            // // for line
            const lines = svg
                .selectAll('lines')
                .data(slices)
                .enter()
                .append('g');

            lines
                .append('path')
                .attr('class', ids)
                .attr('d', function(d) {
                    return line(d.values);
                });

            // lines
            //     .append('text')
            //     .attr('class', 'serie_label')
            //     .datum(function(d) {
            //         return {
            //             id: d.id,
            //             value: d.values[d.values.length - 1],
            //         };
            //     })
            //     .attr('transform', function(d) {
            //         return (
            //             'translate(' +
            //             (xScale(d.value.date) + 10) +
            //             ',' +
            //             (yScale(d.value.measurement) + 5) +
            //             ')'
            //         );
            //     })
            //     .attr('x', 5)
            //     .text(function(d) {
            //         return 'Serie ' + d.id;
            //     });
        },
    },
    mounted() {
        // this.buildChart();
        this.buildChart2();
    },
};
</script>
<style>
path {
    fill: none;
    stroke: rgba(0, 0, 0, 0.36);
}

.line {
    clip-path: url(#clip);
}

.zoom {
    cursor: move;
    fill: none;
    pointer-events: all;
}
</style>
