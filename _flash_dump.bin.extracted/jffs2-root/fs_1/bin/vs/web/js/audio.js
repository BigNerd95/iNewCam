// JavaScript Document
$(function() {

    var AENC_FORMAT_G711A = 1;
    var AENC_FORMAT_G726 = 4;

    $(document).ready(function(e) {
        LoadLanguage();

        $("#InputVolInput, #OutputVolInput").width($("#AencFormatSelect").width());

        $("#AencFormatSelect option[value=" + aencformat + "]").prop("selected", true);

        $("#InputVolInput").val(inputgain);
        $("#OutputVolInput").val(outputvol);

        /*****************Audio*******************/
        $("input[name=MainStreamAudioGrp][value=" + bIsGetAudio_1 + "]").prop("checked", true);
        $("input[name=SubStreamAudioGrp][value=" + bIsGetAudio_2 + "]").prop("checked", true);

    });

    $("#AencFormatSelect").change(function(e) {
        if ($("#AencFormatSelect option:selected").val() != aencformat) {
            $("#AencFormatChangeRebootMsgLabel").css("display", "inline-block");
        } else {
            $("#AencFormatChangeRebootMsgLabel").css("display", "none");
        }
    });

    /****************码率值限定数字输入*********************/
    $("#InputVolInput, #OutputVolInput").keypress(function(event) {
        if (((event.which >= 48) && (event.which <= 57)) || event.which == 8 || event.which == 0) return event.which;
        else return false;
    })

    $("#progressbar").progressbar({
        value: 0
    });

    progress = function() {

        var val = $("#progressbar").progressbar("value") || 0;

        $("#progressbar").progressbar("value", val + 1);

        if (val >= 100) window.location.reload(true);

    }

    $("#apply").click(function(e) {

        var form = document.form2;
        form.cururl.value = document.URL;

        if ($("#AencFormatSelect option:selected").val() != aencformat) {
            $("#Form2Rebootcmd").removeAttr("disabled");
            $("#Form2Reboot").removeAttr("disabled");
            $("#Form2RebootChn").removeAttr("disabled");
            $("body div:first").css("display", "none");
            $("#MsgLayer").css("display", "block");
            $("#Msg").html(RebootWaitMsg);
            setInterval("progress()", 450); //45S
        }

        $("#Form2AencFormatChn1").val(11);
        $("#Form2AencFormat1").val($("#AencFormatSelect option:selected").val());
        $("#Form2AencFormatChn2").val(12);
        $("#Form2AencFormat2").val($("#AencFormatSelect option:selected").val());
        $("#Form2AencFormatChn3").val(13);
        $("#Form2AencFormat3").val($("#AencFormatSelect option:selected").val());

        $("#Form2InputGain").val($("#InputVolInput").val());
        if (($("#OutputVolInput").val() > 99) )
		{
		alert(OutputVolSpan+" too MAX")
                 return false;
		 }
		$("#Form2OutputGain").val($("#OutputVolInput").val());

        /*****************音频发送*******************/
        $("#Form2MainStreamIsGetAudio").val($("input[name=MainStreamAudioGrp]:checked").val());
        $("#Form2SubStreamIsGetAudio").val($("input[name=SubStreamAudioGrp]:checked").val());

        form.action = "cgi-bin/hi3510/param.cgi";
        form.submit();

    });

})