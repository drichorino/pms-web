<template>
    <v-container>
        <v-layout>
            <v-flex md-12>
                <v-card class="pb-2">
                    <v-card-title>
                        <h2><span class="blue--text">SITE | </span>{{ site_name }} <v-icon>mdi-chevron-right</v-icon> <span>{{ project_name }} </span></h2> 
                    </v-card-title>
                   
                </v-card>


            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
import SitesAPI from "../../api/sites/api"
import * as _ from 'lodash'

    export default {
        name: "ProjectInSiteView",
        
        data: () => ({
            site_id: '',
            site_name: '',
            project_id: '',
            project_name: '',
        }),

        mounted() {
            this.initialize()
        },

        methods: {            
            async initialize() {
                this.site_id = this.$route.query.site_id
                this.site_name = this.$route.query.site_name
                this.project_id = this.$route.query.project_id                
                this.project_name = this.$route.query.project_name

            // const payload = {
            //     "id": this.site_id
            // }

            // const api_response = await SitesAPI.view(payload)

            // if (api_response.status === 1) {
            //     this.site = api_response.outputData.data.payload.site
            //     this.projects_not_in_site = api_response.outputData.data.payload.projects_not_in_site
            //     this.projects_in_site = api_response.outputData.data.payload.projects_in_site
            //     this.employees_not_in_site = api_response.outputData.data.payload.employees_not_in_site
            //     this.employees_in_site = api_response.outputData.data.payload.employees_in_site
            //     this.loadingDataTable = false

            // } else if (api_response.status === 0) {
            //     return this.$nuxt.error({ statusCode: 404 })
            // }
        },
        },


    }

</script>

<style lang="scss" scoped>

</style>