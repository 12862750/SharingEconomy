export const FETCH_CONFIG = {
  BASE_API: 'https://api.graphenec.cn/wechat/api/web_api',
  //BASE_API: 'http://localhost:8080/web_api',
  TOKEN: '',
  ADMIN_TOKEN: '',
  UID: '',
  ADMIN_UID: '',
  CODE: '',
};

export const API = {
  // 登录
  LOGIN: '/session/wetchatLogin',
  // 根据经纬度获取附近网点
  GET_DOT_LIST_BY_LOCATION: '/home/shops',
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
  GET_ORDER_STATE: '/landing/order/state'
}

export const ADMIN_API = {
  // 登录
  LOGIN: '/admin/login',
  // 获取验证码
  GET_CODE: '/admin/getCode',
  // 重置密码
  RESET_PASSWORD: '/admin/resetPassword',
  // 获取用户信息
  GET_USER_INFO: '/admin/getUserInfo',
  // 修改密码
  CHANGE_PASSWORD: '/admin/changePassword',
  // 获取收入记录
  GET_INCOME_RECORDS: '/landing/income/records',
  // 提现
  TO_GET_CASH: '/landing/getCash',
  // 获取代理商数据
  GET_AGENT: '/landing/getAgent',
  // 新增代理商
  ADD_AGENT: '/landing/addAgent',
  // 获取商铺数据
  GET_SHOP: '/landing/getShop',
  // 获取单个商铺信息
  GET_SHOP_INFO: '/landing/getShopInfo',
  // 新增设备
  ADD_DEVICE: '/landing/addDevice',
  // 删除店铺
  DEL_SHOP: '/landing/delShop',
  // 新增和修改店铺
  SAVE_SHOP: '/landing/saveShop',
  // 上传图片
  UPLOAD_PIC: '/landing/uploadPic'
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