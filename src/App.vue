<template>
    <div id="app">
        <v-app>
            <GidLineage></GidLineage>
        </v-app>
    </div>
</template>

<script>
// import TableView from './views/TableView.vue';
// import DragDropView from './views/DragDropView.vue';
// import ParsedIcons from './views/ParsedIcons.vue';
// import D3Playground from './views/D3Playground.vue';
// import GidSearch from './views/GidSearch.vue';
import GidLineage from './views/GidLineage.vue';

export default {
    name: 'app',
    components: {
        GidLineage,
    },
    data() {
        return {
            text: '',
            search: '',
            options: [
                { label: 'abc', key: 'abc' },
                { label: 'efg', key: 'efg' },
                { label: 'lmn', key: 'lmn' },
                { label: 'pqr', key: 'pqr' },
                { label: 'xyz', key: 'xyz' },
            ],
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
