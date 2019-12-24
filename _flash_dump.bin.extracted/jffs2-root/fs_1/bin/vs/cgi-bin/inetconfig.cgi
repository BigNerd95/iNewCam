IFCONF=/etc/network/ifattr
IFRESOLV=/etc/network/resolv.conf
RESOLV=/etc/resolv.conf
DHCPC=/bin/vs/dhcp.sh
. $IFCONF

ifconfig $iface down
ifconfig $iface hw ether $mac
ifconfig $iface up
    
if [ $dhcp = y ]
then
    #*************run udhcpc************************************
    /sbin/udhcpc -i $iface -b
elif [ $dhcp = n ]
then
    #*****************stop udhcpc TODO:use pidfile**************
    killall -9 udhcpc
    #************TODO:set ip mask******************************
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