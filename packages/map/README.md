# map 地图组件

map 组件是基于饿了么开发的 react-amap 组件的再封装，使用高德地图的 API，具体功能有

1. 搜索栏输入相关关键字出现 tips 列表，点击某一项确定位置
2. 拖动地图确定位置，在搜索栏出现相应的地址信息

## Props

1. defaultLocation (Obj),{ longitude: number | string, latitude: number | string, address?: string }，初始化地图的中心位置.
2. zoom (Number), 地图显示的缩放级别，默认值是 16。
3. amapkey (String), 加载高德 API 使用的 Key，已整理到组件内部，选填。
4. onLocation (Func | isRequired)，传入一个回调函数，接受的参数即是地图返回的位置信息。 参数信息：经度，纬度，地址。
5. placeholder (String), 设置搜索框的 placeholder。

## 特别注意

因为高德地图实现是使用 canvas，所以需要一个外层容器。使用时需要给个外层 div,并给定宽高。
