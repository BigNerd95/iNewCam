CMD_LINE="`cat /proc/cmdline | sed -n "s/\ /\n/gp"`"

echo $0 $1 $2 $3 $4 $5 $6

get_cmdline()
{
	echo "${CMD_LINE}" | grep "^${1}=" | sed -n "s/^${1}=//p"
}
	
if [ -n "`cat /proc/cmdline | grep "root=.*nfs .*\<nfsroot="`" ] ;
then
	echo "Using NFS as RootFS"
else
	udhcpc -i $1 -b
	if [ "$2" = "n" ] ;
	then
		if [ -n "$3" ] ;
		then
			echo "nameserver $3" > /etc/resolv.conf
		else
			echo "" > /etc/resolv.conf
		fi

	    if [ -n "$4" ] ;
	    then
	        echo "nameserver $4" >> /etc/resolv.conf
	    fi
    fi
    sync
fi
