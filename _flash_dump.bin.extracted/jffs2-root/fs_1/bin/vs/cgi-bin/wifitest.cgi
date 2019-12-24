#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs:/sbin:/ko

##  执行方法为/bin/vs/cgi-bin/wifitest.cgi "&-ssid=dbt2&-wktype=3&-key=qv1234563"
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh

IFS=";"

. $wifidev_config


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

wifim=$(wifi_getmode)
echo "">/tmpfs/wifitest.log

if [ $wifim = "AP" ]
then
    show_dbg2 "wifitest, but in AP mode. not support"
    echo -e "Content-Type:text/plain\r"
    echo -e "\r"
    echo -e var wifi_linkstatus=\"AP_MODE\"\;"\r"
    echo -e "\r"    
    exit
elif [ $wifim = "NONE" ]
then
    /ko/mt7601.sh load
    show_dbg2 "wifitest, not wifi mode.load wifi"
    ##wifiko load
    
    #/ko/mt7601.sh "load"
    ifconfig $wifidev up
elif [ $wifim = "STA" ]
then
    show_dbg2 "wifitest, wifi mode.disable prev first"
    wpa_cli -i $wifidev disconnect >>/tmpfs/wifitest.log 2>&1
    wpa_cli -i $wifidev terminate  >>/tmpfs/wifitest.log 2>&1
fi    


wifiessid="`get_param "ssid"`"
wifikeytype="`get_param "wktype"`"
wifiwhichkey="`get_param "wepid"`"
wifikey="`get_param "key"`"
###目前仅处理key0
wifiwhichkey=0

gen_wpa_config $wifiessid $wifikeytype $wifiwhichkey $wifikey $wpa_config_tmp
wpa_supplicant -B -d -Dwext -i $wifidev -c $wpa_config_tmp >>/tmpfs/wifitest.log 2>&1

wpa_cli  -i $wifidev disconnect >>/tmpfs/wifitest.log 2>&1
wpa_cli  -i $wifidev select_network 0 >>/tmpfs/wifitest.log 2>&1
wpa_cli  -i $wifidev enable_network 0 >>/tmpfs/wifitest.log 2>&1
 
###linkstatus=$(wifi_wait_connect)
    retry_times=5
    retry_waittimes=3
    cnt=0
    
    ##show_dbg2 "wifi_wait_connect retry_times  $retry_times retry_waittimes $retry_waittimes"
    while [ $cnt -lt $retry_times ]
    do
        linkstatus=$(wifi_getstatus)
        if [ -z $linkstatus ]
        then
            linkstatus=ERROR
            break
        else
             ### 只有COMPLETED 才是链接成功, 可能的值为 SCANNING, ASSOCIATING,SCANNING
             if [ ${linkstatus} = COMPLETED ]
             then
                linkstatus="COMPLETED"
                break
             else
                 sleep $retry_waittimes
                 cnt=`expr $cnt + 1`
             fi
        fi
    done


## 重新启动wpa_supplicant
if [ $wifim = STA ]
then
    ifconfig $wifidev up
    wifi_sta_connect
else
    wpa_cli -i $wifidev disconnect >>/tmpfs/wifitest.log 2>&1
    wpa_cli -i $wifidev terminate  >>/tmpfs/wifitest.log 2>&1
fi    


echo -e "Content-Type:text/plain\r"
echo -e "\r"
echo -e var wifi_linkstatus=\"${linkstatus}\"\;"\r"
echo -e "\r"

#echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" #content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"


