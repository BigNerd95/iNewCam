#!/bin/sh
## $1 AP|STA
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh



##wifi_sta_stop
##wifi_ap_stop

netact=NONE
if [ -z $1 ]
then
    netact=TO_STA
else
    if [ $1 == "AP" ]
    then
        netact=TO_AP
    elif [ $1 == "STA" ]
    then
        netact=TO_STA
    elif [ $1 == "WPS" ]
    then
        netact=TO_WPS
    else
        netact=$1
    fi
fi

net_setaction $netact





