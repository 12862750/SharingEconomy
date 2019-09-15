import { API, FETCH_CONFIG } from './const';
import { fetch, fetchWithToken } from './util';

/**
 * 根据wechatCode到后台登录
 * @params wechatCode
 * @return result: 包含token和uid的登录信息
 */
export const toLogin = (wechatCode) => {
  return fetch(
    API.LOGIN,
    { wechatCode },
    { method: 'POST' }
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
 * 根据关键词获取网点
 * @params words: 关键词
 * @return result: 附近网点
 */
export const fetchDotListByWords = (data) => {
  return fetch(
    API.GET_DOT_LIST_BY_WORDS,
    data
  );
}

/**
 * 获取用户数据
 */
export const fetchUserInfo = () => {
  return fetchWithToken(
    API.GET_USER_INFO,
  );
};

/**
 * 获取用户余额
 */
export const fetchUserBalance = () => {
  return fetchWithToken(
    API.GET_BALANCE
  );
};

/**
 * 获取设备信息
 */
export const fetchDeviceInfo = (deviceName) => {
  return fetchWithToken(
    API.GET_DEVICE_INFO,
    { deviceName }
  );
};

/**
 * 开启设备
 */
export const payToStart = (data) => {
  return fetchWithToken(
    API.PAY_TO_START,
    data,
    { method: 'POST' }
  )
}

/**
 * 获取订单记录
 */
export const getOrderList = () => {
  return fetchWithToken(
    API.GET_ORDER_LIST
  )
}

/**
 * 提交加盟信息
 */
export const submitAddJoin = (data) => {
  return fetchWithToken(
    API.ADD_JOIN,
    data,
    { method: 'POST' }
  )
}

/**
 * 提交手机号
 */
export const postPhone = (phone) => {
  fetchWithToken(
    API.POST_PHONE,
    {
      newMobile: phone,
      mobileCode: '', // 不知道这个是什么意思
      uid: FETCH_CONFIG.UID
    }
  )
}

/**
 * 获取订单状态
 */
export const getOrderState = () => {
  return fetchWithToken(
    API.GET_ORDER_STATE
  )
}