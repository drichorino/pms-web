<template>
    <div>
        <h3 class="page-title">ARCHIVED PROJECTS</h3>
        <v-data-table :headers="headers" :items="projects" :search="search" @click:row="handleClick" sort-by="name"
            class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
            <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
            </template>
            <template v-slot:item.deleted_at="{ item }">
                {{ formatDate(item.deleted_at) }}
            </template>

            <template v-slot:top>
                <v-toolbar flat>                    
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line outlined
                        hide-details clearable rounded dense></v-text-field>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h6">Are you sure you want to reactivate this project?
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeRestore">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="restoreItemConfirm(editedItem.id)">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="restoreItem(item)"> mdi-restore </v-icon>
            </template>
            <template v-slot:no-data> No archived projects. </template>


        </v-data-table>
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
    </div>

</template>
    
<script>
import ProjectsAPI from "../../api/projects/api"

export default {
    name: "ArchivedProjectsPage",

    data: () => ({
        projects: [],
        search: "",
        dialog: false,
        dialogDelete: false,
        snackbar: false,
        snackbarColor: '',
        responseMessage: '',
        timeout: 7000,
        loadingDataTable: true,
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
                text: "Deleted At",
                align: "start",
                sortable: true,
                value: "deleted_at",
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

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Add Project" : "Edit Project"
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeRestore()
        },
    },

    created() {
        // fetch on init
        this.initialize()
    },

    methods: {
        async initialize() {
            const api_response = await ProjectsAPI.archive()

            if (api_response.status === 1) {
                console.log(api_response)
                this.projects = api_response.outputData.data.payload
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
            }

            this.loadingDataTable = false
        },

        handleClick(row) {
            // set active row and deselect others
            /*
                  this.projects.map((item, index) => {
                      item.selected = item === row
      
                      this.$set(this.projects, index, item)
                  })
                  */

            // or just do something with your current clicked row item data
            console.log(row.name)
        },

        formatDate(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            date = new Date(date)
            date = date.toLocaleDateString("en-US", options)
            return date
        },

        editItem(item) {
            console.log(item)
            this.editedIndex = this.projects.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        restoreItem(item) {
            console.log(item)
            this.editedIndex = this.projects.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async restoreItemConfirm(id) {
            console.log(id)
            const payload = {
                "id": id
            }
            const api_response = await ProjectsAPI.restore(payload)

            if (api_response.status === 1) {
                console.log(api_response)
                this.projects = api_response.outputData.data.payload
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.projects = []
                this.initialize()
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.responseMessage = api_response.outputData.response.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.projects = []
                this.initialize()
            }

            //this.projects.splice(this.editedIndex, 1)
            this.closeRestore()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeRestore() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save(id, name) {
            const payload = {
                "id": id,
                "name": name
            }
            const api_response = await ProjectsAPI.edit(payload)

            if (api_response.status === 1) {
                console.log(api_response)
                this.projects = api_response.outputData.data.payload
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.projects = []
                this.initialize()
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.projects = []
                this.initialize()
            }

            this.close()
        },
    },
}
</script>
    
<style lang="scss" scoped>

.page-title {
    color: white;
    background-color: #1976D2;
    margin-bottom: 12px;
    padding: 6px 0 6px 0;
    border-radius: 10px;
    text-align: center;
}

</style>