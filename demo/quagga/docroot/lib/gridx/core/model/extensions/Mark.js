//>>built
define("gridx/core/model/extensions/Mark",["dojo/_base/declare","dojo/_base/array","../_Extension"],function(s,n,t){return s(t,{name:"mark",priority:5,constructor:function(a){this.mixed="mixed";this.states={"0":!1,1:this.mixed,2:!0};this.clear();this._tree={};this._mixinAPI("getMark","getMarkedIds","markById","markByIndex","clearMark","treeMarkMode","setMarkable");this.aspect(a,"_msg","_receiveMsg");this.aspect(a._cache,"onLoadRow","_onLoadRow");this.aspect(a,"setStore","clear");a.onMarkChange=function(){};
a._spTypes={}},clear:function(){this._byId={};this._last={};this._lazy={};this._unmarkable={}},setMarkable:function(a,b,c){c=this._initMark(c);var d=this.model._model,e=this._unmarkable;(e[c]=e[c]||{})[a]=!b;b&&(b=d._call("children",[a]),d=b.length?b[0]:d._call("parentId",[a]),a=this._byId[this._initMark(c)][d]||0,this._doMark(d,c,a))},clearMark:function(a){this._byId[this._initMark(a)]={}},getMarkedIds:function(a,b){var c=[],d,e=this._initMark(a);if(e=this._byId[e])for(d in e)(b||2==e[d])&&c.push(d);
return c},isMarked:function(a,b){b=this._initMark(b);return 2==this._byId[b][a]},isPartialMarked:function(a,b){return 1==this._byId[this._initMark(b)][a]},getMark:function(a,b){var c=this._byId[this._initMark(b)][a]||0;return{"0":!1,1:this.mixed,2:!0}[c]},markById:function(a,b,c){this._cmd(a,b,c,1)},markByIndex:function(a,b,c,d){0<=a&&Infinity>a&&this._cmd(a,b,c,0,d)},treeMarkMode:function(a,b){a=this._initMark(a);var c=this._tree;return void 0===b?c[a]:c[a]=b},_cmdMark:function(){var a=this,b=arguments,
c=[],d=a.model._model;n.forEach(b,function(a){a[3]||c.push({start:a[0],count:1})});return d._call("when",[{id:[],range:c},function(){n.forEach(b,function(b){var c=b[3]?b[0]:d._call("indexToId",[b[0],b[4]]),f=b[1];b=a._initMark(b[2]);f=f===a.mixed?1:f?2:0;a.model.isId(c)&&a._isMarkable(b,c)&&a._mark(c,f,b)})}])},_onDelete:function(a,b,c){var d,e=this._byId,g=this._last,f=this._lazy;for(d in e)d=this._initMark(d),delete e[d][a],delete g[d][a],delete f[d][a],c&&this._updateParents(c,d);this.onDelete.apply(this,
arguments)},_initMark:function(a){var b=this._byId,c=this._last,d=this._lazy;a=a||"select";b[a]=b[a]||{};d[a]=d[a]||{};c[a]=c[a]||{};return a},_cmd:function(){this.model._addCmd({name:"_cmdMark",scope:this,args:arguments,async:1})},_receiveMsg:function(a,b){if("filter"==a){var c,d,e=this.model._spTypes;for(c in e)if(e[c])for(d in this._byId[c])0>n.indexOf(b,d)&&this._doMark(d,c,0,0,1)}},_mark:function(a,b,c){c=this._initMark(c);var d=this._byId[c][a]||0;this.model.isId(a)&&d!=b&&this._doMark(a,c,
b)},_onLoadRow:function(a){var b=this.model,c=b._model,d=this._lazy,e,g,f=c._call("treePath",[a]).pop();if(b.isId(f))for(e in d)b=d[e],g=b[f],"number"==typeof g&&(g=b[f]={toMark:g,count:c._call("size",[f])}),g&&(--g.count,g.count||delete b[f],this._doMark(a,e,g.toMark,1))},_fireEvent:function(a,b,c,d){var e=this.model;c!=d&&(c||delete this._byId[b][a],e.onMarkChange(a,this.states[c||0],this.states[d||0],b))},_updateParents:function(a,b,c){for(var d=this.model._model,e=this._byId[b],g=this._last[b],
f=a.length-1;0<f;--f){var h=a[f],k=e[h],l=d._call("children",[h]),m=n.filter(l,function(a){return g[a]=e[a]}).length,p=n.filter(l,function(a){return 2==e[a]}).length;0!=p&&p==l.length&&2!=k?e[h]=2:!m&&k?delete e[h]:m&&(p<l.length&&1!=k)&&(e[h]=1);c||this._fireEvent(h,b,e[h],k)}},_doMark:function(a,b,c,d,e){var g,f,h,k=this.model._model,l=this._byId[b],m=this._last[b],p=this._lazy[b],q=l[a]||0,r;this._tree[b]&&(f=k._call("children",[a]),1==c&&n.every(f,function(a){return(m[a]||0)==(m[f[0]]||0)})&&
(c=2));l[a]=m[a]=c;e||this._fireEvent(a,b,c,q);if(this._tree[b]){for(g=[a];g.length;)h=g.shift(),q=l[h]||0,r=l[h]=1==c?m[h]||0:c,e||this._fireEvent(h,b,r,q),k._call("hasChildren",[h])&&(f=k._call("children",[h]),f.length?g=g.concat(f):p[h]=c);d||(a=k._call("treePath",[a]),this._updateParents(a,b,e))}},_isMarkable:function(a,b){return this._unmarkable[a]?!this._unmarkable[a][b]:!0}})});
//# sourceMappingURL=Mark.js.map