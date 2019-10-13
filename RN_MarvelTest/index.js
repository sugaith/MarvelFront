/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/App';
import MainPage from './src/MainPage';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => MainPage);
