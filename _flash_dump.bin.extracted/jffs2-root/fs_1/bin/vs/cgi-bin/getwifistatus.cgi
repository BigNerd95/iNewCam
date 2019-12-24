#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs
. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh

##20141128 please use wifi_getstatus func

. $wifi_config

linedstatus=$(net_getlinedstatus)
##echo XXXXXXXXXX $linedstatus


if [ $linedstatus = 1 ]
then
	#echo var linkstatus=\"0\"\;
	echo 0
else	
	linkstatus=$(wifi_getstatus)

	if [ -z ${linkstatus} ]
	then
		#echo var linkstatus=\"0\"\;
		echo 0
	elif [ ${linkstatus} = COMPLETED ]
	then
		#echo var linkstatus=\"1\"\;
		echo 1
	else
		#echo var linkstatus=\"0\"\;
		echo 0
	fi
fi
