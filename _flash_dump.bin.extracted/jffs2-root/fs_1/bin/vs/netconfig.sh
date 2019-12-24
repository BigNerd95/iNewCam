#!/bin/sh

IFCONF=/etc/network/ifattr
IFRESOLV=/etc/network/resolv.conf
RESOLV=/etc/resolv.conf
DHCPC=/bin/vs/dhcp.sh
DETECT=/bin/vs/eth0status
WIFICONF=/bin/wificonfig
UPNPINIT=/bin/vs/cgi-bin/upnp_init.cgi
DDNSINIT=/bin/vs/cgi-bin/ddns_start.cgi
ADSLINIT=/bin/vs/cgi-bin/adsl_init.cgi

#detect invalid interface
$DETECT
rtn=$?
if [ $rtn = 1 ];then
    iface=eth0
elif [ $rtn = 0 ];then
    iface=eth2
    ifdown eth0
    $WIFICONF
fi

#update ifattr
cp $IFCONF $IFCONF-bak
sed -e "s/^iface=.*/iface=$iface/" \
    -e "s/^priflag=.*/priflag=1/"  \
    $IFCONF-bak > $IFCONF

. $IFCONF

#set the MAC address
ifdown $iface
ifconfig hw ether $mac
ifup $iface

#set iface attributes
if [ $dhcp = y ]
then
    #*************run udhcpc************************************
    /sbin/udhcpc -i $iface -b
elif [ $dhcp = n ]
then
    #*****************stop udhcpc TODO:use pidfile**************
    killall -9 udhcpc    
    #************set ip mask******************************
    if [ -n "$address" -a -n "$netmask" ];then
    /sbin/ifconfig $iface $address netmask $netmask
    fi
    #************set Gateway  DNS******************************
    if [ $priflag = 1 ]
    then
        if [ -n $gateway ]
        then
            echo "deleting routers"                        
            while /sbin/route del default gw 0.0.0.0       
            do :                                           
            done
            
            /sbin/route add default gw $gateway dev $iface
        fi
        
        if [ -e $RESOLV ];then
            rm -f $RESOLV
        fi
        cp $IFRESOLV $RESOLV    
    fi
fi

#upnp init
if [ -x $UPNPINT ];then
#    $UPNPINIT
fi

#ddns init
if [ -x $DDNSINIT ];then
#    $DDNSINIT
fi

#adsl init
if [ -x $ADSLINIT ];then
#    $ADSLINIT
fi


