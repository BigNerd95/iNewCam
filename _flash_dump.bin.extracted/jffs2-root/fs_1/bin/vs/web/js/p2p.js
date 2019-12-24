// JavaScript Document
/*多语言加载*/
$(document).ready(function(e) {
    LoadLanguage();

    if (p2p_enable == "-1") {
        $("#P2PEnableLayer input").prop("disabled", true);
    } else {
        if (p2p_enable == 1) $("#p2pEnable").prop("checked", true);
        else $("#p2pEnable").prop("checked", false);
		
		$("#P2PPwdInput").val(p2p_pwd);
    }
	$("#P2PIDLabel").html(p2p_id);
});

$(function() {
    $("#apply").click(function() {

		var cgiurl = "http://" + window.document.location.host + "/cgi-bin/p2p.cgi?&-action=set";
		   if ($("#p2pEnable").prop("checked")) cgiurl += "&-enable=1";
        else cgiurl += "&-enable=0";
		
		cgiurl += ("&-p2p_pwd=" + $("#P2PPwdInput").val());
				
		$.get(cgiurl, function(data){ window.location.reload();})
		

    })
})