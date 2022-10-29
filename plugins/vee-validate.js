import Vue from 'vue';
import { extend, localize } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";
import { ValidationProvider, ValidationObserver } from 'vee-validate';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);


const dictionary = {
    en: {
        messages: {
            required: () => '* Required',
        },
    },
};

// Install required rule.
extend("required", required);

// Install email rule.
extend("email", email);

// Install min rule.
extend("min", min);

localize(dictionary);