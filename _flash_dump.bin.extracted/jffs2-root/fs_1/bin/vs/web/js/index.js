// JavaScript Document
var Player = new PlayerObj();

 function  GetPlayerLayerWidthHeight () {
        var MinHeight = 430;
        var MinWidth = 700;

		width = document.documentElement.clientWidth - parseInt($("#LeftToolLayerLayer").outerWidth(true));
		width -=(width*0.2 + width*0.02);
		$("#DisplayareaLayer").css("margin-left", (width*0.2)+"px");
		$("#OCXCtlLayer").css('left', (width*0.2)+10+"px");
		$("#DisplayareaLayer").css("margin-right", (width*0.02)+"px");

      height = document.documentElement.clientHeight -  parseInt($(".mainHeader li").css("height")) - 80;

        if (height < MinHeight) height = MinHeight;
        if (width < MinWidth) width = MinWidth;


        return {
            w: width,
            h: height
        };

    }

function LoadPlayer() {
    return Player.Load();
}

function StartPlay() {
    return Player.Play(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);
}

function StopPlay() {
    return Player.StopPlay();
}

function PlayerResize(w, h) {
    return Player.PlayerResize(w, h);
}

function GetVideoWidthHeight() {
    return Player.GetVideoWidthHeight();
}

function RePlay(w, h) {
    StopPlay();
    return StartPlay();
}

function Record() {
    return Player.Record();
}

function Snap() {
    return Player.Snap();
}

function PlayBack() {
    return Player.PlayBack();
}

function StartTalk(stat) {
    return Player.StartTalk(stat);
}

function SetMute(stat) {
    return Player.SetMute(stat);
}


$(function() {

 $("#ReplayFrame").height(GetPlayerLayerWidthHeight().h+30)
		$("#ReplayFrame").width(document.documentElement.clientWidth - 10);

    var prevObjId = "#ImageSpan";
    var w_1, h_1, w_2, h_2;
    $(document).ready(function(e) {
        /***********************获取图像高宽*******************/
        var cgiurl = "cgi-bin/hi3510/getvencattr.cgi?-chn=11";
        $.get(cgiurl,
        function(data) {
            eval(data);
            w_1 = width_1;
            h_1 = height_1;
        });
        cgiurl = "cgi-bin/hi3510/getvencattr.cgi?-chn=12";
        $.get(cgiurl,
        function(data) {
            eval(data);
            w_2 = width_2;
            h_2 = height_2;
        });
        /***********************动态加载多国语言*******************/
        LoadLanguage();

	$("#HueImg").attr("title", HueImgTitile);
	$("#BrightnessImg").attr("title", BrightnessImgTitile);
	$("#ContrastImg").attr("title", ContrastImgTitle);
	$("#SaturationImg").attr("title", SaturationImgTitile);
	$("#GotoPoint").attr("title", GotoPointTitile);
	$("#SetPoint").attr("title", SetPointTitile);
	$("#ClearPoint").attr("title", ClearPointTitile);

	


        /***********************登录处理*******************/
        $("#LonginUsername").val("");
        $("#LonginPassword").val("");

        var username = getCookie("username");
        if (username) {
            $("#LonginUsername").val(Base64.decode(username));
            $("#LonginPassword").focus();
        }


        type = Number(GetPlayStream());
        if (type == 11) {
            $("#StreamSelect").get(0).selectedIndex = 0;
        } else if (type == 12) {
            $("#StreamSelect").get(0).selectedIndex = 1;
        } else {
            $("#StreamSelect").get(0).selectedIndex = 0;
        }

        $("#PTZPosInput").val(1);

        var username = getCookie("username");
        var passwd = getCookie("password");
        if ((Number(GetAutoLogin()) == 1) && (passwd) && (username)) {
            $("#LonginUsername").val(Base64.decode(username));
            $("#LonginPassword").val(Base64.decode(passwd));
            $('#Login').click();
        } else {
            /********************延时1S目的让多语言加载完成*******************/
            setTimeout(function() {
                $('#LoginLayer').css('display', 'block');
            },
            500);
        }



		if(typeof(p2p_enable) == 'undefined')
			p2p_enable = "-1";

		if(typeof(wifienable) == 'undefined')
			wifienable = "-1";

                if (p2p_enable == "-1") {                                              
                        $("#P2PSpan").parent().remove();                               
                }                                                                      
                if (wifienable == "-1") {                                        
                        $("#WifiSpan").parent().remove();                            
                }                                                                    
               

        return true;

    });

    /*************注销登录************/
    $("#Logout").click(function() {
        delCookie("password");
        $('#AutoLogin').removeAttr('checked');
        StopPlay();

        window.location.reload();
    })
    /*************切换到预览界面************/
    $('#home').click(function() {
        $('#mainpageLayer').css('display', 'block');
        $('#AdvanceLayer').css('display', 'none');
		$('#ReplayLayer').css('display', 'none');
       	//window.onresize();
	
		if(GetBrowserVer().brower !=  "IE")//vlc 重连
			RePlay(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);
    })

    /*************切换到参数设置界面************/
    $('#ParametersSet').click(function() {
		
        if (!CheckAuth()){
          	alert(NoAuthErrorMsg);
			return true;
        }
		
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
		$('#ReplayLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#NetworkLayer, #NetworkLayer a, #NetWorkSpan').css('display', 'block');
        $('#EventLayer, #EventLayer a, #EventSpan').css('display', 'block');
        $('#MediaLayer, #MediaLayer a, #MediaSpan').css('display', 'block');
        $('#VideoSpan').click();
    })
    /*************切换到系统设置界面************/
    $('#SystemSet').click(function() {
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
		$('#ReplayLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#SystemLayer, #SystemLayer a, #SystemSpan').css('display', 'block');
	
		   if (!CheckAuth()){
          	$('#DeviceinfoSpan').click();
			return true;
        }
	
        $('#UserSpan').click();
    })
    /*************切换到媒体设置界面************/
    $('#Media').click(function() {

  	 if (!CheckAuth()){
          	alert(NoAuthErrorMsg);
			return true;
        }
		
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
		$('#ReplayLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'block');
        $('#MediaLayer, #MediaLayer a, #MediaSpan').css('display', 'block');

        $('#ImageSpan').click();
    })

  /*************切换到回放设置界面************/
    $('#Replay').click(function() {
  	        if (!CheckAuth()) {
            alert(NoAuthErrorMsg);
            return true;
        }
        $('.side a, .side h1').css('display', 'none');
        $('#mainpageLayer').css('display', 'none');
        $('#AdvanceLayer').css('display', 'none');
		  $('#ReplayLayer').css('display', 'block');
     	$("#ReplayFrame")[0].contentWindow.location = 'replay.html';
    })

    /*************系统设置右侧菜单折叠************/
    $("#MediaSpan,#EventSpan,#NetWorkSpan,#SystemSpan").click(function() {
        return true;
        $("#MediaLayer").css("display", "none");
        $("#NetworkLayer").css("display", "none");

        $("#EventLayer").css("display", "none");
        $("#SystemLayer").css("display", "none");

        switch ($(this).attr("id")) {
        case "MediaSpan":
            $("#MediaLayer").css("display", "block");
            break;
        case "EventSpan":
            $("#EventLayer").css("display", "block");
            break;
        case "NetWorkSpan":
            $("#NetworkLayer").css("display", "block");
            break;
        case "SystemSpan":
            $("#SystemLayer").css("display", "block");
            break;
        }
    })

    /*************系统设置右侧网页跳转************/
    $(".side a").click(function() {
		/*****************签权*************/
        if (!CheckAuth()&&($(this).children("span:first").attr("id") != "DeviceinfoSpan")){
          	alert(NoAuthErrorMsg);
			return true;
        }
		
        /*加粗当前字体*/
        //        $(this).css("color", "#1c8cb5");
        $(this).css("color", "#000");
        $(this).css("font-weight", "bold");

        /*恢复上次字体*/
        if (prevObjId != ("#" + $(this).children("span:first").attr("id"))) {
			display = $(prevObjId).parent("a:first").css("display");
            $(prevObjId).parent("a:first").css("font-weight", "");
            $(prevObjId).parent("a:first").css("color", "#747c93");
            prevObjId = "#" + $(this).children("span:first").attr("id");
        }

        /******跳转相应的页面******/
        switch ($(this).children("span:first").attr("id")) {
        case "ImageSpan":
            $("#pageframe")[0].contentWindow.location = 'image.html';
            break;
        case "VideoSpan":
            $("#pageframe")[0].contentWindow.location = 'video.html';
            break;
        case "BasicSettingsSpan":
            $("#pageframe")[0].contentWindow.location = 'network.html';
            break;
        case "DDNSSpan":
            $("#pageframe")[0].contentWindow.location = 'ddns.html';
            break;
        case "MobileSpan":
            $("#pageframe")[0].contentWindow.location = 'osd.html';
            break;
        case "UserSpan":
            $("#pageframe")[0].contentWindow.location = 'user.html';
            break;
        case "EmailSpan":
            $("#pageframe")[0].contentWindow.location = 'email.html';
            break;
        case "MDSpan":
            $("#pageframe")[0].contentWindow.location = 'md.html';
            break;
        case "AlarmInSpan":
            $("#pageframe")[0].contentWindow.location = 'alarmin.html';
            break;
        case "AlarmOutSpan":
            $("#pageframe")[0].contentWindow.location = 'alarmout.html';
            break;
        case "AutoSnapSpan":
            $("#pageframe")[0].contentWindow.location = 'autosnap.html';
            break;
        case "LanguageSpan":
            $("#pageframe")[0].contentWindow.location = 'base.html';
            break;
        case "TimeSpan":
            $("#pageframe")[0].contentWindow.location = 'time.html';
            break;
        case "InitSpan":
            $("#pageframe")[0].contentWindow.location = 'initializemain.html';
            break;
        case "DeviceinfoSpan":
            $("#pageframe")[0].contentWindow.location = 'deviceinfo.html';
            break;
        case "LogSpan":
            $("#pageframe")[0].contentWindow.location = 'syslog.html';
            break;
        case "PTZSpan":
            $("#pageframe")[0].contentWindow.location = 'ptz.html';
            break;
        case "ODSpan":
            $("#pageframe")[0].contentWindow.location = 'od.html';
            break;
        case "RecordSpan":
            $("#pageframe")[0].contentWindow.location = 'record.html';
            break;
        case "StorageSpan":
            $("#pageframe")[0].contentWindow.location = 'storage.html';
            break;
		case "WifiSpan":
            $("#pageframe")[0].contentWindow.location = 'wifi.html';
            break;	
		case "P2PSpan":
            $("#pageframe")[0].contentWindow.location = 'p2p.html';
            break;	
		case "FTPSpan":
            $("#pageframe")[0].contentWindow.location = 'ftp.html';
            break;	
		case "CoverAreaSpan":
            $("#pageframe")[0].contentWindow.location = 'cd.html';
            break;	
		case "AudioSpan":
            $("#pageframe")[0].contentWindow.location = 'audio.html';
            break;		
        }
    })

    /*******************码流类型选择*******************/
    $("#StreamSelect").change(function() {
        Type = $("#StreamSelect").children('option:selected').val();
        SetPlayStream(Type);
    })
    /*****************为解决resize窗口时，IE多次响应的问题*********************/
    var debounce = function(func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
            args = arguments;
            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            };
            if (timeout) clearTimeout(timeout);
            else if (execAsap) func.apply(obj, args);
            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    /*窗口缩放时的控件处理*/
    window.onresize = debounce(function() {
		return true;
		/*还在登录不处理*/
		if($("#mainpageLayer").css("display") =="none")
			return true;

        var BrowserType = GetBrowserVer();
		var ImageSize = parseInt($("#ImageSize").children('option:selected').val());
        if ((ImageSize == 0)) //IE OCX
        {
            var PlayerWH = GetPlayerLayerWidthHeight();
			PlayerResize(PlayerWH.w, PlayerWH.h);
        }
        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        var VideoWH = GetVideoWidthHeight();
        width = parseInt(VideoWH.w) + parseInt($('#LeftToolLayerLayer').css('width'));
        if (width > document.documentElement.clientWidth) {
            width += 10;
            width += 'px';
            $('#mainpageLayer').css('width', width);
			$('#headerLayer').css('width', width);
        } else {
            width = document.documentElement.clientWidth;
            width += 'px';
            $('#mainpageLayer').css('width', width);
			$('#headerLayer').css('width', width);
        }

    },
    100, true);

    /********************登录确认***********************/
    $('#Login').click(function() {

        var url = "/cgi-bin/hi3510/checkuser.cgi?";
        url += ("&-name=" + $("#LonginUsername").val());
        url += ("&-passwd=" + $("#LonginPassword").val());
		url += "&-time=" + new Date().getTime();
        $.get(url,
        function(data) {
            eval(data);
            if (check == 1) {
		
                delCookie("username");
                setCookie("username", Base64.encode($("#LonginUsername").val()), 365);
                delCookie("password");
                setCookie("password", Base64.encode($("#LonginPassword").val()), 365);
				delCookie("authLevel");
				setCookie("authLevel", authLevel, 365);
				
				$("#ContainerLayer").css("display", "block");
                $("#headerLayer").css("display", "block");
                $("#mainpageLayer").css("display", "block");
                $("#LogoutLayer").css("display", "block");
                $("#LoginLayer").css("display", "none");

		$("div#OCXCtlLayer").css("top", $("div#headerLayer").offset().top + $("div#headerLayer").outerHeight(true) + 5);

                if (parseInt($("#StreamSelect").children('option:selected').val()) == 11) $("#StreamSelect1").get(0).selectedIndex = 0;
                else $("#StreamSelect1").get(0).selectedIndex = 1;

				BrowerType = GetBrowserVer();
                if ((BrowerType.brower == "IE")) {
                    $("#OCXCtlLayer").css('display', 'inline-block');
                } else {
                    $("#OCXCtlLayer").css('display', 'none');                   
                }

                if(false == StartPlay())
				{
					alert(DownLoadPlayerMsg);
					return 0;
				}
				StartTalk(0);
				SetMute(1);	

            } else {
                $('#LoginLayer').css('display', 'block');
                alert(LoginCheckErrorMsg);
            }

        });

    })

    $('#ImageSize').change(function() {
		size = Number($(this).children('option:selected').val());
        switch (size) {
        case 0:
            var PlayerWH = GetPlayerLayerWidthHeight();
			w = PlayerWH.w;
			h = PlayerWH.h;
            break;
        case 1:
            switch (GetPlayStream()) {
            case '11':
                w = w_1;
                h = h_1;
                break;
            case '12':
                w = w_2;
                h = h_2;
                break;
            }
            break;
        }
		 PlayerResize(w, h);
        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        width = parseInt(w) + parseInt($('#LeftToolLayerLayer').css('width'));
        if (width > document.documentElement.clientWidth) {
            width += 50;
			width += parseInt($("#DisplayareaLayer").css("margin-left"));
            width += 'px';
			
            $('#mainpageLayer').css('width', width);
        }
		else
		{
			width = document.documentElement.clientWidth;
			width += 10;
			 width += 'px';
			 $('#mainpageLayer').css('width', width);
		}
    });



    /*************************主页码流或控件重新选择*****************************/
    $('#StreamSelect1').change(function() {

        SetPlayStream($("#StreamSelect1").children('option:selected').val());
        StreamType = parseInt($("#StreamSelect1").children('option:selected').val());
        RePlay(GetPlayerLayerWidthHeight().w, GetPlayerLayerWidthHeight().h);

        /***************调整mainpageLayer大小，让它能同时显示视频和左侧工具栏******************/
        var VideoWH = GetVideoWidthHeight();
        width = parseInt(VideoWH.w) + parseInt($('#LeftToolLayer').css('width'));

//        $("#DisplayareaLayer").css("margin-left", "5px");
        if (width > document.documentElement.clientWidth) {
            width += 'px';
            $('#mainpageLayer').css('width', width);
        }
		
		$("#RecordSwitch").css("display", "inline-block");
		$("#RecordIngSwitch").css("display", "none");
		$("#VolOnSwitch").css("display", "none");
		$("#VolOffSwitch").css("display", "inline-block");
		$("#MicroOnSwitch").css("display", "none");
		$("#MicroOffSwitch").css("display", "inline-block");
		
        $("#ImageSize").get(0).selectedIndex = 0;
    })




    $('#AutoLogin').click(function() {
        if ($(this).prop("checked") == true) {
            SetAutoLogin(1)
        } else {
            SetAutoLogin(0)
        }

    })

 


   $('#RecordSwitch, #RecordIngSwitch').click(function() {
		ret = Record();
        if (($(this).attr("id") == "RecordSwitch") && (ret == 1)) {
		$("#RecordSwitch").css("display", "none");
		$("#RecordIngSwitch").css("display", "inline-block");
        } else {
		 	$("#RecordSwitch").css("display", "inline-block");
		$("#RecordIngSwitch").css("display", "none");
        }
    })

    $('#CaptureSwitch').click(function() {
        Snap();
    });

    $('#PlaybackSwitch').click(function() {
        PlayBack();
    });
	
    $('#MicroOnSwitch, #MicroOffSwitch').click(function() {		
        if ($(this).attr("id") == "MicroOnSwitch") {
			ret = StartTalk(1);
			if(ret == true){
				$(this).css("display", "none");
				$("#MicroOffSwitch").css("display", "inline-block");
			}
            
        } else {
			 ret = StartTalk(0);
			 if(ret == true){
			$(this).css("display", "none");
			$("#MicroOnSwitch").css("display", "inline-block");
			 }
        }
    });
    $('#VolOnSwitch, #VolOffSwitch').click(function() {
		
        if ($(this).attr("id") == "VolOffSwitch") {
			 ret = SetMute(0);
			 if(ret == true){
				 $(this).css("display", "none");
				$("#VolOnSwitch").css("display", "inline-block");
			 }
        } else {
			ret = SetMute(1);
			 if(ret == true){
				$(this).css("display", "none");
				$("#VolOffSwitch").css("display", "inline-block");
			 }
        }
    })

    /******************登录确认输入*************************/
    $("#LoginLayer").keydown(function(event) {
        if (event.which == 13) //Enter
        $('#Login').click();
    })

    $('.header a').mouseenter(function() {
        $(this).css('background', '#F00');
    });

    $('.header a').mouseleave(function() {
        $(this).css('background', '#1e1e1e');
    })
	
	CheckAuth = function(){
		var authLevel = getCookie("authLevel");
        if (authLevel != "255"){
			return false;
        }
		return true;	
	}
 
})
