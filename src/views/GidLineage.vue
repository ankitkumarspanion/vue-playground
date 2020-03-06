<template>
  <div class="lineage pa-4 text-left" v-resize="onResize">
    <div class="dummy-div"></div>
    <v-row no-gutters class="px-8">
      <v-col cols="3" v-for="n in 4" :key="n">
        <div class="mx-4" style="background: #EAF6FF;height:100%;">
          <div class="d-flex align-center px-3" style="height: 56px;background: #4C9DD8;">
            <v-icon dark>apps</v-icon>
            <divl class="pl-3 subtitle-2 white--text">abc</divl>
          </div>
          <v-card
            @click="test(n)"
            :id="`node_${n}`"
            class="d-flex my-6 mx-3 px-6 py-4 align-center"
          >
            <v-icon>share</v-icon>
            <div class="pl-2">LOAN {{n}}</div>
          </v-card>
          <template v-if="n === 2">
            <v-card
              :id="`node_2${n}`"
              @click="test(20+n)"
              class="d-flex my-6 mx-3 px-6 py-4 align-center"
            >
              <v-icon>share</v-icon>
              <div class="pl-2">LOAN 2{{n}}</div>
            </v-card>
          </template>
          <template v-if="n === 4">
            <v-card
              :id="`node_4${n}`"
              @click="test(40+n)"
              class="d-flex my-6 mx-3 px-6 py-4 align-center"
            >
              <v-icon>share</v-icon>
              <div class="pl-2">LOAN 4{{n}}</div>
            </v-card>
            <v-card
              :id="`node_44${n}`"
              @click="test(40+n)"
              class="d-flex my-6 mx-3 px-6 py-4 align-center"
            >
              <v-icon>share</v-icon>
              <div class="pl-2">LOAN 44{{n}}</div>
            </v-card>
          </template>
        </div>
      </v-col>
    </v-row>
    <div class="dummy-div"></div>
  </div>
</template>
<script>
/* eslint-disable no-console */
import resize from "vue-resize-directive";

import $ from "jquery";
export default {
  directives: {
    resize
  },
  data() {
    return {
      nodes: [
        {
          id: "1_1",
          from: "node_1",
          to: "node_2",
          offset: 0,
          color: "#8FA9BD",
          curved: false
        },
        {
          id: "2_2",
          from: "node_1",
          to: "node_3",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "3_3",
          from: "node_1",
          to: "node_4",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "4_4",
          from: "node_3",
          to: "node_4",
          offset: 0,
          color: "#8FA9BD",
          curved: false
        },
        {
          id: "5_5",
          from: "node_2",
          to: "node_1",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "6_6",
          from: "node_3",
          to: "node_2",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "7_7",
          from: "node_2",
          to: "node_3",
          offset: 0,
          color: "#8FA9BD",
          curved: false
        },
        {
          id: "8_8",
          from: "node_1",
          to: "node_4",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "9_9",
          from: "node_1",
          to: "node_22",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "10_10",
          from: "node_22",
          to: "node_444",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        },
        {
          id: "11_11",
          from: "node_2",
          to: "node_44",
          offset: 0,
          color: "#8FA9BD",
          curved: true
        }
      ]
    };
  },
  methods: {
    test(index) {
      this.nodes = this.nodes.map(n => {
        return {
          ...n,
          color: n.from === `node_${index}` ? "#394B59" : "#8FA9BD"
        };
      });
      this.nodes.sort(n => (n.from === `node_${index}` ? 1 : -1));
      this.renderArrows();
    },
    renderArrows() {
      $(`.svg-container`).remove();
      let svg = `<svg id="arrowSvg" class="svg-container" width="2000" height="2000"></svg>`;
      $("body").prepend(svg);
      this.nodes.forEach(e => {
        this.renderArrow(e, 2);
      });
    },
    renderArrow(node, size) {
      const nodeA = document.getElementById(node.from);
      const nodeB = document.getElementById(node.to);
      const nodeArects = nodeA.getBoundingClientRect();
      const nodeBrects = nodeB.getBoundingClientRect();
      const backSide = nodeBrects.left <= nodeArects.left;

      let _nodeCoords = {
        back: backSide,
        x: Math.round(nodeArects.right - 16),
        y: Math.round(nodeArects.top + nodeArects.height / 2 - size / 2),
        x1: Math.round(nodeBrects.left + 16),
        y1: Math.round(nodeBrects.top + nodeBrects.height / 2 - size / 2),
        width: Math.round(
          Math.abs(nodeBrects.left - nodeArects.right) + (backSide ? 144 : 32)
        )
      };

      $(`.${node.id}`).remove();

      // only for strainght lines yet
      this.generateSvg(node, _nodeCoords, size);
      this.generateDots(node, _nodeCoords, size);
    },
    generateSvg(node, nodemeta, size) {
      let arrowSvg = document.getElementById("arrowSvg");
      let lines = this.getLines(node, nodemeta, size);
      let path = "";
      if (lines.length > 1) {
        if (nodemeta.back) {
          path = `M${lines[0].x},${lines[0].y + 1} h${lines[0].width -
            8} a16,16 0 0 0 16,-16 v-${lines[1].width -
            8} a16,16 0 0 0 -16,-16 h-${lines[2].width -
            48} a16,16 0 0 0 -16,16 v${lines[3].width -
            10} a16,16 0 0 0 16,16 h${lines[4].width - 8}`;
        } else {
          if (lines.length === 3) {
            path = `M${lines[0].x},${lines[0].y + 1} h${lines[0].width -
              8} a16,16 0 0 1 16,16 v${lines[1].width -
              8} a16,16 0 0 0 16,16 h${lines[2].width}`;
          } else {
            path = `M${lines[0].x},${lines[0].y + 1} h${lines[0].width -
              8} a16,16 0 0 1 16,16 v${lines[1].width -
              8} a16,16 0 0 0 16,16 h${lines[2].width -
              48} a16,16 1 0 0 16,-16 v-${lines[3].width -
              10} a16,16 0 0 1 16,-16 h${lines[4].width - 8}`;
          }
        }
      } else {
        path = `M${lines[0].x},${lines[0].y + 1} h${lines[0].width}`;
      }
      if (path) {
        let newpath = document.createElementNS(arrowSvg.namespaceURI, "path");
        newpath.setAttributeNS(null, "shape-rendering", "geometricPrecision");
        newpath.setAttributeNS(null, "stroke", node.color);
        newpath.setAttributeNS(null, "class", "svg-path");
        newpath.setAttributeNS(null, "d", path);
        arrowSvg.appendChild(newpath);
      }
    },
    getLines(node, coords, size) {
      let oneLine = coords.width < 160;
      let yAxisFlag = coords.y !== coords.y1;
      let lines = [];
      lines.push({
        vertical: false,
        x: coords.x,
        y: coords.y,
        width: oneLine && !yAxisFlag ? coords.width : 36
      });
      if (yAxisFlag) {
        console.log(coords);
        lines.push({
          vertical: true,
          x: coords.x + 36,
          y: coords.y,
          width: node.offset + coords.y1 - coords.y - 24
        });
        lines.push({
          vertical: true,
          x: coords.x + 36,
          y: coords.y,
          width: coords.width - 60
        });
      } else {
        if (!oneLine) {
          lines.push({
            vertical: true,
            x: coords.x + 36,
            y: coords.y,
            width: 16 + node.offset
          });
          lines.push({
            vertical: false,
            x: coords.x + 36,
            y: coords.y + 36 + node.offset,
            width: coords.width - 36 * 2
          });
          lines.push({
            vertical: true,
            x: coords.x + coords.width - 36,
            y: coords.y,
            width: 16 + size + node.offset
          });
          lines.push({
            vertical: false,
            x: coords.x + coords.width - 36,
            y: coords.y,
            width: 36
          });
        }
      }
      return lines;
    },
    generateDots(node, coords, size) {
      let { x, y, x1, y1 } = coords;
      let _width = size * 4;
      let _height = size * 4;
      let commonStyle = `
        background: ${node.color};
        z-index: ${node.color !== "#8FA9BD" ? 102 : 101}
      `;
      let div1 = `
                  <div 
                    class="${node.id} arrow-item arrow-dot" 
                    style="top:${y - (size * 2 + size) / 2}px;
                          left:${x - (size * 2 + size) / 2}px;
                          height: ${_height}px; width: ${_width}px;
                          ${commonStyle};"
                  ></div>`;
      let div2 = `
                  <div 
                    class="${node.id} arrow-item arrow-point" 
                    style="top:${y1 - (size * 2 + size) / 2}px;
                          left:${x1 - (size * 2 + size) / 2}px;
                          height: ${_height}px;width: ${_width}px;
                          ${commonStyle};"
                  ></div>`;

      $("body").prepend(div1);
      $("body").prepend(div2);
    },
    onResize() {
      this.renderArrows();
    }
  },
  beforeDestroy() {
    $(`.svg-container`).remove();
    $(`.arrow-item`).remove();
  }
};
</script>
<style>
.arrow-item {
  z-index: 103;
  position: absolute;
}
.arrow-dot {
  clip-path: circle(40% at 50% 50%);
}
.arrow-point {
  clip-path: polygon(80% 50%, 0 0, 0 100%);
}
.svg-path {
  fill: none;
  z-index: 102;
  stroke-width: 2px;
  position: absolute;
  pointer-events: painted;
}
.svg-container {
  pointer-events: none;
  position: absolute;
  z-index: 101;
}
</style>
<style scoped>
.lineage >>> .v-card {
  border-radius: 28px !important;
}
.dummy-div {
  height: 64px;
}
</style>
