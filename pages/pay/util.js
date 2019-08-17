import { FETCH_CONFIG } from '../../utils/const';

export const getWechatPayData = (deviceId, payAmount) => {
  console.log('微信支付~~');
};

export const getVirtualCurrencyData = (userBalance, deviceId, payAmount) => {
  if (!userBalance) {
    wx.showToast({
      title: '能量贝不足，请充值！',
      mask: true,
      icon: 'none',
    })
    return null;
  }

  return {
    userId: FETCH_CONFIG.UID,
    orderBookingType: 0,
    paymentType: 1,
    deviceId,
    payAmount,
    times: userBalance,
  }
};

export const getCardPayData = (cardNum, deviceId, payAmount) => {
  if (!cardNum) {
    wx.showToast({
      title: '请输入光波卡号或扫描光波卡',
      mask: true,
      icon: 'none',
    });
    return null;
  }

  return {
    userId: FETCH_CONFIG.UID,
    orderBookingType: 0,
    paymentType: 2,
    deviceId: deviceId,
    payAmount: payAmount,
    coupon: cardNum
  }
};

export const getQueryString = (url, name) => {
  console.log("url = " + url)
  console.log("name = " + name)
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    console.log("r = " + r)
    console.log("r[2] = " + r[2])
    return r[2]
  }
  return null;
};