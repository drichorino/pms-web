<template>
    <div>
        <v-data-table :headers="headers" :items="sites" :search="search" @click:row="handleClick" sort-by="name"
            class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
            <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
            </template>
            <template v-slot:item.updated_at="{ item }">
                {{ formatDate(item.updated_at) }}
            </template>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Sites List</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" maxlength="100" single-line
                        outlined hide-details clearable rounded dense></v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                Add Site
                            </v-btn>
                        </template>

                        <!-- ADD AND EDIT MODAL START -->
                        <v-card>
                            <ValidationObserver ref="form" v-slot="{ invalid }">
                                <form @submit.prevent="save(editedItem.id, editedItem.name)">
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
                                        </v-container>
                                    </v-card-text>


                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                                        <v-btn color="blue darken-1" text @click="save(editedItem.id, editedItem.name)"
                                            :disabled="invalid"> Save
                                        </v-btn>
                                    </v-card-actions>
                                </form>
                            </ValidationObserver>
                        </v-card>
                        <!-- ADD AND EDIT MODAL END-->

                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h6">Are you sure you want to delete this project?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm(editedItem.id)">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data> No active sites. </template>


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
import SitesAPI from "../../api/sites/api";

export default {
    name: "SitesPage",

    data: () => ({
        sites: [],
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

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Add Site" : "Edit Site";
        },
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },

    created() {
        // fetch on init
        this.initialize()
    },

    methods: {
        async initialize() {
            const api_response = await SitesAPI.list();

            if (api_response.status === 1) {
                console.log(api_response);
                this.sites = api_response.outputData.data.payload;
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message);
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
            console.log(row.name);
        },

        formatDate(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            date = new Date(date)
            date = date.toLocaleDateString("en-US", options)
            return date
        },

        editItem(item) {
            console.log(item)
            this.editedIndex = this.sites.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            console.log(item)
            this.editedIndex = this.sites.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async deleteItemConfirm(id) {
            console.log(id)
            const payload = {
                "id": id
            }
            const api_response = await SitesAPI.deactivate(payload);

            if (api_response.status === 1) {
                console.log(api_response);
                this.sites = api_response.outputData.data.payload;
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.sites = []
                this.initialize()
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message);
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.sites = []
                this.initialize()
            }

            //this.sites.splice(this.editedIndex, 1);
            this.closeDelete();
        },

        close() {
            this.$refs.form.reset();
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        async save(id = null, name) {
            this.$refs.form.validate()

            if (this.editedIndex === -1) {
                //ADD ITEM

                const payload = {
                    "name": name
                }
                const api_response = await SitesAPI.add(payload);

                if (api_response.status === 1) {
                    console.log(api_response);
                    this.sites = api_response.outputData.data.payload;
                    this.responseMessage = api_response.outputData.data.message
                    this.snackbarColor = 'success'
                    this.snackbar = true
                    this.sites = []
                    this.initialize()
                } else if (api_response.status === 0) {
                    console.log(api_response.outputData.response.data.message);
                    this.responseMessage = api_response.outputData.response.data.message
                    this.snackbarColor = 'error'
                    this.snackbar = true
                    this.sites = []
                    this.initialize()
                }

            } else {

                //EDIT ITEM
                const payload = {
                    "id": id,
                    "name": name
                }
                const api_response = await SitesAPI.edit(payload);

                if (api_response.status === 1) {
                    console.log(api_response);
                    this.sites = api_response.outputData.data.payload;
                    this.responseMessage = api_response.outputData.data.message
                    this.snackbarColor = 'success'
                    this.snackbar = true
                    this.sites = []
                    this.initialize()
                } else if (api_response.status === 0) {
                    console.log(api_response.outputData.response.data.message);
                    this.responseMessage = api_response.outputData.response.data.message
                    this.snackbarColor = 'error'
                    this.snackbar = true
                    this.sites = []
                    this.initialize()
                }
            }

            this.close();
        },
    },
};
</script>
