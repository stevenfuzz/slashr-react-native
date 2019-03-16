import React from 'react';
import {Modal as ModalComponent, View, Text, StyleSheet} from 'react-native';
import {Slashr} from './Slashr';

export const Modal = Slashr.connect(
  class Modal extends React.Component {
    constructor(props){
      super(props);
      this.modal = this.props.app.ui.modal.create(props);
    }
    render() {
      return (
        <View>
          <ModalComponent
            animationType="slide"
            transparent={false}
            visible={this.modal.isVisible}
            onRequestClose={()=>{}}
            >
            <View style={{backgroundColor:"white",flex:1}}>
              <View>
                <Text>Header!</Text>
              </View>
            </View>
            <View>
              {this.props.children}
            </View>
          </ModalComponent>
        </View>
      );
    }
  }
);

const sizeStyles = new StyleSheet.create({

});