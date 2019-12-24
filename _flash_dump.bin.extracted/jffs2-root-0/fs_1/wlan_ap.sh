#!/bin/sh

## kill dhcp/wpa_supplicant ##
killall udhcpc dhcpcd > /dev/null 2>&1
killall wpa_supplicant >/dev/null 2>&1

## unload wifi station module ##
ifconfig ra0 down
rmmod mt7601Usta.ko

## modify essid name ##
dev_id=`dev_read |awk '{print $4}'`
sed -i "s/^SSID=.*$/SSID=IPC-AP[$dev_id]/" /etc/Wireless/RT2870AP/RT2870AP.dat

## load wifi ap module ##
insmod /ko/mt7601Uap.ko
ifconfig eth0 192.168.10.2
route add default gw 192.168.10.1 dev eth0 
ifconfig ra0 192.168.10.1 broadcast 255.255.255.255 netmask 255.255.255.0 up
route add default gw 192.168.10.1 dev ra0

## start dhcpd ##
udhcpd /etc/udhcpd.conf

