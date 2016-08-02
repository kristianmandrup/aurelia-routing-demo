export function joinPaths(...paths) {  
  let _paths = paths.join('/');
  return _paths.replace(/\/\//, '/')
}
