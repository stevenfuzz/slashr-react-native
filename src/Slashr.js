import React from 'react';
import { Slashr as SlashrCore } from 'slashr-react-core';
import { observer, inject } from 'mobx-react';

class SlashrWrappedComponent{
    
}
export class Slashr extends SlashrCore{
    static connect(Component) {
		// class wrapped extends component{
		// 	render(){
		// 		throw("wrapped");
		// 	}
		// }
        // let wrappedComponent = new wrapped();
        
        const SlashrWrappedComponent = class SlashrWrappedComponent extends Component{
            constructor(props){
                super(props);
                if(this.props.navigation){
                    if(this.componentWillFocus){
                        this.componentWillFocus = this.componentWillFocus.bind(this);
                        this._slashrWillFocusListener = this.props.navigation.addListener(
                            'willFocus',
                            this.componentWillFocus
                        );
                    }
                    if(this.componentDidFocus){
                        this.componentDidFocus = this.componentDidFocus.bind(this);
                        this._slashrDidFocusListener = this.props.navigation.addListener(
                            'didFocus',
                            this.componentDidFocus
                        );
                    }
                    if(this.componentWillBlur){
                        this.componentWillBlur = this.componentWillBlur.bind(this);
                        this._slashrWillBlurListener = this.props.navigation.addListener(
                            'willBlur',
                            this.componentWillBlur
                        );
                    }
                    if(this.componentDidBlur){
                        this.componentDidBlur = this.componentDidBlur.bind(this);
                        this._slashrDidBlurListener = this.props.navigation.addListener(
                            'didBlur',
                            this.componentDidBlur
                        );
                    }
                }
            }
            componentWillUnmount(){
                super.componentWillUnmount();
                if(this._slashrWillFocusListener) this._slashrWillFocusListener.remove();
                if(this._slashrDidFocusListener) this._slashrDidFocusListener.remove();
                if(this._slashrWillBlurListener) this._slashrWillBlurListener.remove();
                if(this._slashrDidBlurListener) this._slashrDidBlurListener.remove();
             }
            render(){
                let slashr = Slashr.getInstance();
                slashr.rendering = true;
                let ret = super.render();
                slashr.rendering = false;
                return ret;
            }
        }

        return inject("app", "slashr")(observer(SlashrWrappedComponent));

		// Component.prototype._slashrRender = Component.prototype.render;
		// Component.prototype.render = function(){
        //     let slashr = Slashr.getInstance();
        //     if(this.props.navigation){
        //         if(this.componentWillFocus){
        //             this.componentWillFocus = this.componentWillFocus.bind(this);
        //             this.props.navigation.addListener(
        //                 'willFocus',
        //                 this.componentWillFocus
        //             );
        //         }
        //         if(this.componentDidFocus){
        //             this.componentDidFocus = this.componentDidFocus.bind(this);
        //             this.props.navigation.addListener(
        //                 'didFocus',
        //                 this.componentDidFocus
        //             );
        //         }
        //         if(this.componentWillBlur){
        //             this.componentWillBlur = this.componentWillBlur.bind(this);
        //             this.props.navigation.addListener(
        //                 'willBlur',
        //                 this.componentWillBlur
        //             );
        //         }
        //         if(this.componentDidBlur){
        //             this.componentDidBlur = this.componentDidBlur.bind(this);
        //             this.props.navigation.addListener(
        //                 'didBlur',
        //                 this.componentDidBlur
        //             );
        //         }
        //     }
		// 	slashr.rendering = true;
		// 	let ret = this._slashrRender();
		// 	slashr.rendering = false;
		// 	return ret;
		// }
		// let ref = React.createRef();

		// let componentWillFocus = Component.prototype.componentWillFocus ? true : false;
		// Component = inject("app", "slashr")(observer(Component));
		// // console.log("keyksysksy",Object.keys(Component));
        // //return Component;
        
		// let newComponent = props => {
		// 	if(props.navigation && componentWillFocus){
		// 		//console.log("PROPS NAVIGATION FOCUSED!!!!!!!!");
		// 		props.navigation.addListener(
		// 			'willFocus',
		// 			()=>{
		// 				ref.current.wrappedInstance.componentWillFocus();
		// 				//console.log("component will forcus",Object.keys(ref.current.wrappedInstance));
		// 			}
		// 		  );
		// 	}
		// 	return <Component {...props} ref={ref}/>;
		// };
		// return newComponent;
	}
}