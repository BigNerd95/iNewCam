#!/bin/sh

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

arg_p2p_action="`get_param "action"`"

if [ $arg_p2p_action = "ap" ]
then
    echo -e "Content-Type:text/plain\r"
    echo -e "\r"
	echo -e "entern AP mode OK !!!!\r"
    echo -e "\r"
	/bin/vs/cgi-bin/wifi_networking.sh AP &
    exit
fi

if [ $arg_p2p_action = "wps" ]
then
	echo -e "Content-Type:text/plain\r"
    echo -e "\r"
	echo -e "entern WPS mode OK !!!!\r"
    echo -e "\r"
	/bin/vs/cgi-bin/wifi_wps.sh &
    exit
    exit
fi






