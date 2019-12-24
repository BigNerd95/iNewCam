#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs

IFS=";"

. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh

####config_path=/etc/network
####wifi_config=$config_path/wifi.conf
####wifi_config_tmp=/tmpfs/wifi.conf
####wifidev_config=$config_path/wifidev.conf

. $wifi_config


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



wifiessidold=$wifiessid
wifiwhichkeyold=$wifiwhichkey

ssid="`get_param "ssid"`"
wktype="`get_param "wktype"`"
wepid="`get_param "wepid"`"
enable="`get_param "enable"`"



wifiessid=$ssid
#wifistatus=$wfstatus
wifiwhichkey=$wepid
#wifimode=$wkmode
wifikeytype=$wktype
#wifiencryp=$wpatype

wifiwhichkey=0

#wifikey1old="$wifikey1"
#wifikey2old="$wifikey2" 
#wifikey3old="$wifikey3"
wifikeyold="$wifikey"

#wifikey1="`get_param "wkd1"`"
#wifikey2="`get_param "wkd2"`" 
#wifikey3="`get_param "wkd3"`" 
wifikey="`get_param "key"`"


 
cat $wifidev_config > $wifi_config_tmp
echo "wifidev=\"${wifidev}\"" >> $wifi_config_tmp
echo "wifienable=\"${enable}\"" >> $wifi_config_tmp
#echo "channel=\"${channel}\"" >> $wifi_config_tmp
#echo "wifimode=\"${wifimode}\"" >> $wifi_config_tmp
echo "wifiessid=\"${wifiessid}\"" >> $wifi_config_tmp
#echo "wifirate=${wifirate}" >> $wifi_config_tmp
#echo "wifistatus=$wifistatus" >> $wifi_config_tmp
echo "wifikeytype=$wifikeytype" >> $wifi_config_tmp
echo "wifiwhichkey=$wifiwhichkey" >> $wifi_config_tmp
echo "wifikey=\"$wifikey\"" >> $wifi_config_tmp
#echo "wifikey2=\"$wifikey2\"" >> $wifi_config_tmp
#echo "wifikey3=\"$wifikey3\"" >> $wifi_config_tmp
#echo "wifikey4=\"$wifikey4\"" >> $wifi_config_tmp
#echo "wifiencryp=$wifiencryp" >> $wifi_config_tmp

cat $wifi_config_tmp  > $wifi_config

show_dbg2 "wpa_config_tmp:$wpa_config_tmp"
gen_wpa_config $wifiessid $wifikeytype $wifiwhichkey $wifikey $wpa_config_tmp
cp -f $wpa_config_tmp $wpa_config 


#####wifim=$(wifi_getmode)
#####if [ $wifim = AP ]
#####then
#####    ####BTTODO
#####    ### echo "reboot" > /tmpfs/sysmon
#####    ##echo "WIFI_STA" > /tmpfs/sysmon
#####    ##fsync /tmpfs/sysmon
#####    
#####    wifi_networking.sh STA
#####else
#####    wifi_networking.sh STA
#####fi

linedstatus=$(net_getlinedstatus)
show_info "setwifiattr, linestatus $linedstatus "
if [ $linedstatus = 0 -o $linedstatus = 2 ]
then
    wifim=$(wifi_getmode)
    if [ $wifim = "AP" ]
    then
        . $ap_cfgfile
        if [ $ap_after_config = "STA" ]
        then
            show_info1 "wificonfig under AP. toSTA"
            wifi_networking.sh STA
            
        elif [ $ap_after_config = "REBOOT" ]
        then
            show_info1 "wificonfig under AP. reboot"
            sys_setaction "reboot"
        else
            show_info1 "wificonfig under AP. do nothing"
        fi
    else
        show_info "wificonfig under STA, connect with new config"
        wifi_networking.sh STA
    fi
fi




echo -e "\r\n"
echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"



# /bin/vs/cgi-bin/inetwifi_configig.cgi

