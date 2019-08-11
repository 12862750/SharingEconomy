import { FETCH_CONFIG } from '../../utils/const';

export const getWechatPayData = (deviceId) => {
  console.log('微信支付~~');
};

export const getVirtualCurrencyData = (userBalance, deviceId) => {
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
    paymentType: '1',
    deviceId,
    times: userBalance,
  }
};

export const getCardPayData = (cardNum, deviceId) => {
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
    paymentType: '2',
    deviceId,
    coupon: cardNum
  }
};