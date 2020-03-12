<template>
    <v-card class="ma-4 pa-4">
        <v-expand-transition>
            <v-row v-if="!open" no-gutters>
                min
            </v-row>
        </v-expand-transition>
        <v-expand-transition>
            <v-row v-if="open" dense>
                <v-col cols="6" class="pa-4">
                    <svg id="my-svg" width="400" height="300"></svg>
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="6">
                            <v-row no-gutters align="center" justify="center">
                                <div class="probabilty-matrix">
                                    <div
                                        class="probabilty-matrix-item"
                                        v-for="i in 4"
                                        :key="i"
                                    >
                                        {{ i }}
                                    </div>
                                </div>
                            </v-row>
                        </v-col>
                        <v-col cols="6">help</v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-expand-transition>
        <v-btn @click="open = !open">toogle</v-btn>
    </v-card>
</template>

<script>
/* eslint-disable no-console */
import * as d3 from 'd3';
export default {
    data() {
        return {
            open: true,
            data: [
                {
                    label: '0-10',
                    count: 100,
                    percent: 10,
                },
                {
                    label: '0-10',
                    count: 20,
                    percent: 20,
                },
                {
                    label: '0-10',
                    count: 20,
                    percent: 30,
                },
                {
                    label: '0-10',
                    count: 40,
                    percent: 40,
                },
            ],
        };
    },
    methods: {
        buildChart() {
            var svg = d3.select('#my-svg'),
                margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = +svg.attr('width') - margin.left - margin.right,
                height = +svg.attr('height') - margin.top - margin.bottom;

            var x = d3
                    .scaleBand()
                    .rangeRound([0, width])
                    .padding(0.1),
                y = d3.scaleLinear().rangeRound([height, 0]);

            var g = svg
                .append('g')
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')'
                );
            var data = this.data;
            x.domain(
                data.map(function(d) {
                    return d.percent;
                })
            );
            y.domain([
                0,
                d3.max(data, function(d) {
                    return d.count;
                }),
            ]);

            g.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x));

            g.append('g')
                .attr('class', 'axis axis--y')
                .call(d3.axisLeft(y))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'end')
                .text('count');

            g.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) {
                    return x(d.percent);
                })
                .attr('y', function(d) {
                    return y(d.count);
                })
                .attr('width', x.bandwidth())
                .attr('height', function(d) {
                    return height - y(d.count);
                });
        },
    },
    mounted() {
        this.buildChart();
    },
};
</script>
<style>
.bar {
    fill: steelblue;
}
.bar:hover {
    fill: brown;
}
</style>
<style scoped>
.circle-btn {
    right: 50%;
    width: 100px;
    height: 50px;
    bottom: -50px;
    position: absolute;
    background: white;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    transform: translate3d(50%, 0%, 0);
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.probabilty-matrix {
    display: grid;
    grid-template-areas:
        'one two'
        'three four';
    grid-gap: 10px;
    padding: 50px;
}
.probabilty-matrix-item {
    padding: 12px;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2196f3;
}
</style>
