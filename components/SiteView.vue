<template>
    <v-container>
        <v-layout>
            <v-flex md-12>
                <v-card>
                    <v-card-title class="pa-5">
                        <h2><span class="blue--text">SITE: </span>{{ site.name }}</h2>
                    </v-card-title>

                    <v-card-actions>
                        <v-dialog v-model="dialog" max-width="90%">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Add Project
                                </v-btn>
                            </template>
                            <!-- ADD PROJECT MODAL START -->
                            <v-card class="pa-5">

                                <v-combobox v-model="projects_to_add" :items="projects_not_in_site" item-text="name"
                                    item-value="id" label="Select Projects" clearable outlined multiple chips
                                    deletable-chips>
                                </v-combobox>


                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                                    <v-btn color="blue darken-1" text @click="save()" :disabled="disabled"> Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn color=primary>Edit Site</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>

                
            </v-flex>
        </v-layout>
        <!-- ADD PROJECT MODAL END -->

        <v-card class="mt-10">
            <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in projects_in_site"
                      :key="item.id"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.created_at }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
        </v-card>


        <div class="text-center">
            <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor" absolute>
                {{ responseMessage }}

                <template v-slot:action="{ attrs }">
                    <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </div>


    </v-container>

</template>
<script>
import SitesAPI from "../api/sites/api"
import * as _ from 'lodash'

export default {
    name: "SiteView",

    data: () => ({
        dialog: false,
        site_id: '',
        project: '',
        site: '',

        projects_not_in_site: [],
        projects_in_site: [],

        projects_to_add: [],
        return_object: false,

        snackbar: false,
        snackbarColor: '',
        responseMessage: '',
        timeout: 7000,

        disabled: true,
    }),


    created() {
        this.initialize()
    },

    watch: {
        projects_to_add: function () {
            if (this.projects_to_add.length > 0) {
                this.disabled = false
            } else if (this.projects_to_add.length == 0) {
                this.disabled = true
            }
        }
    },

    methods: {
        async initialize() {
            this.site_id = this.$route.query.site_id

            const payload = {
                "id": this.site_id
            }

            const api_response = await SitesAPI.view(payload)

            if (api_response.status === 1) {
                this.site = api_response.outputData.data.payload.site
                this.projects_not_in_site = api_response.outputData.data.payload.projects_not_in_site
                this.projects_in_site = api_response.outputData.data.payload.projects_in_site

                console.log(this.projects_in_site)
            } else if (api_response.status === 0) {
                return this.$nuxt.error({ statusCode: 404 })
            }
        },


        close() {
            this.projects_to_add = []
            this.dialog = false
        },

        async save() {
            this.$nuxt.$loading.start()
            const payload = {
                "id": this.site_id,
                "projects_to_add": _.map(this.projects_to_add, 'id')
            }

            const api_response = await SitesAPI.add_project(payload)

            if (api_response.status === 1) {
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.initialize()
            } else if (api_response.status === 0) {
                this.responseMessage = api_response.outputData.response.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.initialize()
            }

            this.projects_to_add = []
            this.dialog = false
            this.$nuxt.$loading.finish()
        },
    },
}
</script>
<style>

</style>