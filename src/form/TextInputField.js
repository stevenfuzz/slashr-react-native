import React from 'react';
import { Animated, View, StyleSheet, Text, TextInput, ScrollView, Dimensions } from 'react-native';
import { Slashr } from "../Slashr";
import { Touchable } from '../Touchable';
import { inject, observer } from "mobx-react";
import Suggestions from './Suggestions';

const TextInputField = Slashr.connectForm(
    class TextInputField extends React.Component {
        constructor(props){
            super(props);
            this.elmt = this.props.form.addElement(props);
            this.handleChangeText = this.handleChangeText.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.activeColor = this.props.activeColor || this.props.form.activeColor || "#1565c0";
            this.errorColor = this.props.errorColor || this.props.form.errorColor || "#B00020";
            this.theme = this.props.theme || this.props.form.theme || "material";
            this.labelAnim = new Animated.Value(0);
            this.indicatorAnim = new Animated.Value(0);

        }
        componentDidUpdate(){
            this.animate();
        }
        handleChangeText(value){
            this.elmt.value = value;
        }
        animate(){
            Animated.timing(this.labelAnim, {
                toValue: (this.isActive) ? 1 : 0,
                duration: 200
            }).start();
            Animated.timing(this.indicatorAnim, {
                toValue: (this.elmt.error || this.elmt.isFocused) ? 1 : 0,
                duration: 200
            }).start();
        }
        get isActive(){
            return (this.elmt.isFocused || this.elmt.value !== null) ? true : false
        }
        handleFocus(){
            this.elmt.focus = true;
        }
        handleBlur(){
            this.elmt.blur = true;
        }
        render() {
            let activeColor = this.elmt.error ? this.errorColor : this.activeColor;
            let styles = materialStyles;
            switch(this.theme){
                case "materialDark":
                    styles = materialDarkStyles;
                break;
            }

            let labelTextStyle = {
                position: 'absolute',
                left: 12,
                lineHeight:16,
                fontWeight: this.isActive ? "600" : "400",
                top: this.labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 8],
                }),
                fontSize: this.labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 12],
                }),
                color: (this.elmt.error || this.elmt.focus) ? this.labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#aaa', activeColor],
                }) : "#aaa",
            }
            let indicatorStyle = {
                height:2,
                backgroundColor: activeColor,
                width: this.indicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                }),
            }
            let helperText = this.elmt.error ? this.elmt.error : this.elmt.helper;
            let helperTextStyle = styles.helperText;
            if(this.elmt.error){
                helperTextStyle = [helperTextStyle,{color:this.errorColor}];
            }
            let textFieldStyle = styles.textField;
            if(this.props.backgroundColor) textFieldStyle = [textFieldStyle,{backgroundColor: this.props.backgroundColor}];
            return (
                
                <View style={styles.textFieldWrapper}>
                    {this.props.suggestionLoader && 
                        <Suggestions element={this.elmt} {...this.props} />
                    }
                    <View style={textFieldStyle}>
                       
                        {/* GUIDeS*/ }
                        {/* <View
                            style={{
                                position:"absolute",
                                top:0,
                                left:0,
                                right:0,
                                height:20,
                                backgroundColor: "rgba(255,0,0,.1)"
                            }}
                        />
                        <View
                            style={{
                                position:"absolute",
                                top:20,
                                left:0,
                                right:0,
                                height:20,
                                backgroundColor: "rgba(255,0,0,.2)"
                            }}
                        /> */}
                        {this.props.label && 
                            <Animated.Text pointerEvents="none" style={labelTextStyle}>
                                {this.props.label}
                            </Animated.Text>
                        }
                        <View style={styles.textInputCntr}>
                            <TextInput
                                name={this.elmt.name}
                                ret={this.elmt.ref}
                                // placeholder={this.elmt.label}
                                value={this.elmt.value !== null ? `${this.elmt.value}` : null}
                                onChangeText={this.handleChangeText}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                autoFocus={this.props.autoFocus || null}
                                keyboardType={this.props.keyboardType || null}
                                style={styles.textInput}
                                
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        {helperText && <Text style={helperTextStyle}>{helperText}</Text>}
                        <View pointerEvents="none" style={styles.indicatorCntr}>
                            <Animated.View style={indicatorStyle} />
                        </View>
                       
                    </View>
                   
                </View>
            );
        }
    }
);
export default TextInputField;

const defaultStyles = new StyleSheet.create({
    textFieldWrapper:{
        flex:0,
        marginBottom:32,
    },
    textField:{
        flex:0,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        
    },
    textInputCntr:{
        borderBottomWidth:1,
    },
    textInput:{
        margin:0,
        paddingTop:24,
        paddingLeft:12,
        paddingRight:12,
        paddingBottom:11,
        height:55,
        backgroundColor: 'transparent',
        lineHeight:20,
        fontSize:16,
    },
    indicatorCntr:{
        position: 'absolute',
        bottom:0,
        left:0,
        right:0,
        height:2,
        flex:0,
        justifyContent: "center",
        alignItems: "center"
    },
    helperText:{
        fontSize:12,
        lineHeight:20,
        position:"absolute",
        bottom:-20,
        left:12,
    }
});

const materialDarkStyles = new StyleSheet.create({
    ...defaultStyles,
    textField:{
        ...defaultStyles.textField,
        backgroundColor: "rgba(0,0,0,.2)",
        
    },
    textInput:{
        ...defaultStyles.textInput,
        color:"#FFFFFF"
    },
    textInputCntr:{
        ...defaultStyles.textInputCntr,
        borderBottomColor: "#000000",
    },
    helperText:{
        ...defaultStyles.helperText,
        color:"rgba(0,0,0,0.6)"
    }
});

const materialStyles = new StyleSheet.create({
    ...defaultStyles,
    textField:{
        ...defaultStyles.textField,
        backgroundColor: "#EFEFEF",
    },
    textInputCntr:{
        ...defaultStyles.textInputCntr,
        borderBottomColor: "#9E9E9E",
    },
    helperText:{
        ...defaultStyles.helperText,
        color:"rgba(0,0,0,0.6)"
    }
});