import React from 'react';
import {Modal as ModalComponent, View, Text, StyleSheet} from 'react-native';
import {Slashr} from './Slashr';
import { DatePicker } from './DatePicker';

export const DatePickerModal = Slashr.connect(
  class Modal extends React.Component {
    constructor(props){
      super(props);
      // this.modal = this.props.app.ui.modal.create(props);
    }
    render() {
      return (
        <View>
          <ModalComponent
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={()=>{}}
            >
            <DatePicker {...this.props} />
          </ModalComponent>
        </View>
      );
    }
  }
);
