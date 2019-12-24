#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs:/sbin
IFS=";"

. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh
. $wifi_config


if [ "$1" != "nohead" ]
then
echo -e "Content-Type:text/plain\r"
echo -e "\r"
fi

echo var wifissid = \"${wifiessid}\"\;
echo var wifikeytype = \"${wifikeytype}\"\;
echo var wifiwhichkey = \"${wifiwhichkey}\"\;
echo var wifikey=\"${wifikey}\"\;
#echo var wifienable=\"${wifi_realenable}\"\;
echo var wifienable=\"${wifienable}\"\;

wifimac=`cat /sys/class/net/${wifidev}/address 2>/dev/null`

echo var  wifimac=\"$wifimac\"\;
if [ "$1" != "nohead" ]
then
echo -e "\r"
fi
if [ "$1" == "nolinkstatus" ]
then
	exit
fi

wifi_realenable=$(wifi_getenable)

echo var wifienable=\"${wifi_realenable}\"\;

linedstatus=$(net_getlinedstatus)

##ÓÐÏß
if [ $linedstatus = 1 ]
then
    echo var linkstatus=\"0\"\;
    echo var linkssid=\"\"\;
    echo var wifimode=\"\"\;
else	
    wifistatus_file=/tmpfs/wifistatus.$$
    wpa_cli -i $wifidev status >$wifistatus_file 2>/dev/null
    . $wifistatus_file    
    
    ###debug echo wpa_state $wpa_state
    linkstatus=$wpa_state
    
    if [ -z ${linkstatus} ]
    then
        echo var linkstatus=\"0\"\;
    elif [ ${linkstatus} = COMPLETED ]
    then
        echo var linkstatus=\"1\"\;
    else
        echo var linkstatus=\"0\"\;
    fi
    
    echo var linkssid=\"$ssid\"\;
	echo var wifimode=\"$(wifi_getmode)\"\;
    rm $wifistatus_file
fi


echo 




