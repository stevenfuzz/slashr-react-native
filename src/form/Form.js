import React from 'react';
import { Animated, View, StyleSheet, Text, TextInput } from 'react-native';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';
import {Provider} from 'mobx-react';
import { Slashr } from 'slashr-react-core';
export {TextInputField,SubmitButton};



export const Form = Slashr.connect(
  class Form extends React.Component {
    constructor(props){
      super(props);
      this.form = this.props.app.ui.forms.create(props);
    }
    componentDidMount(){
      this.form.setValues(this.props.values || {})
    }
    componentDidUpdate(prevProps){
      if(prevProps.values !== this.props.values) this.form.setValues(this.props.values || {})
    }
    componentWillUnmount(){
      this.form.remove();
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
);

const styles = new StyleSheet.create({
    
});