import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Button, FAB } from 'react-native-elements';

export default function ItemsScreen() {
  const [items] = useState([
    // dados de exemplo
    { id: 1, name: 'Item Exemplo 1', barcode: '1234567890', quantity: 10 },
    { id: 2, name: 'Item Exemplo 2', barcode: '0987654321', quantity: 5 },
  ]);

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.quantity}>Qtd: {item.quantity}</Text>
      </View>
      <Text style={styles.barcode}>Código: {item.barcode}</Text>
      <View style={styles.itemActions}>
        <Button
          title="Editar"
          type="outline"
          buttonStyle={styles.actionButton}
        />
        <Button
          title="Movimentar"
          buttonStyle={styles.actionButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        title="+"
        placement="right"
        color="black"
        onPress={() => console.log('Adicionar item')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  barcode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});