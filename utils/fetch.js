import { API } from './const';

const BASE_API = 'https://api.graphenec.cn/wechat/api/web_api'

export const fetchDotListByLocation = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_API}${API.GET_DOT_LIST_BY_LOCATION}`, //仅为示例，并非真实的接口地址
      data: {
        latitude,
        longitude
      },
      success(res) {
        if (res.data.status === 'success') {
          resolve(res.data.result);
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