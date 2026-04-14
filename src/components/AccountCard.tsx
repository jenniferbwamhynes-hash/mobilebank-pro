import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AccountCardProps {
  accountType: 'checking' | 'savings' | 'credit';
  accountNumber: string;
  balance: number;
  currency: string;
  onPress?: () => void;
}

/**
 * AccountCard component displays individual account information
 * Part of SCRUM-16: Dashboard UI Components
 */
export const AccountCard: React.FC<AccountCardProps> = ({
  accountType,
  accountNumber,
  balance,
  currency,
  onPress,
}) => {
  const getAccountIcon = () => {
    switch (accountType) {
      case 'checking':
        return '💳';
      case 'savings':
        return '💰';
      case 'credit':
        return '💳';
      default:
        return '📊';
    }
  };

  const formatBalance = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{getAccountIcon()}</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountType}>
            {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
          </Text>
          <Text style={styles.accountNumber}>{accountNumber}</Text>
        </View>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>{formatBalance(balance, currency)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666666',
  },
  balanceContainer: {
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  balance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
