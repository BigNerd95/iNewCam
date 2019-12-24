#!/bin/sh

WLAN_NAME="ra0"
AP_NUM=
SCAN_RESULT_FILE=/tmp/wifi_scan.txt
WLAN_CONF_FILE=/tmp/wlan.conf
WLAN_MODE_FILE=/tmp/wifi_mode

wifi_scan()
{
    wpa_cli -i$WLAN_NAME scan
    AP_NUM=`wpa_cli -i$WLAN_NAME scan_results|wc -l|awk '{print $1}'`
    AP_NUM=`expr $AP_NUM - 1`
    echo "wifi scan result: $AP_NUM aps!!!"
    echo "$AP_NUM" > ${SCAN_RESULT_FILE}

    if [ $AP_NUM -gt 0 ];then
	wpa_cli -i$WLAN_NAME scan_results|grep ":"|while read line
    do
	if [ -z "`echo "$line" |awk '{print $5}'`" ];then
	    AP_NUM=`expr $AP_NUM - 1`
	    echo "ignore an hidden ap,ap_num = $AP_NUM!"
	    sed -i "1c $AP_NUM" ${SCAN_RESULT_FILE}
	else
	    echo "$line" |awk '{print "\""$5"\",",$3}' >> ${SCAN_RESULT_FILE}
	fi
    done
fi
}

wifi_connect()
{
    SSID=$1
    PWD=$2
    if [ -z "$SSID" ];then
	echo "$SSID is invalid!"
	exit 1
    fi
    WIFI_ITEM=`wpa_cli -i$WLAN_NAME scan_results| eval grep $SSID`
    if [ -z "$WIFI_ITEM" ];then
	echo "$SSID not scanned!"
	exit 2
    fi
    WIFI_FLAGS=`echo "$WIFI_ITEM"|awk '{print $4}'`
    wpa_cli -i$WLAN_NAME disable_network 1
    wpa_cli -i$WLAN_NAME remove_network 1
    wpa_cli -i$WLAN_NAME add_network 1
    wpa_cli -i$WLAN_NAME set_network 1 ssid "\"$SSID\""
    if [ -n "`echo "$WIFI_FLAGS"|grep WEP`" ];then
	echo "set key_mgmt:"
	wpa_cli -i$WLAN_NAME set_network 1 key_mgmt NONE
	wpa_cli -i$WLAN_NAME set_network 1 wep_tx_keyidx 0 
	if [ $# -ge 3 ];then # wep-hex
	    echo "set hex wep_key0:"
	    wpa_cli -i$WLAN_NAME set_network 1 wep_key0 $PWD
	else # wep-ascii
	    echo "set ascii wep_key0:"
	    wpa_cli -i$WLAN_NAME set_network 1 wep_key0 "\"$PWD\""
	fi
    elif [ -n "`echo "$WIFI_FLAGS"|grep WPA`" ];then
	if [ `expr length $PWD` -lt 8 ];then
	    PWD=12345678 # psk code valid length: 8..63,or will cause wpa_supplicant parse error!
	fi
	echo "set wpa-psk:"
	wpa_cli -i$WLAN_NAME set_network 1 psk "\"$PWD\""
    else
	echo "set key_mgmt:"
	wpa_cli -i$WLAN_NAME set_network 1 key_mgmt NONE
    fi
    wpa_cli -i$WLAN_NAME select_network 1
    wpa_cli -i$WLAN_NAME enable_network 1
    wpa_cli -i$WLAN_NAME save_config

    sleep 5
    if [ -n "`wpa_cli -i$WLAN_NAME status|grep COMPLETED`" ];then
	echo "wifi connect $SSID success!"
	return 0
    else
	echo "wifi connect $SSID fail!"
	return 1
    fi
}

wlan_connect()
{
    wifi_connect $1 $2
    if [ $? -ne 0 ];then
	wifi_connect $1 $2 "wep-hex"
    fi
    return $?
}

wlan_connect_default()
{
    if [ -f $WLAN_CONF_FILE ];then
	if [ -z "`grep ssid $WLAN_CONF_FILE`" ];then
	    wifi_scan
	    /etc/init.d/wlan_ap.sh
	else
	    if [ "$WLAN_MODE" == "AP" ];then #connect: switch to sta mode first
		/etc/init.d/wlan_sta.sh
	    fi
	    SSID=`grep ssid $WLAN_CONF_FILE|awk -F '=' '{print $2}'`
	    PWD=`grep "pwd" $WLAN_CONF_FILE|awk -F '=' '{print $2}'`
	    wlan_connect $SSID $PWD
	    if [ $? -ne 0 ];then #connect err: switch to ap
		wifi_scan
		/etc/init.d/wlan_ap.sh
	    fi
	fi
    elif [ "$WLAN_MODE" == "AP" ];then
	exit 0
    else
	wifi_scan
	/etc/init.d/wlan_ap.sh
    fi
}

wifi_usage()
{
    if [ $1 -lt 1 ];then
	echo "Usage: $0 <scan|connect> {ssid password}"
	exit 0
    fi
}

WLAN_MODE="STA"
NEXT_MODE=         # need switch to mode
CTRL_ACT=$1
PARAM_NUM=$#

## step 1. get current wlan workmode ##
if [ -n "`lsmod|grep mt7601Uap`" ];then
    WLAN_MODE="AP"
fi

## step 2. scan and try to connect wifi by ssid & password on station mode ##
case $CTRL_ACT in
    "scan")
	if [ "$WLAN_MODE" == "AP" ];then
	    exit 0 ## use the scan result before switch ap-mode get
	else
	    wifi_scan
	fi
	;;
    "connect")
	if [ $PARAM_NUM -lt 2 ];then
	    wlan_connect_default
	else
	    if [ "$WLAN_MODE" == "AP" ];then #connect: change to sta mode first
		/etc/init.d/wlan_sta.sh
	    fi
	    wlan_connect $2 $3
	fi;;
    *)
	wifi_usage $PARAM_NUM;;
esac

## step 3. save current wlan workmode ##
if [ -n "`lsmod|grep mt7601Uap`" ];then
    WLAN_MODE="AP"
else
    WLAN_MODE="STA"
fi

echo "$WLAN_MODE" > $WLAN_MODE_FILE

exit 0
