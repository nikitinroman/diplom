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
      default: ''
    },
    filename: {
      type: String,
      default: 'file.txt'
    }
  },
  methods: {
    async downloadFile() {
      const file = await fetch(this.href, {
        method: 'GET',
      })
      const blobFile = await file.blob()
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename + '.' + this.href.split('.')[1];
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
  }
}
</script>

<style scoped>
</style>
