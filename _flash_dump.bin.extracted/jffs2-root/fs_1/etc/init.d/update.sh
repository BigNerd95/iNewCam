#!/bin/sh

update_tmp_file=/root/update.tmp
update_file=/root/update.tgz
tmp_file=/mnt/ram/update.tgz

mkdir /mnt/ram
umount /mnt/ram
mount -t tmpfs -o size=10M tmpfs /mnt/ram
rm -f $update_tmp_file

if [ -f $update_file ];then
    echo "prepare to execute update now..."
    mv $update_file $tmp_file
    tar xzf $tmp_file -C /
    reboot # avoid initialized script change
fi

