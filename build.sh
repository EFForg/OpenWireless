#!/bin/bash

  # Begin first time only steps 
  git submodule init
  git submodule update

  #setup the package building system
  echo "Setting up feeds ..."
  cp OWrt/feeds.conf cerowrt/feeds.conf
  cd cerowrt
  ./scripts/feeds update
  make package/symlinks
  cd ..
  #End first time only steps


  #customize the target file system
  echo "Applying openwireless customizations ..."
  ./sendToBuild

  #customize .config
  echo "Setting up openwireless .config ..."
  cp OWrt/config-OWrt cerowrt/.config

  echo "Building cerowrt ..."
  cd cerowrt
  make -j4
  cd ..

  echo "Build completed. Copying IMAGE to release directory ..." 
  IMAGE="releases/openwireless-openwrt-squashfs-sysupgrade.bin"
  mkdir -p releases
  cp cerowrt/bin/ar71xx/openwrt-ar71xx-generic-wndr3800-squashfs-sysupgrade.bin $IMAGE
  if ! [ -f $IMAGE ]; then
    echo "ERROR: For some reason $IMAGE failed to generate!"
    exit 1
  fi

