import React from 'react';
import { Animated, Keyboard, Platform, View, StyleSheet, Text, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, UIManager, findNodeHandle } from 'react-native';
import { Slashr } from "../Slashr";
import { Touchable } from '../Touchable';
import { inject, observer } from "mobx-react";

const Suggestions = Slashr.connectForm(
    class Suggestions extends React.Component {
        constructor(props) {
            super(props);
            this.renderSuggestion = this.renderSuggestion.bind(this);
            this.handleElementEvent = this.handleElementEvent.bind(this);

            this.handleLayoutChange = this.handleLayoutChange.bind(this);
            this.suggestionKeyExtractor = this.suggestionKeyExtractor.bind(this);
            this.suggestionsRef = null;
            this.suggestionsAnim = new Animated.Value(0);
            this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', this.keyboardHideListener.bind(this));
            this.keyboardShowListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', this.keyboardShowListener.bind(this));
            this.keyboardHeight = 0;
            this.elmt = this.props.element;
            this.elmt.addEventListener("change", this.handleElementEvent);
            this.elmt.addEventListener("blur", this.handleElementEvent);
            this.elmt.addEventListener("focus", this.handleElementEvent);
        }
        componentDidMount() {
            // this.update();
            this.suggestionLoader();
        }
        componentDidUpdate() {
            // this.update();
            this.animate();
        }
        keyboardHideListener() {
            this.keyboardHeight = 0;
            this.handleLayoutChange();
        }
        keyboardShowListener(event) {
            this.keyboardHeight = event.endCoordinates.height;
            this.handleLayoutChange();
        }
        handleLayoutChange() {
            if (!this.suggestionsRef) return;
            this.suggestionsRef.measure((fx, fy, width, height, px, py) => {
                let window = Dimensions.get('window');
                let totalHeight = py + height;
                let maxHeight = null;
                let viewHeight = window.height - this.keyboardHeight;
                if (totalHeight > viewHeight) {
                    maxHeight = height - (totalHeight - viewHeight) - 16;
                }
                this.elmt.setState({
                    suggestionsMaxHeight: maxHeight
                });
            })
        }
        async suggestionLoader() {
            if (!this.props.suggestionLoader) return [];
            let suggestions = await this.props.suggestionLoader(this.elmt.value || "");
            this.elmt.setState({
                suggestions: suggestions,
                hasSuggestions: (suggestions.length ? true : false)
            });
            this.animate();
        }
        handleElementEvent(type) {
            switch (type) {
                case "change":
                    this.suggestionLoader();
                    break;
            }
        }
        renderSuggestion(suggestion) {
            if (!this.props.renderSuggestion) throw ("Input Error: renderSuggestions required");
            let ret = this.props.renderSuggestion(suggestion, this.elmt, this.elmt.form);
            return ret;
        }
        suggestionKeyExtractor(suggestion) {
            if (!this.props.suggestionKeyExtractor) throw ("Input Error: suggestionKeyExtractor required");
            let ret = this.props.suggestionKeyExtractor(suggestion);
            return ret;
        }
        handlePress(suggestion) {
            if (!this.props.onSelectSuggestion) throw ("Input Error: onSelectSuggestion required");
            this.props.onSelectSuggestion(suggestion, this.elmt, this.elmt.form);
        }
        animate() {
            Animated.timing(this.suggestionsAnim, {
                toValue: (this.doShow) ? 1 : 0,
                duration: 250
            }).start();
        }
        get doShow() {
            return this.elmt.state.hasSuggestions && this.elmt.focus;
        }
        render() {
            let styles = this.styles;
            let suggestionsStyle = {
                ...styles.suggestions,
                opacity: this.suggestionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                })
            }
            if (this.elmt.state.suggestionsMaxHeight) suggestionsStyle.maxHeight = this.elmt.state.suggestionsMaxHeight;
            return (
                <Animated.View
                    style={suggestionsStyle} pointerEvents={this.doShow ? null : "none"}
                    onLayout={({ nativeEvent }) => { this.handleLayoutChange(nativeEvent) }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="always"

                    >
                        {/* <KeyboardAvoidingView style={{flex:1}} 
                        behavior="height" 
                        keyboardVerticalOffset={this.elmt.state.suggestionsOffsetY}
                        key={this.elmt.state.suggestionsKeyboardVisible ? "suggestionsKeyboard" : "suggestions"} 
                    >
                     */}
                        <View collapsable={false} ref={component => this.suggestionsRef = component}>
                            {this.elmt.state.suggestions && this.elmt.state.suggestions.map((suggestion) => {
                                let renderedSuggestion = this.renderSuggestion(suggestion);
                                if (!renderedSuggestion) return null;
                                return (
                                    <View key={this.suggestionKeyExtractor(suggestion)} style={styles.suggestion}>
                                        <Touchable
                                            onPress={() => {
                                                this.handlePress(suggestion);
                                            }}
                                        >
                                            {renderedSuggestion}
                                        </Touchable>
                                    </View>
                                );
                            })}
                        </View>
                        {/* </KeyboardAvoidingView> */}
                    </ScrollView>

                </Animated.View>
            );
        }
        get styles() {
            let theme = this.props.app.ui.theme;
            return new StyleSheet.create({
                suggestions: {
                    // flex:1,
                    position: "absolute",
                    // top: 56,
                    zIndex: 2,
                    left: 0,
                    right: 0,
                    top: "100%",
                    backgroundColor: theme.color.surface,
                    shadowOffset: { width: 0, height: 13 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 3,
                    borderBottomRightRadius: 4,
                    borderBottomLeftRadius: 4,
                    overflow:"hidden"
                }
            });
        }
    }
);
export default Suggestions;