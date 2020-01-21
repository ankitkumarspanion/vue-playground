<template>
    <div
        class="gid-search-wrapper"
        :class="!searchBtn ? 'mr-2' : ''"
        :style="
            !searchBtn
                ? `border-color: ${
                      $vuetify.theme.dark ? '#ffffff' : 'rgb(0,0,0,0.60)'
                  };`
                : ''
        "
    >
        <VuePerfectScrollbar class="gid-search-scroll-area">
            <div class="gid-search-flex gid-search-container">
                <v-btn
                    icon
                    :width="38"
                    :height="38"
                    v-if="searchBtn"
                    :disabled="disabled"
                    @click="searchBtn = false"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <template v-else>
                    <div
                        v-if="selectedOptions.length"
                        class="gid-search-flex gid-search--chip-text"
                    >
                        <v-chip
                            label
                            small
                            v-for="(option, i) in selectedOptions"
                            :key="i"
                            class="mr-1"
                        >
                            <v-icon left class="pl-3" v-if="option.icon">{{
                                option.icon
                            }}</v-icon>
                            <span
                                :class="[
                                    option.text ? 'pr-3' : '',
                                    !option.icon ? 'pl-3' : '',
                                ]"
                                >{{ option.label }}</span
                            >
                            <v-chip
                                small
                                label
                                close
                                class="mr-n3"
                                color="rgba(0,0,0,0.12)"
                                v-if="option.text"
                                @click:close="handleOptionClose(option)"
                            >
                                <span class="pl-3">{{ option.text }}</span>
                            </v-chip>
                        </v-chip>
                    </div>
                    <v-menu
                        eager
                        :nudge-bottom="44"
                        ref="gidsearchmenu"
                        :close-on-content-click="false"
                        transition="slide-y-transition"
                        content-class="gid-search-dropdown"
                    >
                        <template #activator="{ on }">
                            <v-text-field
                                v-on="on"
                                flat
                                solo
                                dense
                                single-line
                                hide-details
                                ref="searchBox"
                                :disabled="disabled"
                                v-model="searchTxtModel"
                                :placeholder="placeholder"
                                class="search-txt-flexible"
                                @click.stop="toggleMenu(true)"
                                @keyup.enter="updateSearchModel(false)"
                                @keydown.stop="handleKeydown"
                                @focus.stop="onSearchFocus"
                                @blur.stop="onSearchBlur"
                            >
                                <template #append>
                                    <v-icon
                                        @click.stop="clear()"
                                        class="search-icon-close"
                                        >mdi-cancel</v-icon
                                    >
                                </template>
                            </v-text-field>
                        </template>
                        <v-list dense class="py-0">
                            <template v-if="!optionJustSelected">
                                <template
                                    v-for="(val, index) in filteredOptions"
                                >
                                    <v-list-item
                                        :key="index"
                                        link
                                        @click="handleOptionClick(val)"
                                    >
                                        <v-list-item-icon
                                            v-if="val.icon"
                                            :key="index"
                                            class="mr-4"
                                        >
                                            <v-icon>{{ val.icon }}</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>{{
                                            val.label
                                        }}</v-list-item-title>
                                    </v-list-item>
                                </template>
                            </template>
                        </v-list>
                    </v-menu>
                </template>
            </div>
        </VuePerfectScrollbar>
        <div
            v-show="!searchBtn"
            class="gid-search-border"
            :class="focused ? 'expand' : ''"
        ></div>
    </div>
</template>
<script>
/* eslint-disable no-console */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
    name: 'GidSearchToggle',
    components: {
        VuePerfectScrollbar,
    },
    data() {
        return {
            searchTxtModel: '',
            searchTxt: '',
            keyList: {
                last: 0,
                second: 0,
            },
            focused: false,
            searchBtn: true,
            selectedOptions: [],
            optionJustSelected: false,
        };
    },
    props: {
        placeholder: { type: String, default: 'Search here' },
        disabled: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        options: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    computed: {
        filteredOptions() {
            return this.options
                .filter((o) =>
                    o.label
                        .toLowerCase()
                        .includes(this.searchTxtModel.toLowerCase())
                )
                .filter(
                    (value) =>
                        this.selectedOptions.findIndex(
                            (o) => value.key === o.key
                        ) < 0
                );
        },
    },
    watch: {
        searchBtn: {
            handler(n, o) {
                this.$emit('search-btn', n);
                if (!n && n != o) {
                    this.focusSearch();
                }
            },
            immediate: true,
        },
    },
    methods: {
        onSearchFocus() {
            this.focused = true;
        },
        onSearchBlur() {
            this.focused = false;
        },
        handleOptionClick(val) {
            if (!this.multiple) {
                this.selectedOptions = [];
            }
            this.selectedOptions.push({ ...val, text: '' });
            this.optionJustSelected = true;
            this.searchTxtModel = '';
            this.focusSearch();
        },
        handleOptionClose(currOption) {
            this.selectedOptions = this.selectedOptions.filter(
                (o) => o.key !== currOption.key
            );
            this.optionJustSelected = false;
            this.focusSearch();
            this.emitSearchData();
        },
        handleKeydown(e) {
            if (e) {
                this.keyList.second = this.keyList.last;
                this.keyList.last = e.keyCode;
                switch (e.keyCode) {
                    case 8:
                        if (e.ctrlKey) {
                            this.searchTxt = '';
                            this.searchTxtModel = '';
                            this.selectedOptions = [];
                            this.emitSearchData();
                        } else {
                            this.updateSelectedOptions(false);
                        }
                        this.focusSearch();
                        break;
                    case 9:
                        this.updateSearchModel(true);
                        this.focusSearch();
                        break;
                    case 27:
                        this.toggleMenu(false);
                        break;
                    default:
                        break;
                }
            }
        },
        updateSearchModel(tab = false) {
            if (this.optionJustSelected && this.searchTxtModel) {
                this.updateSelectedOptions();
                this.optionJustSelected = false;
            } else {
                if (!(this.searchTxt == this.searchTxtModel)) {
                    this.searchTxt = this.searchTxtModel;
                    this.emitSearchData();
                    return;
                }
            }
            let lastOption = this.selectedOptions[
                this.selectedOptions.length - 1
            ];
            if (!tab && lastOption && lastOption.text) {
                this.emitSearchData();
            }
        },
        updateSelectedOptions(add = true) {
            let selectedOptionLength = this.selectedOptions.length;
            if (add) {
                let index = this.multiple ? selectedOptionLength - 1 : 0;
                this.selectedOptions[index].text = this.searchTxtModel;
                this.searchTxtModel = '';
            } else {
                if (selectedOptionLength && !this.searchTxtModel) {
                    let popedOption = this.selectedOptions.pop();
                    this.optionJustSelected = false;
                    this.searchTxt = '';
                    if (popedOption.text) {
                        this.emitSearchData();
                    }
                }
            }
        },
        emitSearchData() {
            let data = {
                default: this.searchTxt || '',
            };
            if (this.selectedOptions.length) {
                this.selectedOptions.forEach((option) => {
                    if (option.key) {
                        data[option.key] = option.text || '';
                    }
                });
                this.$emit('search', data);
            } else {
                this.$emit('search', data.default);
            }
        },
        focusSearch() {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.searchBox) {
                        this.$refs.searchBox.focus();
                        this.toggleMenu(true);
                    }
                }, 0);
            });
        },
        toggleMenu(val) {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (this.$refs.gidsearchmenu) {
                        this.$refs.gidsearchmenu.isActive = val;
                    }
                }, 0);
            });
        },
        clear() {
            this.focused = false;
            this.searchTxt = '';
            this.searchTxtModel = '';
            this.selectedOptions = [];
            this.optionJustSelected = false;
            this.searchBtn = !this.searchBtn;
            this.emitSearchData();
        },
    },
};
</script>
<style scoped>
.search-icon {
    font-size: 22px !important;
}
.search-txt-flexible {
    margin-top: 0px;
    padding-top: 0px;
    min-width: 200px;
}
.search-icon-close {
    font-size: 22px;
    margin-top: -3px;
    cursor: pointer;
}
.search-icon-close--large {
    margin-top: 0px;
}
.search-txt-flexible.v-input--is-focused i {
    color: #42aaee;
}
.search-txt-flexible >>> .v-input__slot {
    padding: 0px !important;
}
.gid-search-wrapper {
    border-bottom: 1px solid transparent;
    box-sizing: border-box;
}
.gid-search-container {
    max-width: 600px;
    height: 38px;
}
.gid-search-dropdown {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}
.gid-search-border {
    z-index: 2;
    width: 0%;
    height: 2px;
    margin: 0 auto;
    margin-bottom: -1px;
    will-change: width;
    background: #42aaee;
    transition: width 0.25s ease-in-out;
}
.gid-search-border.expand {
    width: 100%;
    transition: width 0.25s ease-in-out;
}
.gid-search--chip-text >>> .v-chip {
    padding-left: 0px !important;
    margin: 2px 0px;
}
.gid-search-flex {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    flex-direction: row;
}
</style>
