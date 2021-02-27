<template>
  <div class="sales-receivable-container">
    <financial-sales-receivables-list></financial-sales-receivables-list>
  </div>
</template>

<script>
  export default {
    name: "sales-receivable",
    components: {
      'financial-sales-receivables-list': () => import('./financial-sales-receivables-list'),
      'bank-statement-list': () => import('./bank-statement-list')
    },
    data() {
      return {
        activeName: 'first'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-receivable-container {
    margin: 10px;
  }
</style>
