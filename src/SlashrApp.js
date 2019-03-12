import { Slashr, SlashrApp as SlashrAppCore } from 'slashr-react-core';
import SlashrDatabaseInstanceFactory from './model/SlashrDatabaseInstanceFactory';
import { slashrEntityAbstractFactory } from 'slashr-core';

export class SlashrApp extends SlashrAppCore{
    constructor(options){
        super(options);
        if(Slashr.instance.config.database){
            this.mdl.db = this.mdl.database = new SlashrDatabaseInstanceFactory(Slashr.instance);
            this.mdl.ent = this.mdl.entity = new slashrEntityAbstractFactory(Slashr.instance);
        }
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
}