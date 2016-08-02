import { navToIndexOnConfig } from './indexer';
import { indexStrat, createStrategy } from './strategizer';

const strategy = createStrategy(navToIndexOnConfig);

// Decorate with indexed: true setting on all routes
export const short = [
  { route: '', moduleId: 'pages', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account', title: 'Account', name: 'account', nav: true }
]

export const full = [
  { route: '', moduleId: 'pages/index', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account', title: 'Account', name: 'account', nav: true, navigationStrategy: strategy }
]
