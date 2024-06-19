// Config JSON:
import api from './configAPI.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points / Rotas da API:
// Adiciona array de objetos (CREATE):
export async function NUMEROS_CREATE_ALL(arrayObjs) {
   console.log('CALL FUNCTION API');

   const response = await axios({
      method: "put",
      url: API_URL + '/numeros',
      data: arrayObjs,
      headers: { 
         "Accept": "application/json",
         'Access-Control-Allow-Origin': '*',
      } 
   });

   // console.log(response.data);
   return response.data;
}


// Pega todos os Numeros (READ):
export async function NUMEROS_GET_ALL() {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/numeros', {
      headers: { "Accept": "application/json" },
   });

   // console.log(response.data);
   return response.data;
}

// Pega Numero pelo ID (READ):
export async function NUMEROS_GET_ID(id) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/numeros/' + id, { 
      headers: { "Accept": "application/json" }
   });

   // console.log(response.data);
   return response.data;
}

// Filtra por parametro get (READ):
export async function NUMEROS_GET_FILTER(param) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/numeros?' + param.key + '=' + param.value, { 
      headers: { "Accept": "application/json" }
   });

   // console.log(response.data);
   return response.data;
}

// Edita Numero (UPDATE):
export async function NUMEROS_UPDATE_ID(id, newObj) {
   console.log('CALL FUNCTION API');
   
   const response = await axios.put(API_URL + '/numeros/' + id, newObj, { 
      headers: { "Accept": "application/json" }
   });
   // const response = await axios({
   //    method: "put",
   //    url: API_URL + '/numeros/' + id,
   //    data: newObj,
   //    headers: {
   //       "Accept": "application/json",
   //       'Access-Control-Allow-Origin': '*',
   //    } 
   // });

   // console.log(response.data);
   return response.data;
}