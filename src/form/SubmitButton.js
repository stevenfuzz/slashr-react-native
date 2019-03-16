import React from 'react';
import { Animated, View, StyleSheet, Text, TextInput } from 'react-native';
import Button from '../Button';
import { Slashr } from '../Slashr';

const SubmitButton = Slashr.connectForm(
    class SubmitButton extends React.Component {
        constructor(props){
          super(props);
          this.handlePress = this.handlePress.bind(this);
          this.backgroundColor = this.props.backgroundColor || this.props.form.activeColor || "#1565c0";
        }
        handlePress(){
          this.props.form.submit();
        }
        render() {
          return <Button backgroundColor={this.backgroundColor} {...this.props} onPress={this.handlePress}/>
        }
      }
);

export default SubmitButton;

const styles = new StyleSheet.create({
    
});