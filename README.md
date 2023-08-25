# My Web Development Journey

This repository keeps track of my discoveries on my Javascript learning journey. It deliberately uses descriptive naming instead of technical jargon to help beginners with limited technical knowledge to easily understand the functionalities and actions they are trying to perform.

I'm primarily a JavaScript/Node.js web developer and not the best, so in this repository, you will probably find a lot of content about web development, DevOps, and how the internet works. Again, this may not be 100% accurate since it is just my understanding of these topics.

My motivation to create this repository is to have a single place to store the solutions to problems I've encountered and easily find them. If these solutions could help others, I'm happy to share them.

Another motivation for creating this repository is to keep track of my areas of limited understanding, which will encourage me to explore certain subjects more deeply while providing explanations on more basic topics.

Please note that this repository is NOT intended to be a proof of good practices and does NOT claim to be the best way to do things.
====

## Table of Contents

- [Introduction](#my-web-development-journey)
- [Table of Contents](#table-of-contents)
- [How it works ?](#how-it-works)
- [How to ?](#how-to)
  - [Front-end web development](#front-end-web-development)
    - [Bind your front-end app to your backend api in development](#bind-your-front-end-app-to-your-backend-api-in-development)
  - [Backend web devlopment](#backend-web-development)
    - [Nest - setup static file module but keep controller to root with global prefix](#nest---setup-static-file-module-but-keep-controller-to-root-with-global-prefix)
    - [Setup an aws ec2 instance to run a node app](#aws---setup-an-aws-ec2-instance-to-run-a-node-app)
    - [Running Multiple Web apps on Aws](#aws---running-multiple-web-apps-on-aws)
  - [Docker](#docker)
      - Connect the cli to Docker Hub in linux
  - [Internet](#)
    - Bind domain names or subdomain to an ip address
  - [Unset](#unset)
- [Glossary](#glossary)
- [To do](#to-do)

<h2 align="center" id="how-it-works">How it works ?</h2>

<h2 align="center" id="how-to">How to ?</h2>

---

### Front-end web development

#### Bind your front-end app to your backend api in development

In web devlopment, a way to allow the user to interact with your service is to provide him a client, an html/css/js page, this client represente the User Interface with your backend server. On certain actions of the user on the user interface (click, keypress, ...) the client will send a request to the backend service representing the user action.

Most of the time, we want our client to be served on the same server as our backend, for example: the root of our site provide the client and some routes of our site are used to listen to the user actions (sometimes prefixed by /api/).

For example:

```
/users
/posts
/api/messages
```

In your code, while developing, you want your javascript to request the same origin that provide your client, most of the time you want it not to be hardcoded:

```js
// Bad
fetch('https://mysite.com/users');

// Good
fetch('/users');
```

While developing, most of the time you will use a dev server which provides hot reload, this approach provoke a problem: since this is a server, your javascript will request your backend server on your dev server:

If your backend runs on port 3000 and your front-end dev server runs on 4200, using the good js approach above, your request will looks like this: http://127.0.0.1:4200/users.

Since this is not what we want, front-end frameworks provides a way to redirect the request of your front-end app to the adress of your backend server, and this in dev mode only. This is called a proxy.

If you are using React with create-react-app:

Install http-proxy-middleware:
```
npm i http-proxy-middleware
```

Create a setupProxy.js in src/:

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
    }),
  );
};

```

If you are using Nx, put a proxy.config.json at the root of your app:

```json
{
  // /api requests will be mapped on http://localhost:3000/api
  "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true
  },
  // If you are using socket.io
  "/socket.io": {
      "target": "ws://localhost:3000",
      "ws": true
  }
}
```

*note:* If you are using socket.io with namespaces, you don't need to register your namespaces in the proxy.conf.json, socket.io process it himself.

---

### Backend web development

#### Nest - setup static file module but keep controller to root with global prefix

<details>

<summary>In my case</summary>

I was working on a project who aims to easily look at the result of frontend project repos by giving a way to visualize them without having to clone them in the first place.
I wanted to use the nest ServeStaticModule to serve the preview of the projects visualizer but keep a way to bind a controller to the root url (/) to render a view of all already cloned projects. In the other hand, i wanted to prefix all other routes with the api prefix.

```
/ => All projects, a list dynamically rendered
/repos/:repo-owner/:project-name/index.html => No controller bind here, managed by the ServeStaticModule
/api/... => any other controller
```

</details>

In **main.ts**

```ts
app.setGlobalPrefix('api', {
  exclude: ['', 'api']
});
```

In **app.controller.ts**

```ts
@Controller()
export class AppController {

  // Accessible on /
  @Get()
  root() {
    /*...*/
  }

  // /!\ Accessible on /api/da /!\
  @Get('da')
  da() {
    /*...*/
  }
}
```

In **api.controller.ts**

```ts
@Controller('api')
export class ApiController {
  // Accessible on /api/
  @Get()
  getHello(){
    /*...*/
  }

  // /!\ Accessible on /api/api/info /!\
  @Get('info')
  getInfo(){
    /*...*/
  }
}
```

Any other route will be prefix by 'api'.

Keep in mind that this approache might cause unexpected behaviors

---

#### AWS - Setup an AWS ec2 instance to run a node app

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

---

#### AWS - Running Multiple Web apps on AWS

Sometimes when you are building small apps, you might want to run multiple applications on the same ip address but [bind differents subdomains or domain names](#) to each app, what you are looking for here is to setup a [reverse-proxy](https://www.cloudflare.com/en-gb/learning/cdn/glossary/reverse-proxy/), to achieve this, you can use [Nginx](https://www.nginx.com/).

After installing it, edit the nginx.conf (on Ubuntu: /etc/nginx/nginx.conf)

```nginx
http {

  server {
    listen 80;
    server_name subdomain.domain-name.com;

    location / {
      proxy_pass http://127.0.0.1:3000;
    }
  }

  server {
    listen 80;
    server_name other-subdomain.domain-name.com;

    location / {
      proxy_pass http://127.0.0.1:4000
    }
  }
}
```

Don't forget to restart Nginx, so that Nginx takes into account the new parameters
```
sudo systemctl restart nginx.service
```

After this, subdomain.domain-name.com will serve the app running on the port 3000 and the other-subdomain.domain-name.com will serve the app running on the port 4000.

This works because Nginx take a look at the 'host' property of the incoming request and direct it to the appropriate service.

---

### Unset

#### Use full power of markdown

Markdown is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is easier to read in its source code form. Markdown is widely used for blogging and instant messaging, and also used elsewhere in online forums, collaborative software, documentation pages, and readme files.

Even if all many system uses Mardown, the rendered output might differ a little bit, a good way to visualize this is to compare how github and vscode renders the same Markdown input.

Here, i will only describe Markdown that works on github.

First of all, it is important to specify that several html tags produce the same output:

```Markdown
# This is a h1
<h1>This is also a h1</h1>
```

Here is a non exhaustive list of those correspondance

```Markdown
##
<h2></h2>

###
<h3></h3>

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
<table>
  <thead>
    <tr>
      <th>Syntax</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Header</td>
      <td>Title</td>
    </tr>
    <tr>
      <td>Paragraph</td>
      <td>Text</td>
    </tr>
  </tbody>
</table>
```

Markdown wrote using html can contain attributes, for example:

```Markdown
# This h1 is aligned on left
<h1 align="center">This h1 is centered</h1>
```

Personally, i use html tags only for special cases that can only be achieved this way. 

---

<h2 align="center" id="glossary">Glossary</h2>

### Example Section

#### Example

This is the definition of an example 

Official website: [example.com](#)

```ts
// A comment in the code
function foo(): string {
  return 'bar'
}
```

Instal it here: [instal-it-here.com](#)

Getting started or tuto: [tuto-it-here.com](#)

Other ressources:
- [here](#)

Some alternatives
- [Alt 1](#)
- [Alt 2](#)
- [Alt 3](#)

---

### Global

#### Markup Language

#### Programming Language

#### Framework

#### Paradigm

#### Cache

#### SOLID

---

### Internet

#### Content Delivery Network (CDN)

#### SSH

---

### Front-end development

#### HTML

#### PUG

#### CSS

#### SASS

#### SCSS

#### LESS

#### Javascript

#### JQuery

#### Components

#### React

**React** is a Javascript library developed by Facebook in 2013. It is the most influential ui library of modern front-end development. Even if it is still a library, its environment has grown enough to be now considered as a front-end [framework](#framework).

Official website: [react.dev](https://react.dev/)

React [getting-started](https://react.dev/learn)

Other ressources:
- [Fireship - React in 100 Seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM)

#### Angular

#### Vue

#### Svelte

#### Solide

#### WebAssembly

### Backend development

#### Apache HTTP Server

**Apache HTTP Server** is an HTTP server created by the Apache fundation

Official website: [httpd.apache.org](https://httpd.apache.org/)

Alternatives:
- [NGINX](#nginx)

#### NGINX

#### Proxy

---

### Database environment

#### Database

#### ACID

#### Object Relation Mapping (ORM)

#### Graphql

#### SQL

#### POSTGRES

#### MySQL

#### MariaDB

#### Cassandra

#### Redis

---

### The Programming Languages

#### C

#### C++

#### C#

#### Php

#### Java

#### Javascript

---

### Other

#### Hot Reload

<h2 align="center" id="to-do">To do</h2>

- write an answer template (in my case, tl;dr, explanation, ...)
- Create normalization (For example/e.g.)
- create glossary
- Write the topic:
  - topic + idea
  - why are my react components rendered twice ?
  - nx
  - ts
  - ws vs webrtc vs server sent event
  - create-react-app alternatives
  - switch between es5/6 import
  - run app in bg with pm2 + run as root with nvm by using links
- End the topic:
  - topic + idea
  - Proxy front for nx & angular + ws
- Fix/Update the topic:
  - topic + explanation
- Fix relative links
- Refactor the title hierarchy
- Write how XXX works (as h2 in hierachy ?)
- write how to XXX
- Error and meanings