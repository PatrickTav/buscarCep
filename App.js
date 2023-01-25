import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import api from './src/service/api';

// Expressão regular para validar apenas numeros
const onlyNumbers = new RegExp('^[0-9]+$');

export default function App() {
  const [zipUser, setZipUser] = useState(null);
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  function clearInput() {
    setZip('');
    setZipUser(null);
    inputRef.current.focus();
  }

  async function handleSearchZip() {
    if (zip === '' || !onlyNumbers.test(zip)) {
      alert('Digite um cep válido!');
      setZip('');
      return;
    }
    if (zip.length > 8 || zip.length < 8) {
      alert('Seu cep precisa ter 8 números');
      setZip('');
      return;
    }

    try {
      setZipUser(null);
      setLoading(true);
      Keyboard.dismiss();
      const res = await api.get(`/${zip}/json`);
      setZipUser(res.data);
      setLoading(false);

    } catch (error) {
      callbackErro(error)
    }
  }

  function callbackErro(e){  
    if (!e) {
    setZipUser(null)
    }
}
  console.log(zipUser)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaZip}>
        <Text style={styles.textAreaZip}>Digite um CEP</Text>
        <TextInput
          value={zip}
          style={styles.inputAreaZip}
          placeholder="Ex: 66995150"
          onChangeText={textValue => setZip(textValue)}
          keyboardType={'numeric'}
          ref={inputRef}
        />
      </View>

      <View style={styles.areaButton}>
        <TouchableOpacity
          style={[styles.areaTextButton, {backgroundColor: '#D9B70D'}]}
          onPress={handleSearchZip}>
          <Text style={styles.textButton}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.areaTextButton, {backgroundColor: '#D92B04'}]}
          onPress={clearInput}>
          <Text style={styles.textButton}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator color="#000" size={45} />
        </View>
      )}

      {zipUser && (
        <View style={styles.areaShowZip}>
          <Text style={styles.showTextZip}>
            Cep: <Text style={styles.contentTextZip}>{zipUser.cep}</Text>
          </Text>
          <Text style={styles.showTextZip}>
            Logradouro:{' '}
            <Text style={styles.contentTextZip}>{zipUser.logradouro}</Text>
          </Text>
          <Text style={styles.showTextZip}>
            Bairro: <Text style={styles.contentTextZip}>{zipUser.bairro}</Text>
          </Text>
          <Text style={styles.showTextZip}>
            Cidade:{' '}
            <Text style={styles.contentTextZip}>{zipUser.localidade}</Text>
          </Text>
          <Text style={styles.showTextZip}>
            Estado: <Text style={styles.contentTextZip}>{zipUser.uf}</Text>
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textAreaZip: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  areaZip: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputAreaZip: {
    marginTop: 5,
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
  },
  areaButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  areaTextButton: {
    padding: 15,
    borderRadius: 10,
  },
  textButton: {
    fontSize: 20,
    color: '#000',
    fontWeight: 900,
  },
  areaShowZip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showTextZip: {
    fontSize: 25,
    color: '#000',
    textAlign:'center'
  },
  contentTextZip: {
    fontStyle: 'italic',
    color: '#38565C',
  },
});
