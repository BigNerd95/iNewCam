#!/bin/sh
#wifi driver load and unload

KOPATH=/ko

if [ "$1" == "load" ] || [ "$1" == "" ]
then
    echo LOAD wifi >&2
    cd $KOPATH
    insmod Fastlink.ko    
    insmod mtutil7601Usta.ko
    insmod mt7601Usta.ko
    insmod mtnet7601Usta.ko

    
elif [ "$1" == "unload" ]
then
    echo UNLOAD wifi >&2
    wpa_cli -i ra0 terminate  >/dev/null 2>&1
    sleep 1
    rmmod mtnet7601Usta.ko 
    sleep 1
    rmmod mt7601Usta.ko
    sleep 1
    rmmod mtutil7601Usta.ko
    sleep 1
    rmmod Fastlink.ko
fi
