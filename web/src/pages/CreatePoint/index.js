import { Map, TileLayer, Marker } from 'react-leaflet'
import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import Dropzone from '../../components/dropzone'

import api from '../../services/api'
import ibge from '../../services/ibge'

import './styles.css'

import logo from '../../assets/logo.svg'

const CreatePoint = () => {
  const [formSent, setFormSent] = useState(false)
  const [ufs, setUfs] = useState([])
  const [items, setItems] = useState([])
  const [cities, setCities] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [initialPos, setInitialPos] = useState([0,0])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedPos, setSelectedPos] = useState([0,0])
  const [selectedFile, setSelectedFile] = useState()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => setInitialPos([latitude, longitude]))}
  , [])
  useEffect(() => {
    api.get('items').then(({data}) => setItems(data))}
  , [])
  useEffect( () => {
    ibge.get('/').then(({data}) => setUfs(data.map(({sigla}) => sigla).sort()))
  }, [])

  useEffect(() => {
    if(selectedUf !== '0')
      ibge
        .get(`${selectedUf}/municipios`)
        .then(({data}) => setCities(data.map(({nome}) => nome)))
  },[selectedUf])

  const handleSelectUf = evt => setSelectedUf(evt.target.value)
  const handleSelectCity = evt => setSelectedCity(evt.target.value)
  const handleMapClick = ({latlng}) => setSelectedPos([latlng.lat, latlng.lng])
  const handleInputChange = ({target: {name, value}}) => setFormData({...formData, [name]: value})
  const handleSelectItem = id => {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected > -1) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    }else
      setSelectedItems([...selectedItems, id])
  }

  const handleFormSubmit = async evt => {
    evt.preventDefault()

    const { name, email, whatsapp } = formData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPos
    const items = selectedItems

    const data = new FormData()

    
    data.append('uf', uf)
    data.append('city', city)
    data.append('name', name)
    data.append('email', email)
    data.append('whatsapp', whatsapp)
    data.append('items', items.join(','))
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    if (selectedFile) data.append('image', selectedFile)
    

    await api.post('points', data)
    setFormSent(true)
    setTimeout(() => history.push('/'), 2000)
  }

  return (
    <>
      <div className={formSent?"form-sent-container":"hide"}>
        <div className="form-sent">
          <FiCheckCircle className="icon"/>
          <div className="title">Cadastro concluído!</div>
        </div>
      </div>

      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta"/>
          <Link to="/">
            <FiArrowLeft />
            Voltar para a home
          </Link>
        </header>

        <form onSubmit={handleFormSubmit}>
          <h1>Cadastro do<br/>ponto de coleta</h1>

          <Dropzone onUpload={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da Entidade</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPos} zoom={15} onClick={handleMapClick}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
              <Marker position={selectedPos}/>
            </Map>

            <div className="field-group">

              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                  <option value="0">Selecione uma UF</option>
                  {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                  <option value="0">Selecione uma Cidade</option>
                  {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítems de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(({id, img_url, title}) => (
                <li
                  key={id}
                  onClick={() => handleSelectItem(id)}
                  className={selectedItems.includes(id)?'selected':''}
                >
                  <img src={img_url} alt={title}/>
                  <span>{title}</span>
                </li>
              ))}
              
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de Coleta</button>
        </form>
      </div>
    </>
  )
}

export default CreatePoint