import { FETCH_CONFIG } from './const';

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
        success: (res) => {
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

export const formatterPhoneNumber = (num) => num.replace(/(\d{3})\d+(\d{4})/, '$1****$2');

export const to = (target) => target.then(res => [res, null]).catch(err => [null, err]);

export const showErrorToast = (msg) => {
  wx.showToast({
    icon: 'none',
    title: msg || '发生未知错误，请重试！'
  })
}

export const ab2hex = (buffer) => {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit, index) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

export const fetch = (url, data = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${FETCH_CONFIG.BASE_API}${url}`,
      data,
      ...options,
      success(res) {
        if (res.data.status === 'success') {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

export const fetchWithToken = (url, data = {}, options = {}, isAdmin) => {
  if (typeof options === 'boolean') {
    isAdmin = options;
    options = {};
  }
  Object.assign(options, {
    header: { 'HTTP-ACCESS-TOKEN': isAdmin ? FETCH_CONFIG.ADMIN_TOKEN : FETCH_CONFIG.TOKEN }
  });
  return fetch(url, data, options);
}