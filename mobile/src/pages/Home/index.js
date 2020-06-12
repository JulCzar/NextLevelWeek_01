import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import Select from 'react-native-picker-select'
import ibge from '../../services/ibge'

import background from '../../assets/home-background.png'
import logo from '../../assets/logo.png'

const Home = () => {

  const [ufList, setUfList] = useState([])
  const [citiesList, setCitiesList] = useState([])

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  const navigation = useNavigation()

  const handleNavigateToPoints = () => {
    navigation.navigate('Points',{uf, city})
  }

  useEffect(() => {
    ibge
      .get('/')
      .then(({data}) => {
        setUfList(data.map(({sigla}) => ({label: sigla, value: sigla})).sort((a,b) => {
          if (a.label > b.label) return 1
          if (b.label > a.label) return -1
          return 0
        }))
      })
  })

  useEffect(() => {
    ibge
      .get(`${uf}/municipios`)
      .then(({data}) => setCitiesList(data
        .map(({nome}) => ({label: nome, value: nome}))))
  }, [uf])

  return (
    <ImageBackground
      source={background}
      style={styles.container}
      imageStyle={styles.imageBg}
    >
      <View style={styles.main} >
        <Image source={logo}/>
        <View>
          <Text style={styles.title}>Seu Marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.input} >
          <Select
            useNativeAndroidPickerStyle={false}
            onValueChange={val => setUf(val)}
            value={uf}
            placeholder={{}}
            items={ufList}
          />
        </View>
        <View style={styles.input} >
          <Select
            useNativeAndroidPickerStyle={false}
            onValueChange={val => setCity(val)}
            value={city}
            placeholder={{}}
            items={citiesList}
          />
        </View>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text style={{color: '#fff'}}>
              <Icon name="arrow-right" size={24} color='white'/>
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    // fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    // fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    padding: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    // fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  imageBg: {
    width: 274,
    height: 368
  }
});

export default Home