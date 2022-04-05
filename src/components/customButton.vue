<template>
  <button @click.prevent.stop="onClick" :class="['customButton', {'disabled': disabled}]">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "customButton",
  props: {
    text: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      !this.disabled && this.$emit('click');
    }
  }
};
</script>

<style scoped>
.customButton {
  background-color: white;
  border-radius: 8px;
  border: 1px solid gray;
  color: #172133;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  -webkit-transition-duration: 0.6s;
  transition-duration: 0.6s;
  cursor: pointer;
}

.customButton:hover {
  border: 1px solid white;
  background-color: #216bff;
  color: white;
}

.disabled {
  background-color: #F2F5F9;
  cursor: default;
}

.disabled:hover {
  background-color: #F2F5F9;
  border: 1px solid gray;
  color: #172133;
}
</style>
