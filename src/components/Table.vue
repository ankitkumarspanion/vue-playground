<template>
    <div>
        <v-data-table
            :dense="dense"
            :headers="cols"
            :items="rows"
            class="gid-table"
            :fixed-header="true"
            :disable-pagination="true"
            :hide-default-footer="true"
            :class="elevated ? 'elevation-1':''"
        >
            <template #top>
                <v-toolbar :dense="dense" flat :class="dense ? 'table-title--dense':''">
                    <v-toolbar-title class="table-title">{{tableName}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <template>
                        <v-text-field
                            v-if="!searchBtn"
                            ref="searchField"
                            hide-details
                            color="primary"
                            append-icon="mdi-close-circle"
                            @click:append="searchBtn = true"
                            style="max-width: 250px;"
                        ></v-text-field>
                    </template>
                    <template>
                        <v-btn icon @click="searchBtn = false">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </template>
                    <template>
                        <v-btn icon>
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <template>
                        <v-btn text color="primary">
                            <v-icon>mdi-plus</v-icon>add
                        </v-btn>
                    </template>
                </v-toolbar>
                <v-divider class="ma-0 pa-0"></v-divider>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    props: {
        dense: [Boolean],
        tableName: [String],
        cols: [Array],
        rows: [Array],
        elevated: [Boolean]
    },
    data() {
        return {
            searchBtn: true
        };
    }
};
</script>

<style scoped>
.table-title--dense >>> .v-toolbar__title {
    font-size: 16px !important;
}
</style>