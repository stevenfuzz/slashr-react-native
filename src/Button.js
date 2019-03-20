import React from 'react';
import { Slashr } from "./Slashr";
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import {Touchable} from './Touchable';
import { withNavigation } from 'react-navigation';

const Button = Slashr.connect(
    class Button extends React.Component {
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
            let styles = this.styles;
            let size = this.props.size || "medium";
            // let styles = [styles,this.props.style];
            if(this.props.theme && this.themeStyles[this.props.theme]){
                styles = {...styles, ...this.themeStyles[this.props.theme]};
            }
            return (
                <Touchable
                    onPress={this.handlePress}
                    // background={TouchableNativeFeedback.SelectableBackground()}
                    // ripple={TouchableNativeFeedback.Ripple("#FFFFFF",false)}
                >
                    <View style={styles.button}>
                        {this.props.icon && 
                            <View style={styles.icon}>
                                {this.props.icon}
                            </View>
                        }
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
                        </View>
                        {this.props.iconRight && 
                            <View style={styles.iconRight}>
                                {this.props.iconRight}
                            </View>
                        }
                    </View>
                
                </Touchable>
            );
        }
        get styles(){
            let theme = this.props.app.ui.theme;
            return new StyleSheet.create({
                button: {
                    flex:0,
                    flexDirection:"row",
                    justifyContent: "space-between",
                    borderRadius: 4,
                    backgroundColor: theme.color.primary,
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
                    height: 16,
                    // paddingBottom:10,
                    // paddingTop: 10,
                    marginLeft: "auto",
                    marginRight: "auto"
                },
                title: {
                    fontWeight:"600",
                    fontSize: 14,
                    lineHeight:36,
                    color: theme.color.onPrimary
                }
            });
        }
        get themeStyles(){
            let theme = this.props.app.ui.theme;
            return {
                text: StyleSheet.create({
                    button: {
                        height:36,
                        borderWidth: 0,
                        shadowOpacity: 0,
                        shadowRadius: 0,
                        elevation: 0,
                       
                        backgroundColor: "transparent"
                    },
                    title:{
                        lineHeight:36,
                        fontWeight:"600",
                        color: theme.color.primary,
                    }
                })
            };
        }
    }
);

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

export default withNavigation(Button);
