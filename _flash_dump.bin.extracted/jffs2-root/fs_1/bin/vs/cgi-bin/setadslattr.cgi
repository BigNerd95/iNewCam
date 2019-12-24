#!/bin/sh
#***********************************************************************
#
# setadslattr.cgi
# author:x57522
# TODO: check the configure information
#       if the configure information is the same as before,do nothing
#       else restart the adsl  
#***********************************************************************

# Paths to programs
LOGGER="/usr/bin/logger -t `basename $0`"
CONFIG=/etc/ppp/pppoe.conf
ADSLCONF=/etc/ipcamera/adsl.conf
ECHO=/bin/echo
ADSLSTART=/usr/sbin/adsl-start
ADSLSTOP=/usr/sbin/adsl-stop

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

# Protect created files
umask 077

copy() {
    cp $1 $2
    if [ "$?" != 0 ] ; then
	$ECHO "*** Error copying $1 to $2"
	$ECHO "*** Quitting."
	exit 1
    fi
}

. $CONFIG
. $ADSLCONF

enable=`get_param "adslenable"`

#stop adsl   
    echo "$ADSLSTOP" 
    $ADSLSTOP > /dev/null 2>&1

#record the value of adslenable
#TODO:put it in the right place
    echo "adslenable=$enable" > $ADSLCONF

if [ $enable = 1 ] ; then
#get USER
U="`get_param "username"`"
#get PWD
PWD="`get_param "password"`"
#get DNSTYPE
DNSAUTO="`get_param "dnsauto"`"
if [ $DNSAUTO = 1 ] ; then
    DNSTYPE=SERVER
    PEERDNS=yes
elif [ $DNSAUTO = 0 ] ; then
    DNSTYPE=SPECIFY
    PEERDNS=no
    DNS1="`get_param "dns1"`"
    DNS2="`get_param "dns2"`"
fi

#get ETH
#ETH=eth0

#get DEMAND
#D=

#get FIREWALL
#FIREWALL=

# Adjust configuration files.  First to $CONFIG

#$ECHO "Adjusting $CONFIG"

copy $CONFIG $CONFIG-bak

# Where is pppd likely to put its pid?
if [ -d /var/run ] ; then
    VARRUN=/var/run
else
    VARRUN=/etc/ppp
fi

# Some #$(*& ISP's use a slash in the user name...
sed -e "s&^USER=.*&USER='$U'&" \
    -e "s&^PIDFILE=.*&PIDFILE=\"$VARRUN/\$CF_BASE-adsl.pid\"&" \
    -e "s/^DNSTYPE=.*/DNSTYPE=$DNSTYPE/" \
    -e "s/^DNS1=.*/DNS1=$DNS1/" \
    -e "s/^DNS2=.*/DNS2=$DNS2/" \
    -e "s/^PEERDNS=.*/PEERDNS=$PEERDNS/" \
    < $CONFIG-bak > $CONFIG 

if [ $? != 0 ] ; then
    #$ECHO "** Error modifying $CONFIG"
    #$ECHO "** Quitting"
    exit 1
fi

#if [ "$DNSTYPE" = "SPECIFY" ] ; then
#    #$ECHO "Adjusting /etc/resolv.conf"
#	  if [ -r /etc/resolv.conf ] ; then
#	     grep -s "MADE-BY-RP-PPPOE" /etc/resolv.conf > /dev/null 2>&1
#	     if [ "$?" != 0 ] ; then
#		      $ECHO "  (But first backing it up to /etc/resolv.conf-bak)"
#		      copy /etc/resolv.conf /etc/resolv.conf-bak
#	     fi
#	  fi
#	  $ECHO "# MADE-BY-RP-PPPOE" > /etc/resolv.conf
#	  $ECHO "nameserver $DNS1" >> /etc/resolv.conf
#	  if [ "$DNS2" != "" ] ; then
#       $ECHO "nameserver $DNS2" >> /etc/resolv.conf
#	  fi
#fi


#$ECHO "Adjusting /etc/ppp/pap-secrets and /etc/ppp/chap-secrets"
if [ -r /etc/ppp/pap-secrets ] ; then
    #(But first backing it up to /etc/ppp/pap-secrets-bak)
    copy /etc/ppp/pap-secrets /etc/ppp/pap-secrets-bak
else
    cp /dev/null /etc/ppp/pap-secrets-bak
fi
if [ -r /etc/ppp/chap-secrets ] ; then
    #(But first backing it up to /etc/ppp/chap-secrets-bak)
    copy /etc/ppp/chap-secrets /etc/ppp/chap-secrets-bak
else
    cp /dev/null /etc/ppp/chap-secrets-bak
fi

egrep -v "^$U|^\"$U\"" /etc/ppp/pap-secrets-bak > /etc/ppp/pap-secrets
$ECHO "\"$U\"	*	\"$PWD\"" >> /etc/ppp/pap-secrets
egrep -v "^$U|^\"$U\"" /etc/ppp/chap-secrets-bak > /etc/ppp/chap-secrets
$ECHO "\"$U\"	*	\"$PWD\"" >> /etc/ppp/chap-secrets
    
    echo "$ADSLSTART"
    $ADSLSTART > /dev/null 2>&1  &
fi


#echo $HTTP_REFERER
echo -e "\r\n"
echo "<html><head><title></title><META http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"><META http-equiv=\"Refresh\" content=\"0;URL=$HTTP_REFERER\"></head><body></body></html>"


