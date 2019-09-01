export const FETCH_CONFIG = {
  BASE_API: 'https://api.graphenec.cn/wechat/api/web_api',
  //BASE_API: 'http://localhost:8080/web_api',
  TOKEN: '',
  UID: '',
  CODE: '',
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
  GET_DEVICE_INFO: '/landing/mine/getOneShopDevices',
  // 获取订单记录
  GET_ORDER_LIST: '/landing/mine/getConsumeList',
  // 提交加盟信息
  ADD_JOIN: '/landing/mine/addJoin',
  // 上报手机号
  POST_PHONE: '/session/updateMobile',
  // 获取订单状态
  GET_ORDER_STATE: '/landding/order/state',
}

export const ADMIN_API = {
  // 登录
  LOGIN: '/admin/login'
}

export const PAY_TYPE = {
  WECHAT_PAY: {
    id: 'pay0',
    value: '0',
    name: '单次体验'
  },
  VIRTUAL_CURRENCY: {
    id: 'pay1',
    value: '1',
    name: '能量贝抵扣'
  },
  CARD_PAY: {
    id: 'pay2',
    value: '2',
    name: '光波卡'
  }
}