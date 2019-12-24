#!/bin/sh

#
# watch dog 
#

WD_CTRL_FILE=/tmp/wd
REBOOT_LOG_FILE=/tmp/reboot.log

# default reboot when dubhe crashed
echo y>$WD_CTRL_FILE

if [ -f $REBOOT_LOG_FILE ];then
    reboot_records=`wc -l $REBOOT_LOG_FILE|awk '{print $1}'`
    echo "reboot records: $reboot_records"
    if [ $reboot_records -ge 100 ];then
	reserved="`tail -n20 $REBOOT_LOG_FILE`"
	echo "$reserved" > $REBOOT_LOG_FILE
    fi
else
    touch $REBOOT_LOG_FILE
fi

while true 
do
    pidof dubhe > /dev/null
    if [ $? -ne 0 ];then
	echo "dubhe may crashed!"
	#read -t 5 -p "reboot system(y/n)?" op
	echo "Control WD in 5 seconds: "
	echo -e "\tReboot: echo y>$WD_CTRL_FILE "
	echo -e "\tDon't : echo n>$WD_CTRL_FILE "
	echo -e "\tQuitWd: echo q>$WD_CTRL_FILE "
	sleep 5
	op=`head -n1 $WD_CTRL_FILE`
	case $op in
	    n|N) 
		echo "Give up to reboot";;
	    q)
		echo "Quit WatchDog now!"
		exit 0;;
	    *) 
		echo "reboot now ..."
		echo "reboot on `date`" >> $REBOOT_LOG_FILE
		reboot;;
	esac
    fi

    sleep 5
done

