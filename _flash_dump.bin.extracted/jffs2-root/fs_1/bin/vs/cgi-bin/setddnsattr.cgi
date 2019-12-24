#!/bin/sh

DDNSCONF=/etc/ipcamera/ddns.conf
DDNSENABLE=/etc/ipcamera/ddns_enable.conf
DIRINCLUDE=/usr/sbin/ddns
DDNSBIN=/bin/vs/ez-ipupdate

. ${DIRINCLUDE}/ddnsrc
. $DDNSCONF
. $DDNSENABLE

#REQUEST_METHOD(GET/POST)
#QUERY_STRING
#CONTENT_LENGTH

if [ "$REQUEST_METHOD" = "GET" ]
then
    CGIPARAM=$QUERY_STRING
elif [ "$REQUEST_METHOD" = "POST" ]
then
    read CGIPARAM
else
   CGIPARAM=$1
fi


CMD_LINE="`echo $CGIPARAM | sed -n "s/&/\n/gp"`"

get_param()
{
    echo "${CMD_LINE}" | grep "${1}=" | sed -n "s/\-${1}=//p" 
}



#parse the QUERY_STRING and get the param
ddnsenable="`get_param "ddnsenable"`"

if [ ${ddnsenable} -eq 1 ]
then
	domain="`get_param "ddnsdomain"`"
	user="`get_param "ddnsusername"`"
	password="`get_param "ddnspassword"`"
    ispname="`get_param "ddnsispname"`"
	dnsserver="`get_param "ddnsdnsserver"`"
	isproxy="`get_param "ddnsisproxy"`"
   #interval="`get_param "ddnsinterval"`"
fi

upnpenable="`get_param "upnpenable"`"


#update the DDNSCONF file
if [ ${ddnsenable} -eq 1 ]
then
	$RMCMD ${RUNDDNSCMD} 
	$LINKCMD -s $DIRINCLUDE/ddnsrun.$ispname ${RUNDDNSCMD}
	
	echo DDNS_DOMAINNAME=\"$domain\" > $DDNSCONF
	echo DDNS_USERNAME=\"$user\" >> $DDNSCONF
	echo DDNS_USERPASSWORD=\"$password\" >> $DDNSCONF
	echo DDNS_ISPNAME=\"$ispname\" >> $DDNSCONF
	echo DDNS_DNSSERVER=\"$dnsserver\" >> $DDNSCONF
	echo DDNS_ISPROXY=\"$isproxy\" >> $DDNSCONF
fi

echo DDNS_ENABLE=\"$ddnsenable\" > $DDNSENABLE

###################后台执行会有问题
echo 1 > /tmpfs/updateddns

#restart the ddns service
#if [ $ddnsenable -eq 1 ]
#then
#	/usr/sbin/ddns/ddns-stop >> /dev/null
#	/usr/sbin/ddns/ddns-start  &
#else
#	/usr/sbin/ddns/ddns-stop 
#fi   #if [ $enable -eq 1 ]

#start or stop upnp
#echo "upnpenable****************"
#echo $upnpenable
#if [ $upnpenable -eq 1 ]
#then
#   ./upnp_start.cgi > /dev/null 2>&1 
#else
#	./upnp_stop.cgi > /dev/null 2>&1 
#fi

#echo $HTTP_REFERER
echo -e "\r\n"
echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"


