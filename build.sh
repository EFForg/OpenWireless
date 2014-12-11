#!/bin/bash

  IMAGE="releases/openwireless-openwrt-squashfs-sysupgrade.bin"

  git submodule init
  git submodule update

  #build  router image
  echo "Applying openwireless customizations"
  #customize the file system
  ./sendToBuild

  echo "Setting up feeds"
  #setup the package building system
  cd cerowrt
  echo 'src-git cero https://github.com/dtaht/ceropackages-3.10' >> feeds.conf.default
  ./scripts/feeds update
  make package/symlinks


  echo "Building cerowrt"
  #copy the config (kernel + packages)
  cp ../OWrt/config-OWrt .config
  make -j4
  cd ..

  echo "Build completed. Copying IMAGE to release directory" 
  mkdir -p releases
  cp cerowrt/bin/ar71xx/openwrt-ar71xx-generic-wndr3800-squashfs-sysupgrade.bin $IMAGE
  if ! [ -f $IMAGE ]; then
    echo "ERROR: For some reason $IMAGE failed to generate!"
    exit 1
  fi

