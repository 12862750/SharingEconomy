export const FETCH_CONFIG = {
  BASE_API: 'https://api.graphenec.cn/wechat/api/web_api',
  TOKEN: '',
};

export const API = {
  // 登录
  LOGIN: '/session/wetchatLogin',
  // 根据经纬度获取附近网点
  GET_DOT_LIST_BY_LOCATION: '/location/nearBy',
  // 根据关键词获取网点
  GET_DOT_LIST_BY_WORDS: '/home/shops',
  // 获取用户信息
  GET_USER_INFO: '/landing/mine/auth',
  // 获取用户余额
  GET_BALANCE: '/landing/mine/getUserTimes',
  // 支付开启设备
  PAY_TO_START: '/landing/order/orders',
  // 获取设备信息
  GET_DEVICE_INFO: '/landing/mine/getOneShopDevices'
}
