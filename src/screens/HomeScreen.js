import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PicStock Dashboard</Text>
      
      <View style={styles.cardsContainer}>
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Total de Itens</Text>
          <Text style={styles.cardValue}>0</Text>
        </Card>
        
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Movimentações Hoje</Text>
          <Text style={styles.cardValue}>0</Text>
        </Card>
      </View>
      
      <Card containerStyle={styles.recentCard}>
        <Text style={styles.cardTitle}>Últimas Movimentações</Text>
        <Text style={styles.emptyText}>Nenhuma movimentação ainda</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0000',
    textAlign: 'center',
  },
  recentCard: {
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
});