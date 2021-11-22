import React from 'react';
import { Button } from 'react-native-paper';

export default function Header({ navigation, route }) {
  // console.log(navigation, route);
  const handlePress = () => {
    navigation.navigate('NuevoCliente');
  };

  return (
    <Button icon="plus-circle" color="#FFF" onPress={() => handlePress()}>
      Cliente
    </Button>
  );
}
