import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';

const Button = styled(Text)`
  text-align: center;
  margin-top: 1px;
`;

export const FormButton = styled(Button)`
  padding: 3%;
  color: ivory;
  font-size: ${(props) => props.theme.fontSizes.button}
  font-weight: ${(props) => props.theme.fontWeights.bold}
  width: 100%;
  text-align: center;
`;

export const FormButtonView = styled(View)`
  background-color: ${(props) => props.theme.colors.button.background}
  border-radius: 100px;
`;

export const AuthContext = React.createContext();
