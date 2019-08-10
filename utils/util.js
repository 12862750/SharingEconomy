export const noob = () => {};

export const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve();
      },
      fail: () => {
        wx.login({
          success: (res) => {
            const { code } = res;
            try {
              resolve(code);
            } catch (e) {
              reject(e);
            }
          }
        })
      }
    });
  });
};