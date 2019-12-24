#!/bin/sh

#偶尔会出问题, 先暂时屏蔽掉

#    echo 200 OK HTTP 1.1 
#    echo
#    echo var p2p_enable = "-1";
#    echo -e "\r\n"
#
#    exit


# '##  /bin/vs/cgi-bin/p2p.cgi "&-action=get"'
# '##/bin/vs/cgi-bin/p2p.cgi "&-action=set&-enable=0"'


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

arg_p2p_action="`get_param "action"`"
arg_p2p_enable="`get_param "enable"`"
arg_p2p_pwd="`get_param "p2p_pwd"`"

p2p_tran=`paraconf r 1 P2P_TRAN`
if [ $? != 0 ]
then
p2p_tran=null
fi
. /etc/ipcamera/p2p.conf 

echo arg_p2p_action $arg_p2p_action
if [ $arg_p2p_action = "get" ]
then
    p2p_tran=`paraconf r 1 P2P_TRAN`
	p2p_ID=`paraconf r 1 P2P_DID`
	p2p_PWD=`paraconf r 1 P2P_PWD`
	
    if [ $p2p_tran = null ] 
    then
        var_p2p_enable=-1
    else
        . /etc/ipcamera/p2p.conf    
        #echo $p2p_enable
        var_p2p_enable=$p2p_enable
    fi
    echo 200 OK HTTP 1.1 
    echo
    echo var p2p_enable = \"${var_p2p_enable}\"\;
    echo var p2p_id = \"${p2p_ID}\"\;
	echo var p2p_pwd = \"${p2p_PWD}\"\;
    echo -e "\r\n"
#    echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"
    exit
fi

if [ $arg_p2p_action = "set" ]
then
#    echo "p2p_enable=$arg_p2p_enable" >/etc/ipcamera/p2p.conf
#    /bin/paraconf w 1 P2P_PWD ${arg_p2p_pwd}
#    killall -9 $p2p_tran >/tmpfs/err 2>&1
	
    #echo p2p_tran $p2p_tran 
    ###if [ $arg_p2p_enable = 0 ]
    ###then
    ###    #echo DEBUG p2p_enable $arg_p2p_enable
    ###    #killall -9 p2p_deamon >/tmpfs/err 2>&1
    ###    #killall -9 $p2p_tran >/tmpfs/err 2>&1 
    ###    #killall -9 start_p2p.sh >/tmpfs/err 2>&1
    ###    
    ###else 
    ###    #if [ $arg_p2p_enable != $p2p_enable ]
    ###    #then
    ###    #    /bin/vs/start_p2p.sh 
    ###    # fi
    ###fi
    ###    
    echo 200 OK HTTP 1.1 
    echo -e "\r\n"
#    echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"
    exit
fi




