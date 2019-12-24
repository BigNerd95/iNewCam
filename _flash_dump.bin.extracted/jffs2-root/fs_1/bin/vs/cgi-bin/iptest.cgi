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

URL="`get_param "url"`"
#echo $URL > /tmpfs/URL.tmp

ping -c 5 -q $URL > /tmpfs/iptest.tmp

if [ $? = 0 ] 
    then
        LOSS=`cat /tmpfs/iptest.tmp | grep loss | awk -F ',' '{print $3}' | awk -F '%' '{print $1}'`
    else
        LOSS=100
    fi

#LOSS=`ping -c 5 -q $URL | grep loss | awk -F ',' '{print $3}' | awk -F '%' '{print $1}'`

echo 200 OK HTTP 1.1 
echo
echo var loss=\"${LOSS}\"\;
echo -e "\r\n"
#echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"		






