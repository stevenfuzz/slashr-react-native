import React from 'react';
import {Slashr,SlashrDomain} from './Slashr';
import {Touchable} from './Touchable';
import { Calendar as CalendarCore } from 'slashr-react-core';
import {View, Text, StyleSheet, FlatList, Dimensions,Animated} from 'react-native';
import {Calendar} from './Calendar';
import { set as mobxSet, trace, decorate, observable, action} from "mobx";

export const DatePicker = Slashr.connect(
	class DatePicker extends React.Component{
		constructor(props){
			super(props);

			this.datePicker = this.props.datePicker || this.props.app.ui.datePicker.create(this.props);


			this.startDate = null;
			this.endDate = null;
			this.itemIndex = 0;
			this.flatListRef = React.createRef();
			this.renderItem = this.renderItem.bind(this);
			this.handleSelectDay = this.handleSelectDay.bind(this);
			this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(this);
			this.handlePreviousMonthButtonPress = this.handlePreviousMonthButtonPress.bind(this);
			this.handleNextMonthButtonPress = this.handleNextMonthButtonPress.bind(this);
			this.handleScrollBeginDrag = this.handleScrollBeginDrag.bind(this);
			this.handleScrollEndDrag = this.handleScrollEndDrag.bind(this);
			if(this.props.width){
				this.dimensions = {width:this.props.width}
			}
			else this.dimensions = Dimensions.get('window');
			// this.date = new Date();
			this.initialScrollIndex = 0;
			this.styles = this.getStyles();
			this.isScrolling = false;
			
			this.viewabilityConfig = {
				waitForInteraction: true,
				viewAreaCoveragePercentThreshold: 50
			}
			this.initialize();
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
		initialize(){
			this.createCalendarRange();
			this.monthNextButtonAnim = new Animated.Value(this.hasNext ? 1 : 0);
			this.monthPreviousButtonAnim = new Animated.Value(this.hasPrevious ? 1 : 0);
		}
		updateMonthButtons(){
			Animated.timing(this.monthNextButtonAnim, {
                toValue: (this.hasNext && ! this.isScrolling) ? 1 : 0,
                duration: 200
            }).start();
            Animated.timing(this.monthPreviousButtonAnim, {
                toValue: (this.hasPrevious && ! this.isScrolling) ? 1 : 0,
                duration: 200
            }).start();
		}
		get hasNext(){
			let date = new Date(this.calendarRange[this.itemIndex].date);
			
			if(date < this.endDate) return true;
			else return false;
		}
		get hasPrevious(){
			let date = new Date(this.calendarRange[this.itemIndex].date);
			if(date > this.startDate) return true;
			else return false;
		}
		handleScrollBeginDrag(){
			this.isScrolling = true;
			this.updateMonthButtons();
		}
		handleScrollEndDrag(){
			this.isScrolling = false;
			this.updateMonthButtons();
		}
		handleViewableItemsChanged(info){
			// Should only be 1 item
			if(info.viewableItems.length) this.itemIndex = info.viewableItems[0].index;
			this.updateMonthButtons();
		}
		createCalendarRange(){
			let date = new Date(this.props.date);
			let startDate = null;
			if(this.props.startDate) startDate = this.props.startDate;
			else{
				startDate = this.props.startDate || new Date(date.getTime());
				startDate.setMonth(startDate.getMonth()-1);
			}
			let endDate = null;
			if(this.props.endDate) endDate = this.props.endDate;
			else{
				startDate = this.props.endDate || new Date(date.getTime());
				endDate.setMonth(endDate.getMonth()+1);
			}
			this.calendarRange = [];
			this.startDate = startDate;
			this.endDate = endDate;
			
			let cDate = new Date(this.startDate.getTime());
			while(cDate <= endDate){
				this.calendarRange.push({
					date: cDate.getTime()
				});
				if(cDate.getMonth() === date.getMonth() && cDate.getFullYear() === date.getFullYear()){
					this.itemIndex = this.initialScrollIndex = this.calendarRange.length - 1;
				}
				cDate.setMonth(cDate.getMonth() + 1);
			}
			
		}
		handleSelectDay(date){
			this.datePicker.setDate(date);
		}
		renderItem({item}){
			let day = null;
			let month = new Date(item.date);
			if(month.getMonth() === this.datePicker.date.getMonth() && month.getFullYear() === this.datePicker.date.getFullYear()) day = this.datePicker.date;
			return (
				<View style={[this.styles.calendar,{width: this.dimensions.width}]}>
					<Calendar
						{...this.props} 
						day={day}
						month={month} 
						onSelectDay={this.handleSelectDay}
				 	/>
				</View>
			);
		}
		handlePreviousMonthButtonPress(){
			let currIndex = this.itemIndex;
			if(currIndex <= 0) return false;
			currIndex--;
			this.itemIndex = currIndex;
			this.flatListRef.scrollToIndex({animated: true, index: currIndex});
		}
		handleNextMonthButtonPress(){
			let currIndex = this.itemIndex;
			if(currIndex >= (this.calendarRange.length- 1)) return false;
			currIndex++;
			this.itemIndex = currIndex;
			this.flatListRef.scrollToIndex({animated: true, index: currIndex});
		}
		render() {
			let nextMonthButton = this.props.nextMonthIcon || <Text>&gt;</Text>;
			let previousMonthButton = this.props.previousMonthIcon || <Text >&lt;</Text>;
			let monthButtonStyles = [this.styles.monthButton]
			let styles = this.styles;
			let date = this.datePicker.date;


			let monthNextButtonStyles = {
				...styles.monthButton,
				...styles.monthNextButton,
				opacity: this.monthNextButtonAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [.2, .6],
				}),
			}
			let monthPreviousButtonStyles = {
				...styles.monthButton,
				...styles.monthPreviousButton,
				opacity: this.monthPreviousButtonAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [.2, .6],
				}),
			}

			return (
				<View>
					
					<FlatList
						ref={(ref) => { this.flatListRef = ref; }}
						data={this.calendarRange}
						initialScrollIndex={this.initialScrollIndex}
						renderItem={this.renderItem}
						keyExtractor={(item) => `${item.date}`}
						onScrollBeginDrag={this.handleScrollBeginDrag}
						onScrollEndDrag={this.handleScrollEndDrag}
						initialNumToRender={2}
						horizontal
						directionalLockEnabled
						showsHorizontalScrollIndicator={false}
						// snapToAlignment="center"
						// decelerationRate="fast"
						// snapToInterval={1}
						onViewableItemsChanged={this.handleViewableItemsChanged}
						viewabilityConfig = {this.viewabilityConfig}
						pagingEnabled
						getItemLayout={(data, index) => ({
							length: this.dimensions.width,
							index,
							offset: this.dimensions.width * index
						})}
					/>
						<Touchable
							onPress={this.handlePreviousMonthButtonPress}	
						>
							<Animated.View style={monthPreviousButtonStyles}>
								{previousMonthButton}
							</Animated.View>
						</Touchable>
						<Touchable
							onPress={this.handleNextMonthButtonPress}	
						>
							<Animated.View style={monthNextButtonStyles}>
								{nextMonthButton}
							</Animated.View>
						</Touchable>
				</View>
				
				
			);
		}
	}
);

const defaultStyles = new StyleSheet.create({
	monthButton:{
		position:"absolute",
		left:"50%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius:24,
		opacity:.6,
		height:64,
		width:64
	},
	monthNextButton: {
		transform: [
			{ translateX: +88 },
		],
	},
	monthPreviousButton: {
		transform: [
			{ translateX: -152 },
		],
	},
	
});

const materialStyles = new StyleSheet.create({
	...defaultStyles
});
const materialDarkStyles = new StyleSheet.create({
	...defaultStyles
});