import {joinPaths} from './utils';

export function navToIndexOnFragment(instruction) {
  let originalPath = instruction.fragment;
  let path = originalPath;
  console.log('incoming', instruction);
  path = joinPaths('pages', originalPath, 'index');

  console.log('final path', path);
  return { moduleId: path, href: originalPath };
}


export function navToIndexOnConfig(instruction) {
  let config = instruction.config;
  let routeModuleId = config.moduleId;
  console.log('incoming', config.name, routeModuleId);
  let routeModulePath = joinPaths(routeModuleId, 'index');

  console.log('final path', routeModulePath);
  return { moduleId: routeModulePath, href: instruction.fragment };
}
