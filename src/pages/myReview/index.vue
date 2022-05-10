<template>
  <div class="myReviewContainer">
    <h1>Ваши задачи на оценку</h1>
    <div class="heading">
      <div class="container">
        <div>
          <p class="selectorTitle">Группа</p>
          <p class="selectorTitle">Предмет</p>
        </div>
        <div class="selectorsContainer">
          <Selector @change="changeGroup" :options="groups" />
          <Selector @change="changeSubject" :options="subjects" />
        </div>
      </div>
      <CustomButton
        class="button"
        @click="onChoose"
        text="Выбрать"
        :disabled="disabledButton"
      />
    </div>
    <div class="allTasks">
      <div class="tasksOnReviewList">
        <Task
            v-for="(task, index) in tasksForReview"
            @click="choseTask(index)"
            v-bind="task"
            class="taskOnReview"
            :key="index"
        />
      </div>
    </div>
    <Modal v-if="modalIsVisible" @close="toggleModal" :overflow="true">
      <div class="modalContent">
        <div v-if="chosenTask.person">
          <div class="studentAvatarContainer">
            <img
              class="studentAvatar"
              :src="chosenTask.person.image || defaultUserIcon"
              alt="student_image"
            />
          </div>
          <h3 class="personName">{{ chosenTask.person.name }}</h3>
          <p class="personPosition">{{ chosenTask.person.position }}</p>
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
        <h3 class="taskStatus">Статус выполнения задания</h3>
        <h2 v-if="chosenTask.status" class="taskStatus">
          {{ chosenTask.status }}
        </h2>
        <div v-if="chosenTask.title">
          <h3 class="taskTitle" >Задание</h3>
          <p class="taskTitle">{{ chosenTask.title }}</p>
        </div>
        <div v-if="chosenTask.subtitle">
          <h3 class="taskSubtitle">Тема задания</h3>
          <p class="taskSubtitle">
            {{ chosenTask.subtitle }}
          </p>
        </div>
        <div v-if="chosenTask.description">
          <h3 class="taskDescription">Описание задания</h3>
          <p class="taskDescription">
            {{ chosenTask.description }}
          </p>
        </div>
        <div v-if="chosenTask.comment">
          <h3 class="taskComment">Комментарий преподавателя</h3>
          <p class="taskComment">
            {{ chosenTask.comment }}
          </p>
        </div>
        <div class="taskDateContainer">
          <p class="taskDate">{{ chosenTask.startDate }}</p>
          <span class="taskSeparator">---</span>
          <p class="taskDate">{{ chosenTask.endDate }}</p>
        </div>
        <h1>Выставление оценки</h1>
        <textarea
          rows="5"
          class="Textarea"
          v-model="inputMarkMessage"
          placeholder="Введите комментарий к оценке"
        />
        <div class="SelectContainer">
          <p>Выберите оценку из списка</p>
          <select class="Select" v-model="inputMark" name="marks" id="marks">
            <optgroup label="Положительные оценки">
              <option :value=5>Отлично</option>
              <option :value=4>Хорошо</option>
              <option :value=3>Удовлетворительно</option>
            </optgroup>
            <optgroup label="Негативные оценки">
              <option :value=2>Неудовлетворительно</option>
              <option :value=1>Не выполнено</option>
            </optgroup>
          </select>
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
        <div>
          <h2>Прикрепить файлы к заданию</h2>
          <input type="file" ref="input" @change="loadFile" multiple>
        </div>
        <CustomButton
          class="Button"
          @click="sendTaskMark(chosenTask.id)"
          :text="'Поставить оценку'"
        />
        <CustomButton
            class="Button"
            @click="toRework(chosenTask.id)"
            :text="'Отправить на доработку'"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import CustomButton from "../../components/customButton";
import Selector from "../../components/selector";
import Task from "../../components/task";
import Modal from "../../components/modal";
import DownloadFile from '../../components/downloadFile'
import defaultUserIcon from "@/assets/default_user_icon.png";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "myReview",
  components: {
    CustomButton,
    Selector,
    Task,
    Modal,
    DownloadFile
  },
  data() {
    return {
      defaultUserIcon,
      chosenTask: {},
      inputMarkMessage: "Молодец!",
      inputMark: 5,
      modalIsVisible: false,
      chosenSubject: "",
      chosenGroup: "",
      formData: new FormData(),
    };
  },
  computed: {
    ...mapGetters(['groups', 'subjects', 'tasksForReview']),
    disabledButton() {
      return !this.chosenSubject && !this.chosenGroup;
    },
  },
  async mounted() {
    await this.fetchTasksForReview('groupId=-1&subjectId=-1');
  },
  methods: {
    ...mapActions(['uploadFile', 'fetchTasksForReview', 'setTaskMark', 'updateTaskStatus']),
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    async onChoose() {
      const groupId = this.chosenGroup || this.groups[0].id;
      const subjectId = this.chosenSubject || this.subjects[0].id;
      await this.fetchTasksForReview(`groupId=${groupId}&subjectId=${subjectId}`);
    },
    choseTask(index) {
      this.chosenTask = this.tasksForReview[index];
      this.toggleModal();
    },
    toggleModal() {
      this.modalIsVisible = !this.modalIsVisible;
    },
    clearFields() {
      this.inputMarkMessage = 'Молодец!';
      this.inputMark = 5;
      this.$refs.input.value = '';
    },
    async sendTaskMark(id) {
      await this.setTaskMark({
        answerId: id,
        comment: this.inputMarkMessage,
        mark: this.inputMark
      });
      await this.onChoose();
      this.toggleModal();
      this.clearFields();
    },
    async toRework(id) {
      await this.updateTaskStatus({answerId: id, comment: this.inputMarkMessage, status: 'in_progress'});
      await this.onChoose();
      this.toggleModal();
      this.clearFields();
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
.myReviewContainer {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.heading {
  display: flex;
  align-items: center;
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

.allTasks {
  flex: 1 0 auto;
  margin-top: 24px;
  padding: 0 16px 16px 16px;
  background-color: #f2f5f9;
}

.modalContent {
  display: flex;
  flex-direction: column;
  width: 600px;
}

.taskTitle,
.taskSubtitle,
.taskDescription,
.taskComment,
.personName,
.personPosition {
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

.Button {
  margin-top: 20px;
}

.Textarea {
}

.SelectContainer {
  display: flex;
  margin-top: 20px;
}

.Select {
  margin-left: 16px;
}

.downloadFile {
  display: inline-block;
  margin: 16px 0;
}

.taskOnReview {
  width: 180px;
}

.tasksOnReviewList {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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
