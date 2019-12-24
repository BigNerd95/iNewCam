// JavaScript Document
$(function() {

    $(document).ready(function(e) {
        LoadLanguage();

        on_load();

        //加上一个时间，防止IE因为URL相同，而不去获取新的图片
        var snapurl = '/cgi-bin/hi3510/snap.cgi?&-time=' + new Date().getTime();

        setTimeout(function() {
            $("body").css("display", "block");
        },
        100);

    });

    $("#emailbox").click(function() {
        if ($("#emailbox").prop("checked") == true) {
            $("#sendpiclayer").css("display", "inline")
        } else {
            $("#sendpiclayer").css("display", "none")
        }
    })

    var maxcol = 20;
    var maxrow = 12;

    function on_load() {
        var form = document.form1;
        /*****************联动处理***********************/
        $("input#emailbox").prop("checked", false);
        $("input#AlarmSnapInput").prop("checked", false);
        $("input#SendToEmail").prop("checked", false);
        $("input#SendToFtp").prop("checked", false);

        $("input#AlarmRecInput").prop("checked", false);
        $("input#FtpUploadRec").prop("checked", false);

        if (md_email_switch == "on") //告警发送邮件
        $("input#emailbox").prop("checked", true);

        if (md_snap_switch == "on") //告警触发抓拍
        $("input#AlarmSnapInput").prop("checked", true);

        if (md_emailsnap_switch == "on") { //email发送图片 
            $("input#emailbox").prop("checked", true);
            $("input#SendToEmail").prop("checked", true);
        }

        if (md_ftpsnap_switch == "on") //ftp上传图片
        $("input#SendToFtp").prop("checked", true);

        if (md_record_switch == "on") //告警触发录像
        $("input#AlarmRecInput").prop("checked", true);

        if (md_ftprec_switch == "on") //ftp上传录像
        $("input#FtpUploadRec").prop("checked", true);

        if (md_ioalmdo_switch == "on") $("input#mdalarmoutbox").prop("checked", true);

        if (md_playaudio_switch == "on") $("input#mdalarmaudiobox").prop("checked", true);

        if ($("input#AlarmSnapInput").prop("checked") == true) {
            $("#SendPicLayer").css("display", "inline-block");
            $("input#SendToEmail").removeAttr("disabled");
            $("input#SendToFtp").removeAttr("disabled");
        } else {
            $("#SendPicLayer").css("display", "none");
            $("input#SendToEmail").attr("disabled", "disabled");
            $("input#SendToFtp").attr("disabled", "disabled");
        }

        if ($("input#AlarmRecInput").prop("checked") == true) {
            $("#UploadRecLayer").css("display", "inline-block");
            $("input#FtpUploadRec").removeAttr("disabled");
        } else {
            $("#UploadRecLayer").css("display", "none");
            $("input#FtpUploadRec").attr("disabled", "disabled");
        }
		
		 if (sdstatus == "out") {
            $("#AlarmRecLayer").remove();
        }

        /*****************MD区域***********************/
        if (MdbEnable == 1) {
            document.getElementById('mdenable').checked = true;
        } else {
            document.getElementById('mdenable').checked = false;
        }
		
		if (MdfbEnable == 1) {
            document.getElementById('mdfenable').checked = true;
        } else {
            document.getElementById('mdfenable').checked = false;
        }

        /**************计划模式******************/
        if (etm == 0)
        /***********Use the week mode*****************/
        {
            $("input[type=radio][name=mode_radio]").get(0).checked = true;
        } else if (etm == 1)
        /***********Use the work mode*****************/
        {
            $("input[type=radio][name=mode_radio]").get(1).checked = true;
        } else
        /***********All times day *****************/
        {
            $("input[type=radio][name=mode_radio]").get(2).checked = true;
        }

        document.getElementById('Sensibility').options[MdSensitiValue].selected = true;

        var rowno = 0,
        colno = 0,
        colbit = 0;
        /*cgi 返回的数组MdRegion转换成行列*/
        for (i = 0; i < MdRegion.length && (rowno < maxrow); i++) {
            for (j = 0; j < 8; j++) {
                colbit = (MdRegion[i] >> j) & 1;

                SetAlearselect(rowno, colno, colbit);

                colno++;
                if (colno >= maxcol) //超过一行的个数，则换成下一行
                {
                    colno = 0;
                    rowno++
                }
                if (rowno >= maxrow) break;
            }
        }

        return true;
    }

    $("#apply").click(function() {

        var form = document.form2;
        var form1 = document.form1;
        var tname;
        var rownum;
        rownum = GetAlearselect(0);

        form.cururl.value = document.URL;

        if ($("input#emailbox").prop("checked") == true) $("#Form2SendEmailSwitch").val("on");

        if ($("input#AlarmSnapInput").prop("checked") == true) $("#Form2SnapSwitch").val("on");

	
        if ($("input#SendToEmail").prop("checked") == true)
		{
			 $("#Form2EmailSnapSwitch").val("on");
			 $("#Form2SendEmailSwitch").val("off");
		}

        if ($("input#SendToFtp").prop("checked") == true) $("#Form2FtpSnapSwitch").val("on");

        if ($("input#AlarmRecInput").prop("checked") == true) $("#Form2RecordSwitch").val("on");

        if ($("input#FtpUploadRec").prop("checked") == true) $("#Form2FtpRecordSwitch").val("on");

        if ($("input#mdalarmoutbox").prop("checked") == true) $("#Form2AlarmOutSwitch").val("on");
	
        if ($("input#mdalarmaudiobox").prop("checked") == true) $("#Form2AlarmAudioSwitch").val("on");

        /************* Use the week mode***************************/
        if ($("input[type=radio][name=mode_radio]:checked").val() == 0) {
            document.getElementById('Form2Etm').name = "-etm";
            document.getElementById('Form2Etm').value = 0;
        } else if ($("input[type=radio][name=mode_radio]:checked").val() == 1) {
            document.getElementById('Form2Etm').name = "-etm";
            document.getElementById('Form2Etm').value = 1;
        } else {
            document.getElementById('Form2Etm').name = "-etm";
            document.getElementById('Form2Etm').value = 2;
        }
        SaveTimePlan();

        document.getElementById('Form2Wk0').name = "-week0";
        document.getElementById('Form2Wk1').name = "-week1";
        document.getElementById('Form2Wk2').name = "-week2";
        document.getElementById('Form2Wk3').name = "-week3";
        document.getElementById('Form2Wk4').name = "-week4";
        document.getElementById('Form2Wk5').name = "-week5";
        document.getElementById('Form2Wk6').name = "-week6";
        document.getElementById('Form2Wrkday').name = "-workday";
        document.getElementById('Form2Wkend').name = "-weekend";

        document.getElementById('Form2Type').name = "-type";
        document.getElementById('Form2Ename').name = "-ename";
        document.getElementById('Form2Etm').name = "-etm";

        /*****************MD区域***********************/
        for (i = 0; i < 32; i++) {
            document.getElementById('Form2MdRegion' + i).value = 0;
            document.getElementById('Form2MdRegion' + i).name = '-region' + i;
        }
        k = 0;
        m = 0;
        for (i = 0; i < maxrow; i++) {
            for (j = 0; j < maxcol; j++) {
                colbit = GetAlearselect(i, j);
                document.getElementById('Form2MdRegion' + m).value |= (colbit << k);
                k++;
                if (k >= 8) {
                    k = 0;
                    m++;
                }
            }
        }

        document.getElementById('Form2MdEnable').name = "-enable";
        document.getElementById('Form2MdEnable').value = (document.getElementById('mdenable').checked == true) ? 1 : 0;
		
		document.getElementById('Form2MdfEnable').name = "-motionf";
        document.getElementById('Form2MdfEnable').value = (document.getElementById('mdfenable').checked == true) ? 1 : 0;
		
        document.getElementById('Form2MdSensitive').name = "-s";
        document.getElementById('Form2MdSensitive').value = document.getElementById('Sensibility').selectedIndex;

        document.getElementById('Form2MdChn').name = "-chn";
        document.getElementById('Form2MdChn').value = 1;

        document.getElementById('Form2MdName').name = "-name";
        document.getElementById('Form2MdName').value = "1";

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    })

    function SaveTimePlan() {

        var startTime = 0;
        var endTime = 0;
        var i, j, k;
        var first = 0;

        /************* Use the week mode***************************/
        if ($("input[type=radio][name=mode_radio]:checked").val() == 0) {
            weekstart = 0;
            weekend = 7;
        } else if ($("input[type=radio][name=mode_radio]:checked").val() == 1) {
            weekstart = 7; //work mode下控件从7开始算
            weekend = 9;
        } else {
            weekstart = 0;
            weekend = 0;
        }

        for (i = weekstart; i < weekend; i++)
        /* work or week*/
        {
            if ((weekend == 9) && (i == 7))
            /*Use the work mode */
            {
                obj = document.getElementById('Form2Wrkday');
            } else if ((weekend == 9) && (i == 8))
            /*Use the work mode */
            {
                obj = document.getElementById('Form2Wkend');
            } else
            /*Use the week mode */
            {
                obj = document.getElementById("Form2Wk" + i);
            }
            obj.value = "none";
            first = 0;

            if ($("#TimeFrame")[0].contentWindow.$("input:checkbox[name='daycheck']").get(i).checked == true)
            /*当天有效*/
            {
                var weekDay = new Array();

                weekDay[0] = "";
                weekDay[1] = "";
                weekDay[2] = "";

                for (j = 0; j < 3; j++)
                /*当天内三段时间*/
                {
                    k = i * 3 + j;
                    /*当前IPC的精度 为15分钟，所以一个小时被分成3段*/
                    sun_startHour = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_startHour']").get(k).selectedIndex);
                    sun_startMinute = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_startMinute']").get(k).selectedIndex);
                    sun_endHour = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_endHour']").get(k).selectedIndex);
                    sun_endMinute = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_endMinute']").get(k).selectedIndex);

                    startTime = sun_startHour * 4 + sun_startMinute;
                    endTime = sun_endHour * 4 + sun_endMinute;

                    /*时间合法性检查*/
                    if (startTime > endTime)
                    /*非法*/
                    {
                        alert(MdErrorMsg);
                        return false;
                    } else if (startTime == endTime)
                    /*如果时间相等，则不处理*/
                    {
                        continue;
                    } else
                    /*开始时间小于结束时间*/
                    {
                        //endTime = endTime - 1;
                        weekDay[j] = startTime + "~" + endTime;

                        if (first != 0)
                        /*分割开每个时间段*/
                        {
                            obj.value += ",";
                            obj.value += weekDay[j];
                        } else {
                            obj.value = weekDay[j];
                            first = 1;
                        }
                    }
                }
            }
        }

        return true;
    }

    $("input[type=radio][name=mode_radio]").click(function() {
        if ($(this).val() == 0) {
            $("#TimeFrame")[0].contentWindow.$("#WeekmodeLayer").css('display', "block");
            $("#TimeFrame")[0].contentWindow.$("#WorkmodeLayer").css('display', "none");
        } else if ($(this).val() == 1) {
            $("#TimeFrame")[0].contentWindow.$('#WeekmodeLayer').css('display', "none");
            $("#TimeFrame")[0].contentWindow.$('#WorkmodeLayer').css('display', "block");
        }
    })

    $("#MdTimeSpan").click(function() {

        if ($('#TimeFrameLayer').css('display') == "block") {
            $('#TimeFrameLayer').css('display', "none");
            $('div[class=ApplyLayerStyle]').removeAttr("style");
            $('div[class=CancelLayerStyle]').removeAttr("style");
        } else {
            $('#TimeFrameLayer').css('display', 'block');
            $('div[class=ApplyLayerStyle]').css("top", $(document).height() + "px");
            $('div[class=CancelLayerStyle]').css("top", $('div[class=ApplyLayerStyle]').css("top"));
        }

        return true;
    })

    $("input#AlarmSnapInput").click(function() {
        if ($(this).prop("checked") == true) {
            $("#SendPicLayer").css("display", "inline-block");
            $("input#SendToEmail").removeAttr("disabled");
            $("input#SendToFtp").removeAttr("disabled");
        } else {
            $("#SendPicLayer").css("display", "none");
            $("input#SendToEmail").prop("checked", false);
            $("input#SendToEmail").attr("disabled", "disabled");
            $("input#SendToFtp").prop("checked", false);
            $("input#SendToFtp").attr("disabled", "disabled");
        }
    })

    $("input#AlarmRecInput").click(function() {
        if ($(this).prop("checked") == true) {
            $("#UploadRecLayer").css("display", "inline-block");
            $("input#FtpUploadRec").removeAttr("disabled");
        } else {
            $("#UploadRecLayer").css("display", "none");
            $("input#FtpUploadRec").prop("checked", false);
            $("input#FtpUploadRec").attr("disabled", "disabled");
        }
    })

    $("input#SendToEmail").click(function() {
        if ($(this).prop("checked") == true) $("input#emailbox").prop("checked", true);
        else {
            if (md_email_switch == "off") $("input#emailbox").prop("checked", false);
        }
    })

    $("input#emailbox").click(function() {
        if ($(this).prop("checked") == false) $("input#SendToEmail").prop("checked", false);
    })

})