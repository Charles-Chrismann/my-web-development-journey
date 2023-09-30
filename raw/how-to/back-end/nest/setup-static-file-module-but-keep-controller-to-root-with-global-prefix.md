# Setup static file module but keep controller to root with global prefix

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