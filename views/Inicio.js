import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Platform, StyleSheet } from 'react-native';
import { List, Headline, Button, FAB } from 'react-native-paper';
import globalStyles from '../styles/global';

export default function Inicio({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [consultarApi, setConsultarApi] = useState(true);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const api =
          Platform.OS === 'android' || Platform.OS === 'ios'
            ? 'http://192.168.50.209:8000/clientes'
            : 'http://0.0.0.0:8000/clientes';

        const resultado = await axios.get(api);
        setClientes(resultado.data);
        setConsultarApi(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (consultarApi) {
      obtenerClientes();
    }
  }, [consultarApi]);

  return (
    <View style={globalStyles.contenedor}>
      <Headline style={globalStyles.titulo}>
        {clientes.length > 0 ? 'Clientes' : 'No Hay Clientes'}
      </Headline>

      <FlatList
        data={clientes}
        keyExtractor={(cliente) => cliente.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.nombre}
            description={item.empresa}
            onPress={() =>
              navigation.navigate('DetallesCliente', { item, setConsultarApi })
            }
          />
        )}
      />
      <FAB
        icon="plus"
        style={globalStyles.fab}
        onPress={() => navigation.navigate('NuevoCliente', { setConsultarApi })}
      />
    </View>
  );
}
