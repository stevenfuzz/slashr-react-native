import React from 'react';
import { Slashr } from "../Slashr";
export const HiddenInput = Slashr.connectForm(
    class HiddenInput extends React.Component {
        constructor(props){
            super(props);
            this.elmt = this.props.form.addElement(props);
        }
        componentDidUpdate(prevProps){
            if(this.props.value !== prevProps.value) this.elmt.value = this.props.value;
        }
        render() {
            return null;
        }
    }
);
// export default HiddenInput;