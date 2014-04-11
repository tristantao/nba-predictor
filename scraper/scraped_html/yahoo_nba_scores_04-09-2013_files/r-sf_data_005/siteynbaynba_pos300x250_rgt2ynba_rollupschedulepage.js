document.write('');
var swf_click = "http://ads.cnn.com/event.ng/Type=click&FlightID=593808&AdID=806713&TargetID=178688&Segments=DECBHHicHZDLEQAxCEIb8hA_KPbf2OJe3jBIIkkGYeVZ5iRH3Fc_pbd8RQwscjYtOnct9nTG1FomEZbTHlYvkFbdW-JsGCrgIncMPUWRT36vwzAeIv2mS3_HedZAwbrTXSxt7G7lWw1pOqo-vVpv8zLWxt_QRmWlGx3itZrxcrEpn6Mmw03YrDNNPZTh0x3GoLe4eoWo5sx3voijn04okwDFyZ_9RPblV23FzZ9lrMej6y2sCE0rU8mq0Klqnu696ag_i3dDbZyzdY6-_jjy8Ubb4SUHcVME9tjxAd8rW0g.&Values=DECBHHicHY7LFQAxCAIb8iB-sf_GluxlIDwNDmzXWAZ3Q7sd1m7lg23YlCPaqp4LjCwDaXWNEi_bOmJS5I31eFPkhvW690_lm6V8a2FNZeK6Zu5IGzhPfP-oJXoNOZHUTXmlVzP5y6kWfd7xpEsLqoSuG8zgCZ0fIX0q6A..&RawValues=NGUSERID%252Caa5226c-8078-2135517373-1384763605%252CTID%252C1397106391057861%252CTIL%252C1397106391057861&Redirect=http://clk.atdmt.com/CNT/go/473369256/direct;wi.1;hi.1/01/";
var dcswf_click = escape(swf_click);

var ShockMode = 0;
var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
if (plugin && parseInt(plugin.description.substring(plugin.description.indexOf(".")-2)) >= 9) 
{
ShockMode = 1;
}
else if (navigator.userAgent && navigator.userAgent.indexOf("MSIE")>=0 
&& (navigator.userAgent.indexOf("Windows 95")>=0 || navigator.userAgent.indexOf("Windows 98")>=0 || navigator.userAgent.indexOf("Windows NT")>=0)) {
document.write('<SCRIPT LANGUAGE=VBScript\> \n');
document.write('on error resume next \n');

document.write('ShockMode = (IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.9")))\n');

document.write('<\/SCRIPT\> \n');
}
if ( ShockMode ) {
document.write('<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"');
document.write(' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"');
document.write(' ID=flashad WIDTH=300 HEIGHT=250>');
document.write(' <PARAM NAME=movie VALUE="http://i.cdn.turner.com/ttn/ttn_adspaces/TBS/2014/04/03/190811479conan360_300x250.swf"> '); 
document.write(' <PARAM NAME=FlashVars VALUE="clickTag='+dcswf_click+'"> '); 
document.write(' <PARAM NAME=quality VALUE=autohigh> ');
document.write(' <PARAM NAME=allowScriptAccess VALUE=always> '); 

document.write(' <param name=wmode value=opaque> ');

document.write(' <EMBED SRC="http://i.cdn.turner.com/ttn/ttn_adspaces/TBS/2014/04/03/190811479conan360_300x250.swf" FlashVars="clickTag='+dcswf_click+'" QUALITY=autohigh allowScriptAccess=always'); 
document.write(' NAME=flashad swLiveConnect=TRUE WIDTH=300 HEIGHT=250 wmode=opaque');


document.write(' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">');
document.write('</EMBED>');
document.write('</OBJECT>');
} else if (!(navigator.appName && navigator.appName.indexOf("Netscape")>=0 && navigator.appVersion.indexOf("2.")>=0)){
document.write('<A HREF="http://ads.cnn.com/event.ng/Type=click&FlightID=593808&AdID=806713&TargetID=178688&Segments=DECBHHicHZDLEQAxCEIb8hA_KPbf2OJe3jBIIkkGYeVZ5iRH3Fc_pbd8RQwscjYtOnct9nTG1FomEZbTHlYvkFbdW-JsGCrgIncMPUWRT36vwzAeIv2mS3_HedZAwbrTXSxt7G7lWw1pOqo-vVpv8zLWxt_QRmWlGx3itZrxcrEpn6Mmw03YrDNNPZTh0x3GoLe4eoWo5sx3voijn04okwDFyZ_9RPblV23FzZ9lrMej6y2sCE0rU8mq0Klqnu696ag_i3dDbZyzdY6-_jjy8Ubb4SUHcVME9tjxAd8rW0g.&Targets=DECBHHicJU7LFQQxCGooB_GH9t_YyuwlPMAA6EjYAzzNH3rS4uEe48NMdj9weuZgaXjYGJy4GMu7rOZ977KU51OXQmOdR6-4lG3KG9aYgLUHmfjCslOix9XOmrZcndhix5WJVF8VU2xdUJz6mMI2IiUGNX4rRmLh21mkxE6r_xZl9mb8AJv8MjI.&Values=DECBHHicHY7LFQAxCAIb8iB-sf_GluxlIDwNDmzXWAZ3Q7sd1m7lg23YlCPaqp4LjCwDaXWNEi_bOmJS5I31eFPkhvW690_lm6V8a2FNZeK6Zu5IGzhPfP-oJXoNOZHUTXmlVzP5y6kWfd7xpEsLqoSuG8zgCZ0fIX0q6A..&RawValues=NGUSERID%252Caa5226c-8078-2135517373-1384763605%252CTID%252C1397106391057861%252CTIL%252C1397106391057861&Redirect=http://clk.atdmt.com/CNT/go/473369256/direct;wi.1;hi.1/01/" target="_blank"><IMG SRC="http://i.cdn.turner.com/ttn/ttn_adspaces/TBS/2014/04/03/480811551conan360_300x250.jpg" WIDTH=300 HEIGHT=250 BORDER=0></A>');
}

document.write('<NOEMBED>\n<A HREF=\"http://ads.cnn.com/event.ng/Type=click&FlightID=593808&AdID=806713&TargetID=178688&Segments=DECBHHicHZDLEQAxCEIb8hA_KPbf2OJe3jBIIkkGYeVZ5iRH3Fc_pbd8RQwscjYtOnct9nTG1FomEZbTHlYvkFbdW-JsGCrgIncMPUWRT36vwzAeIv2mS3_HedZAwbrTXSxt7G7lWw1pOqo-vVpv8zLWxt_QRmWlGx3itZrxcrEpn6Mmw03YrDNNPZTh0x3GoLe4eoWo5sx3voijn04okwDFyZ_9RPblV23FzZ9lrMej6y2sCE0rU8mq0Klqnu696ag_i3dDbZyzdY6-_jjy8Ubb4SUHcVME9tjxAd8rW0g.&Targets=DECBHHicJU7LFQQxCGooB_GH9t_YyuwlPMAA6EjYAzzNH3rS4uEe48NMdj9weuZgaXjYGJy4GMu7rOZ977KU51OXQmOdR6-4lG3KG9aYgLUHmfjCslOix9XOmrZcndhix5WJVF8VU2xdUJz6mMI2IiUGNX4rRmLh21mkxE6r_xZl9mb8AJv8MjI.&Values=DECBHHicHY7LFQAxCAIb8iB-sf_GluxlIDwNDmzXWAZ3Q7sd1m7lg23YlCPaqp4LjCwDaXWNEi_bOmJS5I31eFPkhvW690_lm6V8a2FNZeK6Zu5IGzhPfP-oJXoNOZHUTXmlVzP5y6kWfd7xpEsLqoSuG8zgCZ0fIX0q6A..&RawValues=NGUSERID%252Caa5226c-8078-2135517373-1384763605%252CTID%252C1397106391057861%252CTIL%252C1397106391057861&Redirect=http://clk.atdmt.com/CNT/go/473369256/direct;wi.1;hi.1/01/\" target=\"_blank\"><IMG SRC=\"http://i.cdn.turner.com/ttn/ttn_adspaces/TBS/2014/04/03/480811551conan360_300x250.jpg\" WIDTH=300 HEIGHT=250 BORDER=0></A>\n</NOEMBED>\n<IMG SRC=\"http://view.atdmt.com/CNT/view/473369256/direct;wi.1;hi.1/01/bIgspxx,bjumjwyidtrc\" BORDER=0 WIDTH=1 HEIGHT=1>\n<div style=\"position:absolute;visibility:hidden;\"><img src=\"http://ads.nba.com:80/event.ng/Type=count&ClientType=2&ASeg=&AMod=&AOpt=0&AdID=806713&FlightID=593808&TargetID=178688&SiteID=57348&EntityDefResetFlag=0&Segments=DECBHHicHZDLEQAxCEIb8hA_KPbf2OJe3jBIIkkGYeVZ5iRH3Fc_pbd8RQwscjYtOnct9nTG1FomEZbTHlYvkFbdW-JsGCrgIncMPUWRT36vwzAeIv2mS3_HedZAwbrTXSxt7G7lWw1pOqo-vVpv8zLWxt_QRmWlGx3itZrxcrEpn6Mmw03YrDNNPZTh0x3GoLe4eoWo5sx3voijn04okwDFyZ_9RPblV23FzZ9lrMej6y2sCE0rU8mq0Klqnu696ag_i3dDbZyzdY6-_jjy8Ubb4SUHcVME9tjxAd8rW0g.&Targets=DECBHHicJU7LFQQxCGooB_GH9t_YyuwlPMAA6EjYAzzNH3rS4uEe48NMdj9weuZgaXjYGJy4GMu7rOZ977KU51OXQmOdR6-4lG3KG9aYgLUHmfjCslOix9XOmrZcndhix5WJVF8VU2xdUJz6mMI2IiUGNX4rRmLh21mkxE6r_xZl9mb8AJv8MjI.&Values=DECBHHicHY7LFQAxCAIb8iB-sf_GluxlIDwNDmzXWAZ3Q7sd1m7lg23YlCPaqp4LjCwDaXWNEi_bOmJS5I31eFPkhvW690_lm6V8a2FNZeK6Zu5IGzhPfP-oJXoNOZHUTXmlVzP5y6kWfd7xpEsLqoSuG8zgCZ0fIX0q6A..&RawValues=NGUSERID%252Caa5226c-8078-2135517373-1384763605%252CTID%252C1397106391057861%252CTIL%252C1397106391057861&random=bIgspxx,bjumjwyidtrc&Params.tag.transactionid=1397106391057861&Params.User.UserID=aa5226c-8078-2135517373-1384763605\" width=\"1\" height=\"1\" border=\"0\" /></div>');