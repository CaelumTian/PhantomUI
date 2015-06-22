/*
 * Created by DELL on 2015/6/23. LRU缓存
 */
function LRUcache(options) {
    options = options || {};
    if(!(this instanceof LRUcache)) {
        return new LRUcache(options);
    }
    if(typeof options === 'number') {
        options = {
            'max' : options   //缓存最大的长度
        }
    }
    this._max = options.max;
    if(!this._max || !(typeof this._max === 'number') || this._max < 0){
        this._max = Infinity;    //没有设置最大值
    }
    this.reset();
}
LRUcache.prototype.reset = function() {
    this._cache = Object.create(null);   //储存数据的哈希表
    this._lruList = Object.create(null); //最近使用的数据存储
    this._length = 0;    //缓存长度
}
LRUcache.prototype.set = function(key, value) {
    
}