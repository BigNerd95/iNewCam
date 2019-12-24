// JavaScript Document
$(function() {
    /*多语言加载*/
    $(document).ready(function(e) {
        LoadLanguage();
        on_load();
        setTimeout(function() {
            $("body").css("display", "block");
        },
        100);
    });

    function on_load() {
        var recchn = 11;

        /***********所有通道都没有录像，从cookies读取通道*********/
        if ((startTimerRec_1 == "off") && (startManualRec_1 == "off") && (startTimerRec_2 == "off") && (startManualRec_2 == "off")) {
            if (false == checkCookie("recchn")) {
                setCookie("recchn", 11, 365);
            } else {
                recchn = getCookie("recchn");
            }
        } else if ((startTimerRec_1 == "on") || (startManualRec_1 == "on")) {
            recchn = 11;
        } else if ((startTimerRec_2 == "on") || (startManualRec_2 == "on")) {
            recchn = 12;
        }

        if (recchn == 11) //主码流
        {
            $("select#RecStreamSelect").children("option:eq(0)").prop("selected", true);
        } else //子码流
        {
            $("select#RecStreamSelect").children("option:eq(1)").prop("selected", true);
        }

        if ((startTimerRec_1 == "on") || (startTimerRec_2 == "on")) {
            $("#timerrecOn").prop("checked", true);
        } else {
            $("#timerrecOff").prop("checked", true);
        }

        if ((startManualRec_1 == "on") || (startManualRec_2 == "on")) {
            $("#manualrecOn").prop("checked", true);
        } else {
            $("#manualrecOff").prop("checked", true);
        }

        $("select#filetime option").each(function(index, element) {
            if ($(this).val() == Number(singlefiletime_1)) {
                $(this).prop("selected", true);
            }
        });

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

    }

    $("#apply").click(function(e) {
        do_submit();
    });

    function do_submit() {

        var form = document.form2;

        chn = $("select#RecStreamSelect").children("option:selected").val();

        setCookie("recchn", chn, 365);

        form.cururl.value = document.URL;

        $("#Form2Chn1").attr('name', "-chn");
        $("#Form2Chn1").attr('value', 11);

        $("#Form2FileTime1").attr('name', "-filetime");
        $("#Form2FileTime1").attr('value', $("#filetime").val());

        $("#Form2Chn2").attr('name', "-chn");
        $("#Form2Chn2").attr('value', 12);

        $("#Form2FileTime2").attr('name', "-filetime");
        $("#Form2FileTime2").attr('value', $("#filetime").val());

        $("#Form2Timesheetname").attr('name', "-timesheetname");
        $("#Form2Timesheetname").attr('value', "timesheet1");

        $("#Form2ManualReccmd").attr('name', "cmd");
        $("#Form2ManualRecChn").attr('name', "-chn");
        $("#Form2ManualRecChn").attr('value', chn);
        $("#Form2ManualRecType").attr('name', "-triger");
        $("#Form2ManualRecType").attr('value', 4);

        if ($("#manualrecOn").prop("checked") == true) {
            $("#Form2ManualReccmd").attr('value', "startrec");
        } else {
            if (startManualRec_1 == "on") {
                $("#Form2ManualRecChn").attr('value', 11);
            } else if (startManualRec_2 == "on") {
                $("#Form2ManualRecChn").attr('value', 12);
            }
            $("#Form2ManualReccmd").attr('value', "stoprec");
        }

        $("#Form2TimerReccmd").attr('name', "cmd");
        $("#Form2TimerRecChn").attr('name', "-chn");


        $("#Form2TimerRecChn").attr('value', chn);
        $("#Form2TimerRecType").attr('name', "-triger");
        $("#Form2TimerRecType").attr('value', 1);

        if ($("#timerrecOn").prop("checked") == true) {
            $("#Form2TimerReccmd").attr('value', "startrec");
        } else {
            if (startTimerRec_1 == "on") {
                $("#Form2TimerRecChn").attr('value', 11);
            } else if (startTimerRec_2 == "on") {
                $("#Form2TimerRecChn").attr('value', 12);
            }
            $("#Form2TimerReccmd").attr('value', "stoprec");
        }

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
        document.getElementById('Form2Etm').name = "-etm";

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    }

    $("select#RecStreamSelect").change(function(e) {
        var chn = $(this).children("option:selected").val();
        if (chn == 12) //子码流
        {
            var filetime = Number(filetime_2);
            var manualrecstart = Number(manualrecstart_2);
        } else //主码流
        {
            var filetime = Number(filetime_1);
            var manualrecstart = Number(manualrecstart_1);
        }
        /*
        if (Number(filetime) == 0) {
            $("#filetime").val(0);
        } else if ((filetime > 0) && (filetime <= 60)) {
            $("#filetime").val(60);
        } else if ((filetime > 60) && (filetime <= 300)) {
            $("#filetime").val(300);
        } else if ((filetime > 300) && (filetime <= 600)) {
            $("#filetime").val(600);
        } else if ((filetime > 600) && (filetime <= 900)) {
            $("#filetime").val(900);
        } else if ((filetime > 900) && (filetime <= 1200)) {
            $("#filetime").val(1200);
        } else {
            $("#filetime").val(1800);
        }*/

        $("select#filetime option").each(function(index, element) {
            if ($(this).val() == Number(filetime)) {
                $(this).prop("selected", true);
            }
        });

        if (Number(manualrecstart) == 1) {
            $("#manualrecOn").prop("checked", true);
            $("#manualrecOff").prop("checked", false);
        } else {
            $("#manualrecOff").prop("checked", true);
            $("#manualrecOn").prop("checked", false);
        }

    })

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
            weekstart = 7;
            weekend = 9;
        } else {
            weekstart = 0;
            weekend = 0;
        }

        for (i = weekstart; i < weekend; i++) {
            if ((weekend == 9) && (i == 7)) {
                obj = document.getElementById('Form2Wrkday');
            } else if ((weekend == 9) && (i == 8)) {
                obj = document.getElementById('Form2Wkend');
            } else {
                obj = document.getElementById("Form2Wk" + i);
            }
            obj.value = "none";
            first = 0;

            if ($("#TimeFrame")[0].contentWindow.$("input:checkbox[name='daycheck']").get(i).checked == true) {
                var weekDay = new Array();

                weekDay[0] = "";
                weekDay[1] = "";
                weekDay[2] = "";

                for (j = 0; j < 3; j++) {
                    k = i * 3 + j;

                    sun_startHour = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_startHour']").get(k).selectedIndex);
                    sun_startMinute = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_startMinute']").get(k).selectedIndex);
                    sun_endHour = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_endHour']").get(k).selectedIndex);
                    sun_endMinute = ($("#TimeFrame")[0].contentWindow.$("select[name='sun_endMinute']").get(k).selectedIndex);

                    startTime = sun_startHour * 4 + sun_startMinute;
                    endTime = sun_endHour * 4 + sun_endMinute;

                    if (startTime > endTime) {
                        alert(MdErrorMsg);
                        return false;
                    } else if (startTime == endTime) {
                        continue;
                    } else {
                        //endTime = endTime - 1;
                        weekDay[j] = startTime + "~" + endTime;

                        if (first != 0) {
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
})