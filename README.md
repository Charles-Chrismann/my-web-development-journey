# My Web Development Journey

This repository keeps track of my discoveries on my Javascript learning journey. It deliberately uses descriptive naming instead of technical jargon to help beginners with limited technical knowledge to easily understand the functionalities and actions they are trying to perform.

I'm primarily a JavaScript/Node.js web developer and not the best, so in this repository, you will probably find a lot of content about web development, DevOps, and how the internet works. Again, this may not be 100% accurate since it is just my understanding of these topics.

My motivation to create this repository is to have a single place to store the solutions to problems I've encountered and easily find them. If these solutions could help others, I'm happy to share them.

Another motivation for creating this repository is to keep track of my areas of limited understanding, which will encourage me to explore certain subjects more deeply while providing explanations on more basic topics.

Please note that this repository is NOT intended to be a proof of good practices and does NOT claim to be the best way to do things.
====

## Table of Contents

- [Front-end web development](#front-end-web-development)
  - [Bind your front-end app to your backend api in development](#bind-your-front-end-app-to-your-backend-api-in-development)
- [Nest](#nest)
    - [setup static file module but keep controller to root with global prefix](#setup-static-file-module-but-keep-controller-to-root-with-global-prefix)
- [Aws](#aws)
    - Set up reverse proxy with nginx
- [Docker](#docker)
    - Connect the cli to Docker Hub in linux
- [Internet](#)
  - Bind domain names or subdomain to an ip address
- [Glossary](#glossary)
- [To do](#to-do)

## Front-end web development

### Bind your front-end app to your backend api in development

In web devlopment, a way to allow the user to interact with your service is to provide him a client, an html/css/js page, this client represente the User Interface with your backend server. On certain actions of the user on the user interface (click, keypress, ...) the client will send a request to the backend service representing the user action.

Most of the time, we want our client to be served on the same server as our backend, for example: the root of our site provide the client and some routes of our site are used to listen to the user actions (sometimes prefixed by /api/).

For example:
```
/users
/posts
/api/messages
```

## Nest

### setup static file module but keep controller to root with global prefix

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

## Aws

###  Running Multiple Web apps on Aws

Sometimes when you are building small apps, you might want to run multiple applications on the same ip address but [bind differents subdomains or domain names](#) to each app, what you are looking for here is to setup a [reverse-proxy](https://www.cloudflare.com/en-gb/learning/cdn/glossary/reverse-proxy/), to achieve this, you can use [Nginx](https://www.nginx.com/).

After installing it, edit the nginx.conf (on Ubuntu: /etc/nginx/nginx.conf)

```
http {

  server {
    listen 80;
    server_name subdomain.domain-name.com;

    location / {
      proxy_pass http://127.0.0.1:3000
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

## Glossary

## To do

- write an answer template (in my case, tl;dr, explanation, ...)
- Create normalization (For example/e.g.)
- create glossary
- Write the topic:
  - topic + idea
- End the topic:
  - topic + idea
- Fix/Update the topic:
  - topic + explanation
- Fix relative links
- Refactor the title hierarchy
- Write how XXX works (as h2 in hierachy ?)