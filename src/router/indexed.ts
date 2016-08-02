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

export function decorateModuleId(route) {
  console.log('decorating moduleId', route);
  route.moduleId = joinPaths(route.moduleId, 'index');
  console.log('new moduleId', route.moduleId);     
  return route;
}

export function isIndexed(route) {
  return route.settings && route.settings.indexed;
}

