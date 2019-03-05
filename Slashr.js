import React from 'react';
import { observer, inject } from 'mobx-react';
import { set as mobxSet, configure as mobxConfig, decorate, observable, action } from "mobx";
//import { SlashrRouter } from './core/SlashrRouter';
//import { SlashrUi } from './Ui';
import { SlashrUtils } from './Utils';

// import { throws } from 'assert';
// import { parse } from 'url';

// import { decorate, observable, action, computed } from "mobx";
//import { CSSTransition } from 'react-transition-group';

if (process.env.NODE_ENV === "development") {
	mobxConfig({
		enforceActions: "observed",
	});
}

export class Slashr {
	static ANIMATE = "animate";
	static FADE_IN = "fadeIn";
	static FADE_OUT = "fadeOut";
	static FADE_TO = "fadeTo";
	static TRANSITION = "transition";
	static ROTATE = "rotate";
	static DELAY = "delay";
	static SCROLL_TO = "scrollTo";
	static REPLACE_CLASS = "replaceClass";
	static EASE_IN = "easeIn";
	static EASE_OUT = "easeOut";
	static EASE_IN_OUT = "easeInOut";
	constructor() {
		//console.log("TODO: Test home much memory store uses....");
		this._metadata = {
			config: {},
			app: null
		};
		//this.ui = new SlashrUi(this);
		this.utils = new SlashrUtils();
		//this.router = new SlashrRouter(this);
	}
	static get utils() {
		return new SlashrUtils();
	};
	// static createApp(options) {
	// 	let slashr = Slashr.getInstance();
	// 	if (slashr.app) throw ("Slashr Error: App already initialized.");
	// 	slashr.app = new SlashrApp(slashr, options);
	// 	return slashr.app;
	// };
	// Connects commpontent as app observer
	static connect(component) {
		return inject("app", "slashr")(observer(component));
	}
	// static get ui() {
	// 	let slashr = Slashr.getInstance();
	// 	slashr.ui;
	// };
	static getInstance() {
		if(global){
			if (!global._slashr) global._slashr = new Slashr();
			return global._slashr;
		}
		else{
			if (!window._slashr) window._slashr = new Slashr();
			return window._slashr;
		}
		
	}
	static get instance() {
		return Slashr.getInstance();
	}
	static get Actions() {
		return SlashrActions;
	}
	static get Domain() {
		return SlashrDomain;
	}
	static listen(domain, props = {}) {
		domain.prototype.__slashrMemberStateProps = props;
		decorate(domain, props);
	}
	// setConfig(config) {
	// 	this._metadata.config = config;
	// }
	get app() {
		return this._metadata.app
	}
	set app(app) {
		this._metadata.app = app;
		return this;
	}
	get config() {
		return this.app.config
	}
}
decorate(Slashr, {
	_metadata: observable
});


class SlashrActions {
	constructor(routerPortal, domain) {
		this.result = this.rslt = new SlashrActionsResultFactory();
		this._routerPortal = routerPortal;
	}
	get model() {
		return Slashr.getInstance().app.mdl;
	}
	get mdl() {
		return this.model;
	}
	get router() {
		return Slashr.getInstance().router;
	}
	get rtr() {
		return this.router;
	}
	get route() {
		return {
			portal: this._routerPortal.name
		};
	}
	get rt() {
		return this.route;
	}
}
class SlashrActionsResultFactory {
	component(component) {
		return new SlashrActionsComponentResult(component);
	}
}
class SlashrActionsComponentResult {
	constructor(component) {
		this._metadata = {
			component: component
		};
		this.props = {};

	}
	render() {
		let Component = this._metadata.component;
		return React.cloneElement(<Component />, this.props);
	}
}

export class SlashrDomain {
	__slashrDomainState = null;
	constructor() {
		this.__createArrProxy = this.__createArrProxy.bind(this);
		this.__stateArrPush = this.__stateArrPush.bind(this);
		this.__stateArrRemove = this.__stateArrRemove.bind(this);
		this.isUpdatingState  = false;
		// console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
		// let methods = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
		// for(let name in methods){
		// 	// if(! methods[name].get) continue;
		// 	let doBindAction = false;
		// 	console.log(name,methods[name]);

		// 	if(methods[name].get && methods[name].get.toString().indexOf("this.setState") !== -1){
		// 		throw("Slashr Domain Error: set state in get");
		// 	}
		// 	else if(methods[name].set && methods[name].set.toString().indexOf("this.setState") !== -1){
		// 		//throw("Slashr Domain Error: set state in set");
		// 		console.log("Setting found for slashr domain, should be set as action?");
		// 	}
		// 	else if(! methods[name].get && ! methods[name].set){

		// 		let method = this[name];
		// 		if (!(method instanceof Function) || method === this) continue;
		// 		if(method.toString().indexOf("this.setState") !== -1){
		// 			this[name] = action(this[name]);
		// 			console.log("FOUND SET STATE!!!!!!!!!!", this[name]);
		// 		}
		// 	}
		// }
		

	}

	get model() {
		return Slashr.getInstance().app.mdl;
	}
	get mdl() {
		return this.model;
	}
	get router() {
		return Slashr.getInstance().app.router;
	}
	get rtr() {
		return this.router;
	}
	get utilities() {
		return Slashr.getInstance().app.utils;
	}
	get utils() {
		return this.utilities;
	}
	setState(values) {
		this.isUpdatingState = true;
		let memberStateProps = this.__slashrMemberStateProps ? this.__slashrMemberStateProps : {};
		for (let name in values) {
			if (name in memberStateProps) this[name] = values[name];
			else if (this.__slashrDomainState) {
				this.__slashrDomainState[name] = values[name];
				this.__initStateUpdate(values);
			}
		}
		this.isUpdatingState = false;
	}
	get state() {
		return this.getState();
	}
	__createArrProxy(prop) {
		if (!prop in this.__slashrDomainState) return null;
		if (!Array.isArray(this.__slashrDomainState[prop])) return null;
		return new Proxy(this, {
			get: function (obj, arrProp) {
				let arr = obj.__slashrDomainState[prop];
				switch (arrProp) {
					case "push":
						return obj.__stateArrPush(prop);
						break;
					default:
						return arr[arrProp];
				}
			}
		});
	}
	__stateArrRemove(prop, val) {
		return action((val) => {
			if (!prop in this.__slashrDomainState) return false;
			return this.__slashrDomainState[prop].remove(val);
		})

	}
	__stateArrPush(prop) {
		return action((val) => {
			if (!prop in this.__slashrDomainState) this.__slashrDomainState[prop] = [val];
			return this.__slashrDomainState[prop].push(val);
		})

	}
	getState() {
		return new Proxy(this, {
			get: function (obj, prop) {
				if (prop in obj.__slashrDomainState) {
					// if(Array.isArray(obj.__slashrDomainState[prop])) return obj.__createArrProxy(prop);
					// return obj.__slashrDomainState[prop];
					return obj.__slashrDomainState[prop];
				}
				else return null;
			}
		});
	}

	__initStateUpdate(state){
		// 
		return;
		for (let name in state) {
			if(Array.isArray(state[name])){
				this.__slashrDomainState[name].intercept(change => {
					if(! this.isUpdatingState){
						change.object = [...change.object];
					}
					console.log("intercept",this.isUpdatingState, change);
					return change;
				});
			}
		}
	}

	set state(state) {
		// console.log(this,"set state",state);
		if (this.__slashrDomainState) throw ("State has already been set.");
		this.__slashrDomainState = observable(state);
		this.__initStateUpdate(state);
		
		// const disposer = intercept(this.__slashrDomainState, change => {
		// 	console.log("intercept set state",this.isUpdatingState, change);
		// 	return change;
		// });
	}
}
decorate(SlashrDomain, {
	// __slashrDomainState: observable,
	setState: action,
	stateArrayPush: action,
	stateArrayRemove: action
	// getState: action
});


export class frak {
	constructor(err) {
		throw (err);
	}
}
export default Slashr.getInstance();