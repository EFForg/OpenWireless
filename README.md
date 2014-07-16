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

# Contributing and getting help

We welcome contributors! Drop into #openwireless on irc.oftc.net to ask
questions or discuss the project.

We accept pull requests and issues on https://github.com/EFForg/OpenWireless.
