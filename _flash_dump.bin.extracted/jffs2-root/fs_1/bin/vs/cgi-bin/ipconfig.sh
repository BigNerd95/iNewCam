#!/bin/sh
export PATH=$PATH:/bin/vs/cgi-bin:/bin/vs
#cp /nfsroot/rootfs/bin/vs/cgi-bin/ipconfig.sh /bin/vslocal/cgi-bin/
#连接或者断开
###全局变量
# $1 AP|STA|LINED



. /bin/vs/cgi-bin/netenv.conf
. /bin/vs/cgi-bin/net_func.sh
  
show_info "call ipconfig.sh"

net_setip $1





 