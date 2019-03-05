import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import Icon from "./Icon";
import { withNavigation } from 'react-navigation';
import { colors, fontStyles } from '../styles/styles';

const Button = class Button extends React.Component {
    constructor(props){
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }
    handlePress(){
        if(this.props.to){
            this.props.navigation.navigate(this.props.to);
        }
        else if(this.props.onPress) this.props.onPress();
    }
    render() {
        let size = this.props.size || "medium";
        let style = {...styles.button,...this.props.style}
        let titleStyle = {...styles.title,...this.props.titleStyle}
        console.log("LSKDJF");
        return (
            <TouchableNativeFeedback
                onPress={this.handlePress}
                background={TouchableNativeFeedback.SelectableBackground()}
                // ripple={TouchableNativeFeedback.Ripple("#FFFFFF",false)}
            >
                <View style={style}>
                    {this.props.icon && 
                        <View style={styles.icon}>
                            {this.props.icon}
                        </View>
                    }
                    <View style={styles.titleContainer}>
                        <Text style={titleStyle}>{this.props.title.toUpperCase()}</Text>
                    </View>
                    {this.props.iconRight && 
                        <View style={styles.iconRight}>
                            {this.props.iconRight}
                        </View>
                    }
                </View>
               
            </TouchableNativeFeedback>
        );
    }
}

const sizeStyles = new StyleSheet.create({
    small: {
        padding: 10
    },
    medium: {
        padding: 12
    },
    large:{
        padding: 16
    },
    jumboMadness:{
        padding: 24
    }
});


const styles = new StyleSheet.create({
    button: {
        flex:0,
        flexDirection:"row",
        justifyContent: "space-between",
        borderRadius: 4,
        backgroundColor: colors.primary,
        height:36,
        alignContent: "center",
        textAlign: "center",
        shadowOffset: {width: 0, height: 13}, 
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
        minWidth:64 
    },
    titleContainer: {
        paddingLeft:16,
        paddingRight:16,
        marginLeft: "auto",
        marginRight: "auto"
    },
    title: {
        ...fontStyles.bold,
        fontSize: 14,
        lineHeight: 36,
        color: colors.white
    }
});

export default withNavigation(Button);
