/**
 * @format
 */

import React, { Component } from 'react';
import {AppRegistry, View} from 'react-native';
import Main from './src/Main';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store'

export default class App extends Component{
    render(){
        return (
            <Provider store={store}>
                <Main/>
            </Provider>
        )
    }
}
AppRegistry.registerComponent(appName, () => App );
