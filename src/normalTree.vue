<template>
  <p :class="`c-json-p c-line-${lineType}`" :style="getIndent(level)">
    <span class="c-json-mark">{{ line }}</span>
    <span :class="`c-of-${lineType}`"></span>
    <span class="c-json-content">
      <span v-if="showIndex" class="c-json-key">{{ name }}: </span>
      <span :class="`c-json-${type}`">{{ value }}</span>
      <span class="c-json-comma">{{ needComma ? ',' : '' }}</span>
    </span>
  </p>
</template>
<script>
import { getIndent } from './utils.js';
export default {
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
  methods: {
    getIndent: getIndent,
  },
};
</script>
