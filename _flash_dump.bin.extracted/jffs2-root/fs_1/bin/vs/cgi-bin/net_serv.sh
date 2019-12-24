#!/bin/sh

###nolined means unplug line

##ACTION = NONE, PlugLine, UnplugLine, TO_STA, TO_WPS, TO_AP
##WIFISTATE  = NONE, (STA_CONNECTING, STA_FAILED), STA_OK, (WPS_CONNECTTING, WPS_FAILED, WPS_OK)
##LINESTATE = LINED, NOLINED
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh
. /bin/vs/cgi-bin/wifiled.sh

var_wifi_connecting_times=0
var_wificonnect_cnt=0

wifi_connecting_cnt_reset()
{
    var_wifi_connecting_times=0
    var_wificonnect_cnt=0
}


net_doaction()
{
    #netaction=$net_action_curr
    netaction=$(net_getaction)
    

    #show_dbg2 "net_doaction $netaction "
    case $netaction in
      NONE)
       zzz=1
       ;;
      PLUGLINE)
        show_info "process netaction plug line"
        wifi_modeswitch "LINED"
        net_setdev eth0
        ifconfig $wifidev 0.0.0.0
        net_setaction NONE
        net_setip LINED
        wifi_ledflash 0
      ;;
      UNPLUGLINE)
        ### 判断是否wifi使能, 如果使能, 开始切换动作到 TO_STA
        ### 否则, 什么都不做
        show_info "process netaction unplug line"
        wifienable=$(wifi_getenable)
        show_info "wifienable:$wifienable"
        ##1 / 2
        if [ $wifienable == 1 -o $wifienable == 2 ]
        then
            show_info "unplug line, wifienable is $wifienable. will start wifi"
            ifconfig eth0 0.0.0.0
            net_setdev $wifidev
            
            net_setaction TO_STA
        else
            show_info "unplug line, but wifienable is $wifienable. donothing"
            net_setaction NONE
        fi
        wifi_ledflash 4
      ;;
      TO_STA)
        show_dbg2 "process netaction TO_STA"
        wifi_modeswitch "STA"
        net_setaction NONE
      ;;
      TO_WPS)
        show_dbg2 "process netaction TO_WPS"
        wifi_modeswitch "WPS"
        net_setaction NONE
        wifi_ledflash 3
      ;;
      TO_AP)
        show_dbg2 "process netaction TO_AP"
            wifi_modeswitch "AP"
            net_setaction NONE
            wifi_setstate "AP"        
     
      ;;
      TO_TEST)
        ;;
      *)
      echo "unknown action $netaction"
      net_setaction NONE
      ;;
    esac

}

wifi_dostate()
{
    prewifistate=$1
    curwifistate=$2

    #show_dbg2 "wifi_dostate $prewifistate , $curwifistate"

    case $curwifistate in
      NONE)
      ;;
      STA_CONNECTING)
        show_dbg2 "STA_CONNECTING var_wifi_connecting_times $var_wifi_connecting_times var_wificonnect_cnt $var_wificonnect_cnt"
        if [ $var_wifi_connecting_times -eq 0 ]
        then
            if [ $var_wificonnect_cnt -lt $cfg_wifi_retry ]
            then
                linkstatus=$(wifi_getstatus)
                if [ ${linkstatus}"A" = COMPLETED"A" ]
                then
                    wifi_setstate STA_OK
                    return
                fi
                var_wificonnect_cnt=`expr $var_wificonnect_cnt + 1`
                show_info  "Linkstatus is $linkstatus"
            else
                linkstatus=$(wifi_getstatus)
                if [ ${linkstatus}"A" = COMPLETED"A" ]
                then
                    wifi_setstate STA_OK
                else
                    wifi_setstate STA_FAILED
                fi
                return
            fi
            var_wifi_connecting_times=`expr $var_wifi_connecting_times + 1`
        else
            var_wifi_connecting_times=`expr $var_wifi_connecting_times + 1`
            if [ $var_wifi_connecting_times -ge $cfg_wifi_retry_internal ]
            then
                var_wifi_connecting_times=0
            fi
        fi
      ;;
      STA_FAILED)
        wifi_connecting_cnt_reset
        if [ $cfg_wifiautoap = 1 ]
        then
            show_info1 "STA connect failed. AUTO to AP"
            net_setaction TO_AP
        fi
        wifi_setstate NONE
        wifi_ledflash 4
      ;;
      
      STA_OK)

        wifi_connecting_cnt_reset
        show_dbg2 "STA OK"
        wifi_setstate NONE
        net_setip STA
        wifi_ledflash 1
      ;;
      WPS_CONNECTING)
        show_dbg2 "STA_CONNECTING var_wifi_connecting_times $var_wifi_connecting_times var_wificonnect_cnt $var_wificonnect_cnt"
        if [ $var_wifi_connecting_times -eq 0 ]
        then
            if [ $var_wificonnect_cnt -lt $cfg_wifiwps_retry ]
            then
                linkstatus=$(wifi_getstatus)
                if [ ${linkstatus}"A" = COMPLETED"A" ]
                then
                    wifi_setstate WPS_OK
                    return
                fi
                var_wificonnect_cnt=`expr $var_wificonnect_cnt + 1`
                show_info  "Linkstatus is $linkstatus"
            else
                linkstatus=$(wifi_getstatus)
                if [ ${linkstatus}"A" = COMPLETED"A" ]
                then
                    wifi_setstate WPS_OK
                else
                    wifi_setstate WPS_FAILED
                fi
                return
            fi
            var_wifi_connecting_times=`expr $var_wifi_connecting_times + 1`
        else
            var_wifi_connecting_times=`expr $var_wifi_connecting_times + 1`
            if [ $var_wifi_connecting_times -ge $cfg_wifiwps_retry_internal ]
            then
                var_wifi_connecting_times=0
            fi
        fi
      ;;
      WPS_FAILED)
        show_info "WPS_FAILED"
        wifi_connecting_cnt_reset
        wifi_setmode STA
        wifi_setstate NONE
        wifi_ledflash 3
      ;;
      WPS_OK)
        show_info "WPS_OK"
        wifi_connecting_cnt_reset
        wifi_wpsOK
        wifi_setmode STA
        wifi_setstate NONE
        wifi_ledflash 1
      ;;
      AP)
      wifi_connecting_cnt_reset
      wifi_ledflash 2
      wifi_setstate NONE
      ;;
      *)
      ;;
    esac


}


if [ -e /tmpfs/net_serv.pid ]
then
    kill -9 `cat /tmpfs/net_serv.pid`
    rm /tmpfs/net_serv.pid -f
fi

echo $$ > /tmpfs/net_serv.pid
show_info "start net_serv daemon $$"



if [ -e $ip_config ]
then
    . $ip_config
    ##不存在ip地址
    if [ -z $address ]
    then
    gen_ifattr
    fi
else
    gen_ifattr
fi






wifistate_prev=NONE
linestate_prev=NONE

mkdir -p /tmpfs/net/
net_setaction "NONE"


net_setmac

wifi_realenable=$(wifi_getenable)
show_info "wifi_realenable is $wifi_realenable"

preload_wifiko=1


while [ 1 ]
do
    #获取有线状态
    linestate_curr=$(net_getlinedstatus)
    ##show_dbg "linestate_curr is $linestate_curr and  $linestate_prev"
    ## 网线插拔状态有变化
    if [ $linestate_curr != $linestate_prev ]
    then
        show_dbg "linestate_change $linestate_prev TO $linestate_curr."
        linestatechanged=1
        if [ $linestate_curr = 0 -o $linestate_curr = 2 ]
        then
             net_setaction "UNPLUGLINE"
        elif [ $linestate_curr = 1 ]
        then
             net_setaction "PLUGLINE"
        fi
    fi

    net_doaction
    linestate_prev=$linestate_curr
    ###curnetaction=$(getnetaction)

    #echo $wifistate_prev , $wifistate_curr
    wifi_dostate $wifistate_prev $wifistate_curr
    wifistate_prev=$wifistate_curr

    if [ $preload_wifiko = 1 ]
    then
        if [ $wifi_realenable -ge 1 ] 
        then
            preload_wifiko=0
            wifi_sta_start
            echo "wifimac=`cat /sys/class/net/${wifidev}/address`" > $mac_wifi_file
        else
            echo "wifimac=" > $mac_wifi_file
        fi    
        preload_wifiko=0
    fi
    
    sleep 1
    ###ledflash
done

