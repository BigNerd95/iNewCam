// JavaScript Document
$(function() {


    $(document).ready(function(e) {
        LoadLanguage();

        AlarmInLoad();
        AlarmOutLoad();
		
		setTimeout(function(){$("body").css("display", "block");}, 100);

    });

    AlarmInLoad = function() {

        var form = document.form1;
        //Alarm_In
        if (aienable == 0) $("#AiEnable").prop("checked", false);
        else $("#AiEnable").prop("checked", true);

        $("#aiactivemode option[value=" + aiactivemode + "]").attr("selected", true);
	
	 /*****************联动处理***********************/
    $("input#emailbox").prop("checked", false);
	
	$("input#AlarmSnapInput").prop("checked", false);
    $("input#SendToEmail").prop("checked", false);
    $("input#SendToFtp").prop("checked", false);
	
	$("input#AlarmRecInput").prop("checked", false);
    $("input#FtpUploadRec").prop("checked", false);
	
	
    
	if (alarmin_email_switch == "on") //告警发送邮件
        $("input#emailbox").prop("checked", true);
	
	if( alarmin_snap_switch == "on")//告警触发抓拍
		$("input#AlarmSnapInput").prop("checked", true);

    if (alarmin_emailsnap_switch == "on") {//email发送图片 
        $("input#emailbox").prop("checked", true);
        $("input#SendToEmail").prop("checked", true);
    }

    if (alarmin_ftpsnap_switch == "on") //ftp上传图片
        $("input#SendToFtp").prop("checked", true);

  	if (alarmin_record_switch == "on") //告警触发录像
		$("input#AlarmRecInput").prop("checked", true);
    
    if (alarmin_ftprec_switch == "on") //ftp上传录像
        $("input#FtpUploadRec").prop("checked", true);

	if(alarmin_ioalmdo_switch == "on")
		$("input#mdalarmoutbox").prop("checked", true);
		
		if($("input#AlarmSnapInput").prop("checked") == true)
		{
			$("#SendPicLayer").css("display", "inline-block");
			$("input#SendToEmail").removeAttr("disabled");
			$("input#SendToFtp").removeAttr("disabled");	
		}
		else {
			$("#SendPicLayer").css("display", "none");
			$("input#SendToEmail").attr("disabled", "disabled");
			$("input#SendToFtp").attr("disabled", "disabled");	
		}
		
	
		if($("input#AlarmRecInput").prop("checked") == true){
			$("#UploadRecLayer").css("display", "inline-block");
			$("input#FtpUploadRec").removeAttr("disabled");
		}
		else {
			$("#UploadRecLayer").css("display", "none");
			$("input#FtpUploadRec").attr("disabled", "disabled");
		}

	
	
	

        //alarm in schedule
        if (etm == 0)
        /***********Use the week mode*****************/
        {
            $("input:radio[name='aimode_radio']").get(0).checked = true;
        } else if (etm == 1)
        /***********Use the work mode*****************/
        {
            $("input:radio[name='aimode_radio']").get(1).checked = true;
        } else
        /***********All times day *****************/
        {
            $("input:radio[name='aimode_radio']").get(2).checked = true;
        }
        
		
		/*没有SD卡不让开启录像*/

	if(sdstatus == "out")
	{
		$("#AlarmRecLayer").remove();
	}
	else
	{
		if(alarmin_record_switch=="on")$("#AlarmRecInput").prop("checked", true);
		else $("#AlarmRecInput").prop("checked", false);
	}

    }
/*
    $("#AiSendMail").click(function() {
        if ($("#AiSendMail").is(':checked') == true) $("#aisendpiclayer").css("display", "inline");
        else $("#aisendpiclayer").css("display", "none");
    })
*/
    $(" select[name='aisun_endHour']").change(function() {
        do_aiendHour($(" select[name='aisun_endHour']").index($(this)));
    });

    do_aiendHour = function(key) {
        if ($("select[name='aisun_endHour']:eq(" + key + ") option:selected").text() == "24") {
            $("select[name='aisun_endMinute']:eq(" + key + ") ").get(0).selectedIndex = 0;
            $("select[name='aisun_endMinute']:eq(" + key + ")").attr("disabled", "disabled");
        } else {
            $("select[name='aisun_endMinute']:eq(" + key + ")").removeAttr("disabled");

        }
    }

    function AlarmInSubmit() {
        var form1 = document.form1;
        var form = document.form2;

        //Alarm In
        $("#Form2Aienable").prop("name", "-aienable");
        $("#Form2Aienable").prop("value", ($("#AiEnable").prop("checked") == true) ? 1 : 0);

        /***********************Low or High*************************/
        $("#Form2Aiactivemode").prop("name", "-aiactivemode");
        $("#Form2Aiactivemode").prop("value", $("#aiactivemode").val());

        /************send email******************/
	if($("input#emailbox").prop("checked") == true)$("#Form2SendEmailSwitch").val("on");
	
	if($("input#AlarmSnapInput").prop("checked") == true)$("#Form2SnapSwitch").val("on");
	
	if($("input#SendToEmail").prop("checked") == true)$("#Form2EmailSnapSwitch").val("on");
	
	if($("input#SendToFtp").prop("checked") == true)$("#Form2FtpSnapSwitch").val("on");
	
	if($("input#AlarmRecInput").prop("checked") == true)$("#Form2RecordSwitch").val("on");
	
	if($("input#FtpUploadRec").prop("checked") == true)$("#Form2FtpRecordSwitch").val("on");
	
	if($("input#mdalarmoutbox").prop("checked") == true)$("#Form2AlarmOutSwitch").val("on");

        /************* Use the week mode***************************/
        if (form1.aimode_radio[0].checked == true) {
            document.getElementById('Form2Aietm').name = "-etm";
            document.getElementById('Form2Aietm').value = 0;
        } else if (form1.aimode_radio[1].checked == true) {
            document.getElementById('Form2Aietm').name = "-etm";
            document.getElementById('Form2Aietm').value = 1;
        } else {
            document.getElementById('Form2Aietm').name = "-etm";
            document.getElementById('Form2Aietm').value = 2;
        }
		
		SaveTimePlan();
		
        document.getElementById('Form2Aiwk0').name = "-week0";
        document.getElementById('Form2Aiwk1').name = "-week1";
        document.getElementById('Form2Aiwk2').name = "-week2";
        document.getElementById('Form2Aiwk3').name = "-week3";
        document.getElementById('Form2Aiwk4').name = "-week4";
        document.getElementById('Form2Aiwk5').name = "-week5";
        document.getElementById('Form2Aiwk6').name = "-week6";
        document.getElementById('Form2Aiwrkday').name = "-workday";
        document.getElementById('Form2Aiwkend').name = "-weekend";

        document.getElementById('Form2Aitype').name = "-type";
        document.getElementById('Form2Aiename').name = "-ename";

        return true;
    }

function SaveTimePlan(){
	   var startTime = 0;
        var endTime = 0;
        var i, j, k;
        var first = 0;

        /************* Use the week mode***************************/
        if (form1.aimode_radio[0].checked == true) {
            weekstart = 0;
            weekend = 7;
        } else if (form1.aimode_radio[1].checked == true) {
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
                obj = document.getElementById('Form2Aiwrkday');
            } else if ((weekend == 9) && (i == 8))
            /*Use the work mode */
            {
                obj = document.getElementById('Form2Aiwkend');
            } else
            /*Use the week mode */
            {
                obj = document.getElementById("Form2Aiwk" + i);
            }
            obj.value = "none";
            first = 0;
			checked = $("#TimeFrame")[0].contentWindow.$("input:checkbox[name='daycheck']").get(i).checked;
            if (checked == true)
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
                        alert(ErrorMsg);
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
}

    $("#weekmodeCleanSpan, #workmodeCleanSpan").click(function() {

        if ($(this).attr("id") == 'workmodeCleanSpan') $("#WorkmodeLayer select").val(0);
        else $("#WeekmodeLayer select").val(0);

        return true;
    })

    $("#workmodeCloseSpan, #weekmodeCloseSpan").click(function() {
        if ($(this).attr("id") == "workmodeCloseSpan") $("#WorkmodeLayer").dialog("close");
        else $("#WeekmodeLayer").dialog("close");

    })

    AlarmOutLoad = function() {
        var form = document.form1;
        //Alarm_out
        if (aoenable == 0) {
            $("#aoenable").prop("checked", false);
        } else {
            $("#aoenable").prop("checked", true);
        }

        if (aoactivemode == 0) {
            $("select[name='aoactivemode']").get(0).selectedIndex = 0;
        } else {
            $("select[name='aoactivemode']").get(0).selectedIndex = 1;
        }

        $("input[name='aocontinue']").val(aocontinuetime);
    }

    function AlarmOutSubmit() {
        var form1 = document.form1;
        var form = document.form2;

        form.cururl.value = document.URL;
        //Alarm_out
        aoenable = document.getElementById('Form2Aoenable');
        aoenable.name = "-aoenable";
        if (form1.aoenable.checked == false) {
            aoenable.value = 0;
        } else {
            aoenable.value = 1;
        }

        aoactivemode = document.getElementById('Form2AoactiveMode');
        aoactivemode.name = "-aoactivemode";
        aoactivemode.value = form1.aoactivemode[form1.aoactivemode.selectedIndex].value;

        aocontinue = document.getElementById('Form2Aocontinue');
        aocontinue.name = "-aocontinue";
        aocontinue.value = form1.aocontinue.value;

        //Alarm_out
        aoenable = document.getElementById('Form2Aoenable');
        aoenable.name = "-aoenable";
        if (form1.aoenable.checked == false) {
            aoenable.value = 0;
        } else {
            aoenable.value = 1;
        }

        aoactivemode = document.getElementById('Form2AoactiveMode');
        aoactivemode.name = "-aoactivemode";
        aoactivemode.value = form1.aoactivemode[form1.aoactivemode.selectedIndex].value;

        aocontinue = document.getElementById('Form2Aocontinue');
        aocontinue.name = "-aocontinue";
        aocontinue.value = form1.aocontinue.value;

    }

	$("#TimeSetSpan").click(function(){

	if($('#TimeFrameLayer').css('display') == "block")
	{
		$('#TimeFrameLayer').css('display', "none");
		$('div[class=ApplyLayerStyle]').removeAttr("style");
		$('div[class=CancelLayerStyle]').removeAttr("style");
	}
	else
	{
		$('#TimeFrameLayer').css('display', 'block');
		$('div[class=ApplyLayerStyle]').css("top", $(document).height() + "px");	
		$('div[class=CancelLayerStyle]').css("top", $('div[class=ApplyLayerStyle]').css("top"));
	}

	return true;
})

	$("input[type=radio][name=aimode_radio]").click(function(){
		if($(this).val() == 0)
		{
			$("#TimeFrame")[0].contentWindow.$("#WeekmodeLayer").css('display', "block");
			$("#TimeFrame")[0].contentWindow.$("#WorkmodeLayer").css('display', "none");
		}
		else if($(this).val() == 1)
		{
			$("#TimeFrame")[0].contentWindow.$('#WeekmodeLayer').css('display', "none");
			$("#TimeFrame")[0].contentWindow.$('#WorkmodeLayer').css('display', "block");
		}		
	})
	

    $("#apply").click(function() {
        AlarmInSubmit();
        AlarmOutSubmit();
        var form = document.form2;
        form.cururl.value = document.URL;
        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    })
	
	
	$("input#AlarmSnapInput").click(function(){
		if($(this).prop("checked") == true){
			$("#SendPicLayer").css("display", "inline-block");
			$("input#SendToEmail").removeAttr("disabled");
			$("input#SendToFtp").removeAttr("disabled");	
		}
		else {
			$("#SendPicLayer").css("display", "none");
			$("input#SendToEmail").prop("checked", false);
			$("input#SendToEmail").attr("disabled", "disabled");
			$("input#SendToFtp").prop("checked", false);
			$("input#SendToFtp").attr("disabled", "disabled");	
		}
	})
	
		$("input#AlarmRecInput").click(function(){
		if($(this).prop("checked") == true){
			$("#UploadRecLayer").css("display", "inline-block");
			$("input#FtpUploadRec").removeAttr("disabled");
		}
		else {
			$("#UploadRecLayer").css("display", "none");
			$("input#FtpUploadRec").prop("checked", false);
			$("input#FtpUploadRec").attr("disabled", "disabled");
		}
	})
	
	$("input#SendToEmail").click(function(){
		if($(this).prop("checked")==true)
			$("input#emailbox").prop("checked", true);	
		else
		{
				if(alarmin_email_switch =="off")
				$("input#emailbox").prop("checked", false);	
		}	
	})
	

	$("input#emailbox").click(function(){
		if($(this).prop("checked") == false)
			$("input#SendToEmail").prop("checked", false);
	})

})