---
title: es集群部署流程
tags:
  - es
  - 集群
  - 安装
createTime: 2024/12/26 14:36:14
permalink: /article/ta5hbixv/
---

:::tip
以下行为需要确保你所使用的用户拥有 `root` 权限
:::

## 获取计算机版本信息

首先在目标机器上执行命令查看当前计算机版本信息：

```bash
hostnamectl
```

执行成功后应该会看到类似于以下的输出内容：

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

## 查找合适的安装包

到 [elasticsearch官网](https://www.elastic.co/downloads/past-releases#elasticsearch)
上找到适合自己服务器系统的版本，这里以 `Elasticsearch 8.17.0` 版本为例。

## 下载安装包到机器

在合适的版本上鼠标右键复制下载链接，或直接点击本地下载之后再上传到目标服务器上，或者直接在可以访问 `elasticsearch`
官网的服务器下执行命令：

```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.17.0-linux-x86_64.tar.gz
```

## 创建安装目录

选择或创建要安装 `es` 服务的目录，比如:

```bash
mkdir /haitian/service -p
```

## 解包安装包到安装目录

在安装包所在目录下执行:

```bash
tar xf elasticsearch-8.17.0-linux-x86_64.tar.gz -C /haitian/service/
```

## 创建软链

进入安装目录，并创建软链:

```bash
cd /haitian/service/
ln -s elasticsearch-8.17.0 elasticsearch
```

## 创建es用户

在任意位置执行一下命令创建 `es` 用户:

```bash
useradd esuser
```

1. 命令含义

- `useradd`: 用于在 Linux 系统中创建新用户。
- `esuser`: 是你想要创建的新用户名。

2. 命令作用

执行 useradd esuser 后，系统会创建一个名为 esuser 的用户。默认情况下，该命令会：

- 在 /etc/passwd 文件中添加一条记录，表示新增的用户。
- 创建一个唯一的用户 ID (UID) 和一个默认的主组 ID (GID)。
- 如果默认设置允许，还会为用户创建主目录（具体行为取决于系统配置）。

## 允许es用户锁定内存

编辑 `/etc/security/limits.conf` 并在底部添加以下内容保存并退出:

```text
esuser hard nofile 65536
esuser soft nofile 65536
esuser soft memlock unlimited
esuser hard memlock unlimited
```

添加完成后执行 `sysctl -p` 更新配置。

## 修改es默认配置文件

进入 `es` 配置文件目录，备份默认配置文件

```bash
cd /haitian/service/elasticsearch/config
cp elasticsearch.yml elasticsearch.yml.bak
```

编辑配置文件 `vim elasticsearch.yml` 将以下内容写入文件:

```yml
cluster.name: es-cluster # es服务名称，各节点需要统一名称
node.name: server1 # 所在节点的别名
path.data: /haitian/service/elasticsearch/data # 数据存放目录
path.logs: /haitian/service/elasticsearch/logs # 日志存放目录
bootstrap.memory_lock: true  # 允许内存锁定
network.host: 0.0.0.0  # 允许哪些网段访问 0.0.0.0 为任意ip访问，根据需要设置
http.port: 9200 # 服务端口号
discovery.seed_hosts: [ "xx.xx.xx.xx", "xx.xx.xx.xx", "xx.xx.xx.xx" ] # 节点ip地址
cluster.initial_master_nodes: [ "xx.xx.xx.xx", "xx.xx.xx.xx", "xx.xx.xx.xx" ] # 允许节点进行主节点选举的ip地址列表，它的作用是帮助集群完成主节点的第一次选举，确保集群能够正常启动并防止发生主节点分裂问题。
action.auto_create_index: .monitoring*,.watches,.triggered_watches,.watcher-history*,.ml* # 用于控制是否允许 Elasticsearch 自动创建索引。它的主要作用是决定在索引不存在时，系统是否会自动创建新索引。
xpack.security.transport.ssl.enabled: false # 禁用 Elasticsearch 节点之间通信（Transport 通信）使用的 SSL 加密。
xpack.security.http.ssl.enabled: false # 禁用客户端与 Elasticsearch 的 HTTP 通信使用的 SSL 加密。
xpack.security.enabled: false # 完全禁用 X-Pack 安全功能，如果有专业的维护人员底部的三个参数可以视情况进行调整。
#xpack.security.enabled: true
#xpack.security.transport.ssl.enabled: true
#xpack.security.transport.ssl.verification_mode: certificate
#xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
#xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
```

## 添加hosts映射关系

编辑 `/etc/hosts` 文件，并在底部添加以下内容:

```text
xx.xx.xx.xx server1
xx.xx.xx.xx server2
xx.xx.xx.xx server3
```

## 添加数据目录

在 `es` 安装根目录下，创建与 `elasticsearch.yml` 文件中对应的数据目录:

```bash
mkdir data
```

## 赋予es用户写入权限

赋予刚才添加的es用户 `esuser` 以写入权限，确保数据可以正常写入

```bash
chown esuser:esuser -R /haitian/service/elasticsearch-8.17.0
```

## 编辑es守护进程配置文件

编辑 `/lib/systemd/system/elasticsearch.service` 并写入以下配置内容:

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
注意配置文件的涉及到路径部分的配置参数，一定要与你所设置的路径位置保持一致
:::

刷新配置

```bash
systemctl daemon-reload
```

## 修改es服务内存占用值

进入es安装目录，编辑 `config/jvm.options` 修改以下参数:

```text
-Xms16g  # 根据你的计算机内存大小设定，一般为计算机内存的一半，这里的计算机内存为32G
-Xmx16g  # 同上
```

## 启动es服务

执行命令启动 `es` 服务

```bash
systemctl start elasticsearch.service
```

将es服务加入系统服务

```bash
systemctl enable elasticsearch
```

查看服务执行状态

```bash
systemctl status elasticsearch
```

如果顺利的话，你将看到类似以下内容：

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
