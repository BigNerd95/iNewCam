#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs:/sbin:/ko


## 加载/卸载 wifi ko
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

wifiko_ap()
{
    if [ $1 = "load" ]
    then
        $drvload_ap
    elif [ $1 = "unload" ]
    then
        $drvunload_ap
    fi
}



#$1 ssid
#$2 wifikeytype
#$3 wepid
#$4 wifikey
#$5 wpa_config filename

gen_wpa_config()
{
    wifiessid=$1
    wifikeytype=$2
    wifiwhichkey=$3
    wifikey=$4
    wifi_wpa_conf=$5
    show_dbg2 "gen_wpa_config $*"
    show_info "gen wpa ssid:$wifiessid,keytype:$wifikeytype,keyidx:$wifiwhichkey,key:$wifikey,file:$wifi_wpa_conf"
    
    rm   -Rf $wpa_config_tmp 2>/dev/null

    echo "ctrl_interface=/var/run/wpa_supplicant" > $wpa_config_tmp

    echo "ap_scan=1" >>  $wpa_config_tmp
    echo "update_config=1" >>  $wpa_config_tmp
    
    #wifikeytype define in file $wifi_config
    #wifikeytype =1: no key
    #wifikeytype =2: wep
    #wifikeytype =3:wpa
    
    if [ $wifikeytype = 1 ]
    then
        echo "network={" >>  $wpa_config_tmp
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config_tmp
        echo   "key_mgmt=NONE" >>  $wpa_config_tmp
        echo "}" >>  $wpa_config_tmp
    elif [ $wifikeytype = 2 ]
    then
        echo "network={" >>  $wpa_config_tmp
        echo "ssid=\"${wifiessid}\" " >>  $wpa_config_tmp
        wifikeylen=`expr length $wifikey`        
        show_info wifikey $wifikey wifikeylen is $wifikeylen
        
        if [ $wifikeylen -eq 5 ] || [ $wifikeylen -eq 13 ] || [ $wifikeylen -eq 16 ] 
        then
            ##字符
            show_info "wepkey char"
            echo   "wep_key${wifiwhichkey}=\"${wifikey}\"" >>  $wpa_config_tmp 
        elif [ $wifikeylen -eq 10 ] || [ $wifikeylen -eq 26 ] || [ $wifikeylen -eq 32 ] 
        then
            show_info "wepkey hex"
            echo   "wep_key${wifiwhichkey}=${wifikey}" >>  $wpa_config_tmp 
        else
            show_info "wepkey err"
        fi
        ####echo   "wep_key${wifiwhichkey}=${wifikey}" >>  $wpa_config_tmp 
        
        echo   "key_mgmt=NONE" >>  $wpa_config_tmp
        echo   "wep_tx_keyidx=${wifiwhichkey}" >>  $wpa_config_tmp
        echo   "auth_alg=SHARED" >>  $wpa_config_tmp
        echo " }" >>  $wpa_config_tmp

    elif [ $wifikeytype = 3 ]
    then
        if [ x"$wifikey" = x ] 
        then
            echo "ERROR. WifiKey is null"
            wifikey="12345678"
        fi

        wifikeylen=`expr length $wifikey`
        ##echo wifikey is $wifikey wifikeylen is $wifikeylen
        if [ $wifikeylen -lt 8 ]
        then
            echo "ERROR. Wifikey length must large than 8"
            wifikey="12345678"
        fi
        wpa_passphrase  $wifiessid $wifikey >> $wpa_config_tmp
    fi
    
    #for hide ssid
    networkline=`cat $wpa_config_tmp | grep "network={" -n | awk -F ":" '{print $1}'`
    if [ -n "$networkline" ];then
        networkline=`expr $networkline + 1`
        sed -i "$networkline s/^/\tscan_ssid=1\n/" $wpa_config_tmp
    fi    
    
    sync
}


wifi_sta_connect()
{
    ####wifi_ledflash 4
    
    ##gen_wpa_config
    ## 重新启动wpa_supplicant
    echo "">$tmpfs_path/wifi.disconnect
    if [ ! -z `pidof wpa_supplicant` ]
    then
        wpa_cli -i $wifidev disconnect >>$tmpfs_path/wifi.disconnect 2>&1
        wpa_cli -i $wifidev terminate  >>$tmpfs_path/wifi.disconnect 2>&1
    sleep 3
    fi
    wpa_supplicant -B -d -Dwext -i $wifidev -c $wpa_config >$tmpfs_path/wifi.connect 2>&1    
    
    ####wpa_cli -i $wifidev reconfigure
   
    wpa_cli  -i $wifidev disconnect  >>$tmpfs_path/wifi.disconnect 2>&1
    wpa_cli  -i $wifidev select_network 0 >>$tmpfs_path/wifi.disconnect 2>&1
    wpa_cli  -i $wifidev enable_network 0  >>$tmpfs_path/wifi.disconnect 2>&1
    

}
wifi_sta_disconnect()
{
    wpa_cli -i $wifidev disconnect >$tmpfs_path/wifi.disconnect1 2>&1
}


outputwifiscanresult()
{
    echo -e -n "Content-Type:text/plain\n\r\n\r"
    cat $wifiscanresult | cut -f5 | awk '{print "var ssid_"NR"=\""$0"\";"}'
    cat $wifiscanresult | cut -f3 | awk '{print "var signal_"NR"=\""$1"\";"}'
    cat $wifiscanresult | cut -f4 | awk '{print "var secret_"NR"=\""$1"\";"}'
    #结果中, 有一个\n, 所以不需要再多一个\n
    echo -e -n "\r\n\r"  

}

wifi_scan()
{
    show_info "wifi_scan"
    wpa_cli -i $wifidev scan > /dev/null 2>&1
    wpa_cli -i $wifidev scan > /dev/null 2>&1

    wpa_cli -i $wifidev scan > /dev/null 2>&1
    wpa_cli -i $wifidev scan_result > $tmpfs_path/tmpresult.lst

    echo "">>$tmpfs_path/tmpresult.lst
    sleep 2

    wpa_cli -i $wifidev scan > /dev/null 2>&1
    wpa_cli -i $wifidev scan_result >> $tmpfs_path/tmpresult.lst
    echo "">>$tmpfs_path/tmpresult.lst
    sleep 1

    wpa_cli -i $wifidev scan > /dev/null 2>&1
    wpa_cli -i $wifidev scan_result >> $tmpfs_path/tmpresult.lst
    echo "">>$tmpfs_path/tmpresult.lst



    ##20140429 sort $tmpfs_path/tmpresult.lst -k1 | awk 'BEGIN{print "bssid signal ssid"}{ if ($1!=bss && $1 != "bssid" && $1 != "") {print $0}; bss=$1}' > $wifiscanresult 
    sort $tmpfs_path/tmpresult.lst -k1 | awk 'BEGIN{print "bssid signal ssid"}{ if ($1!=bss && $1 != "bssid" && $1 != "") {print $0}; bss=$1}' > $tmpfs_path/tmpresult2.lst
    sort -r $tmpfs_path/tmpresult2.lst -k3 > $wifiscanresult
    

}


wifi_getstatus()
{
    tmpname=$tmpfs_path/wifistatus.$$
    wpa_cli -i $wifidev status 1>$tmpname 2>/dev/null
    ##chmod +x $tmpname
    . $tmpname
    ##COMPLETED ....
    if [ -z $wpa_state ]
    then
        echo "ERROR"
    else
        echo $wpa_state
    fi
    rm $tmpname -f 2>/dev/null
}

wifi_wait_connect()
{

    retry_times=10
    retry_waittimes=4
    cnt=0
    
    ##show_dbg2 "wifi_wait_connect retry_times  $retry_times retry_waittimes $retry_waittimes"
    while [ $cnt -lt $retry_times ]
    do
        linkstatus=$(wifi_getstatus)
        if [ -z $linkstatus ]
        then
            linkstatus=ERROR
            break
        else
             ### 只有COMPLETED 才是链接成功, 可能的值为 SCANNING, ASSOCIATING,SCANNING
             if [ ${linkstatus} = COMPLETED ]
             then
                linkstatus="COMPLETED"
                break
             else
                 sleep $retry_waittimes
                 cnt=`expr $cnt + 1`
             fi
        fi
    done
    echo $linkstatus
}
## return 1 offline
wifi_module_offline()
{
     lsusb | grep 7601 >/dev/null 2>&1
     mt7601_online=$?
     echo $mt7601_online
}

wifi_getenable()
{
    wifienable=0
    if [ -e $wifi_config ]
    then
        #get wifienable 
        . $wifi_config
        
    else
        wifienable=0
    fi
    
    wifi_offline=$(wifi_module_offline)
    if [ $wifi_offline == 1 ]
    then
        echo -1
    else
        echo $wifienable
    fi
    ##ifconfig ra0 >$tmpfs_path/ra0status 2>&1
    ##ra0status=$?
    ##if [ $ra0status = 1 ]
    ##then
    ##    echo -1
    ##else
    ##    echo $wifienable
    ##fi
}




wifi_ap_ipcfg()
{
    killall -9 udhcpc
    killall -9 udhcpd
    
    show_info "AP ip config as $ap_ip"
  
    ifconfig $wifidev $ap_ip netmask $ap_mask
    ifconfig $wifidev up
    route add default gw $ap_gateway dev $wifidev
    route add -net 239.0.0.0 netmask 255.0.0.0 $wifidev 2>/dev/null
    udhcpd -S &
 #   /bin/vs/mcast.sh 5 &
    
    if [  -e $ip_cache1 ]
    then
        . $ip_config 
        . $mac_lined_file
        if [ $dhcp = "n" ]
        then
            net_cache $wifidev $ap_ip $ap_mask $ap_gateway $macaddress "0" "0"
        else
            net_cache $wifidev $ap_ip $ap_mask $ap_gateway $macaddress "1" "1"
        fi
        #$1 NETTYPE    #$2 IP     #$3 MASK     #$4 GW    #$5 MAC    #$6 DHCPFlag    #$7 DNSFlag    
    fi
}

ap_ssid_update()
{
    NetDev=`cat $tmpfs_path/netdev`

    APFile="/etc/Wireless/RT2870AP/RT2870AP.orig.dat"
    TmpFile="$tmpfs_path/RT2870AP.dat"
    APFileLink="/etc/Wireless/RT2870AP/RT2870AP.dat"
    #WifiAPCfg="/etc/wifiap.conf"
    
    SSIDLine=`cat $APFile | grep ^SSID= -n | cut -d : -f 1`
    SSID=`cat $APFile | grep ^SSID= -n | cut -d : -f 2`
#    P2P_ID=`paraconf r 1 P2P_ID`
    APDefault=IPCAM-AP
	dev_id=`dev_read |awk '{print $4}'`
	#sed -i "s/^SSID=.*$/SSID=IPC-AP[$dev_id]/" /etc/Wireless/RT2870AP/RT2870AP.dat
	APName=
    APPrefix=IPCAM
    APPostfix=
    if [ -e $ap_cfgfile ]
    then
        . $ap_cfgfile
        if [ ! -z $ap_name ]
        then
            APName=$ap_name
        fi

        if [ ! -z $ap_prefix ]
        then
            APPrefix=$ap_prefix
        fi
    fi
    
    show_info "AP APName $APName"
    show_info "AP APPrefix $APPrefix"
    
#    if [ ! $P2P_ID"A" = "nullA" ]
#    then
#        #P2P_ID=`paraconf r 1 P2P_ID | cut -c 1-6`
#        #APPostfix=`echo $P2P_ID | cut -c 1-10`
#        APPostfix=$(str_lastn $P2P_ID 12)
#    else
        #get MAC
#        APPostfix=`cat /sys/class/net/$NetDev/address | awk -F ':' '{print $3$4$5$6}'`
#    fi
    
    show_info "AP APPostfix $APPostfix"
    
    #APName 为空, 要构成
    if [ -z $APName ]
    then
        echo "not set apname, use default"
        if [ -z $APPrefix ]
        then
            APPrefix=$APDefault
        fi
        
        if [ -z $APPostfix ]
        then
            APSSID=$APPrefix-$dev_id
        else
            APSSID=$APPrefix-$dev_id-$APPostfix
        fi
        
    else
        APSSID=$APName
    fi
    
    #SSID="SSID=IPCAM-AP-"$P2P_ID
    SSID="SSID=$APSSID"
    show_info "AP SSID=$APSSID" 
    sed "${SSIDLine}s/^.*$/$SSID/" $APFile > $TmpFile
        
    if [ -e $APFileLink ]
    then
        echo "$APFileLink Exist"
        if [ ! -L $APFileLink ]
        then
            echo "$APFileLink Exist. not link"
            rm -f $APFileLink
            ln -s $TmpFile $APFileLink
        fi
    else
            echo "$APFileLink Not Exist"
            ln -s $TmpFile $APFileLink
    fi
        

}

wifi_ap_start()
{
    show_func "wifi_ap_start"
    wifiko_ap load
    wifi_setmode "AP"
}

wifi_ap_stop()
{
    show_func "wifi_ap_stop"
    ifconfig $wifidev down
    wifiko_ap unload
    wifi_setmode NONE
}

### 加载STA
wifi_sta_start()
{
    show_func "wifi_sta_start"
    wifiko load   
    wifi_setmode "STA"
    sleep 1
    wpa_supplicant -B -d -Dwext -i $wifidev -c $wpa_config >$tmpfs_path/wifi.connect 2>&1        
    ifconfig $wifidev up
}


wifi_sta_stop()
{
    show_func "wifi_sta_stop"
    killall -9 wpa_supplicant
    ifconfig $wifidev down
    wifiko unload
    wifi_setmode NONE
}

wifi_stop()
{
    ifconfig $wifidev 0.0.0.0
}

wifi_stopall()
{
    show_dbg2 "wifi_stop all"
    wifi_sta_stop
    wifi_ap_stop
}


wifi_wpsOK()
{
    wpa_cli -i $wifidev status > $tmpfs_path/wifistatus.$$
    chmod +x $tmpfs_path/wifistatus.$$
    . $tmpfs_path/wifistatus.$$

    wpa_cli save_config
    #ssid get from wifistatus.$$
    wifiessid=$ssid
    wifiwhichkey=
    wifikeytype=
    wifikeyold=
    wifikey=
    enable=1
    cat $wifidev_config > $wifi_config_tmp
    echo "wifidev=\"${wifidev}\"" >> $wifi_config_tmp
    echo "wifienable=\"${enable}\"" >> $wifi_config_tmp
    echo "wifiessid=${wifiessid}" >> $wifi_config_tmp
    echo "wifikeytype=$wifikeytype" >> $wifi_config_tmp
    echo "wifiwhichkey=$wifiwhichkey" >> $wifi_config_tmp
    echo "wifikey=\"$wifikey\"" >> $wifi_config_tmp

    rm -f $wifi_config
    cp -f $wifi_config_tmp  $wifi_config
    ## when WPS, default dhcp
    setinetattr.cgi "cmd=aa&-dhcp=on&-dnsstat=1"
    sync
}


#$1, 切换模式
#$2, 是否强制切换, 如果不输入, 默认为强制

wifi_modeswitch()
{
    
    if [ -z $1 ]
    then
        wifimode_new=NONE
    else
        wifimode_new=$1
    fi
    
    if [ -z $2 ]
    then
        force=Y
    else
        force=$2
    fi
    
    show_dbg "CurrWifiMode $wifimode_curr switchto $wifimode_new, isforce:$force"
    
    if [ $wifimode_new == $wifimode_curr -a $force = N ]
    then
        show_dbg "same wifimode and not force, do nothing"
        return
    fi
    
    if [ $wifimode_new == "LINED" ]
    then
        show_info "Enter LINED Mode"
        if [ $wifimode_curr == "AP" ]
        then
            wifi_ap_stop
            kill -9 udhcpd 2>/dev/null
        fi      
        wifi_setmode "NONE"
        wifi_setstate "NONE"
        
    elif [ $wifimode_new == "AP" ]
    then
        show_info "Enter AP Mode"
        
        if [ $wifimode_curr == "STA" ]
        then
            ifconfig $wifidev up
            wifi_scan
            wifi_sta_stop
        elif [ $wifimode_curr == "AP" ]
        then
            show_info "Now is AP"
        else
            wifi_sta_start
            wifi_scan
            wifi_sta_stop
        fi      
        ap_ssid_update
        sleep 1
        wifi_ap_start
        wifi_ap_ipcfg
        wifi_setmode "AP"
        
        
    elif [  $wifimode_new == "STA" ]
    then
        show_info "Enter STA Mode"
        rm $wifiscanresult -f 2>/dev/null
        if [ $wifimode_curr == "AP" ]
        then
            wifi_ap_stop
            wifi_sta_start
        elif  [ $wifimode_curr == "NONE" ]
        then
            wifi_sta_start
        fi
        wifi_setmode "STA"
        wifi_sta_connect
        wifi_setstate STA_CONNECTING        
        
    elif [  $wifimode_new == "WPS" ]
    then
        show_info "enter WPS mode"
                        
        if [ $wifimode_curr == "AP" ]
        then
            wifi_ap_stop
            wifi_sta_start
        elif [ $wifimode_curr == "NONE" ]
        then
            wifi_sta_start
        fi 
        
        wpa_cli -i $wifidev remove_network 0
        wpa_cli -i $wifidev remove_network 1
        wpa_cli -i $wifidev wps_pbc
        
        wifi_setmode WPS
        wifi_setstate WPS_CONNECTING
        
    elif [ $wifimode_new == "NONE" ]
    then
        wifi_ap_stop
        wifi_sta_stop
        wifi_setmode "NONE" 
    fi
    
}

    