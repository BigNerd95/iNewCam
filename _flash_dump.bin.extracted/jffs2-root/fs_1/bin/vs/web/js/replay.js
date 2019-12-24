$(function() {
    var RecCalendar = 0;
    var ShowItem = 10;
    var TotalPage = 0;
    var RecPath = new Array();
    var RecSize = new Array();
    var RecTime = new Array();
    var PageNum = 1;
    var xmldata = "";
    var CurRecTimeLength = 0;
	
	var PlayStateStop = 0;
	var PlayStatePlay = 1;
	var PlayStatePause = 2;
	var PlayStateFast = 3;
	var PlayStateSlow = 4;
	var PlayStateNextFrame = 5;
	var PlayStateBackFrame = 6;
	
    xmldata = GetStrFromXML('PlaySpan', 'PauseSpan', 'FramePlaySpan', 'FastPlaySpan', 'StopSpan', 'closeText', 'prevText', 'nextText', 'weekHeader', 'yearSuffix');

    var monthNames = GetStrFromXML('monthNamesJanuar', 'monthNamesFebruar', 'monthNamesMarts', 'monthNamesApril', 'monthNamesMaj', 'monthNamesJuni', 'monthNamesJuli', 'monthNamesAugust', 'monthNamesSeptember', 'monthNamesOktober', 'monthNamesNovember', 'monthNamesDecember');
    //	var monthNamesShort = GetStrFromXML('monthNamesShortJanuar', 'monthNamesShortFebruar', 'monthNamesShortMarts', 'monthNamesShortApril', 'monthNamesShortMaj', 'monthNamesShortJuni', 'monthNamesShortJuli', 'monthNamesShortAugust', 'monthNamesShortSeptember', 'monthNamesShortOktober', 'monthNamesShortNovember', 'monthNamesShortDecember');
    var dayNames = GetStrFromXML('dayNamesSunday', 'dayNamesMonday', 'dayNamesTuesday', 'dayNamesWednesday', 'dayNamesThursday', 'dayNamesFriday', 'dayNamesSaturday');
    //	var dayNamesShort = GetStrFromXML('dayNamesShortSunday', 'dayNamesShortMonday', 'dayNamesShortTuesday', 'dayNamesShortWednesday', 'dayNamesShortThursday', 'dayNamesShortFriday', 'dayNamesShortSaturday');
    var dayNamesMin = GetStrFromXML('dayNamesMinSunday', 'dayNamesMinMonday', 'dayNamesMinTuesday', 'dayNamesMinWednesday', 'dayNamesMinThursday', 'dayNamesMinFriday', 'dayNamesMinSaturday');

    eval(monthNames);
    //		eval(monthNamesShort);
    eval(dayNames);
    //	eval(dayNamesShort);
    eval(dayNamesMin);

    eval(xmldata);
    $("#SearchCalender").datepicker(

    {
        closeText: closeText,
        prevText: prevText,
        nextText: nextText,
        monthNames: [monthNamesJanuar, monthNamesFebruar, monthNamesMarts, monthNamesApril, monthNamesMaj, monthNamesJuni, monthNamesJuli, monthNamesAugust, monthNamesSeptember, monthNamesOktober, monthNamesNovember, monthNamesDecember],
        //monthNamesShort: [monthNamesShortJanuar, monthNamesShortFebruar, monthNamesShortMarts, monthNamesShortApril, monthNamesShortMaj, monthNamesShortJuni, monthNamesShortJuli, monthNamesShortAugust, monthNamesShortSeptember, monthNamesShortOktober, monthNamesShortNovember, monthNamesShortDecember],
        dayNames: [dayNamesSunday, dayNamesMonday, dayNamesTuesday, dayNamesWednesday, dayNamesThursday, dayNamesFriday, dayNamesSaturday],
        // dayNamesShort: [dayNamesShortSunday, dayNamesShortMonday, dayNamesShortTuesday, dayNamesShortWednesday, dayNamesShortThursday, dayNamesShortFriday, dayNamesShortSaturday],
        dayNamesMin: [dayNamesMinSunday, dayNamesMinMonday, dayNamesMinTuesday, dayNamesMinWednesday, dayNamesMinThursday, dayNamesMinFriday, dayNamesMinSaturday],
        //weekHeader: weekHeader,
        yearSuffix: yearSuffix,
    
	    onSelect: function() {
            for (var i = 0; i < $(".ui-datepicker td a").length; i++) if ((RecCalendar & (1 << i)) == (1 << i)) {
                $(".ui-datepicker td a:eq(" + i + ")").removeClass("ui-state-default");
                $(".ui-datepicker td a:eq(" + i + ")").addClass("SearchCalenderHighlight")
            }
        },
        onChangeMonthYear: function(year, month) {
            str = month + "/1/" + year;
            $("#SearchCalender").datepicker("setDate", str)
        }
    });

    var language = getCookie("language");
    if ((language == "zh-cn") || (language == "zh-CN")) {
        $("#SearchCalender").datepicker("option", "showMonthAfterYear", true);
    } else if (language == "en") {
        $("#SearchCalender").datepicker("option", "showMonthAfterYear", false);
    } else {
        $("#SearchCalender").datepicker("option", "showMonthAfterYear", false);
    }

    $("#RePlayerTimeSlider").slider({
        min: 0
    },
    {
        max: 100
    },
    {
        stop: function(event, ui) {
			if(ui.value < $("#DownloadProgress").progressbar("value"))SetPlayPos(ui.value);
        }
    });
    $("#RePlayerVolSlider").slider({
		range: "min",
        min: 0,
        max: 100,
        value: 50
    },
    {
        stop: function(event, ui) {
            SetVolume(ui.value);
        },
        slide: function(event, ui) {
            $("#RePlayerVolInfo").html(ui.value);

            $("#RePlayerVolCtrLayer >a").css("display", "none");

            if (ui.value == 0) {
                $("#VolDisplaySpan4").css("display", "inline-block");
            } else if ((ui.value > 0) && (ui.value <= 30)) {
                $("#VolDisplaySpan1").css("display", "inline-block");
            } else if ((ui.value > 30) && (ui.value <= 60)) {
                $("#VolDisplaySpan2").css("display", "inline-block");
            } else {
                $("#VolDisplaySpan3").css("display", "inline-block");
            }
        }
    });

    $("#DownloadProgress").progressbar({
        value: 0
    });
    var PlaySpanMsg = "";
    var PauseSpanMsg = "";
    var FramePlaySpanMsg = "";
    var FastPlaySpanMsg = "";
    var StopSpanMsg = "";

    $(document).ready(function(e) {
       /******************进度条更新*********************/
        setInterval(function() {
            if ((GetPlayState() != PlayStateStop)&&
			    (GetPlayState() != PlayStatePause)) {
                UpdateDownPos();
                UpdatePlayPos()
            }
        },
        300);
        LoadLanguage();

        PlaySpanMsg = PlaySpan;
        PauseSpanMsg = PauseSpan;
        FramePlaySpanMsg = FramePlaySpan;
        FastPlaySpanMsg = FastPlaySpan;
        StopSpanMsg = StopSpan;

        setTimeout(function() {
            $("body").css("display", "block");
			 $("#RePlayerCtrLayer").width(GetRePlayerLayerWidthHeight().w);
	
            width = $("#RePlayerCtrLayer").width() - $("#RePlayerCtr").outerWidth(true) - $("#RePlayerVolCtrLayer").outerWidth(true) - 100 ;
            $("#DownloadProgress").width(width);
            $("#RePlayerTimeSlider").width(width);

        },
        2000)
    });
    $("#Refresh").click(function() {
        var currentDate = $("#SearchCalender").datepicker("getDate");
        var cgicmd = "/cgi-bin/hi3510/getreccalender.cgi?";

        if (currentDate.getYear() <= 2000) {
            cgicmd += "&-year=" + ((currentDate.getYear() + 1900) - 2000);
        } else {
            cgicmd += "&-year=" + (currentDate.getYear() - 2000);
        }

        cgicmd += "&-month=" + (currentDate.getMonth() + 1);
        cgicmd += '&-time=' + new Date().getTime();
        $.get(cgicmd,
        function(data) {
            eval(data);
            RecCalendar = parseInt(Calendar);
            for (var i = 0; i < $(".ui-datepicker td a").length; i++) if ((RecCalendar & (1 << i)) == (1 << i)) {
                $(".ui-datepicker td a:eq(" + i + ")").removeClass("ui-state-default");
                $(".ui-datepicker td a:eq(" + i + ")").addClass("SearchCalenderHighlight")
            }
        })
    });
    ShowSearchList = function(data) {
        $("#SearchResultTable tr").remove();
        eval(data);
        TotalPage = totalpage;
        for (var i = 0; i < searchnum; i++) {
            rectime = eval("rectime_" + i);
            recsize = eval("recsize_" + i);
            RecPath[i] = eval("recpath_" + i);
            RecSize[i] = eval("recsize_" + i);
            RecTime[i] = eval("rectime_" + i);
            if ((recsize > (1024)) && (recsize < (1024 * 1024))) {
                recsize /= (1024);
                recsize = Math.round(recsize * 10) / 10;
                recsize += "K"
            } else if ((recsize > (1024 * 1024)) && (recsize < (1024 * 1024 * 1024))) {
                recsize /= (1024 * 1024);
                recsize = Math.round(recsize * 10) / 10;
                recsize += "M"
            } else if ((recsize > (1024 * 1024 * 1024)) && (recsize < (1024 * 1024 * 1024 * 1024))) {
                recsize /= (1024 * 1024 * 1024);
                recsize = Math.round(recsize * 10) / 10;
                recsize += "G"
            }
            $("#SearchResultTable").append('<tr><td>' + rectime + "</td>" + '<td>' + recsize + "</td></tr>")
        }
        $("#SearchResultTable tr:odd").addClass("SearchResultTableTrOdd");
        $("#SearchResultTable tr:even").addClass("SearchResultTableTrEven");
    }
    $(document).on("mouseenter", " #SearchResultTable tr",
    function() {
        $(this).removeAttr("class");
        $(this).addClass("SearchResultTableTrHover")
    });
    $(document).on("mouseleave", " #SearchResultTable tr",
    function() {
        if ($(this).attr("checked") != "checked") {
            $(this).removeClass("SearchResultTableTrHover");
            $("#SearchResultTable tr:odd").addClass("SearchResultTableTrOdd");
            $("#SearchResultTable tr:even").addClass("SearchResultTableTrEven")
        }
    });
	
	$(document).on("dblclick", " #SearchResultTable tr",
    function() {
        $("#Stop").click();
		$("#Play").click();
    });
	
    $(document).on("click", " #SearchResultTable tr",
    function() {
        $("#SearchResultTable tr").removeAttr("checked");
        $("#SearchResultTable tr").removeAttr("class");
        $("#SearchResultTable tr:odd").addClass("SearchResultTableTrOdd");
        $("#SearchResultTable tr:even").addClass("SearchResultTableTrEven");
        $(this).attr("checked", "checked");
        $(this).removeAttr("class");
        $(this).addClass("SearchResultTableTrHover")

        $("#SearchResultTable tr").each(function(index, element) {
            if ($(this).attr("checked") == "checked") {

                var StartHour = (((RecTime[index].split("~"))[0]).split(":"))[0];
                var StartMin = (((RecTime[index].split("~"))[0]).split(":"))[1];
                var StartSec = (((RecTime[index].split("~"))[0]).split(":"))[2];

                var EndHour = (((RecTime[index].split("~"))[1]).split(":"))[0];
                var EndMin = (((RecTime[index].split("~"))[1]).split(":"))[1];
                var EndSec = (((RecTime[index].split("~"))[1]).split(":"))[2];

                var EndTime = parseInt(EndHour) * 3600 + parseInt(EndMin) * 60 + parseInt(EndSec);
                var StartTime = parseInt(StartHour) * 3600 + parseInt(StartMin) * 60 + parseInt(StartSec);

                CurRecTimeLength = EndTime - StartTime;

                return 0;
            }
        })

    });
    $("#FirstPage, #PrevPage, #NextPage, #EndPage, #Search").click(function() {
        if ($(this).attr("id") == "Search") {
            PageNum = "0xffffffff"
        } else if ($(this).attr("id") == "FirstPage") {
            if (PageNum == 1) return true;
            PageNum = 1
        } else if ($(this).attr("id") == "PrevPage") {
            if (PageNum > 1) PageNum--;
            else return true
        } else if ($(this).attr("id") == "NextPage") {
            if (PageNum < TotalPage) PageNum++;
            else return true
        } else if ($(this).attr("id") == "EndPage") {
            if (PageNum == TotalPage) return true;
            PageNum = TotalPage
        } else {
            return 0
        }
        var currentDate = $("#SearchCalender").datepicker("getDate");
        var cgicmd = "/cgi-bin/hi3510/recsearch.cgi?";

        if (currentDate.getYear() <= 2000) {
            cgicmd += "&-year=" + ((currentDate.getYear() + 1900) - 2000);
        } else {
            cgicmd += "&-year=" + (currentDate.getYear() - 2000);
        }

        cgicmd += "&-month=" + (currentDate.getMonth() + 1);
        cgicmd += "&-day=" + (currentDate.getDate());
        cgicmd += "&-type=" + $("#SearchType option:selected").val();
        cgicmd += "&-page=" + PageNum;
        cgicmd += "&-showitem=" + ShowItem;
        cgicmd += '&-time=' + new Date().getTime();
        if (PageNum == "0xffffffff") PageNum = 1;
        $.get(cgicmd,
        function(data) {
            ShowSearchList(data)
        })
    });
    $("#Download").click(function() {
        $("#SearchResultTable tr").each(function(index, element) {
            if ($(this).attr("checked") == "checked") {
				//回放页面下载功能完善
                //var str = RecPath[index].substr(7);
				var str ="../sd"+ RecPath[index].substr(8);
                window.open(str)
            }
        })
    });
    $("#Play").click(function() {

		if(GetPlayState() == PlayStatePlay)
			return 0;
			
			SetPlaySpeed(0);
        $("#SearchResultTable tr").each(function(index, element) {
            if ($(this).attr("checked") == "checked") {
                var fileName = RecPath[index];
                var fileLength = RecSize[index];
                Play(fileName, fileLength, CurRecTimeLength);
                $("#RePlayerCtrInfo").html(PlaySpanMsg);
                SetVolume($("#RePlayerVolSlider").slider("option", "value"));
                return 0
            }
        })
    });
    $("#Pause").click(function() {
		
		if((GetPlayState() == PlayStateStop)||
			(GetPlayState() == PlayStatePause))
			return 0;
		
        Pause();
        $("#RePlayerCtrInfo").html(PauseSpanMsg);
    });
    $("#Stop").click(function() {
		
		if(GetPlayState() == PlayStateStop)
			return 0;
		
        Stop();
		$("#DownloadProgress").progressbar("value", 0);
		$("#RePlayerTimeSlider").slider("value", 0);
		$("#RePlayerCtrInfo").html(StopSpanMsg);

    });
    var PlaySpeed = 0;
    $("#FastPlay").click(function() {
		
		if(GetPlayState() == PlayStateStop)
			return 0;
		
		if( GetPlayState() != PlayStateFast)
			PlaySpeed = 0;
			
        if (PlaySpeed == 0) {
            PlaySpeed = 1;
            str = FastPlaySpanMsg + "x2"
        } else if (PlaySpeed == 1) {
            PlaySpeed = 2;
            str = FastPlaySpanMsg + "x4"
        } else if (PlaySpeed == 2) {
            PlaySpeed = 3;
            str = FastPlaySpanMsg + "x8"
        } else {
            PlaySpeed = 0;
            str = PlaySpan;
        }
        SetPlaySpeed(PlaySpeed);
        $("#RePlayerCtrInfo").html(str);
    });
    $("#FramePlay").click(function() {
		
		if(GetPlayState() == PlayStateStop)
			return 0;
		
        NextFrame();
        $("#RePlayerCtrInfo").html(FramePlaySpan);
    });
    UpdateDownPos = function() {

        Pos = GetDownPos(CurRecTimeLength);
        $("#DownloadProgress").progressbar("value", Pos);
    };
    UpdatePlayPos = function() {

        Pos = GetPlayPos(CurRecTimeLength);

        $("#RePlayerTimeSlider").slider("value", Pos);
    }
})
