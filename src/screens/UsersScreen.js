import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Avatar, Button, FAB } from 'react-native-elements';
import { listUsers } from '../api/users';

export default function UsersScreen() {
  const [state, setState] = useState({ loading: true, users: [], error: null });
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const res = await listUsers();
      setState({ loading: false, users: res.data || [], error: null });
    } catch (e) {
      setState({ loading: false, users: [], error: e?.response?.data?.error || e.message });
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderUser = ({ item }) => (
    <Card containerStyle={styles.userCard}>
      <View style={styles.userHeader}>
        <Avatar
          rounded
          title={(item.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}
          size="medium"
          containerStyle={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={[styles.status, { color: item.active ? 'green' : 'red' }]}>
            {item.active ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
        <Button title="Editar" type="outline" buttonStyle={styles.editButton} />
      </View>
    </Card>
  );

  if (state.loading && !refreshing) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#666' }}>Carregando usuários...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#c00', textAlign: 'center' }}>Erro: {String(state.error)}</Text>
        <Button title="Tentar novamente" onPress={fetchUsers} containerStyle={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await fetchUsers();
          setRefreshing(false);
        }} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>Nenhum usuário cadastrado</Text>}
      />
      <FAB title="+" placement="right" color="black" onPress={() => console.log('Adicionar usuário')} />
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
  userCard: {
    marginBottom: 10,
    borderRadius: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'black',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 15,
  },
});