#!/bin/sh

### Check Flash Available ###
#umount /mnt/sd1
#if [ `du -s /mnt/|awk '{print $1}'` -gt 16 ];then
#    rm -rf /mnt/*  ## normal size < 16KB
#fi
if [ `du -s /tmp/|awk '{print $1}'` -gt 1024 ];then
    rm -f /tmp/*.log ## normal size < 1MB
fi
### end ###

### First,check update ###
echo "check update now..."
#/etc/init.d/update.sh
### end check update ###

if [ ! -d  "/var/lib" ]
then
mkdir -p /var/lib # dhcpcd need the dir
fi
 
#echo "config default ip 192.168.1.230"
#ifconfig eth0 192.168.1.230 up
#route add default gw 192.168.1.1

#telnetd &
echo "load sys ko"

himm 0x200f0138 0
himm 0x20140400 0x61
himm 0x20140100 0x40

cd /ko
./load3518 -i ov9712

#./load3518 -i ar0130
#insmod mt7601Usta.ko
#wpa_supplicant -B -Dwext -ira0 -c/etc/wpa_supplicant.conf
#ifconfig ra0 192.168.10.1 up
#HWADDR=`ifconfig ra0|grep HWaddr|awk '{print $5}'`
#ifconfig eth0 hw ether $HWADDR # use wifi mac for eth0 mac to keep unique

#echo "start app"
#dubhe &
#update &

#echo "start wd.sh"
#/etc/init.d/wd.sh &
#/etc/init.d/snap_del.sh &

