/**
 * Copyright (C) 2013 by Sarah Becker (becsarb@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($){
    // The Classic URI parser
    // Probably like everybody else on the Internet, I took it from
    // parseUri 1.2.2 at http://blog.stevenlevithan.com/archives/parseuri

    function parseUri (str) {
        var	o   = parseUri.options,
            m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            uri = {},
            i   = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    }

    parseUri.options = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
            name:   "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };



    var browserType = $.browser;



    var getHref = function() {
        return this.href || this.data ( "href" ) || this.attr ( "href" ) || this.attr ( "src" ) || "";
    };




    // getURLobj:  returns the URL string converted into an object

    var getURLobj = function (url) {
        /* Is the URL a string? */

        if (typeof url == "string")
            return parseUri(url);

        return url;
    };



    var getFragmentString = function(url) {
        return getURLobj(url).fragment;
    };




    // getQueryStr:  returns the Query string for a URL
    //      Parameters:  url

    var getQueryStr = function (url) {
        /* Get the query string from the URL object */

        var qs = getURLobj(url).query;

        /* Anything? */

        if (qs[0] == "?")
            return qs.slice (1);

        return qs;
    };



    var queryStrToObj = function (query) {
        var obj = {};
        if ( query != "" )
        {
            var els = query.split("&");
            for (var i = 0; i < els.length; i++) {
                var par = els[i].split("=");
                //obj[par[0]] = decodeURIComponent(par[1]);
                obj[par[0]] = encodeURIComponent(decodeURIComponent(par[1]));
            }
        }
        return obj;
    };



    var queryObjToStr = function() {
        var str = "";

        for (var i in this)
        {
            if (i != "toString" && this[i] != null)
                str += "&" + i + "=" + this[i];
        }

        if (str[0] == "&")
            str = "?" + str.slice(1);

        return str;
    };





    var objToURL = function(url) {
        // Build URL string, starting with the scheme

        //var urlString = url.scheme;

        var urlStr = "http://" + url.host + ( url.port != "" ? ":" + url.port : "" ) + url.path + url.query;

        if (url.fragment)
            if (url.fragment != "")
                urlStr += url.fragment;

        // Note:  assuming no username was specified, so incorporate the rest of the
        //  URL including the port only if it was specified explicitly

        return urlStr;
    };



    var returnEachObject = function (callback, parameters) {
        if (this.href != null)
            return callback.apply (this, [parameters]);

        var result = [];

        this.each (
            function() {
                result.push(callback.apply ($( this ), [parameters]));
            }
        );

        return result;
    };



    var returnEachElement = function (callback, parameters) {
        if (this.href != null) {
            callback.apply (this, [parameters]);

            return this;
        }

        addSelectorCallback(this, callback, [parameters]);

        return this.each (function() {
                callback.apply($(this), [parameters]);
            }
        );
    };



    var setHref = function (url) {
        if (typeof url == "object")
            url = objToURL(url);

        //url = uri.parse(url).toString();

        if (this.href != null) {
            this.href = url;
        }
    };




    var setUrlSegment = function(url, segment, value) {
        var urlObject = uri.parse(url);

        urlObject[segment] = value;

        return objToURL(urlObject);
    };



    var updateHref = function(segment, value) {
        var urlStr =  setUrlSegment(getHref.apply(this), segment, value);
        setHref.apply(this, [urlStr]);
    };



    var updateHrefSh = function(parameters) {
        updateHref.apply(this, [parameters[0], parameters[1]]);
    };



    var updateQuery = function(query) {
        var queryObj = {};

        var curQueryObj = queryStrToObj(getQueryStr(getHref.apply(this)));

        if (typeof query == "string") {
            // If the first character is a "?" replace the entire query string

            if (query[0] == "?") {
                curQueryObj = {};

                query = query.substring (1);
            }

            queryObj = queryStrToObj(query);
        }
        else
            queryObj = query;

        if ( $.isEmptyObject(queryObj) == false)
            queryObj = $.extend (curQueryObj, queryObj);
        else
            curQueryObj = {};

        updateHref.apply(this, ["query", queryObjToStr.apply(queryObj)]);
    };

    var modUrl = function(params) {
        var setto = params[0] + "=" + params[1];
        this.query(setto);
        var qp = this.query();
        // TODO Do you want to check for other non-HTML5 older browsers?
        if (browserType.msie){
            if (Number(browserType.version.slice(0,1)) <= 9) {
                var hash = this.href.split("?");
                document.location.hash = hash[1];
                if (document.location.href.indexOf("?") > -1){
                    var newlocation = hash[0] + '#' + hash[1];
                    location.replace(newlocation);
                }
            }
        }
        else
            window.history.replaceState("Object", "Title", this.href);
    };



    var helpers = {
        "getUrl" : function() {
            return returnEachObject.apply(this, [getHref, null]);
        },

        "setUrl" : function (url) {
            setHref.apply(this, [url]);
        },

        "parseUrl" : function() {
            return returnEachObject.apply(this, [function() {return uri.parse(getHref.apply(this));}, null]);
        },

        "getFragment" : function() {
            return returnEachObject.apply (this, [function() {return getFragmentString(getHref.apply(this));}, null]);
        },

        "setFragment" : function(fragment) {
            if ( fragment [0] != "#" )
                fragment = "#" + fragment;

            return returnEachElement.apply(this, [updateHrefSh, ["fragment", fragment]]);
        },

        "getQuery" : function() {
            return returnEachObject.apply(this, [function() {return $.extend(queryStrToObj(getQueryStr(getHref.apply(this))), {toString : queryObjToStr});}, null]);
        },

        "setQuery" : function(query) {
            return returnEachElement.apply(this, [updateQuery, query]);
        },

        "modUrl" : function(name, value) {
            return returnEachElement.apply(this, [modUrl, arguments]);
        }
    };



    var methodDispatcher = function (method) {
        if (methods[method] != null)
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method == "object" || method == null)
            return methods.initialize.apply(this, Array.prototype.slice.call(arguments, 1));

        // Invalid method/parameters

        return this;
    };




    // URI parser interface

    var uri = {

        // URI object-to-string methods

        toString : {
            // uri.toString.http converts a URI object with an "http" scheme
            //      to a string

            "http" : function() {
                return objToURL (this);
            }
        },

        // URI string parsers

        parsers : {
            // uri.parsers.http parses a URI with a "http://" scheme into an object

            "http" : function (url) {
                return $.extend(getURLobj(url), {toString : uri.toString.http});
            }
        },

        // uri.parse parses a URI string based on the scheme

        parse : function(uri) {

            if ( typeof uri != "string" )
                return uri;

            // Determine the scheme

            var pos = uri.indexOf(":");

            if (pos != -1) {
                // Get the scheme name (from the start of the URI,
                //  until the first ":" character)

                var scheme = uri.substring(0, pos).toLowerCase();

                // See if we have a handler for the scheme

                if (this.parsers[scheme] != null)
                    return this.parsers[scheme](uri);

                // Default

                return this.parsers.generic(scheme, uri.substring(pos + 1));
            }

            return this.parsers.http(uri);
        }
    };



    var dispatchGetSetHelper = function(getHelper, setHelper, helperArguments) {
        if (helperArguments.length == 0)
            return getHelper.apply(this);

        return setHelper.apply(this, helperArguments)
    };



    // Public interface methods

    var methods = {
        // url gets/sets the href string for the given element(s)

        "url" : function(url) {
            return dispatchGetSetHelper.apply(this, [helpers.parseUrl, helpers.setUrl, arguments]);
        },

        // query gets/sets the query segment of the URL for the given element(s)

        "query" : function(query) {
            return dispatchGetSetHelper.apply(this, [helpers.getQuery, helpers.setQuery, arguments]);
        },

        "fragment" : function(fragment) {
            return dispatchGetSetHelper.apply(this, [helpers.getFragment, helpers.setFragment, arguments]);
        },

        "goto" : function() {
            document.location.href = getHref.apply(this);
        },

        "interface" : function() {
            return methods;
        },

        "modUrl" : function(name, value) {
            return dispatchGetSetHelper.apply(this, [helpers.getQuery, helpers.modUrl, arguments]);
        }
    };



    $.fn.nbaurlp = function (method) {
        //returnEachElement.apply(this, [initializeElement]);

        return methodDispatcher.apply(this, arguments);
    };



    $.nbaurlp = function (url) {
        // Create an object to manipulating the url, or document.location.href if the url is null

        return {
            href : url || document.location.href,
            url : methods.url,
            query : methods.query,
            fragment : methods.fragment,
            modUrl : methods.modUrl,
            "goto" : methods ["goto"]
        };
    };
})(jQuery);
