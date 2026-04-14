import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useStore, ClientStatus } from '../../store';
import { colors, fontSizes, spacing, strings } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { TabScreenProps, AppStackScreenProps } from '../../navigation/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { TextInput } from '../../components/TextInput';

export const ClientListScreen = ({
  navigation,
}: TabScreenProps<'Clients'> | AppStackScreenProps<'ClientList'>) => {
  const clients = useStore(state => state.clients);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ClientStatus | 'All'>('All');
  const [agentFilter, setAgentFilter] = useState('');

  const tabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  const filters: (ClientStatus | 'All')[] = [
    'All',
    'Lead',
    'In Discussion',
    'Confirmed',
    'Payment Received',
    'Booking Started',
    'Trip Confirmed',
  ];

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesAgent =
      !agentFilter ||
      c.assignedAgent.toLowerCase().includes(agentFilter.toLowerCase());
    return matchesSearch && matchesFilter && matchesAgent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'In Discussion':
        return 'warning';
      default:
        return 'info';
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        (navigation as any).navigate('ClientDetail', { clientId: item.id })
      }
    >
      <Card style={styles.clientCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>{item.name || 'N/A'}</Text>
          <Badge
            label={item.status || 'N/A'}
            status={getStatusColor(item.status)}
          />
        </View>
        <Text style={styles.clientDetail}>
          To: {item.destination || 'N/A'} | {item.travelersCount} Travelers
        </Text>
        <Text style={styles.clientDates || 'N/A'}>{item.travelDates}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={strings.clientList}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={filteredClients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 100,
        }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={strings.searchClients}
            />
            <TextInput
              value={agentFilter}
              onChangeText={setAgentFilter}
              placeholder={strings.filterByAgent}
              style={styles.agentInput}
            />

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filters}
              keyExtractor={item => item}
              contentContainerStyle={styles.filtersContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filter === item && styles.filterChipActive,
                  ]}
                  onPress={() => setFilter(item)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{strings.noClientsFound}</Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarHeight + 35 }]}
        onPress={() => (navigation as any).navigate('AddEditClient', {})}
      >
        <Plus color="#FFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersWrapper: {
    marginTop: spacing.xs6,
    marginBottom: spacing.xs2,
  },
  agentInput: {
    marginHorizontal: spacing.md16,
    marginTop: spacing.md12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm8,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  filtersContainer: {
    paddingHorizontal: spacing.md16,
    paddingVertical: spacing.lg18,
  },
  filterChip: {
    paddingHorizontal: spacing.md16,
    paddingVertical: spacing.sm8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: spacing.sm10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContainer: {
    paddingHorizontal:spacing.md16,
    paddingTop: spacing.sm8,
  },
  clientCard: {
    marginBottom: spacing.md14,
    padding: spacing.md16,
    borderRadius: 18,
    marginHorizontal:spacing.lg20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clientDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop:spacing.xs4,
  },
  clientDates: {
    fontSize: 13,
    color: colors.primary,
    marginTop: spacing.xs6,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl40,
    fontSize: fontSizes.xlarge,
  },
  fab: {
    position: 'absolute',
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor:colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
