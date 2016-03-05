core 组件库核心  
===  
核心组件由三部分组成：Class.js Base.js Widget.js   

* Class.js 实现简单的OO原型继承    
* Base.js 是个基础类， 提供了`event`，`attribute`功能 
* Widget.js UI组件基础类，继承自Base。它约定了组建的生命周期，提供了一些事件代理，data-api, widget缓存查询，onRender等功能。  

PhantomUI基础组件库都依赖于Widget类
