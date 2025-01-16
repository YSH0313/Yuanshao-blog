---
title: The deployment process for an Elasticsearch (ES) cluster
tags:
  - es
  - Cluster
  - Installation
createTime: 2024/12/26 14:36:14
permalink: /en/article/gysu4vtj/
---

:::tip
The following actions require the user you are using to have `root` privileges.
:::

## Get the Computer Version Information

First, execute the command on the target machine to check the current computer version information:

```bash
hostnamectl
```

The following output should be seen after successful execution:

```text
 Static hostname: server1
       Icon name: computer-server
         Chassis: server
      Machine ID: b3xxxxx22961xxxxxxc370fdxxxxxxxx
         Boot ID: 37xxxxx6c548xxxxxx40cd45xxxxxxxx
Operating System: Ubuntu 22.04 LTS
          Kernel: Linux 5.15.0-127-generic
    Architecture: x86-64
 Hardware Vendor: IEIT SYSTEMS
  Hardware Model: NF5270M6
```

## Find the Appropriate Installation Package

Go to the [Elasticsearch official website](https://www.elastic.co/downloads/past-releases#elasticsearch) to find the
version that suits your server system. In this example, we are using version `Elasticsearch 8.17.0`.

## Download and Install the Package on the Machine

Right-click on the download link for the appropriate version to copy the link, or directly download it locally and then
upload it to the target server. Alternatively, you can execute the command directly on a server that has access to
the `Elasticsearch` official website:

```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.17.0-linux-x86_64.tar.gz
```

## Create the Installation Directory

Choose or create the directory where the `es` service will be installed, for example:

```bash
mkdir /haitian/service -p
```

## Extract the Installation Package to the Installation Directory

Execute the following command in the directory where the installation package is located:

```bash
tar xf elasticsearch-8.17.0-linux-x86_64.tar.gz -C /haitian/service/
```

## Create a Symbolic Link

Navigate to the installation directory and create a symbolic link:

```bash
cd /haitian/service/
ln -s elasticsearch-8.17.0 elasticsearch
```

## Create the es User

Execute the following command at any location to create the `es` user:

```bash
useradd esuser
```

1. Command Meaning

- `useradd`: Used to create a new user in the Linux system.
- `esuser`: The name of the new user you want to create.

2. Command Function

After executing `useradd esuser`, the system will create a user named `esuser`. By default, this command will:

- Add an entry to the `/etc/passwd` file to represent the new user.
- Create a unique user ID (UID) and a default group ID (GID).
- If the default settings allow, it will create a home directory for the user (the exact behavior depends on the system
  configuration).

## Allow the es User to Lock Memory

Edit `/etc/security/limits.conf` and add the following content at the bottom, then save and exit:

```text
esuser hard nofile 65536
esuser soft nofile 65536
esuser soft memlock unlimited
esuser hard memlock unlimited
```

After adding, execute `sysctl -p` to update the configuration.

## Modify the Default es Configuration File

Navigate to the `es` configuration directory and back up the default configuration file:

```bash
cd /haitian/service/elasticsearch/config
cp elasticsearch.yml elasticsearch.yml.bak
```

Edit the configuration file `vim elasticsearch.yml` and add the following content:

```yml
cluster.name: es-cluster # Name of the ES service, the name must be the same across all nodes
node.name: server1 # Alias of the node
path.data: /haitian/service/elasticsearch/data # Data storage directory
path.logs: /haitian/service/elasticsearch/logs # Log storage directory
bootstrap.memory_lock: true  # Allow memory locking
network.host: 0.0.0.0  # Allow access from all IPs, set as needed
http.port: 9200 # Service port
discovery.seed_hosts: [ "xx.xx.xx.xx", "xx.xx.xx.xx", "xx.xx.xx.xx" ] # Node IP addresses
cluster.initial_master_nodes: [ "xx.xx.xx.xx", "xx.xx.xx.xx", "xx.xx.xx.xx" ] # List of IPs allowed to perform master node election. It helps with the initial master node election and ensures the cluster starts properly to prevent split brain issues.
action.auto_create_index: .monitoring*,.watches,.triggered_watches,.watcher-history*,.ml* # Controls whether Elasticsearch allows auto-creation of indexes. It decides whether new indexes will be created automatically when they don't exist.
xpack.security.transport.ssl.enabled: false # Disable SSL encryption for communication between Elasticsearch nodes (Transport communication).
xpack.security.http.ssl.enabled: false # Disable SSL encryption for HTTP communication between the client and Elasticsearch.
xpack.security.enabled: false # Fully disable X-Pack security features. The last three parameters can be adjusted depending on the situation if there is professional maintenance.
#xpack.security.enabled: true
#xpack.security.transport.ssl.enabled: true
#xpack.security.transport.ssl.verification_mode: certificate
#xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
#xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
```

## Add Hosts Mapping

Edit the `/etc/hosts` file and add the following content at the bottom:

```text
xx.xx.xx.xx server1
xx.xx.xx.xx server2
xx.xx.xx.xx server3
```

## Add Data Directory

In the `es` installation root directory, create the corresponding data directory as specified in the `elasticsearch.yml`
file:

```bash
mkdir data
```

## Grant Write Permissions to the es User

Grant the newly added `esuser` write permissions to ensure data can be written correctly:

```bash
chown esuser:esuser -R /haitian/service/elasticsearch-8.17.0
```

## Edit the es Daemon Configuration File

Edit the `/lib/systemd/system/elasticsearch.service` file and add the following configuration:

```text
[Unit]
Description=Elasticsearch Service

[Service]
Environment=JAVA_HOME=/haitian/service/elasticsearch/jdk
Type=forking
User=esuser
LimitNOFILE=100000
LimitMEMLOCK=infinity
LimitNPROC=65535
ExecStart=/haitian/service/elasticsearch/bin/elasticsearch -d -p /haitian/service/elasticsearch/logs/elasticsearch.pid
ExecStop=kill `cat /haitian/service/elasticsearch/logs/elasticsearch.pid`
RestartSec=3
StartLimitBurst=5
Restart=always

[Install]
WantedBy=multi-user.target
```

:::warning
Note that the configuration parameters related to paths in the configuration file must be consistent with the paths you
have set.
:::

Refresh the configuration

```bash
systemctl daemon-reload
```

## Modify the es Service Memory Usage

Navigate to the es installation directory and edit `config/jvm.options` to modify the following parameters:

```text
-Xms16g  # Set according to your computer's memory size, typically half of the total memory. Here, the computer has 32GB of memory.
-Xmx16g  # Same as above
```

## Start the es Service

Execute the command to start the `es` service:

```bash
systemctl start elasticsearch.service
```

Add the es service to system services

```bash
systemctl enable elasticsearch
```

Check the service execution status

```bash
systemctl status elasticsearch
```

If successful, you will see something similar to the following:

```text
● elasticsearch.service - Elasticsearch Service
     Loaded: loaded (/lib/systemd/system/elasticsearch.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2024-12-26 05:57:36 UTC; 2h 33min ago
    Process: 6743 ExecStart=/home/haitian/service/elasticsearch/bin/elasticsearch -d -p /home/haitian/service/elasticsearch/logs/elasticsearch.pid (code=exited, status=0/SUCCESS)
   Main PID: 6816 (java)
      Tasks: 238 (limit: 37950)
     Memory: 17.5G
        CPU: 6min 14.055s
     CGroup: /system.slice/elasticsearch.service
             ├─6816 /home/haitian/service/elasticsearch/jdk/bin/java -Des.networkaddress.cache.ttl=60 -Des.networkaddress.cache.negative.ttl=10 -XX:+AlwaysPreTouch -Xss1m -Djava.awt.headless=true -Dfile.>
             └─6870 /home/haitian/service/elasticsearch/modules/x-pack-ml/platform/linux-x86_64/bin/controller

Dec 26 05:57:34 server2 elasticsearch[6816]: [2024-12-26T05:57:34,367][INFO ][o.e.x.d.l.DeprecationIndexingComponent] [server2] deprecation component started
Dec 26 05:57:34 server2 elasticsearch[6816]: [2024-12-26T05:57:34,428][INFO ][o.e.t.TransportService   ] [server2] publish_address {xx.xx.xx.xx:9300}, bound_addresses {[::]:9300}
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,078][INFO ][o.e.b.BootstrapChecks    ] [server2] bound or publishing to a non-loopback address, enforcing bootstrap checks
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,081][WARN ][o.e.c.c.ClusterBootstrapService] [server2] this node is locked into cluster UUID [BX97hvt_TgePRe-k7o2c_A] but [cluster.init>
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,632][INFO ][o.e.c.s.ClusterApplierService] [server2] master node changed {previous [], current [{server1}{gVMoUjG1RBO_85cb2e2wsw}{7sgO>
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,648][INFO ][o.e.c.s.ClusterSettings  ] [server2] updating [xpack.monitoring.collection.enabled] from [false] to [true]
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,989][INFO ][o.e.l.ClusterStateLicenseService] [server2] license [39bb98a8-622d-443b-86e5-765273df2139] mode [basic] - valid
Dec 26 05:57:35 server2 elasticsearch[6816]: [2024-12-26T05:57:35,995][INFO ][o.e.h.AbstractHttpServerTransport] [server2] publish_address {xx.xx.xx.xx:9200}, bound_addresses {[::]:9200}
Dec 26 05:57:36 server2 elasticsearch[6816]: [2024-12-26T05:57:36,006][INFO ][o.e.n.Node               ] [server2] started {server2}{fGIwpTAZSKSNO6ncsONurQ}{DxsV34E3SzOhwzFNoeRy1w}{server2}{10.10.7.4>
Dec 26 05:57:36 server2 systemd[1]: Started Elasticsearch Service.
```
