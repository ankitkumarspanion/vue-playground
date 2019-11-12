<template>
  <div class="pa-3">
    <v-row justify-center>
      <v-switch v-model="dense" label="dense">dense</v-switch>
      <v-switch v-model="rounded" label="rounded"></v-switch>
      <v-switch v-model="loading" label="loading"></v-switch>
      <v-switch v-model="allowAdd" label="allowAdd"></v-switch>
      <v-switch v-model="allowSearch" label="allowSearch"></v-switch>
      <v-switch v-model="allowRefresh" label="allowRefresh"></v-switch>
      <v-switch v-model="showSelect" label="showSelect"></v-switch>
      <v-switch v-model="singleSelect" label="singleSelect"></v-switch>
      <v-switch v-model="actionDrawer" label="actionDrawer"></v-switch>
    </v-row>
    <table-new
      row-key="name"
      live-search
      :cols="headers"
      :rows="data"
      :dense="dense"
      :rounded="rounded"
      :loading="loading"
      :allow-add="allowAdd"
      :allow-search="allowSearch"
      :allow-refresh="allowRefresh"
      :show-select="showSelect"
      :single-select="singleSelect"
      :action-drawer="actionDrawer"
      :total-rows="totalDesserts"
      selectable
      @load-data="loadData"
      @selection-change="test"
    >
      <template #addNew></template>
      <template #edit="{ item }">{{item}}</template>
      <template #delete="{ item }">{{item}}</template>
    </table-new>
  </div>
</template>

<script>
import TableNew from "../components/table-new.vue";
export default {
  components: {
    TableNew
  },
  data() {
    return {
      infiniteScroll: false,
      dense: false,
      hideHeader: false,
      rounded: false,
      allowAdd: false,
      allowRefresh: true,
      allowSearch: false,
      showSelect: true,
      singleSelect: true,
      actionDrawer: false,
      selectable: false,
      elevated: false,
      loading: false,
      totalDesserts: 0,
      data: [],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        },
        {
          name: "Dup-Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Dup-Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Dup-Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Dup-Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "Dup-KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        },
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        },
        {
          name: "Dup-Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Dup-Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Dup-Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Dup-Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "Dup-KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ]
    };
  },
  methods: {
    test() {
      // console.log(data);
    },
    loadData(params) {
      this.getDataFromApi(params).then(res => {
        this.data = res.items;
        this.totalDesserts = res.total;
      });
    },
    getDataFromApi(params) {
      this.loading = true;
      return new Promise(resolve => {
        const { page, rowsPerPage, searchTxt } = params;

        let items = this.desserts.filter(e =>
          e.name.includes(searchTxt.toLowerCase())
        );
        const total = items.length;

        if (rowsPerPage > 0) {
          items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        }

        setTimeout(() => {
          this.loading = false;
          resolve({
            items,
            total
          });
        }, 500);
      });
    }
  }
};
</script>

<style>
</style>