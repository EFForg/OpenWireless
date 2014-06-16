# Getting Started
1. Download VirtualBox from https://www.virtualbox.org/wiki/Downloads
2. In VirtualBox, open menu "VirtualBox", "Preferences..."
3. In the "VirtualBox - General" settings window, select "Network"
4. Select "Host-only Networks" and click the "+" icon to "Add a host-only network"
5. It should create "vboxnet0", then edit this to make the "IPv4 Address:" be `192.168.1.10`
6. Import and run the OpenWRT box from https://www.dropbox.com/s/xnxcllzlv2eyen4/openwrt-12.09-tweff.ova  
The default username is __root__ with password __asdf1234__.
7. Run the `sendToOpenWrtVM` script from the repo app/ directory to transfer the directory to the (router's) /www directory in the OpenWrt VM
8. Point your browser to 192.168.1.1/app/html/login.html and enjoy!

Steps 2-5 eliminate the need for a the OpenWireless-ClientVM

=======
