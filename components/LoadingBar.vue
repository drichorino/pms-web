<template>
    <div v-if="loading" class="loading-page">
        <div class="loading"></div>
        Loading data.
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: false,
    }),
    methods: {
        start() {
            this.loading = true
        },
        finish() {
            this.loading = false
        },
    },
}
</script>
<style scoped>
.loading-page {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1000;
    padding: 1rem;
    text-align: center;
    font-size: 2rem;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(186, 219, 233, 0.25);
    backdrop-filter: blur(5px);
}

.loading {
    margin-bottom: 10px;
    border-radius: 50%;
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #094db3; /* Blue */
    width: 80px;
    height: 80px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}
</style>
  