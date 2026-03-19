let currentCloseFn = null;

export const registerWindow = (closeFn) => {
  if (currentCloseFn && currentCloseFn !== closeFn) {
    currentCloseFn();
  }
  currentCloseFn = closeFn;
};

export const unregisterWindow = (closeFn) => {
  if (currentCloseFn === closeFn) {
    currentCloseFn = null;
  }
};