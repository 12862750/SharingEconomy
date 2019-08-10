import { API, FETCH_CONFIG } from './const';

function fetch(url, data = {}, options = {}) {
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

export const toLogin = (wechatCode) => {
  return fetch(
    API.LOGIN,
    {
      wechatCode,
    }, {
      method: 'POST'
    }
  )
}

/**
 * 根据经纬度获取附近网点
 * @params latitude: 纬度
 * @params longitude: 经度
 * @return result: 附近网点
 */
export const fetchDotListByLocation = (latitude, longitude) => {
  return fetch(
    API.GET_DOT_LIST_BY_LOCATION,
    {
      latitude,
      longitude
    })
    .then((res) => {
      return res.result;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * 获取用户数据
 */
export const fetchUserInfo = () => {
  console.log('FETCH_CONFIG.TOKEN', FETCH_CONFIG.TOKEN);
  return fetch(API.GET_USER_INFO, { token: FETCH_CONFIG.TOKEN }, {
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * 获取用户余额
 */
export const fetchUserBalance = () => {
  return fetch(
    API.GET_BALANCE,
    {
      token: FETCH_CONFIG.TOKEN
    }, {
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
};

/**
 * 获取设备信息
 */

export const fetchDeviceInfo = (deviceName) => {
  return fetch(
    API.GET_DEVICE_INFO,
    {
      deviceName,
      token: FETCH_CONFIG.TOKEN
    }, {
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
};