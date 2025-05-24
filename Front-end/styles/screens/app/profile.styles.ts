import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    borderWidth: 4, // Espessura da moldura
    borderRadius: 64, // Deve ser maior que o raio do avatar
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: -20,
    bottom: 0,
    gap: 8,
  },
  photoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#FFF',
    fontSize: 24,
    marginTop: -2,
  },
  name: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  menuSection: {
    marginTop: 24,
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  menuItemValue: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
