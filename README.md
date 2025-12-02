<p align="center">
  <img src="./assets/logo.gif" width="50%">
</p>

# 哔哩哔哩触控板滚动反转
# BiliScrollReverser

> 自然滚动下，音量的调节应该也是自然的。

优化 B 站视频音量调节在触控板上的体验。使用此脚本后，在 B 站视频全屏界面中，使用触控板向下滚动将减少音量（未安装时为增大）。

## 背景

在触控板操作中，滚动方向遵循「自然滚动」原则：向上滑动展示下方内容，这种交互逻辑与现实世界的物理运动保持一致。而传统鼠标的滚动方向则相反：向上滚动表示返回上方内容。<sup>*</sup>

这种差异导致同一操作方向在不同设备上产生截然不同的结果。然而在音量调节时，二者的语义得到了统一：**「向上升高，向下降低」**。

由于浏览器 API 限制，目前仍无法完美区分触控板和鼠标。此脚本提供两种策略，让你在 B 站上获得更自然的触控板音量调节体验。

<sub>* macOS 默认情况下鼠标和触控板的「自然滚动」是统一设置的，但许多非 Magic Mouse 用户会使用 Scroll Reverser 等第三方工具来分别设置。</sub>

## 安装

[[Greasyfork](https://greasyfork.org/zh-CN/scripts/432783)]
[[Github Release](https://github.com/MaxChang3/BiliScrollReverser/releases/latest/download/BiliScrollReverser.user.js)]
[[Github Pages](https://maxchang3.github.io/BiliScrollReverser/BiliScrollReverser.user.js)]

## 使用建议

初始化时提供两个选项：**「简单」** 与 **「矫正」**。

### 简单模式
粗暴地认为 `deltaY` 值低于 `100` 的为触控板。仅对于细微调节适用。移动过快时，会导致判断中间出错。

### 矫正模式
根据提示滚动鼠标滚轮选择最小整数 `deltaY`。除去这个数值外，如果是浮点数则为鼠标，整数值则为触控板。

**对于 macOS（Chrome/Safari），推荐使用「矫正模式」。（或如果你发现你的设备表现类似于上述情况）**

**对于未开启平滑滚动的情况下的 Windows 设备、所有平台的 Firefox 浏览器下，目前暂时推荐使用「简单模式」。** 

> [!WARNING]
> 网页缩放时，deltaY 的表现可能会有所不同，建议在 100% 缩放下进行矫正与使用。（后面会优化）

## 实现原理

Hook `EventTarget.prototype.addEventListener` 拦截对应的 `mousewheel` 事件。~~（为什么不用 `wheel`！）~~

判断是否为触控板，添加代理拦截 [wheelDelta](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event) 值，取相反数（这里直接取 [deltaY](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY) 后做一定计算处理，他与 `wheelDelta` 正负相异）后返回。


## 触控板判断逻辑

> [!WARNING]
> 由于硬件、浏览器差异，可能会有完全不同的表现。如有问题，欢迎反馈！
> 
> 目前的逻辑是判断出鼠标，反过来得知触控板，鼠标测试硬件均为 Logitech MX Anywhere2s。

### macOS <sup>[1]</sup><sup>[2]</sup>

1. 鼠标滚轮推动下的 `deltaY` 存在一个**最小整数值**，除去这个值之外的其他值大概率为浮点数，并且小数点后较为复杂。形如：`235.867919921875`。

2. 触控板大部分情况下为整数，存在为浮点数的触控板，但是一般也不会很复杂。形如：`2.5`。

因此，采取人工矫正的方式，使用鼠标的最低刻度推动获取一个最低的整数 `deltaY`。除去这个值外的所有数值，都根据是否为整数<sup>[3]</sup>进行判断，是则为触控板，否则为鼠标。目前经过一段时间测试，效果良好。


### Windows<sup>[4]</sup>

1. 未开启平滑滚动的情况下：通过不同的力度，仅能得到几个整数值。最低为 100，高至 600。

2. 开启平滑滚动的情况下：数值为分布在 1 左右的浮点数。

因此，对于 Windows 目前推荐使用简单模式。



<sub>[1] 仅 Chrome / Safari，Firefox 下全部为整数值。</sub>

<sub>[2] 仅有限测试于 macOS 13.2.1（MacBook Air M1）。</sub>

<sub>[3] 由于 2 的原因，对 `deltaY` 做乘 2 处理避免这种情况。目前测试设备有限，未来可能会有所变动。</sub>

<sub>[4] 仅有限测试于 Windows 11（LEGION R7000）。</sub>

