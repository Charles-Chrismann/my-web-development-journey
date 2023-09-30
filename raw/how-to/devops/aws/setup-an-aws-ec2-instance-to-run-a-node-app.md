# Setup an AWS ec2 instance to run a node app

A way to run an app on the cloud is to have a virtual computer (also called VM or Virtual Machine) running on the cloud, which expose your app on a public ip.

The first step to achieve this is create an AWS EC2 instance:

EC2 > Instances > Launch instances

You can name your vm and add tag to it.

In Application and OS Images (Amazon Machine Image) and Instance type default settings provides a free t2.micro instance.

The next thing to do is to create key pair to be able to connect to your machine through SSH. Be sure to save the .pem file, you can't re-create it.

In the Network settings tab, check "Allow HTTP traffic from the internet" box to be able to access your app.

Once the instance has been lanched, in the "Network & Security" tab in the side menu go to "Elastic IPs" > Allocate Elastic IP adress and click "Allocate" next, go back to "Elastic IPs", click the new IP and click "Associate Elastic IP adress". Select your instance and click "Associate"

At this point, you have a running EC2 instance with a public IP adress to access it.

Next, you will connect your to your instance through SSH.

To do this, i will use a VSCode extension called "Remote Explorer". Once installed in your SSH config file (Linux: /home/\<usr\>/.ssh/config, Windows: C:\Users\\\<usr\>\\.ssh) add the following line with the correct informations

```
Host ANameForThisConnection
  HostName ec2-XXX-XXX-XXX-XXX.us-east-2.compute.amazonaws.com // the Public IPv4 DNS of your EC2 instance
  User ec2-user // the user for the EC2 instance (ec2-user by default)
  IdentityFile /home/\<usr\>/.ssh/pems/wtth.pem // the absolute path to the .pem file, containing the private key
```

If everything is correctly set up, you should be able to connect through SSH to your EC2 instance.

The first thing we will do is to install node by using nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
nvm install 16
node -e "console.log('Running Node.js ' + process.version)"
```

Next we install nginx as a reverse-proxy to redirects the requests on the port of our local running app:

```bash
sudo yum install epel-release
sudo yum install nginx
```

You can edit the nginx config file with:

```bash
sudo vim /etc/nginx/nginx.conf
```

Don't forget to start nginx:

```bash
sudo systemctl start nginx // starts nginx
sudo systemctl enable nginx // starts nginx on vm boot
```

The last thing we need now is to install pm2 wich allow us to run a node process in the background, otherwise, our app will shut down after we close the ssh connection.

```bash
npm i -g pm2
```

Your are now ready to start your app, you might need to install git if you want to clone a github repo, you can also create it directly through the SSH.

When your node app is ready to be deployed, the last step is to start it with pm2, in your project:

```bash
pm2 start index.js
pm2 start "npm run start" --name my-app // if you want to start your app with npm scripts
```

Some utility pm2 commands
```bash
pm2 status // dislays the status of the running process
pm2 restart my-app // restarts the app named 'my-app', you can also use the id of the process
pm2 logs 0 // displays the real time logs of the process of id 0
pm2 logs 0 --lines 1000 // displays the 1000 last lines of logs of id 0 process
```

note: will developping a project like this, developping through ssh and restarting many times my app causes my vm to quickly burn ec2 credits wich leads to the ssh connections to be extremely slow.