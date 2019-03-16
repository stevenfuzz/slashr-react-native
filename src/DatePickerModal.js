import React from 'react';
import {Modal as ModalComponent, View, Text, StyleSheet,Dimensions} from 'react-native';
import {Slashr} from './Slashr';
import { DatePicker } from './DatePicker';
import { autorun } from 'mobx';
import Button from './Button';

export const DatePickerModal = Slashr.connect(
  class Modal extends React.Component {
    constructor(props){
      super(props);
      this.styles = this.getStyles();
      this.datePicker = this.props.app.ui.datePicker.create(this.props);
      this.handleCancelPress = this.handleCancelPress.bind(this);
      this.handleOkPress = this.handleOkPress.bind(this);

    }
    getStyles(){
			let styles = materialStyles;
          switch(this.props.theme){
              case "materialDark":
                  styles = materialDarkStyles;
              break;
			}
			return styles;
    }
    handleCancelPress(){
      this.datePicker.setVisible(false)
    }
    handleOkPress(){
      this.datePicker.setVisible(false)
    }
    render() {
      let styles = this.styles; 
      let dimensions = Dimensions.get('window');
      let width = dimensions.width - 64;
      let date = this.props.app.ui.datePicker.date;
      let headerStyle = styles.header;
     
      if(this.props.primaryColor) headerStyle = [headerStyle,{backgroundColor: this.props.primaryColor}]
      return (
        <View>
          <ModalComponent
            animationType="slide"
            transparent={true}
            visible={this.datePicker.isVisible}
            onRequestClose={()=>{}}
            >
            <View
              style={styles.datePickerOverlay}
            >
             
              <View
               style={styles.datePicker}
              >
               <View
                style={headerStyle}
                >
                <View>
                  <Text style={styles.headerTextYear}>2025</Text>
                </View>
                <View>
                  <Text style={styles.headerTextDate}>Mon, May 25</Text>
                </View>
                </View>
                <DatePicker 
                  width={width}
                  {...this.props}
                  datePicker={this.datePicker}
                />
                <View
                style={styles.buttons}
                >
                  <Button title="cancel" 
                    onPress={this.handleCancelPress}
                  />
                  <Button title="ok" 
                    onPress={this.handleOkPress}
                  />
                </View>
              </View>
            
            </View>
          </ModalComponent>
        </View>
      );
    }
  }
);

const defaultStyles = new StyleSheet.create({
  datePickerOverlay:{
    flex:1,
    overflow:"hidden",
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,.25)",
    justifyContent: "center",
    paddingLeft: 32,
    paddingRight: 32,
   
	},
	datePicker:{
    borderRadius:4,
    backgroundColor: "#FFFFFF",
    paddingBottom:16
  },
  header:{
    backgroundColor: "#1565c0",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding:16
  },
  headerTextYear:{
    color:"#FFFFFF",
    fontSize:18,
    opacity:.6
  },
  headerTextDate:{
    color:"#FFFFFF",
    fontSize:36,
    lineHeight:40
  },
  buttons:{
    flex:0,
    flexDirection:"row",
    justifyContent:"flex-end",
    paddingRight:24
  }
});

const materialStyles = new StyleSheet.create({
	...defaultStyles
});
const materialDarkStyles = new StyleSheet.create({
	...defaultStyles
});