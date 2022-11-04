<template>
    <v-container>
        <v-layout>
            <v-flex md-12>
                <v-card>
                    <v-card-title class="pa-5">
                        <h2><span class="blue--text">SITE: </span>{{ site.name }}</h2>
                    </v-card-title>

                    <v-card-actions>
                        <v-dialog v-model="dialog" max-width="90%">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary mr-6" dark v-bind="attrs" v-on="on">
                                    Add Project
                                </v-btn>
                            </template>
                            <!-- ADD PROJECT MODAL START -->
                            <v-card class="pa-5">

                                <v-combobox v-model="select" :items="items" label="Select Projects" clearable outlined multiple chips>
                                </v-combobox>


                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                                    <v-btn color="blue darken-1" text @click="save()"> Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn color=primary>Edit Site</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>

                </v-card>
            </v-flex>
        </v-layout>

        <!-- ADD PROJECT MODAL END -->

    </v-container>
</template>
<script>
import SitesAPI from "../api/sites/api";

export default {
    name: "SiteView",

    data: () => ({
        dialog: false,
        site_id: '',
        project: '',
        site: '',
        items: [
          'Programming',
          'Design',
          'Vue',
          'Vuetify',
        ],
    }),

    async created() {
        this.$nuxt.$loading.start()
        this.site_id = this.$route.query.site_id

        const payload = {
            "id": this.site_id
        }

        const api_response = await SitesAPI.view(payload);

        if (api_response.status === 1) {
            //console.log(api_response);
            this.site = api_response.outputData.data.payload;
        } else if (api_response.status === 0) {
            //console.log(api_response.outputData.response.data.message);
            return this.$nuxt.error({ statusCode: 404 })
        }

        console.log(this.site)
        this.$nuxt.$loading.finish()
    },

    methods: {
        close() {
            this.dialog = false;
        },

        save() {
            this.dialog = false;
        },
    },
}
</script>
<style>

</style>