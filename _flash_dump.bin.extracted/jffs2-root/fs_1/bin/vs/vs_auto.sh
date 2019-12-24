#!/bin/sh


VS_SERVER_PATH="`dirname $0`"

echo $VS_SERVER_PATH

PRO_NAME=vs_server 
WPA_NAME=wpa_supplicant
RUN_SERVER=$VS_SERVER_PATH/$PRO_NAME
echo $PRO_NAME
NUM=0
$RUN_SERVER &
sleep 60
while true ; do
##### 用ps获取$PRO_NAME进程数量 少于1，重启进程
   NUM=`ps  | grep ${PRO_NAME} | grep -v grep |wc -l`
   if [ "${NUM}" -lt "1" ];then
    echo "${PRO_NAME} was killed"
    killall -9 $WPA_NAME
    reboot
  fi
###kill僵尸进程  
  NUM_STAT=`ps  | grep ${PRO_NAME} | grep T | grep -v grep | wc -l`
  if [ "${NUM_STAT}" -gt "0" ];then
    killall -9 ${PRO_NAME}
    killall -9 $WPA_NAME
    reboot
  fi
	echo 3 >/proc/sys/vm/drop_caches
  sleep 5
done
 
exit 0
