import { navToIndexOnConfig } from './indexer';
import { indexStrat, createStrategy } from './strategizer';

const strategy = createStrategy(navToIndexOnConfig);

export const shortest = [
  { route: '', moduleId: '.', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'account', title: 'Account', name: 'account', nav: true }
]

export const short = [
  { route: '', moduleId: 'pages', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account', title: 'Account', name: 'account', nav: true }
]

export const full = [
  { route: '', moduleId: 'pages/index', title: 'Home', name: 'home', nav: true },
  { route: 'account',  moduleId: 'pages/account', title: 'Account', name: 'account', nav: true, navigationStrategy: strategy }
]
