var ghost = (function(window) {
	var docElem = window.document.documentElement,
		contains,
		hasCompare = docElem.compareDocumentPosition !== undefined;   //返回节点位置函数
	contains = hasCompare || (docElem.contains !== undefined) ? 
		function (a, b) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;     //b存在，且b的父节点存在，bup等于父节点
				return a === bup || (bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition( bup ) & 16))
		} :
		function (a, b) {
			if(b) {
				while(b.parentNode) {
					if(b === a) {
						return true;
					}
				}
			}
			return false;
		}
	sortOrder =  hasCompare ?
		function(a, b) {
			if(a === b) {
				return 0;
			}
			if(!a.compareDocumentPosition || !b.compareDocumentPosition) {
				return a.compareDocumentPosition ? -1 : 1;   //如果两个节点有一个没有方法
			}
			//判断a,b是否在一个文档中，||区分document.ownerDocument === null
			var compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
			return compare & 4 ? -1  : 1; //a在b之前返回-1
		} :
		function(a, b) {

		}
	return {
		contains : contains,
		sortOrder : sortOrder
	}
})(window)