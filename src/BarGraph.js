import React from 'react';
import { Animated, Keyboard, Platform, View, StyleSheet, Text, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, UIManager, findNodeHandle } from 'react-native';
import { Slashr } from "./Slashr";

export const BarGraph = Slashr.connect(
    class BarGraph extends React.Component {
        constructor(props) {
            super(props);
            this.axis = { x: {}, y: {} };
            // this.renderSuggestion = this.renderSuggestion.bind(this);
            // this.handleElementEvent = this.handleElementEvent.bind(this);

            // this.handleLayoutChange = this.handleLayoutChange.bind(this);
            // this.suggestionKeyExtractor = this.suggestionKeyExtractor.bind(this);
            // this.suggestionsRef = null;
            // this.suggestionsAnim = new Animated.Value(0);
            // this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', this.keyboardHideListener.bind(this));
            // this.keyboardShowListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', this.keyboardShowListener.bind(this));
            // this.keyboardHeight = 0;
            // this.elmt = this.props.element;
            // this.elmt.addEventListener("change", this.handleElementEvent);
            // this.elmt.addEventListener("blur", this.handleElementEvent);
            // this.elmt.addEventListener("focus", this.handleElementEvent);
            // this.init();
        }
        init() {
            let data = this.props.data || [];
            let min = this.props.axisYMinimum || 0;
            let max = this.props.axisYMaximum || 0;
            let interval = this.props.axisYInterval || 0;
            let tickCount = this.props.axisYTickCount || 0;

            // Get the max
            data.forEach((point) => {
                if (point.value > max) max = point.value;
            });


            if (!interval) {
                // Add some padding to max
                max = max + (max * .1);
                if (!tickCount) tickCount = 5;
                interval = Math.ceil(max / tickCount);
            }
            else throw ("SLDKJFSLDKJFLKJF");

            this.axis.y = {
                min: min,
                max: max,
                interval: interval,
                tickCount: tickCount,
            };
            this.data = data.map((point)=>{
                point.anim = new Animated.Value(0);
                return point;
            });
            this.lineAnimations = [];

        }
        componentDidMount() {
            this.animate();
            // this.update();
            //console.log("MOUNT!!!!!!");
        }

        componentDidUpdate(prevProps) {
            
            this.animate();
        }
        // keyboardHideListener() {
        //     this.keyboardHeight = 0;
        //     this.handleLayoutChange();
        // }
        // keyboardShowListener(event) {
        //     this.keyboardHeight = event.endCoordinates.height;
        //     this.handleLayoutChange();
        // }
        // handleLayoutChange() {
        //     if (!this.suggestionsRef) return;
        //     this.suggestionsRef.measure((fx, fy, width, height, px, py) => {
        //         let window = Dimensions.get('window');
        //         let totalHeight = py + height;
        //         let maxHeight = null;
        //         let viewHeight = window.height - this.keyboardHeight;
        //         if (totalHeight > viewHeight) {
        //             maxHeight = height - (totalHeight - viewHeight) - 16;
        //         }
        //         this.elmt.setState({
        //             suggestionsMaxHeight: maxHeight
        //         });
        //     })
        // }
        // async suggestionLoader() {
        //     if (!this.props.suggestionLoader) return [];
        //     let suggestions = await this.props.suggestionLoader(this.elmt.value || "");
        //     this.elmt.setState({
        //         suggestions: suggestions,
        //         hasSuggestions: (suggestions.length ? true : false)
        //     });
        //     this.animate();
        // }
        // handleElementEvent(type) {
        //     switch (type) {
        //         case "change":
        //             this.suggestionLoader();
        //             break;
        //     }
        // }
        // renderSuggestion(suggestion) {
        //     if (!this.props.renderSuggestion) throw ("Input Error: renderSuggestions required");
        //     let ret = this.props.renderSuggestion(suggestion, this.elmt, this.elmt.form);
        //     return ret;
        // }
        // suggestionKeyExtractor(suggestion) {
        //     if (!this.props.suggestionKeyExtractor) throw ("Input Error: suggestionKeyExtractor required");
        //     let ret = this.props.suggestionKeyExtractor(suggestion);
        //     return ret;
        // }
        // handlePress(suggestion) {
        //     if (!this.props.onSelectSuggestion) throw ("Input Error: onSelectSuggestion required");
        //     this.props.onSelectSuggestion(suggestion, this.elmt, this.elmt.form);
        // }
        animate() {
            this.data.forEach((line)=>{
                Animated.timing(line.anim, {
                    toValue: 1,
                    duration: 1000
                }).start();
            });
            
        }
        // get doShow() {
        //     return this.elmt.state.hasSuggestions && this.elmt.focus;
        // }
        render() {
            this.init();
            let styles = this.styles;
            
            // if (this.elmt.state.suggestionsMaxHeight) suggestionsStyle.maxHeight = this.elmt.state.suggestionsMaxHeight;
            
            let axisYTicks = [];
            let tickVal = this.axis.y.min;
            for(let t = 0; t <= this.axis.y.tickCount; t++){
                axisYTicks.push({
                    value: tickVal
                });
                tickVal += this.axis.y.interval;
            }

            console.log("ticks",axisYTicks);



            
            return (
                <ScrollView>
                    <View
                        style={styles.graph}
                    >
                        <View style={styles.row}>
                            <View style={styles.axisXLabels}>
                                {this.data.map((point, i) => {
                                    return (
                                        <View style={styles.axisXLabel} key={`axisXLabel${i}`}>
                                            <Text style={styles.axisXLabelText}>{point.label}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={styles.lines}>
                                {axisYTicks.map((tick, i) => {
                                    let style = [styles.axisYTickLine];
                                    let widthPct = tick.value ? parseInt((tick.value / this.axis.y.max) * 100) : 0;
                                    console.log("tick line left",widthPct);
                                    style.push({
                                        left: `${widthPct}%`
                                    });
                                    return (
                                        <View 
                                            style={style}
                                            key={`axisYTickLine${i}-${widthPct}`}
                                        />
                                    );
                                })}
                                {this.data.map((point, i) => {
                                    
                                    let widthPct = point.value ? parseInt((point.value / this.axis.y.max) * 100) : 0;
                                    let lineStyle = [styles.line];
                                    //console.log(point.anim);
                                    lineStyle.push({
                                        width: point.anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', `${widthPct}%`],
                                        })
                                    });
                                    return (
                                        <Animated.View
                                            key={`axisYLine${i}-${widthPct}`}
                                            style={lineStyle}
                                        />
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </ScrollView>



            );
        }
        get styles() {
            let theme = this.props.app.ui.theme;
            let color = theme.color;
            return new StyleSheet.create({

                graph: {
                    
                    flex: 1,
                    margin:16,
                    flexDirection: "column",
                    justifyContent: "space-evenly"
                },
                row: {
                    flex: 0,
                    flexDirection: "row"
                },
                axisYTickLine:{
                    flex:1,
                    position:"absolute",
                    top: 0,
                    bottom:0,
                    width:1,
                    backgroundColor: color.utils.rgba(color.onBackground,.1),
                    // height:"100%"
                },
                axisXLabels:{
                    paddingRight:12
                },
                axisXLabel:{
                    height:24,
                    marginBottom: 8,
                    
                },
                axisXLabelText:{
                    lineHeight:24,
                    color: color.onBackground,
                    fontSize:12
                },
                lines:{
                    flex:1
                },
                line: {
                    position:"relative",
                    flex: 1,
                    flexGrow: 1,
                    backgroundColor: color.primary,
                    height: 24,
                    marginBottom: 8
                }
            });
        }
    }
);
export default BarGraph;