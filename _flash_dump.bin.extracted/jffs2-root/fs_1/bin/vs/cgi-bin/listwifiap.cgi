#!/bin/sh
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh



if [ -e $wifiscanresult ]
then
	cat $wifiscanresult | sed "1d;$d" | awk 'BEGIN {print "Content-Type:text/plain\n\r\n\r"}{print "var ssid_"NR "=\""$5"\";\n\r" "var signal_"NR "=\""$3"\";\n\r" "var secret_"NR "=\""$4"\";\n\r"}'
else
		echo -e "Content-Type:text/plain\r"
        echo -e "\r"
		echo -e "NONE""\r"
        
fi
echo -e "\r"



#iwlist $iface scan |awk -F: 'BEGIN {print "200 OK HTTP 1.1\n\n"} /Channel:|ESSID:|Encryption key:/ {print "var "$1"="$2";"}'
