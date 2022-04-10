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
    <h2>Задание</h2>
    <textarea rows="5" class="Textarea" v-model="title" placeholder="Введите название задания"/>
    <h2>Краткое описание</h2>
    <textarea rows="5" class="Textarea" v-model="subtitle" placeholder="Введите краткое описание задания"/>
    <h2>Полное описание</h2>
    <textarea rows="10" class="Textarea" v-model="description" placeholder="Введите полное описание задания"/>
    <div>
      <h2>Прикрепить файлы к заданию</h2>
      <input type="file" @change="loadFile" multiple>
    </div>
    <div class="endDateContainer">
      <p>Дедлайн:</p>
      <input type="date" id="endDate" name="endDate"
             v-model="chosenDate"
             max="2022-12-31">
    </div>
    <CustomButton text="Создать" @click="createTask"/>
  </div>
</template>

<script>
import CustomButton from "../../components/customButton";
import Selector from "../../components/selector";

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
      chosenGroup: "",
      title: "",
      subtitle: "",
      endDate: "",
      description:"",
      chosenDate: '',
      files: [],
      otherSubjects: ["Матан", "Англ", "Русич"],
      otherGroups: ["Пи18-2", "Пи18", "Пи18Пи18"],
    }
  },
  computed: {
    disabledButton() {
      return !this.chosenSubject && !this.chosenGroup;
    },
  },
  mounted() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    }
    if(mm<10){
      mm='0'+mm
    }
    today = yyyy+'-'+mm+'-'+dd;

    document.getElementById("endDate").setAttribute("min", today);
  },
  methods: {
    loadFile(event) {
      const data = new FormData()
      data.append('files', event.target.files)

      fetch(this.loadHref, {
        method: 'POST',
        body: data
      })
    },
    changeSubject(val) {
      this.chosenSubject = val;
    },
    changeGroup(val) {
      this.chosenGroup = val;
    },
    createTask() {
      console.log('createTask');
    },
    onChoose() {
      console.log(this.chosenSubject, this.chosenGroup);
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
