import React from 'react';
import { Animated, View, StyleSheet, Text, TextInput } from 'react-native';
import { inject, observer } from "mobx-react";

const TextInputField = inject("form")(observer(
    class TextInputField extends React.Component {
        constructor(props){
            super(props);
            
            let elmt = this.props.form.addElement(props);
            console.log("CREATED ELEMENT",elmt);

            this.handleChangeText = this.handleChangeText.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.activeColor = this.props.activeColor || "#1565c0";
            this.state = {
                value: this.props.value || "",
                hasFocus: false
            };
            this.labelAnim = new Animated.Value(0);
            this.indicatorAnim = new Animated.Value(0);
        }
        componentDidMount(){
            
        }
        componentDidUpdate(){
            this.animate();
        }
        get elmt(){
            return {
                name: this.props.name,
                label: this.props.label || null,
            }
        }
        handleChangeText(value){
            console.log(value);
            
            this.setState({
                value: value
            });

        }
        animate(){
            Animated.timing(this.labelAnim, {
                toValue: (this.isActive) ? 1 : 0,
                duration: 200
            }).start();
            Animated.timing(this.indicatorAnim, {
                toValue: (this.isActive) ? 1 : 0,
                duration: 200
            }).start();
        }
        get isActive(){
            return (this.state.hasFocus || this.state.value !== "") ? true : false
        }
        handleFocus(){
            this.setState({
                hasFocus: true,
            });
        }
        handleBlur(){
            this.setState({
                hasFocus: false,
            });
        }
        render() {
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
                color: this.labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#aaa', this.activeColor],
                }),
            }
            let indicatorStyle = {
                height:2,
                backgroundColor: this.activeColor,
                width: this.indicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                }),
            }
            console.log(this.labelTextStyle);
            return (
                
                <View>
                    <View style={styles.textField}>
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
                        {this.elmt.label && 
                            <Animated.Text pointerEvents="none" style={labelTextStyle}>
                                {this.elmt.label}
                            </Animated.Text>
                        }
                        <View style={styles.textInputCntr}>
                            <TextInput
                                name={this.elmt.name}
                                // placeholder={this.elmt.label}
                                value={this.state.value}
                                onChangeText={this.handleChangeText}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        {this.elmt.error && <Text>{this.elmt.error}</Text>}
                        {this.elmt.success && <Text>{this.elmt.success}</Text>}
                        {this.elmt.helper && <Text>{this.elmt.helper}</Text>}
                        <View pointerEvents="none" style={styles.indicatorCntr}>
                            <Animated.View style={indicatorStyle} />
                        </View>
                    </View>
                </View>
            );
        }
    }
));
export default TextInputField;

const styles = new StyleSheet.create({
    textField:{
        flex:0,
        backgroundColor: "#EFEFEF",
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        marginBottom:24,
        position: "relative"
    },
    textInputCntr:{
        borderBottomWidth:1,
        borderBottomColor: "#9E9E9E",
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
    }
    // label:{
    //     zIndex:2,
    //     flex:0,
    //     lineHeight:20
    // },
});