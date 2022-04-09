<template>
  <div>
    <h1>newTask</h1>
    <input type="file" @change="loadFile" multiple>
    <a href="https://www.w3schools.com/images/myw3schoolsimage.jpg" @click.prevent="downloadFile">Скачать прикрепленный
      файл</a>
  </div>
</template>

<script>
export default {
  name: "newTask",
  methods: {
    async downloadFile() {
      fetch("https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc", {
        method: 'GET',
        mode: 'no-cors',
      }).then(response => response.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "filename.doc";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
      })
    },
    loadFile(event) {
      console.log(event.target.files, 'Это отправится на бек');

      const data = new FormData()
      data.append('files', event.target.files)
      data.append('user', 'kek')

      fetch('/andrew/server', {
        method: 'POST',
        body: data
      })
    }
  }
}
</script>

<style scoped>

</style>
