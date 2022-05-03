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
      default: 'file'
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
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
    },
  }
}
</script>

<style scoped>
</style>
