//>>built
define("gridx/modules/Focus","dojo/_base/declare dojo/_base/array dojo/_base/connect dojo/_base/lang dojo/_base/sniff dojo/_base/window dojo/_base/event dojo/keys ../core/_Module".split(" "),function(n,l,p,q,f,k,r,s,t){function m(a,d){var c=0,b=a.length,e;for(e=Math.floor((c+b)/2);c+1<b;e=Math.floor((c+b)/2))0<d(a[e])?b=e:c=e;return a.length&&0<=d(a[c])?c:b}return n(t,{name:"focus",constructor:function(){var a=this,d=a.grid;a._areas={};a._tabQueue=[];a._focusNodes=[];a._onDocFocus=function(c){if(!a._noBlur){if(f("ie")||
f("trident"))c.target=c.srcElement;a._onFocus(c)}};a.arg("enabled",!d.touch);a.batchConnect([d.domNode,"onkeydown","_onTabDown"],[d.domNode,"onfocus","_focus"],[d.lastFocusNode,"onfocus","_focus"],[d,"onBlur","_doBlur"]);9>f("ie")?k.doc.attachEvent("onfocusin",a._onDocFocus):k.doc.addEventListener("focus",a._onDocFocus,!0)},destroy:function(){this._areaQueue=this._areas=null;this._focusNodes=[];this._queueIdx=-1;9>f("ie")?k.doc.detachEvent("onfocusin",this._onDocFocus):k.doc.removeEventListener("focus",
this._onDocFocus,!0);this.inherited(arguments)},registerArea:function(a){if(a&&a.name&&"number"==typeof a.priority){var d=this._tabQueue,c=function(b){a[b]=a[b]?q.hitch(a.scope||a,a[b]):function(){return!0}};this._areas[a.name]&&this.removeArea(a.name);c("doFocus");c("doBlur");c("onFocus");c("onBlur");a.connects=a.connects||[];this._areas[a.name]=a;c=m(d,function(b){return b.p-a.priority});d[c]&&d[c].p===a.priority?(d[c].stack.unshift(a.name),this._focusNodes[c]=a.focusNode||this._focusNodes[c]):
(d.splice(c,0,{p:a.priority,stack:[a.name]}),this._focusNodes.splice(c,0,a.focusNode))}},focusArea:function(a,d){var c=this._areas[a];if(c&&this.arg("enabled")){var b=this._areas[this.currentArea()];if(b&&b.name===a)return d&&b.doFocus(null,null,d),!0;if(!b||b.doBlur()){if(b)this.onBlurArea(b.name);if(c.doFocus())return this.onFocusArea(c.name),this._updateCurrentArea(c),!0;this._updateCurrentArea()}}return!1},blur:function(){var a=this._areas[this.currentArea()];a&&a.doBlur();this._queueIdx=-1;this._stackIdx=
0},currentArea:function(){var a=this._tabQueue[this._queueIdx];return a?a.stack[this._stackIdx]:""},tab:function(a,d){var c=this._areas,b=c[this.currentArea()];if(!a)return b?b.name:"";var e=this._queueIdx+a,u=0<a?1:-1,f=this._tabQueue;if(b){var h=b.doBlur(d,a),g=c[h];if(h)this.onBlurArea(b.name);if(g&&g.doFocus(d,a))return this.onFocusArea(g.name),this._updateCurrentArea(g),g.name;if(!h)return b.name}for(;0<=e&&e<f.length;e+=u){h=f[e].stack;for(b=0;b<h.length;++b)if(g=h[b],c[g].doFocus(d,a))return this.onFocusArea(g),
this._queueIdx=e,this._stackIdx=b,g}this._tabingOut=1;0>a?(this._queueIdx=-1,this.grid.domNode.focus()):(this._queueIdx=f.length,this.grid.lastFocusNode.focus());return""},removeArea:function(a){var d=this._areas[a];if(d){this.currentArea()===a&&this._updateCurrentArea();var c=m(this._tabQueue,function(a){return a.p-d.priority}),b,e=this._tabQueue[c].stack;for(b=e.length-1;0<=b;--b)if(e[b]===d.name){e.splice(b,1);break}e.length||(this._tabQueue.splice(c,1),this._focusNodes.splice(c,1));l.forEach(d.connects,
p.disconnect);delete this._areas[a];return!0}return!1},stopEvent:function(a){a&&r.stop(a)},onFocusArea:function(){},onBlurArea:function(){},_queueIdx:-1,_stackIdx:0,_onTabDown:function(a){this.arg("enabled")&&a.keyCode===s.TAB&&this.tab(a.shiftKey?-1:1,a)},_onFocus:function(a){var d,c,b,e;c=this.grid.domNode;b=a.target;var f=this._areas[this.currentArea()];if(this.arg("enabled")){for(;b&&b!==c;){d=l.indexOf(this._focusNodes,b);if(0<=d){b=this._tabQueue[d].stack;for(c=0;c<b.length;++c)if(e=this._areas[b[c]],
e.onFocus(a)){f&&f.name!==e.name&&(f.onBlur(a),this.onBlurArea(f.name));this.onFocusArea(e.name);this._queueIdx=d;this._stackIdx=c;break}return}b=b.parentNode}b==c&&f&&this._doBlur(a,f)}},_focus:function(a){this.arg("enabled")&&(this._tabingOut?this._tabingOut=0:a.target==this.grid.domNode?(this._queueIdx=-1,this.tab(1)):a.target===this.grid.lastFocusNode&&(this._queueIdx=this._tabQueue.length,this.tab(-1)))},_doBlur:function(a,d){this.arg("enabled")&&(!d&&this.currentArea()&&(d=this._areas[this.currentArea()]),
d&&(d.onBlur(a),this.onBlurArea(d.name),this._updateCurrentArea()))},_updateCurrentArea:function(a){var d=this._tabQueue;if(a){var c=this._queueIdx=m(d,function(b){return b.p-a.priority});this._stackIdx=l.indexOf(d[c].stack,a.name)}else this._queueIdx=null,this._stackIdx=0}})});
//# sourceMappingURL=Focus.js.map