import { Slashr } from 'slashr-react-core';
import { slashrDatabaseInstanceFactory } from 'slashr-core';
import SlashrDatabaseSqliteAdapter from './SlashrDatabaseSqliteAdapter';

export default class SlashrDatabaseInstanceFactory extends slashrDatabaseInstanceFactory{
	factory(key){
		let config = Slashr.instance.config;
		if(! config.database) throw("Database config not found.");
		switch(config.database.adapter){
			case "sqlite":
				return new SlashrDatabaseSqliteAdapter(config.database);
				break;
			default:
				throw("Database adapter '"+config.database.adapter+"' not found.");
		}
	}
}