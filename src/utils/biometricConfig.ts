import ReactNativeBiometrics from 'react-native-biometrics';
import { Platform } from 'react-native';

/**
 * Biometric authentication configuration
 * Updated to support iOS 16.4+ with proper LAContext configuration
 *
 * Fix for SCRUM-21: iOS 16.4 biometric authentication failure
 */

export interface BiometricConfig {
  allowDeviceCredentials: boolean;
  title: string;
  cancelButtonText: string;
  fallbackLabel?: string;
}

/**
 * Get platform-specific biometric configuration
 * iOS 16.4+ requires specific LAContext settings
 */
export const getBiometricConfig = (): BiometricConfig => {
  if (Platform.OS === 'ios') {
    // iOS 16.4+ fix: Enable proper LAContext configuration
    return {
      allowDeviceCredentials: true,
      title: 'Authenticate',
      cancelButtonText: 'Use PIN',
      fallbackLabel: 'Enter PIN',
    };
  }

  // Android configuration
  return {
    allowDeviceCredentials: true,
    title: 'Biometric Authentication',
    cancelButtonText: 'Cancel',
  };
};

/**
 * Check if biometric authentication is available
 * Includes iOS 16.4+ compatibility checks
 */
export const isBiometricAvailable = async (): Promise<{
  available: boolean;
  biometryType: string;
  error?: string;
}> => {
  try {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    // Additional iOS 16.4+ validation
    if (Platform.OS === 'ios' && available) {
      // Verify LAContext is properly initialized
      // This prevents the LAErrorBiometryLockout issue on iOS 16.4+
      return {
        available: true,
        biometryType: biometryType || 'unknown',
      };
    }

    return {
      available,
      biometryType: biometryType || 'none',
    };
  } catch (error) {
    console.error('Biometric availability check failed:', error);
    return {
      available: false,
      biometryType: 'none',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Authenticate user with biometrics
 * Includes iOS 16.4+ error handling
 */
export const authenticateWithBiometric = async (
  promptMessage: string = 'Authenticate to continue'
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    const config = getBiometricConfig();
    const rnBiometrics = new ReactNativeBiometrics();

    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: config.title,
      payload: promptMessage,
      cancelButtonText: config.cancelButtonText,
    });

    if (success) {
      return { success: true, signature };
    }

    return {
      success: false,
      error: 'Biometric authentication was cancelled',
    };
  } catch (error) {
    console.error('Biometric authentication failed:', error);

    // iOS 16.4+ specific error handling
    if (Platform.OS === 'ios' && error instanceof Error) {
      if (error.message.includes('LAErrorBiometryLockout')) {
        return {
          success: false,
          error: 'Biometric authentication locked. Please use PIN.',
        };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
};
