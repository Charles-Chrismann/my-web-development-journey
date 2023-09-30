# Running Multiple Web apps on AWS

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