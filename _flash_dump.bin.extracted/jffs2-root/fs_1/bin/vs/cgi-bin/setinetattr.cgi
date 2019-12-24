#!/bin/sh

#***********************************************
#***********************************************
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh

IFCONF=/etc/network/ifattr
IFCONF_BAK=/tmpfs/ifattr
WIFIIFCONF=$config_path/ifwifiattr
WIFIIFCONF_BAK=$tmpfs_path/ifwifiattr

IFRESOLV=/etc/network/resolv.conf
RESOLV=/etc/resolv.conf
NETDEV=/tmpfs/netdev
iface=`cat $NETDEV`

#REQUEST_METHOD=GET
#REQUEST_METHOD(GET/POST)
#QUERY_STRING="-ipaddr=192.168.0.159&-netmask=255.255.255.0&-gateway=192.168.0.1&-dhcp=off&-dnsstat=0&-fdnsip=10.72.255.1&-sdnsip=10.72.55.22&httpport=8"
#QUERY_STRING="-ipaddr=192.168.0.132&-netmask=255.255.255.0&-gateway=192.168.0.1&-hwaddr=00:80:47:2D:76:53&"

#CONTENT_LENGTH

if [ "$REQUEST_METHOD" = "GET" ]
then
    CGIPARAM=$QUERY_STRING
elif [ "$REQUEST_METHOD" = "POST" ]
then
    read CGIPARAM
else
   CGIPARAM=$1
fi


CMD_LINE="`echo $CGIPARAM | sed -n "s/&/\n/gp"`"
get_param()
{
    echo "${CMD_LINE}" | grep "${1}=" | sed -n "s/\-${1}=//p" 
}

#parse the QUERY_STRING and get the param
p_dhcp="`get_param "dhcp"`"
p_dnstype="`get_param "dnsstat"`"
p_address="`get_param "ipaddr"`"
p_netmask="`get_param "netmask"`"
p_gateway="`get_param "gateway"`"
p_dns1="`get_param "fdnsip"`"
p_dns2="`get_param "sdnsip"`"
p_hwaddr="`get_param "hwaddr"`"

p_configmini=N

if [ $iface"A" == "eth0""A" ]
then
. $IFCONF
else
. $WIFIIFCONF
fi



if [  $p_dhcp"A" = "A" ] 
then
	p_dhcp=$dhcp
fi

if [  $p_dnstype"A" = "A" ] 
then
	p_dnstype=$dnstype
fi

if [  $p_address"A" = "A" ] 
then
    p_configmini=Y
	p_address=$address
fi

if [  $p_netmask"A" = "A" ] 
then
	p_netmask=$netmask
fi

if [  $p_gateway"A" = "A" ] 
then
	p_gateway=$gateway
fi

#if [  $p_hwaddr"A" = "A" ] 
#then
#	p_hwaddr=`/bin/paraconf r 1 mac`
#fi


# 没有mac参数
if [ $p_hwaddr"A" = "A" ]
then
    #echo "Do nothing"
    XY=0

else
    mac=`/bin/paraconf r 1 mac`
    ret=$?
    #echo $mac to $p_hwaddr

    if [ ${ret} -ne 0 ]
    then
        mac=$p_hwaddr
    fi
    
    if [ $mac"A" != $p_hwaddr"A" ]
    then
        /bin/paraconf w 1 mac $p_hwaddr
        ifconfig $iface hw ether $p_hwaddr
        echo "macaddress=$mac" > $mac_lined_file 
        
        if [ $p_configmini = "Y" ]
        then 
            ##不配置ip情况下, 其他信息没有必要配置.
            ##echo "mini config"
            exit
        fi
    fi
fi


#echo IP:$p_address

if [ "$p_dhcp" = "on" ];then
    p_dhcp=y
elif [ "$dp_hcp" = "off" ];then
    p_dhcp=n
else
    p_dhcp=n
fi

if [ "$p_dnstype" = "1" ];then
### 使用dhcp分配的dns server
    p_dnstype=server
elif [ "$p_dnstype" = "0" ];then
    p_dnstype=specify
else    
    p_dnstype=specify
fi

##. $IFCONF

#save ifattr


if [ $iface"A" == "eth0""A" ]
then
cp -f $IFCONF $IFCONF_BAK > /dev/null

	if [ "$p_dhcp" = y ];then
		sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
			-e "s/^dnstype=.*/dnstype=$p_dnstype/" \
			$IFCONF_BAK > $IFCONF
		
	elif [ "$p_dhcp" = "n" ];then
		sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
			-e "s/^dnstype=.*/dnstype=$p_dnstype/" \
			-e "s/^address=.*/address=$p_address/" \
			-e "s/^netmask=.*/netmask=$p_netmask/" \
			-e "s/^gateway=.*/gateway=$p_gateway/"  \
			$IFCONF_BAK > $IFCONF
	fi
	. $IFCONF
else
cp -f $WIFIIFCONF $WIFIIFCONF_BAK > /dev/null
	if [ "$p_dhcp" = y ];then
		sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
			-e "s/^dnstype=.*/dnstype=$p_dnstype/" \
			$WIFIIFCONF_BAK > $WIFIIFCONF
		
	elif [ "$p_dhcp" = "n" ];then
		sed -e "s/^dhcp=.*/dhcp=$p_dhcp/" \
			-e "s/^dnstype=.*/dnstype=$p_dnstype/" \
			-e "s/^address=.*/address=$p_address/" \
			-e "s/^netmask=.*/netmask=$p_netmask/" \
			-e "s/^gateway=.*/gateway=$p_gateway/"  \
			$WIFIIFCONF_BAK > $WIFIIFCONF
	fi
	.$WIFIIFCONF
fi


#save dns
if [ "$p_dnstype" = specify ];then
    if [ "$p_dns1" = "" ] && [ "$p_dns2" = "" ]
    then
        xx=""
    else
        echo -n > $IFRESOLV
        if [ "$p_dns1" != "" ]
        then
            echo nameserver $p_dns1 >> $IFRESOLV 
        fi
        if [ "$p_dns2" != "" ]
        then
            echo nameserver $p_dns2 >> $IFRESOLV 
        fi        
    fi
    widedns=`grep "8.8.8.8" $IFRESOLV`
    if [ -z $widedns ]
    then
        echo nameserver 8.8.8.8 >> $IFRESOLV
    fi    
fi    

    
net_setip_currdev 
    
#echo $HTTP_REFERER
#echo -e "\r\n"
#echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" #content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"


