[![Build Status](https://travis-ci.org/EFForg/OpenWireless.svg?branch=master)](https://travis-ci.org/EFForg/OpenWireless)

# Introduction

This repository contains configuration, build scripts, and web UI for the
OpenWireless router firmware, which is based off of Cerowrt and OpenWRT.

More details about the OpenWireless project can be found at
https://openwireless.org/.

# Getting Started

## Ubuntu/Debian users:

Get the packages you need and install a git hook to run tests before push:

```
./install-dev-dependencies.sh
```

## Vagrant users:

Requirements:

* [vagrant 1.5+](https://www.vagrantup.com/)
* [virtualbox 4.3.12+](https://www.virtualbox.org/)

Getting started with vagrant is done with:

```
vagrant up
```

You can then connect with the virtual machine with:

```
vagrant ssh
```

**NOTE: the project root is mounted at ```/vagrant```**

Further instructions assume you are connected to the VM in the /vagrant directory.

## Boot frontend
Try out the web UI locally:

    ./local-lighttpd/run-local-lighttpd.sh
    firefox http://localhost:8000/

## Deploy changes to router
Sync the web UI to your router:

    ./sendAppToRouter --continuous
    firefox http://gw.home.lan/

## Running tests

    ./run-tests.sh

Continuous build at https://travis-ci.org/EFForg/OpenWireless

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

The CeroWRT code can be found in the submodule cerowrt. The build config used for
OpenWireless is in OWrt/config-OWrt.

# Building the image

Building has been tested only on linux. Please refer to the OpenWRT build requirements

http://wiki.openwrt.org/doc/howto/build#prerequisites

and make sure your linux system has the prerequisites. Then for a first time build 
from the top level run: 

    # ./build.sh
    
A first time build may take several hours depending on your system. The resulting 
image is in ./releases directory. After the first build, for succeding builds run: 

    # ./rebuild.sh 

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

# Getting help

If you are deploying an open wireless AP or are a user trying to connect
to open wirless APs or have general use related questions, please check out 
the user mailing list archives at https://openwireless.org/mailman/listinfo/user
and if needed send mail there to get help.

# Contributions 

We welcome contributors! We accept pull requests and issues at https://github.com/EFForg/OpenWireless. 
Or drop into #openwireless on irc.oftc.net to ask questions or discuss the project.


# Technology discussions

For substantive technology discussions our mailing list is ow-tech@eff.org. 
You can review the archives and sign up at  https://lists.eff.org/mailman/listinfo/ow-tech. 


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
apply](http://wiki.openwrt.org/doc/howto/generic.failsafe). However,
the Open Wireless firmware uses 172.30.42.1 by default, so make sure to modify
the instructions to contact that address instead of 192.168.1.1.

To enter failsafe mode, reboot the router and press the leftmost of the front buttons
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

    # passwd
    
Then start the ssh service with:

    # dropbear
    
and e.g. copy a new image over to the /tmp directory with:

    scp image_sysupgrade.bin root@172.30.42.1:/tmp
    
and then e.g. login to the router to reflash the router with:

    sysupgrade -v /tmp/image_sysupgrade.bin
    
If the router does start up in failsafe mode, you can open it up and attach a
serial cable to the motherboard during boot to further debug.
