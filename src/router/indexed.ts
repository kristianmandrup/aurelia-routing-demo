import {joinPaths} from './utils';

export function decorateSettings(setting) {
  return function(route) {
    console.log('decorating settings', route, setting);
    let settings = Object.assign({}, route['settings'], setting);
    console.log('new settings', settings);      
    route.settings = settings;
    console.log('route', route);     
    return route;
  }
}

export function indexModuleId(route) {
  return joinPaths(route.moduleId, 'index');
}

export function nestedModuleId(route, {root, page}) {
  let pageName = route.name;
  if (page) {
    pageName = typeof page === 'string' ? page : page(pageName); 
  }
  const basePath = root ? joinPaths(root, route.moduleId) : route.moduleId;  
  return joinPaths(basePath, pageName);
}

export function isIndexed(route) {
  return route.settings && route.settings.indexed;
}

export function decorateModuleId(route) {
  console.log('decorating moduleId', route);
  route.moduleId = indexModuleId(route); 
  return route;
}

export function createDecorator(transform, options = {}) {
  return function (route) {
    route.moduleId = transform ? transform(route, options) : joinPaths(route.moduleId, 'index'); 
    return route;
  }
}


