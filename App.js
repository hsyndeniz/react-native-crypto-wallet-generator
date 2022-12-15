import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getHDWallet } from './hdwallet'

const App = () => {
  const [wallet, setWallet] = React.useState(null)

  React.useEffect(() => {
    const wallet = getHDWallet(0)
    setWallet(wallet)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text>
        {
          JSON.stringify(wallet, null, 2)
        }
      </Text>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})