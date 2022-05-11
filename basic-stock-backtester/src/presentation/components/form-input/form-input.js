import {
    FormInputContainer
} from './form-input.elements';
import { useState } from "react";

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const  {label, errorMessage, onChange, id, ...inputProps} = props;
    
    const handleFocus = (e) => {
        setFocused(true);
    }

    return (
        <FormInputContainer>
            <label>{label}</label>
            <input
                {...inputProps}
                onChange={onChange}
                onBlur={handleFocus}
                focused={focused.toString()}
            />
            <span>{errorMessage}</span>
        </FormInputContainer>
    );
}

export default FormInput;