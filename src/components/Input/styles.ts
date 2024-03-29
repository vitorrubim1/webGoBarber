import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface InputWrapperProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  background: #262626;
  border-radius: 10px;
  border: 2px solid #262626;
  padding: 16px;
  width: 100%;

  color: #878480;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000; //icon
    `}

  // se o input tiver preenchido e perder o foco
  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9000; //icon
    `}

  input {
    color: #f4ede8;

    flex: 1;
    border: 0;
    background: transparent;

    &::placeholder {
      color: #878480;
    }
  }

  svg {
    margin-right: 8px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 15px;

  cursor: pointer;

  svg {
    margin: 0;
  }
`;
