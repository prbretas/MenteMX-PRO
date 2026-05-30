import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { colors, spacing, fonts } from '../src/constants/theme';

type EventType = 'race' | 'training';

interface EventItem {
  id: string;
  name: string;
  date: string;
  type: EventType;
  location?: string;
  status: 'scheduled' | 'completed';
}

export default function EventsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<EventType>('training');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // TODO: buscar eventos da API
  const [events] = useState<EventItem[]>([]);

  const handleSave = () => {
    if (!name || !date) {
      Alert.alert('Erro', 'Nome e data são obrigatórios');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowForm(false);
      setName('');
      setDate('');
      setLocation('');
      Alert.alert('✅ Evento Criado', 'Evento registrado com sucesso.');
    }, 500);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <Text style={styles.subtitle}>Corridas e treinos</Text>
      </View>

      {!showForm ? (
        <>
          {/* Lista de eventos */}
          {events.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🏆</Text>
              <Text style={styles.emptyText}>Nenhum evento registrado</Text>
              <Text style={styles.emptyHint}>Cadastre corridas e treinos para acompanhar seu histórico</Text>
            </View>
          ) : (
            events.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventType}>
                    {event.type === 'race' ? '🏁' : '🏋️'} {event.type === 'race' ? 'Corrida' : 'Treino'}
                  </Text>
                  <Text style={[styles.eventStatus, event.status === 'completed' && styles.statusCompleted]}>
                    {event.status === 'completed' ? '✅' : '📅'}
                  </Text>
                </View>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventDate}>{event.date} {event.location ? `• ${event.location}` : ''}</Text>
              </TouchableOpacity>
            ))
          )}

          <View style={styles.actions}>
            <Button title="+ Novo Evento" onPress={() => setShowForm(true)} />
          </View>
        </>
      ) : (
        /* Formulário de novo evento */
        <View style={styles.form}>
          <View style={styles.typeRow}>
            <Button
              title="🏋️ Treino"
              onPress={() => setType('training')}
              variant={type === 'training' ? 'primary' : 'secondary'}
            />
            <Button
              title="🏁 Corrida"
              onPress={() => setType('race')}
              variant={type === 'race' ? 'primary' : 'secondary'}
            />
          </View>

          <Input label="Nome do evento" value={name} onChangeText={setName} placeholder="Ex: Treino Interlagos" />
          <Input label="Data" value={date} onChangeText={setDate} placeholder="DD/MM/AAAA" />
          <Input label="Local (opcional)" value={location} onChangeText={setLocation} placeholder="Ex: Indaiatuba-SP" />

          <View style={styles.formActions}>
            <Button title="Salvar" onPress={handleSave} loading={loading} />
            <Button title="Cancelar" onPress={() => setShowForm(false)} variant="secondary" />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fonts.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  eventType: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
  },
  eventStatus: {
    fontSize: 14,
  },
  statusCompleted: {
    color: colors.success,
  },
  eventName: {
    fontSize: fonts.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  eventDate: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
  },
  form: {
    gap: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  formActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
