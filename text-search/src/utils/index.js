import dayjs from 'dayjs';

export const sleep = time => new Promise(resolve => setTimeout(resolve, time));
export const copy = o => JSON.parse(JSON.stringify(o));
export const limit = (min, max) => value => Math.max(Math.min(max, value), min);
export const ranger = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const fmt = fmtStr => v => dayjs(v).isValid() ? dayjs(v).format(fmtStr) : v;
