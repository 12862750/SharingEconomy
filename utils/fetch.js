import { API, FETCH_CONFIG } from './const';

function fetch(url, method, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${FETCH_CONFIG.BASE_API}${url}`,
      header: { 'HTTP-ACCESS-TOKEN': FETCH_CONFIG.TOKEN},
      method: method,
      data: options,
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
    'POST',
    { wechatCode }
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
    'GET',
    { latitude, longitude },
  )
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
  return fetch(
    API.GET_USER_INFO,
    'GET'
  );
};

/**
 * 获取用户余额
 */
export const fetchUserBalance = () => {
  return fetch(
    API.GET_BALANCE,
    'GET'
  );
};

/**
 * 获取设备信息
 */

export const fetchDeviceInfo = (deviceName) => {
  return fetch(
    `${API.GET_DEVICE_INFO}?deviceName=${deviceName}`,
    'GET'
  );
};