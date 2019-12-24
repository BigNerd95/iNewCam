// JavaScript Document
$(function() {

    var MainStreamBitRateMax = 0;
    var MainStreamBitRateMin = 0;

    $(document).ready(function(e) {
        LoadLanguage();

        loadMainStream();
        loadSubStream();
       // loadMobileStream();

		//$("#MainStreamSizeSelect").change();
		
        setTimeout(function() {
            $("body").css("display", "block");
        },
        100);
    });

    function loadMainStream() {

        /*****************分辨率*******************/
        if ((sensortype == "ar0130_960P") || (sensortype == "ar0130_960p") || (sensortype == "ar0130")) {
            $("#MainStreamSizeSelect option").each(function(index, element) {
                if (($(this).text() != "1280x960") && ($(this).text() != "1280x720") 
				&& ($(this).text() != "640x480") && ($(this).text() != "640x360")) { //ar0130 960P 720P VGA
                    $(this).remove();
                }
            });
        } 
		else if((sensortype == "imx122") || (sensortype == "mt9p006") || sensortype == "ar0330") {
            	 $("#MainStreamSizeSelect option").each(function(index, element) {//1080P
                if (($(this).text() != "1920x1080") && ($(this).text() != "640x360") && ($(this).text() != "1280x720")) {
                    $(this).remove();
                }
            });
        }
		else {
            $("#MainStreamSizeSelect option").each(function(index, element) {//720P
                if (($(this).text() != "1280x720") && ($(this).text() != "640x360")) {
                    $(this).remove();
                }
            });
        }

        /***********遍历列表,查找对应的分辨率**************/
        var haveRes = 0;
        $("#MainStreamSizeSelect option").each(function(index, element) {
            if ($(this).text() == (width_1 + "x" + height_1)) {
                haveRes = 1;
                $(this).attr("selected", true);
            }
        });
        if (haveRes == 0) { //如果当前没有这个分辨率则插进去并选中它
            $("#MainStreamSizeSelect option").remove();
            $("#MainStreamSizeSelect").append("<option selected=\"selected\">" + width_1 + "x" + height_1 + "</option>");
            $("#MainStreamSizeSelect").append("<option>" + 640 + "x" + 360 + "</option>");
        }
        /*****************比特率*******************/
        $("#MainStreamBitSelect option").each(function(index, element) {
            if ($(this).val() == bps_1) {
                $("#MainStreamBitSelect option[value=" + bps_1 + "]").attr("selected", true);
                return false;
            }
            if (index == $("#MainStreamBitSelect option").length - 1) {
                $("#MainStreamBitSelect option:last").attr("selected", true);
                $("#MainStreamUserDefineInput").css('display', "inline");
                $("#MainStreamUserDefineInput").val(bps_1);
                $("#MainStreamBitSelect option:last").val(bps_1);
            }
        });

        /*****************帧率*******************/
        if (vinorm == 1) var fpsMax = 30; //N
        else var fpsMax = 20; //P
        for (i = 1; i <= fpsMax; i++) $("#MainStreamFpsSelect").append('<option value="' + i + '">' + i + '</option>');
        $("#MainStreamFpsSelect option[value=" + fps_1 + "]").attr("selected", true);

        /*****************码率控制 *******************/
        $("#MainStreamBitRateCtrSelect option[value=" + brmode_1 + "]").attr("selected", true);
        if (brmode_1 == 4) {
            $("#MainStreamFIXQPLevel option[value=" + fixqplevel_1 + "]").prop("selected", true);
        }

        $("#MainStreamBitRateCtrSelect").change();

        if (vinorm == 0) $("input[type=radio][name=ModeGrp]:eq(0)").prop("checked", true);
        else $("input[type=radio][name=ModeGrp]:eq(1)").prop("checked", true);

        /*****************GOP*******************/
        $("#MainStreamGopInput").val(gop_1);
        $("#MainStreamGopInputTips").html(GopInputTipsSpan + fps_1);

        /*****************Audio*******************/
        //$("input[name=MainStreamAudioGrp][value=" + bIsGetAudio_1 + "]").prop("checked", true);
    }

    function loadSubStream() {
        /*****************分辨率*******************/
        var haveRes = 0;
        $("#SubStreamSizeSelect option").each(function(index, element) {
            if ($(this).text() == (width_2 + "x" + height_2)) {
                haveRes = 1;
                $(this).attr("selected", true);
            }
        });

        if (haveRes == 0) //如果当前没有这个分辨率则插进去并选中它
        {
            $("#SubStreamSizeSelect").prepend("<option selected=\"selected\">" + width_2 + "x" + height_2 + "</option>");
            $("#SubStreamSizeSelect option:first").attr("selected", true);
        }		
       

        /*****************比特率*******************/
        $("#SubStreamBitSelect option").each(function(index, element) {
            if ($(this).val() == bps_2) {
                $("#SubStreamBitSelect option[value=" + bps_2 + "]").attr("selected", true);
                return false;
            }
            if (index == $("#SubStreamBitSelect option").length - 1) {
                $("#SubStreamBitSelect option:last").attr("selected", true);
                $("#SubStreamUserDefineInput").css('display', "inline");
                $("#SubStreamUserDefineInput").val(bps_2);
                $("#SubStreamBitSelect option:last").val(bps_2);
            }
        });

        /*****************帧率*******************/
        if (vinorm == 1) var fpsMax = 30; //N
        else var fpsMax = 20; //P
        for (i = 1; i <= fpsMax; i++) $("#SubStreamFpsSelect").append('<option value="' + i + '">' + i + '</option>');
        $("#SubStreamFpsSelect option[value=" + fps_2 + "]").attr("selected", true);

        /*****************码率控制 *******************/
        $("#SubStreamBitRateCtrSelect option[value=" + brmode_2 + "]").attr("selected", true);
        if (brmode_2 == 4) {
            $("#SubStreamFIXQPLevel option[value=" + fixqplevel_2 + "]").prop("selected", true);
        }

        $("#SubStreamBitRateCtrSelect").change();

        /*****************GOP*******************/
        $("#SubStreamGopInput").val(gop_2);
        $("#SubStreamGopInputTips").html(GopInputTipsSpan + fps_2);

        /*****************Audio*******************/
        //$("input[name=SubStreamAudioGrp][value=" + bIsGetAudio_2 + "]").prop("checked", true);
    }

    function loadMobileStream() {
 		/*****************分辨率*******************/
        var haveRes = 0;
        $("#MobileStreamSizeSelect option").each(function(index, element) {
            if ($(this).text() == (width_3 + "x" + height_3)) {
                haveRes = 1;
                $(this).attr("selected", true);
            }
        });

        if (haveRes == 0) //如果当前没有这个分辨率则插进去并选中它
        $("#MobileStreamSizeSelect").append("<option selected=\"selected\">" + width_3 + "x" + height_3 + "</option>");

        /*****************图像质量*******************/
        $("#MobileStreamImageQuality option[value=" + piclevel_3 + "]").attr("selected", true);
    }

    function Ar0130Switch() {
        var cgiurl = "http://" + window.document.location.host + "/cgi-bin/bconf.cgi?cmd=bconf.cgi&-action=set";
        cgiurl += "&-board=" + boardtype;
        cgiurl += '&-time="' + new Date().getTime() + '"';
		
        /***************分辨率***************************/
        width = $("#MainStreamSizeSelect option:selected").text().split("x")[0];
        height = $("#MainStreamSizeSelect option:selected").text().split("x")[1];

        if ((height == 720) || (height == 360)) { //VI 切换到720P
            $("#Form2VideoMode").val(29);
            cgiurl += "&-sensor=" + "ar0130";
        } else if ((height == 960) || (height == 480)) { //VI 切换到960P
            $("#Form2VideoMode").val(32);
            cgiurl += "&-sensor=" + "ar0130_960P";
        } else {
            return true;
        }

        $.ajax({
            url: cgiurl,
            type: "GET",
            dataType: "text",
            timeout: 3000,
            error: function(data) {
                alert("set sensor error");
                change = 0;
            },
            success: function(data) {},
            async: false
        })

        $("#Form2SetViAttrCmd").removeAttr("disabled");
        $("#Form2SetViAttrCmd").attr("name", "cmd");
        $("#Form2SetViAttrCmd").val("setviattr");

        $("#Form2VideoMode").removeAttr("disabled");
        $("#Form2VideoMode").attr("name", "-videomode");
    }

    function submitMainStream() {

        /***************分辨率***************************/
        width = $("#MainStreamSizeSelect option:selected").text().split("x")[0];
        height = $("#MainStreamSizeSelect option:selected").text().split("x")[1];

        /***************ar0130的特殊处理***************************/
        if ((sensortype == "ar0130_960P") || (sensortype == "ar0130_960p") || (sensortype == "ar0130")) {
            Ar0130Switch();
        }

        if ((height != height_1) || (width != width_1)) {
            $("#Form2SetMainVencSizeCmd").removeAttr("disabled");
            $("#Form2MainChn").removeAttr("disabled");
            $("#Form2MainWidth").removeAttr("disabled");
            $("#Form2MainHeight").removeAttr("disabled");

            $("#Form2SetMainVencSizeCmd").attr("name", "cmd");
            $("#Form2SetMainVencSizeCmd").val("setviattr");
            $("#Form2MainChn").attr("name", "-chn");
            $("#Form2MainChn").val(11);
            $("#Form2MainWidth").attr("name", "-w");
            $("#Form2MainWidth").val(width);
            $("#Form2MainHeight").attr("name", "-h");
            $("#Form2MainHeight").val(height);
        }

        /***************比特率***************************/
        $("#Form2Bps").val($("#MainStreamBitSelect option:selected").val());
        $("#Form2Bps").attr("name", "-bps");

        /***************帧率***************************/
        $("#Form2Fps").val($("#MainStreamFpsSelect option:selected").val());
        $("#Form2Fps").attr("name", "-fps");

        /*****************码率控制 *******************/
        $("#Form2BrMode").val($("#MainStreamBitRateCtrSelect option:selected").val());
        $("#Form2BrMode").attr("name", "-brmode");

        if ($("#MainStreamBitRateCtrSelect option:selected").val() == 4) { //fixqp
            $("#Form2FixQpLevel").removeAttr("disabled");
            $("#Form2FixQpLevel").attr("name", "-fixqplevel");
            $("#Form2FixQpLevel").val($("#MainStreamFIXQPLevel option:selected").val());
        }

        /*****************GOP *******************/
        $("#Form2Gop").val($("#MainStreamGopInput").val());
        $("#Form2Gop").attr("name", "-gop");

        /**************通道号*********************/
        $("#Form2Chn").val(11);
        $("#Form2Chn").attr("name", "-chn");

        /*****************Audio*******************/
		/*
        $("#Form2MainStreamAudioChn").val(11);
        $("#Form2MainStreamAudioChn").attr("name", "-chn");

        $("#Form2MainStreamIsGetAudio").val($("input[name=MainStreamAudioGrp]:checked").val());
        $("#Form2MainStreamIsGetAudio").attr("name", "-isgetaudio");
*/
        return true;
    }

    function submitAdvanceAttr() {

        var change = 0;

		 /******************分辨率********************/
        if (width_1 != $("#MainStreamSizeSelect option:selected").text().split("x")[0] 
		|| height_1 != $("#MainStreamSizeSelect option:selected").text().split("x")[1] 
		|| width_2 != $("#SubStreamSizeSelect option:selected").text().split("x")[0] 
		|| height_2 != $("#SubStreamSizeSelect option:selected").text().split("x")[1]) {
            change = 1;
        }

        /******************制式改变********************/
/*
        if ((vinorm == 0 && $("input[type=radio][name=ModeGrp]:checked").val() != "P") 
		|| (vinorm == 1 && $("input[type=radio][name=ModeGrp]:checked").val() != "N")) {
			 $("#Form2SetViAttrCmd").removeAttr("disabled");
			$("#Form2SetViAttrCmd").attr("name", "cmd");
			$("#Form2SetViAttrCmd").val("setviattr");
		
            $("#Form2ViNorm").removeAttr("disabled");
            $("#Form2ViNorm").attr("name", "-vinorm");
            $("#Form2ViNorm").val($("input[type=radio][name=ModeGrp]:checked").val());
            change = 1;
        }
*/
        if (change == 1) {
            /*****************发送重启********************/
            $("#Form2SetVencSizeRebootCmd").removeAttr("disabled");
            $("#Form2SetVencSizeRebootCmd").attr("name", "cmd");
            $("#Form2SetVencSizeRebootCmd").val("setviattr");
            $("#Form2Reboot").removeAttr("disabled");
            $("#Form2Reboot").attr("name", "-reboot");

            $("body div:first").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);
            setInterval("progress()", 450); //45S
        }

        return true;
    }

    function submitSubStream() {

        width = $("#SubStreamSizeSelect option:selected").text().split("x")[0];
        height = $("#SubStreamSizeSelect option:selected").text().split("x")[1];

        /**************分辨率切换***************/
        if ((height != height_2) || (width != width_2)) {
            $("#Form2SetSubVencSizeCmd").removeAttr("disabled");
            $("#Form2SubVencSizeChn").removeAttr("disabled");
            $("#Form2SubWidth").removeAttr("disabled");
            $("#Form2SubHeight").removeAttr("disabled");

            $("#Form2SetSubVencSizeCmd").attr("name", "cmd");
            $("#Form2SetSubVencSizeCmd").val("setviattr");
            $("#Form2SubVencSizeChn").attr("name", "-chn");
            $("#Form2SubVencSizeChn").val(12);
            $("#Form2SubWidth").attr("name", "-w");
            $("#Form2SubWidth").val(width);
            $("#Form2SubHeight").attr("name", "-h");
            $("#Form2SubHeight").val(height);
        }

        /***************比特率***************************/
        $("#Form2SubBps").val($("#SubStreamBitSelect option:selected").val());
        $("#Form2SubBps").attr("name", "-bps");

        /***************帧率***************************/
        $("#Form2SubFps").val($("#SubStreamFpsSelect option:selected").val());
        $("#Form2SubFps").attr("name", "-fps");

        /*****************码率控制 *******************/
        $("#Form2SubBrMode").val($("#SubStreamBitRateCtrSelect option:selected").val());
        $("#Form2SubBrMode").attr("name", "-brmode");
        if ($("#SubStreamBitRateCtrSelect option:selected").val() == 4) { //fixqp
            $("#Form2SubFixQpLevel").removeAttr("disabled");
            $("#Form2SubFixQpLevel").attr("name", "-fixqplevel");
            $("#Form2SubFixQpLevel").val($("#SubStreamFIXQPLevel option:selected").val());
        }

        /*****************GOP *******************/
        $("#Form2SubGop").val($("#SubStreamGopInput").val());
        $("#Form2SubGop").attr("name", "-gop");

        /**************通道号*********************/
        $("#Form2SubChn").val(12);
        $("#Form2SubChn").attr("name", "-chn");

        /*****************Audio*******************/
		/*
        $("#Form2SubStreamAudioChn").val(12);
        $("#Form2SubStreamAudioChn").attr("name", "-chn");

        $("#Form2SubStreamIsGetAudio").val($("input[name=SubStreamAudioGrp]:checked").val());
        $("#Form2SubStreamIsGetAudio").attr("name", "-isgetaudio");
		*/
        return true;
    }

    function submitMobileStream() {
        /*****************图像质量*******************/
        $("#Form2MobileBrMode").attr("name", "-brmode");
        $("#Form2MobileBrMode").val(4);

        $("#Form2MobileImageGrade").val($("#MobileStreamImageQuality option:selected").val());
        $("#Form2MobileImageGrade").attr("name", "-fixqplevel");


        /**************通道号*********************/
        $("#Form2MobileChn").val(13);
        $("#Form2MobileChn").attr("name", "-chn");

        return true;
    }

    $("#apply").click(function() {
        var form1 = document.form1;
        var form = document.form2;
        form.cururl.value = document.URL;

        submitAdvanceAttr();
        submitMainStream();
        submitSubStream();
        //submitMobileStream();

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    })

    $("#cancel").click(function() {
        window.location.reload(true);
    })

    $('#SubStreamBitSelect').change(function() {
    	/******************* 去掉 子码流 自定义码流输入
        if ($(this).get(0).selectedIndex == $(this).children("option").length - 1) {
            $('#SubStreamUserDefineInput').css('display', 'inline');
            if ($('#SubStreamUserDefineInput').val().length == 0) { //如果原来没有值的话，则给一个最小值
                $('#SubStreamUserDefineInput').val($("#SubStreamBitSelect").children("option:first").val());
            }
            $('#SubStreamBitSelect option:last').val($('#SubStreamUserDefineInput').val());
        } else 
        	**************/
        	{
            $('#SubStreamUserDefineInput').css('display', 'none');
        }
    })

    $('#MainStreamBitSelect').change(function() {
    	/***************** 去掉 主码流 自定义码流输入
        if ($(this).get(0).selectedIndex == $(this).children("option").length - 1) {
            $('#MainStreamUserDefineInput').css('display', 'inline');
            if ($('#MainStreamUserDefineInput').val().length == 0) { //如果原来没有值的话，则给一个最小值
                $('#MainStreamUserDefineInput').val($("#MainStreamBitSelect").children("option:first").val());
            }
            $('#MainStreamUserDefineInput option:last').val($('#MainStreamUserDefineInput').val());
        } else 
        ***************/
        $('#MainStreamUserDefineInput').css('display', 'none');
    })

    /****************码率值限定数字输入*********************/
    $("#SubStreamUserDefineInput, #MainStreamUserDefineInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    /****************码率值范围判断*********************/
    $("#SubStreamUserDefineInput, #MainStreamUserDefineInput").blur(function() {

        if ($(this).attr('id') == "SubStreamUserDefineInput") {
            var obj = "#SubStreamBitSelect";
        } else if ($(this).attr('id') == "MainStreamUserDefineInput") {
            var obj = "#MainStreamBitSelect";
        } else {
            return true;
        }

        val = $(this).val();
        if (isNaN(val) || ($(this).length == 0)) $(this).val($(obj).children('option:first').val());

        /******************默认下拉框的第一个数据为最小值，倒数第二个为最大值******************/
        var MaxVal = parseInt($(obj).children("option:eq(" + ($(obj).children("option").length - 2) + ")").val());
        var MinVal = parseInt($(obj).children('option:first').val());

        if (parseInt($(this).val()) < MinVal) {
            $(this).val(MinVal);
        } else if (parseInt($(this).val()) > MaxVal) {
            $(this).val(MaxVal);
        }

        /*将输入框的值给下拉框最后一项，方便提交时的取值*/
        $(obj).children("option:last").val($(this).val());
    })

    $("#progressbar").progressbar({
        value: 0
    });

    progress = function() {

        var val = $("#progressbar").progressbar("value") || 0;

        $("#progressbar").progressbar("value", val + 1);

        if (val >= 100) window.location.reload(true);

    }

    $("input[type=radio][name=ModeGrp]").click(function() {
        if (((vinorm == 0) && $(this).val() != "P") || ((vinorm == 1) && $(this).val() != "N")) $("#NormChangeRebootMsgLabel").html(NormChangeRebootMsg);
        else $("#NormChangeRebootMsgLabel").html("");

        if ($(this).val() == "P") {
            if ($("#MainStreamFpsSelect option:selected").val() > 25) $("#MainStreamFpsSelect option[value=25]").prop("selected", true);
            if ($("#SubStreamFpsSelect option:selected").val() > 25) $("#SubStreamFpsSelect option[value=25]").prop("selected", true);
        }

    })

    $("#SubStreamSizeSelect").change(function() {
        width = $("#SubStreamSizeSelect option:selected").text().split("x")[0];
        height = $("#SubStreamSizeSelect option:selected").text().split("x")[1];

        if (height != height_2) $("#SubViewSizeChangeRebootMsgLabel").html(ViewSizeChangeRebootMsg);
        else $("#SubViewSizeChangeRebootMsgLabel").html("");
	})

    $("#MainStreamSizeSelect").change(function() {
        width = $("#MainStreamSizeSelect option:selected").text().split("x")[0];
        height = $("#MainStreamSizeSelect option:selected").text().split("x")[1];

        if (height != height_1) $("#ViewSizeChangeRebootMsgLabel").html(ViewSizeChangeRebootMsg);
        else $("#ViewSizeChangeRebootMsgLabel").html("");
		
		/************根据主码流分辨率切换子码流分辨率**********/
		if ((sensortype == "ar0130_960P") || (sensortype == "ar0130_960p") || (sensortype == "ar0130")) {
            width = $("#MainStreamSizeSelect option:selected").text().split("x")[0];
        	height = $("#MainStreamSizeSelect option:selected").text().split("x")[1];
			
			var SubStreamSizeSelected = 0;
			if(($("#SubStreamSizeSelect option:selected").text() == "640x480")
			||($("#SubStreamSizeSelect option:selected").text() == "640x360")){
				SubStreamSizeSelected = 0;
			}else if(($("#SubStreamSizeSelect option:selected").text() == "320x240")
			||($("#SubStreamSizeSelect option:selected").text() == "320x180")){
				SubStreamSizeSelected = 1;
			}
			$("#SubStreamSizeSelect option").remove();
			if(($("#MainStreamSizeSelect option:selected").text() == "1280x720")
			||($("#MainStreamSizeSelect option:selected").text() == "640x360")){
				$("#SubStreamSizeSelect").append("<option selected=\"selected\">640x360</option>");
				$("#SubStreamSizeSelect").append("<option selected=\"selected\">320x180</option>");
				
				$("#MobileStreamSizeSelect option:eq(" + 0 + ")").prop("selected", true);//320*180
				
			}else if(($("#MainStreamSizeSelect option:selected").text() == "1280x960")
			||($("#MainStreamSizeSelect option:selected").text() == "640x480")){
				$("#SubStreamSizeSelect").append("<option selected=\"selected\">640x480</option>");
				$("#SubStreamSizeSelect").append("<option selected=\"selected\">320x240</option>");
				
				$("#MobileStreamSizeSelect option:eq(" + 1 + ")").prop("selected", true);//320*240
			}
			
			$("#SubStreamSizeSelect option:eq(" + SubStreamSizeSelected + ")").prop("selected", true);
        }
		
    })

    $("#MainStreamFpsSelect, #SubStreamFpsSelect").change(function() {
        if ((vinorm == 0) && ($(this).children("option:selected").val() > 25)) $(this).children("option[value=25]").prop("selected", true);

        /*I帧间隔必须大于等于帧率*/
        if ($(this).attr("id") == "MainStreamFpsSelect") {
            $("#MainStreamGopInputTips").html(GopInputTipsSpan + $(this).children("option:selected").val());
            if (Number($("#MainStreamGopInput").val()) < Number($(this).children("option:selected").val())) {
                $("#MainStreamGopInput").val($(this).children("option:selected").val());
            }
        }

        /*I帧间隔必须大于等于帧率*/
        if ($(this).attr("id") == "SubStreamFpsSelect") {
            $("#SubStreamGopInputTips").html(GopInputTipsSpan + $(this).children("option:selected").val());
            if (Number($("#SubStreamGopInput").val()) < Number($(this).children("option:selected").val())) {
                $("#SubStreamGopInput").val($(this).children("option:selected").val());
            }
        }

    })

    $("#MainStreamBitRateCtrSelect").change(function() {
        if ($(this).children("option:selected").val() == 4) { //FIXQP
            $("#MainStreamBitSelect").attr("disabled", "disabled");
            $("#MainStreamFIXQPLevel").css("display", "inline");
        } else {
            $("#MainStreamBitSelect").removeAttr("disabled");
            $("#MainStreamFIXQPLevel").css("display", "none");
        }
    })

    $("#SubStreamBitRateCtrSelect").change(function() {
        if ($(this).children("option:selected").val() == 4) { //FIXQP
            $("#SubStreamBitSelect").attr("disabled", "disabled");
            $("#SubStreamFIXQPLevel").css("display", "inline");
        } else {
            $("#SubStreamBitSelect").removeAttr("disabled");
            $("#SubStreamFIXQPLevel").css("display", "none");
        }
    })

    /********************************检查GOP值是否合法*******************************/
    $("#MainStreamGopInput").blur(function() {
        if (Number($(this).val()) < Number($("#MainStreamFpsSelect option:selected").val())) {
            $(this).val($("#MainStreamFpsSelect option:selected").val());
        }
    })

    /********************************检查GOP值是否合法*******************************/
    $("#SubStreamGopInput").blur(function() {
        if (Number($(this).val()) < Number($("#SubStreamFpsSelect option:selected").val())) {
            $(this).val($("#SubStreamFpsSelect option:selected").val());
        }
    })

    $("#MainStreamGopInput, #SubStreamGopInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

})