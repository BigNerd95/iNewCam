#! /bin/sh

if /sbin/ifconfig | grep eth0 > /dev/null
then
    nettype="LAN"
else
    nettype="WiFi"
fi

netmac=`grep macaddr /etc/ipcamera/config_priv.ini | awk '{print $3}'`

echo -e "Content-Type:text/plain\r"
echo -e "\r\n"
echo -e "var nettype = \"$nettype\" ;\r"
echo -e "var netmac = $netmac ;\r"
