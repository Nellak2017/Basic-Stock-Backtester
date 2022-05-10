import {
    OptionsContainer
} from './chart-options.elements'
const ChartOptions = ({children}) => {
    return (
        <>
            <OptionsContainer>{children}</OptionsContainer>
        </>
    );
}

export default ChartOptions;