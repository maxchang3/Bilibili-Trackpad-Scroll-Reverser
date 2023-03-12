<p align="center">
  <img  src="./assets/logo.gif" width = "50%">
</p>

# 哔哩哔哩触控板滚动反转
# Bilibili-Trackpad-Scroll-Reverser

> 自然滚动下，音量的调节应该也是自然的。

优化 b 站视频音量调节在触控板上的体验。使用此脚本后，在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）

一般情况下，触控板的滚动语义是这样的：向上滚动时候，其意味着「展示下面的信息」。由于这种操作和现实的逻辑相同，也被称为自然滚动。而鼠标则是向上滚动则意味着「回到上方的信息」。

然而，在音量调节的时候二者的语义则得到了统一：「向上就是升高，向下就是降低」。

由此则需要判断是否为触控板，再对其进行不同的处理。不过由于目前浏览器的 API 所限，目前仍然没有可以完美区别触控板和鼠标的方式。

## 安装

[Greasyfork](https://greasyfork.org/zh-CN/scripts/432783)

[Release](https://github.com/MaxChang3/Bilibili-Trackpad-Scroll-Reverser/releases/latest/download/bilibili-trackpad-scroll-reverser.user.js)

## 原理

Hook `EventTarget.prototype.addEventListener` 拦截对应的 `mousewheel` 事件。~~（为什么不用 `wheel`！）~~

判断是否为触控板，添加代理拦截 [wheelDelta](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event) 值，取相反数（这里直接取 [deltaY](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY) 后做一定计算处理，他与 `wheelDelta` 正负相异）后返回。

## 触控板判断逻辑

1.根据经验主义，鼠标衮龙推动下的最小 `deltaY` 值<sup>[^1]</sup>外的其他情况能得到的 `deltaY` 大概率为浮点数，并且小数点后较为复杂。形如：`235.867919921875`

2.触控板大部分情况下为整数，存在为浮点数的触控板，但是一般也不会很复杂。形如：`2.5`。

3.因此，可以采取人工矫正的方式，使用鼠标的最低刻度推动获取一个最低的整数 `deltaY`。除去这个值外的所有数值，都根据是否为整数<sup>[^2]</sup>进行判断，是则为触控板，否则为鼠标。

4.目前经过有限次测试，效果非常良好。

5.另外为了避免使用麻烦，将之前的预设界限的模式视为「简单模式」，粗暴地认为 `deltaY` 值低于 `100` 的为触控板。仅对于细微调节和稍微大的调节适用。移动过快时，会导致判断中间出错。

[^1] 或者说以最小刻度推动滚轮时大多数情况下能达到的值，因为有些鼠标有时能偶尔推出低于前者的值，但是为浮点数.

[^2] 由于 2 的原因，对 `deltaY` 做乘 2 处理避免这种情况。目前测试设备有限，未来可能会有所变动。

## 更新日志

### 2.0
2023年3月10日
- 移植到 TypeScript
- 使用 [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) 进行工程化开发
- 直接 Hook 事件监听，无需手工添加元素
- 使用 Proxy 重构
- 修改全屏判断逻辑

<details>
<summary>2.0 前更新日志</summary>

### 1.0	
2022年8月27日	
- 整理代码

### 0.8	
2022年8月27日	
- 重构大部分代码，适配新版播放页

### 0.7
2021年9月23日	
- 修改全屏判断

### 0.6	
2021年9月23日	

- 优化判断 
- 全屏下进行接管

### 0.5	
2021年9月23日	

- 支持番剧页面 
- 优化部分代码

#### 0.1 - 0.4	
2021年9月22日 - 2021年9月23日 

- 项目基本功能和完善
</details>

