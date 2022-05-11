import {
    ChartContainer
} from './chart-flex.elements'

const ChartFlex = ({ children }) => {
    return (
        <>
            <ChartContainer>{children}</ChartContainer>
        </>
    );
}

export default ChartFlex;