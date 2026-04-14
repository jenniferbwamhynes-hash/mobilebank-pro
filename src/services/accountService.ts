import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mobilebank-pro.com/v1';

export interface Account {
  accountId: string;
  accountType: 'checking' | 'savings' | 'credit';
  accountNumber: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  openedDate: string;
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  type: 'debit' | 'credit' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  merchant?: string;
  category?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  balanceAfter: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo?: string;
  idempotencyKey: string;
}

export interface TransferResponse {
  transactionId: string;
  status: string;
  timestamp: string;
  newBalances: {
    fromAccount: number;
    toAccount: number;
  };
}

/**
 * Service for account and transaction operations
 */
class AccountService {
  /**
   * Get authorization headers with access token
   */
  private getHeaders() {
    const token = authService.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetch all accounts for the authenticated user
   */
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await axios.get<{ accounts: Account[] }>(
        `${API_BASE_URL}/accounts`,
        { headers: this.getHeaders() }
      );
      return response.data.accounts;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  }

  /**
   * Get account balance by account ID
   */
  async getAccountBalance(accountId: string): Promise<number> {
    try {
      const response = await axios.get<{ balance: number }>(
        `${API_BASE_URL}/accounts/${accountId}/balance`,
        { headers: this.getHeaders() }
      );
      return response.data.balance;
    } catch (error) {
      console.error('Failed to fetch account balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for an account
   */
  async getTransactions(
    accountId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);

      const response = await axios.get<{
        transactions: Transaction[];
        pagination: { total: number };
      }>(`${API_BASE_URL}/accounts/${accountId}/transactions?${params}`, {
        headers: this.getHeaders(),
      });

      return {
        transactions: response.data.transactions,
        total: response.data.pagination.total,
      };
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  /**
   * Create a transfer between accounts
   */
  async createTransfer(transfer: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await axios.post<TransferResponse>(
        `${API_BASE_URL}/transfers`,
        transfer,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }

  /**
   * Search transactions by merchant or description
   */
  async searchTransactions(
    accountId: string,
    query: string
  ): Promise<Transaction[]> {
    try {
      const response = await axios.get<{ transactions: Transaction[] }>(
        `${API_BASE_URL}/accounts/${accountId}/transactions/search`,
        {
          params: { q: query },
          headers: this.getHeaders(),
        }
      );
      return response.data.transactions;
    } catch (error) {
      console.error('Transaction search failed:', error);
      throw error;
    }
  }
}

export default new AccountService();
