<template>
  <div class="table">
    <div v-if="editableMode" class="wrapper">
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
        <Button
            @click="onChoose"
            text="Выбрать"
            :disabled="disabledButton"
        />
      </div>
    </div>
    <div class="row" v-for="(row, index) in journalTable" :key="index">
      <div
          :class="['cell', { firstCell: item.firstCell, pointer: item.data, burned: item.burned }]"
          v-for="(item, index) in row"
          :key="item.id + item.text + index"
          @click="openModal(item)"
      >
        <span v-if="!item.burned">{{ item.text || item.status }}</span>
        <b v-else>Время истекло</b>
      </div>
    </div>
    <Modal @close="toggleModal" v-if="modalIsOpened" :overflow="true">
      <div class="modalContent">
        <div v-if="chosenTask.status">
          <h3 class="taskStatus">Статус выполнения задания</h3>
          <h2 class="taskStatus">
            {{ chosenTask.status }}
            <b class="titleBurned" v-if="chosenTask.burned">Время истекло</b>
          </h2>
        </div>
        <div v-if="chosenTask.title">
          <h3 class="taskTitle">Задание</h3>
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
              >{{ chosenTask.person.email }}
              </a>
              <a
                  class="personContactsText"
                  :href="`tel:+${chosenTask.person.tel}`"
              >Позвонить {{ chosenTask.person.tel }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="chosenTask.startDate || chosenTask.endDate" class="taskDateContainer">
          <p class="taskDate">{{ chosenTask.startDate }}</p>
          <span class="taskSeparator">---</span>
          <p class="taskDate">{{ chosenTask.endDate }}</p>
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
        <div v-if="chosenTask.options &&
        chosenTask.options.length > 1" class="buttonsContainer">
          <Button
              @click="setTaskStatus(chosenTask.id, option)"
              v-bind="option"
              v-for="(option, index) in chosenTask.options"
              :key="index + option.text"
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
    <Modal @close="toggleEditModal" v-if="editableModalIsOpened" :overflow="true">
      <div class="modalContent">
        <h1>Выставление оценки</h1>
        <div v-if="chosenTask.status">
          <h3 class="taskStatus">Статус выполнения задания</h3>
          <h2 class="taskStatus">
            {{ chosenTask.status }}
            <b class="titleBurned" v-if="chosenTask.burned">Время истекло</b>
          </h2>
        </div>
        <div v-if="chosenTask.title">
          <h3 class="taskTitle">Задание</h3>
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
        <textarea rows="5" class="Textarea" v-model="inputMarkMessage" placeholder="Введите комментарий к оценке"/>
        <div class="SelectContainer">
          <p class="selectMarkText">Оцените задание</p>
          <input type="number" v-model="inputMark">
        </div>
        <div v-if="chosenTask.files">
          <DownloadFile
              v-for="(file, index) in chosenTask.files"
              :key="index + file.name"
              class="downloadFile"
              :filename="file.name"
              :href="file.href"/>
        </div>
        <div>
          <h2>Прикрепить файлы к заданию</h2>
          <input ref="input" type="file" @change="loadFile" multiple>
        </div>
        <Button
            class="Button"
            @click="sendTaskMark(chosenTask.id)"
            :text="'Поставить оценку'"
        />
        <div v-if="chosenTask.options &&
        chosenTask.options.length > 1" class="buttonsContainer">
          <Button
              @click="setTaskStatus(chosenTask.id, option)"
              v-bind="option"
              v-for="(option, index) in chosenTask.options"
              :key="index + option.text"
          />
        </div>
        <Button
            v-else-if="chosenTask.options && chosenTask.options.length"
            class="Button"
            @click="setTaskStatus(chosenTask.id, chosenTask.options[0])"
            v-bind="chosenTask.options[0]"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import defaultUserIcon from "@/assets/default_user_icon.png";
import Modal from "../../components/modal";
import Button from "../../components/customButton";
import Selector from "../../components/selector";
import DownloadFile from '../../components/downloadFile'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Journal",
  components: {
    Modal,
    Button,
    DownloadFile,
    Selector
  },
  computed: {
    ...mapGetters(['editableMode', 'groups', 'subjects', 'journalTable']),
    disabledButton() {
      return !this.chosenSubject && !this.chosenGroup;
    },
  },
  data() {
    return {
      modalIsOpened: false,
      editableModalIsOpened: false,
      inputMarkMessage: 'Молодец!',
      inputMark: 5,
      chosenTask: {},
      chosenSubject: 0,
      chosenGroup: 0,
      defaultUserIcon: defaultUserIcon,
      formData: new FormData(),
    };
  },
  async mounted() {
    await this.reloadTable();
  },
  methods: {
    ...mapActions(['uploadFile', 'fetchGroupSubjectJournalTable', 'setTaskMark', 'updateTaskStatus', 'fetchStudentSubjectJournalTable']),
    async reloadTable() {
      if (this.editableMode) {
        const groupId = this.chosenGroup || this.groups[0].id;
        const subjectId = this.chosenSubject || this.subjects[0].id
        await this.fetchGroupSubjectJournalTable(`groupId=${groupId}&subjectId=${subjectId}`);
      } else {
        await this.fetchStudentSubjectJournalTable();
      }
    },
    openModal(item) {
      this.chosenTask = item.data;
      if (item.data && !this.editableMode) {
        this.toggleModal();
      }
      if (this.editableMode && item.data) {
        this.toggleEditModal();
      }
    },
    toggleModal() {
      if (this.editableMode) {
        this.editableModalIsOpened = !this.editableModalIsOpened;
      } else {
        this.modalIsOpened = !this.modalIsOpened;
      }
    },
    toggleEditModal() {
      this.editableModalIsOpened = !this.editableModalIsOpened;
    },
    async setTaskStatus(id, status) {
      await this.updateTaskStatus({answerId: id, status: status.action});
      this.toggleModal();
      this.clearFields();
      await this.reloadTable();
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
        mark: Number(this.inputMark)
      });
      await this.reloadTable();
      this.toggleEditModal();
      this.clearFields();
    },
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    async onChoose() {
      await this.reloadTable(this.chosenGroup, this.chosenSubject);
    },
    async loadFile(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append(`file-${i + 1}`, event.target.files[i]);
      }
      await this.uploadFile({taskId: this.chosenTask.id, formData: this.formData});
      this.formData = new FormData();
    },
  },
};
</script>

<style scoped>
.table {
  overflow-x: auto;
}

.row {
  display: flex;
}

.cell {
  display: flex;
  height: 50px;
  min-width: 100px;
  width: 100px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 0.5px solid gray;
  align-items: center;
  justify-content: center;
}

.firstCell {
  position: sticky;
  background-color: #cccccc;
  min-width: 200px;
  width: 200px;
  justify-content: flex-start;
  left: 0;
}

.pointer {
  cursor: pointer;
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

.heading {
  position: fixed;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
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

.centering {
  justify-content: center;
}

.wrapper {
  height: 75px;
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

.taskTitle,
.taskSubtitle,
.taskDescription,
.taskComment,
.personName,
.personPosition {
  margin: 0 0 10px 0;
}

.burned {
  background-color: #ff7f5b;
}

.titleBurned {
  color: #ff7f5b;
}

.selectMarkText {
  margin: 0 12px 0 0;
}
</style>
