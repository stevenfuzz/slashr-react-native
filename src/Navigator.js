import React from 'react';
import { createAppContainer,  } from 'react-navigation';
import { Slashr } from './Slashr';



export const Navigator = Slashr.connect(
class Navigator extends React.Component {
    constructor(props){
        super(props);
        this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this);
    }
    handleNavigationStateChange(prevState, newState, action){
        //console.log("nav state!",newState);
    }
    render() {
        let AppContainer = createAppContainer(this.props.navigator);
        return(
            <AppContainer 
                onNavigationStateChange={this.handleNavigationStateChange}
                ref={navigatorRef => {
                    this.props.app.nav = this.props.app.navigation = navigatorRef;
                }}
            />
        );
    }
}
);