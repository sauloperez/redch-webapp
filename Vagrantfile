# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--name", "webapp", "--memory", "512"]
  end
  config.vm.box = "precise32_ruby200"
  config.vm.host_name = "webapp"
  config.vm.network :forwarded_port, guest: 80, host: 1234
  config.vm.network :private_network, ip: "33.33.13.38"
  config.vm.synced_folder "/Users/Pau/Sites/pfc-sources/redch-puppet-vm", "/etc/puppet"
end
