import React from 'react';
import {DatePickerAndroid, Platform, View, Text, StyleSheet} from 'react-native';
import {Slashr} from './Slashr';
import {Touchable} from './Touchable';

export const DatePickerNative = Slashr.connect(
  class DatePickerNavive extends React.Component {
    constructor(props){
      super(props);
      this.handlePress = this.handlePress.bind(this);
    }
    async handlePress(){
      switch(Platform.OS){
        case "android":
          try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(2020, 4, 25)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), day
              
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
        break;
        case "ios":
        break;
      }
    //   return Platform.select({
    //     ios: (
    //         <TouchableHighlight 
    //             onPress={this.handlePress}
    //             underlayColor="transparent" 
    //         />
    //     ), 
    //     android: (
    //         <TouchableNativeFeedback
    //             onPress={this.handlePress}
    //             background={TouchableNativeFeedback.SelectableBackground()}
    //         >
    //             {this.props.children}
    //         </TouchableNativeFeedback>
    //     )
    // });
      
    }
    render() {
      return (
        <View>
          <Touchable onPress={this.handlePress}>
            <Text>Date Picker</Text>   
          </Touchable>
        </View>
      );
    }
  }
);

const sizeStyles = new StyleSheet.create({

});