// JavaScript Document

var IsIE = 0;

if(GetBrowserVer().brower == "IE"){
	IsIE = 1;
}

function JSURLEncoding(str, callback) {
	var charset = "gb2312";
    //创建form通过accept-charset做encode
    var form = document.createElement('form');
    form.method = 'get';
    form.style.display = 'none';
    form.acceptCharset = charset;
    if ((document.all)||(IsIE == 1)) {
        //如果是IE那么就调用document.charset方法
        window.oldCharset = document.charset;
        document.charset = charset;
    }
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'str';
    input.value = str;
    form.appendChild(input);
    form.target = '_urlEncode_iframe_';
    document.body.appendChild(form);
    //隐藏iframe截获提交的字符串
    if (!window['_urlEncode_iframe_']) {
        var iframe;
        if ((document.all)||(IsIE == 1)) {
            try {
                iframe = document.createElement('<iframe name="_urlEncode_iframe_"></iframe>');
            } catch(e) {
                iframe = document.createElement('iframe');
                //iframe.name = '_urlEncode_iframe_';
                iframe.setAttribute('name', '_urlEncode_iframe_');
            }
        } else {
            iframe = document.createElement('iframe');
            //iframe.name = '_urlEncode_iframe_';
            iframe.setAttribute('name', '_urlEncode_iframe_');
        }
        iframe.style.display = 'none';
        iframe.width = "0";
        iframe.height = "0";
        iframe.scrolling = "no";
        iframe.allowtransparency = "true";
        iframe.frameborder = "0";
        iframe.src = 'about:blank';
        document.body.appendChild(iframe);
    }
    //
    window._urlEncode_iframe_callback = function(str) {
        callback(str);
        if ((document.all)||(IsIE == 1)) {
            document.charset = window.oldCharset;
        }
    }
    //设置回调编码页面的地址，这里需要用户修改
    form.action = 'getEncodeStr.html';
    form.submit();
    setTimeout(function() {
        form.parentNode.removeChild(form);
        iframe.parentNode.removeChild(iframe);
    },
    500)

}

function JSURLDecode(str,callback) {
	var charset = "gb2312";
    var script = document.createElement('script');
    script.id = '_urlDecodeFn_';
    window._urlDecodeFn_ = callback;
	
    if ((document.all)||(IsIE == 1)) {
        if (navigator.userAgent.indexOf('MSIE 8') > -1) {
            //对于ie8做特别hack
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.charset = charset;
            link.href = 'data:text/plain;charset=' + charset + ',%23_decode_hidden_el_for_test_%7Bbackground-image%3Aurl(' + str + ')%7D';
            //alert(link.href);
            document.body.appendChild(link);
            //然后创建一个隐藏的div，应用这个样式
            var div = document.createElement('div');
            div.id = '_decode_hidden_el_for_test_';
            div.style.display = 'none';
            document.body.appendChild(div);
            setTimeout(function() {
                callback(document.getElementById('_decode_hidden_el_for_test_').currentStyle['backgroundImage'].match(/\("data\:text\/(.+)"\)/)[1]);
                link.parentNode.removeChild(link);
                div.parentNode.removeChild(div);
            },
            300)
        } else {
            //隐藏iframe截获提交的字符串
            if (!window['_urlDecode_iframe_']) {
                var iframe;
                if (document.all) {
                    try {
                        iframe = document.createElement('<iframe name="_urlDecode_iframe_"></iframe>');
                    } catch(e) {
                        iframe = document.createElement('iframe');
                        //iframe.name = '_urlDecode_iframe_';
                        iframe.setAttribute('name', '_urlDecode_iframe_');
                    }
                } else {
                    iframe = document.createElement('iframe');
                    //iframe.name = '_urlDecode_iframe_';
                    iframe.setAttribute('name', '_urlDecode_iframe_');
                }
                //iframe.name = '_urlDecode_iframe_';
                iframe.setAttribute('name', '_urlDecode_iframe_');
                iframe.style.display = 'none';
                iframe.width = "0";
                iframe.height = "0";
                iframe.scrolling = "no";
                iframe.allowtransparency = "true";
                iframe.frameborder = "0";
                iframe.src = 'about:blank';
                document.body.appendChild(iframe);
            }
            //ie下需要指明charset，然后src=datauri才可以
            iframe.contentWindow.document.write('<html><scrip' + 't charset="gbk" src="data:text/javascript;charset=gbk,parent._decodeStr_=\'' + str + '\'"></s' + 'cript></html>');
            setTimeout(function() {
                callback(_decodeStr_);
                iframe.parentNode.removeChild(iframe);
            },
            300)
        }
    } else {
        var src = 'data:text/javascript;charset=' + charset + ',_urlDecodeFn_("' + str + '");';
        src += 'document.getElementById("_urlDecodeFn_").parentNode.removeChild(document.getElementById("_urlDecodeFn_"));';
        script.src = src;
        document.body.appendChild(script);
    }
}