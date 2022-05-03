<template>
  <select class="Select" v-model="inputValue" name="marks" id="marks">
      <option v-for="(option, index) in options" :key="index + option.id" :value="option">{{ option.name }}</option>
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
      inputVal: ''
    }
  },
  computed: {
    inputValue: {
      get: function () {
        return this.inputVal || this.options[0]
      },
      set: function (newValue) {
        this.inputVal = newValue;
      }
    }
  },
  mounted() {
    this.$emit('change', this.inputValue.id);
  },
  watch: {
    inputValue: function(val) {
      this.$emit('change', val.id);
    }
  }
}
</script>

<style scoped>

</style>
