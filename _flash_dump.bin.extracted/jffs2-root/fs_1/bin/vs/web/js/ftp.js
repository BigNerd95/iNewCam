// JavaScript Document

$(function(){
	
	$(document).ready(function(e) {
         LoadLanguage();
		 /*var ftpserver="192.168.0.170"; var ftpport="21"; var ftpusername="admin"; var ftppassword="admin"; var ftpmode="0"; var filename="";*/
		 $("#FtpServer").val(ftpserver);
		 $("#FtpPort").val(ftpport);
		 $("#FtpUser").val(ftpusername);
		 $("#FtpPasswd").val(ftppassword);
		 
    });
	
	function CheckFtpAttr()
	{
		if($("#FtpPort").val() > 65536)
		{
				alert(PortErrMsg);
				$("#FtpPort").focus();
		}
		return 1;	
	}
	
	$("#FtpPort").keypress(function(e) {
          if (((e.which >= 48) && (e.which <= 57)) || e.which == 8 || e.which == 0) return e.which;
        else return false;
    });
	
	$("#FtpPort").blur(function(e) {
        if($("#FtpPort").val() > 65536)
			alert(PortErrMsg);
    });
	
  $("#TestConnect").click(function() {
	  
	  	if(CheckFtpAttr() != 1)
			return 0;
	  
        var cgiurl = "http://" + window.document.location.host + "/web/cgi-bin/hi3510/param.cgi?cmd=testftp"
		cgiurl += "&-ftpserver=" + $("#FtpServer").val();
		cgiurl += "&-ftpport=" + $("#FtpPort").val();
		cgiurl += "&-ftpusername=" + $("#FtpUser").val();
		cgiurl += "&-ftppassword=" + $("#FtpPasswd").val();
		cgiurl += "&-ftpmode=" + ftpmode;
		cgiurl += '&-time="' + new Date().getTime() + '"';
 

		$("#TestMsgSpan").html(TestConnectSpan);
        $.get(cgiurl, function(data){
			eval(data);

			if(("undefined" != typeof result)&&(result == "1"))$("#TestMsgSpan").html(TestConnectSuccessSpan);
			else $("#TestMsgSpan").html(TestConnectFailureSpan);

			},
			 "text");

    })
	
	$("#apply").click(function(e) {
        if(CheckFtpAttr() != 1)
			return 0;
			
		var form = document.form2;
       form.cururl.value = document.URL;	
			
		$("#Form2Ftpserver").val($("#FtpServer").val());
		$("#Form2Ftpport").val($("#FtpPort").val());
		
		$("#Form2Ftpusername").val($("#FtpUser").val());
		$("#Form2Ftppassword").val($("#FtpPasswd").val());

		form.action="cgi-bin/hi3510/param.cgi";
		
        form.submit();
			
    });
	
})