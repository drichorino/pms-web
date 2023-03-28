<template>
    <v-container>
        <v-layout>
            <v-flex md-12>
                <v-card class="pb-2">
                    <v-card-title>
                        <h2><span class="blue--text">SITE | </span>{{ site.name }}</h2>
                    </v-card-title>

                    <v-card-actions class="ml-2">
                        <v-dialog v-model="projectDialog" max-width="80%">
                            <template v-slot:activator="{ on, attrs }"> 
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Assign Project
                                </v-btn>
                            </template>
                            <!-- ADD PROJECT MODAL START -->
                                <v-card class="pa-5">
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeAddProjectModal"> Cancel </v-btn>
                                        <v-btn color="blue darken-1" text @click="saveProject()" :disabled="disabledProjectSaveBtn"> Save
                                        </v-btn>
                                    </v-card-actions>
                                    <v-combobox v-model="projects_to_assign" :items="projects_not_in_site" item-text="name"
                                        item-value="id" label="Select Projects" clearable outlined multiple chips
                                        deletable-chips>
                                    </v-combobox>
                                </v-card>
                            <!-- ADD PROJECT MODAL END -->
                        </v-dialog>
                        
                        <v-dialog v-model="employeeDialog" max-width="80%">
                            <template v-slot:activator="{ on, attrs }"> 
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Assign Employee
                                </v-btn>
                            </template>
                            <!-- ADD EMPLOYEES MODAL START -->
                            <v-card class="pa-5">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeAddEmployeeModal"> Cancel </v-btn>
                                    <v-btn color="blue darken-1" text @click="saveEmployee()" :disabled="disabledEmployeeSaveBtn"> Save
                                    </v-btn>
                                </v-card-actions>
                                <v-combobox v-model="employees_to_assign" :items="employees_not_in_site" item-text="name"
                                    item-value="id" label="Select Employees" clearable outlined multiple chips
                                    deletable-chips>
                                </v-combobox>
                            </v-card>
                            <!-- ADD EMPLOYEES MODAL END -->
                        </v-dialog>
                        <v-btn color=primary>Edit Site</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>


            </v-flex>
        </v-layout>
        
        <!-- PROJECTS IN SITE TABLE -->
        <v-card class="mt-6">
            <v-data-table :headers="headers" :items="projects_in_site" :search="searchProject" sort-by="name" @click:row="handleClick"
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
                        <v-dialog v-model="dialogDeleteProject" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h6 text-truncate">Are you sure you want to unassign this project?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDeleteProject">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="unassignProjectConfirm(editedItem.id)">OK
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small v-bind="attrs" v-on="on" @click.stop.prevent="unassignProject(item)"> mdi-delete </v-icon>
                        </template>
                        <span class="tooltip-text" >Unassign Project</span>
                    </v-tooltip>                    
                </template>
                <template v-slot:no-data> No active projects in this site. </template>
            </v-data-table>
        </v-card>

        <!-- EMPLOYEES IN SITE TABLE -->
        <v-card class="mt-6">
            <v-data-table :headers="headers" :items="employees_in_site" :search="searchEmployee" sort-by="name"
                class="elevation-1" :loading="loadingDataTable" loading-text="Loading... Please wait">
                <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Employees</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="searchEmployee" append-icon="mdi-magnify" label="Search" maxlength="100"
                            single-line outlined hide-details clearable rounded dense></v-text-field>
                        <v-dialog v-model="dialogDeleteEmployee" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h6 text-truncate">Are you sure you want to unassign this employee?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDeleteEmployee">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="unassignEmployeeConfirm(editedItem.id)">OK
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="selectProjectDialog" max-width="80%">
                            <template v-slot:activator="{ on, attrs }"> 
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Deploy Employee to Project
                                </v-btn>
                            </template>
                            <!-- ADD EMPLOYEES MODAL START -->
                            <v-card class="pa-5">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeSelectProjectModal"> Cancel </v-btn>
                                    <v-btn color="blue darken-1" text @click="saveSelectProject()" :disabled="disabledEmployeeSaveBtn"> Save
                                    </v-btn>
                                </v-card-actions>
                                <v-combobox v-model="employees_to_assign" :items="employees_not_in_site" item-text="name"
                                    item-value="id" label="Select Employees" clearable outlined multiple chips
                                    deletable-chips>
                                </v-combobox>
                            </v-card>
                            <!-- ADD EMPLOYEES MODAL END -->
                        </v-dialog>

                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small v-bind="attrs" v-on="on" @click.stop.prevent="assignEmployeeToProject(item)"> mdi-plus-thick </v-icon>
                        </template>
                        <span class="tooltip-text" >Deploy to Project</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small v-bind="attrs" v-on="on" @click.stop.prevent="unassignEmployee(item)"> mdi-delete </v-icon>
                        </template>
                        <span class="tooltip-text" >Unassign Employee</span>
                    </v-tooltip>
                    
                </template>
                <template v-slot:no-data> No active employees in this site. </template>
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
import SitesAPI from "../../api/sites/api"
import * as _ from 'lodash'

export default {
    name: "SiteView",

    data: () => ({
        projectDialog: false,
        employeeDialog: false,
        selectProjectDialog: false,
        site_id: '',
        project: '',
        site: '',

        projects_not_in_site: [],
        projects_in_site: [],
        projects_to_assign: [],

        employees_not_in_site: [],
        employees_in_site: [],
        employees_to_assign: [],

        return_object: false,

        snackbar: false,
        snackbarColor: '',
        responseMessage: '',
        timeout: 7000,

        disabledProjectSaveBtn: true,
        disabledEmployeeSaveBtn: true,


        //table data
        loadingDataTable: true,

        searchProject: '',
        searchEmployee: '',
        dialogDeleteProject: false,
        dialogDeleteEmployee: false,

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


    mounted() {
        this.initialize()
    },

    watch: {
        projects_to_assign: function () {
            if (this.projects_to_assign.length > 0) {
                this.disabledProjectSaveBtn = false
            } else if (this.projects_to_assign.length == 0) {
                this.disabledProjectSaveBtn = true
            }
        },

        employees_to_assign: function () {
            if (this.employees_to_assign.length > 0) {
                this.disabledEmployeeSaveBtn = false
            } else if (this.employees_to_assign.length == 0) {
                this.disabledEmployeeSaveBtn = true
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
                this.employees_not_in_site = api_response.outputData.data.payload.employees_not_in_site
                this.employees_in_site = api_response.outputData.data.payload.employees_in_site
                this.loadingDataTable = false

            } else if (api_response.status === 0) {
                return this.$nuxt.error({ statusCode: 404 })
            }
        },


        closeAddProjectModal() {
            this.projects_to_assign = []
            this.projectDialog = false
        },

        async saveProject() {
            this.$nuxt.$loading.start()
            const payload = {
                "id": this.site_id,
                "projects_to_assign": _.map(this.projects_to_assign, 'id')
            }

            const api_response = await SitesAPI.assign_project(payload)
            this.$nuxt.$loading.finish()
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

            this.projects_to_assign = []
            this.projectDialog = false
            
        },

        closeAddEmployeeModal() {
            this.employees_to_assign = []
            this.employeeDialog = false
        },

        async saveEmployee() {
            this.$nuxt.$loading.start()
            const payload = {
                "id": this.site_id,
                "employees_to_assign": _.map(this.employees_to_assign, 'id')
            }

            const api_response = await SitesAPI.assign_employee(payload)
            this.$nuxt.$loading.finish()
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

            this.employees_to_assign = []
            this.employeeDialog = false
            
        },

        async saveSelectProject() {
            this.$nuxt.$loading.start()
            const payload = {
                "id": this.site_id,
                "employees_to_assign": _.map(this.employees_to_assign, 'id')
            }


            this.employees_to_assign = []
            this.employeeDialog = false
            
        },


        //projects table
        formatDate(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            date = new Date(date)
            date = date.toLocaleDateString("en-US", options)
            return date
        },

        closeDeleteProject() {
            this.dialogDeleteProject = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        unassignProject(item) {
            this.editedIndex = this.projects_in_site.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDeleteProject = true;
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

            this.closeDeleteProject()
            this.$nuxt.$loading.finish()
        },

        closeDeleteEmployee() {
            this.dialogDeleteEmployee = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        unassignEmployee(item) {
            this.editedIndex = this.employees_in_site.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDeleteEmployee = true;
        },

        async unassignEmployeeConfirm(id) {
            this.$nuxt.$loading.start()
            const payload = {
                "employee_id": id,
                "site_id": this.site_id
            }

            const api_response = await SitesAPI.unassign_employee(payload)

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

            this.closeDeleteEmployee()
            this.$nuxt.$loading.finish()
        },

        assignEmployeeToProject(item) {
            console.log(item)
            //add assign modal here
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
            //this.$router.push({ name: 'sites-view', params: { site_id } })
            this.$router.push({ 
                path: '/sites/view-project', 
                query: { 
                    site_id: this.site_id, 
                    site_name: this.site.name,
                    project_id: row.id,
                    project_name: row.name,
                    
                    
                 } 
            })
            //console.log(site_id)
        },

        closeSelectProject() {
            this.dialogDeleteProject = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
}
</script>

<style scoped>
.tooltip-text {
  font-size: 12px; /* change this value to adjust the font size */
}

</style>