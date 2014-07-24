# Introduction

This repository contains configuration, build scripts, and web UI for the
OpenWireless router firmware, which is based off of Cerowrt and OpenWRT.

More details about the OpenWireless project can be found at
https://openwireless.org/.

# HOPE

Special for the weekend of the HOPE Conference, July 18-20, we have set up
several instances of the web UI to be publicly accessible. Please try out one of
these instances and report to us any vulnerabilities you find. Feel free to set
and admin password: These instances will reset at the top of each hour.

[0](http://ow.crud.net:8000)
[1](http://ow.crud.net:8001)
[2](http://ow.crud.net:8002)
[3](http://ow.crud.net:8003)
[4](http://ow.crud.net:8004)
[5](http://ow.crud.net:8005)
[6](http://ow.crud.net:8006)
[7](http://ow.crud.net:8007)
[8](http://ow.crud.net:8008)
[9](http://ow.crud.net:8009)
[10](http://ow.crud.net:8010)
[11](http://ow.crud.net:8011)
[12](http://ow.crud.net:8012)
[13](http://ow.crud.net:8013)
[14](http://ow.crud.net:8014)
[15](http://ow.crud.net:8015)
[16](http://ow.crud.net:8016)
[17](http://ow.crud.net:8017)
[18](http://ow.crud.net:8018)
[19](http://ow.crud.net:8019)

Also, if you are at the Hotel Pennsylvania, we will occasionally have the
routers running. If you see the networks "openwireless.org" or "Hack Open
Wireless", you have our permission to connect to them and try to break in. Let
us know what you find! The WPA2 passphrase for "Hack Open Wireless" is "Happy
ownage, pentest enthusiasts".

# Getting Started

Get the packages you need and install a git hook to run tests before push:

    ./install-dev-dependencies.sh

Try out the web UI locally:

    ./local-lighttpd/run-local-lighttpd.sh
    firefox http://localhost:8888/

Sync the web UI to your router:

    ./sendAppToRouter --continuous
    firefox http://gw.home.lan/

# Running tests

    ./run-tests.sh

Continuous build at https://snap-ci.com/EFForg/OpenWireless/branch/master

# UX Starter Kit

To contribute to UX components, please read the introduction to OpenWireless's
UX philosophy at https://github.com/EFForg/OpenWireless/issues/81.

# Security

There's a detailed writeup of our threats and mitigations in security.txt.

# System Overview

The Open Wireless router firmware is built on top of CeroWRT, with some
modifications to the firewall and services configs for better security and
usability with guest networks. The web administration UI is unique to Open
Wireless, and consists of an HTML + JS frontend calling a Python backend with
a loosely JSONRPC-esque protocol. The frontend is under app/, and the backend is
under routerapi/. We use Handlebars (similar to Mustache) for templating on the
client side.

The CeroWRT code can be found in a submodule. To check out the CeroWRT code, run
git submodule init / git submodule update. The build config used for
OpenWireless is in OWrt/config-OWrt, and should be copied to cerowrt/.config to
build.

# Networking Setup

We have assumed a specific networking setup in designing the software. This 
networking setup is described in NetworkingSetup.png and the open wireless
router should work in this standard setup. However users may be interested in 
alternate setups (e.g No Modem-Router interfacing to ISP, instead there is a pure 
modem and no DHCP server to allocate address to WAN port of the OpenWireless 
router. There are several other variations possible). Since we have not designed 
the router firmware to support such alternate setups, user effort will be 
required to get the OpenWireless router to work for them. Typically this will 
involve gaining root access to the router through SSH and then changing the files
controlling network configuration to align with the setup that is desired. If
you have gotten an alternate setup to work, we encourage you to share the
details with other users. Even better if you can make pull requests that we 
can include in the firmware to make things easier for future users of 
non-standard setups.


# Contributions and technology discussions

We welcome contributors! Our mailing list is ow-tech@eff.org. Sign up
at https://lists.eff.org/mailman/listinfo/ow-tech . Or drop into #openwireless 
on irc.oftc.net to ask questions or discuss the project.

We accept pull requests and issues at https://github.com/EFForg/OpenWireless .

# Getting help

If you are deploying an open wireless AP or are a user trying to connect
to open wirless APs or have general use related questions, please check out 
the user mailing list archives at https://openwireless.org/mailman/listinfo/user
and if needed send mail there to get help.

# Coding Style

Two spaces for JavaScript, four for Python, no tabs. Spaces between function
arguments, before braces, and around operators. In Python, imports are one per
line, and only modules, not methods or classes. Generally we follow the [Google
Python Style Guide](http://google-styleguide.googlecode.com/svn/trunk/pyguide.html)
and [Google JavaScript style
guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
Try to write tests and document code well.

Some security guidelines: Strongly avoid jQuery's .html(data) and Handlebars'
triple-stache {{{data}}}}. They make it easy to create an XSS vulnerability by
accident. Similarly, in Python, never set shell=True when calling binaries.

# Failsafe and recovery

If something is broken on the router, often you can fix it with failsafe mode.
Mostly the [standard OpenWRT directions
apply](wiki.villagetelco.org/OpenWrt_Failsafe_Mode_and_Flash_Recovery). However,
the Open Wireless firmware uses 172.30.42.1 by default, so make sure to modify
the instructions to contact that address instead of 192.168.1.1.

To enter failsafe mode, reboot the router and press one of the front buttons
repeatedly. The power LED will be solid, then slow blinking, then fast blinking.
Once it's fast blinking, the router is in failsafe mode. Plug in an ethernet
cable and run, on your host machine:

    sudo service networking stop
    ifconfig eth0 172.30.42.2
    route add default gw 172.30.42.1
    telnet 172.30.42.1

This should get you a root shell on the machine. From there, if you need to
modify files, you can run:

    # mount_root

To copy files over, you'll need to start the ssh service, which you can do
by starting dropbear.
    
You will need to set a password for the root account for which you can run:

    #passwd
    
Then start the ssh service with:

    #dropbear
    
and e.g. copy a new image over to the /tmp directory with:

    scp image_sysupgrade.bin root@172.30.42.1:/tmp
    
and then e.g. login to the router to reflash the router with:

    sysupgrade -v /tmp/image_sysupgrade.bin
    
If the router does start up in failsafe mode, you can open it up and attach a
serial cable to the motherboard during boot to further debug.
