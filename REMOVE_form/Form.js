import React from 'react';
import { Animated, View, StyleSheet, Text, TextInput } from 'react-native';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';
import {Provider} from 'mobx-react';
import FormDomain from './FormDomain';
export {TextInputField,SubmitButton};



export class Form extends React.Component {
  constructor(props){
    super(props);
    this.form = new FormDomain(props);
  }
  render() {
    return (
        <Provider form={this.form}>
            <View style={this.props.style}>
                {this.props.children}
            </View>
        </Provider>
    );
  }
}
  
const styles = new StyleSheet.create({
    
});