import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  TextInput,
  Headline,
  Portal,
  Dialog,
  Paragraph,
  Button,
} from 'react-native-paper';
import axios from 'axios';
import globalStyles from '../styles/global';

const initialState = {
  nombre: '',
  telefono: '',
  correo: '',
  empresa: '',
};

export default function NuevoCliente({ navigation, route }) {
  const { setConsultarApi } = route.params;
  const [alerta, setAlerta] = useState(false);
  const [formData, setFormData] = useState(initialState);

  //detectar si estamos editando o no
  useEffect(() => {
    if (route.params.cliente) {
      const { cliente } = route.params;

      setFormData(cliente);
      // tambien se agrega el id
    }
  }, []);

  const handleInput = (text, target) => {
    setFormData({
      ...formData,
      [target]: text,
    });
  };

  const guardarCliente = async () => {
    // validar
    if (
      formData.nombre === '' ||
      formData.telefono === '' ||
      formData.correo === '' ||
      formData.empresa === ''
    ) {
      setAlerta(true);
      return;
    }

    //generar el cliente
    const cliente = formData;

    // si estamos editando o creando un nuevo cliente
    if (route.params.cliente) {
      const { id } = route.params.cliente;
      cliente.id = id;
      const api =
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? `http://192.168.50.209:8000/clientes/${id}`
          : `http://0.0.0.0:8000/clientes/${id}`;

      try {
        await axios.put(api, cliente);
      } catch (error) {
        console.log(error);
      }
    } else {
      //guardar el cliente en la api
      try {
        // para android no toma el localhost
        const api =
          Platform.OS === 'android' || Platform.OS === 'ios'
            ? 'http://192.168.50.209:8000/clientes'
            : 'http://0.0.0.0:8000/clientes';

        await axios.post(api, cliente);
      } catch (error) {
        console.log(error);
      }
    }
    // redireccionar
    navigation.navigate('Inicio');

    // limpiar el form(opcional)
    setFormData(initialState);

    // cambiar a true volvera a llamar axios en el inicio para obtener clientes
    setConsultarApi(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={globalStyles.contenedor}>
            <Headline style={globalStyles.titulo}>Añadir Nuevo Cliente</Headline>

            <TextInput
              label="Nombre"
              placeholder="Marcos"
              style={styles.input}
              value={formData.nombre}
              onChangeText={(text) => handleInput(text, 'nombre')}
            />
            <TextInput
              label="Telefono"
              placeholder="+452 453542 5244"
              style={styles.input}
              value={formData.telefono}
              onChangeText={(text) => handleInput(text, 'telefono')}
            />
            <TextInput
              label="Correo"
              placeholder="tucorreo@gmail.com"
              style={styles.input}
              value={formData.correo}
              onChangeText={(text) => handleInput(text, 'correo')}
            />
            <TextInput
              label="Empresa"
              placeholder="Facebook"
              style={styles.input}
              value={formData.empresa}
              onChangeText={(text) => handleInput(text, 'empresa')}
            />

            <View style={styles.btnContainer}>
              <Button
                icon="pencil-circle"
                mode="contained"
                onPress={() => guardarCliente()}
              >
                Guardar Cliente
              </Button>
            </View>

            <Portal>
              <Dialog visible={alerta} onDismiss={() => setAlerta(false)}>
                <Dialog.Title>Error</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Todos los campos son obligatorios</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setAlerta(false)}>Ok</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});
