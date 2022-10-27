<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"    
    @click:row="handleClick"
    sort-by="last_name"
    class="elevation-1"
  >

    <template v-slot:item.is_superuser="{ item }">
      <v-chip
        :color="isSuperuserColor(item.is_superuser)"
        dark
      >
        {{ isSuperuser(item.is_superuser) }}
      </v-chip>
    </template>

    <template v-slot:item.is_staff="{ item }">
      <v-chip
        :color="isStaffColor(item.is_staff)"
        dark
      >
        {{ isStaff(item.is_staff) }}
      </v-chip>
    </template>

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Users List</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          outlined
          hide-details
          clearable
          rounded
          dense
        ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Add User
            </v-btn>
          </template>

          <!-- ADD AND EDIT MODAL -->          
          <v-card>
            <v-card-title>
              <span class="text-h6">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.first_name"
                      label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.last_name"
                      label="Last Name"
                    ></v-text-field>
                  </v-col>                
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email Address"
                    ></v-text-field>
                  </v-col>  
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h6">Are you sure you want to delete this user?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      {{ noDataMessage }}
    </template>
  </v-data-table>
</template>
  
<script>
import UsersAPI from  "../../api/users/api"

  export default {
      
      name: 'UsersPage',

      data: () => ({
          users: [],
          search: '',
          dialog: false,
          dialogDelete: false,
          noDataMessage: '',
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
          formTitle () {
              return this.editedIndex === -1 ? 'Add User' : 'Edit User'
          },
      },

      watch: {
          dialog (val) {
              val || this.close()
          },
          dialogDelete (val) {
              val || this.closeDelete()
          },
      },

      async created() {
        // fetch on init
        const api_response = await UsersAPI.list()
      
        if (api_response.status === 1) {
                console.log(api_response)
                this.users = api_response.outputData.data.payload
            } else if (api_response.status === 0){
                console.log(api_response.outputData.response.data.message)
                this.noDataMessage = api_response.outputData.response.data.message
            }
      },

      methods: { 
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

          isSuperuser (is_superuser) {
              if (is_superuser) return 'Yes'
              else return 'No'
          },

          isSuperuserColor (is_superuser) {
              if (is_superuser) return 'green'
              else return 'red'
          },

          isStaff (is_staff) {
              if (is_staff) return 'Yes'
              else return 'No'
          },

          isStaffColor (is_staff) {
              if (is_staff) return 'blue'
              else return 'red'
          },


          editItem (item) {
              this.editedIndex = this.users.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialog = true
          },

          deleteItem (item) {
              this.editedIndex = this.users.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialogDelete = true
          },

          deleteItemConfirm () {
              this.users.splice(this.editedIndex, 1)
              this.closeDelete()
          },

          close () {
              this.dialog = false
              this.$nextTick(() => {
                  this.editedItem = Object.assign({}, this.defaultItem)
                  this.editedIndex = -1
              })
          },

          closeDelete () {
              this.dialogDelete = false
              this.$nextTick(() => {
                  this.editedItem = Object.assign({}, this.defaultItem)
                  this.editedIndex = -1
              })
          },

          save () {
              if (this.editedIndex > -1) {
                      Object.assign(this.users[this.editedIndex], this.editedItem)
                  } else {
                      this.users.push(this.editedItem)
                  }
              this.close()
          },
      },
  }
  </script>