import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import {
  Camera,
  Moon,
  Sun,
  Key,
  Bell,
  Globe,
  LogOut,
  Fingerprint,
  Settings,
} from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth';
import { router } from 'expo-router';
import { profileStyles } from '@/styles/screens/app/profile.styles';

export default function ProfileScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [image, setImage] = useState<string | null>(null);
  const {
    user,
    logout,
    loginWithBiometrics,
    updateUserAvatar,
    toggleBiometrics,
    isBiometricsEnabled,
  } = useAuthStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await updateUserAvatar(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await updateUserAvatar(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleBiometricsToggle = async () => {
    try {
      await toggleBiometrics();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const MenuItem = ({ icon: Icon, title, onPress, value }: any) => (
    <TouchableOpacity
      style={[
        profileStyles.menuItem,
        { borderBottomColor: theme.colors.border },
      ]}
      onPress={onPress}
    >
      <View style={profileStyles.menuItemLeft}>
        <Icon size={20} color={theme.colors.primary} />
        <Text
          style={[profileStyles.menuItemText, { color: theme.colors.text }]}
        >
          {title}
        </Text>
      </View>
      {value && (
        <Text
          style={[
            profileStyles.menuItemValue,
            { color: theme.colors.textSecondary },
          ]}
        >
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        profileStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={profileStyles.header}>
        <Text style={[profileStyles.title, { color: theme.colors.text }]}>
          Perfil
        </Text>
      </View>

      <View style={profileStyles.profileSection}>
        <View
          style={[
            profileStyles.avatarContainer,
            { borderColor: isDarkMode ? '#FFF' : '#000' }, // Moldura com base no tema
          ]}
        >
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require('@/assets/images/user-profile.png')
            }
            style={profileStyles.avatar}
            contentFit="cover"
          />
          <View style={profileStyles.photoButtons}>
            <TouchableOpacity
              style={[
                profileStyles.photoButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={takePhoto}
            >
              <Camera size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                profileStyles.photoButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={pickImage}
            >
              <Text style={profileStyles.photoButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[profileStyles.name, { color: theme.colors.text }]}>
          {user?.name || 'Usuário'}
        </Text>
        <Text
          style={[profileStyles.email, { color: theme.colors.textSecondary }]}
        >
          {user?.email || 'usuario@exemplo.com'}
        </Text>
      </View>

      <View
        style={[
          profileStyles.menuSection,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <MenuItem
          icon={isDarkMode ? Sun : Moon}
          title="Modo Escuro"
          onPress={toggleTheme}
          value={isDarkMode ? 'Ativado' : 'Desativado'}
        />
        {Platform.OS !== 'web' && (
          <MenuItem
            icon={Fingerprint}
            title="Login Biométrico"
            onPress={handleBiometricsToggle}
            value={isBiometricsEnabled ? 'Ativado' : 'Desativado'}
          />
        )}
        <MenuItem icon={Key} title="Alterar Senha" onPress={() => {}} />
        <MenuItem icon={Bell} title="Notificações" onPress={() => {}} />
        {/* 
        <MenuItem 
          icon={Globe} 
          title="Idioma" 
          value="Português" 
          onPress={() => {}} 
        />
        */}
        <MenuItem
          icon={Settings}
          title="Administração"
          onPress={() => router.push('/admin')}
        />
      </View>

      <TouchableOpacity
        style={[
          profileStyles.logoutButton,
          { backgroundColor: theme.colors.error },
        ]}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FFF" />
        <Text style={profileStyles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
