PhantomUI    
=== 
![](https://travis-ci.org/T-phantom/PhantomUI.svg?branch=master)  ![](https://img.shields.io/badge/npm-v0.1.0-blue.svg)  
## HTML5 移动端组件库  
丰富的高性能移动端组件库, 每个组件都可单独使用作为独立的模块, 目前正在`开发中`, 预计4月初正式完成.   

## 安装方法：  
```javascript  
$ npm install phantom-ui  
```

## 已经完成模块  
### 核心组件库 core   
1. `core`是PhatomUI的核心类库，所有的组件都依赖于core生成的widget类。  
2. `core`由几个功能独立的核心类组成，包括`Class.js` `Base.js` `Widget.js`。    
3. class.js提供OO继承关系, base.js提供了Event Attributes功能, Widget则提供组件基本的生命周期模板功能.  
4. 详系用法请查看各自的readme文件.  
[核心组件 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/core)
 
### 基础样式库  
1. 基于flex布局的栅格系统   
2. 基础CSS: 标题, 段落, 列表, 字体图标, 导航等   
3. 扩展CSS: 表单, 卡片, 视频  
[基础样式 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/less)

### 基础组件库  
1.  `Router` 路由组件 : Router默认开启, 帮助用户完成`SPA`应用, 无需自主配置 会默认拦截浏览器的跳转事件转向路由. 当然一切都可配置, 
详情请见: [Router 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/router)    
2. `Modal` 对话框组件 : 提供Alert, Confirm, Prompt类型,详情请见: [Modal 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/modal)  
3. `PullRefresh` 下拉刷新组件 : 提供下拉刷新容器. [PullRefresh 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/pullRefresh)  
4. `OffCanvas`  侧滑组件 : 提供从左侧或者右侧滑出的面板。[OffCanvas 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/offCanvas)  
5. `Tabs` 标签页组件 : 提供大小两组标签页样式. [Tabs 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/tabs)  
6. `Swiper` 幻灯片组件 : 提供图片轮播效果. [Swiper 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/swiper)     

### 扩展组件库  
1. `MusicPlayer` 音乐播放组件  

## 更新日志  
1. `03/06` 完成router模块的最后调试,解决测试中问题,添加思考. 完善widget文档  
2. `03/07` 完成flex栅格设计.
3. `03/08` 完成Modal组件, 文档待更新; router发现bug, 建议NA端处理
4. `03/10` 完成PullRefresh组件, 更新Widget类, 修正Widget.query方法  
5. `03/11` 完成部分基础CSS, 包括 标题 段落 列表 字体图标. 同意less内容  
6. `03/12` 完成OffCanvas组件
7. `03/13` 完成表单, 卡片样式, 修正基本样式库  
8. `03/15` 完成Tabs组件，添加CSS屏幕适配(rem大小调整)
9. `03/16` 完成Swiper组件   
10. `03/27`配置音乐播放组件


    



