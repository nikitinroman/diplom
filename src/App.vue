<template>
  <div id="app">
    <NavBar/>
    <div class="mainContent">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import NavBar from './components/navbar'
import Footer from './components/footer'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer
  },
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.mainContent {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  padding: 20px;
  box-sizing: border-box;
}
</style>
