import React from 'react';
import {View} from 'react-native';
import { Provider } from "mobx-react";
import { SlashrApp } from 'slashr-react-core';
import { createAppContainer } from 'react-navigation';


export class App extends React.Component {
    constructor(props){
        super(props);
        this.app = new SlashrApp(this.props);
    }
    render() {
        let AppContainer = createAppContainer(this.props.navigator);
        
        return(
            <Provider app={this.app} slashr={this.app.slashrInstance}>
                <AppContainer />
            </Provider>	
        );
    }
}