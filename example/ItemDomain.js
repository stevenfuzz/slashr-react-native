import { Slashr } from "slashr-react-native";

export class ItemDomain extends Slashr.Domain{
    // Static Properties
    TYPE_CALORIES = 1;
    TYPE_STEPS = 2;
    TYPE_SLEEP = 3;
    TYPE_WATER = 4;
    TYPE_WEIGHT = 5;
    types = {
        calories: {
            id: this.TYPE_CALORIES,
            key: "calories",
            title: "Calories",
            unit: false,
            widgetSize: "large"
        },
        steps: {
            id: this.TYPE_STEPS,
            key: "steps",
            title: "Steps",
            unit: false,
            widgetSize: "small"
        },
        sleep: {
            id: this.TYPE_SLEEP,
            key: "sleep",
            title: "Sleep",
            unit: "hrs",
            widgetSize: "small"
        },
        water: {
            id: this.TYPE_WATER,
            key: "water",
            title: "Water",
            unit: "cups",
            widgetSize: "small"
        },
        weight: {
            id: this.TYPE_WEIGHT,
            key: "weight",
            title: "Weight",
            unit: "lbs",
            widgetSize: "small",
            interval: "latest"
        }
    }; 
    getTypes(){
        return this.types;
    }
    getTypeById(id){
        // Make sure id is of type int
        id = parseInt(id);
        for(let key in this.types){
            if(this.types[key].id === id) return this.types[key];
        }
        return null;
    }
    getTypeByKey(key){
       if(this.types[key]) return this.types[key];
       else return null;
    }
    async get(id){
        // Init an item entity by id
        let item = await this.ent.items(id);
        return item.extract({camelCase: true});
    }
    async delete(id){
        // Delete an item entity by id
        let item = await this.ent.items(id);
        return await item.delete();
    }
    async update(values){
        // Update or create an item entity by values
        let item = await this.ent.items(values.id || null);
        let currDate = new Date();
        let date = new Date(values.date);
        item.title = values.title;
        item.value = values.value || 0;
        // If the item is new, generate a uid, set type and date
        if(item.isNew()){
            item.type = values.type;
            item.uid = Slashr.utils.auth.generateUuid();
            // If date is today, use it, otherwise set to end of day
            if(this.utils.date.areDatesSameDay(currDate, values.date)) item.date = currDate;
            else{
                // Set to end of day...
                date.setHours(23,59,59,998);
                item.date = date;
            }
        }
        else{
            item.dateUpdated = currDate;
        }
        await item.save();
        // Extract entity and return for display / usage
        return item.extract();
    }
    async getSuggestions(type, value){
        let qry = this.db.qry();
        let whr = qry.exp();
        let bind = {
            type: type.id
        }
        whr.eq("type",":type");
        if(value){
            // Find and titles that start with the given value
            whr.like("title",":title%");
            bind.title = value;
        }
        // Order results by number of times used, group by title and value
        let rslt = await qry.select(["MAX(id) as id","title","value"]).
                    from("items").
                    where(whr).
                    bind(bind).
                    groupBy(["title","value"]).
                    orderBy([
                        ["COUNT(id)","DESC"],
                        ["date","DESC"]
                    ]).
                    run();
        return rslt.toArray();
    }
}

export class ItemListDomainInstances extends Slashr.DomainInstances{
    constructor(){
        super();
        // Set the global list item instance date
        this.state = {
            date: new Date()
        };
    }
    async init(){
        for(let key in this.dm.item.getTypes()){
            this.create(key);
        }
        await this.update();
    }
    async update(){
        let qry = this.db.qry();
        let startDate = new Date(this.state.date);
        let endDate = new Date(this.state.date);
        // Get day range
        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);
        let whr = qry.exp();
        let bind = {
            startDate: startDate,
            endDate: endDate
        }
        whr.btw("date",":startDate",":endDate");
        // Get updated items
        let rslt = await qry.select().
                            from("items").
                            where(whr).
                            bind(bind).
                            run();
        let items = {}; 
        // Create list map
        rslt.forEach((item)=>{
            if(! items[item.type]) items[item.type] = [];
            items[item.type].push(item);
        });
        // Reset instances
        this.forEach((type)=>{
            type.reset();
        });
        // Add new items
        for(let id in items){
            let type = this.dm.item.getTypeById(id);
            this.getInstance(type.key).setItems(items[id]);
        }
    }
    get date(){
        return this.state.date;
    }
    setDate(date){
        if(date.getTime() !== this.date.getTime()){
            this.setState({
                date: date
            });
            this.update();
        }
        return this;
    }
    create(name, filters = {}){
        // Create a new instance based on type
        let itemList = new ItemListDomain(filters);
        this.addInstance(name, itemList);
        return itemList;
    }
}

export class ItemListDomain extends Slashr.Domain{
	constructor(props) {
        super();
        this.state = {
            items: [],
            total: 0,
        }
    }
    reset(){
        this.setItems([]);
    }
    addItem(item){
        // TODO: Add items to list without sync'ing database
        // TODO: SqlLite seams fast enough that this doesn't matter for now
    }
    setItems(items){
        let total = 0;
        // Update the total
        items.forEach((item)=>{
            total += item.value;
        });
        this.setState({
            items: items,
            total: total
        });
    }
    get items(){
        return this.state.items;
    }
    get total(){
        return this.state.total;
    }
}