import Vue from 'vue';
import { extend, localize } from "vee-validate";
import { required, email, min, confirmed } from "vee-validate/dist/rules";
import { ValidationProvider, ValidationObserver } from 'vee-validate';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);


const dictionary = {
    en: {
        messages: {
            required: () => '* Required',
            confirmed: () => 'Passwords do not match.',
            min: () => 'At least 6 characters is required.',
        },
    },
};

// Install required rule.
extend("required", required);

// Install email rule.
extend("email", email);

// Install min rule.
extend("min", min);

extend("confirmed", confirmed);

localize(dictionary);