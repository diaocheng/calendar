import Vue from 'vue';
import Calendar from '../src/calendar';

new Vue({
    el: '#app',
    template: '<calendar></calendar>',
    components: {
        Calendar
    }
});