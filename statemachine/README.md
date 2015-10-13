### javascript有限状态机  
##### 使用方法
1.  创建全局对象StateMachine: `var fsm = StateMachine.create();`
2.  生成状态机：  

``` 
var fsm = StateMachine.create({
　　initial: 'green',   //初始状态
　　events: [
　　　　{ name: 'warn',  from: 'green',  to: 'yellow' },
　　　　{ name: 'stop', from: 'yellow', to: 'red' },
　　　　{ name: 'ready',  from: 'red',    to: 'yellow' },
　　　　{ name: 'go', from: 'yellow', to: 'green' }
　　],
　　callbacks: { 
　　    onpanic:  function(event, from, to, msg) { alert('panic! ' + msg);               },
　　    onclear:  function(event, from, to, msg) { alert('thanks to ' + msg);            },
　　    ongreen:  function(event, from, to)      { document.body.className = 'green';    },
　　    onyellow: function(event, from, to)      { document.body.className = 'yellow';   },
　　    onred:    function(event, from, to)      { document.body.className = 'red';      },
　  }
});
```
events参数：  `name` 切换状态事件名称 `from`起始时间 `to`终止事件
callbacks： 各种回调函数（命名方式参见下面）

 1.  生成实例以后，就可以随时查询当前状态：  

* `fsm.current` ：返回当前状态。
* `fsm.is(s)` ：返回一个布尔值，表示状态s是否为当前状态。
* `fsm.can(e)` ：返回一个布尔值，表示事件e是否能在当前状态触发。
* `fsm.cannot(e)` ：返回一个布尔值，表示事件e是否不能在当前状态触发   

State Machine允许为每个事件指定两个回调函数，以warn事件为例：    

* `onbeforewarn`：在warn事件发生之前触发。  
* `onafterwarn`（可简写成onwarn） ：在warn事件发生之后触发。  

同时，它也允许为每个状态指定两个回调函数，以green状态为例： 

* `onleavegreen` ：在离开green状态时触发。
* `onentergreen`（可简写成ongreen） ：在进入green状态时触发。    

假定warn事件使得状态从green变为yellow，上面四类回调函数的发生顺序如下：onbeforewarn → onleavegreen → onenteryellow → onafterwarn。
除了为每个事件和状态单独指定回调函数，还可以为所有的事件和状态指定通用的回调函数。

* `onbeforeevent` ：任一事件发生之前触发。
* `onleavestate` ：离开任一状态时触发。
* `onenterstate` ：进入任一状态时触发。
* `onafterevent` ：任一事件结束后触发。  

如果事件的回调函数里面有异步操作（比如与服务器进行Ajax通信），这时我们可能希望等到异步操作结束，再发生状态改变。这就要用到transition方法。
```
fsm.onwarn = function(){
　　light.fadeOut('slow', function() {
　　　　fsm.transition();
　　});
　　return StateMachine.ASYNC;
};
```

上面代码的回调函数里面，有一个异步操作（light.fadeOut）。如果不希望状态立即改变，就要让回调函数返回一个StateMachine.ASYNC对象，表示状态暂时不改变；等到异步操作结束，再调用transition方法，使得状态发生改变。
Javascript Finite State Machine还允许指定错误处理函数，当发生了当前状态不可能发生的事件时自动触发。  
```
var fsm = StateMachine.create({
　　error: function(eventName, from, to, args, errorCode, errorMessage) {
　　　　return 'event ' + eventName + ': ' + errorMessage;
　　},
});
```  
比如，当前状态是green，理论上这时只可能发生warn事件。要是这时发生了stop事件，就会触发上面的错误处理函数。


