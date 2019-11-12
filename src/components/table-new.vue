<template>
  <v-content v-scroll="scrolledVertical">
    <v-container class="gid-table pa-0" :class="getGidTableCLasses()">
      <!-- above the table -->
      {{selected_internal}}
      <v-card flat tile>
        <v-toolbar flat :dense="dense" v-if="canShowToolbar">
          <v-toolbar-title class="ml-0" :class="dense ? 'dense-toolbar-title':''">
            <template v-if="$slots.description">
              <slot name="description"></slot>
            </template>
            <template v-else>{{tableName}}</template>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <template v-if="allowSearch">
            <v-btn
              icon
              class="mr-0"
              title="Search"
              v-if="searchBtn"
              :disabled="loading"
              @click="onSearchOpen"
              ref="searchButton"
            >
              <v-icon>search</v-icon>
            </v-btn>
            <v-tooltip v-else bottom>
              <template #activator="{ on }">
                <v-text-field
                  v-on="on"
                  single-line
                  hide-details
                  ref="searchBox"
                  class="pt-0"
                  append-icon="cancel"
                  v-model="searchTextModel"
                  :label="searchPlaceholder"
                  @blur="onSearchBlur()"
                  @keyup.13="updateSearchText"
                  @click:append="onSearchClose()"
                  :class="!dense ? 'pr-3':'pr-1'"
                  style="max-width: 300px !important;"
                ></v-text-field>
              </template>
              <span>{{searchPlaceholder}}</span>
            </v-tooltip>
          </template>
          <template v-if="allowRefresh">
            <v-btn icon class="mr-0" title="Refresh" :disabled="loading" @click="refresh">
              <v-icon>refresh</v-icon>
            </v-btn>
          </template>
          <template v-if="allowAdd">
            <div class="mr-n4">
              <!-- <gid-lock :locked="allowAdd === 'locked'"> -->
              <v-btn
                text
                color="primary"
                @click.stop="onAddNew()"
                :disabled="allowAdd === 'locked' || loading"
              >
                <v-icon>{{addNewIcon || 'add'}}</v-icon>
                <span>{{computedAddNewLabel}}</span>
              </v-btn>
              <!-- </gid-lock> -->
            </div>
          </template>
        </v-toolbar>
        <v-card flat tile v-show="isAdd && !actionDrawer" width="100%">
          <v-divider class="ma-0 pa-0"></v-divider>
          <v-card-title class="subtitle-1">{{computedActionDialogTitle}}</v-card-title>
          <div class="px-4 pb-4">
            <slot name="add-new">Slot for adding data</slot>
          </div>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn text @click="closeDrawer()">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="onDialogAction"
              :disabled="actionDisabled || loading"
            >{{computedActionDialogButtonLabel}}</v-btn>
          </v-card-actions>
        </v-card>
        <v-divider class="ma-0 pa-0"></v-divider>
      </v-card>
      <v-card flat tile>
        <VuePerfectScrollbar
          :id="`scroller-${tableRef}`"
          @ps-scroll-y="scrolledVertical"
          :style="getselfScrollStyle()"
        >
          <v-data-table
            :item-key="rowKey"
            :id="tableRef"
            :ref="tableRef"
            :dense="dense"
            :caption="caption"
            :loading="loading"
            :headers="tableCols"
            :disable-sort="false"
            :hide-default-header="true"
            :show-select="showSelect"
            :single-select="singleSelect"
            :show-expand="canShowExpand"
            :single-expand="canShowExpand"
            :page.sync="pagination.page"
            :sort-by.sync="pagination.sortBy"
            :sort-desc.sync="pagination.descending"
            :items-per-page.sync="pagination.rowsPerPage"
            :items="loading && !infiniteScroll?[]:tableRows"
            :hide-default-footer="infiniteScroll?true:false"
            :server-items-length="computedTotalRows"
            :style="getselfScrollStyle()"
          >
            <!-- header of the table -->
            <template #header="{ props }">
              <thead v-if="!(hideHeader && (loading && infiniteScroll) && !tableRows.length)">
                <tr>
                  <template v-for="(header, index) in props.headers">
                    <th
                      class="subtitle-2"
                      :title="header.text"
                      :key="header.value"
                      @click="changeSort(header)"
                      :style="getHeaderStyles('header', header, index)"
                      :class="[getHeaderClasses(header), header.class]"
                    >
                      <template v-if="header.value == 'data-table-select'">
                        <v-checkbox
                          color="primary"
                          v-if="!singleSelect"
                          :value="headerSelectValue"
                          :indeterminate="headerSelectIndeterminate"
                          :class="!dense ?'gid-table-checkbox':'gid-table-dense-checkbox'"
                          @click.stop="toggleAllSelections($event)"
                        ></v-checkbox>
                      </template>
                      <template v-else>
                        <v-icon
                          small
                          v-if="header.sortable && header.align === 'right'"
                        >arrow_upward</v-icon>
                        <slot :name="`header.${header.value}`" :header="header">{{ header.text }}</slot>
                        <v-icon
                          small
                          v-if="header.sortable && header.align !== 'right'"
                        >arrow_upward</v-icon>
                      </template>
                    </th>
                  </template>
                </tr>
              </thead>
            </template>
            <!-- rows of the table -->
            <template #item="{ item, headers }">
              <tr
                @click.stop="onRow(item)"
                :class="[getRowClasses(item)]"
                :style="getRowStyles(item)"
              >
                <template v-for="(col, i) in headers">
                  <td
                    :class="[getColumnClasses(col, item)]"
                    :style="getColumnStyles(col, item)"
                    :key="i"
                  >
                    <template v-if="col.value == 'data-table-select'">
                      <v-checkbox
                        hide-details
                        color="primary"
                        v-model="item._selected"
                        @change="onCheckBox(item)"
                        :class="!dense ?'gid-table-checkbox':'gid-table-dense-checkbox'"
                      ></v-checkbox>
                    </template>
                    <template v-else-if="col.value == 'data-table-expand'">
                      <template v-if="actions">
                        <template v-if="actions === 'custom'">
                          <v-icon
                            small
                            color="secondary lighten-4"
                            class="gid-table-action-icon mr-4"
                            @click="onAction(item, 'custom')"
                          >
                            <slot name="action-icon">slot for action-icon</slot>
                          </v-icon>
                        </template>
                        <template v-else-if="Array.isArray(actions)">
                          <v-menu origin="center center" left transition="slide-y-transition">
                            <template #activator="{on}">
                              <v-icon
                                v-on="on"
                                color="secondary lighten-4"
                                class="gid-table-action-icon mr-3"
                              >more_vert</v-icon>
                            </template>
                            <v-list subheader dense class="pa-0">
                              <v-list-item
                                :key="i"
                                @click="onAction(item, action)"
                                v-for="(action, i) in actions.filter(e=>!e.disabled)"
                              >
                                <v-list-item-title>
                                  <v-layout row class="ma-0" justify-center>
                                    <template v-if="action && typeof action === 'object'">
                                      <!-- <gid-lock
                                                                                :locked="action._locked === true"
                                                                                hide-badge
                                      >-->
                                      <v-layout row align-center class="ma-0">
                                        <template v-if="action.icon">
                                          <v-icon
                                            :class="[action._locked === true ? 'unclickable':'', action.name ? 'mr-1':'']"
                                          >{{action.icon}}</v-icon>
                                        </template>
                                        <template v-if="action.name">
                                          <span
                                            :class="action._locked === true ? 'unclickable':''"
                                          >{{action.name}}</span>
                                        </template>
                                      </v-layout>
                                      <!-- </gid-lock> -->
                                    </template>
                                    <template v-else>{{action}}</template>
                                  </v-layout>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </template>
                      <template v-else>
                        <div style="display: inline-flex;">
                          <!-- <gid-lock
                                                        v-if="allowEdit"
                                                        :locked="allowEdit === 'locked'"
                                                        hide-badge
                          >-->
                          <v-icon
                            small
                            @click="onEdit(item)"
                            color="secondary lighten-4"
                            class="gid-table-action-icon"
                            :class="!allowDelete ? 'mr-4':'mr-1'"
                            :disabled="allowEdit === 'locked' || loading"
                          >edit</v-icon>
                          <!-- </gid-lock> -->
                          <!-- <gid-lock
                                                        v-if="allowDelete"
                                                        :locked="allowDelete === 'locked'"
                                                        hide-badge
                          >-->
                          <v-icon
                            small
                            @click="onDelete(item)"
                            color="secondary lighten-4"
                            class="gid-table-action-icon"
                            :class="!allowEdit ? 'mr-4':'mr-2'"
                            :disabled="allowDelete === 'locked' || loading"
                          >delete</v-icon>
                          <!-- </gid-lock> -->
                        </div>
                      </template>
                    </template>
                    <template v-else-if="col.value == 'data-table-selectable'">
                      <div class="gid-table-selectable-icon">
                        <v-slide-x-transition>
                          <v-icon v-if="item._selected">keyboard_arrow_right</v-icon>
                        </v-slide-x-transition>
                      </div>
                    </template>
                    <template v-else>
                      <slot :name="`item.${col.value}`" :item="item">{{ item[col.value] }}</slot>
                    </template>
                  </td>
                </template>
              </tr>
            </template>
            <!-- expanded item of the table -->
            <template #expanded-item="{ item,  headers }" v-if="!actionDrawer">
              <td :colspan="headers.length" class="pa-0">
                <div>
                  <v-card-title class="px-4 subtitle-1">{{computedActionDialogTitle}}</v-card-title>
                  <v-card-text class="px-4">
                    <template v-if="actions">
                      <slot
                        v-if="isAction && !currentAction"
                        name="action"
                        :item="item"
                      >Slot for custom action</slot>
                      <slot
                        v-if="isAction && currentAction"
                        :name="currentAction._slot"
                        :item="item"
                      >Slot for {{currentAction._slot}} action</slot>
                    </template>
                    <template v-else>
                      <slot
                        v-if="isEdit && !isDelete"
                        name="edit"
                        :item="item"
                      >Slot for editing data</slot>
                      <slot
                        v-if="isDelete && !isEdit"
                        name="delete"
                        :item="item"
                      >Slot for deleting data</slot>
                    </template>
                  </v-card-text>
                  <v-card-actions class="py-0 px-4 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeDrawer()">cancel</v-btn>
                    <v-btn
                      color="primary"
                      @click="onDialogAction"
                      :disabled="actionDisabled || loading"
                    >{{computedActionDialogButtonLabel}}</v-btn>
                  </v-card-actions>
                  <v-divider class="ma-0 pa-0"></v-divider>
                </div>
              </td>
            </template>
            <!-- footer below the table -->
            <template #body.append="{ headers }">
              <template v-if="loading">
                <tr v-for="i in pagination.rowsPerPage" :key="i">
                  <td v-for="(header, i) in headers" :key="i">
                    <div class="gid-table-loader">
                      <slot :name="`loading.${header.value}`">
                        <v-skeleton-loader type="text" :tile="!rounded" />
                      </slot>
                    </div>
                  </td>
                </tr>
              </template>
              <div
                v-if="infiniteScroll"
                :class="!dense ? 'gid-table-footer':'gid-table-dense-footer'"
              >
                <slot name="footer"></slot>
              </div>
            </template>
            <!-- when there is no data -->
            <template #no-data>
              <template v-if="!loading">
                gid-empty-state-nodata
                <!-- <slot v-if="searchText.trim() != ''" name="no-results">
                                    <gid-empty-state
                                        flat
                                        :title="`No results found for “${searchText}”`"
                                        :description="'To widen your search, change or remove filters'"
                                        :image-path="'images/empty/not-found-search.svg'"
                                    ></gid-empty-state>
                                </slot>
                                <slot v-else name="no-data">
                                    <gid-empty-state flat :title="noDataText"></gid-empty-state>
                </slot>-->
              </template>
              <template v-else>
                <div class="gid-table-placeholder"></div>
              </template>
            </template>
            <template #no-results>
              <template v-if="!loading">
                gid-empty-state-nodata
                <!-- <slot v-if="searchText.trim() != ''" name="no-results">
                                    <gid-empty-state
                                        flat
                                        :title="`No results found for “${searchText}”`"
                                        :description="'To widen your search, change or remove filters'"
                                        :image-path="'images/empty/not-found-search.svg'"
                                    ></gid-empty-state>
                                </slot>
                                <slot v-else name="no-data">
                                    <gid-empty-state flat :title="noDataText"></gid-empty-state>
                </slot>-->
              </template>
              <template v-else>
                <div class="gid-table-placeholder"></div>
              </template>
            </template>
            <!-- default loading slots -->
            <template #loading>
              <div class="gid-table-placeholder"></div>
            </template>
            <template #progress>
              <div class="gid-table-placeholder"></div>
            </template>
          </v-data-table>
        </VuePerfectScrollbar>
      </v-card>
    </v-container>
    <v-navigation-drawer
      app
      right
      v-if="actionDrawer"
      disable-resize-watcher
      v-model="isDrawerActive"
      :class="rounded? 'gid-table-action-drawer gid-table-action-drawer--rounded':'gid-table-action-drawer'"
    >
      <v-toolbar flat :dense="dense" class="pa-0">
        <template v-if="actionDrawer==='custom'">
          <slot name="action-drawer-title"></slot>
        </template>
        <template v-else>
          <v-toolbar-title :class="dense ? 'dense-toolbar-title':''">{{computedActionDialogTitle}}</v-toolbar-title>
        </template>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="closeDrawer()">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider class="ma-0 pa-0"></v-divider>
      <VuePerfectScrollbar class="action-drawer-scroll-area">
        <template v-if="actionDrawer==='custom'">
          <slot name="action-drawer" :item="updateModel"></slot>
        </template>
        <template v-else>
          <div class="gid-pa">
            <template v-if="actions">
              <slot
                v-if="isAction && !currentAction"
                name="action"
                :item="updateModel"
              >Slot for custom action</slot>
              <slot
                v-if="isAction && currentAction"
                :name="currentAction._slot"
                :item="updateModel"
              >Slot for {{currentAction._slot}} action</slot>
            </template>
            <template v-else>
              <slot v-if="isAdd" name="addNew">Slot for adding data</slot>
              <slot v-if="isEdit && !isDelete" name="edit" :item="updateModel">Slot for editing data</slot>
              <slot
                v-if="isDelete && !isEdit"
                name="delete"
                :item="updateModel"
              >Slot for deleting data</slot>
            </template>
            <v-layout row align-center class="ma-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn class="px-2" text @click="closeDrawer()">Cancel</v-btn>
              <v-btn
                class="px-2 ml-2"
                :color="isDelete ? 'error': 'primary'"
                @click="onDialogAction"
                :disabled="actionDisabled || loading"
              >{{computedActionDialogButtonLabel}}</v-btn>
            </v-layout>
          </div>
        </template>
      </VuePerfectScrollbar>
    </v-navigation-drawer>
  </v-content>
</template>

<script>
// import GidCommon from "@/plugins/gid-common";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
// import GidLock from "@/components/gid-lock/gid-lock.vue";
// import GidEmptyState from "@/components/gid-empty-state/gid-empty-state.vue";

export default {
  name: "GidTable",
  components: {
    // GidLock, GidEmptyState,
    VuePerfectScrollbar
  },
  // mixins: [GidCommon],
  props: {
    addEntityRoute: Object,
    cols: { type: Array, required: true },
    rowKey: { type: String, default: "id" },
    elevated: { type: Boolean, default: true },
    rows: Array,
    rounded: Boolean,
    caption: String,
    tableName: String,
    entityType: String,
    allowExternalAdd: Boolean,
    allowAdd: [Boolean, String],
    allowEdit: [Boolean, String],
    allowDelete: [Boolean, String],
    allowSearch: [Boolean, String],
    allowRefresh: [Boolean, String],
    actions: [String, Array],
    searchPlaceholder: { type: String, default: "Search here" },
    noDataText: { type: String, default: "No data available" },
    hasNext: Boolean,
    maxRows: { type: Number, default: 1000 },
    totalRows: { type: Number, default: 0 },
    infiniteScroll: [Boolean, String],
    actionDisabled: [Boolean],
    addNewLabel: String,
    addNewIcon: String,
    addActionLabel: { type: String, default: "Save" },
    addDialogTitle: String,
    editActionLabel: { type: String, default: "Update" },
    editDialogTitle: String,
    deleteActionLabel: { type: String, default: "Delete" },
    deleteDialogTitle: String,
    customActionLabel: { type: String, default: "Action" },
    customDialogTitle: String,
    selectable: [Boolean, String],
    hideHeader: Boolean,
    liveSearch: Boolean,
    loading: Boolean,
    dense: Boolean,
    showSelect: Boolean,
    singleSelect: [Boolean],
    querySearch: { type: Boolean, default: true },
    queryParam: { type: String, default: "search" },
    initialSort: Object,

    actionDrawer: [Boolean, String]
  },
  data() {
    return {
      tableRef: null,
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isAction: false,
      currentAction: false,
      searchBtn: true,
      searchTextModel: "",
      searchText: "",
      isDrawerActive: false,
      fetchingData: true,
      isAlwaysInfinite: false,
      isToolbarVisible: false,
      scrollSelf: false,
      scrolling: false,
      pagination: {
        page: 1,
        sortBy: "",
        descending: false,
        rowsPerPage: 0
      },
      tableRows: [],
      tableCols: [],
      updateModel: null,
      selected_internal: []
    };
  },
  watch: {
    searchTextModel: {
      handler() {
        if (this.liveSearch) this.updateSearchText(null);
        else if (!this.$listeners["load-data"])
          this.searchText = this.searchTextModel;
      }
    },
    selectedRows: {
      handler(newV) {
        /**
         * Emits all the  selected rows in table
         * @type {Array}
         */
        this.emitEvent("selection-change", [...newV]);
        this.tableRows.forEach(e => {
          this.handleInternalSelect(e);
        });
      }
    },
    pagination: {
      handler(newV) {
        this.fetchingData = true;
        /**
         * Emits the pagination object when page is changed
         * @type {Object}
         */
        this.emitEvent(
          "load-data",
          Object.assign(
            {},
            {
              ...newV,
              rowsPerPage:
                newV.rowsPerPage && newV.rowsPerPage < 1
                  ? this.totalRows
                  : newV.rowsPerPage,
              searchTxt: this.searchText
            }
          )
        );
      },
      deep: true
    },
    cols: {
      handler(n) {
        let _cols = [...n];
        if (this.allowEdit || this.allowDelete || this.actions) {
          _cols.push({
            text: "Actions",
            align: "right",
            sortable: false,
            value: "data-table-expand"
          });
        }
        let notCheckBox = this.showSelect && !this.singleSelect ? false : true;
        if (
          notCheckBox &&
          this.selectable &&
          typeof this.selectable === "string"
        ) {
          _cols.push({
            text: "",
            align: "right",
            sortable: false,
            value: "data-table-selectable"
          });
        }
        this.tableCols = [..._cols];
      },
      immediate: true,
      deep: true
    },
    rows: {
      handler(n) {
        if (this.infiniteScroll) {
          if (!this.fetchingData) return;
          if (this.usingHasNext) {
            if (!this.hasNext) return;
          } else if (this.tableRows.length >= this.totalRows) return;
          this.tableRows.push(...n.filter(e => !this.tableRows.includes(e)));
        } else {
          this.tableRows = [...n];
        }
        let _rows = this.tableRows.map(e => {
          let selected = e._selected
            ? true
            : this.selected_internal.find(el => el === e[this.rowKey])
            ? true
            : false;
          delete e._selected;
          return {
            ...e,
            _selected: selected
          };
        });
        this.tableRows = [..._rows];
        this.fetchingData = false;
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    headerSelectValue() {
      let rowsLength = this.tableRows.length;
      let selectedRowsLength = this.selectedRows.length;
      return selectedRowsLength === 0
        ? false
        : rowsLength === selectedRowsLength;
    },
    headerSelectIndeterminate() {
      let rowsLength = this.tableRows.length;
      let selectedRowsLength = this.selectedRows.length;
      return selectedRowsLength
        ? rowsLength !== selectedRowsLength
          ? true
          : false
        : false;
    },
    canShowExpand() {
      return (this.isEdit || this.isDelete || this.isAction) &&
        !this.actionDrawer
        ? true
        : false;
    },
    canShowToolbar() {
      return this.tableName ||
        this.allowAdd ||
        this.allowSearch ||
        this.allowRefresh ||
        this.$slots.description
        ? true
        : false;
    },
    computedTotalRows() {
      return this.$listeners["load-data"]
        ? this.usingHasNext
          ? this.tableRows.length + 1
          : this.totalRows
        : undefined;
    },
    computedAddNewLabel() {
      return this.addNewLabel
        ? this.addNewLabel
        : `Add ${this.entityType || "new"}`;
    },
    computedActionDialogTitle() {
      if (this.isEdit)
        return this.editDialogTitle || "Edit " + (this.entityType || "");
      else if (this.isAdd)
        return this.addDialogTitle || "Add new " + (this.entityType || "");
      else if (this.isDelete)
        return this.deleteDialogTitle || "Delete " + (this.entityType || "");
      else if (this.isAction)
        return this.customDialogTitle || "Action " + (this.entityType || "");
      return "";
    },
    computedActionDialogButtonLabel() {
      if (this.isEdit) return this.editActionLabel;
      else if (this.isAdd) return this.addActionLabel;
      else if (this.isDelete) return this.deleteActionLabel;
      else if (this.isAction) return this.customActionLabel;
      return "Save";
    },
    selectedRows() {
      return this.tableRows.filter(e => e._selected);
    },
    usingHasNext() {
      return (
        this.$options.propsData.hasOwnProperty("hasNext") &
        (typeof this.$options.propsData.hasNext !== typeof undefined) &
        ("hasNext" in this.$options.propsData)
      );
    },
    scrollRef() {
      return `#${this.tableRef}`;
    }
  },
  methods: {
    //emit function
    emitEvent(event, value) {
      if (this.$listeners[event]) {
        this.$emit(event, value);
      }
    },
    //gid-table methods
    scrolledVertical(e) {
      if (!this.infiniteScroll || this.fetchingData) return;
      if (this.usingHasNext) {
        if (!this.hasNext) return;
      } else if (this.tableRows.length >= this.totalRows) return;
      if (this.scrollSelf) {
        if (this.scrolling) return;
        this.scrolling = true;
        if (
          parseInt(
            (e.target.scrollTop /
              (e.target.scrollHeight - e.target.clientHeight)) *
              100
          ) > 80
        ) {
          if (this.tableRows.length > this.maxRows && !this.isAlwaysInfinite)
            return;
          else this.pagination.page++;
        }
        this.scrolling = false;
      } else {
        let h = document.documentElement,
          b = document.body,
          st = "scrollTop",
          sh = "scrollHeight";
        h = parseInt(
          ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100
        );
        if (h > 60) {
          if (this.tableRows.length > this.maxRows && !this.isAlwaysInfinite)
            return;
          else this.pagination.page++;
        }
      }
    },
    onDialogAction() {
      if (this.isAdd) {
        this.emitEvent("add", this.updateModel);
      } else if (this.isEdit) {
        this.emitEvent("add", this.updateModel);
      } else if (this.isDelete) {
        this.emitEvent("delete", this.updateModel);
      }
    },
    onSearchOpen() {
      this.searchBtn = false;
      this.$nextTick(() =>
        setTimeout(() => {
          this.$refs.searchBox.focus();
        }, 0)
      );
    },
    onSearchClose() {
      this.searchBtn = !this.searchBtn;
      this.searchTextModel = "";
      this.updateSearchText();
    },
    onSearchBlur() {
      if (!this.searchTextModel.length) {
        this.searchBtn = true;
        this.searchTextModel = "";
        this.updateSearchText();
      }
    },

    //functions
    getGidTableCLasses() {
      let classes = "";
      classes += this.elevated ? "elevation-1 " : "";
      classes += this.rounded ? " gid-table--rounded " : "";
      classes += this.loading ? " gid-table-loading " : "";
      return classes;
    },
    getHeaderClasses(header) {
      let classes = " gid-table-header ";
      classes += ` text-${header.align || "center"} `;
      classes +=
        header.value === this.pagination.sortBy
          ? " gid-table-header-active "
          : " ";
      classes += header.sortable
        ? " gid-table-header-sortable " +
          (this.pagination.descending
            ? " gid-table-header-desc "
            : " gid-table-header-asc ")
        : " ";
      return classes;
    },
    getRowClasses() {
      let classes = "gid-table-row ";
      return classes;
    },
    getColumnClasses(header) {
      let classes = " gid-table-column ";
      classes += ` text-${header.align || "center"} `;
      if (header.value == "data-table-selectable")
        classes += " gid-table-selectable ";
      return classes;
    },
    getHeaderStyles(_h, header) {
      let _style = "";
      if (header && header.value === "data-table-select") {
        return _style;
      }
    },
    getRowStyles(item) {
      let styl = "";
      if (
        item.isEdit ||
        item.isAction ||
        (this.selectable &&
          this.selectable !== "icon" &&
          !this.showSelect &&
          item._selected == true)
      ) {
        styl += "box-shadow:inset -3px -1px 0 -1px #42aaee;";
      } else if (item.isDelete) {
        styl += "box-shadow:inset -3px -1px 0 -1px #ff5252;";
      }

      return styl;
    },
    getColumnStyles() {},
    getselfScrollStyle() {
      return this.scrollSelf
        ? "height: " +
            parseInt(this.infiniteScroll) * (this.dense ? 24 : 48) +
            "px"
        : "unset";
    },
    changeSort(header) {
      if (this.loading || !header.sortable) return;
      if (this.infiniteScroll) {
        this.pagination.page = 1;
        this.tableRows = [];
      }
      if (header && header.value && header.sortable && !this.loading) {
        if (this.pagination.sortBy == header.value)
          this.pagination.descending = !this.pagination.descending;
        else this.pagination.sortBy = header.value;
      }
    },
    openDrawer(type, item) {
      this.closeDrawer();
      switch (type) {
        case "add":
          this.isAdd = true;
          break;
        case "edit":
          this.isEdit = true;
          item.isEdit = true;
          break;
        case "delete":
          this.isDelete = true;
          item.isDelete = true;
          break;
        case "action":
          this.isAction = true;
          item.isAction = true;
          break;
        default:
          break;
      }
      if (type == "add") {
        this.updateModel = null;
      } else {
        this.updateModel = item;
        this.expand(this.updateModel, true);
      }
      this.isDrawerActive = true;
      this.emitEvent("drawer-open", true);
    },
    closeDrawer() {
      this.isAdd = false;
      this.isEdit = false;
      this.isDelete = false;
      this.isAction = false;
      this.isDrawerActive = false;
      if (this.updateModel) {
        delete this.updateModel.isAction;
        delete this.updateModel.isDelete;
        delete this.updateModel.isEdit;
        this.expand(this.updateModel, false);
      }
      this.emitEvent("drawer-open", false);
    },
    onAddNew() {
      if (this.addEntityRoute) {
        this.$router.push(this.addEntityRoute);
      } else {
        if (this.allowAdd !== "external") {
          this.openDrawer("add");
        }
      }
      this.emitEvent("click-add");
    },
    onEdit(item) {
      this.openDrawer("edit", item);
      this.emitEvent("click-edit");
    },
    onDelete(item) {
      this.openDrawer("delete", item);
      this.emitEvent("click-delete");
    },
    onAction(item, action) {
      if (action) {
        if (action === "custom") {
          this.currentAction = null;
          this.openDrawer("action", item);
        } else if (action._slot && !action._locked) {
          this.currentAction = { ...action };
          this.openDrawer("action", item);
        }
        this.emitEvent("action-click", {
          action: action,
          details: item
        });
      }
    },
    onRow(item) {
      if (this.showSelect) return;
      if (this.selectable) {
        item._selected = true;
        this.toggleOneSelection(item);
      }
    },
    onCheckBox(item) {
      if (this.singleSelect) {
        this.toggleOneSelection(item);
      }
      this.emitEvent("checkbox-clicked", item);
    },
    expand(item, value) {
      if (this.actionDrawer) return;
      this.$refs[this.tableRef].expand(item, value);
    },
    refresh(e) {
      this.tableRows = [];
      this.closeDrawer();
      if (this.searchTextModel.trim().length && e != null) {
        this.searchText = "";
        this.searchTextModel = "";
      }
      this.pagination.page = undefined;
      this.pagination.page = 1;
      this.updateQuerySearch(true, "");
    },
    toggleOneSelection(item) {
      this.tableRows.forEach(e => {
        if (!e.hasOwnProperty(this.rowKey))
          throw new Error("row-key not found");
        if (e[this.rowKey] !== item[this.rowKey]) {
          e._selected = false;
        }
      });
    },
    toggleAllSelections() {
      let selected = this.selectedRows.length === 0 ? true : false;
      this.tableRows.forEach(e => {
        e._selected = selected;
      });
    },
    updateSearchText() {
      this.closeDrawer();
      if (this.searchText == this.searchTextModel.trim()) return;
      this.searchText = this.searchTextModel.trim();
      if (this.$listeners["load-data"]) {
        this.refresh(null);
      }
      this.updateQuerySearch(true, this.searchText);
    },
    updateQuerySearch() {
      // if (this.querySearch && this.allowSearch) {
      //     if (set) {
      //         this.setQueryParams(
      //             Object.assign(this.$route.query, {
      //                 [this.queryParam]: this.searchText
      //             })
      //         );
      //     } else {
      //         let searchTerm =
      //             this.getQueryParams()[this.queryParam] || null;
      //         if (searchTerm) {
      //             this.onSearchOpen();
      //             this.searchTextModel = searchTerm;
      //             this.updateSearchText();
      //         }
      //     }
      // }
    },
    handleInternalSelect(item) {
      let i = this.selected_internal.indexOf(item[this.rowKey]);
      if (i < 0) {
        if (item._selected) {
          this.selected_internal.push(item[this.rowKey]);
        }
      } else {
        if (!item._selected) {
          this.selected_internal.splice(i, 1);
        }
      }
    },
    handleIntialSort() {
      if (
        this.initialSort &&
        this.initialSort.hasOwnProperty("columnName") &&
        this.initialSort.hasOwnProperty("descending")
      ) {
        this.pagination.sortBy = this.initialSort.columnName;
        this.pagination.descending = this.initialSort.descending;
      }
    }
  },
  created() {
    this.tableRef = "gid_table_" + Date.now();
  },
  mounted() {
    if (this.infiniteScroll) {
      if (!isNaN(parseInt(this.infiniteScroll))) this.scrollSelf = true;
      if (!this.allowSearch) this.isAlwaysInfinite = true;
      let b = document.body,
        sh = "scrollHeight",
        topbarHeight = 64,
        rowHeight = 50;
      let computedRows = parseInt((b[sh] - topbarHeight) / rowHeight);
      this.pagination.rowsPerPage = this.scrollSelf
        ? parseInt(this.infiniteScroll)
        : this.dense
        ? computedRows * 2 + 2
        : computedRows;
    } else {
      this.pagination.rowsPerPage = 10;
    }
    // this.updateQuerySearch();
    this.handleIntialSort();
  }
};
</script>

<style scoped>
.gid-table--rounded {
  border-radius: 8px !important;
  overflow: hidden;
}
.gid-table-checkbox {
  width: 34px !important;
  height: 34px !important;
  margin: 0 !important;
}
.gid-table .action-drawer-scroll-area {
  height: calc(100vh - 81px - 64px) !important;
  position: relative;
}
.gid-table .gid-table-scroll-area {
  position: relative;
}
.gid-table-action-drawer.v-navigation-drawer--right {
  margin-top: 80px !important;
  height: calc(100vh - 80px) !important;
  padding-top: 0 !important;
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
}
.gid-table-action-drawer--rounded.v-navigation-drawer--right {
  border-top-left-radius: 8px !important;
}
.gid-table-action-drawer >>> .v-navigation-drawer__border {
  display: none;
}
.gid-table-dense-checkbox {
  height: 24px !important;
  width: 24px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
.gid-table-checkbox >>> .v-input__control {
  height: 34px !important;
}
.dense-toolbar-title {
  font-size: 16px !important;
}
.gid-table-footer {
  min-height: 48px;
}
.gid-table-dense-footer {
  min-height: 24px;
}
.gid-table-header-sortable:hover {
  color: rgba(0, 0, 0, 0.87) !important;
}
.gid-table-header-sortable {
  cursor: pointer;
}
.gid-table-header-active {
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 600 !important;
}
.gid-table-header-sortable >>> .v-icon {
  opacity: 0;
}
.gid-table-header-sortable:hover >>> .v-icon {
  opacity: 1;
}
.gid-table-header-active.gid-table-header-desc >>> .v-icon {
  transform: rotate(180deg);
}
.gid-table-header-active.gid-table-header-asc >>> .v-icon,
.gid-table-header-active.gid-table-header-desc >>> .v-icon {
  opacity: 1;
  color: rgba(0, 0, 0, 0.87) !important;
}
.gid-table-action-icon:hover {
  color: rgba(0, 0, 0, 0.87) !important;
}
tbody > td:last-child >>> hr {
  display: none;
}
.selectable {
  cursor: pointer;
}
.gid-table-selectable {
  width: 24px !important;
}
.gid-table-selectable-icon {
  min-width: 24px !important;
}
.unclickable {
  pointer-events: none;
  color: #c5c5c5 !important;
}
.gid-table-loading >>> .v-data-table__empty-wrapper {
  display: none;
}
.gid-table >>> .v-data-table__progress {
  display: none;
}
.gid-table-placeholder {
  width: 100%;
  height: 1px;
}
.gid-table-loader {
  width: inherit;
  margin-bottom: -6px !important;
}
</style>