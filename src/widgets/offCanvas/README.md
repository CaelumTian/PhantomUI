OffCanvas 侧滑组件  
===
[使用DEMO](http://t-phantom.github.io/PhantomUI/offCanvas/)    
提供一个可用于左侧或右侧滑出的面板。 

## 一丶添加侧栏  
在页面中添加侧栏需要指定一个div为`offcanvas-overlay` 用于遮罩，div为`offcanvas`用于
侧滑面板容器， 参考如下：  
```html
<div class="offcanvas-overlay"></div>
<div class="offcanvas">
    <div class="wrap">
        <p>我是offcanvas层</p>
        <p>开启: offcanvas.openCanvas</p>
        <p>关闭: offcanvas.closeCanvas</p>
        <a id="close">关闭</a>
    </div>
</div>
```  
js中我们要初始化侧栏  
```javascript
var offcanvas = new OffCanvas({
    element : ".offcanvas",
    callbackClose : function() {
        if(this.get("overlayShow")) {
            this.set("overlayShow", false);
        }
    }
});
``` 

## 二丶配置如下：  
```javascript
attrs : {
    direction : "left",    //导航划入方向，可选left，right 默认right
    effect : "reveal",     //导航效果,可选有reveal cover 默认reveal
    touchAction : false,   //是否开启手势滑动, 暂未开启
    overlayShow : false,   //遮罩层是否显示
    callbackOpen : null,
    callbackClose : null,
}  
```  
在生成对象的时候，我们可以初始化侧滑方向和动画效果等。同时该插件支持动态的修改，侧滑方向
和动画效果配置。(注意不要在运行中修改，带侧滑完全关闭后可动态修改)，如下:  
```javascript   
offcanvas.set("direction", "right");
offcanvas.set("effect", "reveal")；  
```  
支持事件如下：  
|  事件类型  |  触发说明       |
|:----------:|:---------------:|
|~~open~~    |侧滑打开时触发   |
|opened      |侧滑打开完毕触发 |
|~~close~~   |侧滑关闭时触发   |  
|closed      |侧滑关闭完成触发 |    
初始化，时候提供对事件回调函数的传入。
(删除内容，为加入的但没有提供扩展接口，后续手势时会考虑是否保留)  

## 操作函数  
### offcanvas.openCanvas()   
JS打开侧滑菜单  
### offcanvas.closeCanvas()  
JS关闭侧滑菜单  

## 待更新问题  
1. 当前版本没有手势开关侧滑菜单，考虑是否需要加入(接口已经预留)   
2. 当前版本默认遮罩层透明，需要修改的可以在`offcanvas-lay`类中修改`background`值  
3. 该组件在和router组件混用的时候，注意要在router切换前关闭侧滑菜单。
