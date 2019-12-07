<template>
    <div>
        <h3>Drag and Drop</h3>
        <draggable v-model="data" group="data">
            <v-card class="ma-2 pa-2" v-for="element in data" :key="element.id">
                {{ element.name }}
            </v-card>
        </draggable>
        lorem
        <v-card style="min-height: 250px">
            <draggable v-model="data2" group="data">
                <v-card
                    class="ma-2 pa-2"
                    v-for="element in data2"
                    :key="element.id"
                >
                    {{ element.name }}
                </v-card>
            </draggable>
        </v-card>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
    components: {
        draggable,
    },
    data() {
        return {
            data2: [],
            data: [
                {
                    id: 1,
                    name: 'Ankit',
                },
                {
                    id: 2,
                    name: 'hello',
                },
                {
                    id: 3,
                    name: 'hi',
                },
            ],
            rows: [
                {
                    index: 1,
                    items: [
                        {
                            title: 'item 1',
                        },
                    ],
                },
                {
                    index: 2,
                    items: [
                        {
                            title: 'item 2',
                        },
                        {
                            title: 'item 3',
                        },
                    ],
                },
            ],
        };
    },
};
</script>
