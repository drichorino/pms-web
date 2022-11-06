<template>
    <v-app id="login">
        <v-main>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary" class="d-flex justify-center">
                                <v-toolbar-title>Authorized Users Login</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field v-model="email" prepend-icon="mdi-account" name="email" label="Email"
                                        type="text"></v-text-field>
                                    <v-text-field v-model="password" id="password" prepend-icon="mdi-lock"
                                        name="password" label="Password" type="password"></v-text-field>
                                </v-form>
                                <v-alert v-if="this.is_error" class="justify-center" dense text type="error">{{
                                        this.error_message
                                }}</v-alert>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="user_login()">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>
 
<script>
import UserAPI from '../api/users/api'

export default {
    name: 'LoginForm',
    props: {
        source: String,
    },

    data() {
        return {
            email: '',
            password: '',
            is_error: null,
            error_message: null
        }
    },
    methods: {
        async user_login() {
            this.$nuxt.$loading.start()
            const credentials = {
                "email": this.email,
                "password": this.password
            }

            const api_response = await UserAPI.login(credentials)

            if (api_response.status === 1) {
                this.is_error = false
                this.$router.push('dashboard')
            } else if (api_response.status === 0) {
                this.is_error = true
                this.error_message = api_response.outputData.response.data.message
            }
            this.$nuxt.$loading.finish()
        }
    }
};
</script>
 
<style>

</style>
 