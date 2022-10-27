<template>
    <div class="NotFound">
        <v-container>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card height="400" color="transparent" flat>
                        <div class="display-3 mt-15 mb-3 text-center">Page not found.</div>
                        <div class="teal lighten-3 white--text pa-1 text-center secondary rounded-lg">
                            The page you are trying to get to never existed in this reality,
                            or has migrated to a parallel universe.
                        </div>
                        <div class="paragraph-text text-center">
                            <br />
                            <br />Try going back to the
                            <NuxtLink to="/">
                                home page
                            </NuxtLink>. Or,
                            contact the administrators for support.
                        </div>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<style>
.paragraph-text {
    font-size: 18px;
}
</style>