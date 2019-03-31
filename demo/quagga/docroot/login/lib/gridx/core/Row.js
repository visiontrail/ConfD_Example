//>>built
define("gridx/core/Row",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred"],function(k,d,g){return k([],{constructor:function(a,b){this.grid=a;this.model=a.model;this.id=b},index:function(){return this.model.idToIndex(this.id)},parent:function(){return this.grid.row(this.model.parentId(this.id),1)},cell:function(a,b){return this.grid.cell(this,a,b)},cells:function(a,b){for(var f=this.grid,e=[],c=f._columns,d=c.length,h=a||0,g=0<=b?a+b:d;h<g&&h<d;++h)e.push(f.cell(this.id,c[h].id,1));return e},
data:function(){return this.model.byId(this.id).data},rawData:function(){return this.model.byId(this.id).rawData},item:function(){return this.model.byId(this.id).item},setRawData:function(a){var b=this.grid.store,f=this.item(),e,c;if(b.setValue){c=new g;try{for(e in a)b.setValue(f,e,a[e]);b.save({onComplete:d.hitch(c,c.callback),onError:d.hitch(c,c.errback)})}catch(k){c.errback(k)}}return c||g.when(b.put(d.mixin(d.clone(f),a)))}})});
//# sourceMappingURL=Row.js.map