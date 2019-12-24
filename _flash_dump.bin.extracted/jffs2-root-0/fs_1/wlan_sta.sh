#!/bin/sh

## kill udhcpd ##
killall udhcpd > /dev/null 2>&1
killall wpa_supplicant >/dev/null 2>&1

## unload wifi ap module ##
ifconfig ra0 down
rmmod mt7601Uap.ko

## load wifi station module ##
insmod /ko/mt7601Usta.ko
ifconfig eth0 192.168.44.44
route add default gw 192.168.44.1 dev eth0 
ifconfig ra0 192.168.1.230 broadcast 255.255.255.255 netmask 255.255.255.0 up
route add default gw 192.168.1.1 dev ra0

## start wpa_supplicant and scan aps ##
wpa_supplicant -B -Dwext -ira0 -c/etc/wpa_supplicant.conf
wpa_cli -ira0 scan

