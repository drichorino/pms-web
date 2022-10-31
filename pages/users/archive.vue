<template>
    <div>
        <v-data-table :headers="headers" :items="users" :search="search" @click:row="handleClick" sort-by="last_name"
            class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
            <template v-slot:item.is_superuser="{ item }">
                <v-chip :color="isSuperuserColor(item.is_superuser)" dark>
                    {{ isSuperuser(item.is_superuser) }}
                </v-chip>
            </template>

            <template v-slot:item.is_staff="{ item }">
                <v-chip :color="isStaffColor(item.is_staff)" dark>
                    {{ isStaff(item.is_staff) }}
                </v-chip>
            </template>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Archived Users List</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line outlined
                        hide-details clearable rounded dense></v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>

                    <v-dialog v-model="dialogRestore" max-width="500px">
                        <v-card>
                            <v-card-title class="text-center">Are you sure you want to reactivate this user?
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeRestore">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="restoreItemConfirm(editedItem.email)">OK
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="restoreItem(item)">
                    mdi-restore
                </v-icon>
            </template>
            <template v-slot:no-data>
                {{ noDataMessage }}
            </template>
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
import UsersAPI from "../../api/users/api"

export default {

    name: 'UsersPage',

    data: () => ({
        users: [],
        search: '',
        dialog: false,
        dialogRestore: false,
        snackbar: false,
        snackbarColor: '',
        noDataMessage: '',
        loadingDataTable: true,
        responseMessage: '',
        timeout: 7000,
        headers: [
            {
                text: 'First Name',
                align: 'start',
                sortable: true,
                value: 'first_name',
                class: "blue--text"
            },
            {
                text: 'Last Name',
                align: 'start',
                sortable: true,
                value: 'last_name',
                class: "blue--text"
            },
            {
                text: 'Email Address',
                value: 'email',
                sortable: true,
                class: "blue--text"
            },
            {
                text: 'Admin',
                value: 'is_superuser',
                sortable: true,
                class: "blue--text"
            },

            {
                text: 'Staff',
                value: 'is_staff',
                sortable: true,
                class: "blue--text"
            },
            {
                text: 'Actions',
                value: 'actions',
                sortable: false,
                class: "blue--text"

            },
        ],
        editedIndex: -1,
        editedItem: {
            first_name: '',
            last_name: '',
            email: '',
        },
        defaultItem: {
            first_name: '',
            last_name: '',
            email: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Add User' : 'Edit User'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogRestore(val) {
            val || this.closeRestore()
        },
    },

    async created() {
        // fetch on init
        this.initialize()

    },

    methods: {
        async initialize() {
            const api_response = await UsersAPI.archive()

            if (api_response.status === 1) {
                console.log(api_response)
                this.users = api_response.outputData.data.payload
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.noDataMessage = api_response.outputData.response.data.message
            }

            this.loadingDataTable = false
        },

        handleClick(row) {
            // set active row and deselect others
            /*
            this.users.map((item, index) => {
                item.selected = item === row

                this.$set(this.users, index, item)
            })
            */

            // or just do something with your current clicked row item data
            console.log(row.first_name)
        },

        isSuperuser(is_superuser) {
            if (is_superuser) return 'Yes'
            else return 'No'
        },

        isSuperuserColor(is_superuser) {
            if (is_superuser) return 'green'
            else return 'red'
        },

        isStaff(is_staff) {
            if (is_staff) return 'Yes'
            else return 'No'
        },

        isStaffColor(is_staff) {
            if (is_staff) return 'blue'
            else return 'red'
        },

        restoreItem(item) {
            this.editedIndex = this.users.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogRestore = true
        },

        async restoreItemConfirm(email) {
            console.log(email)
            const payload = {
                "email": email
            }
            const api_response = await UsersAPI.restore(payload);

            if (api_response.status === 1) {
                console.log(api_response);
                this.users = api_response.outputData.data.payload;
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.users = []
                this.initialize()
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message);
                this.responseMessage = api_response.outputData.response.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.users = []
                this.initialize()
            }

            this.closeRestore();
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeRestore() {
            this.dialogRestore = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

    },
}
</script>