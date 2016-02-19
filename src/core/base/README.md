## Class  

---  
提供简单的OO原型继承   

---  
### 使用说明：  
#### 1. 创建类： 
通过`Class.create([properties])`创建类，`properties`为属性对象;   
>  `init` 初始化方法，会在创建实例是被调用  
>  `statics` 类的静态方法，ClassName.fn()

例子：  
```javascript  
var Person = Class.create({
    init : function(name, age) {
        this.name = name;
        this.age = age;
    },
    statics : function() {
        console.log("我是Person类");
    }
})
var per = new Person("phantom", 1);
```  
#### 2. 继承类  
使用`Class.create(superClass, properties)` 继承父类`superClass`  
> this._super 保存有父类属性，可以用于子类中调用父类方法  

```javascript  
var Teacher = Class.create(Person, {
    init : function(name, age, school) {
        this._super.init.call(this, name, age);  //调用父类init
        this.school = school;
    },
    teach : function() {
        console.log(this.name + "上课呢");
    }
})
var te = new Teacher("cjk", 30, 't_hot');
```  
`ClassName.prototype._super`上保持对父类原型的引用，所以可以利用这个访问父类方法，但是注意有this的要保证this指向。  
这里的this._super.fn.call(this, [...]) 似乎有点麻烦，下面提供一个改进方法。   
```javascript 
/*
 * 参考simple-inherittance
 * 利用fnText检测函数中是否含有_super，来判断是否需要临时改变this._super值重写方法。
 */
 var fnText = /xyz/.text(function() {
    xyz;
 }) ? /\b_super\b/ : /.*/ 
 for(var name in definition) {
    _Object.prototype[name] = typeof definition[name] === 'function' && typeof _super[fn] === 'function' && fnText.test(definition[name]) ?
    (function(name, fn) {
        return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
        }
    })(name, definition[fn])
 }
```
