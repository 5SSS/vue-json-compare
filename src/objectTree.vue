<template>
  <div>
    <p v-if="showLeaf" @click="parent=!parent" class="alpaca-finger">
      { <span v-show="!parent">... }</span>
    </p>
    <p v-show="parent" v-for="(item, index) in getData" :class="getDiff(index)" :style="getStyle" :key="index">
      <slot v-if="isObject(item)">
        <p @click="toggle(index)" class="alpaca-finger">
          {{ index }}: {
          <span v-show="!child[index]" v-if="isLast(index)">... }</span>
          <span v-show="!child[index]" v-else>... },</span>
        </p>
        <objectself v-show="child[index]" :oldData="getOldData(index)" :newData="getNewData(index)" :showLeaf="false" :indent="indent+1"></objectself>
        <p :style="getStyle" :class="getDiff(index)">
          <span v-show="child[index]" v-if="isLast(index)">}</span>
          <span v-show="child[index]" v-else>},</span>
        </p>
      </slot>
      <slot v-else-if="isArray(item)">
        <p @click="toggle(index)" class="alpaca-finger">
          {{ index }}: [
          <span v-show="!child[index]" v-if="isLast(index)">... ]</span>
          <span v-show="!child[index]" v-else>... ],</span>
        </p>
        <arrayTree v-show="child[index]" :data="item" :oldData="getOldDataArr(index)" :newData="getNewDataArr(index)" :showLeaf="false" :indent="indent+1"></arrayTree>
        <p :style="getStyle" :class="getDiff(index)">
          <span v-show="child[index]" v-if="isLast(index)">]</span>
          <span v-show="child[index]" v-else>],</span>
        </p>
      </slot>
      <slot v-else>
        <p :style="getStyle" :class="getDiff(index)">
          <span>{{ index }}:</span>
          <!-- 最后一项不需要逗号分隔 -->
          <span :class="getClass(item)" v-if="isLast(index)">{{ isNullOrUndefined(item) }}</span>
          <span :class="getClass(item)" v-else>{{ isNullOrUndefined(item) }},</span>
        </p>
      </slot>
    </p>
    <p v-if="showLeaf" v-show="parent">}</p>
  </div>
</template>

<script>
import * as type from './typeof.js'
export default {
  name: 'objectself',
  components: {
    arrayTree: () => import('./arrayTree.vue')
  },
  props: {
    showLeaf: {
      type: Boolean,
      default: true
    },
    oldData: {
      type: Object,
      default: () => ({})
    },
    newData: {
      type: Object,
      default: () => ({})
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
      return Object.assign({}, this.oldData, this.newData)
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
      let keys = Object.keys(data)
      keys.forEach(item => {
        if (type.isObject(data[item]) || type.isArray(data[item])) {
          this.$set(this.child, item, true)
        }
      })
    },
    getOldData (index) {
      if (this.oldData[index]) {
        if (type.isObject(this.oldData[index])) {
          return this.oldData[index]
        }
        return {}
      }
      return {}
    },
    getNewData (index) {
      if (this.newData[index]) {
        if (type.isObject(this.newData[index])) {
          return this.newData[index]
        }
        return {}
      }
      return {}
    },
    getOldDataArr (index) {
      if (this.oldData[index]) {
        if (type.isArray(this.oldData[index])) {
          return this.oldData[index]
        }
        return []
      }
      return []
    },
    getNewDataArr (index) {
      if (this.newData[index]) {
        if (type.isArray(this.newData[index])) {
          return this.newData[index]
        }
        return []
      }
      return []
    },
    isArray (item) {
      return type.isArray(item)
    },
    isObject (item, index) {
      return type.isObject(item)
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
          if (!type.isArray(oldData[index]) && !type.isObject(oldData[index])) {
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
      // 无变化
      return ''
    },
    isLast (key) {
      let allKeys = Object.keys(this.getData)
      return allKeys[allKeys.length - 1] === key
    },
    toggle (index) {
      this.child[index] = !this.child[index]
    }
  }
}
</script>
