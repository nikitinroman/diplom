<template>
  <div>
    <a href="" @click.prevent="downloadFile">Скачать прикрепленный файл {{filename}}</a>
  </div>
</template>

<script>
export default {
  name: "downloadFile",
  props: {
    href: {
      type: String,
      default: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc'
    },
    filename: {
      type: String,
      default: 'filename'
    }
  },
  methods: {
    async downloadFile() {
      fetch(this.href, {
        method: 'GET',
        mode: 'no-cors',
      }).then(response => response.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.filename;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
      })
    },
  }
}
</script>

<style scoped>

</style>
