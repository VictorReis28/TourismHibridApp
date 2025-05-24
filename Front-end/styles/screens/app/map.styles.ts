import { StyleSheet } from 'react-native';

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginTop: 4,
  },
  attractionsList: {
    flex: 1,
  },
  attractionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  attractionImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  attractionInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  attractionName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 8,
  },
  attractionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});