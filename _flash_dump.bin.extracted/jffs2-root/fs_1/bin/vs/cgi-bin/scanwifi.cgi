#!/bin/sh

. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh

#. $wifi_config

wifim=$(wifi_getmode)


#wpa_cli -i $iface scan > /dev/null 2>&1
if [ $wifim = NONE ]
then
    wifi_sta_start
    wifi_scan
    outputwifiscanresult
elif [ $wifim = STA ]
then

    wifi_scan
    outputwifiscanresult

	
	##/bin/wpa_cli -i $wifidev scan_result 2>/tmpfs/wifinets.info| awk 'BEGIN {print "200 OK HTTP 1.1\n\n"}{print "var ssid_"NR "=\""$5"\";" "var signal_"NR "=\""$3"\";" "var secret_"NR "=\""$4"\";"}'

elif [ $wifim = AP ]
then
	if [ -e $wifiscanresult ]
	then
        outputwifiscanresult
	else
		echo -e -n "Content-Type:text/plain\n\r\n\r"
        echo -e -n "var ssid_1=\"bssid signal ssid\";\n\r"
        echo -e -n "var ssid_2=\"NONE\";\n\r"
        echo -e -n "var signal_1=\"bssid\";\n\r"
        echo -e -n "var signal_2=\"0\";\n\r"
        echo -e -n "var secret_1=\"bssid\";\n\r"
        echo -e -n "var secret_2=\"[NONE]\";\n\r"
        echo -e -n "\n\r\n\r"  
	fi
else
		echo -e -n "Content-Type:text/plain\n\r\n\r"
        echo -e -n "var ssid_1=\"bssid signal ssid\";\n\r"
        echo -e -n "var ssid_2=\"NONE\";\n\r"
        echo -e -n "var signal_1=\"bssid\";\n\r"
        echo -e -n "var signal_2=\"0\";\n\r"
        echo -e -n "var secret_1=\"bssid\";\n\r"
        echo -e -n "var secret_2=\"[NONE]\";\n\r"
        echo -e -n "\n\r\n\r"  
fi
        
#echo -e "\n"
#iwlist $iface scan |awk -F: 'BEGIN {print "200 OK HTTP 1.1\n\n"} /Channel:|ESSID:|Encryption key:/ {print "var "$1"="$2";"}'
