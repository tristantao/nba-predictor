if(!window.ucs){window.ucs={};window.ucs._sendBeacon=function(c,b){var a=new Image();a.height=0;a.width=0;a.src="https://geo.yahoo.com/t"+c;document.body.appendChild(a);};window.ucs.YObj=(function(){var a=document.getElementById("yucs");return(typeof window.Y!=="undefined"&&(a&&a.getAttribute("data-property")==="srp"))?window.Y:YUI();})();}YUI.add("gallery-jsonp",function(b){var a=b.Lang.isObject,c=b.Lang.isFunction;function d(){this._init.apply(this,arguments);}d._pattern=/\bcallback=(.*?)(?=&|$)/i;d._template="callback={callback}";d.prototype={_init:function(f,e){this.url=f;e=e||{};if(c(e)){e={on:{success:e}};}e.on=e.on||{};if(!e.on.success){e.on.success=this._getCallbackFromUrl(f);}this._config=b.merge({on:{},context:this,args:[],format:this._format},e);},_getCallbackFromUrl:function(i){var j=i.match(d._pattern),e,g,f,h;if(j){g=b.config.win;f=j[1].split(/\./).reverse();e=f.shift();for(h=f.length-1;h>=0;--h){g=g[f[h]];if(!a(g)){return null;}}if(a(g)&&c(g[e])){return b.bind(g[e],g);}}return null;},send:function(e){if(!this._config.on.success){return this;}var g=b.guid().replace(/-/g,"_"),h=this._config,i=h.format.call(this,this.url,"YUI.Env.JSONP."+g);function f(j){return(c(j))?function(k){delete YUI.Env.JSONP[g];j.apply(h.context,[k].concat(h.args));}:null;}YUI.Env.JSONP[g]=f(h.on.success);b.Get.script(i,{onFailure:f(h.on.failure),onTimeout:f(h.on.timeout||h.on.failure),timeout:h.timeout});return this;},_format:function(h,f){var e=d._template.replace(/\{callback\}/,f),g;if(d._pattern.test(h)){return h.replace(d._pattern,e);}else{g=h.slice(-1);if(g!=="&"&&g!=="?"){h+=(h.indexOf("?")>-1)?"&":"?";}return h+e;}}};b.JSONPRequest=d;b.jsonp=function(f,e){return new b.JSONPRequest(f,e).send();};if(!YUI.Env.JSONP){YUI.Env.JSONP={};}},"gallery-2010.08.11-20-39",{requires:["get","oop"]});YUI.add("ucs-menu-utils",function(c){c.namespace("ucs");if(c.ucs.MenuUtils){return;}var m="{separatorTop}"+'<li class="{isDisabled} {isActive} {menuClass}">'+'<a target="{target}" {actionData} href="{url}" {disabledAria}>'+"{icon}"+"{menuText}"+"</a></li>"+"{separatorBottom}",r="{separatorTop}"+'<li class="{isDisabled} {isActive} {menuClass}">'+'<a href="#" data-customevt="true" {actionData} {disabledAria} {checkedAria}>'+"{icon}"+"{menuText}"+"</a></li>"+"{separatorBottom}",l='<span class="separator" role="presentation"></span>',g="click",p="a",h="role",a="tabIndex",f="yucs-hide",b="iframe",j="ul",d="li",o="parentNode",q="http://l.yimg.com/a/lib/ush/icon.gif",e="https://s.yimg.com/lq/lib/ush/icon.gif",k=300,i,n;c.ucs.MenuUtils=function(t,s){var u=s&&s.panelSelector||j;this.menu=t;this.panel=this.menu.one(u);if(this.panel){this.init();}this.openDelay=(s&&typeof s.openDelay!="undefined")?(s.openDelay):(k);this.closeTimer=null;this.overPanel=false;this.overLink=false;};c.ucs.MenuUtils.prototype={init:function(){this.keyedup=false;this.menu.on("hover",c.bind(this._handleMenuEnter,this),c.bind(this._handleMouseOut,this),this);this.panel.on("hover",c.bind(this._handlePanelEnter,this),c.bind(this._handlePanelLeave,this),this);this.menu.delegate(g,this._handleMenuItemClick,"li a",this);this.menu.on("keyup",this._handleKeyup,this);this.menu.on("keydown",this._handleKeydown,this);this.menu.removeClass("yucs-activate");this._initAria();},_initAria:function(){this.menu.one(p).set(h,"button");this.panel.all(p).set(h,"menuitemradio");this.panel.set(h,"menu");this.panel.all("div,ul,li").set(h,"presentation");if(!c.UA.ipad&&!c.UA.mobile){this.panel.set(a,-1);}this.focusmanager=this.panel.plug(c.Plugin.NodeFocusManager,{descendants:p,keys:{next:"down:40",previous:"down:38"},focusClass:{className:"yucs-has-focus",fn:function(s){return s.get(o);}},circular:true});},_refreshAria:function(){this.focusmanager.focusManager.refresh();},_destructAria:function(){this.panel.unplug(c.Plugin.NodeFocusManager);this.panel.one(p).set(a,0);},_handleMenuClick:function(s){if(this.overLink&&this.panel.hasClass(f)){this._accessShowMenu(s);if(this.closeTimer){this.closeTimer.cancel();this.closeTimer=null;}}},_handleMenuEnter:function(s){s.halt();this.overLink=true;c.later(this.openDelay,this,this._handleMenuClick);},_handlePanelEnter:function(s){if(this.closeTimer){this.closeTimer.cancel();this.closeTimer=null;}this.overPanel=true;},_handlePanelLeave:function(s){this.overPanel=false;if(this.panelShown){this._handleMouseOut();}},_handleKeyup:function(s){if(27===s.keyCode){this.menu.one(p).focus();this._hideMenu();}else{if(40===s.keyCode&&!this.keyedup){this.panel.one(p).focus();this.keyedup=true;}}},_handleKeydown:function(s){if(!this.panel.hasClass(f)){s.stopPropagation();}if(40===s.keyCode){s.preventDefault();}},_handleDocumentClick:function(s){if(this.panel.contains(s.target)||s.target._node===this.panel._node||this.panel.hasClass(f)||s.target===this.menu.one(">a")||s.target.get("parentNode")===this.menu.one(">a")){this.skipBlur=true;return;}this._hideMenu();},_accessShowMenu:function(t){var s=this;this._hideAllMenus();this._showMenu(t);this.panel.focus();c.Node.DOM_EVENTS.touchend=true;this.documentBlurHandle=c.on("blur",function(v){var u=this;if(!this.skipBlur){this.timeout=setTimeout(function(){u._hideMenu();},50);}this.skipBlur=false;},this.panel,this);this.documentFocusHandle=c.on("focus",function(u){if(this.timeout&&this.panel.hasChildNodes(u.target)){clearTimeout(this.timeout);this.timeout=null;}},this.panel,this);},_showMenu:function(t){this.panel.removeClass(f);this._addIframeShim();var s=this.menu.one(b);if(s){s.removeClass(f);}},_position:function(){var s=this.menu.get("region");if(!this.panel.hasClass("yucs-menu-right")&&!this.panel.hasClass("yucs-menu-left")){this.panel.setStyle("left",s[0]);}this.panel.setStyle("top",s[1]+13);},_handleMouseOut:function(s){this.overLink=false;if(this.closeTimer){this.closeTimer.cancel();this.closeTimer=null;}if(!this.panel.hasClass(f)){this.closeTimer=c.later(500,this,this._handleLeave);}},_handleLeave:function(s){if(!this.overPanel&&!this.overLink){this._hideMenu();}},_hideMenu:function(){this.panel.addClass(f);this.overPanel=false;var s=this.menu.one(b);if(s){s.addClass(f);}if(this.documentBlurHandle){this.documentBlurHandle.detach();}if(this.documentFocusHandle){this.documentFocusHandle.detach();}if(this.documentClickHandle){this.documentClickHandle.detach();}if(this.documentMouseDownHandle){this.documentMouseDownHandle.detach();}if(this.documentTouchEndHandle){this.documentTouchEndHandle.detach();}this.keyedup=false;},_hideAllMenus:function(){var t=c.all("yucs-menu iframe"),s=c.one("#yucs-top-menu");this._hideMenu();if(s&&s.one("ul")){s.one("ul").addClass(f);c.one("#yucs-more").removeClass("yucs-menu-active");}t.addClass(f);},_addIframeShim:function(){var s=c.all("select"),u=(c.UA.ie<=6),t;if(!u||(s.size()===0)){return;}t=this.menu.one(b);if(!t){t=document.createElement(b);t=this.panel.get(o).insertBefore(t,this.panel);}t.className="yucs-shim";t.setStyle("position","absolute");t.setStyle("width",this.panel.getComputedStyle("width"));t.setStyle("height",this.panel.getComputedStyle("height"));t.setStyle("top",this.panel.getY()+"px");t.setStyle("border","0px none");if(!this.menu.hasClass("yucs-help")){t.setStyle("left",0);}t.frameBorder=0;},_addMenuGroups:function(v,A,z){var x=this.menu.one(j),s="",t=(x.get("children")._nodes.length)?true:false;for(var u=0,w=v.length;u<w;u++){var y=v[u].length;if(A==="bottom"){v[u][0].separatorTop=true;}else{if(u<(w-1)||t){v[u][y-1].separatorBottom=true;}}s+=this._addMenuGroup(v[u],z);}if(A==="bottom"){x.append(s);}else{x.prepend(s);}},_addMenuGroup:function(t,v){var w="";for(var u=0,s=t.length;u<s;u++){if(v){t[u].isDebugItem=true;t[u].menuClass="debug-item";}else{t[u].isDebugItem=false;t[u].menuClass="minty-item";}w+=this._addMenuItem(t[u]);}return w;},_addMenuItem:function(t){var s="";if(t.isActive){t.checkedAria='aria-checked="true"';}else{t.checkedAria="";
}if(t.isDisabled){t.disabledAria='aria-disabled="true"';}else{t.disabledAria="";}switch(t.actionType){case"link":s=c.substitute(m,t,this._processTemplateValue);break;case"customEvent":s=c.substitute(r,t,this._processTemplateValue);break;default:break;}if(s){if(t.isDebugItem){s=s.replace(/separator/,"separator debug-item");}else{s=s.replace(/separator/,"separator minty-item");}}return s;},_clearMenuItem:function(s){this.menu.one(j).all("."+s).each(function(t){t.remove(true);});},_processTemplateValue:function(t,u,v){c.log("key = "+t+" value = "+u+" meta_data = "+v);var w="";var s=(document.location.protocol==="https:")?e:q;switch(t){case"icon":if(u!==undefined){if(u==="available"){w='<img src="'+s+'" class="yucs-opi available"/>';}else{if(u==="offline"){w='<img src="'+s+'" class="yucs-opi offline"/>';}else{if(u==="invisible"){w='<img src="'+s+'" class="yucs-opi invisible"/>';}else{if(u==="busy"){w='<img src="'+s+'" class="yucs-opi busy"/>';}else{if(u==="idle"){w='<img src="'+s+'" class="yucs-opi idle"/>';}else{w='<img src="'+u+'" />';}}}}}}break;case"separatorTop":if(u){w=l;}break;case"separatorBottom":if(u){w=l;}break;case"actionData":if(u){w='data-mad="'+u+'"';}break;case"isDisabled":if(u){w="disabled";}break;case"isActive":if(u){w="sp active";}break;case"checkedAria":w=u;break;default:w=u;break;}return w;},_resetItemStatus:function(v){var u=v.ancestor(j).all(d),t=v.ancestor(j).all("li.disabled"),s;u.removeClass("sp active");t.removeClass("disabled");if(v.getAttribute("data-dis")){s=v.ancestor(d);s.addClass("disabled");}if(v.getAttribute("data-hs")){s=v.ancestor(d);s.addClass("sp active");}},_handleMenuItemClick:function(u){var s=u.target;}};},"1.0",{requires:["node","event","event-hover","event-custom","substitute","node-focusmanager"]});(function(){var a=document.getElementById("yucs");if(!a){return;}ucs.YObj.use("node","ucs-menu-utils",function(c){var b=c.one("#yucs").all("li.yucs-menu.yucs-activate");b.each(function(e){var d=new c.ucs.MenuUtils(e);});});})();(function(){var i="%Y",g="%y",e="%m",h="%d",k=["en-ae","en-au","en-ca","en-ie","en-in","en-my","en-nz","en-ph","en-sg","en-us","es-us","ja-jp","sv-se"],f=["zh-hant-cn","zh-hant-tw"],j=document.getElementById("yucs").getAttribute("data-lang").toLowerCase(),a=j.split("-")[0],b,d,c;switch(a){case"tr":b=[{"locale":null,"separator":[" "]}];break;default:b=[{"separator":["-"],"locale":["es-cl","nl-nl","ta-in","zh-hant-cn"]},{"separator":["."],"locale":["de-at","de-ch","de-de","fi-fi","nb-no","pl-pl","ro-ro","ru-ru"]},{"separator":["/"],"locale":null}];}(function(){var n;if(!Array.prototype.indexOf){Array.prototype.indexOf=function(q,r){for(var p=(r||0),o=this.length;p<o;p++){if(this[p]===q){return p;}}return -1;};}for(var m=0,l=b.length;m<l;m++){n=b[m]["locale"];if(!n){d=b[m]["separator"];}else{if(n.indexOf(j)>=0){d=b[m]["separator"];break;}}}if(!d){d=["/"];}})();(function(){var l=d[0];if(f.indexOf(j)>=0){c=[i,l,e,l,h].join("");}else{if(k.indexOf(j)>=0){c=[e,l,h,l,g].join("");}else{c=[h,l,e,l,i].join("");}}})();window.ucs["localeDateFormat"]=c;})();ucs.YObj.use("datatype-date",function(a){});YUI.add("ucs-timestamp-library",function(a){a.namespace("ucs.Timestamp");a.ucs.Timestamp={getTimeStamp:function(e){var n,r,u,s,w,o,g="AM",j,b=a.one("#yucs"),l=e.dateRef||new Date(),m=e.date,q=e.locale?e.locale:b.getAttribute("data-lang"),i=m.getTime(),v=m.getDate(),k=l.getDate(),x=l.getTime(),h=x-i,p=k-v,f=true,c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];f=/^en-us$/i.test(q);h=parseInt(h/1000,10);r=m.getMonth();w=m.getHours();o=m.getMinutes();j=x-((l.getHours()*60*60*1000)+(l.getMinutes()*60*1000)+(l.getSeconds()*1000)+l.getMilliseconds());if(o<10){o="0"+o;}if(w>=12){g="PM";}if(w>12){w-=12;}if(e.type&&e.type==="short"&&a.DataType&&a.DataType.Date){if(p===0){n=w+":"+o+" "+g;}else{if(/^th-th$/i.test(q)){m.setFullYear(m.getFullYear()+543);}n=a.DataType.Date.format(m,{format:window.ucs.localeDateFormat}).replace(/\b0(?=\d)/g,"");}}else{if(!f){n=c[r]+" "+v+"&nbsp;&nbsp;"+w+":"+o+" "+g;}else{if(p===0){if(h<60){if(h>1){n=h+" secs ago";}else{n=h+" sec ago";}}else{if(h<3600){h=Math.ceil(h/60,10);if(h<2){n=h+" min ago";}else{n=h+" mins ago";}}else{if(h<86400){h=Math.ceil(h/3600);if(h>1){n=h+" hours ago";}else{n=h+" hour ago";}}}}}else{if(((j-i)<86400000)&&p!==0){n="Yesterday "+w+":"+o+" "+g;}else{n=c[r]+" "+v+"&nbsp;&nbsp;"+w+":"+o+" "+g;}}}}return n;}};},"1.0",{requires:["node","datatype-date"]});YUI.add("ucs-logodebug",function(d){d.namespace("ucs");var a=document.getElementById("imageCheck"),c=document.getElementById("yucs-logo-ani"),b=false;if(navigator.userAgent.toLowerCase().indexOf("msie")!=-1){b=true;}if((a&&a.offsetWidth===0)||(a&&a.offsetWidth===0)||(b&&a&&a.readyState=="uninitialized")||(b&&a&&a.readyState==undefined)){c.style.visibility="visible";c.style.position="relative";}d.ucs.LogoDebug=function(e){e.on("click",this._handleClick,this);this.publish("ucs:logoDebug",{broadcast:2,emitFacade:true});};d.ucs.LogoDebug.prototype={_handleClick:function(f){if(f.altKey){f.halt();this.fire("ucs:logoDebug");}}};d.Global.on("ucs:themeChange",function(f){d.later(11,this,function(g){if(d.one("#animator")){d.one("#animator").setStyle("display","none");}if(d.one("#yucs-logo-ani")){d.one("#yucs-logo-ani").setStyle("clip","auto");d.one("#yucs-logo-ani").setStyle("visibility","visible");if(d.one(".lt #yucs-logo-ani")){d.one(".lt #yucs-logo-ani").setStyle("backgroundPosition","-350px 0 !important");}else{d.one("#yucs-logo-ani").setStyle("backgroundPosition","0% 0%");}}});});d.Global.on("ucs:playLogo",function(f){if(typeof Aniden!="undefined"&&Aniden.play){Aniden.play();}});d.augment(d.ucs.LogoDebug,d.EventTarget);},"1.0",{requires:["node"]});(function(){ucs.YObj.use("node","ucs-logodebug",function(c){var b=c.one("#yucs-logo");if(b){var a=new c.ucs.LogoDebug(b);}});})();if(window.ucs&&window.ucs.YObj){(function(a){a.YObj.add("ucs-meta",function(g){g.namespace("ucs");if(g.ucs.Meta){g.log("Y.ucs.Meta is already defined.","debug","ucs-meta");return;}var c=null,f=null,d=null,e={},b=function(h){if(g.version>="3.5.1"){return h.getData();}else{return{authstate:h.getAttribute("data-authState"),cobrand:h.getAttribute("data-cobrand"),crumb:h.getAttribute("data-crumb"),device:h.getAttribute("data-device"),firstname:h.getAttribute("data-firstname"),flight:h.getAttribute("data-flight"),guid:h.getAttribute("data-guid"),host:h.getAttribute("data-host"),https:h.getAttribute("data-https"),languagetag:h.getAttribute("data-languagetag"),property:h.getAttribute("data-property"),protocol:h.getAttribute("data-protocol"),shortfirstname:h.getAttribute("data-shortfirstname"),shortuserid:h.getAttribute("data-shortuserid"),status:h.getAttribute("data-status"),spaceid:h.getAttribute("data-spaceid"),userid:h.getAttribute("data-userid")};}};g.ucs.Meta=function(h){c=this;c.components={meta:h};c.data=b(h);};g.ucs.Meta.prototype={authState:function(){return g.Object.getValue(c.data,"authstate");},cobrand:function(){return g.Object.getValue(c.data,"cobrand");},crumb:function(){return g.Object.getValue(c.data,"crumb");},device:function(){return g.Object.getValue(c.data,"device");},firstname:function(){return g.Object.getValue(c.data,"firstname");},flight:function(){return g.Object.getValue(c.data,"flight");},guid:function(){return g.Object.getValue(c.data,"guid");},host:function(){return g.Object.getValue(c.data,"host");},https:function(){return g.Object.getValue(c.data,"https");},languagetag:function(){return g.Object.getValue(c.data,"languagetag");},property:function(){return g.Object.getValue(c.data,"property");},protocol:function(){return g.Object.getValue(c.data,"protocol");},shortfirstname:function(){return g.Object.getValue(c.data,"shortfirstname");},shortuserid:function(){return g.Object.getValue(c.data,"shortuserid");},status:function(){return g.Object.getValue(c.data,"status");},spaceid:function(){return g.Object.getValue(c.data,"spaceid");},userid:function(){return g.Object.getValue(c.data,"userid");},toJSON:function(){return{authState:c.authState(),cobrand:c.cobrand(),crumb:c.crumb(),device:c.device(),firstname:c.firstname(),flight:c.flight(),guid:c.guid(),host:c.host(),https:c.https(),languagetag:c.languagetag(),property:c.property(),protocol:c.protocol(),shortfirstname:c.shortfirstname(),shortuserid:c.shortuserid(),status:c.status(),spaceid:c.spaceid(),userid:c.userid()};}};},"0.0.1",{requires:["node"]});a.YObj.use("ucs-meta",function(b){if(!b.Lang.isObject(a.Meta)||!(a.Meta instanceof b.ucs.Meta)){a.Meta=new b.ucs.Meta(b.one("#yucs-meta"));}});}(window.ucs));}/*jslint indent: 4, nomen:true, white:true */
/*global YUI */

YUI.add('ucs-beacon', function (Y) {

    'use strict';

    var instance = null,
        emitBeacon = function (data) {
            var beacon = null,
                params = {},
                queryString = '',
                sep = '',
                i = null;

            beacon = getBeacon();
            if (beacon !== null) {
                // send beacon using YMedia.Af.Beacon

                switch (data.type) {
                    case 'info':
                        beacon.info(data.source, {
                            code: data.code,
                            message: Y.JSON.stringify(data)
                        });
                        break;
                    case 'error':
                        beacon.error(data.source, {
                            code: data.code,
                            message: Y.JSON.stringify(data)
                        });
                        break;
                }
            } else {
                // send beacon to geo.yahoo.com

                // prepare query params
                params.s = 1197747123; // space id
                params.r = encodeURIComponent(location.href); // referrer url
                params.t = Math.random(); // random # to avoid cache
                params.dmsgs = encodeURIComponent(Y.JSON.stringify(data.dmsgs)); // data
                params.sec = encodeURIComponent(data.sec); // ult param: sec
                params.slk = encodeURIComponent(data.slk); // ult param: slk
                params.type = data.type;

                // formulate query string
                for (i in params) {
                    queryString += sep + i + '=' + params[i];
                    sep = '&';
                }

                // emit the beacon
                beacon = new Image(0, 0);
                beacon.src = 'https://geo.yahoo.com/p?' + queryString;
            }
        },
        getBeacon = function () {
            var beacon = null;
            if (typeof YMedia !== 'undefined' && Y.Lang.isObject(YMedia) && Y.Lang.isObject(YMedia.Af) && Y.Lang.isObject(YMedia.Af.Beacon)) {
                beacon = YMedia.Af.Beacon;
                if (Y.Lang.isFunction(beacon.setSampleSize)) {
                    //beacon.setSampleSize(1);
                } else {
                }
            }
            return beacon;
        };


    /**
     * Util for beaconing data back to server.
     * @class ucs.Beacon
     */
    Y.namespace('ucs').Beacon = {

        error: function(data) {
            emitBeacon(data);
        },

        info: function(data) {
            emitBeacon(data);
        },

        perf: function(data) {
            emitBeacon(data);
        }

    };

}, '1.0', {
    requires: [
        'json'
    ]
});/*
 * Copyright (c) 2013 Yahoo! Inc. All rights reserved.
 */

/**
 * The Comet Module provides JS client functions following Bayeux protocol,
 * Including handshake, subscribe, unsubscribe, disconnect and some other user validation functions.
 *
 * @module comet
 * @author onepush-devel@yahoo-inc.com
 * @version 1.3
 *
 * Example:
 *   var comet_url = 'http://comet.yahoo.com:4080/comet';
 *   var comet = Y.initComet(comet_url, function(param) {
 *        comet.subscribe('/mail/counter/*',function(message){
 *             //message from comet server: {count: "1", user: "5BEXUKYCJ23YSBOKJIYJ45GYSU"}
 *        });
 *   });
 *
 *   comet.unsubscribe('/mail/count/comet');
 *   comet.disconnect();
 *
 *   comet.addListener('/meta/handshake',function(){
 *       alert('callback called');
 *   });
 *
 */

/**
 * Register cometd-yui3 module
 */
YUI.add("comet", function (Y) {
    Y.namespace('Comet');
    function Comet(cfg) {
        Comet.superclass.constructor.apply(this, arguments);
    }

    var comet_instance = {};
    var EVT_COMETREADY = 'comet:ready';

    Y.initComet = function (url, handshake_callback) {
        //'http://comet.yahoo.com/comet' and 'https://comet.yahoo.com/comet/' point to same comet server
        var normal_url = url.replace(/https:/, "http:");
        //trim last /
        if (normal_url.substr(-1) === "/") {
            normal_url = normal_url.substring(0, normal_url.length - 1);
        }

        if (!comet_instance[normal_url]) {
            Y.publish(EVT_COMETREADY);
            comet_instance[normal_url] = new Comet();
            comet_instance[normal_url].clearListeners();
        } else {
        }

        if (handshake_callback) {
            comet_instance[normal_url].addListener('/meta/handshake', handshake_callback);
        }
        comet_instance[normal_url].initBayeux(url, function (message) {
            if (message.successful) {
                Y.fire(EVT_COMETREADY, {message: message});
            }
        });

        return comet_instance[normal_url];
    }

    Comet.NAME = "Comet";
    Comet.ATTRS = {
        /**
        * @attribute uri
        * @description the server uri of Cometd server.
        */
        uri: {
            value: null,
            setter: function (val) {
                if (val === null) {
                    return;
                }

                // use the same protocol as the hosting page
                var current_protocol = window.location.protocol;
                if (current_protocol.indexOf("https") !== -1) {
                    val = val.replace(/http:/, "https:");
                } else if (current_protocol.indexOf("http") !== -1) {
                    val = val.replace(/https:/, "http:");
                }

                // set protocol
                var url = val.toLowerCase();
                if (url.indexOf("https://") !== -1) {
                    this.set("protocol", "https://");
                } else if (url.indexOf("http://") !== -1) {
                    this.set("protocol", "http://");
                }
                return val;
            }
        },

        /**
         ** @attribute protocol
         ** @description the protocol of server uri
         **/
        protocol: {
            value: "https://"
        },

        /**
         * @attribute meta
         * @description meta message properties defined in the Bayeux Protocol.
         */
        meta: {
            value: {
                handshake: {channel: '/meta/handshake', version: '1.0', supportedConnectionTypes: ['long-polling']},
                connect: {channel: '/meta/connect', connectionType: 'long-polling'},
                subscribe: {channel: '/meta/subscribe'},
                unsubscribe: {channel: '/meta/unsubscribe'},
                publish: {},
                disconnect: {channel: '/meta/disconnect'}
            }
        },

        /**
         * @attribute ioCfg
         * @description base io configuration.
         */
        ioCfg: {
            value: {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*'}
            }
        },

        /**
         * @attribute ext
         * @description static ext data to be included in every message.
         */
        ext: {
            value: {
                all: {},
                handshake: {},
                subscribe: {'Comet-api-version': '1.1', 'Comet-subscriber-auth-info': null },
                unsubscribe: {'Comet-api-version': '1.1', 'Comet-subscriber-auth-info': null },
                connect: {},
                publish: {'Comet-api-version': '1.1', 'Comet-registration-id': 'make-up', 'Comet-opaque-id': 'markup', 'Comet-acknowledge-URI': 'www.yahoo.com/ack', 'Comet-acknowledge-type': 'All' },
                disconnect: {}
            }
        }
    };

    Y.extend(Comet, Y.Base, {
        /**
         * Client state as defined in section 1.5.1 of the Bayeux Protocol. Possible values: 'unconnected', 'connecting', 'connected'
         */
        _clientState: 'unconnected',

        /**
         *  to restore Server's advice
         */
        _advice : {},

        /**
         *  whether the connect request is sucessfull
         */
        _connected : false,

        /**
         *  Some basic configaration
         */
        _config : {
            backoffIncrement: 1000,
            maxBackoff: 10000,
            maxNetworkDelay: 300000,
            delayedSendMaxCount: 10,
            advice: {
                timeout: 60000,
                interval: 0,
                reconnect: 'retry'
            },
            subscribe: {
                jsonpTimeout: 5000
            }
        },

        /**
         * _delayedSendCount is used to avoid delay forever
         */
        _delayedSendCount: 0,

        /**
         * orign url, using for fire event parameter
         */
        _urlOrigin : '',

        /**
         * the timeout of delay_send
         */
        _backoff : 0,

        /**
         * _isLongpollingConnect is used to avoid two re-connect happen at the same time
         */
        _isLongpollingConnect : false,

        /**
         *  _isSendingQueue is used To avoid two sending at same time
         */
        _isSendingQueue: false,

        /**
         * Client ID as returned in a successful handshake as defined at 4.1.2. handshake Response of the Bayeux Protocol.
         */
        _clientId: null,

        /**
         * because the T cookie is HTTP Only, we use _token for user validation which is returned from Comet Server by JSONP call
         */
        _token: null,

        /**
         * An incremental message ID. +1 for every outgoing message.
         */
        _lastMessageId: 0,

        /**
         * Queue Stored, outgoing message to the server
         */
        _outgoing: [],

        /**
         * For re-subscribe when rehandshake happens
         */
        _subscribeChannel: {},

        /**
         * _queue : Async function call
         * ioQueue_c2s : client send data to server
         * ioQueue_s2c : sever push data to client
         * _jsonp: used to get _token back from Comet server
         */
        _queue: new Y.AsyncQueue(),
        _ioQueue_c2s: Y.io.queue,
        _ioQueue_s2c: Y.io.queue,
        _jsonp: null,

        /**
         * Callback function array
         */
        _listeners: {},

        /**
         * Private function begin
         */
        initializer: function (cfg) {
            this.setClientState('unconnected');
            Y.on('beforeunload', Y.bind(function () {
                if (this.getClientState() !== 'unconnected') {
                    this.disconnect();
                    //Y.Cookie.remove('BAYEUX_BROWSER', {path: '/'});
                }
            }, this), window);
        },

        /**
         * Allow configuring comet instance, such as subscribe jsonp timeout
         */
        config: function (key, value) {
            Y.Object.setValue(this._config, key, value);
        },

        /**
         * IO level to send Message
         */
        _Queue_send: function (messages) {
            var that = this;
            //handshake message can't be binded here
            that._batch(messages);

            if (!that.getClientId()) { return; }
            if (that._isSendingQueue) { return; }
            if (that._outgoing.length <= 0) { return; }

            Y.each(that._outgoing, function (v) { v = that._patchMessage(v); });
            that._IO_send(true, that._outgoing);
            that._outgoing = [];
        },

        _nextQueueSend : function () {
            this._Queue_send();
        },

        /**
         * Use to send Message
         */
        _IO_send: function (isMetaMessage, messages) {
            var that = this;
            if (!that.get('uri')) { return; }
            if (isMetaMessage) {
                if (that._isSendingQueue || !messages) { return; }
                that._IO_Queue_Send(messages);
            } else {
                if (!that.getClientId()) { return; }
                if (that._isLongpollingConnect || !messages) { return; }
                that._IO_Longpolling_Send(messages);
            }
        },

        /**
         * _IO_Queue_Send: queue send
         */
        _IO_Queue_Send: function (messages) {

            var that = this;
            that.setTokenHeader(that._token);
            var ioCfg = Y.merge(that.get('ioCfg'), {
                    context: that,
                    timeout: that._config.maxNetworkDelay,
                    data: Y.JSON.stringify(messages),
                    xdr: {credentials: true},
                    on: {
                        success: function (ioId, o) {
                            try {

                                var response = Y.JSON.parse(o.responseText);
                                that._handleResponse(response);
                            } catch (e) {

                                that._handleFailure(messages, 'json parse error');
                                return;
                            }
                        },
                        failure: function (ioId, o) {

                            that._handleFailure(messages, '500::io failed');
                        },
                        start: function () {

                            that._isSendingQueue = true;
                        },
                        complete: function () {

                            that._isSendingQueue = false;
                            that._nextQueueSend();
                        }
                    }
                });
            that._ioQueue_c2s.stop();
            that._ioQueue_c2s(that.get('uri'), ioCfg);
            that._ioQueue_c2s.start();
        },

        /**
         * _IO_Jsonp_Send: jsonp send
         */
        _IO_Jsonp_Send: function (messages) {

            var that = this;
            if (!that.get('uri')) { return; }
            //set up JSONP Object
            var jsonp_url = that.get("uri") + "?callback={callback}";
            //add Bayeux Data
            var data = encodeURIComponent(Y.JSON.stringify(messages));
            jsonp_url = jsonp_url + "&data=" + data;
            that._jsonp = new Y.JSONPRequest(jsonp_url, {
                on: {
                    success: function (response) {

                        that._handleResponse(response);
                    },
                    timeout: function (response) {

                        that._handleFailure(messages, '408:' + that._config.subscribe.jsonpTimeout + ':jsonp timeout');
                    },
                    failure: function () {

                        that._handleFailure(messages, '500::jsonp failed');
                    }
                },
                timeout: that._config.subscribe.jsonpTimeout
            });
            that._jsonp.send();
        },

        /**
         * _IO_Longpolling_Send: longpolling request send
         */
        _IO_Longpolling_Send: function (messages) {

            var that = this;
            that.setTokenHeader(that._token);
            var ioCfg = Y.merge(that.get('ioCfg'), {
                context: that,
                timeout: that._config.maxNetworkDelay,
                xdr: {credentials: true},
                data: Y.JSON.stringify(messages),
                on: {
                    success: function (ioId, o) {
                        try {

                            var response = Y.JSON.parse(o.responseText);
                            that._handleResponse(response);
                        } catch (e) {

                            that._handleFailure(messages, 'json parse error');
                            return;
                        }
                    },
                    failure: function (ioId, o) {

                        that._handleFailure(messages, '500::io failed');
                    },
                    start: function () {

                        that._isLongpollingConnect = true;
                    },
                    complete: function () {

                        that._isLongpollingConnect = false;
                    }
                }
            });
            that._ioQueue_s2c.stop();
            that._ioQueue_s2c(that.get('uri'), ioCfg);
            that._ioQueue_s2c.start();
        },

        /**
         * Handle the response from server
         * @param response an Array of messages
         */
        _handleResponse: function (response) {


            if (response === undefined || response === null) {
                return;
            }

            var that = this;
            Y.each(response, function (message) { //for every response item
                that._updateAdvice(message.advice);
                //add _urlOrigin in response
                message.originalURI = that._urlOrigin;
                var channel = message.channel;
                switch (channel) {
                case '/meta/handshake':
                    that._handshakeResponse(message);
                    break;
                case '/meta/connect':
                    that._connectResponse(message);
                    break;
                case '/meta/disconnect':
                    that._disconnectResponse(message);
                    break;
                case '/meta/subscribe':
                    that._subscribeResponse(message);
                    break;
                case '/meta/unsubscribe':
                    that._unsubscribeResponse(message);
                    break;
                default:
                    that._messageResponse(message);
                    break;
                }
            });
        },

        /**
         * Handle the advices from server, we merge the advice with local config
         */
        _updateAdvice: function (newAdvice) {
            if (newAdvice) {
                this._advice = this._mixin(false, {}, this._config.advice, newAdvice);
            } else {
                this._advice = this._config.advice;
            }
        },

        _handshakeResponse : function (message) {
            var that = this;
            if (message.successful) {
                //From Bayeux Protocol, only after connect successfull that client state = connected
                that.setClientState('connected');
                that._clientId = message.clientId;
                //switch to VIP
                if (that._advice.VIP) {
                    that.set('uri', that.get("protocol") + that._advice.VIP + "/comet");
                }
                that._notifyListeners('/meta/handshake', message);
                //flush the queue
                that._Queue_send();

                var action = that._isDisconnected() ? 'none' : that._advice.reconnect;


                switch (action) {
                case 'retry':
                    that._resetBackoff();
                    that._delayedConnect();
                    break;
                case 'handshake':
                    that.setClientState('unconnected');
                    that._resetBackoff();
                    that._delayedHandshake();
                    break;
                case 'none':
                    that._disconnect(false);
                    break;
                }
            } else {
                that._failHandshake(message);
            }
        },

        _failHandshake : function (message) {
            var that = this;
            that.setClientState('unconnected');
            that._clientId = null;
            that._notifyListeners('/meta/handshake', message);
            that._notifyListeners('/meta/unsuccessful', message);
            // Only try again if we haven't been disconnected and
            // the advice permits us to retry the handshake

            var retry = (that._advice.reconnect !== 'none');
            if (retry) {
                that._increaseBackoff();
                that._delayedHandshake();
            } else {
                that._disconnect(false);
            }
        },

        _delayedHandshake: function () {
            var that = this;
            this._delayedSend(function () {
                that._handshake();
            });
        },

        _subscribeResponse : function (message) {
            if (message.successful) {
                if (this._subscribeChannel[message.subscription]
                        && this._subscribeChannel[message.subscription] === true) {
                    //already subscribe
                } else {
                    this._subscribeChannel[message.subscription] = true;
                }
                //store the token
                if (message["ext"]["Comet-auth-token"]) {
                    this._token = message["ext"]["Comet-auth-token"];
                }
                this._notifyListeners('/meta/subscribe', message);
            } else {
                this._failSubscribe(message);
            }
        },

        _failSubscribe : function (message) {
            this._notifyListeners('/meta/subscribe', message);
            this._notifyListeners('/meta/unsuccessful', message);
        },

        _connectResponse: function (message) {
            var that = this;
            if (that._isDisconnected()) { return; }
            that._connected = message.successful;
            if (that._connected) {
                that.setClientState('connected');
                that._notifyListeners('/meta/connect', message);

                var action = that._isDisconnected() ? 'none' : that._advice.reconnect;


                switch (action) {
                case 'retry':
                    that._resetBackoff();
                    that._delayedConnect();
                    break;
                case 'handshake':
                    that.setClientState('unconnected');
                    that._resetBackoff();
                    that._delayedHandshake();
                    break;
                case 'none':
                    that._disconnect(false);
                    break;
                }
            } else {
                that._failConnect(message);
            }
        },

        _failConnect : function (message) {
            var that = this;
            // Notify the listeners after the status change but before the next action
            that._notifyListeners('/meta/connect', message);
            that._notifyListeners('/meta/unsuccessful', message);

            // 'retry' may happen when the server crashed, the current clientId
            // will be invalid, and the server will ask to handshake again
            var action = that._isDisconnected() ? 'none' : that._advice.reconnect;
            switch (action) {
            case 'retry':
                that._delayedConnect();
                that._increaseBackoff();
                break;
            case 'subscribe':
                that._delayedConnect();
                that._increaseBackoff();
                break;
            case 'handshake':
                that.setClientState('unconnected');
                that._resetBackoff();
                that._delayedHandshake();
                break;
            case 'none':
                that._disconnect(false);
                break;
            }
        },

        _delayedConnect: function () {
            var that = this;
            this._delayedSend(function () {
                that._connect();
            });
        },

        _disconnectResponse : function (message) {
            if (message.successful) {
                this._disconnect(false);
                this._notifyListeners('/meta/disconnect', message);
            } else {
                this._failDisconnect(message);
            }
        },

        _failDisconnect : function (message) {
            this._disconnect(true);
            this._notifyListeners('/meta/disconnect', message);
            this._notifyListeners('/meta/unsuccessful', message);
        },

        _unsubscribeResponse : function (message) {
            if (message.successful) {
                if (this._subscribeChannel[message.subscription]
                        && this._subscribeChannel[message.subscription] === true) {
                    //delete subscribe info
                    delete this._subscribeChannel[message.subscription];
                }
                this._notifyListeners('/meta/unsubscribe', message);
            } else {
                this._failUnsubscribe(message);
            }
        },

        _failUnsubscribe : function (message) {
            this._notifyListeners('/meta/unsubscribe', message);
            this._notifyListeners('/meta/unsuccessful', message);
        },

        _messageResponse : function (message) {
            if (message.successful === undefined) {
                if (message.data) {
                   // It is a plain message, and not a bayeux meta message
                    this._notifyListeners(message.channel, message);
                } else {
                   // no-data field
                    this._notifyListeners('/meta/unsuccessful', message);
                }
            } else {
                if (message.successful) {
                    this._notifyListeners('/meta/publish', message);
                } else {
                    this._failMessage(message);
                }
            }
        },

        _failMessage : function (message) {
            this._notifyListeners('/meta/publish', message);
            this._notifyListeners('/meta/unsuccessful', message);
        },

        _delayedSend : function (operation) {
            var that = this;
            var delay = that._advice.interval + that._backoff;
            if (that._config.maxBackoff <= that._backoff) {
                that._delayedSendCount++;
            } else {
                that._delayedSendCount = 0;
            }
            if (that._delayedSendCount > that._config.delayedSendMaxCount) {
                //when VIP is down(BCP happens), we should switch back to CNAME
                var current_url = that.get('uri');
                that.set('uri', that._urlOrigin);
                if (current_url === that.get('uri')) {
                    return;
                }
                that._resetBackoff();
                that._delayedSendCount = 0;
            }
            that._queue.add(
            {
                fn: operation,
                timeout : delay
            });
            that._queue.run();
        },

        /////////////deal with fail event
        _handshakeFailure : function (message, error) {
            this._failHandshake({
                successful: false,
                failure: true,
                channel: '/meta/handshake',
                request: message,
                advice: {
                    reconnect: 'retry',
                    interval: this._backoff
                },
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _connectFailure : function (message, error) {
            this._connected = false;
            this._failConnect({
                successful: false,
                failure: true,
                channel: '/meta/connect',
                request: message,
                advice: {
                    reconnect: 'retry',
                    interval: this._backoff
                },
                clientId: message.clientId || '',
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _disconnectFailure : function (message, error) {
            this._failDisconnect({
                successful: false,
                failure: true,
                channel: '/meta/disconnect',
                request: message,
                advice: {
                    reconnect: 'none',
                    interval: 0
                },
                clientId: message.clientId || '',
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _subscribeFailure : function (message, error) {
            this._failSubscribe({
                successful: false,
                failure: true,
                channel: '/meta/subscribe',
                request: message,
                advice: {
                    reconnect: 'none',
                    interval: 0
                },
                clientId: message.clientId || '',
                subscription: message.subscription || '',
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _unsubscribeFailure : function (message, error) {
            this._failUnsubscribe({
                successful: false,
                failure: true,
                channel: '/meta/unsubscribe',
                request: message,
                advice: {
                    reconnect: 'none',
                    interval: 0
                },
                clientId: message.clientId || '',
                subscription: message.subscription || '',
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _messageFailure : function (message, error) {
            this._failMessage({
                successful: false,
                failure: true,
                channel: message.channel,
                request: message,
                advice: {
                    reconnect: 'none',
                    interval: 0
                },
                clientId: message.clientId || '',
                subscription: message.subscription || '',
                error: error || '',
                ext: message.ext || {},
                id: message.id || ''
            });
        },

        _handleFailure : function (messages, error) {
            var message, channel, i;
            for (i = 0; i < messages.length; ++i) {
                message = messages[i];
                channel = message.channel;
                switch (channel) {
                case '/meta/handshake':
                    this._handshakeFailure(message, error);
                    break;
                case '/meta/connect':
                    this._connectFailure(message, error);
                    break;
                case '/meta/disconnect':
                    this._disconnectFailure(message, error);
                    break;
                case '/meta/subscribe':
                    this._subscribeFailure(message, error);
                    break;
                case '/meta/unsubscribe':
                    this._unsubscribeFailure(message, error);
                    break;
                default:
                    this._messageFailure(message, error);
                    break;
                }
            }
        },

        _notifyListeners : function (channel, message) {
            // Notify direct listeners
            this._notify(channel, message);
            this._notify(channel + '/*', message);
            // Notify the globbing listeners
            var channelParts = channel.split('/');
            var last = channelParts.length - 1, i = 0;
            for (i = last; i > 0; --i) {
                // Add the recursive globber and notify
                var channelPart = channelParts.slice(0, i).join('/') + '/*';
                // We don't want to notify /foo/* if the channel is /foo/bar/baz,
                // so we stop at the first non recursive globbing
                if (i === last) {
                    this._notify(channelPart, message);
                }
                this._notify(channelPart, message);
            }
        },

        _notify : function (channel, message) {
            var listeners = this._listeners[channel];
            if (listeners) {
                Y.each(listeners, function (listener) {
                    if (Y.Lang.isFunction(listener.listener)) {
                        listener.listener(message);
                    }
                });
            }
        },

        _isDisconnected :  function () {
            return this._clientState === 'unconnected';
        },

        _resetBackoff : function () {
            this._backoff = 0;
        },

        _nextMessageId : function () {
            return ++this._lastMessageId + "";
        },

        _increaseBackoff: function () {
            if (this._backoff < this._config.maxBackoff) {
                this._backoff += this._config.backoffIncrement;
            }
        },

        /**
         * create messages according Bayeux Protocol
         */
        _createMessage: function (operation, cfg) {
            cfg = cfg || {};
            var timestamp = (new Date()).valueOf();
            var host = window.location.host;
            var result = [];
            var ext = Y.merge(this.get('ext').all, this.get('ext')[operation], cfg.ext || {}, {'timestamp' : timestamp, 'host' : host || ""});
            switch (operation) {
            case 'handshake':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation]));
                break;

            case 'connect':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation], {clientId: this.getClientId()}));
                break;

            case 'subscribe':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation], {clientId: this.getClientId(), subscription: cfg.channel}));
                break;

            case 'unsubscribe':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation], {clientId: this.getClientId(), subscription: cfg.channel}));
                break;

            case 'publish':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation], {clientId: this.getClientId(), channel: cfg.channel, data: cfg.data}));
                break;

            case 'disconnect':
                result.push(Y.merge({id: this._nextMessageId(), ext: ext}, this.get('meta')[operation], {clientId: this.getClientId()}));
                break;
            }

            return result;
        },

        /**
         * handshake operation
         * Perform a handshake operation as defined at section 4.1. handshake of the Bayeux Protocol.
         */
        _handshake: function (cfg) {
            var that = this;
            if (that.getClientState() !== 'unconnected') {
                if (that.getClientState() === 'connected') {
                    //already handshaked
                    var message = {
                        successful: true,
                        channel: '/meta/handshake',
                        clientId: that._clientId,
                        originalURI: that._urlOrigin
                    };
                    that._notifyListeners('/meta/handshake', message);
                }
                return;
            }

            if (cfg && cfg.listener) {
                that._addListener(cfg, false);
            }

            that._clientId = null;
            that._token = null;
            that.resetTokenHeader();
            that._clearSubscriptions();

            that._updateAdvice(that._config.advice);

            var messages = that._createMessage('handshake', cfg);
            that._IO_send(true, messages);
            that.setClientState('connecting');

        },

        /**
         * connect operation
         */
        _connect: function (cfg) {
            var that = this;
            if (that.getClientState() !== 'connected') { return; }
            if (that._isLongpollingConnect) { return; }

            var messages = that._createMessage('connect', cfg);
            that._IO_send(false, messages);
        },

        /**
         * subscribe operation
         */
        /* the following function is replace by _subscribeJSONP
        _subscribe: function (cfg) {
            if (!(cfg && cfg.channel)) return;

            //check if has already subscribed the channel
            if (this._subscribeChannel[cfg.channel]
                    && this._subscribeChannel[cfg.channel] === true){
                return;
            }
            if (cfg.listener) {
                this._addListener(cfg, true);
            }

            var messages = this._createMessage('subscribe', cfg);
            this._Queue_send(messages);
        },
        */

        /**
         * subscribe JSONP operation
         */
        _subscribeJSONP: function (cfg) {
            if (!(cfg && cfg.channel)) { return; }
            if (!this.getClientId()) { return; }

            //check if has already subscribed the channel
            if (this._subscribeChannel[cfg.channel]
                    && this._subscribeChannel[cfg.channel] === true) {
                return;
            }

            if (cfg.listener) {
                this._addListener(cfg, true);
            }

            var messages = this._createMessage('subscribe', cfg);
            this._IO_Jsonp_Send(messages);
        },

        /**
         * unsubscribe operation
         */
        _unsubscribe: function (cfg) {
            if (!this.getClientId()) { return; }
            if (cfg &&  cfg.channel) {
                this.removeListeners(cfg.channel);
            }

            if (cfg && cfg.channel) {
                var messages = this._createMessage('unsubscribe', cfg);
                this._Queue_send(messages);
            }
        },

        /**
         * Comet disconnect operation
         */
        _disconnect: function (isAbort) {
            var that = this;
            if (isAbort) {
                that._ioQueue_c2s.stop();
                that._ioQueue_s2c.stop();
            }
            that.setClientState('unconnected');
            that._clientId = null;
            that._resetBackoff();
            that._queue.stop(); //STOP the queue

            // Fail any existing queued message
            if (that._outgoing.length > 0) {
                var messageFail = that._outgoing;
                that._outgoing = [];
                that._handleFailure(messageFail, '500::canceled after disconnect');
            }

            that._clearSubscriptions();
        },

        /**
         *  patchMessage to re-assign the value of messageId and clientId
         */
        _patchMessage: function (m) {
            if (!m.id) { m.id = this._nextMessageId(); }
            m.clientId = this.getClientId();
            if (m.channel === "/meta/handshake") { delete m.clientId; }
            return m;
        },

        /**
         * As messages to batch
         * @param arguments any number of messages
         */
        _batch: function () {
            Y.each(arguments, function (v) {
                if (v && Y.Lang.isArray(v)) {
                    var index = 0;
                    for (index = 0; index < v.length; ++index) {
                        this._outgoing.push(v[index]);
                    }
                } else if (v) {
                    this._outgoing.push(v);
                }
            }, this);
        },

        _clearSubscriptions: function () {
            Y.each(this._listeners, function (listeners) {
                if (listeners) {
                    Y.each(listeners, function (listener, key, obj) {
                        if (listener && listener.isSub) {
                            obj.splice(key);
                        }
                    });
                }
            });

            this._subscribeChannel = {};
        },

        _reDoSubscriptions: function () {
            Y.each(this._subscribeChannel, function (flag, channel_name) {
                if (flag) {
                    //redo subscribe & the subscribe state is old
                    this._subscribeChannel[channel_name] = false;
                    this._subscribeJSONP({channel: channel_name});
                }
            }, this);
        },

        isDuplicatedListener: function (fun, listeners) {
            var index = 0;
            for (index = 0; index < listeners.length; ++index) {
                var listener = listeners[index];
                if (listener && listener.listener && listener.listener.toString() === fun.toString()) {
                    return true;
                }
            }
            return false;
        },

        _addListener: function (cfg, isSubscribe, force) {
            if (cfg && cfg.listener && Y.Lang.isFunction(cfg.listener)) {
                if (this._listeners[cfg.channel]) {
                    if (force || !this.isDuplicatedListener(cfg.listener, this._listeners[cfg.channel])) {
                        //not duplicated listener
                        this._listeners[cfg.channel].push({listener: cfg.listener, isSub: isSubscribe});
                    }
                } else {
                    this._listeners[cfg.channel] = [{listener: cfg.listener, isSub: isSubscribe}];
                }
            }
        },

        _mixin : function (deep, target, objects) {
            var i, propName;
            var result = target || {};
            // Skip first 2 parameters (deep and target), and loop over the others
            for (i = 2; i < arguments.length; ++i) {
                var object = arguments[i];
                if (object === undefined || object === null) {
                    continue;
                }
                for (propName in object) {
                    var prop = object[propName];
                    var targ = result[propName];
                    // Avoid infinite loops
                    if (prop === target) {
                        continue;
                    }
                   // Do not mixin undefined values
                    if (prop === undefined) {
                        continue;
                    }
                    if (deep && typeof prop === 'object' && prop !== null) {
                        if (prop instanceof Array) {
                            result[propName] = this._mixin(deep, targ instanceof Array ? targ : [], prop);
                        } else {
                            result[propName] = this._mixin(deep, {}, prop);
                        }
                    } else {
                        result[propName] = prop;
                    }
                }
            }
            return result;
        },

        destructor: function () { },

        ////////////////////////Public API Start/////////////////////////////////////

        getClientState: function () {
            return this._clientState;
        },

        setClientState: function (newStatus) {
            this._clientState = newStatus;
        },

        getClientId: function () {
            return this._clientId;
        },

        initBayeux: function (url, callback) {
            this._urlOrigin = url;
            this.set('uri', url);
            this._handshake({channel: "/meta/handshake", listener: callback});
        },

        subscribe: function (channel_name, callback) {
            this._subscribeJSONP({channel: channel_name, listener: callback});
        },

        //handshake: function (cfg) { this._handshake(cfg); },
        unsubscribe: function (channel_name) {
            this._unsubscribe({channel: channel_name});
        },

        disconnect: function (callback) {
            var that = this;
            if (callback) {
                that._addListener({channel: "/meta/disconnect", listener: callback}, false);
            }
            if (that.getClientState() === 'unconnected') { return; }
            if (!that.getClientId()) { return; }

            var messages = that._createMessage('disconnect');
            that._Queue_send(messages);
        },

        publishMsg: function (channel_name, data_publish) {
            if (channel_name && data_publish) {
                var cfg = {channel: channel_name, data: data_publish};
                var messages = this._createMessage('publish', cfg);
                this._Queue_send(messages);
            }
        },

        ///////////////////Listeners Operation/////////////////////////////////////
        clearListeners: function () {
            this._listeners = {};
        },

        addListener: function (channel_name, callback, force) {
            force = force || false;
            if (!callback && Y.Lang.isFunction(callback)) { return; }
            this._addListener({channel: channel_name, listener: callback}, false, force);
        },

        removeListeners: function (channel) {
            if (this._listeners[channel]) {
                delete this._listeners[channel];
            }
        },

        //////////////////User Validation////////////////////////////////////////////
        setUserInfo: function (uid, user_cred) {
            if (uid && user_cred) {
                var ext = this.get('ext');
                ext.subscribe['Comet-subscriber-auth-info'] = {"uid": uid, "user_type": "yahoo", "user_cred": user_cred };
            }
        },

        setUserInfoWithCookie: function (uid, cookie) {
            if (uid) {
                var ext = this.get('ext');
                ext.subscribe['Comet-subscriber-auth-info'] = {"uid": uid, "user_type": "yahoo", "user_cred": 'Any Value' };
            }
        },

        setTokenHeader: function (token) {
            if(token) {
                var ioCfg = this.get('ioCfg');
                ioCfg['headers']['Authorization'] = "Basic token=" + token;
            }
        },

        resetTokenHeader: function() {
            var ioCfg = this.get('ioCfg');
            ioCfg['headers']['Authorization'] = "Basic token=";
        },

        setYcaHeader: function (yca, opaqueId) {
            if (yca) {
                //add YCA
                var ioCfg = this.get('ioCfg');
                ioCfg['headers']['Yahoo-App-Auth'] = yca;
            }
            if (opaqueId) {
                var ext = this.get('ext');
                ext.publish['Comet-opaque-id'] = opaqueId;
            }
        }

    });

    Y.Comet = Comet;

}, '3.4.1', {requires: ['base', 'io',  'json', 'async-queue', 'cookie', 'jsonp', 'jsonp-url']});
/*jslint indent: 4, nomen:true, white:true */
/*global YUI */

YUI.add('ucs-comet-conn', function (Y) {

    'use strict';

    Y.namespace('ucs');

    // --------------------------------------------------------------------------------
    //  Private Variables & Methods
    //

    /**
     * Configurations
     * It contains both production and non-production settings
     * for different Comet applications.
     * 
     * @private
     */
    var config = {
        counts_max: {
            unsuccessful: {
                '/meta/handshake': 5,
                '/meta/subscribe': 5,
                '/meta/unsubscribe': 5,
                '/meta/connect': 5,
                '/meta/disconnect': 5
            }
        },
        prod: {
            /* private comet cluster */
            notifications: {
                host: 'https://pr.comet.yahoo.com/comet'
            },
            mail_count: {
                host: 'https://pr.comet.yahoo.com/comet'
            },
            /* public comet cluster */
            system_status: {
                host: 'https://comet.yahoo.com/comet'
            }
        },
        nonprod: {
            /* private comet cluster */
            notifications: {
                //host: 'http://perf405.snp.mobile.gq1.yahoo.com/comet',
                //host: 'http://perf501.snp.mobile.gq1.yahoo.com/comet'
                //host: 'http://session4.snp.mobile.gq1.yahoo.com/comet'
                host: 'http://stage-comet1.onepush.mobile.gq1.yahoo.com/comet'
            },
            mail_count: {
                //host: 'http://perf405.snp.mobile.gq1.yahoo.com/comet',
                //host: 'http://perf501.snp.mobile.gq1.yahoo.com/comet'
                //host: 'http://session4.snp.mobile.gq1.yahoo.com/comet'
                host: 'http://stage-comet1.onepush.mobile.gq1.yahoo.com/comet'
            },
            /* public comet cluster */
            system_status: {
                //host: 'https://comet.yahoo.com/comet'
                host: 'http://perf501.snp.mobile.gq1.yahoo.com/comet'
                //host: 'http://perf405.snp.mobile.gq1.yahoo.com/comet'
                //host: 'http://session4.snp.mobile.gq1.yahoo.com/comet'
            }
        }
    },

    /**
     * Events
     * 
     * @private
     */
     EVT_CONNECT    = 'connect',
     EVT_DISCONNECT = 'disconnect',
     EVT_MESSAGE    = 'message',
     EVT_ERROR      = 'error',

    /**
     * Instances
     * Support single instance per application type.
     *
     * @private
     */
    instances = {};

    /**
     * Componet Constructor
     *
     * @class CometConn
     * @param {Object} config The config object.
     * @constructor
     */
    Y.ucs.CometConn = function (app, env) {

        // initialize class variables
        this.app = app;
        this.env = env;
        this.comet = null;

        this.init(config[env][app]);

        this.publish(EVT_CONNECT);
        this.publish(EVT_DISCONNECT);
        this.publish(EVT_MESSAGE);
    };


    // --------------------------------------------------------------------------------
    //  Static Variables & Methods
    //

    /**
     * Create Comet Instance.
     *
     * @param {String} app The application type. [notifications | system_status]
     * @param {String} env The environment. [prod | nonprod]
     * @return {CometConnection} The CometConnection instance.
     * @static
     */
    Y.ucs.CometConn.getConn = function(app, env, callback) {
        var conf = null,
            key = null;
        
        Y.config.debug = window.location.href.match(/debug_comet-conn=1/);

        env = env || 'prod';
        if (window.location.href.match(/env=nonprod/)) {
            env = 'nonprod';
        }
        

        // check params: env
        if (Y.Lang.isUndefined(env)) {
            throw new Error('getConn(): env is required.');
        }

        // check params: app
        if (Y.Lang.isUndefined(app)) {
            throw new Error('getConn(): app is required.');
        }

        // valid params: env
        if (!Y.Object.hasKey(config, env)) {
            throw new Error('getConn(): cannot find config for env=' + env);
        }

        // valid params: app
        if (!Y.Object.hasKey(config[env], app)) {
            throw new Error('getConn(): cannot find config for app=' + app);            
        }

        // set instance key. <app>:<env>
        key = Y.Lang.sub('{app}:{env}', {app:app, env:env});

        // create instance if necessary
        if (!Y.Object.hasKey(instances, key)) {
            instances[key] = new Y.ucs.CometConn(app, env); 
        } else {
        }

        return instances[key];
    };


    // --------------------------------------------------------------------------------
    //  Class Variables & Methods
    //

    Y.ucs.CometConn.prototype = {

        /**
         * Counts
         * Store the number of unsuccessful count. 
         *
         * @private
         */
        counts: {},

        /**
        * Initialize
        *
        * @method init
        */
        init: function (config) {
            var self = this;

            self.comet = Y.initComet(config.host);
            self.comet.addListener('/meta/handshake', Y.bind(self.cbHandShake, self), true);
            self.comet.addListener('/meta/subscribe', Y.bind(self.cbSubscribe, self), true);
            self.comet.addListener('/meta/unsubscribe', Y.bind(self.cbUnsubscribe, self), true);
            self.comet.addListener('/meta/connect', Y.bind(self.cbConnect, self), true);
            self.comet.addListener('/meta/disconnect', Y.bind(self.cbDisconnect, self), true);
            self.comet.addListener('/meta/unsuccessful', Y.bind(self.cbUnsuccessful, self), true);

            self.counts = {
                unsuccessful: {
                    '/meta/handshake': 0,
                    '/meta/subscribe': 0,
                    '/meta/unsubscribe': 0,
                    '/meta/connect': 0,
                    '/meta/disconnect': 0
                }
            };
        },

        /**
         * @method getComet
         * @returns the comet object
         */
        getComet: function () {
            return this.comet;
        },

        /**
         * @method isDisconnect
         * @return true if it is disconnected
         * @private
         */
         isDisconnect: function (e) {
            var self = this,
                disconnect = true;

            if (e.successful === false) {
                if (Y.Object.hasKey(self.counts.unsuccessful, e.channel)) {
                    self.counts.unsuccessful[e.channel]++;
                    if (self.counts.unsuccessful[e.channel] < config.counts_max.unsuccessful[e.channel]) {
                        disconnect = false;
                    }
                }
            }

            return disconnect;
         },

        /**
         * Callback Handler for Handshake.
         * 
         * @method cbHandShake
         * @param e The event message
         * @private
         */
        cbHandShake: function (e) {
            var self = this,
                evt = null,
                uri = null;

      
            // check param: uri / originalURI  
            if (Y.Object.hasKey(e, 'originalURI')) {
                uri = e.originalURI;
            } else if (Y.Object.hasKey(e, 'uri')) {
                uri = e.uri;
            } else {
                this.fire(EVT_ERROR, 'uri / originalURI is missing in the callback_handshake response.');
                return;
            }


            if (uri === config[this.env][this.app].host) {
                if (e.successful) {
                    self.fire(EVT_CONNECT, e);
                } else {
                    self.fire(EVT_ERROR, 'cb_handshake. successful=false');
                }
            } else {
                self.fire(EVT_ERROR, 'cb_handshake.uri is not found in config. uri=' + uri);
            }

            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet HandShake',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'hand'
                });
            }
        },

        /**
         * Callback Handler for Subscribe.
         *
         * @method cbSubscribe
         * @param e The event message
         * @private
         */
        cbSubscribe: function (e) {
            var self = this;
            

            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet Subscribe',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'sub'
                });
            }
        },

        /**
         * Callback Handler for Unsubscribe.
         *
         * @method cbUnsubscribe
         * @param e The event message
         * @private
         */
        cbUnsubscribe: function (e) {
            var self = this;


            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet Unsubscribe',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'unsub'
                });
            }
        },

        /**
         * Callback Handler for Connect.
         *
         * @method cbConnect
         * @param e The event message
         * @private
         */
        cbConnect: function (e) {
            var self = this;


            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet Connect',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'conn'
                });
            }
        },

        /**
         * Callback Handler for Disconnect.
         *
         * @method cbDisconnect
         * @param e The event message
         * @private
         */
        cbDisconnect: function (e) {
            var self = this;


            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet Disconnect',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'disconn'
                });
            }
        },

        /**
         * Callback Handler for Unsuccessful.
         *
         * @method cbUnsuccessful
         * @param e The event message
         * @private
         */
        cbUnsuccessful: function (e) {
            var self = this;
            

            if (e) {
                self.emitBeacon({
                    sec: 'UH 3 Comet',
                    slk: 'UH 3 Comet Unsuccessful',
                    dmsgs: e,
                    type: 'error',
                    source: 'ucs-comet-conn',
                    code: 'fail'
                });
            }

            // should client execute 'disconnect'?
            if (self.isDisconnect(e)) {
                self.getComet().disconnect();
            }
        },

        /**
         * Callback Handler for System Status.
         *
         * @method cbSystemStatus
         * @param {Object} data Event message returned from server.
         */
        cbSystemStatus: function (data) {
            if (data) {
                this.fire('message', data);
            }
        },

        /**
         * Callback Handler for Notifications.
         *  
         * @method cbNotifications
         * @param {Object} data Event message returned from server
         */
        cbNotification: function (data) {
            if (data) {
                this.fire(EVT_MESSAGE, data);
            }
        },

        /**
         * @method initSystemStatus
         * @param channel The channel name of the system status.
         */
        initSystemStatus: function(channel) {
            this.comet.subscribe(channel, Y.bind(this.cbSystemStatus, this));
        },

        /**
         * @method initNotification
         */
        initNotification: function () {
            this.comet.subscribe("/UNP/alerts/*", Y.bind(this.cbNotification, this));
        },

        /**
         * @method emitBeacon
         * @param data The message atteched to the beacon
         */
        emitBeacon: function (data) {
            /*
            var beacon = null,
                params = {},
                queryString = '',
                sep = '',
                i = null;

            // prepare query params
            params.s = 1197747123; // space id
            params.r = encodeURIComponent(location.href); // referrer url
            params.t = Math.random(); // random # to avoid cache
            params.dmsgs = encodeURIComponent(Y.JSON.stringify(data.dmsgs)); // data
            params.sec = encodeURIComponent(data.sec); // ult param: sec
            params.slk = encodeURIComponent(data.slk); // ult param: slk
            params.type = data.type;

            // formulate query string
            for (i in params) {
                queryString += sep + i + '=' + params[i];
                sep = '&';
            }

            // emit the beacon
            beacon = new Image(0, 0);
            beacon.src = 'https://geo.yahoo.com/p?' + queryString;
            */

            if (Y.Lang.isObject(Y.ucs) && Y.Lang.isObject(Y.ucs.Beacon)) {
                switch (data.type) {
                    case 'info':
                        Y.ucs.Beacon.info(data);
                        break;
                    case 'error':
                        Y.ucs.Beacon.error(data);
                        break;
                }
            }
        }

    };
        
    // Class Augmentation

    Y.augment(Y.ucs.CometConn, Y.EventTarget, true, null, {
        emitFacade: true,
        broadcast: 2
    });

        
}, '1.0', {
    requires: [
        'event', 
        'event-custom', 
        'comet',
        'ucs-beacon'
    ]
});
YUI.add("ucs-simple-menu",function(f){f.namespace("ucs.MoreMenu");var d="yucs-menu-active",e="role",a="tabIndex",b=">li>a",c="parentNode";f.ucs.MoreMenu=function(g){f.ucs.MoreMenu.superclass.constructor.call(this,g);g.removeClass("yucs-more-activate");this.ylt=g.getAttribute("data-ylt");this.topBar=f.one("#yucs-top-bar");this._init();};f.extend(f.ucs.MoreMenu,f.ucs.MenuUtils,{_init:function(){this._position();this._initAriaTopbar();this._initEvents();},_initEvents:function(){this.menu.detach("hover");this.panel.detach("hover");f.one("#yucs-more-link").on("click",this._handleMenuClick,this);f.Global.on("ucs:menuNavShow",this._hideMenu,this);},_handleMenuClick:function(g){g.halt();if(this.panel.hasClass("yucs-hide")){this._showMenu(g);this.menu.removeClass("yucs-has-focus");this.menu.one("a").blur();this.documentClickHandle=f.one("body").on("click",this._handleDocumentClick,this);this.documentMouseDownHandle=f.one("body").on("mousedown",this._handleDocumentClick,this);}else{this._hideMenu();}},_position:function(){var g=this.menu.get("region").height;g=g-2;f.one("#yucs-top-menu").setStyle("top",g+"px");},_sendBeacon:function(){window.ucs._sendBeacon(this.ylt);},_showMenu:function(g){if(this.panel.hasClass("yucs-hide")){this._sendBeacon();this.menu.addClass(d);f.ucs.MoreMenu.superclass._showMenu.apply(this,arguments);}},_hideMenu:function(g){f.ucs.MoreMenu.superclass._hideMenu.apply(this,arguments);this.menu.removeClass(d);},_handleKeyup:function(g){if(27===g.keyCode||9===g.keyCode){this.menu.one("a").focus();this._hideMenu();}else{if(40===g.keyCode&&!this.keyedup){if(this.panel.one("a")){this._handleMenuClick(g);this.panel.one("a").focus();}this.keyedup=true;}}},_initAriaTopbar:function(){if(!this.topBar){return;}this.toolbar=f.one("#yucs-top-list");this.toolbar.set(e,"toolbar");this.toolbar.all(">li").set(e,"presentation");this.toolbar.delegate("mouseenter",function(g){g.currentTarget.removeClass("yucs-has-focus");},">li");this.fm=this.toolbar.plug(f.Plugin.NodeFocusManager,{descendants:b,keys:{next:"down:39",previous:"down:37"},focusClass:{TABINDEX_ATTR:"-1",className:"yucs-has-focus",fn:function(g){return g.get(c);}},circular:true});this.panel.focusManager.get("descendants").after("keydown",function(g){if(9===g.keyCode){this.panel.focusManager.focus(0);this._hideMenu();}},this);this.toolbar.focusManager.get("descendants").after("keyup",function(g){if(9===g.keyCode){this.toolbar.focusManager.focus(0);}if(27===g.keyCode){this.menu.one("a").focus();this._hideMenu();}},this);}});},"1.0",{requires:["node","event","ucs-menu-utils","event-resize","event-hover","node-focusmanager","event-mouseenter","event-delegate"]});(function(){ucs.YObj.use("node","ucs-simple-menu",function(b){var c=b.one("#yucs-more.yucs-more-activate"),a;if(c){a=new b.ucs.MoreMenu(c);}});})();if(typeof(YAHOO)=="undefined"){YAHOO={};}if(typeof(YAHOO.util)=="undefined"){YAHOO.util={};}if(typeof(YAHOO.util.UHScriptNodeDataSource)=="undefined"){YAHOO.util.UHScriptNodeDataSource={};}YUI.add("ucs-search",function(d){var p={"&":" ","<":" ",">":" ",'"':" ","'":" ","/":" ","`":" "};if(!ucs.Search){var h="value",m="click",u="suggest",c="touchstart",t="submit",s="innerHTML",a="tabindex",f="target",o=20,b=10,e=parseInt(d.one("#yucs").getStyle("paddingLeft"),b),j="yucs-qry",n="yucs-content-qry",v="#yucs-satray",i=d.one("#yucs-debug"),r="#yucs-btn-delete",q="https://s.yimg.com/kx/yucs/uh3/search/js/553/mini-assist-min.js",l="https://s.yimg.com/kx/yucs/uh3/search/js/442/tray-align-plugin-min.js",g="https://s.yimg.com/lq/lib/s7/tray-shim-plugin-201009101433.js",k="https://s.yimg.com/kx/yucs/uh3/search/css/434/assist-min.css";ucs.Search=function(w){if(typeof w.getDOMNode==="function"){this.form=(w.getDOMNode().nodeName.toLowerCase()==="form")?w:w.one("form");}else{this.form=w.one("form");}this.searchWrapper=d.one("#yucs-search");this.searchFormClass=d.one(".yucs-search");this.buttons=this.form.all("button");this.stype=this.form.one("#yucs-search_type");this.form.set("onsubmit",null);this.yucs=d.one("#yucs");this.loadedAssist=false;this.property=d.one("#yucs").getData("property");this.cleanBtn=d.one(r);this.languagetag=d.one("#yucs").getAttribute("data-lang");this.init();};ucs.Search.prototype={isWebSearch:false,init:function(){var C=this.property;var A=navigator.userAgent.toLowerCase();if(d.one(".enable_form_focus")&&C!=="mail"){if(C==="foo"&&d.UA.ie&&d.UA.ie<10){d.on("domready",function(){document.getElementById("mnp-search_box").focus();});}else{if(C==="foo"&&d.UA.ie==10){d.later(1,this,function(){document.getElementById("mnp-search_box").blur();document.getElementById("mnp-search_box").focus();this._setCaretStart();});}else{document.getElementById("mnp-search_box").focus();}}}else{if(C==="foo"&&d.UA.ie&&d.UA.ie<10){d.on("domready",function(){document.getElementById("mnp-search_box").focus();});}else{if(C==="foo"&&d.UA.ie==10){d.later(1,this,function(){document.getElementById("mnp-search_box").blur();document.getElementById("mnp-search_box").focus();this._setCaretStart();});}}}this.searchWrapper.removeClass("yucs-search-activate");this._setTabIndex();this.is2Button=(this.buttons.size()===2);if(this.searchFormClass.getAttribute("data-webaction")){this.form.one("input").setAttribute("name","p");this.searchFormClass.setAttribute("action",this.searchFormClass.getAttribute("data-webaction"));d.one("#yucs-sprop_button").setAttribute("data-vsearch",d.one("#mnp-search_box").getAttribute("data-yltvsearch"));}if(this._hasPlaceholderSupport()&&!d.UA.ie){var z=document.getElementById("mnp-search_box");z.removeAttribute("data-sh");}if((C==="finance")&&!this.is2Button){document.getElementById("mnp-search_box").name="s";}this.input=this.form.one("input");this.vertSearchBtn=this.form.one("#yucs-sprop_button");this.webSearchBtn=this.form.one("#yucs-search_button");this.searchToggleBtn=this.form.one("#yucs-search_toggle_button");this.searchHint=this.input.getAttribute("data-sh");this.yltvsearch=this.input.getAttribute("data-yltvsearch");this.yltvsearchsugg=this.input.getAttribute("data-yltvsearchsugg");if(!this._inputIsEmpty()&&!this._inputIsDefaultTerm()&&!this.loadedAssist){this.loadedAssist=true;this._initAssist();}if((d.one("#yucs")&&d.one("#yucs").getAttribute("data-linktarget"))){this.linkTarget=d.one("#yucs").getAttribute("data-linktarget");}else{this.linkTarget=this.form.getAttribute("target")||"_top";}this._setFormTarget();var y=this.input.getAttribute("data-resize");if(!y||y==="enable"){this._initSizeControl();}this._initEventListeners();this.form.removeClass("yucs-activate");var x=document.URL,B=/[?&]p=([^&]+)/i,w=B.exec(x);if(w==null&&C==="help"){B=/[?&]question_box=([^&]+)/i;w=B.exec(x);}if(w!=null&&(C==="answers"||C==="help"||C==="shopping")){d.one(".yucs-search-input").setAttribute("value",decodeURIComponent(w[1].replace(/\+/g," ")));}if(document.activeElement!==this.input._node&&this.input.get(h)===""){this._resetSearchInput();}if(d.one("#search_hot_keyword_block")&&C!=="mail"){this._initHotKeyword();}else{if(d.one("#search_hot_keyword_block")&&C!=="mail"){d.one("#advanced-search").set("offsetWidth",d.one(".yucs-search-input").get("offsetWidth"));}}},html:function(w){return(w+"").replace(/[&<>"'\/`]/g,this._htmlReplacer);},_htmlReplacer:function(w){return p[w];},_initSizeControl:function(){this.oldYucsWidth=this.yucs.get("region").width;this.isRTL=/ar|he/gi.test(d.one("#yucs").getAttribute("data-lang").split("-")[0]);this.leftWrapperWidth=this._calcLeftWrapperWidth();this.leftWrapper=d.one(".yucs-fl-left");this.rightWrapper=d.one(".yucs-fl-right");this.defaultWidth=parseInt(this.searchWrapper.getComputedStyle("width"),b);this.IEOffset=0;if(d.UA.ie>0&&d.UA.ie<=7){this._calcIEOffset();}this._resizeSearchContainer(this.oldYucsWidth);d.on("windowresize",d.bind(this._handleWindowResize,this));},_hasPlaceholderSupport:function(){var w=document.createElement("input");return("placeholder" in w);},_initEventListeners:function(){var w=this.form.on(t,this._handleSubmit,this);this.input.on("keydown",this._handleInputKeypress,this);this.input.on("blur",this._handleInputBlur,this);this.input.on("keyup",this._handleInputKeyup,this);this.input.on("click",this._handleInputClick,this);if(this.stype){this._initSearchTypeMenu();}if(this.property==="mail"||this.is2Button){if(this.vertSearchBtn){this.vertSearchBtn.on(m,this._handleVertSearch,this);}if(d.UA.ie){w.detach();this.webSearchBtn.on(m,this._handleWebSearchClick,this);this.form.on(t,this._handleVertSearch,this);}this.publish("ucs:webSearch",{broadcast:2,emitFacade:true});d.Global.on("ucs:webSearch",this._handleWebSearchEvent,this);d.Global.on("ucs:mailSearch",this._trackMailSearch,this);d.Global.on("ucs:mailSearchSugg",this._trackMailSearchSugg,this);}if(this.cleanBtn){this.cleanBtn.on("click",this._resetSearchInput,this);}},_initSearchTypeMenu:function(){this.stype.one(".yucs-stype_prop").setData("yucs-stype","propsearch");
this.stype.one(".yucs-stype_web").setData("yucs-stype","web");this.stype.delegate("click",function(C){var y=this.stype.one(".yucs-active"),x=this.stype.one(".yucs-inactive"),A,w,z,B;C.preventDefault();if(parseFloat(YUI.version,10)>3.1){x.toggleView();}else{if(x.getStyle("display")=="none"){x.setStyle("display","block");}else{x.setStyle("display","none");}}if(C.target.hasClass("yucs-active")||C.target.hasClass("yucs-inactive")){z=y.getData("yucs-stype");B=C.target.getData("yucs-stype");if(z!=B){A=y.get("text");w=C.target.get("text");y.set("text",w);y.setData("yucs-stype",B);x.set("text",A);x.setData("yucs-stype",z);}}},"span",this);this.stype.one(".yucs-active").on("focus",function(w){if(inactiveElm.getStyle("display")=="none"){this.stype.one(".yucs-inactive").show();}},this);this.stype.one(".yucs-inactive").on("blur",function(w){this.stype.one(".yucs-inactive").hide();},this);},_calcLeftWrapperWidth:function(){var w=d.all(".yucs-fl-left > div"),y=e,z,x;w.each(function(A){if(A.get("id")!=="yucs-search"){y+=A.get("offsetWidth")+parseInt(A.getStyle("marginLeft"),b)+parseInt(A.getStyle("marginRight"),b);}else{y+=parseInt(A.getStyle("marginLeft"),b)+parseInt(A.getStyle("marginRight"),b);}});return y;},_calcIEOffset:function(){var x=d.all(".yucs-search-buttons").pop(),w=x.intersect(this.searchWrapper);if(d.one("body").getAttribute("dir")==="rtl"){this.IEOffset=w.left-this.searchWrapper.getX();}else{this.IEOffset=this.searchWrapper.getX()+parseInt(this.searchWrapper.getComputedStyle("width"),b)-w.right;}this.defaultWidth+=this.IEOffset;},_handleWindowResize:function(){var w=this.yucs.get("region").width;if(w!==this.oldYucsWidth){this._resizeSearchContainer(w);this.oldYucsWidth=w;}},_setInputWidth:function(){var w=d.one(".yucs-form-input"),x=parseInt(this.input.getStyle("paddingLeft"))+parseInt(this.input.getStyle("paddingRight"))+parseInt(this.input.getStyle("borderLeftWidth"))+parseInt(this.input.getStyle("borderRightWidth"));this.input.setStyle("width",(w.get("region").width-x)+"px");},_resizeSearchContainer:function(z){var y=this.searchWrapper.get("region").width,x=this.rightWrapper.get("region").width+e,w=z-(this.leftWrapperWidth+x+o)+this.IEOffset;if(w>this.defaultWidth){if(y===this.defaultWidth){return;}else{w=this.defaultWidth;}}if(this.IEOffset>0&&this.isRTL){this.searchWrapper.setStyle("visibility","hidden");}this.searchWrapper.setStyle("width",w+"px");if(this.IEOffset>0&&this.isRTL){d.later(50,this,function(){this.searchWrapper.setStyle("visibility","visible");});}},_getInputValTrimmed:function(){var w=this.input.get(h);w=d.Lang.trim(w);return w;},_inputIsEmpty:function(){return this._getInputValTrimmed()==="";},_inputIsDefaultTerm:function(){return this._getInputValTrimmed()===this.searchHint;},_handleInputKeyup:function(w){if(w.keyCode==13){}if(this._inputIsEmpty()){this._resetSearchInput();this._setCaretStart();}if(!this._inputIsEmpty()&&!this._inputIsDefaultTerm()){this._setTabIndex();}if(!this.loadedAssist){this.loadedAssist=true;this._initAssist();}this._showCleanBtn();},_handleInputClick:function(){if(this._inputIsDefaultTerm()){this._resetSearchInput();this._setCaretStart();}},_setCaretStart:function(){var y;if((y=window.document.selection)){if(y.type!="Control"){var w=this.input.get("value").length,x=y.createRange();x.move("character",-w);x.select();}}},_setTabIndex:function(){var w=(d.UA.ie>0&&d.UA.ie<=7);this.buttons.each(function(x){var y=x.getAttribute(a);if((w&&y===0)||(w&&y===65535)||(y&&!(w&&y===32768))){x.setAttribute(a,0);}else{x.setAttribute(a,-1);}});},_setFormTarget:function(){if(this.linkTarget==="_blank"||this.form.hasClass("yucs-search-fh")){this.form.setAttribute(f,"searchWin");}else{this.form.setAttribute(f,this.linkTarget);}},_initAssist:function(){var w=this.input.getAttribute("data-satype");switch(w){case"mini":this._initMiniAssist(this.input._node);break;case"rich":this._initRichAssist(this.input._node);break;default:break;}},_buildAssistConfig:function(w){var x={searchbox:w,clid:"uh-yui3",align:true,shim:1,nresults:w.getAttribute("data-maxresults")||10};x.node=v;if(w.getAttribute("data-pubid")){x.pubid=w.getAttribute("data-pubid");}if(w.getAttribute("data-gosurl")){x.url=w.getAttribute("data-gosurl");}if(d.one("#yucs-sfilter")&&d.one("#yucsHead").hasClass("ua-ie")){x.tray={plugin:{align:"#yucs-input_wrap"}};}return x;},_initMiniAssist:function(y){var w=this,x={miniassist:{fullpath:q,requires:["base","get","node","event-focus","plugin","array-extras"]},"miniassist-skin":{fullpath:k,type:"css"},"tray-align-plugin":{fullpath:l,requires:["miniassist"]},"tray-shim-plugin":{fullpath:g,requires:["miniassist"]}};ucs.YObj.applyConfig({modules:x});ucs.YObj.use("miniassist","miniassist-skin","tray-align-plugin","tray-shim-plugin","event-move","escape",function(A){if(ucs.YObj.config.fetchCSS===false){A.Get.css(w.miniassistSkin);}var G=new A.Node(y),E=w._buildAssistConfig(G);w.sa=new A.Search.MiniAssist(E);w.sa.assist._checkValue();w.sa.gossip.set("scrollSize",13);w.sa.gossip.set("linkStem",A.one(v).getAttribute("data-vsearch"));if(A.one("#search_hot_keyword_block")){var J="",F="",z=A.one("#yucs").getData("property"),B=A.one("#yucs").getAttribute("data-lang");if("sports"==z&&B=="zh-hant-tw"){J="tw.sports.yahoo.com";}else{if("ivy"==z&&B=="zh-hant-tw"){F="hq";}else{if("omg"==z&&B=="zh-hant-hk"){J="hk.ent.yahoo.com";}else{if("finance"==z&&B=="zh-hant-hk"){J="hk.finance.yahoo.com";}else{if("lifestyles"==z&&B=="zh-hant-hk"){J="hk.lifestyle.yahoo.com";}}}}}if(J!=""){w.sa.gossip.set("linkParams",{fr:A.one(v).getAttribute("data-vfr"),"vs":J});}else{if(F!=""){w.sa.gossip.set("linkParams",{fr:A.one(v).getAttribute("data-vfr"),"ilk":F});}else{w.sa.gossip.set("linkParams",{fr:A.one(v).getAttribute("data-vfr")});}}}else{w.sa.gossip.set("linkParams",{fr:A.one(v).getAttribute("data-vfr")});}w.sa.gossip.set("uhbParams",{uhb:A.one(v).getAttribute("data-vfr")});if(!w.is2Button){w.sa.gossip.set("hideEmptyTray",false);w.sa.gossip.set("linkParams",{});}if(w.property==="finance"&&w.languagetag!=="zh-hant-hk"){var I=A.one(E.node),C=I.getAttribute("data-vstext"),D=I.getAttribute("data-vert_fin_search"),H=A.one(v).getAttribute("data-searchNews");
w.sa.assist.on(u,function(L){if(L.query){var K=A.one("#"+n),M=w.sa.buildSearchUrl(G,L.query,D,{fr:H});if(w.property==="finance"){M=M.replace("?s=","?p=");}if(!K){if(document.getElementById("hspart")){M+="&hspart="+document.getElementById("hspart").value;}if(document.getElementById("hsimp")){M+="&hsimp="+document.getElementById("hsimp").value;}if(document.getElementById("yucs-hstype")){M+="&type="+document.getElementById("yucs-hstype").value;}K=A.Node.create("<ul id='"+n+"'><li><a id='searchVertical' href='"+M+"'>"+C+"<q>"+A.Escape.html(L.query)+"</q></a></li></ul>");A.one(".sa-panel").append(K);}else{K.one("li").setContent("<a  id='searchVertical' href='"+M+"' text='"+L.query+"'>"+C+" <q>"+A.Escape.html(L.query)+"</q></a>");}}});}A.one(".yucs-search").on("submit",function(L){if(A.one("#"+j+" a.sa-active")){var K=A.one("#"+j+" a.sa-active").getAttribute("href");L.preventDefault();if(w.linkTarget==="_blank"||w.form.hasClass("yucs-search-fh")){window.open(K,"searchWin");}else{window.location.href=K;}}});});},_initRichAssist:function(y){var w=this,x={richassist:{fullpath:"https://s.yimg.com/lq/lib/s7/richassist-yui3-201009101433.js",requires:["base","get","node","event-focus","plugin"]},"tray-align-plugin":{fullpath:"https://s.yimg.com/lq/lib/s7/tray-align-plugin-201009101433.js",requires:["richassist"]},"tray-shim-plugin":{fullpath:"https://s.yimg.com/lq/lib/s7/tray-shim-plugin-201009101433.js",requires:["richassist"]}};ucs.YObj.applyConfig({modules:x});ucs.YObj.use("richassist","tray-align-plugin","tray-shim-plugin",function(B){var z=new B.Node(y),A=w._buildAssistConfig(z);w.sa=new B.Search.RichAssist(A);});},_setInputBlank:function(){this.input.set(h,"");},_handleSearchToggle:function(w){w.preventDefault();this._toggleSearch();},_toggleSearch:function(){var w=this,x=function(y){w._handleBodyClick(y);};d.one("#yucs").toggleClass("yucs-show_search");if(!this.bodyClick){if(d.UA.mobile&&("createTouch" in document)&&("addEventListener" in document.body)){d.log("using touchstart in mobile browser","info","search");document.body.addEventListener(c,x,false);this.bodyClick={detach:function(){if("removeEventListener" in document.body){document.body.removeEventListener(c,x,false);}}};}else{this.bodyClick=d.one("body").on(m,this._handleBodyClick,this);}this.bodyScroll=d.on("scroll",function(y){this._toggleSearch();},this);}else{this.bodyClick.detach();this.bodyScroll.detach();this.bodyClick=this.bodyScroll=null;}},_handleBodyClick:function(y){var x=y&&y.target||null,w;if(!x){return;}w=typeof x.ancestor==="function"?x:d.one(x);if(w&&!w.ancestor("#yucs")){this._toggleSearch();}},_handleWebSearchClick:function(w){this.isWebSearch=true;},_handleSubmit:function(x){if(this.form.one("#yucs-sky-term")){this.form.one("#yucs-sky-term").set(h,this._getInputValTrimmed());}if(this._inputIsDefaultTerm()){this._setInputBlank();}if(x&&x.target){this.isWebSearch=d.one(x.target).hasClass("yucs-wsearch-button");}if(document.getElementById("yuhead-att-cat")){if(this.form.getAttribute(f)!=="searchWin"){x.preventDefault();}var w=d.Node.create("<img />");w.once("load",this._handleImageLoad,this);w.once("error",this._handleImageLoad,this);this._timer=window.setTimeout(d.bind(this._handleImageLoad,this),2000);w.set("src","https://attadworks.turn.com/r/dd/id/L21rdC8xMDAvY2lkLzE1OTE3NzExL3QvMg/qry/"+encodeURIComponent(this._getInputValTrimmed()));}},_handleImageLoad:function(w){if(this._timer!==null){clearTimeout(this._timer);this._timer=null;}if(this.form.getAttribute(f)!=="searchWin"){this.form.submit();}},_handleInputKeypress:function(w){if((w.keyCode===46||w.keyCode===8)&&this._inputIsDefaultTerm()){w.preventDefault();return;}else{if(w.keyCode!==9&&w.keyCode!==13){if(this._inputIsDefaultTerm()){this._setInputBlank();this.input.removeClass("yucs-search-hint-color");}if(!this.loadedAssist){this.loadedAssist=true;this._initAssist();}}}},_handleInputBlur:function(w){if(this._inputIsEmpty()){this._resetSearchInput();}},_handleVertSearch:function(z){d.log("handleVertSearch");if(this.isWebSearch||d.one("#"+j+" a.sa-active")){this.isWebSearch=false;return;}z.preventDefault();if(this._inputIsEmpty()){return;}var y=z.target.getAttribute("data-vsearch"),w="1button",B,D=this.property,A=this.languagetag;if(this.is2Button){w="2button";}if(!y){y=this.vertSearchBtn.getAttribute("data-vsearch");}if(y&&D!=="mail"){B=y.split("?");if(B.length==1){B="";}else{y=B[0];B=B[1];}if(D==="finance"&&A!="zh-hant-hk"){y+="?uhb="+z.target.getAttribute("data-vfr")+"&fr="+d.one(v).getAttribute("data-searchNews")+"&type="+w+"&s="+encodeURIComponent(this.input.get(h));if(d.one("#searchAll")&&d.one("#searchAll").hasClass("sa-active")){y=d.one("#searchAll").getAttribute("href");}if(d.one("#searchVertical")&&d.one("#searchVertical").hasClass("sa-active")){y=d.one("#searchVertical").getAttribute("href");}}else{if(D==="groups"){y+="?query="+encodeURIComponent(this.input.get(h));}else{if(D==="help"){this.helpForm=d.one("#landingSearch");if(!this.helpForm){this.helpForm=d.one("#question_form");}var x=this;if(this.helpForm){this.vsu="";var C=this.helpForm.one('input[type="text"]').getAttribute("name");this.helpForm.all('input[type="hidden"]').each(function(E){x.vsu+=E.getAttribute("name")+"="+E.getAttribute("value")+"&";},x);y=this.helpForm.getAttribute("action");y+="?"+this.vsu+C+"="+encodeURIComponent(this.input.get(h));if(C!="question_box"){y+="&p="+encodeURIComponent(this.input.get(h));}}else{y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&query="+encodeURIComponent(this.input.get(h));}}else{if(A=="zh-hant-tw"&&(D=="omg"||D=="news"||D=="ivy")){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&ei=UTF-8";if(D=="ivy"){y+="&ilk=hq";}}else{if(D=="sports"&&A=="zh-hant-tw"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&ei=UTF-8&vs=tw.sports.yahoo.com";}else{if(D=="omg"&&A=="zh-hant-hk"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&vs=hk.ent.yahoo.com&ei=UTF-8";
}else{if(D=="finance"&&A=="zh-hant-hk"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&vs=hk.finance.yahoo.com&ei=UTF-8";}else{if(D=="news"&&A=="zh-hant-hk"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&ei=UTF-8";}else{if(D=="lifestyles"&&A=="zh-hant-hk"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&vs=hk.lifestyle.yahoo.com&ei=UTF-8";}else{if(D=="money"&&A=="zh-hant-tw"){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h))+"&vs=tw.money.yahoo.com&ei=UTF-8";}else{if(z.target.getAttribute("data-vfr")){y+="?fr="+z.target.getAttribute("data-vfr")+"&type="+w+"&p="+encodeURIComponent(this.input.get(h));}else{y+="?type="+w+"&p="+encodeURIComponent(this.input.get(h));}}}}}}}}}}}if(B){y+="&"+B;}if(this.linkTarget==="_blank"||this.form.hasClass("yucs-search-fh")){window.open(y,"searchWin");}else{if(window!=window.top){window.top.location.href=y;}else{window.location.href=y;}}}else{this._fireVertSearchEvent(z);}},_fireVertSearchEvent:function(x){var w=this.input.get(h);this.publish("ucs:verticalSearchAction",{broadcast:2,emitFacade:true});this.fire("ucs:verticalSearchAction",{"query":w});},_handleWebSearchEvent:function(w){if(w.query){this.input.set("value",w.query);}this.form.submit();},_fireInterfaceReady:function(){this.publish("ucs:uhSearchInterfaceReady",{broadcast:2,emitFacade:true});this.fire("ucs:uhSearchInterfaceReady");},_getSearchInput:function(){return this.input;},_resetSearchInput:function(){if(this.searchHint){this.input.addClass("yucs-search-hint-color");}this._hideCleanBtn();this.input.set(h,this.searchHint);},_setSearchInput:function(w){this.input.set(h,w);},_getVertSearchBtnContent:function(){return this.vertSearchBtn.get(s);},_initHotKeyword:function(){var x=this.yucs.getAttribute("data-lang").split("-").pop(),y=d.one("#search_hot_keyword_block");var z={"title":"熱門 : ","count":8,"max_charaters":30,"data":"","url":"http://global.tts.search.yahoo.com/pulse.php","fr":this.vertSearchBtn.getAttribute("data-vfr"),"format":"json","intl":x,"type":"metro","src":"metro","order":"rank","retry":1,"project_id":0,"tracking_id":0,"host":"a.analytics.yahoo.com","colo":"","fr_code":"","spaceid":y.getData("spaceid"),"bucketid":y.getData("bucketid")};if("zh-hant-tw"==this.languagetag&&("news"==this.property||"omg"==this.property||"sports"==this.property||"ivy"==this.property||"mail"==this.property||"money"==this.property)){z.project_id=1167069579;z.tracking_id=10001167069579;z.host="y3.analytics.yahoo.com";z.colo="VSCALE4";if(z.fr=="tw_uh3_news_vert_1"){z.fr_code="tw_uh3_news_tts_1";}else{if(z.fr=="tw_uh3_news_vert_2"){z.fr_code="tw_uh3_news_tts_2";}else{if(z.fr=="tw_uh3_omg_vert_1"){z.fr_code="tw_uh3_omg_tts_1";}else{if(z.fr=="tw_uh3_sports_vert_1"){z.fr_code="tw_uh3_sports_tts_1";}else{if(z.fr=="tw_uh3_screen_vert_1"){z.fr_code="tw_uh3_screen_tts_1";}else{if(z.fr=="tw_uh3_mail_vert_1"){z.fr_code="tw_uh3_mail_tts_1";}else{if(z.fr=="uh3_money_vert"){z.url="https://tw.search.yahoo.com/tts";z.type="webttstw";z.fr_code="uh3_money_tts";}}}}}}}if("omg"==this.property||"ivy"==this.property){z.type="uh3omg";}}else{if("zh-hant-hk"==this.languagetag&&("omg"==this.property||"lifestyles"==this.property||"finance"==this.property||"news"==this.property||"mail"==this.property)){z.project_id=21324579;z.tracking_id=100021324579;z.host="y3.analytics.yahoo.com";z.colo="ONO";if(z.fr=="hkomg"){z.fr_code="hk_uh3_ent_tts_1";}else{if(z.fr=="hk_uh3_news_vert_1"){z.fr_code="hk_uh3_news_tts_1";}else{if(z.fr=="hk_uh3_finance_vert_1"){z.fr_code="hk_uh3_finance_tts_1";}else{if(z.fr=="hk_uh3_lifestyle_vert_1"){z.fr_code="hk_uh3_lifestyle_tts_1";}else{if(z.fr=="hk_uh3_mail_vert_1"){z.fr_code="hk_uh3_mail_tts_1";}}}}}if("news"==this.property||"finance"==this.property||"mail"==this.property){z.type="shine";}else{if("omg"==this.property||"lifestyles"==this.property){z.type="entertainment";}}}}var w=z.url+"?fr="+z.fr_code+"&format="+z.format+"&count="+z.count+"&intl="+z.intl+"&type="+z.type+"&src="+z.src+"&order="+z.order+"&jsonp_cb=YAHOO.util.UHScriptNodeDataSource.callbacks";this._getHotKeyword(w,z);},_getHotKeyword:function(x,w){d.Get.script(x,function(){onSuccess:YAHOO.util.UHScriptNodeDataSource.callbacks;});YAHOO.util.UHScriptNodeDataSource.callbacks=function(z){if(z!=undefined&&z[0]!=undefined){var E=0,C=1;var y='<marquee scrollamount="2" scrolldelay="120" direction="up" height="18" behavior="slide" loop="1">'+'<ul id="search_hot_keyword_items" class="search_hot_keywork_items">'+'<li id="search_hot_keyword_title">'+w.title+"</li>";for(var G in z){if(undefined!=z[G].display_term){E+=z[G].display_term.length;if(E>w.max_charaters){break;}if(G<w.count){y+='<li class="search_hot_keyword_item">';if(d.UA.ie&&d.UA.ie<9){y+='<a href="'+z[G].link+'" data-ylk="sec:search_hot_keyword_items;slk:search_hot_keyword_item_'+C+'">';}else{y+='<a href="#" onClick="setTimeout(function(){window.location.href=\''+z[G].link+'\';}, 2000)" data-ylk="sec:search_hot_keyword_items;slk:search_hot_keyword_item_'+C+'" class="rapidnofollow">';}y+=z[G].display_term;y+="</a></li>";C++;}}}y+="</ul></marquee>";this.hotKeywordBlock=d.one("#search_hot_keyword_block");this.hotKeywordBlock.set("innerHTML",y);var I={ultkey1:"search hot keyword",A_pn:"search hot keyword pn",tim:"red"};var F={project_id:w.tracking_id,host:w.host,cf:{22:w.fr_code}};var D={compr_type:"deflate",debug:false,tracked_mods:{"search_hot_keyword_items":"search_hot_keyword_items"},keys:I,spaceid:w.spaceid,ywa:F,nofollow_class:["rapidnofollow","search_hot_keyword_items"]};if(typeof(YAHOO.i13n)=="undefined"){YAHOO.i13n={};}if(typeof(YAHOO.i13n.Rapid)=="undefined"){var A="https://s.yimg.com/ss/rapid-3.12.1.js",H="https://s.yimg.com/ss/rapidworker-1.1.js";d.Get.js([A,H],function(K){if(K){console.log("get rapid js error");}else{var J=new YAHOO.i13n.Rapid(D);}});}else{var B=new YAHOO.i13n.Rapid(D);
}}};},_hideCleanBtn:function(){if(d.one(r)){d.one(r).setStyle("display","none");}},_showCleanBtn:function(){if(d.one(r)){d.one(r).setStyle("display","inline-block");}},_setVertSearchBtnContent:function(w){this.vertSearchBtn.set(s,(w["text"])?w["text"]:w);},_setVertSearchBtnPathName:function(w){this.vertSearchBtn.setAttribute("data-vsearch",w);},_trackMailSearch:function(){d.log("Mail search");this._sendBeacon(this.yltvsearch);},_trackMailSearchSugg:function(){d.log("Mail search sugg");this._sendBeacon(this.yltvsearchsugg);},_trackPropSearch:function(){d.log("Prop Search");this._sendBeacon(this.yltvsearch);},_sendBeacon:window.ucs._sendBeacon};d.augment(ucs.Search,d.EventTarget);}},"1.0",{requires:["node","event","event-custom","event-resize","dom-screen"]});ucs.YObj.use("node","ucs-search",function(b){var a=b.all("#yucs-search.yucs-search-activate");a.each(function(f,c,e){if(f.ancestor(".yucs-fl-left")){ucs.UhSearchInterface=new ucs.Search(f);ucs.UhSearchInterface.getInput=function(){return ucs.UhSearchInterface._getSearchInput();};ucs.UhSearchInterface.setInput=function(g){ucs.UhSearchInterface._setSearchInput(g);};ucs.UhSearchInterface.resetInput=function(){ucs.UhSearchInterface._resetSearchInput();};ucs.UhSearchInterface.getVertSearchBtnText=function(){return ucs.UhSearchInterface._getVertSearchBtnContent();};ucs.UhSearchInterface.setVertSearchBtnText=function(g){ucs.UhSearchInterface._setVertSearchBtnContent(g);};ucs.UhSearchInterface.setVertSearchBtnPathName=function(g){ucs.UhSearchInterface._setVertSearchBtnPathName(g);};ucs.UhSearchInterface._fireInterfaceReady();}else{b.log("instantiating search components");var d=new ucs.Search(f);}});});YUI.add("ucs-profile-menu",function(d){var e="ucs:profileMenuShow",b="ucs:menuNavShow",a=d.Lang.trimRight,c;d.namespace("ucs.ProfileMenu");d.ucs.ProfileMenu=function(f){this.profile=f;this.name=this.profile.one(".yuhead-name");this.greeting=this.profile.one(".yuhead-name-greeting")||"";this.optimizedNameCache={};this.menuId=this.profile.getAttribute("id");this.init();};d.ucs.ProfileMenu.prototype={init:function(){this.publishEvents();this.initEventHandlers();this.optimizeNameLength();},optimizeNameLength:function(){var g=9,h="65px",f=this.name?this.name.get("text").length:0,i=this.greeting?this.greeting.get("text").length:0;if(this.name&&d.one(".ua-ie6, .ua-ie5")&&(f>g)){this.name.setStyle("width",h);this.name.get("parentNode").setStyle("width",h);}},publishEvents:function(){d.augment(d.ucs.ProfileMenu,d.EventTarget,null,null,{});this.publish(e,{broadcast:2,emitFacade:true});},initEventHandlers:function(){var f=this;d.Global.on(b,this.handleMenuNavShow,this);},handleMenuNavShow:function(f){if(f&&f.menuid===this.menuId){if(d.UA.ie===8){this.profile.one("#yucs-profile-cont").setStyle("maxHeight","100%");}this.fire(e);}}};},"1.0",{requires:["node","event","event-custom","event-resize"]});(function(){ucs.YObj.use("ucs-profile-menu",function(c){var b=c.one("#yucs-profile"),a;if(b){a=new c.ucs.ProfileMenu(b);}});}());YUI.add("ucs-usermenu",function(c){c.namespace("ucs.UserMenu");var n="ucs:userMenuShow",k="ucs:userMenuItemClick",s="yucs-hide",h="yui3-menu-hidden";var m='{separatorTop}<li class="{isDisabled} {isActive} {menuClass}"><div>'+'<a target="{target}" {actionData} href="{url}" {disabledAria}>'+"{icon}"+"{menuText}"+"</a></div></li>{separatorBottom}",r='{separatorTop}<li class="{isDisabled} {isActive} {menuClass}"><div>'+'<a href="#" data-customevt="true" {actionData} {disabledAria} {checkedAria}>'+"{icon}"+"{menuText}"+"</a></div></li>{separatorBottom}",l='<span class="yucs-separator" role="presentation"></span>',g="click",p="a",i="role",a="tabIndex",f="yucs-hide",b="iframe",j="ul",d="li",o="parentNode",q="http://l.yimg.com/a/lib/ush/icon.gif",e="https://s.yimg.com/lq/lib/ush/icon.gif";c.ucs.UserMenu=function(t){t.removeClass("yucs-um-activate");this.menuContainer=t.ancestor("div");this.previewPanel=c.one("#yucs-profile_inner");this.PANEL_OFFSET=30;this.PANEL_OFFSET_Y=3;this.headerNode=c.one("#yucs");this.profileNode=this.headerNode.one(".yucs-profile");c.ucs.UserMenu.superclass.constructor.apply(this,[this.menuContainer,{panelSelector:"#yucs-profile_inner",openDelay:0}]);this._initCustomEvents();};c.extend(c.ucs.UserMenu,c.ucs.MenuUtils,{_initCustomEvents:function(){this.publish(n,{broadcast:2,emitFacade:true});this.publish(k,{broadcast:2,emitFacade:true});c.Global.on("ucs:userMenuItems",this._handleUserMenuItems,this,{"location":"bottom","menuType":"minty-um-item"});this.menu.delegate(g,this._handleMenuItemClick,"li.minty-um-item a",this);},_showMenu:function(t){c.ucs.UserMenu.superclass._showMenu.apply(this,arguments);this.fire(n);this._setPosition();},_showMenuItems:function(){this.menu.all("li").removeClass("yucs-hide");this.menu.all("span.separator").setStyle("display","block");},_setPosition:function(){this.avatarIcon=this.profileNode.one(".yucs-avatar");var x=this.previewPanel.one(".yucs-dock"),v=x&&x.get("offsetWidth"),w,t=this.headerNode.get("offsetHeight"),A=Math.round(this.avatarIcon.getX()),u=this.headerNode.get("offsetWidth"),z=this.previewPanel.get("offsetWidth"),y=this.headerNode.one(".yucs-mail_link");if(this.rtl){this.previewPanel.setX(Math.round(this.headerNode.getX()+this.PANEL_OFFSET));}else{if(!y&&(A+z>u)){this.previewPanel.setX(Math.round(this.headerNode.getX()+u-z-20));}else{this.previewPanel.setX(A);}}if(c.one("#search_hot_keyword_block")){this.panel.setY((this.headerNode.getY()+t)-this.PANEL_OFFSET_Y-30);}else{if(t>0){this.panel.setY((this.headerNode.getY()+t)-this.PANEL_OFFSET_Y);}else{this.panel.setY(this.avatarIcon.getY()+this.avatarIcon.get("offsetHeight")+3);}}if(x){w=(this.avatarIcon.get("offsetWidth")/2)-(v/2);x.setX(this.avatarIcon.getX()+w);}},_handleKeyup:function(t){if(27===t.keyCode||9===t.keyCode){this.menu.one("a").focus();this._hideMenu();}else{if(40===t.keyCode&&!this.keyedup){if(this.panel.one("a")){this._showMenu(t);this.panel.one("a").focus();}this.keyedup=true;}}},_handleUserMenuItems:function(y,x){c.log("user menu items received");var u="bottom",w="minty-user-item";if(!y.menuGroups||!y.menuGroups.length){return;}if(x&&x.location){u=x.location;}if(x&&x.menuType){w=x.menuType;}var v=y.menuGroups,t=this.menu.one(j);if(y.reset&&t){t.all("."+w).each(function(z){z.remove(true);});}if(v.length>0){this._addMenuGroups(v,u,false,w);}},_handleMenuItemClick:function(y){c.log("user menu item click");var x,v,t,u;x=y.target;x=x.ancestor("a",true);v=x.getAttribute("data-mad");t=x.getAttribute("data-customevt");u=x.ancestor("li").hasClass("disabled");if(u){y.halt();return;}if(t){y.preventDefault();}if(!u){var w={actionData:v};this.fire(k,w);}},_addMenuGroups:function(w,C,A,B){var y=this.menu.one(j),u,t="";u=(y.get("children")._nodes.length)?true:false;for(var v=0,x=w.length;v<x;v++){var z=w[v].length;if(C==="bottom"){w[v][0].separatorTop=true;}else{if(v<(x-1)||u){w[v][z-1].separatorBottom=true;}}t+=this._addMenuGroup(w[v],A,B);}if(C==="bottom"){y.append(t);}else{y.prepend(t);}if(t!=""){y.setStyle("width",(y.get("offsetWidth")+10)+"px");}},_addMenuGroup:function(u,x,w){var y="";for(var v=0,t=u.length;v<t;v++){if(u[v].actionData==="themes"){continue;}if(x){u[v].isDebugItem=true;u[v].menuClass=w+" debug-item";}else{u[v].isDebugItem=false;u[v].menuClass=w+" minty-item";}y+=this._addMenuItem(u[v],w);}return y;},_addMenuItem:function(v,u){var t="";if(v.isActive){v.checkedAria='aria-checked="true"';}else{v.checkedAria="";}if(v.isDisabled){v.disabledAria='aria-disabled="true"';}else{v.disabledAria="";}if(v.actionData&&v.actionData.match(/^om:/)){return t;}switch(v.actionType){case"link":t=c.substitute(m,v,this._processTemplateValue);break;case"customEvent":t=c.substitute(r,v,this._processTemplateValue);break;default:break;}if(t){if(v.isDebugItem){t=t.replace(/separator/,"separator debug-item "+u);}else{t=t.replace(/separator/,"separator minty-item "+u);}}return t;},_processTemplateValue:function(u,v,w){c.log("key = "+u+" value = "+v+" meta_data = "+w);var x="";var t=(document.location.protocol==="https:")?e:q;switch(u){case"icon":if(v!==undefined){if(v==="available"){x='<img src="'+t+'" class="yucs-opi available"/>';}else{if(v==="offline"){x='<img src="'+t+'" class="yucs-opi offline"/>';}else{if(v==="invisible"){x='<img src="'+t+'" class="yucs-opi invisible"/>';}else{if(v==="busy"){x='<img src="'+t+'" class="yucs-opi busy"/>';}else{if(v==="idle"){x='<img src="'+t+'" class="yucs-opi idle"/>';}else{x='<img src="'+v+'" />';}}}}}}break;case"separatorTop":if(v){x=l;}break;case"separatorBottom":if(v){x=l;}break;case"actionData":if(v){x='data-mad="'+v+'"';}break;case"isDisabled":if(v){x="disabled";}break;case"isActive":if(v){x="sp active";}break;case"checkedAria":x=v;break;default:x=v;break;}return x;}});c.augment(c.ucs.UserMenu,c.EventTarget);},"1.0",{requires:["oop","node","event-custom","substitute","ucs-menu-utils"]});(function(){ucs.YObj.use("node","ucs-usermenu",function(c){var a=c.one("#yucs-menu_link_profile.yucs-um-activate"),b;if(a){b=new c.ucs.UserMenu(a);}});})();YUI.add("jsonp-super-cached",function(b){b.namespace("jsonpsupercached");if(!YUI.Env.JsonpSuperCached){YUI.Env.JsonpSuperCached={};}if(!YUI.Env.JsonpSuperCached.services){YUI.Env.JsonpSuperCached.services={};}var a=YUI.Env.JsonpSuperCached.services;b.jsonpsupercached.getData=function(f){var c={};var d=f.url||"";var j=f.serviceName||"service";var m=f.callbackName||"callback";var i=f.broadcast||false;var j="_"+j+"_"+m;var g=f.onSuccess||function(){};c.timeout=f.timeout;c.onTimeout=f.onTimeout||null;c.onFailure=f.onFailure||null;var l=(d.indexOf("?")===-1)?"?":"&";var h=d+l+m+"=YUI.Env.JsonpSuperCached."+j;var k=f.args||[];var e=f.context||null;b.jsonpsupercached.get=YUI.Env.JsonpSuperCached.get||b.Get;if(!a[h]){a[h]={dataAvailable:false,requestInProgress:false,callbacksQueue:[]};}var n=a[h];if(n.dataAvailable){g(n.data);}else{n.callbacksQueue.push(g);if(!n.requestInProgress){YUI.Env.JsonpSuperCached[j]=function(r){n.data=r;n.dataAvailable=true;var s=n.callbacksQueue;for(var q=0,o=s.length;q<o;q++){var p=s.pop();p.apply(e,[r].concat(k));}};n.requestInProgress=true;b.jsonpsupercached.get.script(h,c);}}};},"0.0.1");YUI.add("ucs-avatar",function(b){var a="https://s.yimg.com/dh/ap/social/profile/profile_b32.png";b.namespace("ucs");b.ucs.Avatar=function(c){this.container=c;this.crumb=this.container.getAttribute("data-crumb");this.guid=this.container.getAttribute("data-guid");this.profile=this.container.getAttribute("data-prof");this.username=this.container.getAttribute("data-user");this.init();};b.ucs.Avatar.prototype={init:function(){this.container.removeClass("yucs-av-activate");this.img=b.Node.create('<img width="28" height="28" alt="'+this.username+" "+this.profile+'">');this._fetchData();},_fetchData:function(){var c='select imageUrl from social.profile.image where guid = "'+this.guid+'" and size="32x32" and imgssl=1;',d="https://ucs.query.yahoo.com/v1/console/yql?"+b.QueryString.stringify({q:c,format:"json",crumb:this.crumb,_maxage:900});b.jsonpsupercached.getData({url:d,serviceName:"avatar",onSuccess:b.bind(this._buildMarkup,this)});},_buildMarkup:function(d){var c;if(!d.query||!d.query.results||d.query.results==="0"||!d.query.results.image||d.query.results.image.imageUrl.match(/profile_/)){c=a;}else{c=d.query.results.image.imageUrl;if(window.location.protocol=="https:"){c=c.replace(/^http:\/\/l\.yimg/,"https://s.yimg");c=c.replace(/^http:\/\/socialprofiles\.zenfs/,"https://socialprofiles.zenfs");}}this.img.on("load",function(f){this.img.addClass("yucs-avatar");this.container.setContent(this.img);},this);this.img.setAttribute("src",c);}};},"1.0",{requires:["node","event","jsonp-super-cached","querystring-stringify"]});(function(){ucs.YObj.use("node","ucs-avatar",function(c){var b=c.one("#yucs").one("span.yucs-avatar.yucs-av-activate"),a;if(b){a=new c.ucs.Avatar(b);}});})();YUI.add("ucs-mailcount-v2",function(b){b.namespace("ucs");var a="https://s1.yimg.com/kx/yucs/uh3/mail_link/js/80/mail_preview_ssl-min.js";b.ucs.MailCount=function(c){this.mailcount=c;this.mailPreview=null;this.init();};b.ucs.MailCount.prototype={init:function(){this.property=b.one("#yucs").getAttribute("data-property");this.crumb=this.mailcount.getAttribute("data-mc-crumb");this.maxCountDisplay="99+";this.mailUrl=this._getMailCountURI();this.count=0;this.mailCountTimer=null;this.mouseMoveHandle=null;this.keypressHandle=null;this.pollingDurationTimer=null;this.pollingDuration=10*60000;this.mailCountPollingInterval=2*60000;if(b.UA.ie){b.one("document").on("focus",this._handleWindowFocus,this);b.one("document").on("blur",this._handleCancelMailCountFetch,this);}else{b.one("window").on("focus",this._handleWindowFocus,this);b.one("window").on("blur",this._handleCancelMailCountFetch,this);}this._initPollingTimer();if(top===self&&(this.mailcount.getAttribute("data-authstate")!=="signedout")&&document.location.protocol!=="https"){if(location.href.match(/ucs_mail_preview_popupsignin=1/)){this._loadMailPreviewScript();}else{this.mailcount.get("parentNode").once("yucs-mailcount|mouseenter",this._loadMailPreviewScript,this);this.mailcount.get("parentNode").once("yucs-mailcount|focus",this._loadMailPreviewScript,this);}}this._getMailCount();this.mailcount.removeClass("yucs-activate");},_getMailCountURI:function(){var g=this.mailcount,c="https",f=g.getAttribute("data-uri-path"),e=b.QueryString.stringify({"wssid":this.crumb,"appid":"UnivHeader"}),d=c+"://"+f+"?"+e+"&callback={callback}";this._service=new b.JSONPRequest(d,{on:{success:b.bind(this._processMailCount,this),timeout:function(h){}},timeout:3000,end:this.requestInProgress=false});return d;},_processMailCount:function(d){if(!d.newmailcount){return;}else{var c=parseInt(d.newmailcount,10);this.count=c;if(this.mailPreview){this.mailPreview.setMailCount(this.count);}if(c>0){if(c>9){this.mailcount.get("parentNode").addClass("yucs-lgnewmail");}else{this.mailcount.get("parentNode").addClass("yucs-newmail");}if(c>99){c=this.maxCountDisplay;}this.mailcount.one(".yucs-alert-count").set("innerHTML",c);this.mailcount.removeClass("yucs-hide");}else{this.mailcount.addClass("yucs-hide");this.mailcount.get("parentNode").removeClass("yucs-newmail");this.mailcount.get("parentNode").removeClass("yucs-lgnewmail");}}},_sendMailCountRequest:function(c,d,e){this.mailCountTimer=b.later(d,this,function(){if(this._service){this._service.send();}},null,e);},_getMailCount:function(){this._sendMailCountRequest(this.mailUrl,500,false);this._sendMailCountRequest(this.mailUrl,this.mailCountPollingInterval,true);},_initPollingTimer:function(){this.pollingDurationTimer=b.later(this.pollingDuration,this,this._cancelMailCountFetch,null,false);if(this.mouseMoveHandle){this.mouseMoveHandle.detach();}if(this.keyPressHandle){this.keyPressHandle.detach();}},_handleWindowFocus:function(c){if(this.mailCountTimer){this.mailCountTimer.cancel();}if(this.pollingDurationTimer){this.pollingDurationTimer.cancel();this._initPollingTimer();}this._getMailCount();},_cancelMailCountFetch:function(c){if(!c){this.mouseMoveHandle=b.one("window").on("mousemove",this._handleWindowFocus,this);this.keyPressHandle=b.one("window").on("keypress",this._handleWindowFocus,this);}if(this.mailCountTimer){this.mailCountTimer.cancel();}},_loadMailPreviewScript:function(h){if(h){h.preventDefault();}this.mailcount.get("parentNode").detach("yucs-mailcount|*");var i=h?h.currentTarget:this.mailcount.get("parentNode"),c=this.count,f=h&&h.type==="focus"?true:false,g=this,d=document.getElementById("yucs"),j=d&&d.getAttribute("data-property")==="mobile",k=j?b:ucs.YObj,l={onSuccess:b.bind(function(){k.use("ucs-mail-preview",function(e){g.mailPreview=new e.ucs.MailPreview({"mailLink":i,"mailCount":c});g.mailPreview._accessShowMenu();if(f){g.mailPreview._hideMenu();g.mailcount.get("parentNode").focus();}});},this)};if(b.one(".yucs-mail-preview-panel")){b.Get.script(a,l);}}};},"1.0",{requires:["node","event","jsonp","event-mouseenter","querystring-stringify"]});(function(){ucs.YObj.use("node","ucs-mailcount-v2",function(c){var a=c.one("#yucs").one("span.yucs-activate.yucs-mail-count"),b;if(a){if(a.getAttribute("data-authstate")!=="signedout"){b=new c.ucs.MailCount(a);}}});if(window.opener&&window.location.href.match(/ucs_mail_preview_popupsignin=1/)){window.opener.location=window.location;window.close();}})();YUI.add("ucs-helpmenu",function(d){d.namespace("ucs.HelpMenu");var u="ucs:helpMenuShow",g="ucs:helpDebugMenuShow",m="ucs:helpMenuItemClick",l="ucs:helpDebugMenuItemClick",s="yucs-help_button",a="ucs:utilityMenuShow",q="ucs:utilityMenuItemClick";var p='{separatorTop}<li class="{isDisabled} {isActive} {menuClass}"><div>'+'<a target="{target}" {actionData} href="{url}" {disabledAria}>'+"{icon}"+"{menuText}"+"</a></div></li>{separatorBottom}",x='{separatorTop}<li class="{isDisabled} {isActive} {menuClass}"><div>'+'<a href="#" data-customevt="true" {actionData} {disabledAria} {checkedAria}>'+"{icon}"+"{menuText}"+"</a></div></li>{separatorBottom}",o='<span class="yucs-separator" role="presentation"></span>',i="click",k="mouseover",v="focus",t="a",j="role",c="tabIndex",h="yucs-hide",b="iframe",n="ul",e="li",r="parentNode",w="http://l.yimg.com/a/lib/ush/icon.gif",f="https://s.yimg.com/lq/lib/ush/icon.gif";d.ucs.HelpMenu=function(y){this.menuContainer=y.ancestor("div");this.shown=false;this.helpLink=d.one("#yucs-help_button");this.helpLink.setAttribute("data-mad","true");this.previewPanel=d.one("#yucs-help_inner");this.ylt=this.previewPanel.getAttribute("data-yltmenushown");this.PANEL_OFFSET=30;this.PANEL_OFFSET_Y=3;this.headerNode=d.one("#yucs");d.ucs.HelpMenu.superclass.constructor.apply(this,[this.menuContainer,{panelSelector:"#yucs-help_inner"}]);this._initCustomEvents();y.removeClass("yucs-hm-activate");};d.extend(d.ucs.HelpMenu,d.ucs.MenuUtils,{_initCustomEvents:function(){this.publish(u,{broadcast:2,emitFacade:true});this.publish(g,{broadcast:2,emitFacade:true});this.publish(m,{broadcast:2,emitFacade:true});this.publish(l,{broadcast:2,emitFacade:true});this.publish(a,{broadcast:2,emitFacade:true});this.publish(q,{broadcast:2,emitFacade:true});d.Global.on("ucs:utilityMenuItems",this._handleHelpMenuItems,this,{"location":"top","menuType":"minty-utility-item"});d.Global.on("ucs:helpMenuItems",this._handleHelpMenuItems,this,{"location":"bottom","menuType":"minty-help-item"});d.Global.on("ucs:helpDebugMenuItems",this._handleHelpDebugMenuItems,this,{"location":"bottom","menuType":"minty-debug-item"});},_showMenu:function(y){if(this.previewPanel.hasClass("yucs-hide")){this._sendBeacon();}d.ucs.HelpMenu.superclass._showMenu.apply(this,arguments);if(d.one("#yucs").getAttribute("data-property")==="mail"){this.menu.all("li").addClass("yucs-hide");}if(y&&(y.ctrlKey||y.metaKey)&&y.shiftKey){this.fire(g);if(this.shown===false){d.later(4000,this,function(){this.fire(g);});}else{this._showDebugMenuItems();}}else{this.fire(u);this.fire(a);if(this.shown===false){d.later(4000,this,function(){this.fire(u);this.fire(a);});}else{this._showMenuItems();}}this._setPosition();},_showDebugMenuItems:function(){this.shown=true;this.menu.all("li").addClass("yucs-hide");this.menu.all("span.minty-item").setStyle("display","none");this.menu.all("li.debug-item").removeClass("yucs-hide");this.menu.all("span.debug-item").setStyle("display","block");},_showMenuItems:function(){this.shown=true;this.menu.all("li").removeClass("yucs-hide");this.menu.all("span.minty-item").setStyle("display","block");this.menu.all("li.debug-item").addClass("yucs-hide");this.menu.all("span.debug-item").setStyle("display","none");this._destructAria();this._initAria();},_setPosition:function(){if(true){this.mailIcon=d.one("#yucs-help_button");var B=this.previewPanel.one(".yucs-dock"),z=B&&B.get("offsetWidth"),A,y=this.headerNode.get("offsetHeight");if(this.rtl){this.previewPanel.setX(Math.round(this.headerNode.getX()+this.PANEL_OFFSET));}else{this.previewPanel.setX(Math.round(this.headerNode.getX()+this.headerNode.get("offsetWidth")-this.panel.get("offsetWidth")-2));}if(d.one("#search_hot_keyword_block")){this.panel.setY((this.headerNode.getY()+y)-this.PANEL_OFFSET_Y-30);}else{if(y>0){this.panel.setY((this.headerNode.getY()+y)-this.PANEL_OFFSET_Y);}else{this.panel.setY(this.mailIcon.getY()+this.mailIcon.get("offsetHeight")+3);}}if(B){A=(this.mailIcon.get("offsetWidth")/2)-(z/2);B.setX(this.mailIcon.getX()+A);}}},_handleKeyup:function(y){if(27===y.keyCode||9===y.keyCode){this.menu.one("a").focus();this._hideMenu();}else{if(40===y.keyCode&&!this.keyedup){if(this.panel.one("a")){this._showMenu(y);this.panel.one("a").focus();}this.keyedup=true;}}},_handleHelpMenuItems:function(D,C){var z=C&&C.location||"top",B=C&&C.menuType||"minty-help-item",A,y;if(!D.menuGroups||!D.menuGroups.length){return;}A=D.menuGroups;y=this.menu.one("#yuhead-help-panel");if(D.reset&&y){y.all("."+B).remove(true);}this._addMenuGroups(A,z,false,B);this._showMenuItems();},_handleHelpDebugMenuItems:function(z){var y;if(!z.menuGroups||!z.menuGroups.length){return;}y=z.menuGroups;itemList=this.menu.one("#yuhead-help-panel");if(z.reset&&itemList){itemList.all(".minty-debug-item").remove(true);}this._addMenuGroups(y,"top",true,"minty-debug-item");this._showDebugMenuItems();},_handleMenuItemClick:function(E){var D,A,y,z;D=E.target;D=D.ancestor("a",true);A=D.getAttribute("data-mad");y=D.getAttribute("data-customevt");z=D.ancestor("li").hasClass("disabled");if(z){E.halt();return;}if(y){E.preventDefault();}if(!z){var C={actionData:A};var B=D.ancestor("li");if(B.hasClass("debug-item")){this.fire(l,C);}else{if(B.hasClass("minty-utility-item")){this.fire(q,C);}else{this.fire(m,C);}}}},_addMenuGroups:function(B,H,F,G){var D=this.menu.one("#yuhead-help-panel"),y="",z,C=B.length,A,E;z=D.hasChildNodes();for(A=0;A<C;A++){E=B[A].length;if(H==="bottom"){if(A>0){B[A][0].separatorTop=true;}}else{if(A<(C-1)||z){B[A][E-1].separatorBottom=true;}}y+=this._addMenuGroup(B[A],F,G);}if(D.ancestor("div.yucs-yql_loading")){D.ancestor("div.yucs-yql_loading").removeClass("yucs-yql_loading");}if(H==="bottom"){D.append(y);}else{D.prepend(y);}if(D.one(".yucs-keepatbottom")){D.all(".yucs-keepatbottom").each(function(I){D.append(I);});}},_addMenuGroup:function(z,C,B){var D="",y=z.length,A;for(A=0;A<y;A++){if(C){z[A].isDebugItem=true;z[A].menuClass=B+" debug-item";}else{z[A].isDebugItem=false;z[A].menuClass=B+" minty-item";
}D+=this._addMenuItem(z[A],B);}return D;},_addMenuItem:function(A,z){var y="";if(A.isActive){A.checkedAria='aria-checked="true"';}else{A.checkedAria="";}if(A.isDisabled){A.disabledAria='aria-disabled="true"';}else{A.disabledAria="";}switch(A.actionType){case"link":y=d.substitute(p,A,this._processTemplateValue);break;case"customEvent":y=d.substitute(x,A,this._processTemplateValue);break;default:break;}if(y){if(A.isDebugItem){y=y.replace(/separator/,"separator debug-item "+z);}else{y=y.replace(/separator/,"separator minty-item "+z);}}return y;},_processTemplateValue:function(z,A,B){var C="";var y=(document.location.protocol==="https:")?f:w;switch(z){case"icon":if(A!==undefined){if(A==="available"){C='<img src="'+y+'" class="yucs-opi available"/>';}else{if(A==="offline"){C='<img src="'+y+'" class="yucs-opi offline"/>';}else{if(A==="invisible"){C='<img src="'+y+'" class="yucs-opi invisible"/>';}else{if(A==="busy"){C='<img src="'+y+'" class="yucs-opi busy"/>';}else{if(A==="idle"){C='<img src="'+y+'" class="yucs-opi idle"/>';}else{C='<img src="'+A+'" />';}}}}}}break;case"separatorTop":if(A){C=o;}break;case"separatorBottom":if(A){C=o;}break;case"actionData":if(A){C='data-mad="'+A+'"';}break;case"isDisabled":if(A){C="disabled";}break;case"isActive":if(A){C="sp active";}break;case"checkedAria":C=A;break;default:C=A;break;}return C;},_sendBeacon:function(){if(this.ylt){window.ucs._sendBeacon(this.ylt+"?t="+Math.random());}}});d.augment(d.ucs.HelpMenu,d.EventTarget);},"1.0",{requires:["oop","node","event-custom","substitute","ucs-menu-utils"]});(function(){ucs.YObj.use("node","ucs-helpmenu",function(c){var b=c.one("#yucs").all(".yucs-hm-activate"),a;b.each(function(d){a=new c.ucs.HelpMenu(d);});});})();YUI.add("input-mask",function(g){var e,d,b,a={srcNode:".phone-number-input",mask:"+1(   )   -    ",maskLetter:" "},c=function(i){var j,h;if(i.get("selectionStart")!==undefined){j=i.get("selectionStart");h=i.get("selectionEnd");}else{if(document.selection){i.focus();d=document.selection.createRange();j=-d.duplicate().moveStart("character",-i.get("value").length);h=j+d.text.length;}}return{start:j,end:h};},f=function(h,i){e=h.getDOMNode();if(e.setSelectionRange){e.focus();e.setSelectionRange(i.start,i.end);}else{if(e.createTextRange){b=e.createTextRange();b.collapse(true);b.moveEnd("character",i.end);b.moveStart("character",i.start);b.select();}}};g.InputMask=function(k){this.config={};this.config.srcNode=k.srcNode||a.srcNode;this.mask=k.mask||a.mask;this.maskLetter=k.maskLetter||a.maskLetter;this.firstMaskPos=this.mask.indexOf(this.maskLetter);this.lastMaskPos=this.mask.lastIndexOf(this.maskLetter)+1;this.notInputPos=[];this.maskPhoneLength=this.mask.match(new RegExp(this.maskLetter,"g")).length;this.input=g.one(this.config.srcNode);var h=this.mask,i=h.search(new RegExp("[^"+this.maskLetter+"]")),j=0;while(i>-1){this.notInputPos.push(i+j);j+=i+1;h=h.substr(i+1);i=h.search(new RegExp("[^"+this.maskLetter+"]"));}};g.InputMask.prototype={setCaret:function(j){var h=this.input,i=h.get("value");if(!(i.charAt(j.end)>="0"&&i.charAt(j.end)<="9")&&i.charAt(j.end)!==this.maskLetter&&j.end<this.mask.length||j.start<this.firstMaskPos){if(j.start===j.end){this.setCaret({start:j.start+1,end:j.end+1});}else{this.setCaret({start:j.start,end:j.end+1});}return;}f(h,j);},getCaret:function(){return c(this.input);},caretLeft:function(i,k){var j=k.start,h=k.end;if(h<=this.firstMaskPos){k={start:this.firstMaskPos,end:this.firstMaskPos};}else{if(j<=this.firstMaskPos&&h>this.firstMaskPos){k={start:this.firstMaskPos,end:this.firstMaskPos};}else{if(i.charAt(j-1)===")"||i.charAt(j-1)==="-"){k={start:j-2,end:j-2};}else{k={start:j-1,end:j-1};}}}this.setCaret(k);return k;},setValue:function(n,o){var m,l,h,k=n.substr(this.firstMaskPos).replace(new RegExp("[^0-9"+this.maskLetter+" ]","g"),"");while(k.length<this.maskPhoneLength+1){k=k.concat(this.maskLetter);}k=k.substr(0,this.maskPhoneLength);m=this.mask;for(l=0,h=0;l<m.length;++l){if(m.charAt(l)===this.maskLetter){m=m.substring(0,l)+k.charAt(h)+m.substr(l+1);h++;}}this.input.set("value",m);this.setCaret(o);},getPhoneNumberOnly:function(){var h=this.input.get("value");return h.replace(/[^0-9]/g,"");},render:function(){var h=this,j=this.input,i={onFocus:function(k){if(!j.get("value")){h.setValue(h.mask,{start:h.firstMaskPos,end:h.firstMaskPos});}},onPaste:function(l){var p=j.get("value"),q=h.getCaret(),o=p.substr(h.firstMaskPos).replace(/[^0-9]/g,""),k=o.length,n,m=0;for(n=0;n<h.notInputPos.length;++n){if(h.notInputPos[n]>h.firstMaskPos&&h.notInputPos[n]-h.firstMaskPos<k+m){m++;}}q.start=k+m+h.firstMaskPos;q.end=q.start;h.setValue(p,q);},afterClick:function(k){var l=j.get("value");if(!l||l===h.mask){h.setCaret({start:h.firstMaskPos,end:h.firstMaskPos});}},onKeyDown:function(l){var o="",r=h.getCaret(),q=r.start,k=r.end,p=j.get("value"),n=l.keyCode,m=String.fromCharCode(n);if(l.keyCode==9){return;}l.preventDefault();if(n===8||n===46){r=h.caretLeft(p,r);o=p.substring(0,r.start)+p.substr(r.start+1);h.setValue(o,r);}else{if(n===37){if(l.shiftKey&&q>h.firstMaskPos){h.setCaret({start:q-1,end:k});}else{if(l.metaKey){h.setCaret({start:h.firstMaskPos,end:h.firstMaskPos});}else{if(q>h.firstMaskPos){h.caretLeft(p,{start:q,end:q});}else{h.setCaret({start:h.firstMaskPos,end:h.firstMaskPos});}}}}else{if(n===39){if(l.shiftKey){h.setCaret({start:r.start,end:r.end+1});}else{if(l.metaKey){h.setCaret({start:h.lastMaskPos,end:h.lastMaskPos});}else{if(k<h.lastMaskPos){h.setCaret({start:k+1,end:k+1});}else{h.setCaret({start:h.lastMaskPos,end:h.lastMaskPos});}}}}}}},onKeyPress:function(m){var o="",r=h.getCaret(),q=r.start,l=r.end,p=j.get("value"),k=m.charCode||m.keyCode,n=String.fromCharCode(k);if(m.altKey||m.ctrlKey||m.metaKey){return;}m.preventDefault();if(k>=48&&k<=57){o=p.substring(0,q)+n+p.substr(l);h.setValue(o,{start:q+1,end:q+1});}}};if(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)){return;}else{j.on("valuechange",i.onValueChange);j.on("keydown",i.onKeyDown);j.on("keyup",i.onKeyPress);j.on("focus",i.onFocus);j.on("pasted",i.onPaste);j.after("click",i.afterClick);}}};},"0.0.1",{requires:["event-valuechange","event-base-ie","gallery-event-pasted","event-focus"]});if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}if(typeof YAHOO.UCS=="undefined"||!YAHOO.UCS){YAHOO.UCS={};}YAHOO.UCS.Get_The_App_Promo=(function(){var U=null,B=null,W=null,Y=null,H=null,l=null,o=null,X=null,G=null,I=null,p=null,v=null,E=null,z=null,O=null,w=null,i=null,e=null,s=null,A=null,F=null,N=583,c=709,n=false,V="",D="",C=false,S=false,Z=navigator.appName=="Microsoft Internet Explorer",t=function(ac){var aa=0,ab=ac.style;if(Z){aa=parseFloat(ab.filter.substring(14))/100;}else{aa=parseFloat(ab.opacity);}return aa;},R=function(ac,aa){var ab=ac.style;if(Z){ab.opacity=aa;ab.filter="alpha(opacity="+aa*100+")";}else{ab.opacity=aa;}},g=function(){var ab=document,aa=ab.body,ac=ab.documentElement;return Math.max(Math.max(aa.scrollHeight,ac.scrollHeight),Math.max(aa.offsetHeight,ac.offsetHeight),Math.max(aa.clientHeight,ac.clientHeight));},J=function(){var aa=460;if(document.body&&document.body.offsetWidth){aa=document.body.offsetHeight;}if(document.compatMode=="CSS1Compat"&&document.documentElement&&document.documentElement.offsetWidth){aa=document.documentElement.offsetHeight;}if(window.innerWidth&&window.innerHeight){aa=window.innerHeight;}return aa;},T=function(){var ab=document,aa=ab.body,ac=ab.documentElement;return Math.max(Math.max(aa.scrollWidth,ac.scrollWidth),Math.max(aa.offsetWidth,ac.offsetWidth),Math.max(aa.clientWidth,ac.clientWidth));},a=function(ab,ac){var aa=RegExp("[?&]"+ab+"=([^&#]*)");var ad=RegExp("[?&]"+ac+"=([^&#]*)");if(window.location.href.match(aa)&&window.location.href.match(ad)){V=window.location.href.match(aa)[1];D=window.location.href.match(ad)[1];return true;}return false;},h=function(ab,ac,aa){if(ab.attachEvent){ab.attachEvent("on"+ac,aa);}else{ab.addEventListener(ac,aa,false);}},r=(function(){var ac=document.createElement("div"),ab=["O","Moz","Webkit","ms"],aa=ab.length;while(aa--){if(ab[aa]+"Transition" in ac.style){z=ab[aa];return true;}}return false;}()),u=function(ab){var aa=ab.style;if(Z){aa.filter="alpha(opacity=0)";}else{aa.opacity=0;}},f=function(){U.style.display="none";I.style.display="none";B.style.display="none";d();},y=function(){C=true;U.className="uh-dmos-overlay";B.style.height=0+"px";if(O!==null){O.style.display="none";}if(r){Y.className="uh-dmos-msgbox uh-dmos-hide-anim";}else{e=setInterval(function(){var aa=t(Y)-0.1;R(Y,aa);if(t(Y).toFixed(1)<=0){clearInterval(e);f();}},56);}document.getElementById("uh-dmos-imagebg").style.display="block";document.getElementById("uh-dmos-bd").style.display="block";document.getElementById("uh-dmos-success-message").style.display="none";document.getElementById("input-id-phoneNumber").value="";document.getElementById("phone-prompt").style.display="none";document.getElementById("uh-dmos-text-disclaimer").style.display="block";document.getElementById("phone-or-email-prompt").style.display="none";},m=function(){if(typeof YMedia!=="undefined"&&YMedia.rapid&&YMedia.rapid.beaconClick){if(n){YMedia.rapid.beaconClick("signup","close","",{t1:"a3",t2:"signup",t3:"close",t4:V,t5:D,elm:"btn",itc:1,cat:"gtaa"});}else{YMedia.rapid.beaconClick("signup","close","",{t1:"a3",t2:"signup",t3:"close",elm:"btn",itc:1,cat:"gtaa"});}}y();},x=function(){if(typeof YMedia!=="undefined"&&YMedia.rapid&&YMedia.rapid.beaconClick){if(n){YMedia.rapid.beaconClick("signup","close","",{t1:"a3",t2:"signup",t3:"sbmt",t4:V,t5:D,elm:"btn",itc:1,cat:"gtaa"});}else{YMedia.rapid.beaconClick("signup","close","",{t1:"a3",t2:"signup",t3:"sbmt",elm:"btn",itc:1,cat:"gtaa"});}}y();},P=function(aa,ab){return aa.className&&new RegExp("(^|\\s)"+ab+"(\\s|$)").test(aa.className);},q=function(){h(H,"click",m);if(X){h(X,"click",x);}Y.className="uh-dmos-msgbox";W.className="uh-dmos-show";j();if(r){Y.className="uh-dmos-msgbox uh-dmos-msgbox-show-anim";}else{u(Y);i=setInterval(function(){var aa=t(Y)+0.1;R(Y,aa);if(aa>=1){clearInterval(i);}},56);}},K=function(){U.style.display="block";I.style.display="block";B.style.display="block";B.style.height=J()+"px";U.style.height=g()+"px";U.style.left=0+"px";U.style.top=0+"px";U.style.bottom=0+"px";U.style.visibility="visible";if(r){Y.className="uh-dmos-msgbox";U.className="uh-dmos-overlay uh-dmos-overlay-show-anim";}else{u(U);w=setInterval(function(){var aa=t(U)+0.2;R(U,aa);if(aa>=0.8){q();clearInterval(w);}},56);}},k=function(ab){var aa=new Image();aa.height=0;aa.width=0;aa.src="https://geo.yahoo.com/t"+ab;},L=function(){var ab=document.getElementById("input-id-phoneNumber").value,aa=/^(\+1| )?\(?\d{3}\)? ?? ?\d{3} ?\-? ?\d{4}$/;if(aa.test(ab)){return 1;}else{if(!aa.test(ab)&&ab==="+1(   )   -    "){return false;}else{if(!aa.test(ab)&&ab!==""){return -2;}else{return false;}}}},M=function(){if(C){d();f();}C=false;},b=function(){var aa={"O":"oTransitionEnd","Moz":"transitionend","Webkit":"webkitTransitionEnd","ms":"transitionend"};d();S=aa[z];if(window.addEventListener){U.addEventListener(S,q,false);Y.addEventListener(S,M,false);}},d=function(){if(window.addEventListener){U.removeEventListener(S,q,false);Y.removeEventListener(S,M,false);}},j=function(){B.style.height=J()+"px";U.style.height=g()+"px";I.style.left="50%";I.style.marginLeft=-I.offsetWidth/2+"px";},Q=function(){B=document.getElementById("uh-dmos-wrapper");U=document.getElementById("uh-dmos-overlay");W=document.getElementById("uh-dmos-container");Y=document.getElementById("uh-dmos-msgbox");H=document.getElementById("uh-dmos-msgbox-close-btn");o=document.getElementById("input-id-phoneNumber");I=document.getElementById("uh-dmos-container");G=document.getElementById("uh-dmos-subscribe");X=document.getElementById("uh-dmos-successBtn");};return{_enableSubscribe:function(aa){var ac=document.getElementById("input-id-phoneNumber").value.replace(/\D/g,""),ab="sbmt";if(aa===1){document.getElementById("uh-dmos-imagebg").style.display="none";document.getElementById("uh-dmos-bd").style.display="none";document.getElementById("uh-dmos-success-message").style.display="block";if(typeof YMedia!=="undefined"&&YMedia.rapid&&YMedia.rapid.beaconClick){if(ac!==""){ab+=" p-y";}else{ab+=" p-n";
}if(n){YMedia.rapid.beaconClick("signup",ab,"",{t1:"a3",t2:"signup",t3:"sbmt",t4:V,t5:D,elm:"btn",itc:1,cat:"gtaa"},"sbmt");}else{YMedia.rapid.beaconClick("signup",ab,"",{t1:"a3",t2:"signup",t3:"sbmt",elm:"btn",itc:1,cat:"gtaa"},"sbmt");}}if(typeof YMedia!=="undefined"&&YMedia.rapid&&YMedia.rapid.beaconEvent){if(n){YMedia.rapid.beaconEvent("secvw",{t1:"a3",t2:"signup",t3:"confirm",t4:V,t5:D,sec:"signup",slk:"cnfrm-pop",cat:"gtaa"});}else{YMedia.rapid.beaconEvent("secvw",{t1:"a3",t2:"signup",t3:"confirm",sec:"signup",slk:"cnfrm-pop",cat:"gtaa"});}}return true;}else{if(aa===-1){document.getElementById("phone-prompt").style.display="none";document.getElementById("uh-dmos-text-disclaimer").style.display="block";document.getElementById("phone-or-email-prompt").style.display="none";}else{if(aa===-2){document.getElementById("phone-prompt").style.display="block";document.getElementById("uh-dmos-text-disclaimer").style.display="block";document.getElementById("phone-or-email-prompt").style.display="none";}else{document.getElementById("phone-prompt").style.display="none";document.getElementById("uh-dmos-text-disclaimer").style.display="block";document.getElementById("phone-or-email-prompt").style.display="block";}}}return false;},enableSubscribe:function(){var aa=L();this._enableSubscribe(aa);},checkFields:function(){var aa=L();if(aa==1){return true;}this._enableSubscribe(aa);return false;},submitForm:function(ab){var ac,aa;if(YAHOO.UCS.Get_The_App_Promo.checkFields()){ac=document.getElementById("input-id-phoneNumber").value.replace(/\D/g,"");window.ucs.YObj.use("jsonp","node",function(ae){var ad="https://ucs.netsvs.yahoo.com/json/gtaa/index.php?phoneNumber="+encodeURIComponent(ac)+"&wssid="+encodeURIComponent(ae.one("#uh-dmos-subscribe").getAttribute("data-crumb"))+"&appid="+encodeURIComponent(p)+"&button_revision="+encodeURIComponent(v)+"&modal_revision="+encodeURIComponent(E)+"&format=json&callback={callback}";ae.jsonp(ad,{on:{success:function(af){if(af&&af.result){YAHOO.UCS.Get_The_App_Promo._enableSubscribe(af.result);}},failure:function(af){}}});});}},displayModalPopup:function(){if(typeof YMedia!=="undefined"&&YMedia.rapid&&YMedia.rapid.beaconEvent){if(n){YMedia.rapid.beaconEvent("secvw",{t1:"a3",t2:"signup",t3:"signup",t4:V,t5:D,sec:"signup",slk:"signup-pop",cat:"gtaa"});}else{YMedia.rapid.beaconEvent("secvw",{t1:"a3",t2:"signup",t3:"signup",sec:"signup",slk:"signup-pop",cat:"gtaa"});}}if(B===null){Q();if(!window.ucs){window.ucs={};}if(!window.ucs.YObj){if(document.getElementById("yUnivHead")&&document.getElementById("yUnivHead").getAttribute("data-property")){window.ucs.YObj=(function(){var aa=document.getElementById("yUnivHead");return(typeof window.Y!=="undefined"&&(aa&&aa.getAttribute("data-property")==="srp"))?window.Y:YUI();})();}}window.ucs.YObj.use("node","event","input-mask","base-ie","gallery-event-pasted","jsonp","json-parse",function(ab){var aa=new ab.InputMask({srcNode:null,mask:null});aa.render();ab.on("click",YAHOO.UCS.Get_The_App_Promo.submitForm,"#uh-dmos-subscribe");ab.on("keyup",function(af){var ac=YAHOO.UCS.Get_The_App_Promo,ae=af.target.get("id"),ad=(ae==="input-id-phoneNumber"||ae==="uh-dmos-subscribe");if(af.keyCode===13&&ad){ac.submitForm(af);}},".uh-dmos-msgbox-canvas");});}b();K();h(window,"resize",j);},init:function(){var ad=window.addEventListener?"addEventListener":"attachEvent";var ac=window[ad];var ab=ad=="attachEvent"?"onmessage":"message";if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var aa=new Number(RegExp.$1);if(aa===8){ac=document["attachEvent"];}}ac(ab,function(ai){if(ai.data){var ah=ai.data.split(","),ag=ah[0].split(":");if(ag[0]==="appid"){var aj=document.getElementById("yucs"),ae=ah[2].split(":"),af=ah[3].split(":");p=ag[1];v=ae[1];E=af[1];aj.className=aj.className+" "+p;if(a(v,E)){n=true;}YAHOO.UCS.Get_The_App_Promo.displayModalPopup();}}},false);}};})();YAHOO.UCS.Get_The_App_Promo.init();if(!window.ucs){window.ucs={};}window.ucs.api=window.ucs.api||{};YUI.add("ucs-uh_locdrop",function(b){b.namespace("ucs");b.ucs.uh_locdrop=function a(k,m,j){var f=k,h=m,e="locdrop.query.yahoo.com/v1/public/yql",d={env:""},g={proto:"https",base:"://"+e+"?"},c=function(q){var o=q.query.results.locdrop,n=o.status.code,p=(n==="OK")?"":o.status.message;if(j){j("write complete: "+n+" ("+p+")");}},i=function(n){if(j){j("locdropSuccess called");}var o='insert into user.location.public(type, lat, lon, radius, version, crumb, app) values ("current", "'+Math.round(n.coords.latitude*1000000)/1000000+'", "'+Math.round(n.coords.longitude*1000000)/1000000+'", "'+n.coords.accuracy+'", "v4", "'+h+'", "'+f+'")';if(j){j("YQL called: "+o);}var p=new b.YQLRequest(o,c,d,g);p.send();},l=function(n){if(j){j("locdropFail called: "+n.message);}};b.ucs.inject_getlocation(i,l);};b.ucs.inject_getlocation=function(e,c){var d=window.navigator.geolocation.getCurrentPosition;if(typeof d==="function"){window.navigator.geolocation.getCurrentPosition=function(h,f,g){if(!arguments.length){d.call(window.navigator.geolocation);}else{if(!h||!h.call){d.call(window.navigator.geolocation,h);}else{d.call(window.navigator.geolocation,function(i){e.call(null,i);h.call(null,i);},function(i){c.call(null,i);if(f){f.call(null,i);}},g);}}};return true;}return false;};},"1.0",{requires:["yql"]});(function(){ucs.YObj.use("node","ucs-uh_locdrop",function(d){var c=d.one("#yucs-location-js.yucs-location-activate");if(c){c.removeClass("yucs-location-activate");var a=c.getAttribute("data-crumb"),b=c.getAttribute("data-appid");if(window.navigator&&window.navigator.geolocation&&document.getElementById("location-crumb")){d.ucs.uh_locdrop(b,document.getElementById("location-crumb").value);}}});}());