#! /bin/sh
CONF=/etc/ipcamera/upnp.conf
WEBSERVER=/etc/ipcamera/webserver.conf
. $CONF


PORT=`grep 'port' $WEBSERVER |sed -n "s/ /\n/gp"|grep 'port'|sed -n "s/\port=//p"`

#echo "the naum" $PORT

iface=`cat $NETDEV`

killall -9 upnpd
if [ $enable = 1 ]
then
#/bin/vs/upnpd -i eth0 -P $PORT -w /etc/ipcamera -n "$upnpname"
#/bin/vs/upnpd -i wlan0 -P $PORT -w /etc/ipcamera -n "$upnpname"
/bin/vs/upnpd -i $iface -P $PORT -w /etc/ipcamera -n "$upnpname"
fi 

