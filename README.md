PhantomUI    
=== 
![](https://travis-ci.org/T-phantom/PhantomUI.svg?branch=master)  ![](https://img.shields.io/badge/npm-v1.2.3-blue.svg)  
## HTML5 移动端组件库  
丰富的高性能移动端组件库, 每个组件都可单独使用作为独立的模块.   

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
7. `caelendar` 万年历组件  

### 扩展组件库  
1. `MusicPlayer` 音乐播放组件 [MusicPlayer 使用说明](https://github.com/T-phantom/PhantomUI/tree/master/src/widgets/musicPlayer)   

### 非UI的功能性组件    
1. `app-link` jsbridge组件，提供H5页面和native端互相通信的机制  [app-link 使用说明](https://github.com/T-phantom/app-link)  
2. `si-img` 提供移动端图片优化的功能，包括base64存续，webp支持，惰性加载等 [si-img 使用说明](https://github.com/T-phantom/si-img)  
3. `si-gesture` 提供移动端的手势扩展功能，例如：tap, pan, 多指触控等 [si-gesture 使用说明](https://github.com/T-phantom/si-gesture)  
4. `si-env` 判断当前框架的运行的设备环境 [si-env 使用说明](https://github.com/T-phantom/si-env)    

## 更新日志  
### 1.0.0  
1. 完成核心组件库的编写，提供基础搭建环境  
2. 完成基本组件的编写  

### 1.0.1  
1. 修复router组件不能触发js的执行的bug   

### 1.1.0  
1. 添加caelendar日历组件  
2. 添加MusicPlayer扩展组件  

### 1.1.1  
1. 提供日历组件对农历的支持  
2. 优化侧滑组件  
3. 更新demo代码，去掉点击穿透  

### 1.2.0  
1. 开发非UI类型的功能性组件  
2. 添加`app-link`组件，作为Hybrid解决方案  

### 1.2.1  
1. 添加`si-img`, `si-gesture`组件    

### 1.2.2  
1. 添加`/tools/log.js` 输出信息工具，方便移动端调试   

### 1.2.3  
1. 添加`/tools/promise.js` 辅助promise对代码改造
2. 添加`si-env` 判断当前组件运行环境

## 待更新问题  
1. 没有对所有类别组件提供一个统一的引入机制，只能自己引入  
2. 考虑用ES6重构代码，删去不必要的轮子。  





    



