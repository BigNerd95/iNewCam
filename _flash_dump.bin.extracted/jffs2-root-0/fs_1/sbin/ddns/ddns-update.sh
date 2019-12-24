#!/bin/sh
##################################################
# ddns client
# Author: leitz@sin360.net 2007.04.25
##################################################

DIRINCLUDE="/usr/sbin/ddns"
DDNSENABLE=/etc/ipcamera/ddns_enable.conf

. ${DIRINCLUDE}/ddnsrc


while [ 1 ]
do
	if [ -f /tmpfs/updateddns ]; then
		flag=`cat /tmpfs/updateddns`
		
		if [ ${flag} -eq 1 ]; then
		
			. ${DDNSENABLE}
		
			if [ ${DDNS_ENABLE} -eq 1 ]; then
				/usr/sbin/ddns/ddns-stop >> /dev/null
				/usr/sbin/ddns/ddns-start  &
				echo 0 > /tmpfs/updateddns
			else
				/usr/sbin/ddns/ddns-stop >> /dev/null
				echo 0 > /tmpfs/updateddns
			fi
		fi
	fi		
	${SLEEPCMD} 2
done

exit 0
