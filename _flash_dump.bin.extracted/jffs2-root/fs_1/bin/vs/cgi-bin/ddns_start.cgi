#!/bin/sh

DDNSCONF=/etc/ipcamera/ddns.conf
DDNSBIN=/bin/vs/ez-ipupdate
. $DDNSCONF


#1.kill
#echo "killall -QUIT ez-ipupdate"
killall -INT ez-ipupdate

if [ $ddnsenable -eq 1 ]
then
#2.judge the valid interface
#echo "judge the valid interface"
#for i in eth0 eth1
#do
#   ifconfig $i |grep UP > /dev/null 2>&1
#   if [ $? -eq 0 ];then
#     interface=$i
#     break
#   fi
#done

#3.restart ez-ipupdate
#echo "restart ez-ipupdate"
#echo "ez-ipupdate -d -S $servicetype -u $user:$password -h $host -i $interface -P $interval -b $cachefile"
if [ "${ddnsuser}" = "" ]
then
    ddnsuser=0
fi

if [ "${ddnspassword}" = "" ]
then 
    ddnspassword=0
fi

if [ "${ddnshost}" = "" ]
then 
    ddnshost=0
fi

#$DDNSBIN -a 0.0.0.0 -d -S $servicetype -u $user:$password -h $host -P $interval -b $cachefile --force -i $interface
$DDNSBIN -a 0.0.0.0 -d -S $ddnsservicetype -u $ddnsuser:$ddnspassword -h $ddnshost -P $ddnsinterval --force

fi #if [ $upnpenable -eq 1 ]
