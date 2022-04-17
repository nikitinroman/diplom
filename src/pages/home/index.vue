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
        <p class="content">{{ direction }}</p>
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
          :src="student.imageLink || defaultUserIcon"
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
            :src="chosenStudent.imageLink || defaultUserIcon"
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
            <a class="studentContactsText" :href="`tel:+${chosenStudent.phone}`"
              >Позвонить {{ chosenStudent.phone }}</a
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

import {requestWrapper} from "@/requestHelpers/requestHelper.js";
import { GROUP_INFO_URL}  from "@/requestHelpers/endpoints.ts"
import {mapGetters} from "vuex";

export default {
  name: "Home",
  components: {
    Modal,
    Button,
  },
  computed: {
    ...mapGetters(['token', 'userId', 'groupId']),
  },
  mounted() {
    this.fetchGroupData();
  },
  methods: {
    toggleModal() {
      this.modalIsVisible = !this.modalIsVisible;
    },
    showStudentInfo(index) {
      this.chosenStudent = this.students[index];
      this.toggleModal();
    },
    async fetchGroupData() {
      const response = await requestWrapper({additionUrl: GROUP_INFO_URL, userID: this.userId, token: this.token, method: "GET", getParam: this.groupId});
      this.faculty = response.group?.faculty;
      this.direction = response.group?.direction;
      this.groupName = response.group?.groupName;
      this.students = response.students;
    },
  },
  data() {
    return {
      modalIsVisible: false,
      chosenStudent: {},
      defaultUserIcon: defaultUserIcon,
      faculty: "",
      direction: "",
      groupName: "",
      students: [],
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
