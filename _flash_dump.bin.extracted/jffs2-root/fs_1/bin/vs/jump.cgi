#!/bin/sh

#***********************************************
#getifattr.cgi
#author:x57522

#echo "we are here"
#echo "----------------------"
#echo $PATH_TRANSLATED
#echo "----------------------"
#echo  "PATH_TRANSLATED is $PATH_TRANSLATED"
#echo "----------------------"
#echo $HTTP_REFERER
if [ $HTTP_REFERER = http://192.168.0.1/ ];then
	JUMP_WEB="http://192.168.0.1/web/cgi.html"
else
	#JUMP_WEB=$HTTP_REFERER"web/mainpage.html"
	JUMP_WEB="http://10.67.208.60/web/mainpage.html"
fi
#echo -e "JUMP_WEB is $JUMP_WEB" >222
echo -e "\r\n"
echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$JUMP_WEB\"></head><body></body></html>"
#echo "<html><head><title></title><META http-equiv=\"Refresh\" content=\"3;URL=$JUMP_WEB\"></head><body></body></html>"
#echo "<html><head><title></title><script language="javascript1.2" type="text/javascript">
#window.location="http://10.67.208.60/web/mainpage.html";
#</script>
#</head><body></body></html>"

#echo  "Response.Redirect(http://10.67.208.60/web/mainpage.html)"
#echo  "Response.End"
