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
If you are doing only Web-UI development, all you need to test your changes
on a real router is to use the script below to sync the Web-UI under 
development on your development machine to your router (i.e you do not need 
to build and flash a new image to the router just to test UI changes):

    ./sendAppToRouter --continuous
    firefox http://gw.home.lan/

## Running tests

    ./run-tests.sh

Continuous build at https://travis-ci.org/EFForg/OpenWireless


# Building the image

You can do all of the above without building an image to flash to the router. Here is
what you need, if you decide you do want to build an router image. Building has been 
tested only on linux. Please refer to the OpenWRT build requirements 

http://wiki.openwrt.org/doc/howto/build#prerequisites

for details of what is needed on your linux box. These OpenWRT requirements together with 
some additional development requirements are captured in the install-dev-dependencies.sh 
script above. So running that script is the first preparatory step on your linux box.  

Then for a first time build from the top level (i.e OpenWireless directory) run: 

    # ./build.sh
    
A first time build may take several hours depending on your system. The build has been
optimized for quad core processors (i.e we use "make -j 4"), with which, if everything 
goes well, a build will complete in less than an hour. You can change that "make" 
optimization by editing the build.sh script. The resulting image is placed in the 
./releases directory. 

When using a "-j n" option with "make" for any n > 1 the build may fail. All you need 
to do in this case is 

    # cd cerowrt
    # make [-j n]

Usually that will fix things. You will then have to manually do the last part of build.sh
of copying out the image you just built. If needed restart make multiple times. If you 
want to be conservative and ensure the build goes to completion without a glitch run 
"make" without the "-j" option by editing build.sh before you first execute it. 

After the first build, for succeeding builds, from the top level do 

	# git pull
   	# ./sendToBuild
   	# [optionally] cp OWrt/config-OWrt cerowrt/.config

then

	# cd cerowrt
	# make [-j n]

These steps will pull the latest changes and rebuild an image without updating your packages 
from the openwrt feeds you are using. If you want to update the openwrt package feeds and/or 
the linux kernel, refer to openwrt documentation. 


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
Mostly the [standard OpenWRT directions apply]

(http://wiki.openwrt.org/doc/howto/generic.failsafe). 

The telnet based failsafe has been disabled on the builds due to a security hole 
it creates. You can still use the tftp approach described here, 

http://wiki.openwrt.org/toh/netgear/wndr3800

in the section "Recovery flash in failsafe mode".

If you want to restore the router to its factory image you can use the TFTP 
instructions above with firmware from Netgear which can be found here:

http://support.netgear.com/product/WNDR3800


