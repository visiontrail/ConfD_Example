//>>built
define("gridx/modules/AutoScroll","dojo/_base/declare dojo/_base/Deferred dojo/_base/window dojo/query dojo/dom-geometry ../core/_Module".split(" "),function(h,k,l,m,n,g){return g.register(h(g,{name:"autoScroll",constructor:function(){this.connect(l.doc,"mousemove","_onMouseMove")},enabled:!1,vertical:!0,horizontal:!0,margin:30,rowStep:1,columnStep:1,_timeout:300,_onMouseMove:function(a){if(this.arg("enabled")){var e,c,b=this.grid,f=this.arg("margin"),d=n.position(b.bodyNode);this.arg("vertical")&&
b.vScroller&&(e=a.clientY-d.y-f,c=e+2*f-d.h,this._vdir=0>e?e:0<c?c:0);this.arg("horizontal")&&b.hScroller&&(e=a.clientX-d.x-f,c=e+2*f-d.w,this._hdir=0>e?e:0<c?c:0);this._handler||this._scroll()}},_scroll:function(){var a=this;if(a.arg("enabled")){var e,c,b=a.grid,f=a._vdir,d=a._hdir;if(a.arg("vertical")&&f&&(e=0<f?1:-1,f=a._findNode(b.bodyNode.childNodes,function(a){if(0<e){if(a.offsetTop>=b.bodyNode.scrollTop+b.bodyNode.offsetHeight)return-1;if(a.offsetTop+a.offsetHeight<b.bodyNode.scrollTop+b.bodyNode.offsetHeight)return 1}else{if(a.offsetTop>
b.bodyNode.scrollTop)return-1;if(a.offsetTop+a.offsetHeight<=b.bodyNode.scrollTop)return 1}return 0})))c=parseInt(f.getAttribute("visualindex"),10),c=b.vScroller.scrollToRow(c+e*a.arg("rowStep"));if(a.arg("horizontal")&&d&&(e=0<d?1:-1,d=a._findNode(m(".gridxCell",b.header.domNode),function(a){if(0<e){if(a.offsetLeft>=b.hScrollerNode.scrollLeft+b.hScrollerNode.offsetWidth)return-1;if(a.offsetLeft+a.offsetWidth<b.hScrollerNode.scrollLeft+b.hScrollerNode.offsetWidth)return 1}else{if(a.offsetLeft>b.hScrollerNode.scrollLeft)return-1;
if(a.offsetLeft+a.offsetHeight<=b.vScrollerNode.scrollLeft)return 1}return 0})))d=b._columnsById[d.getAttribute("colid")].index+e*a.arg("columnStep"),d>=b._columns.length?d=b._columns.length-1:0>d&&(d=0),b.hScroller.scrollToColumn(b._columns[d].id),c=c||1;(a._handler=c)&&k.when(c,function(){a._handler=setTimeout(function(){a._scroll()},a._timeout)})}else delete a._handler},_findNode:function(a,e){for(var c=0,b=a.length,f=Math.floor((c+b)/2);c<b&&c!=f;){var d=e(a[f]);if(0>d)b=f,f=Math.floor((c+b)/
2);else if(0<d)c=f,f=Math.floor((c+b)/2);else break}return a[f]}}))});
//# sourceMappingURL=AutoScroll.js.map