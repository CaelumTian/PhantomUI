Tabs 标签页组件  
===  
[使用DEMO](http://t-phantom.github.io/PhantomUI/tabs/)  
`tabs`组件提供可用于选择的标签页， 可选样式有：一级标签页，二极标签页  
`tab-group` 标签容器， `buttons-tap`一级标签页，`buttons-row`二级标签页，`tab-link`
切换按钮，`tab`标签页容器  

## 一丶基本使用：
基本结构如下
```html
<div class="tabs-groups">
    <!-- 替换buttons-tab为buttons-row改变为二级标签页-->
    <div class="buttons-tab flex">
        <a href="#tab1" class="tab-link active">新闻</a>
        <a href="#tab2" class="tab-link">热点</a>
        <a href="#tab3" class="tab-link">视频</a>
    </div>
    <div class="tabs content-padd">
        <div id="tab1" class="tab tab-active">新闻内容</div>
        <div id="tab2" class="tab">热点内容</div>
        <div id="tab3" class="tab">视频内容</div>
    </div>
</div>
``` 
js初始化配置
```javascript
var Tabs = new Tabs({
    element : ".tabs-group"
})  
```  
## 二丶可选参数  
当标签也切换玩以后，会立即触发`showTab`事件，我们可以在初始化阶段，付给回调函数
```javascript
element : ".tabs-group",
attrs : {
    links : ".buttons-tab",  //切换按钮容器
    container : ".tabs",     //标签页容器
    aimClass : ".tab-link",  //切换按钮
    handlerShow : null       //回调函数
}
``` 
标签页可以嵌套标签页  

## 三丶待更新问题  
1. 是否添加滑动切换标签页的方式
2. 是否需要添加额外动画用于切换  
