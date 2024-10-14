// Funcionalidades / Libs:
import axios from "axios";

// Config JSON:
// import api from '../../public/configApi.json';

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
// console.log(API_URL, API_KEY)


// End-Points / Rotas da API:
// Adiciona array de objetos (CREATE):
export async function NUMEROS_CREATE_ALL(qtd, preco) {
   console.log('CALL FUNCTION API');

   let formData = new FormData();
   formData.append('token', API_KEY);
   formData.append('qtd', qtd);
   formData.append('preco', preco);

   const response = await axios.post(API_URL + '/create.php', formData);

   // console.log(response.data);
   return response.data;
}

// Pega todos os Numeros (READ):
export async function NUMEROS_GET_ALL() {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/read.php?token=' + API_KEY);

   // console.log(response.data);
   return response.data;
}

// Pega Numero pelo ID (READ):
export async function NUMEROS_GET_ID(id) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/read.php?token=' + API_KEY + '&id=' + id, { 
      headers: { "Accept": "application/json" }
   });

   // console.log(response.data);
   return response.data;
}

// Filtra por parametro get (READ):
export async function NUMEROS_GET_FILTER(param) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/read.php?token=' + API_KEY + '&' + param.key + '=' + param.value, { 
      headers: { "Accept": "application/json" }
   });

   // console.log(response.data);
   return response.data;
}

// Edita Numero (UPDATE):
export async function NUMEROS_UPDATE_ID(id, obj) {
   console.log('CALL FUNCTION API');

   let formData = new FormData();
   formData.append('token', API_KEY);
   formData.append('id', id);
   formData.append('editObj', JSON.stringify(obj));

   const response = await axios({
      method: 'post',
      url: API_URL + '/update.php',
      data: formData
   });

   // console.log(response.data);
   return response.data;
}