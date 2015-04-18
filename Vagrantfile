# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  
  config.vm.box_url = [
   'http://dev.home.lan/virtualbox.box',
   'https://vagrantcloud.com/ubuntu/boxes/trusty64/versions/14.04/providers/virtualbox.box'
  ]  
  config.vm.box_download_checksum_type='sha1'
  config.vm.box_download_checksum='51db35afc1730ed0fdc49f88836aff088e97ca3d'

  if Vagrant.has_plugin?("vagrant-cachier")
   config.cache.scope = :box
  end
 
  config.vm.provider "virtualbox" do |v|
    v.memory = 4048
    v.cpus = 4
  end

  config.vm.provision "shell", inline: <<EOS
sudo apt-get update

/vagrant/install-dev-dependencies.sh -xa
EOS

  config.vm.network "private_network", type: "dhcp"

  config.vm.synced_folder ".", "/vagrant"

  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 9000, host: 9000
end
