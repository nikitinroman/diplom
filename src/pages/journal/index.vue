<template>
  <div class="table">
    <div v-if="editableMode" class="heading">
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
      <Button
          class="button"
          @click="onChoose"
          text="Выбрать"
          :disabled="disabledButton"
      />
    </div>
    <div class="row" v-for="(row, index) in table" :key="index">
      <div
          :class="['cell', { firstCell: item.firstCell, pointer: item.data }]"
          v-for="(item, index) in row"
          :key="item.id + item.text + index"
          @click="openModal(item)"
      >
        <span>{{ item.text || item.status }}</span>
      </div>
    </div>
    <Modal @close="toggleModal" v-if="modalIsOpened">
      <div class="modalContent">
        <h2 v-if="chosenTask.status" class="taskStatus">
          {{ chosenTask.status }}
        </h2>
        <p v-if="chosenTask.title" class="taskTitle">{{ chosenTask.title }}</p>
        <p v-if="chosenTask.subtitle" class="taskSubtitle">
          {{ chosenTask.subtitle }}
        </p>
        <p v-if="chosenTask.description" class="taskDescription">
          {{ chosenTask.description }}
        </p>
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
        <div v-if="chosenTask.startDate || chosenTask.endDate" class="taskDate">
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
        <div v-if="chosenTask.options" class="buttonsContainer">
          <Button
              @click="setTaskStatus(chosenTask.id, option)"
              v-bind="option"
              v-for="(option, index) in chosenTask.options"
              :key="index + option.text"
          />
        </div>
      </div>
    </Modal>
    <Modal @close="toggleEditModal" v-if="editableModalIsOpened" :overflow="true">
      <div class="modalContent">
        <h1>Выставление оценки</h1>
        <h2 v-if="chosenTask.status" class="taskStatus">
          {{ chosenTask.status }}
        </h2>
        <p v-if="chosenTask.title" class="taskTitle">{{ chosenTask.title }}</p>
        <p v-if="chosenTask.subtitle" class="taskSubtitle">
          {{ chosenTask.subtitle }}
        </p>
        <p v-if="chosenTask.description" class="taskDescription">
          {{ chosenTask.description }}
        </p>
        <textarea rows="5" class="Textarea" v-model="inputMarkMessage" placeholder="Введите комментарий к оценке"/>
        <div class="SelectContainer">
          <p>Выберите оценку из списка</p>
          <select class="Select" v-model="inputMark" name="marks" id="marks">
            <optgroup label="Положительные оценки">
              <option value="5">Отлично</option>
              <option value="4">Хорошо</option>
              <option value="3">Удовлетворительно</option>
            </optgroup>
            <optgroup label="Негативные оценки">
              <option value="2">Неудовлетворительно</option>
              <option value="1">Не выполнено</option>
            </optgroup>
          </select>
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
          <input type="file" @change="loadFile" multiple>
        </div>
        <Button
            class="Button"
            @click="setTaskMark(chosenTask.id)"
            :text="'Поставить оценку'"
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
  name: "index",
  components: {
    Modal,
    Button,
    DownloadFile,
    Selector
  },
  computed: {
    ...mapGetters(['editableMode', 'groups', 'subjects']),
    disabledButton() {
      return !this.chosenSubject && !this.chosenGroup;
    },
  },
  data() {
    return {
      modalIsOpened: false,
      editableModalIsOpened: false,
      inputMarkMessage: '',
      inputMark: 5,
      chosenTask: {},
      chosenSubject: "",
      chosenGroup: "",
      defaultUserIcon: defaultUserIcon,
      formData: new FormData(),
      table: [
          [
            {
              firstCell: true,
              text: "Дата"
            },
            {
              text: "06.09.2000"
            },
            {
              text: "06.09.2000"
            },
            {
              text: "06.09.2000"
            },
            {
              text: "06.09.2000"
            },
            {
              text: "06.09.2000"
            },
            {
              text: "Сумма баллов"
            },
          ],
        [
          {
            firstCell: true,
            text: "Русский",
            data: {
              title: "Русский язык",
              description:
                  "Русский языкРусский языкРусский языкРусский языкРусский языкРусский языкРусский языкРусский языкРусский язык",
              person: {
                name: "Русский Русский Русскович",
                position: "Старший преподаватель",
                image: defaultUserIcon,
                email: "romnikitin@ozon.ru",
                tel: "79179223089",
              },
            },
          },
          {
            text: "5",
            status: "To do",
            id: "1",
            data: {
              id: "1",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "",
            status: "In progress",
            id: "2",
            data: {
              id: "2",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "5",
            status: "To do",
            id: "12н34",
            data: {
              id: "12н34",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "",
            status: "To do",
            id: "12ааа3",
            data: {
              id: "12ааа3",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {},
          {
            text: "5",
          },
        ],
        [
          {
            firstCell: true,
            text: "English",
            data: {
              title: "english язык",
              description:
                  "Русский языкРуenglish языкenglish языкenglish языксский языкРусскийenglish языкenglish языкenglish языкenglish языкenglish язык языкРусский языкРусский языкРусский языкРусский языкРусский языкРусский язык",
              person: {
                name: "english язык english язык Русскович",
                position: "Старший преподаenglish языкватель",
                image: defaultUserIcon,
                email: "romnikitin@ozon.ru",
                tel: "79179223089",
              },
            },
          },
          {
            text: "4",
            status: "To do",
            id: "123q",
            data: {
              id: "123q",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "-",
            status: "To do",
            id: "12d3",
            data: {
              id: "12d3",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "2",
            status: "To do",
            id: "123ds",
            data: {
              id: "123ds",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "2",
            status: "To do",
            id: "asda123",
            data: {
              id: "asda123",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
          {
            text: "",
            status: "To do",
            id: "12яячяччя3",
            data: {
              id: "12яячяччя3",
              title: "Задание",
              subtitle: "Краткая информация",
              startDate: "20.03.2022",
              endDate: "30.03.2022",
              status: "To do",
              editable: true,
              options: [
                {
                  text: "Начать делать",
                  action: "in_progress",
                },
                {
                  text: "На проверку",
                  action: "in_review",
                },
              ],
              description:
                  "сложное или не очень задание но все равно студент должен справиться инфа сотка",
            },
          },
        ],
      ],
    };
  },
  methods: {
    ...mapActions(['uploadFile']),
    openModal(item) {
      this.chosenTask = item.data;
      if (item.data && !this.editableMode) {
        this.toggleModal();
      }
      if (this.editableMode && item.data && this.chosenTask.editable) {
        this.toggleEditModal();
      }
    },
    toggleModal() {
      this.modalIsOpened = !this.modalIsOpened;
    },
    toggleEditModal() {
      this.editableModalIsOpened = !this.editableModalIsOpened;
    },
    setTaskStatus(id, status) {
      console.log(
          "дернуть ручку и передать айди и выбранный статус",
          id,
          status
      );
      this.toggleModal();
    },
    clearFields() {
      this.inputMarkMessage = ''
      this.inputMark = ''
    },
    setTaskMark(id) {
      console.log(
          "дернуть ручку и передать айди и поля",
          id,
          this.inputMarkMessage,
          this.inputMark
      );
      this.toggleEditModal();
      this.clearFields();
    },
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    onChoose() {
      console.log(this.chosenSubject, this.chosenGroup);
    },
    async loadFile(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.formData.append(`file-${i}`, event.target.files[i]);
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
  width: 100px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 0.5px solid gray;
  align-items: center;
  justify-content: center;
}

.firstCell {
  background-color: #cccccc;
  width: 200px;
  justify-content: flex-start;
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

.heading {
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
</style>
