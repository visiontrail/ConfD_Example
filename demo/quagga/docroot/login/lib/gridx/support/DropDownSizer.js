//>>built
define("gridx/support/DropDownSizer","dojo/_base/declare dojo/_base/lang dijit/_WidgetBase dijit/_FocusMixin dijit/_TemplatedMixin dijit/form/Select".split(" "),function(e,k,m,n,p,q){return e([m,n,p],{templateString:'\x3cdiv class\x3d"gridxDropDownSizer"\x3e\x3clabel class\x3d"gridxPagerLabel"\x3e${pageSizeLabel}\x3c/label\x3e\x3c/div\x3e',constructor:function(a){k.mixin(this,a.grid.nls)},postCreate:function(){var a=this;a.connect(a.grid.pagination,"onChangePageSize","_onChange");a.grid.pagination.loaded.then(function(){a.refresh()})},
startup:function(){this.inherited(arguments);this._onChange(this.grid.pagination.pageSize())},grid:null,sizes:[10,25,50,100,0],sizerClass:q,sizerProps:null,refresh:function(){for(var a=[],b=this.grid.pagination,f=b.pageSize(),c=this._sizeSwitchSelect,l=this.sizes,g=0,e=l.length;g<e;++g){var d=l[g],h=!(0<d);a.push({label:String(h?this.pageSizeAll:d),value:String(h?-1:d),selected:f==d||h&&b.isAll()})}c?(c.removeOption(c.getOptions()),c.addOption(a)):(f=this.sizerClass,a=k.mixin({options:a,"class":"gridxPagerSizeSwitchWidget",
"aria-label":"switch page size",onChange:function(a){b.setPageSize(0>a?0:a)}},this.sizerProps||{}),c=this._sizeSwitchSelect=new f(a),c.placeAt(this.domNode,"last"),c.startup())},_onChange:function(a){var b=this._sizeSwitchSelect;this.grid.pagination.isAll()&&(a=-1);b&&b.get("value")!=a&&b.set("value",a)}})});
//# sourceMappingURL=DropDownSizer.js.map