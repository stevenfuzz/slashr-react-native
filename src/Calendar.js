import React from 'react';
import {Slashr,SlashrDomain} from './Slashr';
import {Touchable} from './Touchable';
import { Calendar as CalendarCore } from 'slashr-react-core';
import {View, Text, StyleSheet} from 'react-native';
import { set as mobxSet, trace, decorate, observable, action} from "mobx";

export class Calendar extends CalendarCore {
	renderMonthHeader() {
		let styles = this.styles;
		let monthLabel = Slashr.utils.date.getMonthLabel(this.month);
		monthLabel = Slashr.utils.str.capitalize(monthLabel);
		let label = `${monthLabel} ${this.month.getFullYear()}`
		return (
			<View style={styles.monthLabel}>
				<Text style={styles.monthLabelText}>{label}</Text>
			</View>
		);
	}
	renderDaysHeader() {
		let ret = [];
		let styles = this.styles;
		for (let d = 0; d <= 6; d++) {
			ret.push(
				<View
					style={styles.cell}
					key={`${this.keyPrefix}}dh${d}`}
				>
					<Text style={styles.dayHeaderText}>{Slashr.utils.date.getDayLabel(d, Slashr.utils.date.LABEL_TYPE_SINGLE_LETTER)}</Text>
				</View>
			);
		}
		return ret;
	}
	get styles(){
		let styles = materialStyles;
		switch(this.props.theme){
			case "materialDark":
				styles = materialDarkStyles;
			break;
		}
		return styles;
	}
	renderDays() {
		let currDay = new Date(this.startDay);
		let weeks = [];
		let days = [];
		let today = new Date();
		let styles = this.styles;
		while (currDay <= this.endDay) {
			let d = currDay.getDay();
			let dayStyles = [styles.cell];
			let dayTextStyles =  [styles.cellText,styles.dayText];
			let onSelectDay = (this._onSelectDay) ? this.handleSelectDay.bind(this, new Date(currDay)) : null;
			if (currDay.getMonth() < this.month.getMonth()) dayTextStyles.push(styles.dayPreviousMonthText);
			else if (currDay.getMonth() > this.month.getMonth()) dayTextStyles.push(styles.dayNextMonthText);
			if (Slashr.utils.date.areDatesSameDay(currDay, today)){
				dayTextStyles.push(styles.dayTodayText);
				dayStyles.push(styles.dayToday);
			} 
			else if (currDay < today) dayTextStyles.push(styles.dayPastText);
			if (this.props.day && Slashr.utils.date.areDatesSameDay(currDay, this.props.day)){
				dayTextStyles.push(styles.daySelectedText);
				dayStyles.push(styles.daySelected);
			}
			days.push(
				<Touchable
					key={`${this.keyPrefix}}d${currDay.getDate()}`}
					onPress={onSelectDay}
				>
					<View
						style={dayStyles}
					>
						<View style={styles.dayLabel}>
							<Text style={dayTextStyles}>{currDay.getDate()}</Text>
						</View>
						<View style={styles.dayContent}>
							<Text>{this.dayRenderer(currDay)}</Text>
						</View>
					</View>
				</Touchable>
			);
			if (d === 6) {
				weeks.push(
					<View
						style={styles.week}
						key={`${this.keyPrefix}}d${weeks.length}`}
					>
						{days}
					</View>
				);
				days = [];
			}
			currDay.setDate(currDay.getDate() + 1);
		}
		return weeks;
	}
	render() {
		console.log("RENDER CALENDAR",this.props.day);
		let styles = this.styles;
		let classNames = ["calendar"];
		if (this.props.className) classNames.push(this.props.className);
		// let nextMonthButton = (!this._nextMonthButton) ? null : React.cloneElement(this._nextMonthButton, {
		// 	onPress: this.handleNextMonthButtonClick
		// });
		// let previousMonthButton = (!this._nextMonthButton) ? null : React.cloneElement(this._previousMonthButton, {
		// 	onPress: this.handlePreviousMonthButtonClick
		// });

		return (
			<View
				style={styles.calendar}
			>
				{/* {!this.isLoaded && this.loader &&
					<div className="calendar-loader">
						{this.loadingIndicator}
					</div>
				} */}
				<View style={styles.header}>
					{this.renderMonthHeader()}
					{/* {this.topRightActionButton &&
						<View style={styles.topRightActionButton}>
							{this.topRightActionButton}
						</View>
					} */}
				</View>
				<View style={styles.dayHeader}>
					{this.renderDaysHeader()}
				</View>
				<View style={styles.month}>
					<View style={styles.days}>
						{this.renderDays()}
					</View>
				</View>
			</View>
		);
	}
}

const defaultStyles = new StyleSheet.create({
	calendar: {
		width: 280,
		flex: 0,
		marginRight:"auto",
		marginLeft: "auto"
	},
	header: {
		flex:0,
		flexDirection:"row",
		justifyContent:"space-around",
		alignItems:"center",
		marginLeft:-4,
		marginRight:-4,
		marginBottom:-12,
	},
	dayHeader:{
		flex:0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems:"center"
	},
	dayHeaderText:{
		opacity:.6
	},
	week: {
		flex:0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems:"center",
	},
	cell:{
		borderRadius:20,
		height:40,
		width:40,
		flex:0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	cellText:{
		lineHeight: 20
	},
	dayToday:{
		backgroundColor:"rgba(0,0,0,.1)"
	},
	dayText:{

	},
	dayPreviousMonthText:{
		opacity:.3
	},
	dayNextMonthText:{
		opacity:.3
	},
	monthLabel:{
		height:64
	},
	monthLabelText:{
		fontWeight:"500",
		lineHeight:64
	},
	daySelected:{
		backgroundColor: "#1565c0"
	},
	daySelectedText:{
		color: "#FFFFFF"
	}
	
});

const materialStyles = new StyleSheet.create({
	...defaultStyles
});
const materialDarkStyles = new StyleSheet.create({
	...defaultStyles
});