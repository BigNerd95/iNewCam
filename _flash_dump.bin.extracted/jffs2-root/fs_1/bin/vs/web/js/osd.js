// JavaScript Document
$(function() {

    var IPCSrcWidth = 1280;
    var IPCSrcHeight = 720;
    //var ImgWidth = parseInt($("#mdsnap").width());
    //var ImgHeight = parseInt($("#mdsnap").height());
    var ImgWidth = 640;
    var ImgHeight = 360;
    $(document).ready(function(e) {
        LoadLanguage();

        $("#RegionLayer>div").draggable({
            containment: "#CdDisplayLayer",
            scroll: false
        });

        LoadAdjustRegionRect();

        do_load();

        setTimeout(function() {
            $("body").css("display", "block");
        },
        100);

    });

    function LoadAdjustRegionRect() {

        $("#RegionLayer>div").each(function(index, element) {
            var RegionWidth = eval("w_" + index);
            var RegionHeight = eval("h_" + index);
            /*
            var BorderLeft = parseInt($(this).css("border-left-width"));
            var BorderRight = parseInt($(this).css("border-right-width"));
            var BorderTop = parseInt($(this).css("border-top-width"));
            var BorderBottom = parseInt($(this).css("border-bottom-width"));
*/
            var BorderLeft = 0;
            var BorderRight = 0;
            var BorderTop = 0;
            var BorderBottom = 0;

            $(this).width(parseInt((ImgWidth * parseInt(RegionWidth)) / IPCSrcWidth) - BorderLeft - BorderRight);
            $(this).height(parseInt((ImgHeight * parseInt(RegionHeight)) / IPCSrcHeight) - BorderTop - BorderBottom);

            var x = eval("x_" + index);
            var y = eval("y_" + index);

            var leftlen = parseInt((ImgWidth * parseInt(x)) / IPCSrcWidth);

            if ((leftlen + $(this).width()) > ImgWidth) leftlen -= ((leftlen + $(this).width()) - ImgWidth);

            $(this).css("left", leftlen + "px");

            $(this).css("top", parseInt((ImgHeight * parseInt(y)) / IPCSrcHeight) + "px");

            if (parseInt(eval("show_" + index)) == 0) {
                $(this).css("display", "none");
            } else {
                $(this).css("display", "block");
            }

        });

        return 0;
    }

    var ipcname = cont_1;

    on_load = function(cameraname) {

        $("#region0Label").html(cont_0);
        $("#region1Label").html(cameraname);

        /**************时间OSD 名字OSD************************/
        if (show_0 == 1) {
            $("#timeon").prop("checked", true);
        } else {
            $("#timeoff").prop("checked", true);
        }
        if (show_1 == 1) {
            $("#camnameon").prop("checked", true);
        } else {
            $("#camnameoff").prop("checked", true);
        }

        $("input[name=cameraname]").val(cameraname);
    }

    do_load = function() {
        BrowserVer = GetBrowserVer();
        if ((BrowserVer.brower == "IE")&&(parseInt(BrowserVer.ver) < 10)) {
            var cameraname = URLDecode(ipcname);
            on_load(cameraname);
        } else {
            JSURLDecode(ipcname,
            function(cameraname) {
                on_load(cameraname);
            });
        }
    }

    function SubmitAdjustRegionRect() {

        $("#RegionLayer>div").each(function(index, element) {
            var RegionX = parseInt($(this).css("left"));
            var RegionY = parseInt($(this).css("top"));
            var RegionWidth = parseInt($(this).outerWidth(true));
            var RegionHeight = parseInt($(this).outerHeight(true));

            var BorderLeft = 0;
            var BorderRight = 0
            var BorderTop = 0;
            var BorderBottom = 0;

            $("#Form2RegionX" + index).attr("name", "-x");

            $("#Form2RegionY" + index).attr("name", "-y");

            var x = RegionX * IPCSrcWidth / ImgWidth;

            if (x < 0) x = 0;
            if (x > IPCSrcWidth) x = IPCSrcWidth;

            $("#Form2RegionX" + index).val(x);

            var y = RegionY * IPCSrcHeight / ImgHeight;

            if (y < 0) y = 0;
            if (y > IPCSrcHeight) y = IPCSrcHeight;

            $("#Form2RegionY" + index).val(y);
        });

        return 0;
    }

    submit_osdtime = function() {

        var bSend = 0;

        $("#Form2CmdRgn0").attr("name", "cmd");
        $("#Form2CmdRgn0").val("showosdtime");
        $("#Form2RgnShow0").attr("name", "-act");

        //the time osd shor or hide
        if (($("#timeon").prop("checked") == true) && (show_0 == "0")) {
            $("#Form2RgnShow0").val("show");
        } else if (($("#timeoff").prop("checked") == true) && (show_0 == "1")) {
            $("#Form2RgnShow0").val("hide");
        } else {
            $("#Form2CmdRgn0").prop("disabled", true);
            $("#Form2RgnShow0").prop("disabled", true);
        }

        bSend = 0;

        //the time osd  pos
        $("#Form2CmdRgnPos0").attr("name", "cmd");
        $("#Form2CmdRgnPos0").val("setosdattr");
        $("#Form2CmdRgnNum0").attr("name", "-region");
        $("#Form2CmdRgnNum0").val("0");

        /*坐标没有变化，则不发送*/
        if ((x_0 == $("#Form2RegionX0").val()) && (y_0 == $("#Form2RegionY0").val())) {
            $("#Form2RegionX0").prop("disabled", true);
            $("#Form2RegionY0").prop("disabled", true);
            bSend |= 0;
        } else {
            bSend |= 1;
        }

        if (bSend == 0) {
            $("#Form2CmdRgnPos0").prop("disabled", true);
            $("#Form2CmdRgnNum0").prop("disabled", true);
        }
    }

    submit_osdname = function(cameraname) {
        var bSend = 0;

        $("#Form2CmdRgn1").attr("name", "cmd");
        $("#Form2CmdRgn1").val("showosdname");
        $("#Form2RgnShow1").attr("name", "-act");

        //the time osd shor or hide
        if (($("#camnameon").prop("checked") == true) && (show_1 == "0")) {
            $("#Form2RgnShow1").val("show");
        } else if (($("#camnameoff").prop("checked") == true) && (show_1 == "1")) {
            $("#Form2RgnShow1").val("hide");
        } else {
            $("#Form2CmdRgn1").prop("disabled", true);
            $("#Form2RgnShow1").prop("disabled", true);

        }

        bSend = 0;
        //the name osd  pos
        $("#Form2CmdRgnPos1").attr("name", "cmd");
        $("#Form2CmdRgnPos1").val("setosdattr");

        $("#Form2CmdRgnNum1").attr("name", "-region");
        $("#Form2CmdRgnNum1").val("1");
        $("#Form2RegionCont1").attr("name", "-ipcname");
        $("#Form2RegionCont1").val(cameraname);
        $("#Form2RegionEncode1").attr("name", "-encode");

        $("#Form2SetServername").attr("name", "-ipcname");
        $("#Form2SetServername").val(cameraname);
        $("#Form2SetServernameEncode").attr("name", "-encode");

        if ((x_1 == $("#Form2RegionX1").val()) && (y_1 == $("#Form2RegionY1").val())) {
            $("#Form2RegionX1").prop("disabled", true);
            $("#Form2RegionY1").prop("disabled", true);
            bSend |= 0;
        } else {
            bSend |= 1;
        }

        if (cameraname == cont_1) {
            $("#Form2RegionCont1").prop("disabled", true);
            $("#Form2RegionEncode1").prop("disabled", true);

            $("#Form2SetServernameCmd").prop("disabled", true);
            $("#Form2SetServername").prop("disabled", true);
            $("#Form2SetServernameEncode").prop("disabled", true);
            bSend |= 0;
        } else {
            bSend |= 1;
        }

        if (bSend == 0) {
            $("#Form2CmdRgnPos1").prop("disabled", true);
            $("#Form2CmdRgnNum1").prop("disabled", true);
        }
    }

    on_submit = function(cameraname) {

		cameraname=cameraname.replace(/[+]/g, "%20");

        var form = document.form2;

        form.cururl.value = document.URL;

        SubmitAdjustRegionRect();

        submit_osdtime();

        submit_osdname(cameraname);

        /*
		$("form[name='form2']").children("input").each(function(index, element) {
			var str = "name:"+$(this).attr("name")+ ";\r\nid:" +$(this).attr("id") + ";\r\nval:" + $(this).val() +";\r\ndisabled:"+$(this).prop("disabled");
            alert(str);
        });
		*/
        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
        return true;
    }

    function check_string(nickname) {

		/******不能出现的字符********/
		var re = /[#%&"+\\|`]/gi;
		if(re.test(nickname) == true)
			return false;
		else
			return true;	
		/*******要出现的字符*****/	
		var reg = /^[A-Za-z0-9 ÄÖÜöäüß\-_\u4e00-\u9fa5]{1,24}$/;
        if (!reg.test(nickname)) {
            return false;
        }
        return true;
    }

    do_submit = function() {

        BrowserVer = GetBrowserVer();
	
        var ipcname = $("input[name=cameraname]").val();
        if (check_string(ipcname) == false) {
            alert(OsdNameErrorMsg);
            $("input[name=cameraname]").focus();
            return 0;
        }

		/***********特殊字符转义***********/
		ipcname=ipcname.replace(/[ü]/g, "&#252;");
		ipcname=ipcname.replace(/[ß]/g, "&#223;");
		ipcname=ipcname.replace(/[ä]/g, "&#228;");
		ipcname=ipcname.replace(/[ö]/g, "&#246;");		
		ipcname=ipcname.replace(/[Ä]/g, "&#196;");
		ipcname=ipcname.replace(/[Ö]/g, "&#214;");
		ipcname=ipcname.replace(/[Ü]/g, "&#220;");
        if ((BrowserVer.brower == "IE")&&(parseInt(BrowserVer.ver) < 10)) {
            var cameraname = VBURLEncoding(ipcname);
            on_submit(cameraname);
        } else {
            JSURLEncoding(ipcname,
            function(cameraname) {
                on_submit(cameraname);
            });
        }

    }

})