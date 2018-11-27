<template>
  <div class="alpaca-compare">
    <vuejson :oldData="oldData" :newData="newData"></vuejson>
  </div>
</template>

<script>
import vuejson from './src/jsonvue'
export default {
  components: {
    vuejson
  },
  props: ['oldData', 'newData']
}
</script>

<style>
  .alpaca-compare {
    width: 100%;
  }
/*  .alpaca-left {
    width: 50%;
    float: left;
  }
  .alpaca-right {
    width: 50%;
    float: right;
  }*/
  /*.alpaca-compare:after {
    content: '';
    display: block;
    clear: both;
  }*/
</style>
