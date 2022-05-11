import styled from 'styled-components';

export const OptionsContainer = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid gray;

    & button {
        padding: .5rem;
        background-color: transparent;
        color: white;
        border: 2px transparent solid;
    }
    & button:hover {
        border-bottom: 2px solid aqua;
        cursor: pointer;
    }
`;

export const StockPeriodBtn = styled.button`
`;