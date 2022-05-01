<template>
  <div class="taskTableContainer">
    <div class="taskTable">
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">To do</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index"
            column="to_do"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">In progress</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index"
            column="in_progress"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">In review</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index"
            column="in_review"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">Done</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index"
            column="done"
          />
        </div>
      </div>
    </div>
    <Modal @close="toggleModal" v-if="taskModalOpened">
      <div class="modalContent">
        <div v-if="chosenTask.person">
          <div v-if="chosenTask.person.image" class="studentAvatarContainer">
            <img
              class="studentAvatar"
              :src="chosenTask.person.image || defaultUserIcon"
              alt="student_image"
            />
          </div>
          <p>{{ chosenTask.person.position }}</p>
          <div class="personContacts">
            <div class="personContactsContent">
              <p class="personContactsText">Почта</p>
              <p class="personContactsText">Телефон</p>
            </div>
            <div class="personContactsContent">
              <a
                class="personContactsText"
                :href="`mailto:${chosenTask.person.email}`"
                >{{ chosenTask.person.email }}</a
              >
              <a
                class="personContactsText"
                :href="`tel:+${chosenTask.person.tel}`"
                >Позвонить {{ chosenTask.person.tel }}</a
              >
            </div>
          </div>
        </div>
        <h2 class="taskStatus">{{ chosenTask.status }}</h2>
        <p class="taskTitle">{{ chosenTask.title }}</p>
        <p class="taskSubtitle">{{ chosenTask.subtitle }}</p>
        <p class="taskDescription">{{ chosenTask.description }}</p>
        <div class="taskDate">
          <p class="taskDate">{{ chosenTask.startDate }}</p>
          <span class="taskSeparator">---</span>
          <p class="taskDate">{{ chosenTask.endDate }}</p>
        </div>
        <div v-if="chosenTask.canLoadFile">
          <h3>Прикрепить файлы к заданию</h3>
          <input class="loadFile" type="file" @change="loadFile" multiple>
        </div>
        <div
            v-if="chosenTask.files">
          <DownloadFile
              v-for="(file, index) in chosenTask.files"
              :key="index + file.name"
              class="downloadFile"
              :filename="file.name"
              :href="file.href"/>
          <!--        https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc-->
        </div>

        <div v-if="chosenTask.options" class="buttonsContainer">
          <Button
            @click="setTaskStatus(chosenTask.id, option)"
            v-bind="option"
            v-for="(option, index) in chosenTask.options"
            :key="index"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Task from "../../components/task";
import Modal from "../../components/modal";
import Button from "../../components/customButton";
import defaultUserIcon from "@/assets/default_user_icon.png";
import DownloadFile from '../../components/downloadFile'
import {changeTaskStatus} from "@/constants.ts";

export default {
  name: "Board",

  components: {
    Task,
    Modal,
    Button,
    DownloadFile
  },

  data() {
    return {
      defaultUserIcon,
      chosenTask: {},
      taskModalOpened: false,
      loadedFiles: [],
    };
  },

  computed: {
    ...mapGetters(["getAuth", "studentTasks"]),
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    ...mapActions(["fetchTasks"]),
    choseTask(index) {
      this.chosenTask = this.studentTasks[index];
      this.loadedFile = [];
      this.toggleModal();
    },
    toggleModal() {
      this.taskModalOpened = !this.taskModalOpened;
    },
    setTaskStatus(id, status) {
      const postData = {id: id, status: status, loadedFiles: this.loadedFiles}

      fetch(changeTaskStatus, {
        method: 'POST',
        body: postData
      })
      this.toggleModal();
    },
    loadFile(event) {
      this.loadedFiles = event.target.files
    }
  },
};
</script>

<style scoped>
.taskTableContainer {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.taskTable {
  display: flex;
  flex: 1 0 auto;
}

.row {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  width: 25%;
  padding: 0 5px;
  box-sizing: border-box;
}

.rowTitleContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  height: 50px;
}

.rowTitle {
  margin: 0;
}

.rowContent {
  flex-grow: 1;
  background-color: #f4f5f7;
  padding: 5px 15px 15px 15px;
}

.modalContent {
  width: 600px;
}

.buttonsContainer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
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

.personContacts {
  display: flex;
  align-items: center;
}

.personContactsContent {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.personContactsText {
  display: inline-block;
  margin: 20px 0 0 0;
}

.loadFile,
.downloadFile {
  display: inline-block;
  margin: 16px 0;
}
</style>
