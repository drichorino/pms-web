<template>
    <div>
        {{ project_id }}
    </div>
</template>
<script>
export default {
    data: () => ({
        project_id: '',
    }),

    mounted() {
        this.initialize()
    },

    methods: {
        initialize() {
            this.project_id = this.$route.query.project_id
            console.log(this.project_id)
        },
    }
}
</script>
<style>

</style>