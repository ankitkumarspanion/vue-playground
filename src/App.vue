<template>
    <div id="app">
        <v-app>
            <ParsedIcons></ParsedIcons>
        </v-app>
    </div>
</template>

<script>
// import TableView from './views/TableView.vue';
// import DragDropView from './views/DragDropView.vue';
import ParsedIcons from './views/ParsedIcons.vue';

export default {
    name: 'app',
    components: {
        ParsedIcons,
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
