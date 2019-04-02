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

            if(this.props.axisYTrendLines){
                this.props.axisYTrendLines.map((point) => {
                    if (point.value > max) max = point.value;
                });
            }

            if (!interval) {
                // Add some padding to max
                // max = Math.ceil(max + (max * .1));
                if (!tickCount) tickCount = 5;
                // Make sure interval has last tick
                interval = Math.ceil(max / tickCount);
            }

            // Calculate the tickcount based on interval and max
            let hasTicks = (interval && max) ? false : true;
            let tickVal = min;
            tickCount = 0;
            while(! hasTicks){
                tickCount++;
                tickVal += interval;
                if(tickVal > max) hasTicks = true;
            }
            // Set max to the tickval
            max = tickVal;

            this.axis.y = {
                min: min,
                max: max,
                interval: interval,
                tickCount: tickCount,
            };
            this.data = data.map((point) => {
                point.anim = new Animated.Value(0);
                return point;
            });
            this.axisYTrendLines = this.props.axisYTrendLines || [];
            this.lineAnimations = [];

        }
        componentDidMount() {
            this.animate();
        }

        componentDidUpdate(prevProps) {
            this.animate();
        }
        animate() {
            this.data.forEach((line) => {
                Animated.timing(line.anim, {
                    toValue: 1,
                    duration: 1000
                }).start();
            });

        }
        render() {
            this.init();
            let styles = this.styles;
            let axisYTicks = [];
            let tickVal = this.axis.y.min;
            for (let t = 0; t <= this.axis.y.tickCount; t++) {
                axisYTicks.push({
                    value: tickVal
                });
                tickVal += this.axis.y.interval;
            }
            // Check if trendlines exist,
            // If bigger than max, set as max
            if(this.axisYTrendLines){
                this.axisYTrendLines.map((point) => {
                    axisYTicks.push({
                        value: point.value,
                        isTrendLine: true
                    });
                });
            }
            let axisXLabelTextStyle = [styles.axisXLabelText];
            if(this.props.axisXLabelTextStyle) axisXLabelTextStyle.push(this.props.axisXLabelTextStyle);

            let axisYLabelTextStyle = [styles.axisYLabelText];
            if(this.props.axisYLabelTextStyle) axisYLabelTextStyle.push(this.props.axisYLabelTextStyle);
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
                                            <Text style={axisXLabelTextStyle}>{point.label}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={styles.lines}>
                                {axisYTicks.map((tick, i) => {
                                    let style = [styles.axisYTick];
                                    let tickLineStyle = [styles.axisYTickLine];
                                    let nStyle = {};
                                    let label = " ";
                                    if(! tick.isTrendLine){
                                        label = i * this.axis.y.interval;
                                    }
                                    else{
                                        tickLineStyle.push(styles.axisYTrendLine);
                                    }
                                    let widthPct = tick.value ? parseInt((tick.value / this.axis.y.max) * 100) : 0;
                                    nStyle.left = `${widthPct}%`;
                                    style.push(nStyle);
                                    return (
                                        <View
                                            style={style}
                                            key={`axisYTick${i}-${widthPct}`}
                                        >
                                            <Text
                                                style={axisYLabelTextStyle}

                                            >
                                                {label}
                                            </Text>
                                            <View
                                                style={tickLineStyle}
                                                key={`axisYTickLine${i}-${widthPct}`}
                                            >

                                            </View>
                                            
                                        </View>
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
                    margin: 16,
                    marginTop: 40,
                    marginRight:32,
                    flexDirection: "column",
                    justifyContent: "space-evenly"
                },
                row: {
                    flex: 0,
                    flexDirection: "row"
                },
                axisYTick: {
                    flex: 1,
                    position: "absolute",
                    top: -24,
                    bottom: 8,
                    overflow: "visible"
                    // height:"100%"
                },
                axisYTickLine: {
                    flex: 1,
                    height:"100%",
                    width: 1,
                    backgroundColor: color.utils.rgba(color.onBackground, .1),
                    overflow: "visible"
                    // height:"100%"
                },
                axisYTrendLine: {
                    backgroundColor: color.utils.rgba(color.secondaryLight, .5),
                    zIndex:2
                },
                axisYLabelText: {
                    position:"relative",
                    left:"-50%",
                    lineHeight: 24,
                    color: color.utils.rgba(color.onBackground, .6),
                    fontSize: 10,
                },
                axisXLabels: {
                    paddingRight: 16
                },
                axisXLabel: {
                    height: 32,
                    marginBottom: 8,
                },
                axisXLabelText: {
                    width: "100%",
                    lineHeight: 32,
                    color: color.onBackground,
                    fontSize: 12,
                    textAlign:"right"
                },
                lines: {
                    flex: 1
                },
                line: {
                    position: "relative",
                    flex: 1,
                    flexGrow: 1,
                    backgroundColor: color.primary,
                    height: 32,
                    marginBottom: 8
                }
            });
        }
    }
);
export default BarGraph;