export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const ranger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const limit = (min, max) => (value) =>
  Math.max(Math.min(max, value), min);
