<template>
  <div class="alpaca-json">
    <slot v-if="isTheSameType">
      <div>
        <slot v-if="isObject">
          <object-tree :oldData="oldData" :newData="newData"></object-tree>
        </slot>
        <slot v-else-if="isArray">
          <array-tree :oldData="oldData" :newData="newData"></array-tree>
        </slot>
        <slot v-else>类型不一致</slot>
      </div>
    </slot>
    <slot v-else>类型不一致</slot>
  </div>
</template>

<script>
import * as type from './typeof.js'
import objectTree from './objectTree.vue'
import arrayTree from './arrayTree.vue'
export default {
  components: {
    objectTree,
    arrayTree
  },
  props: ['oldData', 'newData'],
  computed: {
    isTheSameType () {
      return type.type(this.oldData) === type.type(this.newData)
    },
    isArray () {
      if (type.isArray(this.oldData) && type.isArray(this.newData)) {
        return true
      }
      return false
    },
    isObject () {
      if (type.isObject(this.oldData) && type.isObject(this.newData)) {
        return true
      }
      return false
    }
  }
}
</script>

<style>
  .alpaca-json {
    width: 100%;
    padding: 10px;
    color: #7c7d7d;
    text-align: left;
    font-size: 14px;
    background-color: #f8f8f8;
    border-radius: 5px;
  }
  .alpaca-finger:hover {
    font-weight: bold;
    cursor: pointer;
    color: #2d8cf0;
  }
  .alpaca-number {
    color: #ae81ff;
  }
  .alpaca-string {
    color: #a6e22e;
  }
  .alpaca-boolean {
    color: #6F73FF;
  }
  .alpaca-null {
    color: #66d9ef;
  }
  .alpaca-undefined {
    color: #f92672;
  }
  .alpaca-del {
    position: relative;
    background-color: #ffeef0;
  }
  .alpaca-add {
    position: relative;
    background-color: #e6ffed;
  }
  .alpaca-upd {
    position: relative;
    background-color: #fffde6;
  }
  .alpaca-add:after {
    content: '+';
    position: absolute;
    left: 5px;
    top: 0px;
    text-indent: 0;
  }
  .alpaca-del:after {
    content: '-';
    position: absolute;
    left: 5px;
    top: 0px;
    text-indent: 0;
  }
  .alpaca-upd:after {
    content: '*';
    position: absolute;
    left: 5px;
    top: 0px;
    text-indent: 0;
  }
  .alpaca-upd .alpaca-del, .alpaca-upd .alpaca-add {
    background-color: #fffde6;
  }
  .alpaca-upd .alpaca-del:after, .alpaca-upd .alpaca-add:after {
    content: '*';
  }
</style>
