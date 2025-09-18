import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Button, FAB } from 'react-native-elements';
import { listItems } from '../api/items';

export default function ItemsScreen() {
  const [state, setState] = useState({ loading: true, items: [], error: null });
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const res = await listItems();
      setState({ loading: false, items: res.data || [], error: null });
    } catch (e) {
      setState({ loading: false, items: [], error: e?.response?.data?.error || e.message });
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.quantity}>Qtd: {item.currentQuantity ?? 0}</Text>
      </View>
      {!!item.barcode && <Text style={styles.barcode}>Código: {item.barcode}</Text>}
      <View style={styles.itemActions}>
        <Button title="Editar" type="outline" buttonStyle={styles.actionButton} />
        <Button title="Movimentar" buttonStyle={styles.actionButton} />
      </View>
    </Card>
  );

  if (state.loading && !refreshing) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#666' }}>Carregando itens...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#c00', textAlign: 'center' }}>Erro: {String(state.error)}</Text>
        <Button title="Tentar novamente" onPress={fetchItems} containerStyle={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await fetchItems();
          setRefreshing(false);
        }} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>Nenhum item cadastrado</Text>}
      />
      <FAB title="+" placement="right" color="black" onPress={() => console.log('Adicionar item')} />
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