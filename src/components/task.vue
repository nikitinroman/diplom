<template>
  <div v-if="column === status || !column" @click="$emit('click')" :class="['task', {'burned': burned}]">
    <p v-if="burned" class="burnedText">Время истекло</p>
    <p class="taskTitle">{{ title }}</p>
    <p class="taskSubtitle">{{ subtitle }}</p>
    <div class="taskDate">
      <p class="taskDate">{{ startDate }}</p>
      <span class="taskSeparator">---</span>
      <p class="taskDate">{{ endDate }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "task",
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    column: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    burned: {
      type: Boolean,
      default: false,
    }
  },
};
</script>

<style scoped>
.task {
  background-color: white;
  padding: 8px;
  margin-top: 15px;
  border-radius: 6px;
  cursor: pointer;
}

.taskTitle,
.taskSubtitle {
  margin: 0 0 10px 0;
}

.taskDate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.taskSeparator {
  color: gray;
}

.taskDate {
  margin: 0;
}

.burned {
  border: 2px solid red;
}

.burnedText {
  color: red;
  margin: 0 0 6px 0;
}
</style>
