//>>built
define("gridx/modules/filter/FilterTooltip","dojo/_base/array dojo/_base/event dojo/dom-class dijit/popup dojo/_base/declare dojo/string dijit/TooltipDialog".split(" "),function(h,k,d,g,l,m,n){return l(n,{grid:null,filterBar:null,postCreate:function(){this.inherited(arguments);this.filterBar=this.grid.filterBar;this.connect(this,"onClick","_onClick");this.connect(this,"onMouseEnter","_onMouseEnter");this.connect(this,"onMouseLeave","_onMouseLeave");d.add(this.domNode,"gridxFilterTooltip");d.add(this.domNode,
"dijitTooltipBelow")},show:function(a){this.inherited(arguments);g.open({popup:this,x:a.pageX,y:a.pageY,padding:{x:-6,y:-3}})},hide:function(){this.inherited(arguments);g.close(this)},buildContent:function(){var a=this.filterBar,c=a._nls,b=a.filterData;if(b&&b.conditions.length){var e=['\x3cdiv class\x3d"gridxFilterTooltipTitle"\x3e\x3cb\x3e${i18n.statusTipTitleHasFilter}\x3c/b\x3e ',"all"===b.type?c.statusTipHeaderAll:c.statusTipHeaderAny,"\x3c/div\x3e\x3ctable\x3e\x3ctr\x3e\x3cth\x3e${i18n.statusTipHeaderColumn}\x3c/th\x3e\x3cth\x3e${i18n.statusTipHeaderCondition}\x3c/th\x3e\x3c/tr\x3e"];
h.forEach(b.conditions,function(b,c){var d=c%2?' class\x3d"gridxFilterTooltipOddRow"':"";if(b.colId)var f=this.grid.column(b.colId).name(),f=this.grid.enforceTextDirWithUcc(b.colId,f);e.push("\x3ctr",d,"\x3e\x3ctd\x3e",b.colId?f:"${i18n.anyColumnOption}",'\x3c/td\x3e\x3ctd class\x3d"gridxFilterTooltipValueCell"\x3e',"\x3cdiv\x3e",a._getRuleString(b.condition,b.value,b.type),'\x3cspan action\x3d"remove-rule" title\x3d"${i18n.removeRuleButton}"',' class\x3d"gridxFilterTooltipRemoveBtn"\x3e\x3cspan class\x3d"gridxFilterTooltipRemoveBtnText"\x3ex\x3c/span\x3e\x3c/span\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e')},
this);e.push("\x3c/table\x3e");this.i18n=this.grid.nls;this.set("content",m.substitute(e.join(""),this));d.toggle(this.domNode,"gridxFilterTooltipSingleRule",1===b.conditions.length)}},_onMouseEnter:function(a){this.isMouseOn=!0},_onMouseLeave:function(a){this.isMouseOn=!1;this.hide()},_onClick:function(a){var c=this._getTr(a),b=this.filterBar;c&&/^span$/i.test(a.target.tagName)?(b.filterData.conditions.splice(c.rowIndex-1,1),c.parentNode.removeChild(c),b.applyFilter(b.filterData),k.stop(a)):(this.filterBar.showFilterDialog(),
this.hide())},_getTr:function(a){for(a=a.target;a&&!/^tr$/i.test(a.tagName)&&a!==this.domNode;)a=a.parentNode;return a&&/^tr$/i.test(a.tagName)?a:null}})});
//# sourceMappingURL=FilterTooltip.js.map