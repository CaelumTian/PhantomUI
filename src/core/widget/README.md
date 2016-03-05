Widget  
=== 
Widget 是 UI 组件的基础类，继承自Base， 
它约定了组建的生命周期，提供了一些事件代理, widget缓存查询，
onRender等功能。PhantomUI所有的基础组件都继承于该类。 

# 基本使用  
## 定义一个组件：
```javascript
var MyWidget = Class.create(Widget, {
    attrs: {
        id: "myId",
        className: "myClassName",
        eventTarget: {
            trigger: "a"
        },
        events: null,
        template: '<div>' + '<a><button class="btn">点击我</button></a>' + '</div>',
        name: null,
    },
    //组件基础事件
    events: {
        "click {$eventTarget.trigger}": callback
    },
    //组件初始化方法
    setup: function() {
        this.render();
    },
    //name属性变更事件监听函数
    _onRenderName: function() {
        console.log("是我这里被触发了");
        console.log(arguments);
    }
});
```  
## 生命周期：  
Widget提供了init， render， destory三个生命周期。控制组件的创建，渲染，销毁整个过程。  
### init  
组件初始化阶段，该阶段会解析属性，缓存widget实例，代理组件事件，最后调用setup方法(需要用户复写)初始化  
### render  
将this.element插入到文档流中，默认插入到document.body，可以通过parentNode指定。我们可以在
setup函数中调用 render函数直接在初始化阶段插入节点。  
### destory  
组件销毁。将 widget 生成的 element 和事件都销毁。  

## 模板：  
渲染自定义模板，写在attr属性中。默认为"<div></div>" `_isTemplate`私有属性判断是否使用模板。渲染后，可通过this.element和this.$element分别获得DOM element和经过jQuery包装的element。  

## 事件代理：  
Widget默认将所有的组件事件，代理到`this.element`上方便管理，同时在组件内部结构发生变化
后，事件也无需重新绑定。 同样我们也可以显示的指定代理对象，这一般在和`Router`组件共同
时使用，我们会将事件全部代理到body上。  
### 事件代理API  
#### function delegateEvents([element], events, handler）  
绑定事件并指定事件代理  
`element` ： [DOM, Zepto] 指定事件代理对象，默认`this.element` 
`events` ： [String] 事件类型+绑定元素  
`handler` ： 回调函数  
```javascript
// 将this.clickHandler代理到ele上
this.delegateEvents(ele, 'click .btn', 'clickHandler');
// element为空时，默认代理到this.element上
this.delegateEvents('click .btn', 'clickHandler');
// 支持以对象形式传入
this.delegateEvents({ 'click .btn': 'clickHandler'});
```  
#### function undelegateEvents([element], eventKey)  
解除事件代理   
`element` ： 事件代理对象，默认`this.element`  
`eventKey` : [String] 事件类型+绑定元素  
```javascript
// 解除element上关于a的click事件代理
this.undelegateEvents(ele, "click a");
// element为空时，默认解除this.element上的对应代理
this.undelegateEvents("click a");
// eventKey为空时，解除所有事件代理
this.undelegateEvents();
```  
#### 组件事件代理：
我们可以在组件配置的时候传入需要的事件代理，也可以后期添加
```javascript
var MyWidget = Widget.extend({
    events: {
        "click .open": "open",
        "click .cancel", "close"
    },
    open: function() {
        ...
    },
    close: function() {
        ...
    },
    ...
});
```  
## Widget.query 
`selector` ： 传入css选择符
可通过Widget.query方法获得组件实例(组件实例保存在Widget的闭包中 cacheWidget)  

## _onRenderAttr  
通过Base类的事件系统，自动绑定所有attr属性变更事件，onRenderAttr方法会在以下两种情况下触发：
1. 属性改变时
2. 在调用render方法时（插入到文档流之前），但属性值为null或undefined时则不会触发。  

## 接下来要做的  
后续我们会考虑添加自动渲染(只需要指定data-*属性)，改善组件的生命周期，引入状态机，提高组件性能等。