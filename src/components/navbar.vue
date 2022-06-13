<template>
  <ul class="navbar">
    <li v-if="!editableMode && getAuth" class="navbarItem" @click="clickHandler('home')">
      <h3 class="navbarItemText">Моя группа</h3>
    </li>
    <li v-if="!editableMode && getAuth" class="navbarItem" @click="clickHandler('board')">
      <h3 class="navbarItemText">Доска</h3>
    </li>
    <li class="navbarItem" @click="clickHandler('journal')">
      <h3 class="navbarItemText">Журнал</h3>
    </li>
    <li class="navbarItem" @click="clickHandler('schedule')">
      <h3 class="navbarItemText">Расписание</h3>
    </li>
    <li class="navbarItem" @click="clickHandler('miro')">
      <h3 class="navbarItemText">Совместная доска</h3>
    </li>
    <li v-if="editableMode" class="navbarItem" @click="clickHandler('myReview')">
      <h3 class="navbarItemText">Проверка работ</h3>
    </li>
    <li v-if="editableMode" class="navbarItem" @click="clickHandler('newTask')">
      <h3 class="navbarItemText">Новое задание</h3>
    </li>
    <li class="navbarLastItem" @click="clickHandler('auth')">
      <h3 class="navbarItemText">{{ authRouteName }}</h3>
    </li>
  </ul>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "navbar",
  computed: {
    ...mapGetters(['getAuth', 'editableMode']),
    authRouteName() {
      return this.getAuth ? 'Выход' : 'Авторизация'
    },
  },
  methods: {
    clickHandler(route) {
      this.$router.push(route);
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  width: 100%;
  border: 1px solid #E6E9F0;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbarItem {
  padding: 12px 16px;
  -webkit-transition-duration: 0.6s;
  transition-duration: 0.6s;
}

.navbarItemText {
  margin: 0;
}

.navbarItem:hover {
  background-color: #F5F7FA;
}

.navbarLastItem {
  margin-left: auto;
  padding: 12px 16px;
  -webkit-transition-duration: 0.6s;
  transition-duration: 0.6s;
}

.navbarLastItem:hover {
  background-color: #F5F7FA;
}
</style>
