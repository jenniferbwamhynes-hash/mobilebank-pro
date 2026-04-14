const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // TODO: Fetch from database
    const accounts = [
      {
        accountId: '550e8400-e29b-41d4-a716-446655440001',
        userId,
        accountType: 'checking',
        accountNumber: '****1234',
        balance: 5432.10,
        currency: 'USD',
        status: 'active',
        openedDate: '2024-01-15T00:00:00Z',
      },
      {
        accountId: '550e8400-e29b-41d4-a716-446655440002',
        userId,
        accountType: 'savings',
        accountNumber: '****5678',
        balance: 12500.00,
        currency: 'USD',
        status: 'active',
        openedDate: '2024-01-15T00:00:00Z',
      },
      {
        accountId: '550e8400-e29b-41d4-a716-446655440003',
        userId,
        accountType: 'credit',
        accountNumber: '****9012',
        balance: -1234.56,
        currency: 'USD',
        status: 'active',
        openedDate: '2024-03-01T00:00:00Z',
      },
    ];

    res.json({ accounts });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/accounts/:accountId/balance
 * Get current balance for specific account
 */
router.get('/:accountId/balance', async (req, res, next) => {
  try {
    const { accountId } = req.params;

    // TODO: Fetch from database
    // Verify account belongs to user
    const balance = 5432.10;

    res.json({ balance });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/accounts/:accountId/transactions
 * Get transaction history for account
 */
router.get('/:accountId/transactions', async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { limit = 50, offset = 0, startDate, endDate } = req.query;

    // TODO: Fetch from database with filters
    const transactions = [
      {
        transactionId: '650e8400-e29b-41d4-a716-446655440001',
        accountId,
        type: 'debit',
        amount: 45.67,
        currency: 'USD',
        description: 'Coffee purchase',
        merchant: 'Starbucks',
        category: 'Food & Dining',
        timestamp: '2026-04-14T10:23:00Z',
        status: 'completed',
        balanceAfter: 5432.10,
      },
      {
        transactionId: '650e8400-e29b-41d4-a716-446655440002',
        accountId,
        type: 'credit',
        amount: 1000.00,
        currency: 'USD',
        description: 'Salary deposit',
        merchant: 'Employer Inc',
        category: 'Income',
        timestamp: '2026-04-13T09:00:00Z',
        status: 'completed',
        balanceAfter: 5477.77,
      },
      {
        transactionId: '650e8400-e29b-41d4-a716-446655440003',
        accountId,
        type: 'debit',
        amount: 89.99,
        currency: 'USD',
        description: 'Online purchase',
        merchant: 'Amazon',
        category: 'Shopping',
        timestamp: '2026-04-12T15:45:00Z',
        status: 'completed',
        balanceAfter: 4477.77,
      },
    ];

    const total = transactions.length;

    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/accounts/:accountId/transactions/search
 * Search transactions by query
 */
router.get('/:accountId/transactions/search', async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'Search query parameter "q" is required',
      });
    }

    // TODO: Implement search in database
    const transactions = [];

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
