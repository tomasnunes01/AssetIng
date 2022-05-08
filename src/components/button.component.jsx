import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function MenuButton() {
  return (
    <MaterialCommunityIcons
      name="menu"
      size={30}
      color={theme.colors.button.background}
    />
  );
}
