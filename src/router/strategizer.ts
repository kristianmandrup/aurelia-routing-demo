export function indexStrat(instruction) {
    // let config = transformRoute(instruction);
    let path = 'pages' + instruction.fragment ;

    console.log('all the same', instruction); 

    instruction.config.moduleId = path;
    instruction.config.href = path;    
  }

export function createStrategy(transformRoute) {
  return function navStrat(instruction) {
    let config = transformRoute(instruction);
    console.log('transformed config', config);

    instruction.config.moduleId = config.moduleId;
    instruction.config.href = config.href;

    console.log('final instruction config', instruction.config);    
  }
}

export function routeStrategizer(useStrategy, transformRoute) {
  return function(route) {
    if (useStrategy(route)) {
      const strategy = createStrategy(transformRoute);
      console.log('nav strategy must not return!!', strategy);
      
      route.navigationStrategy = strategy; 
    }    
    return route;
  }
}
