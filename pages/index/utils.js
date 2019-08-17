export const getLocationMarker = (latitude, longitude) => ({
  id: 0,
  latitude,
  longitude,
  iconPath: '/images/location.png',
  width: '150rpx',
  height: '150rpx',
  anchor: { x: .5, y: .5 },
});

export const getDotMarker = (latitude, longitude, id, data) => ({
  id,
  latitude,
  longitude,
  iconPath: '/images/dot.png',
  width: '51rpx',
  height: '57rpx',
  data,
});

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
}