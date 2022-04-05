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
  min-height: 100vh;
}
.mainContent {
  min-height: calc(100vh - 117px);
  padding: 20px;
  box-sizing: border-box;
}
</style>
