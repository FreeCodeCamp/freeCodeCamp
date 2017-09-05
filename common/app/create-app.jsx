import { Observable } from 'rx';
import { compose, createStore, applyMiddleware } from 'redux';
import { selectLocationState, connectRoutes } from 'redux-first-router';
import { combineReducers } from 'berkeleys-redux-utils';

import { createEpic } from 'redux-epic';
import appReducer from './reducer.js';
import routesMap from './routes-map.js';
import createPanesMap from './create-panes-map.js';
import createPanesAspects from './Panes/redux';
import epics from './epics';

import servicesCreator from '../utils/services-creator';

// createApp(settings: {
//   history?: History,
//   defaultState?: Object|Void,
//   serviceOptions?: Object,
//   middlewares?: Function[],
//   sideReducers?: Object
//   enhancers?: Function[],
//   epics?: Function[],
// }) => Observable
//
// Either location or history must be defined
export default function createApp({
  history,
  defaultState,
  serviceOptions = {},
  middlewares: sideMiddlewares = [],
  enhancers: sideEnhancers = [],
  reducers: sideReducers = {},
  epics: sideEpics = [],
  epicOptions: sideEpicOptions = {}
}) {
  const epicOptions = {
    ...sideEpicOptions,
    services: servicesCreator(serviceOptions)
  };

  const epicMiddleware = createEpic(
    epicOptions,
    ...epics,
    ...sideEpics
  );

  const {
    reducer: routesReducer,
    middleware: routesMiddleware,
    enhancer: routesEnhancer
  } = connectRoutes(history, routesMap);

  routesReducer.toString = () => 'location';

  const {
    reducer: panesReducer,
    middleware: panesMiddleware
  } = createPanesAspects(createPanesMap());

  const enhancer = compose(
    routesEnhancer,
    applyMiddleware(
      routesMiddleware,
      panesMiddleware,
      epicMiddleware,
      ...sideMiddlewares
    ),
    // enhancers must come after middlewares
    // on client side these are things like Redux DevTools
    ...sideEnhancers
  );

  const reducer = combineReducers(
    appReducer,
    panesReducer,
    routesReducer,
    ...sideReducers
  );

  // create composed store enhancer
  // use store enhancer function to enhance `createStore` function
  // call enhanced createStore function with reducer and defaultState
  // to create store
  const store = createStore(reducer, defaultState, enhancer);
  const location = selectLocationState(store.getState());

  // ({
  //   redirect,
  //   props,
  //   reducer,
  //   store,
  //   epic: epicMiddleware
  // }));
  return Observable.of({
    store,
    epic: epicMiddleware,
    redirect: location.kind === 'redirect' ? location : false,
    notFound: false
  });
}
