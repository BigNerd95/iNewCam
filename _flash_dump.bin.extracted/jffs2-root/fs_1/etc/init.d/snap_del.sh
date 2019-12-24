#!/bin/sh

FTPDIR=/mnt/sd1/images/
LIMITNUMS=100

#set -x

while true
do
    if [ -d $FTPDIR ];then
	cd $FTPDIR
	IMGNUM=`ls -1 $FTPDIR|wc -l`
	if [ $IMGNUM -gt $LIMITNUMS ];then
	    DELNUM=`expr $IMGNUM \* 1 / 5`
	    ls -1 $FTPDIR|head -n $DELNUM|xargs rm -f
	fi
    fi
    sleep 30
done

#set +x

