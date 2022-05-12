import { useState } from "react";

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const { label, errorMessage, onChange, id, element, ...inputProps } = props;

    const handleFocus = (e) => {
        setFocused(true);
    }

    return (
        <div className="form-input">
            <label>{label}</label>
            {
                element === "select" ?
                    <>
                        <select
                            {...inputProps}
                            onChange={onChange}
                            onBlur={handleFocus}
                            focused={focused.toString()}
                        >
                        {
                            props.options.map((option, key) => (
                                <option key={key} value={option.option}>{option.option}</option>
                            ))
                        }
                        </select>
                        <span>{errorMessage}</span>
                    </>
                    :
                    <>
                        <input
                            {...inputProps}
                            onChange={onChange}
                            onBlur={handleFocus}
                            focused={focused.toString()}
                        />
                        <span>{errorMessage}</span>
                    </>
            }
        </div>
    );
}

export default FormInput;