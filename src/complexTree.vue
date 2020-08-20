<template>
  <div class="c-json-line">
    <p
      :class="`c-json-p c-line-${lineType}`"
      @click="setVisiable"
      :style="getIndent(level)"
    >
      <span class="c-json-mark">{{ line }}</span>
      <span :class="`c-of-${lineType}`"></span>
      <span class="c-json-content">
        <span v-if="showIndex" class="c-json-key">{{ name }}: </span>
        <span class="c-json-pt">{{ isArray(type) ? '[' : '{' }}</span>
      </span>
      <span v-show="!visiable" class="c-json-pt"
        >{{ isArray(type) ? '...]' : '...}' }}{{ needComma ? ',' : '' }}</span
      >
    </p>
    <div :style="{ display: visiable ? 'block' : 'none' }">
      <slot v-for="(item, index) in value">
        <Component
          :is="needFormat(item.type) ? 'self' : 'NormalTree'"
          :key="index"
          :level="level + 1"
          :name="item.name"
          :value="item.value"
          :type="item.type"
          :line="item.line"
          :showIndex="item.showIndex"
          :needComma="item.needComma"
          :lineType="item.lineType"
          :lastLineType="item.lastLineType"
          :lastLine="item.lastLine"
        />
      </slot>
      <p
        class="c-json-feet"
        :class="`c-json-p c-line-${lineType}`"
        :style="getIndent(level)"
      >
        <span v-if="lastLine" class="c-json-mark">{{ lastLine }}</span>
        <span v-if="lastLineType" :class="`c-of-${lastLineType}`"></span>
        <span class="c-json-pt"
          >{{ isArray(type) ? ']' : '}' }}{{ needComma ? ',' : '' }}</span
        >
      </p>
    </div>
  </div>
</template>
<script>
import { isArray, getIndent, getType, needFormat } from './utils.js';
import NormalTree from './normalTree.vue';
export default {
  name: 'self',
  props: {
    name: [String, Number],
    value: [Array, String],
    type: String,
    line: Number,
    showIndex: Boolean,
    needComma: Boolean,
    level: {
      default: 1,
    },
    lineType: String,
    lastLineType: String,
    lastLine: {
      default: null,
    },
  },
  components: {
    NormalTree,
  },
  data() {
    return {
      visiable: true,
    };
  },
  methods: {
    setVisiable() {
      this.visiable = !this.visiable;
    },
    isArray: isArray,
    getIndent: getIndent,
    getType: getType,
    needFormat: needFormat,
  },
};
</script>
