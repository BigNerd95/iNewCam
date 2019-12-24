# iNewCam
Gaozhi iNewCam G6Plus firmware dump

# Dump
The flash is a Winbond W25Q128B with 16MB  
It has been dumped using a CH341A MiniProgrammer  

You can find all the flash content in flash_dump.bin.  
The flash map is:  
```
0x000000000000-0x000000040000 : "boot"
0x000000040000-0x0000002c0000 : "kernel"
0x0000002c0000-0x000000f00000 : "rootfs"
0x000000f00000-0x000000f10000 : "key"
0x000000f10000-0x000001000000 : "config"
```

# Binaries
- /bin/vs/vs_server  
  is the main executable  
  among other things it receives http requests and if it hasn't the handler pass them to  

- /bin/vs/thttpd  
  which only reads files from disk or runs cgi scripts


# Telnet
You can access the camera using serial or telnet  
User: root  
Pass: \<blank\>  
  
# Stream URL
rtsp://admin:admin@192.168.1.2:554/11  
rtsp://admin:admin@192.168.1.2:554/12  
