import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BalanceDisplayProps {
  totalBalance: number;
  currency: string;
  changeAmount?: number;
  changePercentage?: number;
}

/**
 * BalanceDisplay component shows total account balance with trend
 * Part of SCRUM-16: Dashboard UI Components
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  totalBalance,
  currency,
  changeAmount,
  changePercentage,
}) => {
  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTrendIcon = () => {
    if (!changeAmount) return null;
    return changeAmount >= 0 ? '📈' : '📉';
  };

  const getTrendColor = () => {
    if (!changeAmount) return '#666666';
    return changeAmount >= 0 ? '#2E7D32' : '#D32F2F';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.balance}>{formatCurrency(totalBalance, currency)}</Text>
      {changeAmount !== undefined && changePercentage !== undefined && (
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>{getTrendIcon()}</Text>
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {formatCurrency(Math.abs(changeAmount), currency)} (
            {changePercentage >= 0 ? '+' : ''}
            {changePercentage.toFixed(2)}%)
          </Text>
          <Text style={styles.trendPeriod}>this month</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1976D2',
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  trendPeriod: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
