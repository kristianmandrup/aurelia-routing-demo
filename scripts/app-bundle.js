define('router/strategizer',["require", "exports"], function (require, exports) {
    "use strict";
    function indexStrat(instruction) {
        var path = 'pages' + instruction.fragment;
        console.log('all the same', instruction);
        instruction.config.moduleId = path;
        instruction.config.href = path;
    }
    exports.indexStrat = indexStrat;
    function createStrategy(transformRoute) {
        return function navStrat(instruction) {
            var config = transformRoute(instruction);
            console.log('transformed config', config);
            instruction.config.moduleId = config.moduleId;
            instruction.config.href = config.href;
            console.log('final instruction config', instruction.config);
        };
    }
    exports.createStrategy = createStrategy;
    function routeStrategizer(useStrategy, transformRoute) {
        return function (route) {
            if (useStrategy(route)) {
                var strategy = createStrategy(transformRoute);
                console.log('nav strategy must not return!!', strategy);
                route.navigationStrategy = strategy;
            }
            return route;
        };
    }
    exports.routeStrategizer = routeStrategizer;
});

define('router/utils',["require", "exports"], function (require, exports) {
    "use strict";
    function joinPaths() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i - 0] = arguments[_i];
        }
        var _paths = paths.join('/');
        return _paths.replace(/\/\//, '/');
    }
    exports.joinPaths = joinPaths;
});

define('router/indexer',["require", "exports", './utils'], function (require, exports, utils_1) {
    "use strict";
    function navToIndexOnFragment(instruction) {
        var originalPath = instruction.fragment;
        var path = originalPath;
        console.log('incoming', instruction);
        path = utils_1.joinPaths('pages', originalPath, 'index');
        console.log('final path', path);
        return { moduleId: path, href: originalPath };
    }
    exports.navToIndexOnFragment = navToIndexOnFragment;
    function navToIndexOnConfig(instruction) {
        var config = instruction.config;
        var routeModuleId = config.moduleId;
        console.log('incoming', config.name, routeModuleId);
        var routeModulePath = utils_1.joinPaths(routeModuleId, 'index');
        console.log('final path', routeModulePath);
        return { moduleId: routeModulePath, href: instruction.fragment };
    }
    exports.navToIndexOnConfig = navToIndexOnConfig;
});

define('router/routes',["require", "exports", './indexer', './strategizer'], function (require, exports, indexer_1, strategizer_1) {
    "use strict";
    var strategy = strategizer_1.createStrategy(indexer_1.navToIndexOnConfig);
    exports.short = [
        { route: '', moduleId: 'pages', title: 'Home', name: 'home', nav: true },
        { route: 'account', moduleId: 'pages/account', title: 'Account', name: 'account', nav: true }
    ];
    exports.full = [
        { route: '', moduleId: 'pages/index', title: 'Home', name: 'home', nav: true },
        { route: 'account', moduleId: 'pages/account', title: 'Account', name: 'account', nav: true, navigationStrategy: strategy }
    ];
});

define('router/indexed',["require", "exports", './utils'], function (require, exports, utils_1) {
    "use strict";
    function decorateSettings(setting) {
        return function (route) {
            console.log('decorating settings', route, setting);
            var settings = Object.assign({}, route['settings'], setting);
            console.log('new settings', settings);
            route.settings = settings;
            console.log('route', route);
            return route;
        };
    }
    exports.decorateSettings = decorateSettings;
    function decorateModuleId(route) {
        console.log('decorating moduleId', route);
        route.moduleId = utils_1.joinPaths(route.moduleId, 'index');
        console.log('new moduleId', route.moduleId);
        return route;
    }
    exports.decorateModuleId = decorateModuleId;
    function isIndexed(route) {
        return route.settings && route.settings.indexed;
    }
    exports.isIndexed = isIndexed;
});

define('app',["require", "exports", './router/routes', './router/indexed'], function (require, exports, routes_1, indexed_1) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            var routes = routes_1.short.map(indexed_1.decorateModuleId);
            config.title = 'Contacts';
            var appRoutes = routes;
            console.log('App routes');
            appRoutes.forEach(function (route) {
                console.log('route', route);
            });
            console.log('Mapping routes!!!');
            config.map(appRoutes);
            config.mapUnknownRoutes('not-found');
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('pages/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Home = (function () {
        function Home() {
        }
        return Home;
    }());
    exports.Home = Home;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('pages/account/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Home = (function () {
        function Home() {
        }
        return Home;
    }());
    exports.Home = Home;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>My app </h1>\n   <nav>\n      <ul>\n         <li repeat.for = \"row of router.navigation\">\n            <a href.bind = \"row.href\">${row.title}</a>\n         </li>\n      </ul>\n   </nav>\n   <router-view></router-view>\n</template>"; });
define('text!pages/index.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Home</h1>\n  <h2>hello there :)</h2>\n<template>\n"; });
define('text!pages/account/index.html', ['module'], function(module) { module.exports = "<template>\n  <h1>My Account</h1>\n<template>\n"; });
//# sourceMappingURL=app-bundle.js.map