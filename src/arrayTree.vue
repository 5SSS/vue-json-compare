<template>
  <div class="object-tree">
    <p v-if="showLeaf" @click="parent=!parent" class="alpaca-finger">
      [ <span v-show="!parent">... ]</span>
    </p>
    <p v-show="parent" v-for="(item, index) in getData" :class="getDiff(index)" :style="getStyle" :key="index">
      <slot v-if="isArray(item)">
        <p @click="toggle(index)" class="alpaca-finger">
          [
          <span v-show="!child[index]" v-if="isLast(index)">... ]</span>
          <span v-show="!child[index]" v-else>... ],</span>
        </p>
        <arrayself v-show="child[index]" :oldData="getOldData(index)" :newData="getNewData(index)" :showLeaf="false" :indent="indent+1"></arrayself>
        <p :style="getStyle" :class="getDiff(index)">
          <span v-show="child[index]" v-if="isLast(index)">]</span>
          <span v-show="child[index]" v-else>],</span>
        </p>
      </slot>
      <slot v-else-if="isObject(item)">
        <p @click="toggle(index)" class="alpaca-finger">
          {
          <span v-show="!child[index]" v-if="isLast(index)">... }</span>
          <span v-show="!child[index]" v-else>... },</span>
        </p>
        <object-tree v-show="child[index]" :oldData="getOldDataObj(index)" :newData="getNewDataObj(index)" :showLeaf="false" :indent="indent+1"></object-tree>
        <p :style="getStyle" :class="getDiff(index)">
          <span v-show="child[index]" v-if="isLast(index)">}</span>
          <span v-show="child[index]" v-else>},</span>
        </p>
      </slot>
      <slot v-else>
        <!-- 最后一项不需要逗号分隔 -->
        <p :style="getStyle" :class="getDiff(index)">
          <span :class="getClass(item)" v-if="isLast(index)">{{ isNullOrUndefined(item) }}</span>
          <span :class="getClass(item)" v-else>{{ isNullOrUndefined(item) }},</span>
        </p>
      </slot>
    </p>
    <p v-if="showLeaf" v-show="parent">]</p>
  </div>
</template>

<script>
import * as type from './typeof.js'
const mergedArr = (arr1, arr2) => {
  let longer = []
  let merged = []
  if (arr1.length > arr2.length) {
    longer = arr1
  } else {
    longer = arr2
  }
  longer.forEach((item, index) => {
    if (arr1.hasOwnProperty(index) && arr2.hasOwnProperty(index)) {
      merged.push(arr2[index])
    } else {
      if (arr2.hasOwnProperty(index)) {
        merged.push(arr2[index])
      } else {
        merged.push(arr1[index])
      }
    }
  })
  return merged
}
export default {
  name: 'arrayself',
  components: {
    objectTree: () => import('./objectTree.vue')
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    showLeaf: {
      type: Boolean,
      default: true
    },
    oldData: {
      type: Array,
      default: () => []
    },
    newData: {
      type: Array,
      default: () => []
    },
    indent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      parent: true,
      child: {}
    }
  },
  computed: {
    getData () {
      return mergedArr(this.oldData, this.newData)
    },
    getStyle () {
      return {textIndent: `${(this.indent + 1) * 20}px`}
    }
  },
  watch: {
    oldData (val) {
      this.child = {}
      this.buildRelation()
    },
    newData (val) {
      this.child = {}
      this.buildRelation()
    }
  },
  created () {
    this.buildRelation()
  },
  methods: {
    buildRelation () {
      let data = this.getData
      data.forEach((item, index) => {
        if (type.isObject(item) || type.isArray(item)) {
          this.$set(this.child, index, true)
        }
      })
    },
    getOldData (index) {
      if (this.oldData[index]) {
        if (type.isArray(this.oldData[index])) {
          return this.oldData[index]
        }
        return []
      }
      return []
    },
    getNewData (index) {
      if (this.newData[index]) {
        if (type.isArray(this.newData[index])) {
          return this.newData[index]
        }
        return []
      }
      return []
    },
    getOldDataObj (index) {
      if (this.oldData[index]) {
        if (type.isObject(this.oldData[index])) {
          return this.oldData[index]
        }
        return {}
      }
      return {}
    },
    getNewDataObj (index) {
      if (this.newData[index]) {
        if (type.isObject(this.newData[index])) {
          return this.newData[index]
        }
        return {}
      }
      return {}
    },
    isArray (item) {
      return type.isArray(item)
    },
    isObject (item) {
      return type.isObject(item)
    },
    isLast (index) {
      return (this.getData.length - 1) === index
    },
    isNullOrUndefined (item) {
      if (type.isNull(item)) {
        return 'null'
      }
      if (type.isUndefined(item)) {
        return 'undefined'
      }
      // 其他
      return item
    },
    getClass (item) {
      if (type.isNumber(item)) {
        return 'alpaca-number'
      }
      if (type.isString(item)) {
        return 'alpaca-string'
      }
      if (type.isBoolean(item)) {
        return 'alpaca-boolean'
      }
      if (type.isUndefined(item)) {
        return 'alpaca-undefined'
      }
      if (type.isNull(item)) {
        return 'alpaca-null'
      }
      // 其他不改变颜色
      return ''
    },
    getDiff (index) {
      let oldData = this.oldData
      let newData = this.newData
      if (oldData.hasOwnProperty(index) && newData.hasOwnProperty(index)) {
        // 类型不同
        if (type.type(oldData[index]) !== type.type(newData[index])) {
          return 'alpaca-upd'
        } else {
          // 类型相同
          if (!type.isObject(oldData[index]) && !type.isArray(oldData[index])) {
            if (oldData[index] !== newData[index]) {
              return 'alpaca-upd'
            }
          }
        }
      }
      if (oldData.hasOwnProperty(index) && !newData.hasOwnProperty(index)) {
        return 'alpaca-del'
      }
      if (!oldData.hasOwnProperty(index) && newData.hasOwnProperty(index)) {
        return 'alpaca-add'
      }
      // 无改变
      return ''
    },
    toggle (index) {
      this.child[index] = !this.child[index]
    }
  }
}
</script>
