import {Router, RouterConfiguration} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import { routeStrategizer } from './router/strategizer';
import { shortest, short, full } from './router/routes';
import { isIndexed, decorateSettings, decorateModuleId, createDecorator, nestedModuleId } from './router/indexed';
import { navToIndexOnConfig } from './router/indexer';


export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router){
    // decorate routes with {indexed: true}
    // const routes = short.map(decorateSettings({indexed: true}));    
    // const routes = short.map(decorateModuleId);
    // const routes = shortest.map(createDecorator(nestedModuleId, {root: 'pages', page: (name) => { return name + 'Page' } }));
    const routes = shortest.map(createDecorator(nestedModuleId, {root: 'pages', page: 'index'}));
    
    // same as: decorateSettings({indexed: true})
    // const myRoutes = short.map(route => {
    //   route['settings'] = {indexed: true};
    //   return route; 
    // });

    // const myRoutes = full;

    config.title = 'Contacts';

    // decorate with routing strategy
    // const decorator = routeStrategizer(isIndexed, navToIndexOnConfig);    
    // let appRoutes = routes.map(decorator); 

    const appRoutes = routes;

    console.log('App routes'); 
    appRoutes.forEach(route => {
      console.log('route', route);      
    })

    console.log('Mapping routes!!!');
    config.map(appRoutes);

    config.mapUnknownRoutes('not-found');

    this.router = router;
  }
}
