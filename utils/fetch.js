import { API } from './const';

const BASE_API = 'https://api.graphenec.cn/wechat/api/web_api'

function fetch(url, data = {}, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
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

/**
 * 根据经纬度获取附近网点
 * @params latitude: 纬度
 * @params longitude: 经度
 * @return result: 附近网点
 */
export const fetchDotListByLocation = (latitude, longitude) => {
  return fetch(
    `${BASE_API}${API.GET_DOT_LIST_BY_LOCATION}`,
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
  return fetch(`${BASE_API}${API.GET_USER_INFO}`);
};

/**
 * 获取用户余额
 */
export const fetchUserBalance = () => {
  return fetch(`${BASE_API}${API.GET_BALANCE}`);
};

/**
 * 获取设备信息
 */

export const fetchDeviceInfo = (deviceName) => {
  return fetch(
    `${BASE_API}${API.GET_DEVICE_INFO}`,
    { deviceName }
    )
};