<template>
  <div>
    <iframe :src='iframeUrl' id='show' width='100%' height="780px" frameborder=0
            name='showHere'></iframe>
  </div>
</template>

<script>
  export default {
    name: "job",
    computed: {
      iframeUrl() {
        if (process.env.NODE_ENV == 'development') {
          return 'http://192.168.3.30:19091/xxl-job-admin/toLogin'
        } else {
          return 'http://47.92.91.63:19091/xxl-job-admin/toLogin'
        }
      }
    }
  }
</script>
