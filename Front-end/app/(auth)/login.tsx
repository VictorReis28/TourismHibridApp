import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { Fingerprint } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const { login, loginWithBiometrics, checkBiometricsAvailable } =
    useAuthStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    checkBiometricsAvailable().then(setBiometricsAvailable);
  }, []);

  const handleLogin = async () => {
    try {
      setError('');
      if (!email && !password && biometricsAvailable) {
        await handleBiometricLogin();
        return;
      }

      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      await login(email, password);
      router.replace('/(app)');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setError('');
      await loginWithBiometrics();
      router.replace('/(app)');
    } catch (error: any) {
      setError(error.message || 'Erro na autenticação biométrica');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Bem-vindo de Volta
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Entre para continuar explorando
      </Text>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={handleLogin}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Senha"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {biometricsAvailable && (
          <TouchableOpacity
            style={[
              styles.biometricButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={handleBiometricLogin}
          >
            <Fingerprint size={24} color={theme.colors.primary} />
            <Text
              style={[styles.biometricText, { color: theme.colors.primary }]}
            >
              Entrar com biometria
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.links}>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
  },
  biometricText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  link: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
