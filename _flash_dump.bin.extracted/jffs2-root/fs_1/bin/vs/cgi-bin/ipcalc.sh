#!/bin/bash


ip=(${1//[![:digit:]]/ })
mask=(${2//[![:digit:]]/ })

for i in ${mask[*]}
do
        j=7
        tag=1
        while [ $j -ge 0 ]
        do
          k=$((2**$j))          
          if [ $(( $i & $k )) -eq $k ]; then
                if [ $tag -eq 1 ]; then
                   (( n += 1 ))
                else
                   echo -e "\n$2 is a bad netamsk with holes\n"
                   exit
                fi
           else
                tag=0
           fi
           (( j -= 1 ))
          done
done

for i in 0 1 2 3
do
a=$a${a:+.}$((${ip[i]} & ${mask[i]}))
b=$b${b:+.}$((${ip[i]} | (${mask[i]} ^ 255)))
done

echo
echo Network number: $a
echo Broadcast address: $b
echo Netmask bits: $n