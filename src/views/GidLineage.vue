<template>
    <div class="lineage pa-4 text-left">
        <v-row no-gutters>
            <v-card id="node_1" width="160" class="mx-12 px-6 py-4">
                <v-icon>mdi-apps</v-icon>
                <span class="pl-4">LOAN 1</span>
            </v-card>
            <v-card id="node_2" width="160" class="mx-12 px-6 py-4">
                <v-icon>mdi-apps</v-icon>
                <span class="pl-4">LOAN 2</span>
            </v-card>
            <v-card id="node_3" width="160" class="mx-12 px-6 py-4">
                <v-icon>mdi-apps</v-icon>
                <span class="pl-4">LOAN 3</span>
            </v-card>
            <v-card id="node_4" width="160" class="mx-12 px-6 py-4">
                <v-icon>mdi-apps</v-icon>
                <span class="pl-4">LOAN 4</span>
            </v-card>
            <v-card id="node_5" width="160" class="mx-12 px-6 py-4">
                <v-icon>mdi-apps</v-icon>
                <span class="pl-4">LOAN 5</span>
            </v-card>
        </v-row>
        <v-btn @click="renderArrows" class="my-8">render</v-btn>
    </div>
</template>
<script>
/* eslint-disable no-console */
import $ from 'jquery';
export default {
    name: 'icons',
    data() {
        return {
            nodes: [
                {
                    id: '1_1',
                    from: 'node_1',
                    to: 'node_2',
                    offset: 0,
                },
                {
                    id: '2_2',
                    from: 'node_1',
                    to: 'node_3',
                    offset: 24,
                },
                {
                    id: '3_3',
                    from: 'node_1',
                    to: 'node_4',
                    offset: 48,
                },
                {
                    id: '4_4',
                    from: 'node_3',
                    to: 'node_4',
                    offset: 64,
                },
                {
                    id: '5_5',
                    from: 'node_3',
                    to: 'node_5',
                    offset: 72,
                },
                {
                    id: '6_6',
                    from: 'node_1',
                    to: 'node_5',
                    offset: 80,
                },
            ],
        };
    },
    methods: {
        renderArrows() {
            this.nodes.forEach((e) => {
                this.renderArrow(e, 2);
            });
        },
        renderArrow(node, size) {
            const nodeA = document.getElementById(node.from);
            const nodeB = document.getElementById(node.to);
            const nodeArects = nodeA.getBoundingClientRect();
            const nodeBrects = nodeB.getBoundingClientRect();

            let _nodeCoords = {
                x: Math.round(nodeArects.right - 16),
                y: Math.round(
                    nodeArects.top + nodeArects.height / 2 - size / 2
                ),
                width: Math.round(nodeBrects.left - nodeArects.right + 32),
            };

            $(`.${node.id}`).remove();
            $(`.svg-container`).remove();

            // only for strainght lines yet
            this.generateLines(node, _nodeCoords, size);
            this.generateDots(node, _nodeCoords, size);
            let svg = `
                        <svg class="svg-container" width="2000" height="2000">
                            <path class="svg-path" d="M216,46 h12 a16,16 0 0 1 16,16 v82 a16,16 0 0 0 16,16 h792 a16,16 1 0 0 16,-16 v-82 a16,16 0 0 1 16,-16 h12" />
                        </svg>
                        `;

            $('body').prepend(svg);
        },
        generateLines(node, coords, size) {
            let oneLine = coords.width < 160;
            let lines = [];
            lines.push({
                vertical: false,
                x: coords.x,
                y: coords.y,
                width: oneLine ? coords.width : 36,
            });
            if (!oneLine) {
                lines.push({
                    vertical: true,
                    x: coords.x + 36,
                    y: coords.y,
                    width: 36 + node.offset,
                });
                lines.push({
                    vertical: false,
                    x: coords.x + 36,
                    y: coords.y + 36 + node.offset,
                    width: coords.width - 36 * 2,
                });
                lines.push({
                    vertical: true,
                    x: coords.x + coords.width - 36,
                    y: coords.y,
                    width: 36 + size + node.offset,
                });
                lines.push({
                    vertical: false,
                    x: coords.x + coords.width - 36,
                    y: coords.y,
                    width: 36,
                });
            }
            console.log(lines);
            lines.forEach((coord) => {
                let { x, y, vertical, width } = coord;
                let _width = vertical ? size : width;
                let _height = vertical ? width : size;
                let div = `
                        <div class="${node.id} arrow-item" style="top:${y}px;left:${x}px;height: ${_height}px;width: ${_width}px;"></div>
                    `;
                $('body').prepend(div);
            });
        },
        generateDots(node, coords, size) {
            let { x, y, width } = coords;
            let _width = size * 4;
            let _height = size * 4;
            let div1 = `
                        <div class="${
                            node.id
                        } arrow-item arrow-dot" style="top:${y -
                (size * 2 + size) / 2}px;left:${x -
                (size * 2 + size) /
                    2}px;height: ${_height}px;width: ${_width}px;"></div>
                    `;
            let div2 = `
                        <div class="${
                            node.id
                        } arrow-item arrow-point" style="top:${y -
                (size * 2 + size) / 2}px;left:${x +
                width -
                (size * 2 + size) /
                    2}px;height: ${_height}px;width: ${_width}px;"></div>
                    `;

            $('body').prepend(div1);
            $('body').prepend(div2);
        },
    },
};
</script>
<style>
.arrow-item {
    z-index: 100;
    position: absolute;
    background: #333333;
}
.arrow-dot {
    clip-path: circle(40% at 50% 50%);
}
.arrow-point {
    clip-path: polygon(80% 50%, 0 0, 0 100%);
}
.svg-path {
    position: absolute;
    fill: none;
    stroke: #333333;
    stroke-width: 5px;
}
.svg-container {
    position: absolute;
}
</style>
<style scoped>
.lineage >>> .v-card {
    border-radius: 28px !important;
}
</style>
