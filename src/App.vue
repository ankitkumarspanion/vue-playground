<template>
    <div id="app">
        <v-app>
            <TableView></TableView>
        </v-app>
    </div>
</template>

<script>
import TableView from "./views/TableView.vue";

export default {
    name: "app",
    components: {
        TableView
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
