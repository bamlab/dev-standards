# [MO] Setup HTTPS on your docker environment

## Owner: [Sammy Teillet](https://github.com/samox)

## Prerequisites

* [ ] You have a staging environment with docker
* [ ] You can ssh to the server
* [ ] Make sure you have the docker rights `sudo usermod -aG docker $YOUR_USER_NAME`


## Steps

### Install the nginx-proxy companion

- Connect to your server `ssh user@your.domain`
- Clone the nginx-proxy-companion [project](https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion) on the server at the root of the server.

```bash
git clone git@github.com:evertramos/docker-compose-letsencrypt-nginx-proxy-companion.git
```

- Create a `.env` file

```bash
cd docker-compose-letsencrypt-nginx-proxy-companion
cp ./.env.sample .env
```

- Set the `NGINX_FILES_PATH=/srv/nginx/data` in the `.env`
    - `vim ./.env`
    - line 41 replace `NGINX_FILES_PATH=/srv/nginx/data`(or a different path if you prefer)

{% hint style='success' %} **CHECK**

Try to launch the companion by running:

```bash
./start.sh
```

You should have the following error:

```
ERROR: for nginx-web  Cannot start service nginx-web: driver failed programming external connectivity on endpoint nginx-web (4c0105fe57d370c99c0a143c967d1b8737006a4138618e1defebc4bab4e42d11): Bind for 0.0.0.0:80 failed: port is already allocated
```

![](./docker-nginx-companion-error.png)

{% endhint %}

### Configure your project to use the companion

- Remove the binding 80 port command, but expose it

```diff
version: '3'
services: 
  your-web-app: #It should contain port: "80:80"
    # ... 
-   ports:
-     - "80:80"
+   expose:
+     - 80
```

- Configure the app to use the network created by the companion (`webproxy` is the default name)

```diff
version: '3'
services: 
    # ... 

+networks:
+  default:
+     external:
+        name: webproxy
```

{% hint style='info' %} **GO FURTHER**

https://blog.docker.com/2016/12/understanding-docker-networking-drivers-use-cases/

{% endhint %}

- In your project set 3 environment variable : `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, `LETSENCRYPT_EMAIL`.There are 2 ways: 
    - In the docker-compose file
    - In your prod.env file that is read by your Dockerfile.


{% hint style='info' %} **RECOMENDED WAY**

Update the .env file of your web-app docker

{% endhint %}

- In the `./env/prod.env` add the following:

```env
VIRTUAL_HOST=my.domain.cloud.bam.tech
LETSENCRYPT_HOST=my.domain.cloud.bam.tech
LETSENCRYPT_EMAIL=sammyt@bam.tech
```

{% hint style='warning' %} **OTHER solution**

If you have no .env file you an also Update the docker-compose-prod file

```yaml
version: '3'
services: 
  your-web-app: #It should contain port: "80:80"
    # ... 
    environment:
      - VIRTUAL_HOST=my.domain.cloud.bam.tech
      - LETSENCRYPT_HOST=my.domain.cloud.bam.tech
      - LETSENCRYPT_EMAIL=sammyt@bam.tech
```

{% endhint %}


### Make the switch

{% hint style='warning' %} **BUSINESS INTERRUPTION**

You will have to shut down your docker (so the port 80 is available), so during this step your domain  won't be accessible.

{% endhint %}

- Cut your app docker:

```bash
cd your-project-directory
docker-compose -f docker-compose-prod.yml down
```

- Start the companion (go to the companion directory): 

```bash
cd ../docker-compose-letsencrypt-nginx-proxy-companion
./start.sh
```

- Launch your project docker again:

```bash
cd -
docker-compose -f docker-compose-prod.yml up -d
```

{% hint style='success' %} **BUSINESS INTERRUPTION**

- Check the validity of your domain, go to https://your.domain
- Go [there](https://www.ssllabs.com/ssltest/) and check your domain. Usefull tip: go to the __Handshake Simulation__ section and check the supported devices.

{% endhint %}
