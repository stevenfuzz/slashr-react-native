import { Slashr, SlashrApp as SlashrAppCore } from 'slashr-react-core';
import SlashrDatabaseInstanceFactory from './model/SlashrDatabaseInstanceFactory';
import { slashrEntityAbstractFactory } from 'slashr-core';
import { NavigationActions } from 'react-navigation';

export class SlashrApp extends SlashrAppCore{
    constructor(options){
        super(options);
        if(Slashr.instance.config.database){
            this.mdl.db = this.mdl.database = new SlashrDatabaseInstanceFactory(Slashr.instance);
            this.mdl.ent = this.mdl.entity = new slashrEntityAbstractFactory(Slashr.instance);
        }
        //this._metadata.navigation = new SlashrAppNavigator(options.navigator);
    }
    get database(){
        return this.mdl.db;
    }
    get db(){
        return this.database;
    }
    get entity(){
        return this.mdl.entity;
    }
    get ent(){
        return this.entity;
    }
    get navigation(){
        return this._metadata.navigation;
    }
    get nv(){
        return this.navigation;
    }
}

class SlashrAppNavigator{
    constructor(navigator){
        this._navigator = navigator;
       
    }
    setTopLevelNavigator(navigatorRef) {
      //  console.log("set navigator",navigatorRef.navigate);
      this._navigator = navigatorRef;
    }
    navigate(routeName, params) {
      this._navigator.dispatch(
        NavigationActions.navigate({
          routeName,
          params,
        })
      );
    }
}