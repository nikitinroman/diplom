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
          <Selector @change="changeGroup" :options="otherGroups"/>
          <Selector @change="changeSubject" :options="otherSubjects"/>
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

import {requestWrapper} from "@/requestHelpers/requestHelper.js";
import {NEW_FILE_TO_TASK, NEW_TASK_URL} from "@/requestHelpers/endpoints.ts";
import {mapGetters} from "vuex";

export default {
  name: "newTask",
  components: {
    CustomButton,
    Selector,
  },
  data() {
    return {
      loadHref: 'href',
      chosenSubject: "",
      chosenSubjectId: null,
      chosenGroup: "",
      chosenGroupId: null,
      taskTitle: "",
      taskSubtitle: "",
      endDate: "",
      taskDescription: "",
      taskEndDate: '',
      taskEndDateChanged: false,
      formData: new FormData(),
      filesAdded: false,
      otherSubjects: [],
      otherGroups: [],
    }
  },
  computed: {
    ...mapGetters(['token', 'userId', 'groupId']),
    disabledButton() {
      return !this.chosenSubject ||
             !this.chosenGroup ||
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

    await this.fetchSubjectsAndGroupsInfo();
  },
  methods: {
    loadFile(event) {
      this.filesAdded = true;
      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append(`file-${i}`, event.target.files[i]);
      }
    },
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    createTask() {
      this.postNewTask();
    },
    async fetchSubjectsAndGroupsInfo() {
      const response = await requestWrapper({additionUrl: '', userID: this.userId, token: this.token, method: "GET"});
      this.otherSubjects = response.otherSubjects;
      this.otherGroups = response.otherGroups;
    },
    async postNewTask() {
      // Как андрей сделает ручку получения списка групп и предметов с айдишниками- допилить прокидывание сюда их
      const body = {
        groupId: this.chosenGroup,
        subjectName: this.chosenSubject,
        taskTitle: this.taskTitle,
        taskSubtitle: this.taskSubtitle,
        taskDescription: this.taskDescription,
        taskEndDate: this.taskEndDate
      }
      const response = await requestWrapper({additionUrl: NEW_TASK_URL, userID: this.userId, token: this.token, method: "POST", postBody: body});
      await this.addFileToTask(response.taskId);
    },
    async addFileToTask(taskId) {
      if (this.filesAdded && taskId) {
        const body = {
          formData: this.formData
        }
        await requestWrapper({additionUrl: NEW_FILE_TO_TASK, userID: this.userId, token: this.token, method: "POST", postBody: body, getParam: taskId});
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
