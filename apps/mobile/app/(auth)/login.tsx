import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sendOtpCode, verifyOtpCode } from '@/lib/auth/signInWithEmail';
import { palette } from '@/tamagui.config';

// TODO(design-system): migrar tela para componentes Tamagui (YStack, Button, Input)
// após resolvermos o type augmentation do TamaguiCustomConfig.

type Step = 'email' | 'code';

export default function LoginScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    setLoading(true);
    const { error } = await sendOtpCode(email);
    setLoading(false);
    if (error) {
      Alert.alert('Não foi possível enviar', error);
      return;
    }
    setStep('code');
  }

  async function handleVerifyCode() {
    setLoading(true);
    const { error } = await verifyOtpCode(email, code);
    setLoading(false);
    if (error) {
      Alert.alert('Código inválido', error);
      return;
    }
    // Em sucesso, AuthProvider detecta a sessão e (auth)/_layout redireciona pra (tabs).
  }

  function handleBackToEmail() {
    setCode('');
    setStep('email');
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={32}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title">Bem-vindo</ThemedText>
            <ThemedText style={styles.subtitle}>
              {step === 'email'
                ? 'Controle suas finanças com simplicidade.'
                : `Enviamos um código de 6 dígitos para ${email}.`}
            </ThemedText>
          </View>

          {step === 'email' ? (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={palette.warmGray400}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={handleSendCode}
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleSendCode}
                disabled={loading || email.length === 0}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.85 },
                  (loading || email.length === 0) && { opacity: 0.5 },
                ]}>
                {loading ? (
                  <ActivityIndicator color={palette.cream} />
                ) : (
                  <ThemedText style={styles.primaryButtonText}>Enviar código</ThemedText>
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="000000"
                placeholderTextColor={palette.warmGray400}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleVerifyCode}
                autoFocus
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />
              <Pressable
                accessibilityRole="button"
                onPress={handleVerifyCode}
                disabled={loading || code.length !== 6}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.85 },
                  (loading || code.length !== 6) && { opacity: 0.5 },
                ]}>
                {loading ? (
                  <ActivityIndicator color={palette.cream} />
                ) : (
                  <ThemedText style={styles.primaryButtonText}>Entrar</ThemedText>
                )}
              </Pressable>
              <Pressable onPress={handleBackToEmail} disabled={loading} style={styles.linkButton}>
                <ThemedText style={styles.linkText}>Usar outro email</ThemedText>
              </Pressable>
            </View>
          )}

          <ThemedText style={styles.disclaimer}>
            Ao continuar você concorda com nossos Termos e Política de Privacidade.
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  header: { gap: 8 },
  subtitle: { opacity: 0.7 },
  form: { gap: 12 },
  input: {
    backgroundColor: palette.warmGray50,
    borderWidth: 1,
    borderColor: palette.warmGray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.warmGray700,
    minHeight: 52,
  },
  codeInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: palette.moss500,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    color: palette.cream,
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: palette.moss500,
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
  },
});
