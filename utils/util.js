export const noob = () => {};

export const checkSession = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
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
    } else {
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
    }
  });
};