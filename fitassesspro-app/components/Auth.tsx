import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { supabase } from '../lib/supabase'

const { width, height } = Dimensions.get('window')

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Simple animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, slideAnim])

  async function signInWithEmail() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        Alert.alert('Login Error', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function signUpWithEmail() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: displayName,
            phone: phoneNumber || null,
          }
        }
      })

      if (error) {
        Alert.alert('Signup Error', error.message)
      } else {
        Alert.alert('Success!', 'Check your email for the confirmation link!')
        setDisplayName('')
        setPhoneNumber('')
        setEmail('')
        setPassword('')
      }
    } finally {
      setLoading(false)
    }
  }

  async function resetPassword() {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        Alert.alert('Reset Error', error.message)
      } else {
        Alert.alert('Reset Email Sent', 'Check your email for password reset instructions!')
      }
    } finally {
      setLoading(false)
    }
  }

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused
  ]

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background Shapes */}
      <View style={styles.backgroundLayer1} />
      <View style={styles.backgroundLayer2} />
      <View style={styles.backgroundLayer3} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <Animated.View style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle('displayName')}
                  placeholder="Display Name"
                  placeholderTextColor="#b9b9b9"
                  value={displayName}
                  onChangeText={setDisplayName}
                  onFocus={() => setFocusedField('displayName')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={getInputStyle('email')}
                placeholder="Email Address"
                placeholderTextColor="#b9b9b9"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={getInputStyle('password')}
                placeholder="Password"
                placeholderTextColor="#b9b9b9"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={getInputStyle('phone')}
                  placeholder="Phone Number (Optional)"
                  placeholderTextColor="#b9b9b9"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={isSignUp ? signUpWithEmail : signInWithEmail}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.06)', 'rgba(181, 7, 7, 0.15)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log in'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {!isSignUp && (
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={resetPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[
            styles.footer,
            { opacity: fadeAnim },
          ]}>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.footerText}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Text style={styles.footerBoldText}>
                  {isSignUp ? 'Sign In' : 'Sign up'}
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  backgroundLayer1: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width * 1.5,
    height: height * 0.6,
    backgroundColor: '#4d0000',
    borderBottomRightRadius: width * 0.8,
    borderBottomLeftRadius: width * 0.4,
    transform: [{ rotate: '15deg' }],
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  backgroundLayer2: {
    position: 'absolute',
    top: -50,
    right: -100,
    width: width * 1.2,
    height: height * 0.4,
    backgroundColor: '#660000',
    borderBottomLeftRadius: width * 0.6,
    transform: [{ rotate: '-10deg' }],
    shadowColor: '#ff3333',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  backgroundLayer3: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: width * 1.3,
    height: height * 0.3,
    backgroundColor: '#2d0000',
    borderTopRightRadius: width * 0.7,
    transform: [{ rotate: '8deg' }],
    shadowColor: '#990000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 6,
  },
  keyboardContainer: {
    flex: 1,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#cc0000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#cc0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    color: '#ffffff',
    shadowColor: '#b50707',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 56,
  },
  inputFocused: {
    borderColor: '#b50707',
  },
  loginButton: {
    height: 48,
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: 'rgba(181, 7, 7, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  footerBoldText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
})