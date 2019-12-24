#!/bin/sh

#wifi driver load and unload
KOPATH=/ko

if [ "$1" == "load" ] || [ "$1" == "" ]
then
    echo LOAD wifiap >&2
    cd $KOPATH
    insmod mt7601Uap.ko
    
elif [ "$1" == "unload" ]
then
    echo UNLOAD wifiap >&2
    rmmod  mt7601Uap.ko
fi
