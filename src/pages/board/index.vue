<template>
  <div class="taskTableContainer">
    <div class="taskTable">
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">К выполнению</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index + 'to_do'"
            column="to_do"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">В процессе выполнения</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index + 'in_progress'"
            column="in_progress"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">На проверке</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index + 'in_review'"
            column="in_review"
          />
        </div>
      </div>
      <div class="row">
        <div class="rowTitleContainer">
          <p class="rowTitle">Завершено</p>
        </div>
        <div class="rowContent">
          <Task
            @click="choseTask(index)"
            v-bind="task"
            v-for="(task, index) in studentTasks"
            :key="index + 'done'"
            column="done"
          />
        </div>
      </div>
    </div>
    <Modal @close="toggleModal" v-if="taskModalOpened" :overflow="true">
      <div class="modalContent">
        <div v-if="chosenTask.person">
          <div class="studentAvatarContainer">
            <img
              class="studentAvatar"
              :src="chosenTask.person.image || defaultUserIcon"
              alt="student_image"
            />
          </div>
          <p>{{ chosenTask.person.name }}</p>
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
        <div class="taskDateContainer">
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
        </div>
        <div v-if="chosenTask.comment">
          <h3>Комментарий преподавателя</h3>
          <p>{{chosenTask.comment}}</p>
        </div>
        <div v-if="chosenTask.options && chosenTask.options.length > 1" class="buttonsContainer">
          <Button
            v-for="(option, index) in chosenTask.options"
            @click="setTaskStatus(chosenTask.id, option)"
            v-bind="option"
            :key="index + 'button'"
          />
        </div>
        <Button
            v-else-if="chosenTask.options"
            class="Button"
            @click="setTaskStatus(chosenTask.id, chosenTask.options[0])"
            v-bind="chosenTask.options[0]"
        />
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
      formData: new FormData()
    };
  },

  computed: {
    ...mapGetters(["getAuth", "studentTasks"]),
  },
  async mounted() {
    await this.fetchTasks();
  },
  methods: {
    ...mapActions(["fetchTasks", "uploadFile", "updateTaskStatus"]),
    choseTask(index) {
      this.chosenTask = this.studentTasks[index];
      this.toggleModal();
    },
    toggleModal() {
      this.taskModalOpened = !this.taskModalOpened;
    },
    async setTaskStatus(id, status) {
      await this.updateTaskStatus({answerId: id, status: status.action});
      await this.fetchTasks();
      this.toggleModal();
    },
    async loadFile(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append(`file-${i+1}`, event.target.files[i]);
      }
      await this.uploadFile({taskId: this.chosenTask.id, formData: this.formData});
      this.formData = new FormData();
    },
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
  display: flex;
  flex-direction: column;
  width: 600px;
}

.buttonsContainer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.Button {
  margin-top: 20px;
}

.taskTitle,
.taskSubtitle {
  margin: 0 0 10px 0;
}

.taskDateContainer {
  margin-top: 10px;
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

.studentAvatarContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.studentAvatar {
  height: 100px;
  width: 100px;
  max-width: 100px;
  max-height: 100px;
}
</style>
