// JavaScript Document
$(function() {

    var PTZ_MAX_TOUR_NUM = 4; //巡航路数
    var PTZ_MAX_PRESET_NUM = 8; //预置点数
    var PTZ_MAX_TOUR_PRESET_NUM = 4; //每条巡航线程的预置点个数
	var IsPtzMotor = 0;//是否为电机
    /*多语言加载*/
    $(document).ready(function(e) {

        /*找出对应的网页字句*/
        pathname = window.location.pathname;
        htmlname = pathname.substr(pathname.lastIndexOf("/") + 1, pathname.length);

        if (htmlname.split('.')[0] == "ptz") { //只有在PTZ页面才加载
            if (ptztype == 1) { //电机
			
                /************插入4条巡航**********/
                for (i = 0; i < PTZ_MAX_TOUR_NUM; i++) {
                    for (j = PTZ_MAX_TOUR_PRESET_NUM; j > 0; j--) {
                        var id = "Track" + i + "select" + j;
                        $('#Track' + i + 'Span').after('<select id=' + id + ' style="width:60px; margin-right:5px;"></select>');
                    }
                    for (j = PTZ_MAX_TOUR_PRESET_NUM; j > 0; j--) {
						
						/***********插入预置点************/
                        var id = "#Track" + i + "select" + j;
                        $(id).append('<option>' + "0" + '</option>');
                        for (k = 1; k < PTZ_MAX_PRESET_NUM+1; k++) {
                            $(id).append('<option>' + k + '</option>');
                        }
						
						/*************判断那些预置点已经使能************/
						$(id).children("option").each(function(index, element) {
							
							if(index == 0)
								return 0;						
								
							var pointStat = "point" + index +"Stat";
							
							if(typeof(pointStat) != "undefined"){
								if(eval(pointStat) == 1){
									$(this).css("color", "#F00");
								}
							}	
						});

                    }

                }
            }

            LoadLanguage();
            ptz_on_load();

            setTimeout(function() {
                $("body").css("display", "block");
            },
            100);

        } else if (htmlname.split('.')[0] == "index") {

            var cgiurl = "http://" + window.document.location.host + "/cgi-bin/hi3510/param.cgi?cmd=getptzcfg&";

            $.get(cgiurl,
            function(data) {
                eval(data);
               // if (ptztype == 1) {
					 if (1) {
					IsPtzMotor = 1;
					
                    $("#PTZPosInput").remove();
                    $("#PtzPointSpan").append('<select id="PTZPosSelect" style="width:50px;" ></select>');
                    for (k = 1; k < PTZ_MAX_PRESET_NUM+1; k++) {
                        $("#PTZPosSelect").append('<option>' + k + '</option>');
                    }
					
                    $("#PTZPointLayer").after('<div id="PTZTrackLayer" style="padding:2px;"></div>');
                    $("#PTZTrackLayer").append('<label id="PtzTrackSpan">Track:</label>');
                    $("#PTZTrackLayer").append('<select id="PtzTrackSelect" style="width:50px;margin-left:13px;"></select>');
                    $("#PTZTrackLayer").append('<a id="GotoTrack" href="javascript:;"></a>');
					$("#PtzTrackSpan").html(PtzTrackSpan);

                    for (i = 1; i < PTZ_MAX_TOUR_NUM + 1; i++) {
                        $("#PtzTrackSelect").append('<option>' + i + '</option>');
                    }
					
					/*************判断那些断点已经使用了的************/
					$("#PTZPosSelect option").each(function(index, element) {
						
						var pointStat = "point" + parseInt(index+1) +"Stat";
						if(typeof(pointStat)!= "undefined")
							if(eval(pointStat) == 1){
                       			$(this).css("color", "#F00");
							}
                    });
					
                }
				else if(ptztype == 0)//485
				{
					/*增加速度*/
					if(!document.getElementById("PTZSpeedLayer"))
					{
						$("#PTZPointLayer").before('<div id="PTZSpeedLayer"></div>');
					}
					$("#PTZSpeedLayer").append('<span id="Speed485Span">Speed:</span>');
					$("#PTZSpeedLayer").append('<input id="Speed485Input" type="number"  maxlength="3" size="3" value="30"/>');
					
					$("#Speed485Span").html(Speed485Span);
				}

            },
            "text");

        }
    });

	/*************巡航控制************/
    $(document).on("click", "#GotoTrack",
    function() {
        var cgiurl = "http://" + window.document.location.host + "/cgi-bin/hi3510/ptzstarttour.cgi?&-tour=" + $("#PtzTrackSelect option:selected").index();
        $.get(cgiurl);
    })

    /*************云台控制************/
    $("#PtzLeftTop, #PtzTop, #PtzRightTop,  #PtzLeft,#PtzStop,  #PtzRight, #PtzLeftDown, #PtzDown, #PtzRightDown, #PtzFocusAdd, #PtzFocusSub, #PtzZoomAdd, #PtzZoomSub").mouseup(function() {
		if(!document.getElementById("Speed485Input"))
		{
       	 speed = 31;
		}
		else
		{
			speed = $("#Speed485Input").val();
		}
        cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
		
		if(($(this).attr("id") == "PtzStop")&&(IsPtzMotor == 1))//云台电机的停止作为恢复原点
			return 0;
			
        $.get(cgicmd);
    })

    $("div#PtzCtrLayer a").mousedown(function() {

        if(!document.getElementById("Speed485Input"))
		{
       	 speed = 31;
		}
		else
		{
			speed = $("#Speed485Input").val();
		}

        switch ($(this).attr('id')) {
        case "PtzLeftTop":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=upleft&-speed=' + speed;
            break;
        case "PtzTop":
            cgicmd = '/cgi-bin/hi3510/ptzup.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzRightTop":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=upright&-speed=' + speed;

            break;
        case "PtzLeft":
            cgicmd = '/cgi-bin/hi3510/ptzleft.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzRight":
            cgicmd = '/cgi-bin/hi3510/ptzright.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzLeftDown":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=downleft&-speed=' + speed;
            break;
        case "PtzRightDown":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=downright&-speed=' + speed;
            break;
        case "PtzDown":
            cgicmd = '/cgi-bin/hi3510/ptzdown.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzStop":
			if(IsPtzMotor == 1)//云台电机的停止作为恢复原点
				cgicmd = '/cgi-bin/hi3510/ptzgotopoint.cgi?&-chn=0&-point=' + 0;
			else
            	cgicmd = '/cgi-bin/hi3510/ptzstop.cgi?&-chn=0&-speed=' + speed;
            break;
        case "PtzLRScan":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=hscan&-speed=' + speed;
            break;
        case "PtzUPScan":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=vscan&-speed=' + speed;
            break;
        case "PtzFocusAdd":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=foucesadd&-speed=' + speed;
            break;
        case "PtzFocusSub":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=foucessub&-speed=' + speed;
            break;
        case "PtzZoomAdd":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=zoomadd&-speed=' + speed;
            break;
        case "PtzZoomSub":
            cgicmd = '/cgi-bin/hi3510/ptzctrl.cgi?&-chn=0&-act=zoomsub&-speed=' + speed;
            break;
        default:
            return true;
            break;
        }
        $.get(cgicmd);

    });

    /****************限定数字输入*********************/
    $("#PTZPosInput, #Speed485Input").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })
	
	 $(document).on("keypress", "#Speed485Input",
    function(event) {
      if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    $('#GotoPoint, #SetPoint, #ClearPoint').click(function() {

		if(document.getElementById("PTZPosInput"))
        	point = parseInt($('#PTZPosInput').val());
		else
			point = parseInt($("#PTZPosSelect option:selected").index()+1);
		
        switch ($(this).attr('id')) {
        case "GotoPoint":
            cgicmd = '/cgi-bin/hi3510/ptzgotopoint.cgi?&-chn=0&-point=' + point;
            break;
        case "SetPoint":
            cgicmd = '/cgi-bin/hi3510/ptzsetpoint.cgi?&-chn=0&-point=' + point;
            break;
        case "ClearPoint":
            cgicmd = '/cgi-bin/hi3510/ptzclearpoint.cgi?&-chn=0&-point=' + point;
            break;
        }

        $.get(cgicmd);

    })

    ptz_on_load = function() {

        if (ptztype == 0) {

            /*协议*/
            $("#protocol option[value=" + protocol + "]").attr("selected", true);

            /*串口属性*/
            $("#baudrate option[value=" + baud + "]").attr("selected", true);
            $("#databit option[value=" + databits + "]").attr("selected", true);
            $("#stopbit option[value=" + stopbits + "]").attr("selected", true);
            $("#parity option[value=" + parity + "]").attr("selected", true);

            /*地址码*/
            $("#address_h option[value=" + (parseInt(address / 100)) + "]").attr("selected", true);
            $("#address_m option[value=" + (parseInt((address / 10) % 10)) + "]").attr("selected", true);
            $("#address_l option[value=" + (parseInt((address % 100) % 10)) + "]").attr("selected", true);

            $("div#Rs485Layer").css("display", "block");
            $("div#MontorLayer").css("display", "none");
            $("#TypeSelect option:eq(0)").prop("selected", true);
        } else {
			
			IsPtzMotor = 1;
			
            $("div#Rs485Layer").css("display", "none");
            $("div#MontorLayer").css("display", "block");
            $("#TypeSelect option:eq(1)").prop("selected", true);

            $("input[name=FlipGrp][value=" + flip + "]").prop("checked", true);
            $("input[name=MirrorGrp][value=" + mirror + "]").prop("checked", true);

            $("#PanspdSelect option[value=" + panspd + "]").attr("selected", true);
            $("#TiltspdSelect option[value=" + tiltspd + "]").attr("selected", true);
			$("#StayTimeSelect option[value=" + staytime + "]").attr("selected", true);
			$("#PatrolsSelect option[value=" + patrols + "]").attr("selected", true);
			
            for (i = 0; i < PTZ_MAX_TOUR_NUM; i++) {

                var TrackLayer = "#Track" + i + "Layer select";
                var Track = "track" + parseInt(i + 1);
                var tmp = eval(Track).split(",");
                var j = 0;

                $(TrackLayer).each(function(index, element) {
                    if (tmp[j] == -1) {
                        $(this).children("option:eq(0)").prop("selected", true);
                    } else {
                        $(this).children("option:eq(" + parseInt(tmp[j]) + ")").prop("selected", true);
                    }
                    j++;
                });
            }
        }
    }

    do_submit = function() {
        var form = document.form2;

        $("#Form2Type").attr("name", "-type");
        $("#Form2Type").attr("value", $("#TypeSelect").val());

        if ($("#TypeSelect").get(0).selectedIndex == 0) {
            /*串口属性*/
            $("#Form2Baud").attr("name", "-baudrate");
            $("#Form2Baud").attr("value", $("#baudrate").val());

            $("#Form2DataBit").attr("name", "-databit");
            $("#Form2DataBit").attr("value", $("#databit").val());

            $("#Form2StopBit").attr("name", "-stopbit");
            $("#Form2StopBit").attr("value", $("#stopbit").val());

            $("#Form2Parity").attr("name", "-parity");
            $("#Form2Parity").attr("value", $("#parity").val());

            /*地址码*/
            value = parseInt($("#address_h").val()) * 100 + parseInt($("#address_m").val()) * 10 + parseInt($("#address_l").val());

            if (value > 255) {
                alert(addressErrorMsg);
                return false;
            }
            $("#Form2Address").attr("name", "-address");
            $("#Form2Address").attr("value", value);

            /*协议*/
            $("#Form2Protocol").attr("name", "-protocol");
            $("#Form2Protocol").attr("value", $("#protocol").val());

            $("#Form2Flip").attr("disabled", "disabled");
            $("#Form2Mirror").attr("disabled", "disabled");
            $("#Form2Panspd").attr("disabled", "disabled");
            $("#Form2Tiltspd").attr("disabled", "disabled");
            $("#Form2Track1").attr("disabled", "disabled");
			$("#Form2StayTime").attr("disabled", "disabled");
			$("#Form2Patrols").attr("disabled", "disabled");
			
        } else {
            $("#Form2Baud").attr("disabled", "disabled");
            $("#Form2DataBit").attr("disabled", "disabled");
            $("#Form2StopBit").attr("disabled", "disabled");
            $("#Form2Parity").attr("disabled", "disabled");
            $("#Form2Protocol").attr("disabled", "disabled");

            $("#Form2Flip").attr("name", "-flip");
            $("#Form2Flip").attr("value", $("input[name=FlipGrp]:checked").val());

            $("#Form2Mirror").attr("name", "-mirror");
            $("#Form2Mirror").attr("value", $("input[name=MirrorGrp]:checked").val());
			
  			$("#Form2StayTime").attr("name", "-staytime");
            $("#Form2StayTime").attr("value", $("#StayTimeSelect option:selected").val());
			
			$("#Form2Patrols").attr("name", "-patrols");
            $("#Form2Patrols").attr("value", $("#PatrolsSelect option:selected").val());
			
            $("#Form2Panspd").attr("name", "-panspd");
            $("#Form2Panspd").attr("value", $("#PanspdSelect option:selected").val());


            $("#Form2Tiltspd").attr("name", "-tiltspd");
            //$("#Form2Tiltspd").attr("value", $("#TiltspdSelect option:selected").val());
			$("#Form2Tiltspd").attr("value", $("#PanspdSelect option:selected").val());

            var str = "";

            for (i = 0; i < 4; i++) {
                str = "";

                var Form2Track = "#Form2Track" + parseInt(i + 1);
                var tourName = "-tour" + parseInt(i + 1);
                var TrackLayer = "#Track" + i + "Layer select";
                $(Form2Track).attr("name", tourName);

                $(TrackLayer).each(function(index, element) {
                    if ($(this).children("option:selected").index() == 0) { //off
                        str += "off,"; //CGI无法解析负数，直接写off
                    } else {
                        str += ($(this).children("option:selected").index() + ',');
                    }
                });

                $(Form2Track).attr("value", str);
            }

        }
        form.cururl.value = document.URL;
        form.action = "cgi-bin/hi3510/param.cgi";

        form.submit();
    }

    $("#TypeSelect").change(function(e) {
        if ($(this).get(0).selectedIndex == 0) {
            $("#Rs485Layer").css("display", "block");
            $("#MontorLayer").css("display", "none");
        } else {
            $("#MontorLayer").css("display", "block");
            $("#Rs485Layer").css("display", "none");
        }

    });

})