import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { findByCode } from '../api/items';
import { createMovement } from '../api/movements';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const registerMovement = async (itemId, movementType) => {
    try {
      const res = await createMovement({
        itemId,
        userId: 1, // TODO: integrar com identificação/login do usuário
        movementType,
        quantity: 1,
        notes: `App: ${movementType} via scanner`,
      });
      Alert.alert('Sucesso', `Movimento ${movementType} registrado. Novo saldo: ${res.currentQuantity}`, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    } catch (e) {
      Alert.alert('Erro', e?.response?.data?.error || e.message, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const res = await findByCode(data);
      const item = res.data;
      Alert.alert(
        'Item encontrado',
        `${item.name}\nEstoque: ${item.currentQuantity}\nCódigo: ${item.barcode || item.qrCode || data}`,
        [
          { text: 'Entrada (IN)', onPress: () => registerMovement(item.id, 'IN') },
          { text: 'Saída (OUT)', onPress: () => registerMovement(item.id, 'OUT') },
          { text: 'Cancelar', style: 'cancel', onPress: () => setScanned(false) },
        ]
      );
    } catch (e) {
      Alert.alert('Não encontrado', e?.response?.data?.error || 'Nenhum item corresponde a este código.', [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner QR/Código de Barras</Text>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button
            title={'Escanear novamente'}
            onPress={() => setScanned(false)}
            buttonStyle={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#2196F3',
    margin: 20,
  },
});