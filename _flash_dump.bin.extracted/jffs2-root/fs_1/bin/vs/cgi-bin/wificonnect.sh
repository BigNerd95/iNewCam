#连接或者断开
#!/bin/sh
###全局变量

####config_path=/etc/network

####wifi_config=$config_path/wifi.conf
####wpa_config=/tmpfs/wpa_supp.conf

. /bin/vs/cgi-bin/netenv.conf

. $wifi_config
export wifidev
echo wifidev $wifidev
### load wifi ko
### wifi_ko {load|unload}

wifiko()
{
    if [ $1 = "load" ]
    then
        $drvload
    elif [ $1 = "unload" ]
    then
        $drvunload
    fi
        
}

wifi_load()
{
        wifiko load   
        ##rm $wpa_config
        ##echo "ctrl_interface=/var/run/wpa_supplicant" >> $wpa_config
        ##echo "ap_scan=1" >>  $wpa_config
		echo STA > $wifimode
        wpa_supplicant -B -d -Dwext -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1        
}
wifi_connect()
{
		##gen_wpa_config
	## 重新启动wpa_supplicant
	echo STA > $wifimode
	wpa_cli -i $wifidev disconnect >/tmpfs/wifi.disconnect1 2>&1
	wpa_cli -i $wifidev terminate  >/tmpfs/wifi.disconnect2 2>&1

	wpa_supplicant -B -d -Dwext -i $wifidev -c $wpa_config >/tmpfs/wifi.connect 2>&1    
	
    ####wpa_cli -i $wifidev reconfigure
   
    wpa_cli  -i $wifidev disconnect
    wpa_cli  -i $wifidev select_network 0
    wpa_cli  -i $wifidev enable_network 0 
    
}
wifi_disconnect()
{
    wpa_cli -i $wifidev disconnect >/tmpfs/wifi.disconnect1 2>&1
    #wpa_cli -i $wifidev terminate  >/tmpfs/wifi.disconnect2 2>&1
    #wpa_cli -i ra0 terminate
    #double check
    #killall -9 wpa_supplicant
}




wifi_status()
{
    wpa_status=`wpa_cli -i $wifidev status 2>/dev/null | grep wpa_state | sed -n 's/wpa_state=//gp'`
    if [ -z $wpa_status ]
    then
        echo "ERROR"
    else
        echo $wpa_status
    fi
}


case "$1" in 
    "status")
        wifi_status=$(wifi_status)
        echo $wifi_status
        ;;
    
    "load")
        wifi_load
        ;;
    
    "unload")
        wifiko unload
        ;;
        
    "connect")
        wifi_connect
        ;;
        
    "disconnect")
        wifi_disconnect
        ;;
        
     "start")
        wifi_disconnect
        wifiko unload
        wifiko load
        wifi_connect
        ;;
     "test")
        wifi_disconnect
        wifi_connect
        
        ;;
    "stop")
        wifi_disconnect
        wifiko unload
        ;;
    *)
        echo "`basename $0` {connect|disconnect|status|load|unload|stop}"
        ;;
esac

    
