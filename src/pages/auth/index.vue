<template>
  <div class="authFormContainer">
    <form class="authForm" action="">
      <h1 class="authFormTitle">Войдите в личный кабинет</h1>
      <img class="authFormImage" src="https://cdn-icons-png.flaticon.com/512/3135/3135810.png" alt="image">
      <input v-model="email" class="authFormInput" type="text" placeholder="Логин">
      <input v-model="password" class="authFormInput" type="password" placeholder="Пароль">
      <CustomButton @click="auth" class="authFormButton" text="Войти"/>
    </form>
  </div>
</template>

<script>
import CustomButton from '../../components/customButton'
import {mapGetters, mapActions} from "vuex";

export default {
  name: "Auth",
  components: {
    CustomButton
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  created() {
    if (this.getAuth) {
      this.logout();
    }
  },
  computed: {
    ...mapGetters(['getAuth'])
  },
  methods: {
    ...mapActions(['fetchAuth', 'logout']),
    async auth() {
      if (!this.getAuth) {
        await this.fetchAuth({email: this.email, password: this.password});
      }
    }
  }
}
</script>

<style scoped>
.authFormContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.authForm {
  display: flex;
  flex-direction: column;
  border: 3px solid #f1f1f1;
  border-radius: 20px;
  padding: 24px 16px;
  gap: 12px;
}

.authFormTitle {
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
  letter-spacing: 0.3px;
  color: #172133;
  margin: 0;
}

.authFormImage {
  align-self: center;
  width: 70px;
}

.authFormInput {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
