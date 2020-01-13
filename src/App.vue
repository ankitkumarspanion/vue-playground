<template>
    <div id="app">
        <v-app>
            <v-text-field v-model="text"></v-text-field>
            <TextHighlight :query="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam ipsa illo maxime, explicabo rerum impedit nisi. Dolor minima quasi, ullam, nulla animi, nihil laboriosam rem optio et voluptas quidem ipsum!</TextHighlight>
        </v-app>
    </div>
</template>

<script>
// import TableView from './views/TableView.vue';
// import DragDropView from './views/DragDropView.vue';
// import ParsedIcons from './views/ParsedIcons.vue';
// import D3Playground from './views/D3Playground.vue';
import TextHighlight from './views/TextHighlight.vue';

export default {
    name: 'app',
    components: {
        TextHighlight,
    },
    data() {
        return {
            text: '',
        };
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
