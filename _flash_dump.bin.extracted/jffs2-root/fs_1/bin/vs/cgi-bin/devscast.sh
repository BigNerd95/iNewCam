echo "devs reset" >> /tmpfs/devs
port=`awk '{split($1,a,"="); print a[2]}' /etc/ipcamera/webserver.conf`
wget -O /tmpfs/m "http://127.0.0.1:$port/cgi-bin/hi3510/devs.cgi?-act=rejoin"