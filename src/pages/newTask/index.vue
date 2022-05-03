<template>
  <div class="newTaskContainer">
    <h1>Новое задание</h1>
    <div class="heading">
      <div class="container">
        <div>
          <p class="selectorTitle">Группа</p>
          <p class="selectorTitle">Предмет</p>
        </div>
        <div class="selectorsContainer">
          <Selector @change="changeGroup" :options="groups"/>
          <Selector @change="changeSubject" :options="subjects"/>
        </div>
      </div>
    </div>
    <h2>Задание</h2>
    <textarea rows="5" class="Textarea" v-model="taskTitle" placeholder="Введите название задания"/>
    <h2>Краткое описание</h2>
    <textarea rows="5" class="Textarea" v-model="taskSubtitle" placeholder="Введите краткое описание задания"/>
    <h2>Полное описание</h2>
    <textarea rows="10" class="Textarea" v-model="taskDescription" placeholder="Введите полное описание задания"/>
    <div>
      <h2>Прикрепить файлы к заданию</h2>
      <input type="file" @change="loadFile" multiple>
    </div>
    <div class="endDateContainer">
      <p>Дедлайн:</p>
      <input type="date" id="endDate" name="endDate"
             v-model="taskEndDate"
             max="2022-12-31">
    </div>
    <CustomButton text="Создать" :disabled="disabledButton" @click="createTask"/>
  </div>
</template>

<script>
import CustomButton from "../../components/customButton";
import Selector from "../../components/selector";

import {mapGetters, mapActions} from "vuex";

export default {
  name: "newTask",
  components: {
    CustomButton,
    Selector,
  },
  data() {
    return {
      loadHref: 'href',
      chosenSubjectId: null,
      chosenGroupId: null,
      taskTitle: "",
      taskSubtitle: "",
      endDate: "",
      taskDescription: "",
      taskEndDate: '',
      taskEndDateChanged: false,
      formData: new FormData(),
      filesAdded: false,
    }
  },
  computed: {
    ...mapGetters(['groups', 'subjects']),
    disabledButton() {
      return !this.chosenSubjectId ||
             !this.chosenGroupId ||
             !this.taskTitle ||
             !this.taskSubtitle ||
             !this.taskDescription ||
             !this.isEndDateValid;
    },
    isEndDateValid() {
      // eslint-disable-next-line
      const regexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
      return this.taskEndDate.match(regexp)
    }
  },
  async mounted() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    document.getElementById("endDate").setAttribute("min", today);
  },
  methods: {
    ...mapActions(['uploadFile', 'postNewTask']),
    loadFile(event) {
      this.filesAdded = true;
      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append(`file-${i}`, event.target.files[i]);
      }
    },
    changeSubject(val) {
      this.chosenSubjectId = val;
    },
    changeGroup(val) {
      this.chosenGroupId = val;
    },
    createTask() {
      this.addNewTask();
    },
    clearFields() {
      this.taskTitle = "";
      this.taskSubtitle = "";
      this.taskDescription = "";
      this.taskEndDate = '';
      this.taskEndDateChanged = false;
      this.formData = new FormData();
      this.filesAdded = false;
    },
    async addNewTask() {
      const body = {
        groupId: this.chosenGroupId,
        subjectId: this.chosenSubjectId,
        taskTitle: this.taskTitle,
        taskSubtitle: this.taskSubtitle,
        taskDescription: this.taskDescription,
        taskEndDate: this.taskEndDate
      }
      const response = await this.postNewTask(body)
      await this.addFileToTask(response.taskId);
      this.clearFields();
    },
    async addFileToTask(taskId) {
      if (this.filesAdded && taskId) {
        await this.uploadFile({taskId, formData: this.formData});
      }
    },
  }
}
</script>

<style scoped>
.newTaskContainer {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.heading {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.container {
  display: flex;
  margin-right: 24px;
  align-items: center;
}

.selectorTitle {
  font-size: 20px;
  margin: 0 24px 0 0;
}

.selectorsContainer {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

textarea {
  min-height: 100px;
  width: 60%;
  resize: vertical;
}

.endDateContainer {
  display: flex;
  margin: 20px 0;
  gap: 20px;
}
</style>
