# Introduction

This repository contains configuration, build scripts, and web UI for the
OpenWireless router firmware, which is based off of Cerowrt and OpenWRT.

More details about the OpenWireless project can be found at
https://openwireless.org/.

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

# Contributing and getting help

We welcome contributors! Our mailing list is tech@openwireless.org. Sign up
at https://openwireless.org/mailman/listinfo/tech. Or drop into #openwireless
on irc.oftc.net to ask questions or discuss the project.

We accept pull requests and issues on https://github.com/EFForg/OpenWireless or
patches by mail to tech@openwireless.org

# Coding Style

Two spaces for JavaScript, four for Python, no tabs. Spaces between function
arguments, before braces, and around operators. Generally we follow the [Google
Python Style Guide](http://google-styleguide.googlecode.com/svn/trunk/pyguide.html)
and [Google JavaScript style
guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
Try to write tests and document code well.

Some security guidelines: Strongly avoid jQuery's .html(data) and Handlebars'
triple-stache {{{data}}}}. They make it easy to create an XSS vulnerability by
accident. Similarly, in Python, never set shell=True when calling binaries.

