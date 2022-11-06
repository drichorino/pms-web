<template>
    <v-container>
        <v-layout>
            <v-flex md-12>
                <v-card class="pb-2">
                    <v-card-title>
                        <h2><span class="blue--text">SITE | </span>{{ site.name }}</h2>
                    </v-card-title>

                    <v-card-actions class="ml-2">
                        <v-dialog v-model="dialog" max-width="80%">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Assign Project
                                </v-btn>
                            </template>
                            <!-- ADD PROJECT MODAL START -->
                            <v-card class="pa-5">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                                    <v-btn color="blue darken-1" text @click="save()" :disabled="disabled"> Save
                                    </v-btn>
                                </v-card-actions>
                                <v-combobox v-model="projects_to_add" :items="projects_not_in_site" item-text="name"
                                    item-value="id" label="Select Projects" clearable outlined multiple chips
                                    deletable-chips>
                                </v-combobox>


                            </v-card>
                        </v-dialog>
                        <v-btn color=primary>Edit Site</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>


            </v-flex>
        </v-layout>
        <!-- ADD PROJECT MODAL END -->

        <v-card class="mt-6">
            <v-data-table :headers="headers" :items="projects_in_site" :search="searchProject" sort-by="name"
                class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
                <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Projects</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="searchProject" append-icon="mdi-magnify" label="Search" maxlength="100"
                            single-line outlined hide-details clearable rounded dense></v-text-field>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h6">Are you sure you want to unassign this project?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="unassignProjectConfirm(editedItem.id)">OK
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small @click.stop.prevent="unassignProject(item)"> mdi-delete </v-icon>
                </template>
                <template v-slot:no-data> No active projects. </template>
            </v-data-table>
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


        //table data
        loadingDataTable: true,
        searchProject: '',
        dialogDelete: false,
        headers: [
            {
                text: "Name",
                align: "start",
                sortable: true,
                value: "name",
                class: "blue--text",
            },
            {
                text: "Created At",
                align: "start",
                sortable: true,
                value: "created_at",
                class: "blue--text",
            },
            {
                text: "Updated At",
                align: "start",
                sortable: true,
                value: "updated_at",
                class: "blue--text",
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false,
                class: "blue--text",
            },
        ],
        editedIndex: -1,
        editedItem: {
            name: "",
        },
        defaultItem: {
            name: "",
        },
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

        //site view
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
                this.loadingDataTable = false

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


        //projects table
        formatDate(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            date = new Date(date)
            date = date.toLocaleDateString("en-US", options)
            return date
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        unassignProject(item) {
            this.editedIndex = this.projects_in_site.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async unassignProjectConfirm(id) {
            this.$nuxt.$loading.start()
            const payload = {
                "project_id": id,
                "site_id": this.site_id
            }

            const api_response = await SitesAPI.unassign_project(payload)

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

            this.closeDelete()
            this.$nuxt.$loading.finish()
        },
    },
}
</script>
<style>

</style>