import React, { useEffect, useState } from 'react'
import Constants from 'expo-constants'
import { FontAwesome as Icon } from '@expo/vector-icons' 
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'

const Points = () => {
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [initialPos, setInitialPos] = useState([0, 0])
  const [points, setPoints] = useState([])

  const navigation = useNavigation()
  const { params: { uf, city }} = useRoute()
  
  useEffect(() => {
    api.get('items').then(({data}) => setItems(data))
  })

  useEffect(() => {
    const loadPosition = async () => {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos da sua permissão para obter a localização')
        return
      }
  
      const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync()

      setInitialPos([ latitude, longitude ])
    }

    loadPosition()
  }, [])

  useEffect(() => {
    api.get(`points?city=${city}&uf=${uf}&items=${selectedItems.join(',')}`).then(({data}) => setPoints(data))
  }, [selectedItems])

  const handleNavigateBack = () => navigation.goBack()
  const handleNavigateToDetail = id => navigation.navigate('Detail', {id})
  const handleSelectItem = id => {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected > -1) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    }else
      setSelectedItems([...selectedItems, id])
  }
  
  return (
    <>
      <View style={styles.container} >
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"/>
          <Text>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer} >
          { initialPos && (
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: Number(initialPos[0]),
                longitude: Number(initialPos[1]),
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              { points.map(({id, image, name, latitude, longitude}) => (
                <Marker
                  key={String(id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(id)}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer} >
                    <Image style={styles.mapMarkerImage} source={{ uri: image }}/>
                    <Text style={styles.mapMarkerTitle} >{name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer} >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 32
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {items.map(({id, title, img_url}) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={String(id)}
              style={[
                styles.item,
                selectedItems.includes(id)?styles.selectedItem:{}
              ]}
              onPress={() => handleSelectItem(id)}
            >
              <SvgUri width={42} hight={42} uri={img_url} />
              <Text style={styles.itemTitle}>{title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    // fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    // fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    // fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    // fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points