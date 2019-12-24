#!/bin/sh
#Normal Version
### 0 √(no wifi), 1 ¡¡(wifi ok), 2 (wifi AP) 3(wifi wps) 4(wifi failed)
#NoWifi(0)  OFF
#Wifi  OK(1)      ON
#     AP(2)       ≥§…¡À∏
#     WPS(3)       ∂Ã…¡À∏
#     FAILED(4)   “ª≥§3∂Ã

wifi_ledflash()
{
	
    echo -e "\033[32m ledflash mode $1 \033[0m"
#	ledflash 0 $1 0
}