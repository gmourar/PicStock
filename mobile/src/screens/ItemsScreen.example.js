import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { listItems } from '../api/items';

export default function ItemsScreenExample() {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  if (state.loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando itens...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro: {String(state.error)}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.items}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          {item.category ? <Text style={styles.muted}>{item.category}</Text> : null}
          <Text>Estoque: {item.currentQuantity}</Text>
          {item.minQuantity !== undefined ? <Text>Mínimo: {item.minQuantity}</Text> : null}
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.muted}>Nenhum item cadastrado</Text>
        </View>
      }
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { color: '#666', marginTop: 8 },
  error: { color: '#c00', textAlign: 'center' },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 12, elevation: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});
