<template>
  <Component
    :is="needFormat(type) ? 'ComplexTree' : 'NormalTree'"
    :name="name"
    :value="value"
    :type="type"
    :line="line"
    :showIndex="showIndex"
    :needComma="needComma"
    :level="level"
    :lineType="lineType"
    :lastLineType="lastLineType"
    :lastLine="lastLine"
  />
</template>

<script>
import { needFormat } from './utils.js';
import ComplexTree from './complexTree.vue';
import NormalTree from './normalTree.vue';
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
  components: {
    ComplexTree,
    NormalTree,
  },
  methods: {
    needFormat: needFormat,
  },
};
</script>
