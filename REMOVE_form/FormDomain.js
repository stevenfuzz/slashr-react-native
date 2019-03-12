export default class FormDoamin{
    constructor(props){
        if(! props.name) throw("Form must have a name.");
        this._props = props;
    }
    get name(){
        return this._props.name;
    }
    addElement(props){
        console.log("Form",this.name, props);
    }
}