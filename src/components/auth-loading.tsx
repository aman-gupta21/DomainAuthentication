import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function AuthLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3657D6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
});
