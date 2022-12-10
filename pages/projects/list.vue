<template>
    <div>
        <h3 class="page-title">ACTIVE PROJECTS</h3>
        <v-data-table :headers="headers" :items="projects" :search="search" @click:row="handleClick" sort-by="name"
            class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
            <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
            </template>
            <template v-slot:item.updated_at="{ item }">
                {{ formatDate(item.updated_at) }}
            </template>

            <template v-slot:top>
                <v-toolbar flat>                    
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" maxlength="100" single-line
                        outlined hide-details clearable rounded dense></v-text-field>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                Add Project
                            </v-btn>
                        </template>

                        <!-- ADD AND EDIT MODAL START -->
                        <v-card>
                            <ValidationObserver ref="form" v-slot="{ invalid }">
                                <form @submit.prevent="save(editedItem)">
                                    <v-card-title>
                                        <span class="text-h6">{{ formTitle }}</span>
                                    </v-card-title>


                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <ValidationProvider v-slot="{ errors }" name="Name"
                                                        rules="required">
                                                        <v-text-field v-model="editedItem.name" label="Name"
                                                            :counter="100" :error-messages="errors" maxlength="100"
                                                            required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Owner"
                                                        rules="required">
                                                        <v-text-field v-model="editedItem.owner" label="Owner"
                                                            :counter="100" :error-messages="errors" maxlength="100"
                                                            required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Contract Price"
                                                        rules="double">
                                                        <v-text-field v-model="editedItem.contract_price" label="Contract Price"
                                                            :error-messages="errors"
                                                            required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Total Payment"
                                                        rules="double">
                                                        <v-text-field v-model="editedItem.total_payment" label="Total Payment"
                                                            :error-messages="errors"
                                                            required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Balance"
                                                        rules="double">
                                                        <v-text-field v-model="editedItem.balance" label="Balance"
                                                            :error-messages="errors"
                                                            required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>


                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                                        <v-btn color="blue darken-1" text @click="save(editedItem)"
                                            :disabled="invalid"> Save
                                        </v-btn>
                                    </v-card-actions>
                                </form>
                            </ValidationObserver>
                        </v-card>
                        <!-- ADD AND EDIT MODAL END -->

                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h6">Are you sure you want to deactivate this project?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm(editedItem)">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click.stop.prevent="editItem(item)"> mdi-pencil </v-icon>
                <v-icon small @click.stop.prevent="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data> No active projects. </template>


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
    name: "ProjectsPage",

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
                text: "Owner",
                align: "start",
                sortable: true,
                value: "owner",
                class: "blue--text",
            },
            {
                text: "Contract Price",
                align: "start",
                sortable: true,
                value: "contract_price",
                class: "blue--text",
            },
            {
                text: "Total Payment",
                align: "start",
                sortable: true,
                value: "total_payment",
                class: "blue--text",
            },
            {
                text: "Balance",
                align: "start",
                sortable: true,
                value: "balance",
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
            owner: "",
            contract_price: "",
            total_payment: "",
            balance: "",
        },
        defaultItem: {
            name: "",
            owner: "",
            contract_price: "",
            total_payment: "",
            balance: "",
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
            val || this.closeDelete()
        },
    },

    created() {
        // fetch on init
        this.initialize()
    },

    methods: {
        async initialize() {
            const api_response = await ProjectsAPI.list()

            if (api_response.status === 1) {
                console.log(api_response)
                this.projects = api_response.outputData.data.payload
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
            }

            this.loadingDataTable = false
        },

        handleClick(row) {
            console.log(row.id);
            // set active row and deselect others
            /*
                  this.projects.map((item, index) => {
                      item.selected = item === row
      
                      this.$set(this.projects, index, item)
                  })
                  */
            this.$router.push({ path: '/projects/view', query: { project_id: row.id } })
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

        deleteItem(item) {
            console.log(item)
            this.editedIndex = this.projects.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm(item) {
            console.log(item.id)
            const payload = {
                "id": item.id
            }
            const api_response = await ProjectsAPI.deactivate(payload)

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
                this.responseMessage = api_response.outputData.data.response.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.projects = []
                this.initialize()
            }

            //this.projects.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.$refs.form.reset()
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save(item) {
            this.$refs.form.validate()
            const payload = item

            if (this.editedIndex === -1) {
                //ADD ITEM                
                const api_response = await ProjectsAPI.add(payload)

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

            } else {

                //EDIT ITEM
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
                    this.responseMessage = api_response.outputData.response.data.message
                    this.snackbarColor = 'error'
                    this.snackbar = true
                    this.projects = []
                    this.initialize()
                }
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