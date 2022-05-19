import {
    OptionsContainer
} from './chartOptions.elements'
const ChartOptions = ({children}) => {
    return (
        <>
            <OptionsContainer>{children}</OptionsContainer>
        </>
    );
}

export default ChartOptions;