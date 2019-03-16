import React from 'react';
import { createAppContainer,  } from 'react-navigation';


export class Navigator extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let AppContainer = createAppContainer(this.props.navigator);
        return(
            <AppContainer />
        );
    }
}