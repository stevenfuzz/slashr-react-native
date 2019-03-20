import React from 'react';
import {Modal as ModalComponent, View, Text, StyleSheet,Dimensions} from 'react-native';
import { Slashr } from './Slashr';
import { DatePicker } from './DatePicker';
import Button from './Button';

export const DatePickerModal = Slashr.connect(
  class Modal extends React.Component {
    constructor(props){
      super(props);
      //this.styles = this.getStyles();
      this.datePicker = this.props.app.ui.datePicker.create(this.props);
      this.handleCancelPress = this.handleCancelPress.bind(this);
      this.handleOkPress = this.handleOkPress.bind(this);
    }
   
    // getStyles(){
		// 	let styles = materialStyles;
    //       switch(this.props.theme){
    //           case "materialDark":
    //               styles = materialDarkStyles;
    //           break;
		// 	}
		// 	return styles;
    // }
    handleCancelPress(){
      this.datePicker.setVisible(false)
    }
    handleOkPress(){
      if(this.props.onSelect) this.props.onSelect(this.datePicker.date)
      this.datePicker.setVisible(false)
    }
    render() {
      let styles = this.styles; 
      let dimensions = Dimensions.get('window');
      let width = dimensions.width - 112;
      let date = this.datePicker.date;
      let dayLabel = Slashr.utils.date.getDayLabel(date, Slashr.utils.date.LABEL_TYPE_SHORT);
      let monthLabel = Slashr.utils.date.getMonthLabel(date, Slashr.utils.date.LABEL_TYPE_SHORT);
      return (
        <View>
          <ModalComponent
            animationType="fade"
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
                style={styles.header}
                >
                <View>
                  <Text style={styles.headerTextYear}>{date.getFullYear()}</Text>
                </View>
                <View>
                  <Text style={styles.headerTextDate}>{dayLabel}, {monthLabel} {date.getDate()}</Text>
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
                    theme="text"
                    onPress={this.handleCancelPress}
                  />
                  <Button title="ok" 
                    theme="text"
                    onPress={this.handleOkPress}
                  />
                </View>
              </View>
            
            </View>
          </ModalComponent>
        </View>
      );
    }
    get styles(){
      let theme = this.props.app.ui.theme;
      return new StyleSheet.create({
        datePickerOverlay:{
          flex:1,
          overflow:"hidden",
          flexDirection: "column",
          backgroundColor: "rgba(0,0,0,.4)",
          justifyContent: "center",
          paddingLeft: 56,
          paddingRight: 56,
         
        },
        datePicker:{
          borderRadius:4,
          backgroundColor: theme.color.surface,
          paddingBottom:16,
          shadowOffset: {width: 0, height: 13}, 
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        },
        header:{
          backgroundColor: theme.color.primary,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          padding:16
        },
        headerTextYear:{
          color:theme.color.onSurface,
          fontSize:18,
          opacity:.6
        },
        headerTextDate:{
          color:theme.color.onSurface,
          fontSize:36,
          fontWeight:"300",
          lineHeight:40
        },
        buttons:{
          flex:0,
          flexDirection:"row",
          justifyContent:"flex-end",
          paddingRight:8
        }
      });
    }
  }
  
);

// const defaultStyles = new StyleSheet.create({
//   datePickerOverlay:{
//     flex:1,
//     overflow:"hidden",
//     flexDirection: "column",
//     backgroundColor: "rgba(0,0,0,.25)",
//     justifyContent: "center",
//     paddingLeft: 32,
//     paddingRight: 32,
   
// 	},
// 	datePicker:{
//     borderRadius:4,
//     backgroundColor: "#000000",
//     paddingBottom:16
//   },
//   header:{
//     backgroundColor: "#1565c0",
//     borderTopLeftRadius: 4,
//     borderTopRightRadius: 4,
//     padding:16
//   },
//   headerTextYear:{
//     color:"#FFFFFF",
//     fontSize:18,
//     opacity:.6
//   },
//   headerTextDate:{
//     color:"#FFFFFF",
//     fontSize:36,
//     lineHeight:40
//   },
//   buttons:{
//     flex:0,
//     flexDirection:"row",
//     justifyContent:"flex-end",
//     paddingRight:24
//   }
// });

// const materialStyles = new StyleSheet.create({
// 	...defaultStyles
// });
// const materialDarkStyles = new StyleSheet.create({
// 	...defaultStyles
// });