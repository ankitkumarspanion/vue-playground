<template>
    <span class="text-highlighted-wrapper" v-html="getHtml()"></span>
</template>

<script>
export default {
    props: {
        query: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: 'yellow',
        },
    },
    methods: {
        getIndicesOf() {
            const text = this.$slots.default[0].text.toLowerCase();
            const queryText = this.query.toLowerCase();
            const queryLen = queryText.length;
            if (queryLen === 0) {
                return [];
            }
            const indices = [];
            let startIndex = 0;
            let index = text.indexOf(queryText, startIndex);
            while (index > -1) {
                startIndex = index + queryLen;
                indices.push({
                    startIndex: index,
                    endIndex: startIndex,
                });
                index = text.indexOf(queryText, index + 1);
            }
            return indices;
        },
        getParsedText() {
            const pieces = [];

            let text = this.$slots.default[0].text;
            let highlights = this.getIndicesOf();

            let lastIndex = 0;
            highlights.forEach(({ startIndex, endIndex }) => {
                if (lastIndex !== startIndex) {
                    pieces.push({
                        highlighted: false,
                        text: text.slice(lastIndex, startIndex),
                    });
                }
                pieces.push({
                    highlighted: true,
                    text: text.slice(startIndex, endIndex),
                });
                lastIndex = endIndex;
            });
            if (lastIndex !== text.length) {
                pieces.push({
                    highlighted: false,
                    text: text.slice(lastIndex),
                });
            }
            return pieces;
        },
        getColorByBG() {
            // TODO
            return 'rgba(0, 0, 0, 0.87)';
        },
        getHtml() {
            let html = ``;
            let parsedText = this.getParsedText();
            parsedText.forEach(({ highlighted, text }) => {
                html += !highlighted
                    ? text
                    : `<mark class="text--highlighted" style="background-color: ${
                          this.color
                      };color: ${this.getColorByBG()};">${text}</mark>`;
            });
            return html;
        },
    },
};
</script>

<style scoped>
.text-highlighted-wrapper >>> .text--highlighted {
    border-radius: 4px;
}
</style>
