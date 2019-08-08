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
})