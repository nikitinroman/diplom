<template>
  <div>
    <h1>Ваши задачи на оценку</h1>
    <div class="heading">
      <div class="container">
        <div>
          <p class="selectorTitle">Группа</p>
          <p class="selectorTitle">Предмет</p>
        </div>
        <div class="selectorsContainer">
          <Selector @change="changeGroup" :options="otherGroups" />
          <Selector @change="changeSubject" :options="otherSubjects" />
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
      <Task
        @click="choseTask(index)"
        v-bind="task"
        v-for="(task, index) in taskList"
        :key="index"
      />
    </div>
    <Modal v-if="modalIsVisible" @close="toggleModal" :overflow="true">
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
        <CustomButton
          class="Button"
          @click="setTaskMark(chosenTask.id)"
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
import defaultUserIcon from "@/assets/default_user_icon.png";

export default {
  name: "myReview",
  components: {
    CustomButton,
    Selector,
    Task,
    Modal,
  },
  data() {
    return {
      defaultUserIcon,
      chosenTask: {},
      inputMarkMessage: "",
      inputMark: 5,
      modalIsVisible: false,
      chosenSubject: "",
      chosenGroup: "",
      otherSubjects: ["Матан", "Англ", "Русич"],
      otherGroups: ["Пи18-2", "Пи18", "Пи18Пи18"],
      taskList: [
        {
          title: "Задание",
          subtitle: "Краткая информация",
          startDate: "20.03.2022",
          endDate: "30.03.2022",
          status: "To do",
          id: "123",
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
          person: {
            name: "Cтудентов студент студентыч",
            position: "Старший студентосик",
            image: "",
            email: "romnikitin@ozon.ru",
            tel: "79179223089",
          },
        },
      ],
    };
  },
  computed: {
    disabledButton() {
      return !this.chosenSubject && !this.chosenGroup;
    },
  },
  methods: {
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    onChoose() {
      console.log(this.chosenSubject, this.chosenGroup);
    },
    choseTask(index) {
      this.chosenTask = this.taskList[index];
      this.toggleModal();
    },
    toggleModal() {
      this.modalIsVisible = !this.modalIsVisible;
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
      this.toggleModal();
      this.clearFields();
    },
    toRework(id) {
      console.log(
          "дернуть ручку и передать айди и поля",
          id,
          this.inputMarkMessage,
          this.inputMark
      );
      this.toggleModal();
      this.clearFields();
    }
  },
};
</script>

<style scoped>
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
  margin-top: 24px;
  padding: 0 16px 16px 16px;
  background-color: #f2f5f9;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.modalContent {
  display: flex;
  flex-direction: column;
  width: 600px;
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
