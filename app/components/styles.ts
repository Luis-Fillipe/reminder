import styled, {css} from 'styled-components'
import {lighten} from 'polished'

var blue = 'red';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    
    & + &{
        margin-top: 0.8rem;
    }
`;

export const HelperText = styled.p`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;
export const Label = styled.label`
    color: grey;
    font-size: 1rem;
    margin-bottom: 0.2rem;
`;
export const Input = styled.input<{ hasError: boolean }> `
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid green;

    &:focus{
        outline: 2px solid ${lighten(0.2, blue)};
        border-color: blue;
    }

    &::placeholder{
        color: grey
    }

    ${({ hasError }) =>
        hasError && css`
    border-color: red;`
    }
    
`