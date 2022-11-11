<template>
    <v-app dark>

        <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
            <template v-slot:append>
                <div class="pa-2 mb-2">
                    <v-btn color="primary" block @click="logout">Logout</v-btn>
                </div>
            </template>

            <v-list>
                <v-list-item :to="dashboard" @click="clear()">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item>

                <v-list-group v-for="item in items" :key="item.title" :prepend-icon="item.action" v-model="item.active"
                    no-action router exact>
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item v-for="child in item.items" :key="child.title" :to="child.to">
                        <v-list-item-content>
                            <v-list-item-title v-text="child.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>


        <v-app-bar :clipped-left="clipped" fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
            </v-btn>
            <v-btn icon @click.stop="clipped = !clipped">
                <v-icon>mdi-application</v-icon>
            </v-btn>
            <v-btn icon @click.stop="fixed = !fixed">
                <v-icon>mdi-minus</v-icon>
            </v-btn> -->
            <v-spacer></v-spacer>
            <v-toolbar-title v-text="title" />
            <v-spacer />
            <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
                <v-icon>mdi-menu</v-icon>
            </v-btn> -->
        </v-app-bar>
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
            <v-list>
                <v-list-item @click.native="right = !right">
                    <v-list-item-action>
                        <v-icon light>
                            mdi-repeat
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>Switch drawer (click me)</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-footer :absolute="!fixed" app>
            <v-layout class="flex justify-center grow"><span>&copy; {{ new Date().getFullYear() }} TiTech Solutions</span></v-layout>
           
        </v-footer>
    </v-app>

</template>

<script>
import UsersAPI from "../api/users/api"

export default {
    name: 'DefaultLayout',
    data() {
        return {
            clipped: true,
            drawer: false,
            fixed: false,
            dashboard: '/dashboard',
            items: [
                {
                    action: 'mdi-account-circle',
                    items: [
                        {
                            title: 'Active Users',
                            to: '/users/list'
                        },
                        {
                            title: 'Archived Users',
                            to: '/users/archive'
                        },
                    ],
                    title: 'Users',
                },
                {
                    action: 'mdi-domain',
                    items: [
                        {
                            title: 'Active Sites',
                            to: '/sites/list'
                        },
                        {
                            title: 'Archived Sites',
                            to: '/sites/archive'
                        },
                    ],
                    title: 'Sites',
                },
                {
                    action: 'mdi-hammer-wrench',
                    items: [
                        {
                            title: 'Active Projects',
                            to: '/projects/list'
                        },
                        {
                            title: 'Archived Projects',
                            to: '/projects/archive'
                        }
                    ],
                    title: 'Projects',
                },
                {
                    action: 'mdi-account-group',
                    items: [
                        {
                            title: 'Active Employees',
                            to: '/employees/list'
                        },
                        {
                            title: 'Archived Employees',
                            to: '/employees/archive'
                        }
                    ],
                    title: 'Employees',
                },
            ],

            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: 'Payroll Management System'
        }
    },

    async created() {
        const current_user = await UsersAPI.current()
        //console.log(current_user)
        if (current_user.status === 0) {
            this.$router.push('/')
        }
    },

    methods: {
        clear() {
            this.items.map((item) => item.active = false)
        },

        async logout() {
            const api_response = await UsersAPI.logout()
            if (api_response.status === 1) {
                console.log(api_response)
                this.$router.push('/')
            } else if (api_response.status === 0) {
                console.log(api_response.outputData.response.data.message)
                this.$router.push('/')

            }
        }
    }
}
</script>