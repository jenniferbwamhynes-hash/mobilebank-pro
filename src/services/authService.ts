import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mobilebank-pro.com/v1';

interface LoginCredentials {
  email: string;
  password: string;
  biometricToken?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Authentication service for handling user login, logout, and token management
 */
class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      const { accessToken, refreshToken } = response.data;

      // Store tokens securely in keychain
      await this.storeTokens(accessToken, refreshToken);

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Login with biometric authentication
   */
  async loginWithBiometric(email: string): Promise<AuthResponse> {
    const rnBiometrics = new ReactNativeBiometrics();

    // Check if biometrics are available
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      throw new Error('Biometric authentication not available');
    }

    // Prompt for biometric authentication
    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: 'Authenticate to login',
      payload: email,
    });

    if (!success) {
      throw new Error('Biometric authentication failed');
    }

    // Login with biometric token
    return this.login({
      email,
      password: '', // Password not needed for biometric auth
      biometricToken: signature,
    });
  }

  /**
   * Logout user and clear stored tokens
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      if (this.accessToken) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local tokens
      await this.clearTokens();
      this.accessToken = null;
      this.refreshToken = null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ accessToken: string }>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken: this.refreshToken }
      );

      const { accessToken } = response.data;
      this.accessToken = accessToken;

      // Update stored token
      await this.storeTokens(accessToken, this.refreshToken);

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear tokens and require re-login
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Store tokens securely in device keychain
   */
  private async storeTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    await Keychain.setGenericPassword('auth_tokens',
      JSON.stringify({ accessToken, refreshToken }),
      {
        service: 'com.mobilebank-pro',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    );
  }

  /**
   * Load tokens from keychain on app startup
   */
  async loadStoredTokens(): Promise<void> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'com.mobilebank-pro',
      });

      if (credentials) {
        const { accessToken, refreshToken } = JSON.parse(credentials.password);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
      }
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }

  /**
   * Clear stored tokens from keychain
   */
  private async clearTokens(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: 'com.mobilebank-pro',
    });
  }
}

export default new AuthService();
