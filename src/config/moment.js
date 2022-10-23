import moment from 'moment'
import Vue from 'vue'

Vue.filter('dateFormat', function (input, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(input).format(format);
});

Vue.filter('dateFormat2', function (input, format = 'YYYY-MM-DD') {
    return moment(input).format(format);
});