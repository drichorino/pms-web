<template>
    <div>
        <h3 class="page-title">ACTIVE USERS</h3>
        <v-data-table :headers="headers" :items="users" :search="search" @click:row="handleClick" sort-by="last_name"
            class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
            <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
            </template>
            <template v-slot:item.updated_at="{ item }">
                {{ formatDate(item.updated_at) }}
            </template>

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
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" maxlength="100" single-line
                        outlined hide-details clearable rounded dense></v-text-field>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                Create User
                            </v-btn>
                        </template>

                        <!-- ADD AND EDIT MODAL START -->
                        <v-card>
                            <ValidationObserver ref="form" v-slot="{ invalid }">
                                <form
                                    @submit.prevent="save(editedItem.id, editedItem.first_name, editedItem.last_name, editedItem.email, editedItem.password, editedItem.confirm_password, editedItem.is_superuser, editedItem.is_staff)">
                                    <v-card-title>
                                        <span class="text-h6">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="First Name"
                                                        rules="required">
                                                        <v-text-field v-model="editedItem.first_name" label="First Name"
                                                            maxlength="100" :error-messages="errors" required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Last Name"
                                                        rules="required">
                                                        <v-text-field v-model="editedItem.last_name" label="Last Name"
                                                            maxlength="100" :error-messages="errors" required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <ValidationProvider v-slot="{ errors }" name="Email Address"
                                                        rules="required|email">
                                                        <v-text-field v-model="editedItem.email" label="Email Address"
                                                            maxlength="100" :error-messages="errors" required>
                                                        </v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">

                                                    <ValidationProvider v-slot="{ errors }" name="Password"
                                                        :rules="passwordRules">
                                                        <v-text-field v-model="editedItem.password"
                                                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                                            :type="showPassword ? 'text' : 'password'" name="input-10-2"
                                                            label="Password" class="input-group--focused"
                                                            @click:append="showPassword = !showPassword"
                                                            :error-messages="errors" required>
                                                        </v-text-field>
                                                    </ValidationProvider>

                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" name="Confirm Password"
                                                        vid="confirm_password">
                                                        <v-text-field v-model="editedItem.confirm_password"
                                                            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                                            :type="showConfirmPassword ? 'text' : 'password'"
                                                            name="input-10-2" label="Confirm Password"
                                                            class="input-group--focused"
                                                            @click:append="showConfirmPassword = !showConfirmPassword"
                                                            @change="requirePassword(editedItem.confirm_password)"
                                                            :error-messages="errors" required>
                                                        </v-text-field>

                                                    </ValidationProvider>

                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-checkbox v-model="editedItem.is_superuser" label="Is Admin?">
                                                    </v-checkbox>
                                                </v-col>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-checkbox v-model="editedItem.is_staff" label="Is Staff?">
                                                    </v-checkbox>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">
                                            Cancel
                                        </v-btn>
                                        <v-btn color="blue darken-1" text
                                            @click="save(editedItem.id, editedItem.first_name, editedItem.last_name, editedItem.email, editedItem.password, editedItem.confirm_password, editedItem.is_superuser, editedItem.is_staff)"
                                            :disabled="invalid">
                                            Save
                                        </v-btn>
                                    </v-card-actions>
                                </form>
                            </ValidationObserver>
                        </v-card>
                    </v-dialog>

                    <!-- ADD AND EDIT MODAL END -->


                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h6">Are you sure you want to deactivate this user?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm(editedItem.email)">OK
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click.stop.prevent="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click.stop.prevent="deleteItem(item)">
                    mdi-delete
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
        dialogDelete: false,
        noDataMessage: '',
        snackbar: false,
        snackbarColor: '',
        responseMessage: '',
        timeout: 7000,
        showPassword: false,
        showConfirmPassword: false,
        passwordRow: true,
        passwordRules: 'confirmed:confirm_password|required|min:6',
        loadingDataTable: true,
        headers: [
            {
                text: 'Last Name',
                align: 'start',
                sortable: true,
                value: 'last_name',
                class: "blue--text"
            },
            {
                text: 'First Name',
                align: 'start',
                sortable: true,
                value: 'first_name',
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
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            is_superuser: false,
            is_staff: true,
        },
        defaultItem: {
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            is_superuser: false,
            is_staff: true,
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Create User' : 'Edit User'
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

            const api_response = await UsersAPI.list()

            if (api_response.status === 1) {
                console.log(api_response)
                this.users = api_response.outputData.data.payload
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.noDataMessage = api_response.outputData.response.data.message
            }

            this.loadingDataTable = false
        },

        formatDate(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            date = new Date(date)
            date = date.toLocaleDateString("en-US", options)
            return date
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

        editItem(item) {
            this.editedIndex = this.users.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.passwordRules = 'confirmed:confirm_password|min:6'
            this.dialog = true
        },

        async deleteItem(item) {
            const current_user = await UsersAPI.current()
            const current_email = current_user.outputData.data.payload.email

            if (current_email == item.email) {
                this.responseMessage = 'You are not allowed to deactivate the current logged in user.'
                this.snackbarColor = 'error'
                this.snackbar = true
            } else {
                this.editedIndex = this.users.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            }
        },

        async deleteItemConfirm(email) {

            const payload = {
                "email": email
            }
            const api_response = await UsersAPI.deactivate(payload)

            if (api_response.status === 1) {
                console.log(api_response)
                this.users = api_response.outputData.data.payload
                this.responseMessage = api_response.outputData.data.message
                this.snackbarColor = 'success'
                this.snackbar = true
                this.users = []
                this.initialize()
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.responseMessage = api_response.outputData.response.data.message
                this.snackbarColor = 'error'
                this.snackbar = true
                this.users = []
                this.initialize()
            }

            //this.users.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.$refs.form.reset()
            this.dialog = false
            this.passwordRules = 'confirmed:confirm_password|required|min:6'
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

        async save(id = null, first_name, last_name, email, password = '', confirm_password = '', is_superuser, is_staff) {
            this.$refs.form.validate()

            if (this.editedIndex === -1) {
                //ADD ITEM

                const payload = {
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "password": password,
                    "confirm_password": confirm_password,
                    "is_superuser": is_superuser,
                    "is_staff": is_staff,
                    "is_active": true
                }
                const api_response = await UsersAPI.create(payload)

                if (api_response.status === 1) {
                    console.log(api_response)
                    this.users = api_response.outputData.data.payload
                    this.responseMessage = api_response.outputData.data.message
                    this.snackbarColor = 'success'
                    this.snackbar = true
                    this.users = []
                    this.initialize()
                } else if (api_response.status === 0) {
                    console.log(api_response.outputData.response.data.message)
                    this.responseMessage = api_response.outputData.response.data.message
                    this.snackbarColor = 'error'
                    this.snackbar = true
                    this.users = []
                    this.initialize()
                }

            } else {

                //EDIT ITEM
                const payload = {
                    "id": id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "password": password,
                    "confirm_password": confirm_password,
                    "is_superuser": is_superuser,
                    "is_staff": is_staff,
                    "is_active": true
                }
                const api_response = await UsersAPI.edit(payload)

                if (api_response.status === 1) {
                    console.log(api_response)
                    this.users = api_response.outputData.data.payload
                    this.responseMessage = api_response.outputData.data.message
                    this.snackbarColor = 'success'
                    this.snackbar = true
                    this.users = []
                    this.initialize()
                } else if (api_response.status === 0) {
                    console.log(api_response.outputData.response.data.message)
                    this.responseMessage = api_response.outputData.response.data.message
                    this.snackbarColor = 'error'
                    this.snackbar = true
                    this.users = []
                    this.initialize()
                }
            }

            this.close()
        },

        requirePassword(confirm_password) {
            if (confirm_password) {
                this.passwordRules = 'confirmed:confirm_password|required|min:6'
            } else {
                this.passwordRules = 'confirmed:confirm_password|min:6'
            }
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