<template>
  <div class="table">
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
        <h2 v-if="chosenItem.status" class="taskStatus">
          {{ chosenItem.status }}
        </h2>
        <p v-if="chosenItem.title" class="taskTitle">{{ chosenItem.title }}</p>
        <p v-if="chosenItem.subtitle" class="taskSubtitle">
          {{ chosenItem.subtitle }}
        </p>
        <p v-if="chosenItem.description" class="taskDescription">
          {{ chosenItem.description }}
        </p>
        <div v-if="chosenItem.person">
          <div v-if="chosenItem.person.image" class="studentAvatarContainer">
            <img
                class="studentAvatar"
                :src="chosenItem.person.image || defaultUserIcon"
                alt="student_image"
            />
          </div>
          <p>{{ chosenItem.person.position }}</p>
          <div class="personContacts">
            <div class="personContactsContent">
              <p class="personContactsText">Почта</p>
              <p class="personContactsText">Телефон</p>
            </div>
            <div class="personContactsContent">
              <a
                  class="personContactsText"
                  :href="`mailto:${chosenItem.person.email}`"
              >{{ chosenItem.person.email }}
              </a>
              <a
                  class="personContactsText"
                  :href="`tel:+${chosenItem.person.tel}`"
              >Позвонить {{ chosenItem.person.tel }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="chosenItem.startDate || chosenItem.endDate" class="taskDate">
          <p class="taskDate">{{ chosenItem.startDate }}</p>
          <span class="taskSeparator">---</span>
          <p class="taskDate">{{ chosenItem.endDate }}</p>
        </div>
        <div v-if="chosenItem.options" class="buttonsContainer">
          <Button
              @click="setTaskStatus(chosenItem.id, option)"
              v-bind="option"
              v-for="(option, index) in chosenItem.options"
              :key="index + option.text"
          />
        </div>
      </div>
    </Modal>
    <Modal @close="toggleEditModal" v-if="editableModalIsOpened">
      <div class="modalContent">
        <h1>Выставление оценки</h1>
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
        <Button
            class="Button"
            @click="setTaskMark(chosenItem.id)"
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
import {mapGetters} from "vuex";

export default {
  name: "index",
  components: {
    Modal,
    Button,
  },
  computed: {
    ...mapGetters(['editableMode'])
  },
  data() {
    return {
      modalIsOpened: false,
      editableModalIsOpened: false,
      inputMarkMessage: '',
      inputMark: 5,
      chosenItem: {},
      defaultUserIcon: defaultUserIcon,
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
            }
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
            id: "123",
            data: {
              id: "123",
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
            id: "1233",
            data: {
              id: "1233",
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
          {
            text: "",
            status: "",
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
    openModal(item) {
      this.chosenItem = item.data;
      if (item.data && !this.editableMode) {
        this.toggleModal();
      }
      if (this.editableMode && item.data && this.chosenItem.editable) {
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
    }
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
</style>
