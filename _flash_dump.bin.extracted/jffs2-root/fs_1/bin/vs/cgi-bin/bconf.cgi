#!/bin/sh

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

boardconffile=/etc/board.conf
sensorconffile=/etc/sensor.conf

arg_action="`get_param "action"`"


show_info()
{
    . $boardconffile
    . $sensorconffile
   # echo 200 OK HTTP 1.1
   # echo -e "\r"
    echo -e "Content-Type:text/plain\r"
    echo -e "\r"

    echo -e "var boardtype =  \"$boardtype\" ;\r"
    echo -e "var sensortype =  \"$sensortype\" ;\r"
    
    echo -e "\r\n"
}

echo arg_action $arg_action
if [ $arg_action = "get" ]
then
    show_info 
    exit
fi

if [ $arg_action = "set" ]
then

    arg_board="`get_param "board"`"
    arg_sensor="`get_param "sensor"`"

    . $sensorconffile
	
    echo "boardtype=$arg_board" > $boardconffile
	rm -f $sensorconffile
	
    echo "sensortype=$arg_sensor" \
		  $'\n'"sensordetect=$sensordetect"  > $sensorconffile
	sync
	/bin/sensorenv.sh
    show_info
    
    exit
fi




