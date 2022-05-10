<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div :class="['modal-container', {'modal-container-overflow': overflow}]">
          <div class="closeButton" @click="$emit('close')">
            <img class="closeImage" :src="close" alt="close_button"/>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import close from "../assets/close.png";

export default {
  name: "modal",
  props: {
    overflow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      close: close,
    };
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding: 40px 0;
}

.modal-container {
  position: relative;
  min-width: 300px;
  width: fit-content;
  margin: 0 auto;
  padding: 30px 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-container-overflow {
  overflow: scroll;
  box-sizing: border-box;
  height: 100%;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.closeButton {
  top: 0;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  cursor: pointer;
}

.closeImage {
  width: 20px;
  height: 20px;
}
</style>
