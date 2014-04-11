
/* scoreboard-gs.js 1750007 */ YUI.add("media-scoreboard",function(a){function b(){b.superclass.constructor.apply(this,arguments)}b.ATTRS={loader:{value:null},league:{value:null},list:{value:1},node:{value:null},team:{value:null},bucket:{value:null},refresh:{value:null},frequency:{value:null},week:{value:null},date:{value:null},phase:{value:null},conf:{value:""},stream:{value:null},maxAge:{value:null},mygames:{value:[]},div:{value:null},season:{value:null},xhrPath:{value:null}};b.NAME="Scoreboard";a.namespace("Media.Sports").Scoreboard=a.extend(b,a.Base,{beacon:function(d){var c={data:{sec:d.hasOwnProperty("sec")?d.sec:(this.get("team")?"mod-tm-sch":"mod-sch"),pos:d.position,keys:{itc:d.hasOwnProperty("itc")?d.itc:0,tar:document.domain,slk:d.hasOwnProperty("slk")?d.slk:"game"}}};a.Global.fire("rapid-tracker:click",c)},initializer:function(d){this.set("node",a.one(d.node));if(!this.get("node")){return false}this.set("div",d.division);this.get("node").addClass("js");var e=this,c=null,f=e.get("node").one(".hd select");e.handle();if(d.refresh==="1"&&d.league){e.refresh();a.Global.on("request-manager:cleanup",function(){e.destroy()})}if(!f){return}c=new a.Media.Loader({node:e.get("node").one(".bd")});c.on("success",function(h){var g=JSON.parse(h.details[0].responseText);e.get("node").one(".bd").insert(JSON.parse(g).markup,"replace");e.handle()});c.on("failure",function(){});c.on("complete",function(){});e.set("loader",c);f.on("change",function(){var g=f.all("option").item(f.get("selectedIndex")),h=g.getAttribute("data-id");e.load(h);e.beacon({})});return this},bindUI:function(){a.log("binding scorething ui")},showDay:function(c,e){if(e){this.get("node").all(".days li").removeClass("selected")}var d=c.getAttribute("data-day"),f="#yom-sports-scorething-"+d;c.addClass("selected");this.get("node").all(".yom-sports-scorething-day").addClass("inactive");this.get("node").one(f).removeClass("inactive")},handle:function(){var f=this,c=this.get("node").one("table.list")?"tr":"tbody.game",d=this.get("node").all("table"),e=function(h){if(!h.target.ancestor("a",true)){var i=h.target.ancestor(f.get("node").one("table.list")?"tr":"tbody",true),g=i&&i.getAttribute("data-url")?i.getAttribute("data-url"):null;f.beacon({position:i.getAttribute("data-index")});h.halt();if(g){if((a.UA.os==="macintosh"&&h.metaKey)||(a.UA.os==="windows"&&h.ctrlKey)){window.open(g)}else{document.location=g}}}};d.each(function(g){g.delegate("click",e,c)});f.get("node").all(".days a").on("click",function(g){g.halt();f.showDay(g.target.ancestor("li",true),true)})},load:function(c){this.get("loader").load("/__xhr/sports/scorething-gs/",{data:"lid="+c+"&random="+Math.random()})},refresh:function(){if(!this.get("frequency")){return}var d={lid:this.get("league"),week:this.get("week"),date:this.get("date"),phase:this.get("phase"),conf:this.get("conf"),division:this.get("div"),season:this.get("season"),format:"realtime"},f=null,g=[],c=null,e=null;if(this.get("xhrPath")){e=this.get("xhrPath")+a.QueryString.stringify(d)}else{e="/__xhr/sports/scoreboard/gs/?"+a.QueryString.stringify(d)}f=new a.Sports.Scorestream({srcNode:this.get("node"),url:e,interval:this.get("frequency"),darlaEnabled:false,etagsEnabled:true,process:this.process,headers:{"Cache-Control":"max-age="+this.get("maxAge")}});if(this.get("league")==="mlb"){c=this.get("node").all("td.box .my");c.each(function(h){g.push(h.ancestor("td").getAttribute("data-gid"))})}else{c=this.get("node").all("tr.my");c.each(function(h){g.push(h.getAttribute("data-gid"))})}f.addAttr("mygames",{value:g});f.addAttr("league",{value:this.get("league")});f.addAttr("lastupdated",{value:null});f.fetch();f.flow();this.set("stream",f)},process:function(h){var d,j,o=this,k=this.get("mygames"),g=this.get("league"),i,n,m=this.get("srcNode"),f=h.games,e=h.settings,l,c;if(e.pollingEnabled===false){o.stop()}if(e.lastUpdated){if(e.lastUpdated>o.get("lastupdated")){o.set("lastupdated",e.lastUpdated)}else{return}}for(j in f){n=f[j];i=m.one('[data-gid="'+j+'"]');if(j&&n&&i){d=a.Node.create(n);if(a.Array.indexOf(k,j)!==-1){if(g==="mlb"){d.one(".game").addClass("my")}else{d.addClass("my")}}c=i.get("innerHTML");l=d.get("innerHTML");i.set("innerHTML",l)}}},destructor:function(){if(this.get("stream")){this.get("stream").stop();this.get("stream").destroy()}},toString:function(){return"Y.Media.Sports.Scoreboard"}})},"3.3.0",{requires:["media-loader","transition","get","widget","base","node","node-focusmanager","event","event-delegate","querystring-stringify-simple"]});/*
YUI 3.14.0 (build a01e97d)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("node-focusmanager",function(e,t){var n="activeDescendant",r="id",i="disabled",s="tabIndex",o="focused",u="focusClass",a="circular",f="UI",l="key",c=n+"Change",h="host",p={37:!0,38:!0,39:!0,40:!0},d={a:!0,button:!0,input:!0,object:!0},v=e.Lang,m=e.UA,g=function(){g.superclass.constructor.apply(this,arguments)};g.ATTRS={focused:{value:!1,readOnly:!0},descendants:{getter:function(e){return this.get(h).all(e)}},activeDescendant:{setter:function(t){var n=v.isNumber,i=e.Attribute.INVALID_VALUE,s=this._descendantsMap,o=this._descendants,u,a,f;return n(t)?(u=t,a=u):t instanceof e.Node&&s?(u=s[t.get(r)],n(u)?a=u:a=i):a=i,o&&(f=o.item(u),f&&f.get("disabled")&&(a=i)),a}},keys:{value:{next:null,previous:null}},focusClass:{},circular:{value:!0}},e.extend(g,e.Plugin.Base,{_stopped:!0,_descendants:null,_descendantsMap:null,_focusedNode:null,_lastNodeIndex:0,_eventHandlers:null,_initDescendants:function(){var t=this.get("descendants"),o={},u=-1,a,f=this.get(n),l,c,h=0;v.isUndefined(f)&&(f=-1);if(t){a=t.size();for(h=0;h<a;h++)l=t.item(h),u===-1&&!l.get(i)&&(u=h),f<0&&parseInt(l.getAttribute(s,2),10)===0&&(f=h),l&&l.set(s,-1),c=l.get(r),c||(c=e.guid(),l.set(r,c)),o[c]=h;f<0&&(f=0),l=t.item(f);if(!l||l.get(i))l=t.item(u),f=u;this._lastNodeIndex=a-1,this._descendants=t,this._descendantsMap=o,this.set(n,f),l&&l.set(s,0)}},_isDescendant:function(e){return e.get(r)in this._descendantsMap},_removeFocusClass:function(){var e=this._focusedNode,t=this.get(u),n;t&&(n=v.isString(t)?t:t.className),e&&n&&e.removeClass(n)},_detachKeyHandler:function(){var e=this._prevKeyHandler,t=this._nextKeyHandler;e&&e.detach(),t&&t.detach()},_preventScroll:function(e){p[e.keyCode]&&this._isDescendant(e.target)&&e.preventDefault()},_fireClick:function(e){var t=e.target,n=t.get("nodeName").toLowerCase();e.keyCode===13&&(!d[n]||n==="a"&&!t.getAttribute("href"))&&t.simulate("click")},_attachKeyHandler:function(){this._detachKeyHandler();var t=this.get("keys.next"),n=this.get("keys.previous"),r=this.get(h),i=this._eventHandlers;n&&(this._prevKeyHandler=e.on(l,e.bind(this._focusPrevious,this),r,n)),t&&(this._nextKeyHandler=e.on(l,e.bind(this._focusNext,this),r,t)),m.opera&&i.push(r.on("keypress",this._preventScroll,this)),m.opera||i.push(r.on("keypress",this._fireClick,this))},_detachEventHandlers:function(){this._detachKeyHandler();var t=this._eventHandlers;t&&(e.Array.each(t,function(e){e.detach()}),this._eventHandlers=null)},_attachEventHandlers:function(){var t=this._descendants,n,r,i;t&&t.size()&&(n=this._eventHandlers||[],r=this.get(h).get("ownerDocument"),n.length===0&&(n.push(r.on("focus",this._onDocFocus,this)),n.push(r.on("mousedown",this._onDocMouseDown,this)),n.push(this.after("keysChange",this._attachKeyHandler)),n.push(this.after("descendantsChange",this._initDescendants)),n.push(this.after(c,this._afterActiveDescendantChange)),i=this.after("focusedChange",e.bind(function(e){e.newVal&&(this._attachKeyHandler(),i.detach())},this)),n.push(i)),this._eventHandlers=n)},_onDocMouseDown:function(e){var t=this.get(h),n=e.target,r=t.contains(n),i,s=function(e){var n=!1;return e.compareTo(t)||(n=this._isDescendant(e)?e:s.call(this,e.get("parentNode"))),n};r&&(i=s.call(this,n),i?n=i:!i&&this.get(o)&&(this._set(o,!1),this._onDocFocus(e))),r&&this._isDescendant(n)?this.focus(n):m.webkit&&this.get(o)&&(!r||r&&!this._isDescendant(n))&&(this._set(o,!1),this._onDocFocus(e))},_onDocFocus:function(e){var t=this._focusTarget||e.target,n=this.get(o),r=this.get(u),i=this._focusedNode,s;this._focusTarget&&(this._focusTarget=null),this.get(h).contains(t)?(s=this._isDescendant(t),!n&&s?n=!0:n&&!s&&(n=!1)):n=!1,r&&(i&&(!i.compareTo(t)||!n)&&this._removeFocusClass(),s&&n&&(r.fn?(t=r.fn(t),t.addClass(r.className)):t.addClass(r),this._focusedNode=t)),this._set(o,n)},_focusNext:function(e,t){var r=t||this.get(n),i;this._isDescendant(e.target)&&r<=this._lastNodeIndex&&(r+=1,r===this._lastNodeIndex+1&&this.get(a)&&(r=0),i=this._descendants.item(r),i&&(i.get("disabled")?this._focusNext(e,r):this.focus(r))),this._preventScroll(e)},_focusPrevious:function(e,t){var r=t||this.get(n),i;this._isDescendant(e.target)&&r>=0&&(r-=1,r===-1&&this.get(a)&&(r=this._lastNodeIndex),i=this._descendants.item(r),i&&(i.get("disabled")?this._focusPrevious(e,r):this.focus(r))),this._preventScroll(e)},_afterActiveDescendantChange:function(e){var t=this._descendants.item(e.prevVal);t&&t.set(s,-1),t=this._descendants.item(e.newVal),t&&t.set(s,0)},initializer:function(e){this.start()},destructor:function(){this.stop(),this.get(h).focusManager=null},focus:function(e){v.isUndefined(e)&&(e=this.get(n)),this.set(n,e,{src:f});var t=this._descendants.item(this.get(n));t&&(t.focus(),m.opera&&t.get("nodeName").toLowerCase()==="button"&&(this._focusTarget=t))},blur:function(){var e;this.get(o)&&(e=this._descendants.item(this.get(n)),e&&(e.blur(),this._removeFocusClass()),this._set(o,!1,{src:f}))},start:function(){this._stopped&&(this._initDescendants(),this._attachEventHandlers(),this._stopped=!1)},stop:function(){this._stopped||(this._detachEventHandlers(),this._descendants=null,this._focusedNode=null,this._lastNodeIndex=0,this._stopped=!0)},refresh:function(){this._initDescendants(),this._eventHandlers||this._attachEventHandlers()}}),g.NAME="nodeFocusManager",g.NS="focusManager",e.namespace("Plugin"),e.Plugin.NodeFocusManager=g},"3.14.0",{requires:["attribute","node","plugin","node-event-simulate","event-key","event-focus"]});
