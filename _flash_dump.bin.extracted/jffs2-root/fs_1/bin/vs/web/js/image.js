// JavaScript Document

$(function(){
	
	$(document).ready(function(e) {
         LoadLanguage();
		 
		 /*****************wdr*******************/
		$("#wdrSelect option[value=" + wdr + "]").attr("selected", true);
		
		 setTimeout(function() {
            $("body").css("display", "block");
        },
        100);
		
    });
	
	$("#progressbar").progressbar({
        value: 0
    });

    progress = function() {

        var val = $("#progressbar").progressbar("value") || 0;

        $("#progressbar").progressbar("value", val + 1);

        if (val >= 100) window.location.reload(true);

    }

	 $("#wdrSelect").change(function() {
		 
		 var wdrselect = $("#wdrSelect option:selected").val();
		 
        if(wdrselect != wdr) $("#WdrChangeRebootMsgLabel").html(WdrChangeRebootMsg);
        else $("#WdrChangeRebootMsgLabel").html("");
	})
		
	$("#apply").click(function(e) {
		var s32NeedReboot = 0;
		
        var form = document.form2;
        form.cururl.value = document.URL;
		
       	var wdrselect = $("#wdrSelect option:selected").val();
		if(wdrselect != wdr)
		{	
			$("#Form2SetvdisplayattrCmd").removeAttr("disabled");
            $("#Form2Wdr").removeAttr("disabled");
			
			$("#Form2SetvdisplayattrCmd").attr("name", "cmd");
            $("#Form2SetvdisplayattrCmd").val("setvdisplayattr");
            $("#Form2Wdr").attr("name", "-wdr");
            $("#Form2Wdr").val(wdrselect);
			
			s32NeedReboot = 1;
		}
		
		if(s32NeedReboot == 1)
		{			
			$("#Form2SetvdisplayattrRebootCmd").removeAttr("disabled");
            $("#Form2Reboot").removeAttr("disabled");
			
			$("#Form2SetvdisplayattrRebootCmd").attr("name", "cmd");
            $("#Form2SetvdisplayattrRebootCmd").val("setvdisplayattr");
            $("#Form2Reboot").attr("name", "-reboot");
			
			$("body div:first").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);
            setInterval("progress()", 450); //45S
		}
		
		form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();
    });
	
})