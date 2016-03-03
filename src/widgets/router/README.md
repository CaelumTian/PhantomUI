Router 路由组件  
===  
[查看 DEMO](http://t-phantom.github.io/PhantomUI/route/)   

`router`组件 继承自 widget类， 提供页面间路由功能，帮助用户快速构建SPA应用。 

### 一丶使用方法：  
```html  
    <script src="zepto-min-js"></script>
    <script src="phantomui-min-js"></script>  
    <!-- 也可分别单一引入route.js -->
```  
Router默认开启，无需配置，会自动拦截所有链接的默认行为，
如果希望一个链接走浏览器原生跳转而不使用router， 请指定class="no-route"；   

#### 注意事项：
使用route模块需要将页面全部放置于`div.page-group`中，每一个页面为`div.page`。 
```html
    <div class="page-gruop">
        <div class="page"></div>
    </div>
```
#### ajax跳转 && 内联页面跳转 
router通过ajax来加载新的页面(注意不能跨域)，route默认拦截链接行为，转为ajax请求，并
加入缓存。 如果不希望使用ajax我们可以采用内联页面的方式，指定多个`.page`, 并为其
指定id 作为hash跳转的目标，`<a href="{#id}"></a> ` 做跳转， 指定最初展示的页面 
`.page-current`。  
```html
<div class="page-group">
    <div class="page page-current" id="router-index">
        <header>
            <h1>路由Demo A 测试</h1>
        </header>
        <section class="wrap">
            <ul class="list">
                <li>
                    <a href="./test2.html">跳转到B页面(ajax请求)</a>
                </li>
                <li>
                    <a href="#router1">内联页面跳转(#router1)</a>
                </li>
                <li>
                    <a href="">当前页面不做处理</a>
                </li>
                <li>
                    <a href="./test2.html" data-no-cache="true">不使用缓存</a>
                </li>
            </ul>
        </section>
    </div>
    <div class="page" id="router1">
           <header>
            <a class="back">后退</a>
            <h1>内联的页面#router</h1>
        </header>
    </div>
</div>
```  
### 二丶基本配置  
> 可以通过初始化时传入参数来修改conig  

```javascript
attrs : {
    sessionGroupClass : "page-group",
    //当前page class
    curPageClass : "page-current",
    //visiblePage 才是当前展示出来的page
    visiblePageClass: 'page-visible',
    //容器标识
    pageClass : "page"
}
```  
> 支持监听的事件

```javascript
pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
pageLoadError: 'pageLoadError', // ajax 加载页面失败后
pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
beforePageSwitch: 'beforePageSwitch', // page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
```  
我们可以在config传入这些事件同名的函数，用于事件的回调函数。为route加入其他扩展内容，比如加载指示器等  

> 对于路由的其他限制  

路由模块并不会取消 tel mailto 等连接  
设置类名`data-no-cache`  可取消页面缓存  
设置类名`data-no-router` 可以取消对应链接的路由  

### 版本信息  
Route模块处于测试中，积极寻找bug，之后我们会添加对插入页面中`js`的处理（目前所有事件委托到document上）。
以及添加更多的`动画效果`，现在只有左右切换。