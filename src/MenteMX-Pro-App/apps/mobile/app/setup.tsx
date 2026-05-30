import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { colors, spacing, fonts } from '../src/constants/theme';

type Terrain = 'mud' | 'sand' | 'mixed';

export default function SetupScreen() {
  const [terrain, setTerrain] = useState<Terrain>('mixed');
  const [frontCompression, setFrontCompression] = useState('');
  const [frontRebound, setFrontRebound] = useState('');
  const [rearCompression, setRearCompression] = useState('');
  const [rearRebound, setRearRebound] = useState('');
  const [frontPressure, setFrontPressure] = useState('');
  const [rearPressure, setRearPressure] = useState('');
  const [tireBrand, setTireBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // TODO: salvar via API
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✅ Setup Salvo', 'Configuração registrada com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 500);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar style="light" />

      <Text style={styles.title}>Setup Técnico</Text>
      <Text style={styles.subtitle}>Registre sua configuração</Text>

      {/* Tipo de terreno */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terreno</Text>
        <View style={styles.terrainRow}>
          {(['mud', 'sand', 'mixed'] as Terrain[]).map((t) => (
            <Button
              key={t}
              title={t === 'mud' ? '🟤 Barro' : t === 'sand' ? '🟡 Areia' : '⚫ Misto'}
              onPress={() => setTerrain(t)}
              variant={terrain === t ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </View>

      {/* Suspensão Dianteira */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suspensão Dianteira</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Compressão (cliques)"
              value={frontCompression}
              onChangeText={setFrontCompression}
              placeholder="0-30"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Retorno (cliques)"
              value={frontRebound}
              onChangeText={setFrontRebound}
              placeholder="0-30"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Suspensão Traseira */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suspensão Traseira</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Compressão (cliques)"
              value={rearCompression}
              onChangeText={setRearCompression}
              placeholder="0-30"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Retorno (cliques)"
              value={rearRebound}
              onChangeText={setRearRebound}
              placeholder="0-30"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Pneus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pneus</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Pressão dianteira (bar)"
              value={frontPressure}
              onChangeText={setFrontPressure}
              placeholder="0.8"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Pressão traseira (bar)"
              value={rearPressure}
              onChangeText={setRearPressure}
              placeholder="0.9"
              keyboardType="numeric"
            />
          </View>
        </View>
        <Input
          label="Marca/Modelo do pneu"
          value={tireBrand}
          onChangeText={setTireBrand}
          placeholder="Ex: Pirelli Scorpion MX32"
        />
      </View>

      {/* Notas */}
      <View style={styles.section}>
        <Input
          label="Notas"
          value={notes}
          onChangeText={setNotes}
          placeholder="Observações sobre este setup..."
        />
      </View>

      {/* Salvar */}
      <View style={styles.actions}>
        <Button title="Salvar Setup" onPress={handleSave} loading={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  terrainRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    marginBottom: spacing.xxl,
  },
});
