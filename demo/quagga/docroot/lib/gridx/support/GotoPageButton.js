//>>built
define("gridx/support/GotoPageButton","dojo/_base/declare dojo/_base/lang dojo/string ./_LinkPageBase ./GotoPagePane dijit/Dialog dijit/form/Button dijit/form/NumberTextBox dojo/keys dojo/_base/event".split(" "),function(c,d,e,f,g,h,k,l,m,n){return c(f,{templateString:"\x3cspan class\x3d'gridxPagerGotoBtn' tabindex\x3d'${_tabIndex}' title\x3d'${gotoBtnTitle}' aria-label\x3d'${gotoBtnTitle}' data-dojo-attach-event\x3d'onclick: _showGotoDialog'\x3e\x3cspan class\x3d'gridxPagerA11yInner'\x3e\x26#9650;\x3c/span\x3e\x3c/span\x3e",
gotoPagePane:g,dialogClass:h,buttonClass:k,numberTextBoxClass:l,refresh:function(){},_showGotoDialog:function(){if(!this._gotoDialog){var a=this.dialogClass,b=d.mixin({title:this.gotoDialogTitle,content:new this.gotoPagePane({pager:this,pagination:this.grid.pagination})},this.dialogProps||{}),a=this._gotoDialog=new a(b);a.content.dialog=a}a=this.grid.pagination.pageCount();b=this._gotoDialog.content;b.pageCountMsgNode.innerHTML=e.substitute(this.gotoDialogPageCount,[a]);b.pageInputBox.constraints=
{fractional:!1,min:1,max:a};b.pageInputBox.set("value",b.pagination.currentPage()+1);this._gotoDialog.show();b.pageInputBox.focusNode.select()},_onKey:function(a){a.keyCode==m.ENTER&&(this._showGotoDialog(),n.stop(a))},_focusNextBtn:function(){},destroy:function(){this._gotoDialog&&this._gotoDialog.destroy();this.inherited(arguments)}})});
//# sourceMappingURL=GotoPageButton.js.map