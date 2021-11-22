import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Headline, Subheading, Text, Button, FAB } from 'react-native-paper';
import globalStyles from '../styles/global';
import axios from 'axios';

export default function DetallesCliente({ navigation, route }) {
  const { nombre, empresa, telefono, correo, id } = route.params.item;
  const { setConsultarApi } = route.params;

  const mostrarConfirm = () => {
    Alert.alert(
      'Desea eliminar este cliente?',
      'Un contacto eliminado no se podra recuperar',
      [
        { text: 'Si Eliminar', onPress: () => eliminarCliente() },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const eliminarCliente = async () => {
    try {
      const api =
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? `http://192.168.50.209:8000/clientes/${id}`
          : `http://0.0.0.0:8000/clientes/${id}`;
      await axios.delete(api);
    } catch (error) {
      console.log(error);
    }
    // redireccionar
    navigation.navigate('Inicio');
    // controlar para que vuelva a llamar a la api en el inicio
    setConsultarApi(true);
  };

  return (
    <View style={globalStyles.contenedor}>
      <Headline style={globalStyles.titulo}>Detalles Cliente</Headline>

      <Text style={styles.text}>
        Nombre: <Subheading>{nombre}</Subheading>
      </Text>
      <Text style={styles.text}>
        Empresa: <Subheading>{empresa}</Subheading>
      </Text>
      <Text style={styles.text}>
        Telefono: <Subheading>{telefono}</Subheading>
      </Text>
      <Text style={styles.text}>
        Correo: <Subheading>{correo}</Subheading>
      </Text>

      <Button
        style={styles.btn}
        mode="contained"
        icon="cancel"
        onPress={() => mostrarConfirm()}
      >
        Eliminar Cliente
      </Button>
      <FAB
        icon="pencil"
        style={globalStyles.fab}
        onPress={() =>
          navigation.navigate('NuevoCliente', {
            cliente: route.params.item,
            setConsultarApi,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
  btn: {
    marginTop: 80,
    backgroundColor: 'red',
  },
});
