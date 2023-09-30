# Install docker on AWS

Install and start Docker on boot

```sh
sudo amazon-linux-extras install docker (flem de test mais je trust)
sudo systemctl enable docker
sudo systemctl start docker
```

To be able to use Docker without sudo:

```sh
sudo usermod -a -G docker ec2-user
```

To apply permission, you need to reboot your aws instance

Install docker-compose

```sh
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```

Fix permissions, you don't need to restart your instance here.

```sh
sudo chmod +x /usr/local/bin/docker-compose
```

To verify your installation:

```sh
docker-compose version
```

CREDIT: https://gist.github.com/npearce/6f3c7826c7499587f00957fee62f8ee9