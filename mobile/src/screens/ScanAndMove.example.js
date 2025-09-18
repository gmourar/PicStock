import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { findByCode } from '../api/items';
import { createMovement } from '../api/movements';

export default function ScanAndMoveExample() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [userId, setUserId] = useState('1'); // ajuste conforme seu fluxo de auth/identificação
  const [quantity, setQuantity] = useState('1');
  const [movementType, setMovementType] = useState('OUT'); // 'IN' ou 'OUT'

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    try {
      const res = await findByCode(data);
      setItem(res.data);
    } catch (e) {
      Alert.alert('Erro', e?.response?.data?.error || 'Item não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMovement = async () => {
    try {
      setLoading(true);
      const payload = {
        itemId: item.id,
        userId: Number(userId),
        movementType,
        quantity: Number(quantity),
        notes: `Movimento via app (${movementType})`,
      };
      const res = await createMovement(payload);
      Alert.alert('Sucesso', `Movimento registrado. Novo saldo: ${res.currentQuantity}`);
      // reset para novo scan
      setItem(null);
      setScanned(false);
    } catch (e) {
      Alert.alert('Erro', e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
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
      {!scanned && (
        <View style={styles.scannerBox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.hint}>Aponte para o código de barras ou QR</Text>
        </View>
      )}

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Processando...</Text>
        </View>
      )}

      {item && !loading && (
        <View style={styles.panel}>
          <Text style={styles.title}>{item.name}</Text>
          <Text>Categoria: {item.category || '-'}</Text>
          <Text>Estoque atual: {item.currentQuantity}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Usuário ID:</Text>
            <TextInput
              value={userId}
              onChangeText={setUserId}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="1"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Quantidade:</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="1"
            />
          </View>

          <View style={styles.row}>
            <Button
              title="Entrada (IN)"
              color="#2e7d32"
              onPress={() => setMovementType('IN')}
            />
            <View style={{ width: 12 }} />
            <Button
              title="Saída (OUT)"
              color="#c62828"
              onPress={() => setMovementType('OUT')}
            />
          </View>

          <View style={{ height: 12 }} />

          <Button title={`Confirmar ${movementType}`} onPress={handleSubmitMovement} />
          <View style={{ height: 8 }} />
          <Button title="Novo scan" onPress={() => { setItem(null); setScanned(false); }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scannerBox: { height: 260, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
  hint: { position: 'absolute', bottom: 8, alignSelf: 'center', color: '#fff' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 16 },
  muted: { color: '#666', marginTop: 8 },
  panel: { marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: '#fff', elevation: 1 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  label: { width: 90, color: '#333' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
});
