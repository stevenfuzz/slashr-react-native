import React from 'react';
import {View} from 'react-native';
import { Provider } from "mobx-react";
import { SlashrApp } from 'slashr-react-native';

export class App extends React.Component {
    constructor(props){
        super(props);
        this.app = new SlashrApp(this.props);
    }
    render() {
        return(
            <Provider app={this.app} slashr={this.app.slashrInstance}>
                {this.props.children}
            </Provider>	
        );
    }
}