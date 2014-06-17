# Getting Started
1. Download VirtualBox from https://www.virtualbox.org/wiki/Downloads
2. In VirtualBox, open menu "VirtualBox", "Preferences..."
3. In the "VirtualBox - General" settings window, select "Network" tab
4. Select "Host-only Networks" and click the "+" icon to "Add a host-only network"
5. It should create "vboxnet0", then edit this to make the "IPv4 Address:" be `192.168.1.10`
6. Import and run the OpenWRT box from https://www.dropbox.com/s/xnxcllzlv2eyen4/openwrt-12.09-tweff.ova  
The default username is __root__ with password __asdf1234__.
7. Click on "Settings" with "openwrt" selected to open the "openwrt - General" settings window.
8. Select the "Network" tab, then choose "Adapter 3"
9. Change the dropdown menu next to "Attached to:" `Host-only adapter`
10. This should automatically select `vboxnet0` in the "Name:" drop down menu below. If it hasn't, do this now. *If you do not see `vboxnet0` as an option in this menu, go back to step 2.
11. Run the `sendToOpenWrtVM` script from the repo app/ directory to transfer the directory to the (router's) /www directory in the OpenWrt VM
12. Point your browser to http://192.168.1.1/app/html/login.html and enjoy!
13. If you cannot hit the login page, go back to step 5 and try `192.168.1.XX` where `XX` = any other number between 2-100.

Steps 2-5 and 7-10 eliminate the need for a the OpenWireless-ClientVM (https://github.com/TWEFF/OpenWireless-ClientVM)

=======
