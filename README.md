## Indexed routing demo

Configuring a router to work gracefully with the [Aurelia best practices app layout](http://patrickwalters.net/my-best-practices-for-aurelia-application-structure/)
The application is structured into a nested hierarchy as follows:

```bash
/pages
  - index.ts
  - index.html

  /account
    - index.ts
    - index.html
```

Normally you have to specify the exact path to each ViewModel moduleas follows:

```js
[
  { route: '', moduleId: 'pages/index', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account/index', title: 'Account', name: 'account', nav: true }
]
```

Looks kinda ugly (and redundant!) having to specify the `index` at the end each time.
We would instead like to achieve the following, and have the router figure out how to resolve the moduleId.

```js
[
  { route: '', moduleId: 'pages', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account', title: 'Account', name: 'account', nav: true }
]
```

For now the Aurelia `Router` can only use its default module resolution strategy. We can however customize the strategy on the route level via
`navigationStrategy`. We thus want each route decorated with a custom `navigationStrategy` which adds the `index` at the end of each 
`moduleId` before passing it on to the router module resolution engine.

We have chosen to decorate all the routes in the router with a special `settings` option: `{indexed: true}`.
To achieve this we have built a special `decorateSettings` function which we can use with `map`, mapping over each route.

`const routes = short.map(decorateSettings({indexed: true}));`

Alternatively we could modify the `moduleId` directly on the routes (however this kinda defeats the purpose?).
We ideally want the route `moduleId` to signal the navigation intent (navigate to `pages/account` or even just `/account`) leaving the details of module resolution
to the Aurelia routing engine. It is an `Id` after all, not a path. Adding a setting is metadata for the engine, so we keep things separate.
You can see the two different decoration approaches in: `router/indexed.ts`

Simply decorate `moduleId` of each route.

`function decorateModuleId(route) { ... }`

You can also use `createDecorator(transform, options = {})` in `indexed.ts` to transform moduleIds on all routes 
given a transform function with options. The options available are `root` and `page`. Root is prepended on the moduleId
and page is a static override of the page name (by default the `route.name`) or a even function to create the page name from the route name.

`shortest.map(createDecorator(nestedModuleId, {root: 'pages', page: 'index'}));`

Will transform `account` to `pages/account/index`. Without the `page` option: `pages/account/account`   

### Decorating route settings

`decorateSettings` is a factory method to create a method which decorates a specific route setting:

```js
decorateSettings(setting) {
  return function(route) {
    ...
  }
}
```

## Custom navigationStrategy 

Now add the custom `navigationStrategy` for each route with an `{indexed: true}` setting.   
We demonstrate two different strategies for achieving this:
- `navToIndexOnFragment`
- `navToIndexOnConfig`

### navToIndexOnFragment

`navToIndexOnFragment` uses the incoming fragment to build up the `moduleId` (relative path to module from router!).
The `instruction.fragment` contains the url of the current route, f.ex `/account`.
In this case we need to prepend `pages` and append `/index` to get the valid modulePath: `pages/account/index` 

`path = joinPaths('pages', originalPath, 'index');`

The fragment is often useful for highly dynamic scenarios.

### navToIndexOnConfig

`navToIndexOnFragment` uses the existing route config to build the new moduleId. This is often the approach you wish 
to use in case you have decorated your routes with special settings, such as in our case.

## Building your own

You can use these recipes, strategies and functions to easily build your own "magical" and powerful router.

## Loading routes from JSON file

I also encourage you to store your routes configuration externally as a JSON file. 
Use the [router-loader](https://github.com/Vheissu/aurelia-router-loader/) or a similar approach to load the routes!

As you can [see](https://github.com/Vheissu/aurelia-router-loader/blob/master/src/router-loader.js), it uses promises to load
and add routes to a router.

`constructor(loader, router)`

`defineRoutes(routes) {`

```js
loader.defineRoutes([
                '/routes/main.json',
                '/routes/admin.json' 
            ])  
```

I believe you can do something like this for routable view models...

```js
import { Router } from 'aurelia-router';
import { RouterLoader} from 'router-loader/router-loader';
import {Loader} from 'aurelia-loader';

@inject(Router)
class ChildViewModel {  
    configureRouter(config, router) {
        this.router = router;

        const loader = new Loader();
        const routeLoader = new RouterLoader(loader, router);

        routeLoader.defineRoutes([
            './routes/main.json',
            './routes/admin.json' 
        ])  

        // router config
    }

    goSomeWhere() {
        this.router.navigate('somewhere');
    }
}
```

Obviously if you want to go down this path, you should define an abstract baseclass (or mixin) where you can put this logic
for reuse across various routable view models ;)  

```js
import { RouterLoader} from 'router-loader/router-loader';
import {Loader} from 'aurelia-loader';

class RouteLoading {
  loadRoutes(routeFiles) {
      const loader = new Loader();
      const routeLoader = new RouterLoader(loader, this.router);

      routeLoader.defineRoutes(routeFiles)      
  }
}
```

Then use the `RouteLoading` behaviour in a routable view model...

```js
import { Router } from 'aurelia-router';

@inject(Router)
class ChildViewModel extends RouteLoading {  
    configureRouter(config, router) {
      this.router = router;
      this.loadRoutes([
        './routes/main.json',
        './routes/admin.json' 
      ])
    }
}
```

Not sure if you wanna put this in the `constructor` instead!?

## Conclusion

I really wish the `moduleId` resolution strategy could be customized on the router itself, either via overriding a prototype method or
directly on the specific instance. It should not be so hard/cumbersome to customize a route navigation strategy!
 

     
