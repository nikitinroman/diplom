<template>
  <div class="defaultContainer">
    <h2 class="heading">{{ groupName }}</h2>
    <div class="groupInfo">
      <div class="groupPoints">
        <p class="point">Учебное подразделение:</p>
        <p class="point">Направление подготовки:</p>
      </div>
      <div class="groupInfoContent">
        <p class="content">
          {{ faculty }}
        </p>
        <p class="content">{{ trainingDir }}</p>
      </div>
    </div>
    <h2 class="heading">Одногруппники</h2>
    <div class="groupStudents">
      <div
        @click="showStudentInfo(index)"
        v-for="(student, index) in students"
        :key="index"
        class="studentCard"
      >
        <img
          class="studentImage"
          :src="student.image || defaultUserIcon"
          alt="student_image"
        />
        <p class="studentName">{{ student.name }}</p>
      </div>
    </div>
    <Modal @close="toggleModal" v-if="modalIsVisible">
      <div class="modal">
        <div class="studentAvatarContainer">
          <img
            class="studentAvatar"
            :src="chosenStudent.image || defaultUserIcon"
            alt="student_image"
          />
        </div>
        <h2 class="studentNameInModal">{{ chosenStudent.name }}</h2>
        <div class="studentContacts">
          <div class="studentContactsContent">
            <p class="studentContactsText">Почта</p>
            <p class="studentContactsText">Телефон</p>
          </div>
          <div class="studentContactsContent">
            <a
              class="studentContactsText"
              :href="`mailto:${chosenStudent.email}`"
              >{{ chosenStudent.email }}</a
            >
            <a class="studentContactsText" :href="`tel:+${chosenStudent.tel}`"
              >Позвонить {{ chosenStudent.tel }}</a
            >
          </div>
        </div>
        <div class="buttonContainer">
          <Button @click="toggleModal" text="Закрыть" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import defaultUserIcon from "../../assets/default_user_icon.png";
import Modal from "../../components/modal";
import Button from "../../components/customButton";

export default {
  name: "Home",

  components: {
    Modal,
    Button,
  },
  methods: {
    toggleModal() {
      this.modalIsVisible = !this.modalIsVisible;
    },
    showStudentInfo(index) {
      this.chosenStudent = this.students[index];
      this.toggleModal();
    },
  },
  data() {
    return {
      modalIsVisible: false,
      chosenStudent: {},
      defaultUserIcon: defaultUserIcon,
      faculty: "Факультет информационных технологий и анализа больших данных",
      trainingDir: "Прикладная информатика (ФГОС-3+)",
      groupName: "Группа ПИ18-2",
      students: [
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: defaultUserIcon,
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
        {
          name: "Акаев Ислам Салаудинович",
          image: "",
          email: "romnikitin@ozon.ru",
          tel: "79179223089",
        },
      ],
    };
  },
};
</script>

<style scoped>
.heading {
  margin: 0 0 20px 0;
  color: rgb(51, 51, 51);
}

.defaultContainer {
  padding: 24px;
  box-sizing: border-box;
  height: 100%;
  background: #f2f5f9;
  border-radius: 12px;
}

.groupInfo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.groupPoints {
  margin-right: 20px;
}

.point {
  margin: 0 0 8px 0;
  color: rgb(51, 51, 51);
}

.content {
  margin: 0 0 8px 0;
  color: rgb(153, 153, 153);
}

.groupStudents {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0 0 -10px;
}

.studentCard {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 10px 0 0 10px;
  width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.studentCard:hover {
  opacity: 0.7;
  cursor: pointer;
}

.studentImage {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 24px;
}

.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.modal {
  width: 400px;
}

.studentContacts {
  display: flex;
  align-items: center;
}

.studentContactsContent {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.studentContactsText {
  display: inline-block;
  margin: 20px 0 0 0;
}

.studentNameInModal {
  margin: 0 0 20px 0;
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
}

.studentName {
  text-overflow: ellipsis;
}
</style>
