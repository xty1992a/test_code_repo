import Vue from 'vue';
import dayjs from 'dayjs';
import * as utils from '@/utils';

Vue.prototype.$dayjs = dayjs;
Vue.prototype.$utils = utils;

export default Vue;
