<template>
  <select class="Select" v-model="inputValue" name="marks" id="marks">
      <option v-for="(option, index) in options" :key="index" :value="option">{{ option }}</option>
  </select>
</template>

<script>
export default {
  name: "selector",
  props: {
    options: []
  },
  data() {
    return {
      inputValue: this.options[0]
    }
  },
  watch: {
    inputValue: function(val) {
      this.$emit('change', val);
    }
  }
}
</script>

<style scoped>

</style>
