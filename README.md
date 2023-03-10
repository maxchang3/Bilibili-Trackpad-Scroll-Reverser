<p align="center">
  <img  src="./assets/logo.gif" width = "50%">
</p>

# 哔哩哔哩触控板滑动反转
# Bilibili-Trackpad-Scroll-Reverser

优化b站视频音量调节在触控板上的体验。

自然滚动下，音量的调节应该也是自然的.

## 安装

[Greasyfork](https://greasyfork.org/zh-CN/scripts/432783)

[Release](https://github.com/MaxChang3/Bilibili-Trackpad-Scroll-Reverser/releases/latest/download/bilibili-trackpad-scroll-reverser.user.js)

## 原理
Hook `EventTarget.prototype.addEventListener` 拦截对应的 `mousewheel` 事件。~~（为什么不用 `wheel`！）~~

判断是否为触控板，添加代理事件，`delta` 值取相反数。

## 已知问题

触控板判断逻辑存在缺陷，粗暴地认为 `delta` 值低于 100 的为触控板。仅对于细微调节和稍微大的调节适用。移动过快时，会导致判断中间出错。

例如：对于有移动惯性设计的触控板/系统（例如 MacBook、Magic Trackpad），首先由于移动过快，`delta` 值非常高，会认为非触控板，随后由于惯性设计，会在 `delta` 值衰减到较小值后重回回到触控板的判断区间，则最后结果是正确的（静音或者音量 100%+）。

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

