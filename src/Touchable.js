import React from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';

export const Touchable = withNavigation(class Touchable extends React.Component {
    constructor(props){
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }
    handlePress(){
        if(this.props.to){
            this.props.navigation.navigate(this.props.to, this.props.params || {});
        }
        else if(this.props.onPress) this.props.onPress();
    }
    render() {
        return Platform.select({
            ios: (
                <TouchableHighlight 
                    onPress={this.handlePress}
                    underlayColor="transparent" 
                />
            ), 
            android: (
                <TouchableNativeFeedback
                    onPress={this.handlePress}
                    background={TouchableNativeFeedback.SelectableBackground()}
                >
                    {this.props.children}
                </TouchableNativeFeedback>
            )
        });
    }
});

// export default withNavigation(Touchable);
