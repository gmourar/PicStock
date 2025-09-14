import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Avatar, Button, FAB } from 'react-native-elements';

export default function UsersScreen() {
  const [users] = useState([
    // Dados de exemplo
    { id: 1, name: 'João Silva', email: 'joao@empresa.com', active: true },
    { id: 2, name: 'Maria Santos', email: 'maria@empresa.com', active: true },
  ]);

  const renderUser = ({ item }) => (
    <Card containerStyle={styles.userCard}>
      <View style={styles.userHeader}>
        <Avatar
          rounded
          title={item.name.split(' ').map(n => n[0]).join('')}
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
        <Button
          title="Editar"
          type="outline"
          buttonStyle={styles.editButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <FAB
        title="+"
        placement="right"
        color="black"
        onPress={() => console.log('Adicionar usuário')}
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