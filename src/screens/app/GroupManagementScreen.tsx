// import { SafeAreaView } from 'react-native-safe-area-context';
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { Users, PlusCircle } from 'lucide-react-native';
// import { useStore } from '../../store';
// import { colors, fontSizes } from '../../theme/colors';
// import { Card } from '../../components/Card';

// export const GroupManagementScreen = () => {
//   const groups = useStore((state) => state.groups);
//   const clients = useStore((state) => state.clients);
//   const totalGroups = groups.length;
//   const totalMembers = groups.reduce((sum, group) => sum + group.clientIds.length, 0);

//   const renderItem = ({ item }: { item: any }) => {
//     const groupClients = clients.filter(c => item.clientIds.includes(c.id));
//     const totalGroupCost = groupClients.reduce((sum, client) => sum + (client.totalCost || 0), 0);
//     return (
//       <Card style={styles.card}>
//         <View style={styles.cardHeader}>
//           <Users color={colors.primary} size={24} />
//           <Text style={styles.title}>{item.name}</Text>
//         </View>
//         <Text style={styles.subtitle}>{item.clientIds.length} Members • ${totalGroupCost.toLocaleString()}</Text>
        
//         <View style={styles.membersList}>
//           {groupClients.map(c => (
//             <Text key={c.id} style={styles.memberItem}>• {c.name}</Text>
//           ))}
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Group Management</Text>
//         <TouchableOpacity style={styles.addBtn}>
//           <PlusCircle color={colors.primary} size={24} />
//           <Text style={styles.addBtnText}>Create Group</Text>
//         </TouchableOpacity>
//       </View>
//       <Card style={styles.summaryCard}>
//         <View style={styles.summaryTop}>
//           <Text style={styles.summaryTitle}>Group overview</Text>
//           <Text style={styles.summaryLabel}>View group totals and shared itinerary details.</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryValue}>{totalGroups}</Text>
//             <Text style={styles.summaryLabel}>Groups</Text>
//           </View>
//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryValue}>{totalMembers}</Text>
//             <Text style={styles.summaryLabel}>Clients</Text>
//           </View>
//         </View>
//       </Card>

//       <FlatList
//         data={groups}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Users color={colors.textSecondary} size={48} />
//             <Text style={styles.emptyText}>No groups found. Create a group to bundle multiple clients together for shared itinerary and bookings.</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: colors.background,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   addBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     backgroundColor: colors.card,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   addBtnText: {
//     color: colors.primary,
//     fontWeight: '600',
//     fontSize: 13,
//     marginLeft: 6,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 20,
//   },
//   card: {
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 12,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: colors.text,
//     marginLeft: 8,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     marginBottom: 10,
//   },
//   summaryCard: {
//     borderRadius: 18,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     padding: 16,
//   },
//   summaryTop: {
//     marginBottom: 10,
//   },
//   summaryTitle: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: colors.text,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     marginTop: 4,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   summaryValue: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: colors.primary,
//   },
//   membersList: {
//     backgroundColor: colors.background,
//     padding: 10,
//     borderRadius: 10,
//   },
//   memberItem: {
//     fontSize: 13,
//     color: colors.text,
//     marginBottom: 4,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 60,
//     paddingHorizontal: 24,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: colors.textSecondary,
//     marginTop: 12,
//     fontSize: fontSizes.xlarge,
//     lineHeight: 20,
//   },
// });
