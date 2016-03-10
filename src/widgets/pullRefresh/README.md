PullRefresh  
===    
[DEMO](http://t-phantom.github.io/PhantomUI/pullRefresh/)  
PullRefresh 组件继承自 `Widget` 组件，提供一个用于下拉刷新的容器.  
## 一丶使用说明  
页面假如如下HTML  
```html    
<div class="pull-refresh-content">
    <!-- 下拉层 -->
    <div class="pull-refresh-layer">
   		<div class="preloader"></div>
    	<div class="pull-refresh-arrow"></div>
    </div>
</div>  
```  
关键类名：  
`pull-refresh-content` : 下拉容器标识，必须拥有  
`pull-refresh-layer` ： 下拉顶部刷新层  
`preloader` ： loading 图标  
`pull-refresh-arrow` ： 刷新箭头  

## 二丶下拉配置项  
```javascript  
element : '.pull-refresh-content',  //指定容器
attrs : {
    top : 0,                //下拉刷新 容器 上端距离
    distance : 45,          //下拉刷新距离，默认45
    handleRefresh : null,   //下拉回调函数
},
```
js使用方式：  
```javascript
var pull = new PullRefresh({
    element : ".pull-refresh-content",
    handleRefresh : function() {
        //延迟2s执行，用于模拟加载时间
        setTimeout(function() {
            var html =   '<li>'
                        +   '<a href="">测试数据' + (++count) + '</a>'
                        +'</li>'
                        +'<li>'
                        +   '<a href="">测试数据' + (++count) + '</a>'
                        +'</li>';
            $(".list").prepend(html);  
            
            //pull调用refreshDone函数，说明加载完毕
            pull.refreshDone();
        }, 2000)
    }
});
```   
## 三丶提供的函数接口  

### pull.refreshDone()  
触发刷新结束，请在`handleRefresh`中调用该方法，已完成刷新。  

### pull.refreshTrigger()  
用js手动触发指定页面刷新  






