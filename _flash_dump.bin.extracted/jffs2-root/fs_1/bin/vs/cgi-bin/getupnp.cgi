#!/bin/sh
CONF=/etc/ipcamera/upnp.conf
. $CONF
echo -e "\r"
echo -e "var upnpenable=$enable ;\r"
