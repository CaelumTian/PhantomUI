var Caelum={};
Caelum.String = (function(){
	 var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
	 return CaelumString = {
	 	trim: function(string) {
            if (string) {
            	string = string.replace(trimRegex, "");
            }
            return string || '';
        },
        contains: function(string, search) {
        	if(search === void 0) {
        		return false;
        	}
        	return string.indexOf(search) !== -1;
        },
        //查找字符串，搜索字符串，是否区分大小写
        startWith: function(string, search, ignorecase) {
        	var result = string.substr(0, search.length);
        	return ignorecase ? result.toUpperCase() === string.toUpperCase() : result === search;
        },
        endWith: function(string, search, ignorecase) {
        	var result = string.substr(string.length - search.length);
        	return ignorecase ? result.toUpperCase() === string.toUpperCase() : result === search;
        },
        //n为一共有几次重复
        repeat: function(target, n, sep) {
        	n = n < 0 ? 0 : n;
        	for(var buf=[]; n > 0; n--){
        		buf.push(target);
        	}
        	return buf.join(sep || "");
        },
        //获取字节长度
        byteLen: function(string, fix) {
        	fix = fix ? fix : 2;
        	var str = new Array(fix + 1).join("-");
        	return string.replace(/[^\x00-\xff]/g,str).length;    //将汉字全部替换成 -- 之类的,然后查看长度
        },
        //len为最后总长度
        ellipsis: function(string, len, escripe) {
        	len = len || 30;  //默认30截去
        	escripe = escripe === void 0 ? "..." : escripe;
        	return string.length > len ? string.slice(0, len - escripe.length) + escripe : string;  
        },
        //返回首字母大写
        capitalize: function(string) {
        	return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
        },
        // len为总长度，direct:  PAD_LEFT   PAD_RIGHT 两种常量，默认PAD_RIGHT
        pad: function(string, len, fill, direct) {
        	fill = fill || "0";
        	while(string.length < len) {
        		if(direct === "PAD_LEFT") {
        			string = fill + string;
        		}else{
        			string = string + fill;
        		}
        	}
        	return string;
        },
        //驼峰形式,css选择器使用
        camelize: function(string) {
        	if(string.indexOf("-") < 0 && string.indexOf("_") < 0){
        		return string;   //直接返回
        	}
        	return string.replace(/[-_][^-_]/g, function(match){
        		return match.charAt(1).toUpperCase();
        	})
        },
        urlAppend: function(url, string) {
        	return string === void 0 ? string : url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        },
        //删除script标签
        removeScripts: function(string) {
        	return string === void 0 ? string : string.replace(/<script[^>]*>([\S\s]*?)<\/script>/img,"");
        },
        //格式化输出 {0},{1}    {name}   {age}
        format: function (string, args){
        	var array = Array.prototype.slice.call(arguments,1);
        	return string.replace(/\{([^{}]+)\}/gm,function(match,name){
        		var index = Number(name);   //尝试是不是数字;
        		if(index >= 0){
        			return array[index];
        		}
        		if(args && args[name] !== void 0){
        			return args[name];
        		}
        		return '';   //都没有的情况下
        	})
        }
	 }
})()
