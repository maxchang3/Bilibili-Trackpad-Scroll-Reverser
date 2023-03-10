<p align="center">
  <img  src="./assets/logo.gif" width = "50%">
</p>

# 哔哩哔哩触控板滚动反转
# Bilibili-Trackpad-Scroll-Reverser

> 自然滚动下，音量的调节应该也是自然的。

优化 b 站视频音量调节在触控板上的体验。使用此脚本后，在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）

一般情况下，触控板的滚动语义是这样的：向上滚动时候，其意味着「展示下面的信息」。由于这种操作和现实的逻辑相同，也被称为自然滚动。而鼠标则是向上滚动则意味着「回到上方的信息」。然而，在音量调节的时候二者的语义则得到了统一：「向上就是升高，向下就是降低」。由此则需要判断是否为触控板，再对其进行不同的处理。不过由于目前浏览器的 API 所限，目前仍然没有可以完美区别触控板和鼠标的方式。

## 安装

[Greasyfork](https://greasyfork.org/zh-CN/scripts/432783)

[Release](https://github.com/MaxChang3/Bilibili-Trackpad-Scroll-Reverser/releases/latest/download/bilibili-trackpad-scroll-reverser.user.js)

## 原理

Hook `EventTarget.prototype.addEventListener` 拦截对应的 `mousewheel` 事件。~~（为什么不用 `wheel`！）~~

判断是否为触控板，添加代理拦截 [wheelDelta](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event) 值，取相反数（这里直接取 `deltaY` 后做一定计算处理，他与 `wheelDelta` 正负相异）后返回。

## 已知问题

触控板判断逻辑存在缺陷，粗暴地认为 [deltaY](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY) 值低于 100 的为触控板。仅对于细微调节和稍微大的调节适用。移动过快时，会导致判断中间出错。

例如：对于有惯性设计的触控板/系统（例如 MacBook、Magic Trackpad），首先由于移动过快，`deltaY` 值非常高，会认为非触控板，随后由于惯性设计，会在 `deltaY` 值衰减到较小值后重回回到触控板的判断区间，则最后结果是正确的（静音或者音量 100%+）。

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

