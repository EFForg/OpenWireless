#!/bin/bash

  
  IMAGE="releases/openwireless-openwrt-squashfs-sysupgrade.bin"

  git submodule init
  git submodule update

  #build  router image
  echo "building openwireless"

  #copy the config (kernel + packages)
  cp OWrt/config-OWrt cerowrt/.config

  #setup the package building system
  cd cerowrt

  ./scripts/feeds update 
  #copy over python package
  cp -r ../ow-python/python-mini-eff ./feeds/oldpackages/lang/
  ./scripts/feeds update -a
  #./scripts/feeds install libnettle
  #./scripts/feeds install python-mini-eff
  #./scripts/feeds install gnupg
  #./scripts/feeds install tor 



  #customize the file system
  cd ..
  ./sendToBuild
  cd cerowrt 

  echo "building cerowrt"
  make

  mkdir -p releases
  mv cerowrt/bin/ar71xx/openwrt-ar71xx-generic-wndr3800-squashfs-sysupgrade.bin $IMAGE
  
  if ! [ -f $IMAGE ]; then
    echo "ERROR: For some reason $IMAGE failed to generate!"
    exit 1
  fi

