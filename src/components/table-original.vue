<template>
  <v-content :class=" actionDrawer? 'gid-table action-drawer-table':'gid-table'" v-resize="cropColumns">
    <v-container fluid pa-0 v-scroll="scrolledVertical" :class="elevated ? 'elevation-1':''">
      <v-layout row ma-0>
        <v-flex xs12 pa-0>
          <v-toolbar
                  :extended="isToolbarExtended"
                  :extension-height="extensionHeight"
                  flat
                  :dense="dense"
                  style="background:var(--topbar-bg-color);"
                  :class="[routeBack?'pl-0':'pl-2','border-bottom']"
                  v-if="isToolbarVisible"
          >
            <router-link :to="routeBack" v-if="routeBack">
              <v-btn
                      icon
                      class="ma-0"
                      color="grey--text"
              >
                <v-icon>arrow_back</v-icon>
              </v-btn>
            </router-link>
            <v-toolbar-title class="ml-0" :class="dense? 'dense-toolbar-title':''">
              <slot v-if="$slots.description" name="description"></slot>
              <div v-else-if="tableName">{{tableName}}</div>
            </v-toolbar-title>
            <template v-if="!isToolbarExtended">
              <v-spacer></v-spacer>
              <template v-if="allowSearch && (actionDrawer || !isAdd)">
                <v-btn v-if="searchBtn" flat icon class="mr-0" @click="onSearchBtnClick" ref="searchButton">
                  <v-icon>search</v-icon>
                </v-btn>
                <v-flex xs3 v-else pa-0>
                  <v-tooltip bottom v-if="$options.propsData.searchPlaceholder">
                    <template #activator="{on}">
                      <v-text-field v-on="on"
                                    class="pt-0 pr-2"
                                    ref="searchBox"
                                    v-model="searchTxtModel"
                                    append-icon="cancel"
                                    @click:append="() => {searchBtn = !searchBtn; searchTxtModel = '';updateSearchTxtFun()}"
                                    :label="searchPlaceholder"
                                    single-line
                                    hide-details
                                    @blur="() => {if(!searchTxtModel.length){searchBtn = true; searchTxtModel = ''; updateSearchTxtFun()}}"
                                    @keyup.13="updateSearchTxtFun"
                      ></v-text-field>
                    </template>
                    <span>{{searchPlaceholder}}</span>
                  </v-tooltip>
                  <v-text-field v-else
                                class="pt-0 pr-2"
                                ref="searchBox"
                                v-model="searchTxtModel"
                                append-icon="cancel"
                                @click:append="() => {searchBtn = !searchBtn; searchTxtModel = '';updateSearchTxtFun()}"
                                :label="searchPlaceholder"
                                single-line
                                hide-details
                                @blur="() => {if(!searchTxtModel.length){searchBtn = true; searchTxtModel = ''; updateSearchTxtFun()}}"
                                @keyup.13="updateSearchTxtFun"
                  ></v-text-field>
                </v-flex>
              </template>
              <v-expand-x-transition>
                <div v-show="actionDrawer || !isAdd">
                  <v-btn
                          icon
                          class="mr-0"
                          v-if="allowRefresh && $listeners['load-data']"
                          title="Refresh"
                          @click="refresh"
                  >
                    <v-icon>refresh</v-icon>
                  </v-btn>
                </div>
              </v-expand-x-transition>
              <template v-if="allowAdd">
                <v-expand-x-transition>
                  <div v-show="actionDrawer || !isAdd">
                    <gid-lock :locked="allowAdd === 'locked'">
                      <v-btn
                              flat
                              color="primary"
                              @click="addNewClickFun"
                              :disabled="allowAdd === 'locked'"
                              style="margin-right:-8px">
                        <v-icon>{{addNewIcon || 'add'}}</v-icon>
                        <span v-if="addNewLabel">{{addNewLabel}}</span>
                        <span v-else>Add {{entityType || 'new'}}</span>
                      </v-btn>
                    </gid-lock>
                  </div>
                </v-expand-x-transition>
                <v-expand-x-transition v-if="!actionDrawer">
                  <div v-show="isAdd">
                    <v-btn icon @click="isAdd=false" class>
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </div>
                </v-expand-x-transition>
              </template>
            </template>
            <template #extension v-if="isToolbarExtended">
              <v-toolbar-title class="ml-0" dense>
                <div>{{tableName}}</div>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <template v-if="allowSearch && !isAdd">
                <v-btn v-if="searchBtn" flat icon class="mr-0" @click="onSearchBtnClick" ref="searchButton">
                  <v-icon>search</v-icon>
                </v-btn>
                <v-flex xs3 v-else pa-0>
                  <v-tooltip bottom v-if="$options.propsData.searchPlaceholder">
                    <template #activator="{on}">
                      <v-text-field v-on="on"
                                    class="pt-0 pr-2"
                                    ref="searchBox"
                                    v-model="searchTxtModel"
                                    append-icon="cancel"
                                    @click:append="() => {searchBtn = !searchBtn; searchTxtModel = '';updateSearchTxtFun()}"
                                    :label="searchPlaceholder"
                                    single-line
                                    hide-details
                                    @blur="() => {if(!searchTxtModel.length){searchBtn = true; searchTxtModel = ''; updateSearchTxtFun()}}"
                                    @keyup.13="updateSearchTxtFun"
                      ></v-text-field>
                    </template>
                    <span>{{searchPlaceholder}}</span>
                  </v-tooltip>
                  <v-text-field v-else
                                class="pt-0 pr-2"
                                ref="searchBox"
                                v-model="searchTxtModel"
                                append-icon="cancel"
                                @click:append="() => {searchBtn = !searchBtn; searchTxtModel = '';updateSearchTxtFun()}"
                                :label="searchPlaceholder"
                                single-line
                                hide-details
                                @blur="() => {if(!searchTxtModel.length){searchBtn = true; searchTxtModel = ''; updateSearchTxtFun()}}"
                                @keyup.13="updateSearchTxtFun"
                  ></v-text-field>
                </v-flex>
              </template>
              <v-expand-x-transition>
                <div v-show="!isAdd">
                  <v-btn
                          icon
                          class="mr-0"
                          v-if="allowRefresh && $listeners['load-data']"
                          title="Refresh"
                          @click="refresh"
                  >
                    <v-icon>refresh</v-icon>
                  </v-btn>
                </div>
              </v-expand-x-transition>
              <template v-if="allowAdd">
                <v-expand-x-transition>
                  <div v-show="!isAdd">
                    <gid-lock :locked="allowAdd === 'locked'">
                      <v-btn
                              flat
                              color="primary"
                              @click="addNewClickFun"
                              :disabled="allowAdd === 'locked'"
                              style="margin-right:-8px">
                        <v-icon v-if="addNewIcon">{{addNewIcon}}</v-icon>
                        <v-icon v-else>add</v-icon>
                        <span v-if="addNewLabel">{{addNewLabel}}</span>
                        <span v-else>Add {{entityType || 'new'}}</span>
                      </v-btn>
                    </gid-lock>
                  </div>
                </v-expand-x-transition>
                <v-expand-x-transition>
                  <div v-if="isAdd">
                    <v-btn icon @click="isAdd=false" class>
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </div>
                </v-expand-x-transition>
              </template>
            </template>
          </v-toolbar>
        </v-flex>
      </v-layout>
      <v-expansion-panel :value="isAdd?0:-1" v-if="!actionDrawer" class="elevation-0" >
        <v-expansion-panel-content class="elevation-0">
          <v-card flat tile class="py-0 px-0" ref="addDialog">
            <v-card-title class="title px-4">
              <span v-if="addDialogTitle">{{addDialogTitle}}</span>
              <span v-else v-text="`Add new ${entityType}`"></span>
            </v-card-title>
            <v-card-text class="px-4">
              <!-- Slot for adding new item -->
              <slot name="addNew" :item="updateModel"></slot>
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
              <v-spacer></v-spacer>
              <v-btn flat @click="isAdd=false">Cancel</v-btn>
              <v-btn color="primary" @click="dialogActionClickFun" :disabled="actionButtonDisabled">{{getActionDialogButtonLabel}}</v-btn>
            </v-card-actions>
            <v-divider class="ma-0" v-show="!actionDrawer"></v-divider>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!--<v-divider class="ma-0" v-if="isToolbarVisible"></v-divider>-->
      <v-layout row wrap ma-0>
        <v-flex xs12 pa-0 v-scroll:[`#`+tableRef]="scrolledVertical">
          <v-data-table :id="tableRef"
                        :headers="tableCols"
                        :items="tableRows"
                        :item-key="colID"
                        :select-all="checkBoxColumn"
                        v-model="selectedRows"
                        :total-items="this.$listeners['load-data'] ? usingHasNext? tableRows.length + 1: totalItems : undefined"
                        :search="this.$listeners['load-data'] ? undefined : searchTxt"
                        :pagination.sync="pagination"
                        :rows-per-page-items="rowsPageSizeItems"
                        :hide-actions="(pageLink || infiniteScroll) ? true : hideActions"
                        :ref="tableRef"
                        :hide-headers="hideHeaders"
                        :disable-initial-sort="disableInitialSort"
                        :style="this.scrollSelf?'overflow-y:auto;max-height:'+((parseInt(this.infiniteScroll)*48)+(this.hideHeaders?0:this.headerHeight)) +'px':'unset'"
          >
            <!-- when there is no data -->
            <template #no-data>
              <template v-if="loading">
                <tr v-for="i in 3" class="border-bottom" :key="i">
                  <td v-for="(col,j) in tableCols" :key="j">
                    <template v-if="col.type == 'icon'">
                      <v-layout row ma-0 align-center>
                        <div class="text-line icon-shimmer"></div>
                        <div style="wdth: 150px;" class="pl-3">
                          <div class="text-line my-2" style="with: 100px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else-if="col.type == 'chip'">
                      <div class="text-line chip-shimmer"></div>
                    </template>
                    <template v-else-if="col.type == 'status'">
                      <v-layout row class="ma-0" align-center>
                        <div class="text-line" style="idth: 3px;"></div>
                        <div style="widh: 100px;" class="pl-3">
                          <div class="text-line my-2" style="wdth: 50px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else>
                      <div class="text-line" :class="[col.value==='CheckBoxColumn'?'check-box-column-shimmer':'',
                      col.value==='ExpandColumn'?'expand-column-shimmer':'']"></div>
                    </template>
                  </td>
                </tr>
              </template>
              <tr class="border-bottom" v-else>
                <td :colspan="tableCols.length" class="text-center pa-0">
                  <slot v-if="searchTxt.trim() != ''" name="noresults">
                    <gid-empty-state
                            flat
                            :title="`No results found for “${searchTxt}”`"
                            :description="'To widen your search, change or remove filters'"
                            :image-path="'images/empty/not-found-search.svg'"
                    ></gid-empty-state>
                  </slot>
                  <slot v-else name="nodata">
                    <gid-empty-state flat :title="noDataText"></gid-empty-state>
                  </slot>
                </td>
              </tr>
            </template>
            <!-- table cols -->
            <template #headers="props">
              <tr style="border:0;z-index:1" class="border-bottom">
                <th v-show="header.value=='ExpandColumn'?tableCols__internal.length:true"
                    v-for="(header, index) in props.headers"
                    :key="header.value"
                    class="body-1"
                    :class="['px-3',
                          getHeadSortClass(header),
                          'text-xs-'+(header.type=='Boolean'?'center':(header.align || 'left')),
                          header.class
                        ]"
                    @click="changeSortFun(header.value,pagination.sortBy,header.sortable)"
                    :title="header.text"
                    :style="{
                          width: header.value=='CheckBoxColumn'? checkBoxColumnWidth: header.value=='ExpandColumn'? expandColumnWidth: header.width || 'auto',
                          maxWidth: header.value=='CheckBoxColumn'? checkBoxColumnWidth: header.value=='ExpandColumn'? expandColumnWidth: header.maxWidth || 'auto',
                          minWidth: header.value=='CheckBoxColumn'? checkBoxColumnWidth: header.value=='ExpandColumn'? expandColumnWidth: 'auto',
                          background: header.hidden==true?'red':'inherit'
                        }"
                >
                  <v-flex shrink pa-0 align-center ma-0 :class="(header.align || '')=='right'?'justify-content-end':''">
                    <template v-if="header.value==='CheckBoxColumn'">
                      <v-checkbox style="justify-content:center !important;" class="ml-3"
                                  :input-value="props.all"
                                  :indeterminate="props.indeterminate"
                                  color="primary"
                                  hide-details
                                  @click.stop="toggleAllCBColFun"
                      ></v-checkbox>
                    </template>
                    <template v-else>
                      <v-icon small style="margin-bottom:1px;" v-if="header.sortable && header.align === 'right'">
                        arrow_upward
                      </v-icon>
                      <span :style="getHeaderStyles('text',props.headers, index)" class="header--text">{{ header.text }}</span>
                      <v-icon style="margin-bottom:1px;" small v-if="header.sortable && (header.align !== 'right')">
                        arrow_upward
                      </v-icon>
                    </template>
                  </v-flex>
                </th>
              </tr>
            </template>
            <!-- table data/rows -->
            <template v-slot:items="props">
              <tr class="border-bottom" :class="(props.index % 2) ? 'odd-row' : 'even-row'"
                  :style="`
                  box-shadow: ${(props.item.isEdit || props.item.isAction)?'inset -3px -1px 0 -1px #42aaee;':
                              props.item.isDelete?'inset -3px -1px 0 -1px #ff5252;':
                              (props.item._selected && selectable && !selectedIcon)?'inset -3px -1px 0 -1px #42aaee;':''};
                  cursor:${$listeners['row-selected']?'pointer':''};
                  `"
              >
                <template v-if="!infiniteScroll && loading">
                  <td v-for="i in tableCols.length" :key="i">
                    <template v-if="tableCols[i-1] && tableCols[i-1].type == 'icon'">
                      <v-layout row class="ma-0" align-center>
                        <div class="text-line icon-shimmer"></div>
                        <div style="idth: 150px;" class="pl-3">
                          <div class="text-line my-2" style="idth: 100px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else-if="tableCols[i-1] && tableCols[i-1].type == 'chip'">
                      <div class="text-line chip-shimmer"></div>
                    </template>
                    <template v-else-if="tableCols[i-1] && tableCols[i-1].type == 'status'">
                      <v-layout row class="ma-0" align-center>
                        <div class="text-line" style="idth: 3px;"></div>
                        <div style="with: 100px;" class="pl-3">
                          <div class="text-line my-2" style="wdth: 50px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else>
                      <div class="text-line"></div>
                    </template>
                  </td>
                </template>
                <template v-else>
                  <td
                          :key="index"
                          v-for="(col, index) in tableCols" v-show="col.value=='ExpandColumn'?tableCols__internal.length:true"
                          :class="['px-3',
                            col.clickable ? 'clickAbleCell' : '',
                            props.item.style && props.item.style[col.value] ? props.item.style[col.value]:'',
                            'text-xs-'+(col.type=='Boolean'?'center':(col.align || 'left')),
                            col.value === 'AllowSelectable' && selectedIcon ? 'selected-icon':'',
                            selectable ? 'selectable':'',
                            col.multicell && index==tableCols.length-1?'pr-0':'',
                            col.class
                          ]"
                          @click.stop="cellClickFun(props.item,col.value, $event)"
                          :data-cell="JSON.stringify({'index': index, 'value': getItemValFun(props.item, col.value)})"
                          :style="{
                            width: col.value=='CheckBoxColumn'? checkBoxColumnWidth: col.value=='ExpandColumn'? expandColumnWidth: col.width || 'auto',
                            maxWidth: col.value=='CheckBoxColumn'? checkBoxColumnWidth: col.value=='ExpandColumn'? expandColumnWidth: col.maxWidth || 'auto',
                            minWidth: col.value=='CheckBoxColumn'? checkBoxColumnWidth: col.value=='ExpandColumn'? expandColumnWidth: 'auto',
                            cursor: col.value==='ExpandColumn'?'default':''
                          }"
                  >
                    <template v-if="col.value==='ExpandColumn'">
                      <v-btn small class="ma-0" icon @click.stop="expandRow('icon', props)">
                        <v-icon color="rgba(0,0,0,0.34)">{{getExpandIcon(props)}}</v-icon>
                      </v-btn>
                    </template>
                    <template v-else-if="col.value==='CheckBoxColumn'">
                      <v-checkbox style="justify-content:center !important;"
                                  v-model="props.item._selected"
                                  color="primary" class="ml-3"
                                  :class="props.item._selected?'':'inactive'"
                                  hide-details
                                  @change="updateRowSelection(props.item)"
                      ></v-checkbox>
                    </template>
                    <template v-else-if="col.value!=='ActionColumn'">
                      <template v-if="col.type=='Link'">
                        <router-link :to="getItemValFun(props.item, col.href)" exact>{{ getItemValFun(props.item, col.value)}}</router-link>
                      </template>
                      <template v-else-if="col.type=='Boolean'">
                        <v-checkbox class="ml-2"
                                    :input-value="getItemValFun(props.item, col.value)"
                                    primary
                                    hide-details
                                    readonly
                        ></v-checkbox>
                      </template>
                      <div v-else-if="col.type=='icon'" style="margin-left: -8px">
                        <v-layout row align-center class="ma-0">
                          <v-flex shrink class="pa-0">
                            <v-avatar class="ma-1 gid-table-icon" v-if="props.item[col.value].circular">
                              <v-btn
                                      fab
                                      small
                                      depressed
                                      :color="currentTheme === 'theme--dark'? null:'#e5e5e5'"
                                      :ripple="false"
                                      :disabled="props.item[col.value].image"
                              >
                                <template v-if="props.item[col.value].name">
                                  <span>{{props.item[col.value].name}}</span>
                                </template>
                                <template v-else-if="props.item[col.value].icon">
                                  <v-icon>{{props.item[col.value].icon}}</v-icon>
                                </template>
                                <template v-else-if="props.item[col.value].image">
                                  <img :src="props.item[col.value].image" alt="Avatar"/>
                                </template>
                              </v-btn>
                            </v-avatar>
                            <v-avatar tile v-else class="ma-1">
                              <template v-if="props.item[col.value].name">
                                <span>{{props.item[col.value].name}}</span>
                              </template>
                              <template v-else-if="props.item[col.value].icon">
                                <v-icon color="secondary">{{props.item[col.value].icon}}</v-icon>
                              </template>
                              <template v-else-if="props.item[col.value].image">
                                <img :src="props.item[col.value].image" alt="Avatar"/>
                              </template>
                            </v-avatar>
                          </v-flex>
                          <v-flex shrink class="pa-1">
                            <v-layout column align-start justify-center class="ma-0">
                              <v-flex v-if="props.item[col.value]" class="pa-0">
                                <span class="body-2">{{props.item[col.value].title}}</span>
                              </v-flex>
                              <v-flex v-if="props.item[col.value].description" class="pa-0">
                                <div>{{props.item[col.value].description}}</div>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </div>
                      <span v-else-if="col.type=='status'">
                        <v-layout row align-center class="ma-0">
                          <v-flex shrink class="pa-0">
                            <div class="status-color" :class="props.item[col.value].color"></div>
                          </v-flex>
                          <v-flex shrink class="pa-1">
                            <v-layout column align-start justify-center class="ma-0">
                              <v-flex v-if="props.item[col.value].title" class="pa-0">
                                <span class="status-title">{{props.item[col.value].title}}</span>
                              </v-flex>
                              <v-flex v-if="props.item[col.value].subtitle" class="pa-0">
                                <div class="status-subtitle">{{props.item[col.value].subtitle}}</div>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </span>
                      <span v-else-if="col.type=='chip'">
                        <template v-for="chip in props.item[col.value]">
                          <v-chip small :key="chip">{{chip}}</v-chip>
                        </template>
                      </span>
                      <span v-else-if="col.type=='custom'">
                        <slot :name="col.name || 'custom'" :item="{[col.value]:props.item[col.value],detail:props.item}"></slot>
                      </span>
                      <span
                              v-else-if="col.decimal"
                      >{{getDecimalValue(getItemValFun(props.item, col.value))}}</span>
                      <span v-else-if="col.class && col.class.includes('text-tooltip')">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">{{getItemValFun(props.item, col.value)}}</span>
                          </template>
                          <span>{{getItemValFun(props.item, col.tooltipValue)}}</span>
                        </v-tooltip>
                      </span>
                      <span v-else-if="col.timestamp">{{parseDate(getItemValFun(props.item, col.value))}}</span>
                      <v-layout class="ma-0" v-else-if="col.multicell" fill-height row>
                        <v-flex class="pa-0 align-center justify-center" d-flex v-for="i in col.multicell"
                                :style="`width:${col.width[i-1]}px`"
                                :class="[Array.isArray(col.classes)?col.classes[i-1]:col.classes]" :key="i">
                          <span v-if="Array.isArray(props.item[col.value])">{{props.item[col.value][i-1]}}</span>
                          <span v-else-if="typeof(props.item[col.value])==='object'">{{Object.values(props.item[col.value])[i-1]}}</span>
                        </v-flex>
                      </v-layout>
                      <span v-else>
                        <template v-if="props.item.link && props.item.link[col.value]">
                          <a :href="props.item.link[col.value]">{{getItemValFun(props.item, col.value)}}</a>
                        </template>
                        <template v-else>{{ getItemValFun(props.item, col.value)}}</template>
                      </span>
                    </template>
                    <v-layout ma-0 align-center justify-end fill-height v-else>
                      <span v-if="actions && Array.isArray(actions)" class="">
                        <v-menu origin="center center" left transition="slide-y-transition">
                          <template #activator="{on}">
                            <v-btn
                                    icon
                                    v-on="on"
                                    class="table-action-menu-icon secondary--text text--lighten-4"
                            >
                              <v-icon>more_vert</v-icon>
                            </v-btn>
                          </template>
                          <v-list subheader class="pa-0" dense>
                            <v-list-tile
                                    v-for="(action, i) in actions.filter(e=>!e.disabled)"
                                    :key="i"
                                    @click="expandRow('action', props, action)"
                            >
                              <v-list-tile-title>
                                <v-layout row class="ma-0" justify-start>
                                  <template v-if="action instanceof Object">
                                    <gid-lock :locked="action._locked === true" hide-badge>
                                      <v-layout row align-center class="ma-0">
                                        <template v-if="action.icon">
                                          <v-icon
                                                  :class="[action._locked === true ? 'unclickable':'', action.name ? 'mr-1':'']">
                                            {{action.icon}}</v-icon>
                                        </template>
                                        <template v-if="action.name">
                                          <span :class="action._locked === true ? 'unclickable':''">
                                            {{action.name}}
                                          </span>
                                        </template>
                                      </v-layout>
                                    </gid-lock>
                                  </template>
                                  <template v-else>{{action}}</template>
                                </v-layout>
                              </v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </span>
                      <gid-lock v-if="allowEdit" :locked="allowEdit === 'locked'" hide-badge>
                        <v-icon
                                small
                                color="secondary lighten-4"
                                class="editBtn"
                                :class="allowEdit && allowDelete ? 'mr-1':'mr-3'"
                                @click="expandRow('edit', props)"
                                :disabled="allowEdit === 'locked'"
                        >edit
                        </v-icon>
                      </gid-lock>
                      <gid-lock v-if="allowDelete" :locked="allowDelete === 'locked'" hide-badge>
                        <v-icon
                                small
                                color="secondary lighten-4"
                                class="deleteBtn"
                                :class="allowEdit && allowDelete ? 'mr-1':'mr-3'"
                                @click="expandRow('delete', props)"
                                :disabled="allowDelete === 'locked'"
                        >delete
                        </v-icon>
                      </gid-lock>
                    </v-layout>
                    <v-icon v-if="col.value==='AllowSelectable' && selectable && selectedIcon && props.item._selected">keyboard_arrow_right</v-icon>
                  </td>
                </template>
              </tr>
            </template>

            <template #expand="props" v-if="isRowExpandable">
              <!--<v-expand-y-transition>-->
              <div v-if="isEdit && !actionDrawer" class="gid-pa border-bottom">
                <div class="title pb-3">
                  <span v-if="editDialogTitle">{{editDialogTitle}}</span>
                  <span v-else>Edit {{entityType}}</span>
                </div>
                <slot name="edit" :item="props.item"></slot>
                <v-layout class="ma-0">
                  <v-spacer></v-spacer>
                  <v-flex pa-0 d-flex mr-2 shrink><v-btn class="ma-0" flat @click="closeActionDrawer(props)">cancel</v-btn></v-flex>
                  <v-flex pa-0 d-flex shrink><v-btn @click="dialogActionClickFun" class="ma-0" color="primary">{{editActionLabel}}</v-btn></v-flex>
                </v-layout>
              </div>
              <div v-else-if="isDelete && !actionDrawer" class="gid-pa border-bottom">
                <div class="title pb-3">
                  <span v-if="deleteDialogTitle">{{deleteDialogTitle}}</span>
                  <span v-else>Delete {{entityType}}</span>
                </div>
                <slot name="delete" :item="props.item"></slot>
                <v-layout class="ma-0">
                  <v-spacer></v-spacer>
                  <v-flex pa-0 d-flex mr-2 shrink><v-btn class="ma-0" flat @click="closeActionDrawer(props)">cancel</v-btn></v-flex>
                  <v-flex pa-0 d-flex shrink><v-btn class="ma-0" @click="dialogActionClickFun" color="error">{{deleteActionLabel}}</v-btn></v-flex>
                </v-layout>
              </div>
              <div v-else-if="isAction && currentAction && !actionDrawer" class="gid-pa border-bottom">
                <slot :name="currentAction._slot" :item="props.item"></slot>
              </div>
              <template v-if="actionDrawer || (!isEdit && !isDelete && !isAction)">
                <div class="border-bottom" :style="{padding:$vuetify.breakpoint.smAndDown?'0':'0 20px'}">
                  <v-data-iterator :items="[props.item]" hide-actions>
                    <template #item="props">
                      <v-flex xs12 pa-0>
                        <v-card flat>
                          <v-list dense>
                            <v-list-tile v-for="(c,i) in tableCols__internal" :key="i">
                              <v-list-tile-content :style="getColumnMaxWidth" class="internal_column_header" :class="[getHeadSortClass(c), c.class]" @click="changeSortFun(c.value,pagination.sortBy,c.sortable)" :title="c.text">
                                <v-flex align-center justify-center d-flex style="overflow:hidden">
                                  <span class="header-text">{{c.text}}</span>
                                  <v-icon small v-if="c.sortable">arrow_upward</v-icon>
                                </v-flex>
                              </v-list-tile-content>
                              <v-list-tile-content  class="align-start" :style="getColumnValMaxWidth">
                                <template v-if="c.type=='Link'">
                                  <router-link :to="getItemValFun(props.item, c.href)" exact>{{ getItemValFun(props.item, c.value)}}</router-link>
                                </template>
                                <template v-else-if="c.type=='Boolean'">
                                  <v-checkbox
                                          :input-value="getItemValFun(props.item, c.value)"
                                          primary
                                          hide-details
                                          readonly
                                  ></v-checkbox>
                                </template>
                                <div v-else-if="c.type=='icon'" style="margin-left: -8px">
                                  <v-layout row align-center class="ma-0">
                                    <v-flex shrink class="pa-0">
                                      <v-avatar class="ma-1 gid-table-icon" v-if="props.item[c.value].circular">
                                        <v-btn
                                                fab
                                                small
                                                depressed
                                                :color="currentTheme === 'theme--dark'? null:'#e5e5e5'"
                                                :ripple="false"
                                                :disabled="props.item[c.value].image"
                                        >
                                          <template v-if="props.item[c.value].name">
                                            <span>{{props.item[c.value].name}}</span>
                                          </template>
                                          <template v-else-if="props.item[c.value].icon">
                                            <v-icon>{{props.item[c.value].icon}}</v-icon>
                                          </template>
                                          <template v-else-if="props.item[c.value].image">
                                            <img :src="props.item[c.value].image" alt="Avatar"/>
                                          </template>
                                        </v-btn>
                                      </v-avatar>
                                      <v-avatar tile v-else class="ma-1">
                                        <template v-if="props.item[c.value].name">
                                          <span>{{props.item[c.value].name}}</span>
                                        </template>
                                        <template v-else-if="props.item[c.value].icon">
                                          <v-icon color="secondary">{{props.item[c.value].icon}}</v-icon>
                                        </template>
                                        <template v-else-if="props.item[c.value].image">
                                          <img :src="props.item[c.value].image" alt="Avatar"/>
                                        </template>
                                      </v-avatar>
                                    </v-flex>
                                    <v-flex shrink class="pa-1">
                                      <v-layout column align-start justify-center class="ma-0">
                                        <v-flex v-if="props.item[c.value]" class="pa-0">
                                          <span class="body-2">{{props.item[c.value].title}}</span>
                                        </v-flex>
                                        <v-flex v-if="props.item[c.value].description" class="pa-0">
                                          <div>{{props.item[c.value].description}}</div>
                                        </v-flex>
                                      </v-layout>
                                    </v-flex>
                                  </v-layout>
                                </div>
                                <span v-else-if="c.type=='status'">
                                <v-layout row align-center class="ma-0">
                                  <v-flex shrink class="pa-0">
                                    <div class="status-color" :class="props.item[c.value].color"></div>
                                  </v-flex>
                                  <v-flex shrink class="pa-1">
                                    <v-layout column align-start justify-center class="ma-0">
                                      <v-flex v-if="props.item[c.value].title" class="pa-0">
                                        <span class="status-title">{{props.item[c.value].title}}</span>
                                      </v-flex>
                                      <v-flex v-if="props.item[c.value].subtitle" class="pa-0">
                                        <div class="status-subtitle">{{props.item[c.value].subtitle}}</div>
                                      </v-flex>
                                    </v-layout>
                                  </v-flex>
                                </v-layout>
                              </span>
                                <span v-else-if="c.type=='chip'">
                                <template v-for="chip in props.item[c.value]">
                                  <v-chip small :key="chip">{{chip}}</v-chip>
                                </template>
                              </span>
                                <span v-else-if="c.type=='custom'">
                                <slot :name="c.name || 'custom'" :item="{[c.value]:props.item[c.value],detail:props.item}"></slot>
                              </span>
                                <span v-else-if="c.decimal">{{getDecimalValue(getItemValFun(props.item, c.value))}}</span>
                                <span v-else-if="c.class && c.class.includes('text-tooltip')">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <span v-on="on">{{getItemValFun(props.item, c.value)}}</span>
                                  </template>
                                  <span>{{getItemValFun(props.item, c.tooltipValue)}}</span>
                                </v-tooltip>
                              </span>
                                <span v-else-if="c.timestamp">{{parseDate(getItemValFun(props.item, c.value))}}</span>
                                <v-layout class="ma-0" v-else-if="c.multicell" fill-height row>
                                  <v-flex class="pa-0 align-center justify-center" d-flex v-for="i in c.multicell"
                                          :style="`width:${c.width[i-1]}px`"
                                          :class="[Array.isArray(c.classes)?c.classes[i-1]:c.classes]" :key="i">
                                    <span v-if="Array.isArray(props.item[c.value])">{{props.item[c.value][i-1]}}</span>
                                    <span v-else-if="typeof(props.item[c.value])==='object'">{{Object.values(props.item[c.value])[i-1]}}</span>
                                  </v-flex>
                                </v-layout>
                                <span v-else>
                                <template v-if="props.item.link && props.item.link[c.value]">
                                  <a :href="props.item.link[c.value]">{{getItemValFun(props.item, c.value)}}</a>
                                </template>
                                <template v-else>{{ getItemValFun(props.item, c.value)}}</template>
                              </span>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-card>
                      </v-flex>
                    </template>
                  </v-data-iterator>
                </div>
              </template>
              <!--</v-expand-y-transition>-->
            </template>

            <template #no-results>
              <template v-if="loading">
                <tr v-for="i in (rows.length || 3)" class="border-bottom" :key="i">
                  <td v-for="(col,j) in tableCols" :key="j" v-show="col.value=='ExpandColumn'?tableCols__internal.length:true"
                      :class="['CheckBoxColumn','ExpandColumn'].includes(col.value)?'pa-0':'py-0 px-3'">
                    <template v-if="col.type == 'icon'">
                      <v-layout row class="ma-0" align-center>
                        <div class="text-line icon-shimmer"></div>
                        <div style="wdth: 150px;" class="pl-3">
                          <div class="text-line my-2" style="idth: 100px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else-if="col.type == 'chip'">
                      <div class="text-line chip-shimmer"></div>
                    </template>
                    <template v-else-if="col.type == 'status'">
                      <v-layout row class="ma-0" align-center>
                        <div class="text-line" style="idth: 3px;"></div>
                        <div style="widh: 100px;" class="pl-3">
                          <div class="text-line my-2" style="idth: 50px;"></div>
                          <div class="text-line my-2"></div>
                        </div>
                      </v-layout>
                    </template>
                    <template v-else>
                      <div class="text-line" :class="[col.value==='CheckBoxColumn'?'check-box-column-shimmer':'',
                      col.value==='ExpandColumn'?'expand-column-shimmer':'']"></div>
                    </template>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr class="border-bottom">
                  <td :colspan="tableCols.length" class="text-center pa-0">
                    <slot v-if="searchTxt.trim() != ''" name="noresults">
                      <gid-empty-state
                              flat
                              :title="`No results found for “${searchTxt}”`"
                              :description="'To widen your search, change or remove filters'"
                              :image-path="'images/empty/not-found-search.svg'"
                      ></gid-empty-state>
                    </slot>
                    <slot v-else name="nodata">
                      <gid-empty-state flat :title="noDataText"></gid-empty-state>
                    </slot>
                  </td>
                </tr>
              </template>
            </template>
            <template #footer>
              <template v-if="infiniteScroll">
                <template v-if="loading && tableRows.length">
                  <tr v-for="i in 3" :key="i" :style=" i === 1? 'border: 0;':''" :class="i===3?'border-bottom':''">
                    <td v-for="(col,j) in tableCols" :key="j" v-show="col.value=='ExpandColumn'?tableCols__internal.length:true"
                        :class="['CheckBoxColumn','ExpandColumn'].includes(col.value)?'pa-0':'py-0 px-3'">
                      <template v-if="col.type == 'icon'">
                        <v-layout row class="ma-0" align-center>
                          <div class="text-line icon-shimmer"></div>
                          <div style="widh: 150px;" class="pl-3">
                            <div class="text-line my-2" style="wdth: 100px;"></div>
                            <div class="text-line my-2"></div>
                          </div>
                        </v-layout>
                      </template>
                      <template v-else-if="col.type == 'chip'">
                        <div class="text-line chip-shimmer"></div>
                      </template>
                      <template v-else-if="col.type == 'status'">
                        <v-layout row class="ma-0" align-center>
                          <div class="text-line" style="idth: 3px;"></div>
                          <div style="widt: 100px;" class="pl-3">
                            <div class="text-line my-2" style="wdth: 50px;"></div>
                            <div class="text-line my-2"></div>
                          </div>
                        </v-layout>
                      </template>
                      <div class="text-line" v-else
                           :class="[col.value==='CheckBoxColumn'?'check-box-column-shimmer':'',
                      col.value==='ExpandColumn'?'expand-column-shimmer':'']"></div>
                    </td>
                  </tr>
                </template>
                <tr style="border:0" :class="actionDrawer?'border-top':''">
                  <td :colspan="tableCols.length">
                    <slot name="table-footer"></slot>
                  </td>
                </tr>
              </template>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

    <v-navigation-drawer
            v-model="isDrawerActive"
            right
            :dense="dense"
            app
            disable-resize-watcher
            class="help-drawer"
            v-if="actionDrawer">
      <!-- TODO: bind `isDrawerActive` with slot when `actionDrawer==='custom'` -->
      <v-toolbar flat style="background:var(--topbar-bg-color);" class="pa-0">
        <template v-if="actionDrawer==='custom' || actions">
          <slot name="actionDrawerTitle"></slot>
        </template>
        <template v-else>
          <v-toolbar-title class="subheading">
            {{getActionDialogTitle}}
          </v-toolbar-title>
        </template>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="closeActionDrawer">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider class="ma-0 pa-0"></v-divider>
      <VuePerfectScrollbar class="scroll-area">
        <div v-if="actionDrawer==='custom'">
          <slot name="actionDrawer" :item="updateModel"></slot>
        </div>
        <div v-else class="gid-pa pt-2">
          <slot v-if="isAdd" name="addNew" :item="updateModel"></slot>
          <slot v-else-if="isEdit" name="edit" :item="updateModel"></slot>
          <slot v-else-if="isDelete" name="delete" :item="updateModel"></slot>
          <template v-if="actions">
            <template v-for="(action, index) in actions">
              <div v-if="action === currentAction" class="px-4" :key="index">
                <slot
                        v-if="typeof action === 'object' && action._slot"
                        :name="action._slot"
                        :item="updateModel"></slot>
                <slot v-else :name="action" :item="updateModel"></slot>
              </div>
            </template>
          </template>
          <v-layout v-if="isAdd || isEdit || isDelete" row class="ma-0">
            <v-spacer></v-spacer>
            <v-btn flat
                   @click="closeActionDrawer"
                   class="my-0 ml-0">Cancel
            </v-btn>
            <v-btn class="ma-0"
                   :color="isDelete ? 'error': 'primary'"
                   @click="dialogActionClickFun"
                   :disabled="actionButtonDisabled"
            >{{getActionDialogButtonLabel}}
            </v-btn>
          </v-layout>
        </div>
      </VuePerfectScrollbar>
    </v-navigation-drawer>

  </v-content>
</template>

<script>
  import helper from "@/util/helper";
  import {setTimeout} from "timers";
  import moment from "moment";
  import GidCommon from '@/plugins/gid-common';
  import VuePerfectScrollbar from "vue-perfect-scrollbar";
  import GidLock from '@/components/gid-lock/gid-lock.vue';
  import GidEmptyState from '@/components/gid-empty-state/gid-empty-state.vue'

  export default {
    name: "GidTable",
    components: {VuePerfectScrollbar, GidEmptyState, GidLock},
    mixins: [GidCommon],
    props: {
      /**
       * Routes to given route on Add Button click
       */
      addEntityRoute: {},
      /**
       * Title of the table
       */
      tableName: {type: String, default: ""},
      /**
       * Table headers
       */
      cols: {type: Array, required: true},
      /**
       * Data of the table
       */
      rows: {type: Array},
      /**
       * Adds a column of checkboxes to select rows of table
       */
      checkBoxColumn: Boolean,
      /**
       * Required for continuous scrolling, either use `totalItems` or `hasNext`
       * `totalItems`: Total nummber of items in the table, default is 0
       * `hasNext`: default false
       */
      totalItems: {type: Number, default: 0},
      hasNext: Boolean,
      /**
       * If true, a refresh button will be visible in the topbar
       */
      allowRefresh: Boolean,
      /**
       * If true, topbar will be dense
       */
      dense: Boolean,
      /**
       * If true, a search bar will be visible in the topbar
       */
      allowSearch: Boolean,
      /**
       * Custom placeholder for search textfield, default is 'Search here'
       */
      searchPlaceholder: {type: String, default: "Search here"},
      /**
       * Uses live search
       */
      liveSearch: Boolean,
      /**
       * If set true, adding new item will be available as per provided `addnew` slot,
       * To set a locked state on the button provide value "locked"
       */
      allowAdd: [Boolean, String],
      /**
       * If set true, adding action will be available outside table
       * Won't work without allowAdd
       */
      allowExternalAdd: {type: Boolean, default: false},
      /**
       * If set true, edit action will be available as per provided `edit` slot,
       * To set a locked state on the button provide value "locked"
       */
      allowEdit: [Boolean, String],
      /**
       * If set true, remove action will be available as per provided `delete` slot,
       * To set a locked state on the button provide value "locked"
       */
      allowDelete: [Boolean, String],
      /**
       * Pagination size items, default is [10, 20, 50]
       */
      rowsPageSizeItems: {type: Array, default: () => [10, 20, 50]},
      /**
       * Sets pagelink true
       */
      pageLink: Boolean,
      /**
       * Hide the table actions
       */
      hideActions: Boolean,
      /**
       * Activate the table loading state
       */
      loading: Boolean,
      /**
       * Model that holds data for add, update, delete row
       */
      updateModel: {type: Object, default: () => new Object()},
      /**
       * Defines entity type for table, all action labels use this entity name
       */
      entityType: String,
      /**
       * Used to show the loading state for edit/add/delete slots
       */
      actionDialogMasking: {type: Boolean},
      actionButtonDisabled: Boolean,
      /**
       * Custom label for Add new button
       */
      addNewLabel: String,
      /**
       * Custom icon for Add new button
       */
      addNewIcon: String,
      /**
       * Custom label for Add action dialog button, default is Save
       */
      addActionLabel: {type: String, default: "Save"},
      /**
       * Custom title for Add action dialog
       */
      addDialogTitle: String,
      /**
       * Custom label for Edit action dialog button, default is Save
       */
      editActionLabel: {type: String, default: "Save"},
      /**
       * Custom title for Edit action dialog
       */
      editDialogTitle: String,
      /**
       * Custom label for Delete action dialog button, default is Delete
       */
      deleteActionLabel: {type: String, default: "Delete"},
      /**
       * Custom title for Delete action dialog
       */
      deleteDialogTitle: String,
      /**
       * To make gid-table infinte scrollable,
       * Provide number of rows to make it fixed row and self scrollable
       */
      infiniteScroll: [Boolean, String, Number],
      /**
       * Specifies the maximum number of rows for the tabel, default is 1000
       */
      maxRows: {type: Number, default: 1000},
      /**
       * Hides the header of gid-table
       */
      hideHeaders: Boolean,
      /**
       * Disables initial sort of data in table
       */
      disableInitialSort: Boolean,
      /**
       * Enables row selection if `checkBoxColumn` is not used
       */
      selectable: [Boolean, String],
      /**
       * Shows a right arrow icon when `selectable` is used
       */
      selectedIcon: Boolean,
      /**
       * Text to display when there is no data, default is 'No data available'
       */
      noDataText: {type: String, default: 'No data available'},
      /**
       * Array of action objects
       */
      actions: Array,
      /**
       * Gives a back button on table which routes to the given route
       */
      routeBack: null,
      /**
       * Gives height for toolbar extension
       */
      extensionHeight: {Number, default: 40},
      /**
       * Sets an elevation for gid table, default value is true
       */
      elevated: {type: Boolean, default: true},

      // tabFooter: Boolean,
      // dialogWidth: { type: String, default: "60%" },

      /**
       * A special drawer for all actions
       */
      actionDrawer: [Boolean, String],
      /**
       * Allows getting search from url query params
       */
      querySearch: {
        type: Boolean,
        default: true
      },
      /**
       * Custom name for query search parameter
       */
      queryParam: {
        type: String,
        default: 'search'
      },
      /**
       * Value of column to be sorted at mount, accepts object like this
       * {
       *  columnName: {nameOfColumn}
       *  descending: {true/false}
       * }
       */
      initialSort: {},
      responsiveColumns: Boolean
    },
    data() {
      return {
        tableRef:null,
        expandColumnWidth: '40px',
        checkBoxColumnWidth: '48px',
        colID: '_id',
        isToolbarExtended: false,
        isToolbarVisible: false,
        searchBtn: true,
        pagination: {},
        selectedRows: [],
        searchTxtModel: "",
        searchTxt: "",
        //any row that is expanded currently
        expandedRow: null,
        isAdd: false,
        isEdit: false,
        isDelete: false,
        isAction: false,
        currentAction: null,
        percentScrolled: 0,
        fetchingData: true,
        tableRows: [],
        tableCols: [],
        tableCols__internal: [],
        expand: false,
        isAlwaysInfinite: false,
        scrollSelf: false,
        headerHeight: 57,
        scrolling: false,
        /**
         * Toggle actionDrawer open/close externally for custom slot
         */
        isDrawerActive: false
      };
    },
    methods: {
      reduceColID(e){
        return Object.keys(e).reduce((i, j)=> {
          return j == this.colID ? i : Object.assign(i, {[j]: e[j]})
        }, {})
      },
      expandRow(type, props, actionName){
        /**
         * @type: 'icon'/'add'/'edit'/'delete'/'action'
         * @props: {
         *  item:{}, //contains value for all columns [tableCols + tableCols__internal]
         *  index: Number,
         *  selected:Boolean,
         *  expanded:Boolean
         * }
         * @actionName: Action in `actions` arrray
         */
        if (type == 'add') {
          this.isAdd = true;
          this.isDrawerActive = this.actionDrawer ? true : false;
          if (this.isDrawerActive) {
            this.isEdit = false;
            this.isDelete = false;
            this.isAction = false;
          }
        }
        else if (type == 'icon') {
          if (!this.actionDrawer) {
            this.isEdit = false;
            this.isDelete = false;
            this.isAction = false;
            this.currentAction = null;
          }

          if (props.item.isEdit) {
            props.item.isEdit = false;
            this.expandedRow = props.item;
            props.expanded = true;
          } else if (this.isEdit && this.expandedRow !== props.item) {
            this.tableRows.forEach(r=> delete r.isEdit);
            this.expandedRow = props.item;
            props.expanded = true;
          } else if (props.item.isDelete) {
            props.item.isDelete = false;
            this.expandedRow = props.item;
            props.expanded = true;
          } else if (this.isDelete && this.expandedRow !== props.item) {
            this.tableRows.forEach(r=> delete r.isDelete);
            this.expandedRow = props.item;
            props.expanded = true;
          } else if (props.item.isAction) {
            props.item.isAction = false;
            this.expandedRow = props.item;
            props.expanded = true;
          } else if (this.isAction && this.expandedRow !== props.item) {
            this.tableRows.forEach(r=> delete r.isAction);
            this.expandedRow = props.item;
            props.expanded = true;
          } else {
            props.expanded = !props.expanded;
            this.expandedRow = props.expanded ? props.item : null;
          }
        }
        else if (type == 'edit') {
          this.isEdit = true;
          this.isAdd = false;
          this.isDelete = false;
          this.isAction = false;
          if (this.actionDrawer)this.isDrawerActive = true;
          else {
            this.expandedRow = props.item;
            this.isDrawerActive = false;
            props.expanded = true;
          }
          this.editItem(props.item);
        }
        else if (type == 'delete') {
          this.isDelete = true;
          this.isAdd = false;
          this.isEdit = false;
          this.isAction = false;
          if (this.actionDrawer) {
            this.isDrawerActive = true;
          }
          else {
            this.expandedRow = props.item;
            this.isDrawerActive = false;
            props.expanded = true;
            this.isAdd = false;
          }
          this.deleteItem(props.item);
        }
        else if (type == 'action') {
          this.isEdit = false;
          this.isDelete = false;
          this.isAction = false;
          this.tableRows.forEach(r=> delete r.isEdit && delete r.isDelete);
          this.onActionClicked(actionName, props)
        }
      },
      closeActionDrawer(p = {}){
        if (this.actionDrawer) {
          this.isDrawerActive = false;
          this.isAdd = false;
          this.isEdit = false;
          this.isDelete = false;
          this.isAction = false;
          this.tableRows.forEach(r=> {
            delete r.isEdit;
            delete r.isDelete;
          });
        } else if (this.isEdit || this.isDelete || this.isAction) {
          this.tableRows.forEach(r=> {
            delete r.isEdit;
            delete r.isDelete;
            delete r.isAction;
          });
          p.expanded = false;
          this.isEdit = false;
          this.isDelete = false;
          this.isAction = false;
          this.expandedRow = null;
        }
      },
      getToggleBtnStyle(col, values, idx){
        return idx === values.length - 1 ? '' : 'margin-right:-1px;';
      },
      updateRowSelection(el) {
        this.selectedRows = [
          ...this.tableRows.filter(e => e._selected === true)
        ];
        if (event.type === "click" && this.$listeners['checkbox-clicked']) {
          /**
           * Emits corresponding row when checkbox is clicked
           * @type {Object}
           */
          this.$emit('checkbox-clicked', this.reduceColID(el))
        }
      },
      getCellClass(item, columnName){
        if (item.class && item.class[columnName])
          return item.class[columnName]
        return ''
      },
      getDecimalValue(val) {
        if (typeof val === typeof 1) {
          return Number(val).toFixed(2);
        }
        return val;
      },
      toggleAllCBColFun() {
        if (this.selectedRows.length) this.selectedRows = [];
        else this.selectedRows = this.tableRows.slice();
        this.tableRows.forEach(e=>e._selected = this.selectedRows.length > 0);
      },
      onSearchBtnClick() {
        this.searchBtn = false;
        this.$nextTick(() => setTimeout(()=> {
          this.$refs.searchBox.focus()
        }, 0));
      },
      changeSortFun(col, pgCol, sortable) {
        if (this.loading || !sortable) return;
        if (this.infiniteScroll) {
          this.pagination.page = 1;
          this.tableRows = [];
        }
        if (this.pagination.sortBy == col)
          this.pagination.descending = !this.pagination.descending;
        else this.pagination.sortBy = col;
      },
      getHeadSortClass(header) {
        let classes = "column ";
        classes += header.sortable? "sortable " + (this.pagination.descending ? "desc " : "asc "): "";
        classes += header.value === this.pagination.sortBy ? "active " : "";
        return classes;
      },
      getItemValFun(item, col) {
        return helper.getItemVal(item, col);
      },
      updateSearchTxtFun(e) {
        this.isDrawerActive = false;

        if (this.searchTxt == this.searchTxtModel.trim()) return;

        this.searchTxt = this.searchTxtModel.trim();

        if (this.$listeners["load-data"]) {
          this.refresh(null);
        }
        this.updateQuerySearch(true, this.searchTxt);
      },
      refresh(e) {
        this.tableRows = [];
        this.isDrawerActive = false;
        // on refresh button click: nullify (not consider search txt)
        // & equate (effect of nullify: block api call on txt change)
        // both searchTxt and searchTxtModel
        if (this.searchTxtModel.trim().length && e != null) {
          this.searchTxt = "";
          this.searchTxtModel = ""; // calls watch of searchTxtModel
        }
        if (this.pagination.page != 1) this.pagination.page = 1;
        else {
          this.pagination.page = undefined;
          this.pagination.page = 1;
        }
        this.updateQuerySearch(true, '');
        this.closeActionDrawer();
      },
      cellClickFun(item, col, e) {
        if(col=='ExpandColumn')return;
        if ([...e.currentTarget.classList].includes('clickAbleCell'))
          /**
           * Emits selected cell if the column of the cell is clickable
           * @type {Object}
           */
          this.$emit("cell-selected", {
            value: this.reduceColID(item),
            id: this.getItemValFun(item, this.colID),
            column: col
          });
        else {
          /**
           * Emits the selected row
           * @type {Object}
           */
          this.$emit("row-selected", this.reduceColID(item));
        }
        if (this.selectable && !this.checkBoxColumn) {
          this.selectedRows = [item];
          this.tableRows.forEach(e=>e._selected = false);
          item._selected = true;
        }
      },
      addNewClickFun() {
        if (this.addEntityRoute) {
          this.$router.push(this.addEntityRoute);
        } else {
          if (!this.allowExternalAdd) {
            this.expandRow('add')
          }
        }
        /**
         * Emits event on add button click
         */
        this.$emit("add-button-click");
      },
      editItem(item) {
        this.updateModel = {...item};
        this.tableRows.forEach(row=> {
          delete row.isEdit;
          delete row.isDelete;
        })
        item.isEdit = true;
        /**
         * Emits event on edit icon click
         */
        this.$emit("edit-icon-click", this.reduceColID(this.updateModel));
      },
      deleteItem(item) {
        this.updateModel = {...item};
        this.tableRows.forEach(row=> {
          delete row.isEdit;
          delete row.isDelete;
        })
        item.isDelete = true;
        /**
         * Emits event on delete icon click
         */
        this.$emit("delete-icon-click", this.reduceColID(this.updateModel));
      },
      dialogActionClickFun(e) {
        if (this.isAdd) {
          /**
           * Emits the updated model on add button click
           * @type {Object}
           */
          this.$emit("saveNewRecord", this.reduceColID(this.updateModel));
        }
        else if (this.isEdit) {
          /**
           * Emits the updated model on edit button click
           * @type {Object}
           */
          this.$emit("saveModifiedRecord", this.reduceColID(this.updateModel));
        }
        else if (this.isDelete) {
          /**
           * Emits the updated model on delete button click
           * @type {Object}
           */
          this.$emit("deleteRecord", this.reduceColID(this.updateModel));
        }
      },
      onActionClicked: function (action, props) {
        if (action._locked === true) return;
        this.updateModel = {...props.item};
        this.currentAction = action;
        props.item.isAction = true;
        if ((typeof action === 'object' && action._slot) || typeof action === 'string') {
          this.isAction = true;
          this.expandedRow = props.item;
          props.expanded = true;
        }
        if (this.$listeners['action-click']) {
          /**
           * Emits the action and the row item
           * @type {Object}
           */
          this.$emit('action-click', {
            action: action,
            details: this.reduceColID(props.item)
          })
        }
      },
      getHeaderStyles(_h, cols, idx){return;
        this.$nextTick(()=>{setTimeout(()=>{
          let ths = this.$refs[this.tableRef].$el.querySelector('thead tr').querySelectorAll('th');
          if(!cols || !cols[idx])return;
          switch (_h) {
            case 'header':
              ths[idx].style.textAlign=(cols[idx].align || '').length?cols[idx].align:'left';
              ths[idx].style.overflow='hidden';
              if('ExpandColumn'==cols[idx].value){
                ths[idx].style.padding=0;
                ths[idx].style.width=this.expandColumnWidth;
                ths[idx].style.maxWidth=this.expandColumnWidth;
                ths[idx].style.minWidth=this.expandColumnWidth;
              }
              else if('CheckBoxColumn'==cols[idx].value){
                ths[idx].style.padding=0;
                ths[idx].style.width=this.checkBoxColumnWidth;
                ths[idx].style.maxWidth=this.checkBoxColumnWidth;
                ths[idx].style.minWidth=this.checkBoxColumnWidth;
              }
              else{
                if((this.tableRows || []).length)ths[idx].style.maxWidth=(cols[idx].hasOwnProperty('maxWidth'))?parseInt(cols[idx].maxWidth)+'px':ths[idx].getBoundingClientRect().width+'px';
              }
              break;
            case 'text':
              if(ths[idx].querySelector('.header--text')){
                ths[idx].querySelector('.header--text').style.maxWidth=(ths[idx].querySelector('.header--text').parentElement.getBoundingClientRect().width-(cols[idx].sortable?16:0))+'px';
                ths[idx].querySelector('.header--text').style.overflow='hidden';
                ths[idx].querySelector('.header--text').style.textOverflow='ellipsis';
                ths[idx].querySelector('.header--text').style.whiteSpace='nowrap';
                ths[idx].querySelector('.header--text').style.display='inline-block';
                ths[idx].querySelector('.header--text').style.transform='translateY(12%)';
              }
              break;
            default:
              break;
          }
        },1000)})
      },
      cropColumns(){
        if (!this.responsiveColumns || this.hideHeaders)return;
        this.$nextTick(()=>{setTimeout(()=>{
          let tableContainer=this.$refs[this.tableRef].$el.querySelector('.v-table__overflow');
          let maxWidth = tableContainer.getBoundingClientRect().right;
          let table=this.$refs[this.tableRef].$el.querySelector('table.v-datatable');
          let tableWidth = table.getBoundingClientRect().right;
          let ths = this.$refs[this.tableRef].$el.querySelector('thead tr').querySelectorAll('th');
          let tds = this.$refs[this.tableRef].$el.querySelector('tbody tr.border-bottom').querySelectorAll('td');
          if(tds.length==ths.length && ths.length==this.tableCols.length){
            if(tableWidth>maxWidth) {
              let firstIdx=1;
              if(this.checkBoxColumn)firstIdx++;
              if(this.responsiveColumns)firstIdx++;
              for (let i = ths.length - 1; i >= firstIdx; i--) {
                if (ths[i].getBoundingClientRect().right > maxWidth) {
                  let colIdx = this.tableCols.length;
                  if(this.tableCols[colIdx-1].value==='AllowSelectable')colIdx--;
                  if(this.tableCols[colIdx-1].value==='ActionColumn')colIdx--;

                  if(colIdx>firstIdx) {
                    this.tableCols[colIdx - 1].cropBreakPoint = maxWidth;
                    this.tableCols[colIdx - 1].cropWidth = ths[i].getBoundingClientRect().width;
                    this.tableCols__internal.unshift(...this.tableCols.splice(colIdx - 1, 1));
                  }
                }
              }
            }else{
              for (let i = 0;i<this.tableCols__internal.length; i++) {
                if (this.tableCols__internal[i].hasOwnProperty('cropBreakPoint') && this.tableCols__internal[i].cropBreakPoint< maxWidth) {
                  let colIdx=this.tableCols.length;
                  if (this.tableCols[colIdx-1].value === 'AllowSelectable') colIdx--;
                  if (this.tableCols[colIdx-1].value === 'ActionColumn') colIdx--;
                  this.tableCols.splice(colIdx, 0, this.tableCols__internal.shift())
                }
              }
            }
          }
        },300)})
      },
      scrolledVertical(e) {
        if (!this.infiniteScroll || this.fetchingData) return;
        if (this.usingHasNext) {
          if (!this.hasNext)return;
        } else if (this.tableRows.length >= this.totalItems)return;
        if (this.scrollSelf) {
          if (this.scrolling)return;
          this.scrolling = true;
          if (parseInt(($('#' + this.tableRef).scrollTop() / ($('#' + this.tableRef)[0].scrollHeight - $('#' + this.tableRef).height())) * 100) > 50) {
            if (this.tableRows.length > this.maxRows && !this.isAlwaysInfinite) return;
            else this.pagination.page++;
          }
          this.scrolling = false;
        } else {
          let h = document.documentElement, b = document.body, st = "scrollTop", sh = "scrollHeight";
          h = parseInt(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);
          if (h > 60) {
            if (this.tableRows.length > this.maxRows && !this.isAlwaysInfinite) return;
            else this.pagination.page++;
          }
        }
      },
      openSearchBox: function () {
        this.$refs.searchButton.$el.click();
        this.$refs.searchButton.$el.scrollIntoView({
          inline: "start",
          behavior: "smooth",
          block: "start"
        });
      },
      alwaysInfinite: function () {
        this.isAlwaysInfinite = true;
        this.pagination.page++;
      },
      getColumnCustomClass(item, value){
        //override this method to customize cell
        //TODO: remove this in future
      },
      updateQuerySearch(set = false){
        if (this.querySearch && this.allowSearch) {
          if (set) {
            this.setQueryParams(Object.assign(
                    this.$route.query,
                    {[this.queryParam]: this.searchTxt}
            ))
          } else {
            let searchTerm = this.getQueryParams()[this.queryParam] || null;
            if (searchTerm) {
              // setTimeout(()=>{
              this.onSearchBtnClick();
              this.searchTxtModel = searchTerm;
              this.updateSearchTxtFun();
              // },300)
            }
          }
        }
      }
    },
    created(){
      this.tableRef = 'defGrid_' + Date.now();
    },
    mounted: function () {
      this.isToolbarVisible = (this.tableName || this.allowAdd || this.allowSearch || this.allowRefresh || this.$slots.description) ? true : false;
      this.isToolbarExtended = (this.$slots.description && this.tableName) ? true : false;
      if (this.infiniteScroll) {
        if (!isNaN(parseInt(this.infiniteScroll)))this.scrollSelf = true;
        if (!this.allowSearch) this.isAlwaysInfinite = true;
        let b = document.body,
                sh = "scrollHeight",
                topbarHeight = 64,
                rowHeight = 50;
        this.rowsPerPage = this.scrollSelf ? parseInt(this.infiniteScroll) : parseInt((b[sh] - topbarHeight) / rowHeight);
        this.pagination.rowsPerPage = this.rowsPerPage;
      }
      this.updateQuerySearch();
      if (this.initialSort && this.initialSort.hasOwnProperty('columnName') && this.initialSort.hasOwnProperty('descending')) {
        this.pagination.sortBy = this.initialSort.columnName;
        this.pagination.descending = this.initialSort.descending;
      }
      setTimeout(()=>{this.cropColumns()},500)
    },
    watch: {
      searchTxtModel: function (newV, oldV) {
        if (this.liveSearch) this.updateSearchTxtFun(null);
        else if (!this.$listeners["load-data"])
          this.searchTxt = this.searchTxtModel;
      },
      pagination: {
        handler(newV, oldV) {
          this.fetchingData = true;
          /**
           * Emits the pagination object when page is changed
           * @type {Object}
           */
          this.$emit("load-data", Object.assign({}, this.reduceColID(newV), {searchTxt: this.searchTxt}));
        },
        deep: true
      },
      //watch of check-box-column-selection-table
      selectedRows: function (newV, oldV) {
        /**
         * Emits all the  selected rows in table
         * @type {Array}
         */

        this.$emit("selection-change", [...newV.map(e=>this.reduceColID(e))]);
      },
      //on hiding of action-dialog reinitialize flags
      isRowExpanded: function (newV, oldV) {
        if (!newV[0]) {
          setTimeout(() => {
            //this.isEdit = false;
            //this.isDelete = false;
            //this.isAction = false;
            //this.actionDialogButtonDisabled = false;
            //this.actionDialogMasking = false;
          }, 250);
          /**
           * Emits when action dialog closes
           */
          this.$emit('dialog-close');
        } else {
          /**
           * Emits when action dialog opens
           */
          this.$emit('dialog-open');
        }
      },
      isDrawerActive: function (newV) {
        if (!newV) {
          //this.isRowExpanded = [false];
        }
      },
      //Masking: On stop of mask in action-dialog, enable action-dialog's action-button and hide action-dialog
      actionDialogMasking: function (newV, oldV) {
        if (!newV && !!oldV) {
          // masking is completed
          //this.actionDialogButtonDisabled = false;
          //this.isRowExpanded = [false];
          this.isDrawerActive = false;
        }
      },
      cols: {
        handler: function (n) {
          let _cols = [{text: '',value: 'ExpandColumn', sortable: false, align: 'right'}]
          if(this.checkBoxColumn)_cols.push({text:'', value:'CheckBoxColumn', sortable:false})
          _cols.push(...n)
          if (this.allowEdit || this.allowDelete || this.actions) {
            if (!_cols.find(e => e.text === "Actions"))
              _cols.push({text: "Actions", align: "right", sortable: false, value: "ActionColumn"})
          }
          if (this.selectable && this.selectedIcon) {
            _cols.push({text: "", align: "right", sortable: false, value: "AllowSelectable"})
          }

          this.tableCols = [..._cols]
        },
        deep: true,
        immediate: true
      },
      rows: {
        handler: function (n) {
          if (this.infiniteScroll) {
            if (!this.fetchingData) return;
            if (this.usingHasNext) {
              if (!this.hasNext)return;
            }
            else if (this.tableRows.length >= this.totalItems)return;
            this.tableRows.push(...n.filter(e => !this.tableRows.includes(e)))
          } else {
            this.tableRows = [...n];
          }
          this.tableRows.forEach((v, i)=>v._id = i)
          this.fetchingData = false;
          if (this.checkBoxColumn || this.selectable)
            this.selectedRows = ([...this.tableRows.filter(e=>e._selected === true)])
        },
        deep: true,
        immediate: true
      },
    },
    computed: {
      getColumnMaxWidth(){
        let width = this.tableCols__internal.map(e=>e.cropWidth).reduce((i, j)=> {
                  return Math.max(i, j)
                }, []) + 'px';
        return this.$vuetify.breakpoint.xs ? {flex: 1} : {maxWidth: width, width: width}
      },
      getColumnValMaxWidth(){
        if (this.$vuetify.breakpoint.xs)return {flex: 1}
      },
      getExpandIcon(){
        return props=> {
          if (this.actionDrawer) {
            return props.expanded ? 'remove' : 'add'
          } else {
            if (this.isEdit || this.isDelete || this.isAction)return 'add'
            return props.expanded ? 'remove' : 'add'
          }
        }
      },
      expandIconToggle(){
        return props=> {
          if (this.actionDrawer) {
            return props.expanded ? false : true
          } else {
            if (this.isEdit || this.isDelete || this.isAction)return true
            return props.expanded ? false : true
          }
        }
      },
      isRowExpandable(){
        if ((this.tableCols__internal || []).length > 0)return true;
        if (!this.actionDrawer && (this.isEdit || this.isDelete || this.isAction))return true;
        return false;
      },
      usingHasNext() {
        return (this.$options.propsData.hasOwnProperty('hasNext')) &
                (typeof this.$options.propsData.hasNext !== typeof undefined) &
                ('hasNext' in this.$options.propsData)
      },
      currentTheme() {
        return this.$store
                ? this.$store.getters.currentTheme.class
                : "theme--light";
      },
      parseDate: function () {
        return val =>
                val && val != -1 ? moment(val).format("YYYY-MM-DD HH:mm") : "-";
      },
      computedTableName() {
        return (this.tableName && this.tableName.length) || "";
      },
      /*pages() {
       if (!this.pageLink) return;
       if (
       this.pagination.rowsPerPage == null ||
       this.pagination.totalItems == null
       )
       return 0;

       return Math.ceil(
       this.pagination.totalItems / this.pagination.rowsPerPage
       );
       },*/
      getActionDialogTitle() {
        if (this.isEdit) return this.editDialogTitle || "Edit " + (this.entityType || '');
        else if (this.isAdd) return this.addDialogTitle || "Add new " + (this.entityType || '');
        else if (this.isDelete) return this.deleteDialogTitle || "Delete " + (this.entityType || '');
        return '';
      },
      getActionDialogButtonLabel() {
        var txt = "";
        if (this.isEdit) txt = this.editActionLabel;
        else if (this.isAdd) txt = this.addActionLabel;
        else if (this.isDelete) txt = this.deleteActionLabel;
        return txt;
      }
    }
  }
</script>

<style scoped>
  .gid-table .elevation-1 {
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12) !important;
  }

  .gid-table .help-drawer {
    margin-top: 80px !important;
    height: calc(100vh - 80px) !important;
    padding-top: 0 !important;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12) !important;
  }

  .help-drawer >>> .v-navigation-drawer__border {
    display: none;
  }

  .gid-table .scroll-area {
    height: calc(100vh - 81px - 64px) !important;
    position: relative;
  }

  .gid-table .selectable {
    cursor: pointer;
  }

  .unclickable {
    pointer-events: none;
    color: #c5c5c5;
  }

  .gid-table .selected-icon {
    padding-left: 0 !important;
  }

  .gid-table .tabColHead {
    display: inline;
  }

  .gid-table .clickAbleCell {
    text-decoration: none;
    color: #0c7bbe;
    cursor: pointer;
  }

  @-webkit-keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  .gid-table .text-line {
    -webkit-animation-duration: 1.25s;
    animation-duration: 1.25s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-name: placeHolderShimmer;
    animation-name: placeHolderShimmer;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    background: #f6f6f6;
    background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
    background-size: 800px 104px;
    position: relative;
    height: 10px;
    width: 100%;
    margin: 4px 0;
  }

  .icon-shimmer {
    height: 40px !important;
    width: 40px !important;
    margin: 8px 0 !important;
    border-radius: 50px !important;
  }

  .chip-shimmer {
    height: 24px !important;
    border-radius: 50px !important;
  }

  .gid-table .theme--dark .text-line {
    background: rgba(255, 255, 255, 0.12);
    background: linear-gradient(to right, rgba(230, 230, 230, 0.12) 8%, rgba(255, 255, 255, 0.12) 18%, rgba(230, 230, 230, 0.12) 33%);
  }

  .gid-table .editBtn:hover {
    color: var(--topbar-text-color) !important;
  }

  .gid-table .deleteBtn:hover {
    color: var(--topbar-text-color) !important;
  }

  .theme--light.v-divider.action-card-border {
    border-color: rgba(0, 0, 0, .21) !important;
  }

  .theme--dark.v-divider.action-card-border {
    border-color: rgba(255, 255, 255, .21) !important;
  }

  .gid-table >>> .v-datatable__actions {
    border-top: 0 !important;
  }

  .action-drawer-table >>> .v-datatable__actions {
    border-top: 1px solid rgba(0, 0, 0, .12) !important;
  }

  .gid-table .status-color {
    width: 2px;
    height: 10px;
    margin: 0px 10px 0px 2px;
  }

  .gid-table .status-title {
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    letter-spacing: 0.01em;
  }

  .gid-table .status-subtitle {
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.01em;
  }

  .gid-table .gid-table-icon >>> .v-btn {
    pointer-events: none !important;
  }

  .gid-table td.text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .gid-checkbox >>> .v-input--selection-controls__input {
    margin-right: 0 !important;
  }

  .dense-toolbar-title {
    font-size: 16px !important;
  }
  .internal_column_header.sortable{
    cursor: pointer;
  }
  .internal_column_header.sortable .v-icon{color: transparent;margin-bottom:1px;}
  .internal_column_header.sortable:hover .v-icon{
    color: rgba(0,0,0,0.38);
  }
  .internal_column_header.active .v-icon {
    color: rgba(0,0,0,0.87) !important;
  }
  .internal_column_header.active.desc .v-icon {
    transform: rotate(-180deg);
  }
  .gid-table .text-line.check-box-column-shimmer{
    margin:0 auto;
    height:20px;
    width:20px;
  }
  .gid-table .text-line.expand-column-shimmer{
    margin-left: auto;
    margin-right: 0;
    width: 20px;
  }
  .v-datatable__progress {display:none !important;}

</style>