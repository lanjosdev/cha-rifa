// Config JSON:
import api from './configAPI.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points / Rotas da API:
// READ //
// Pega todos os Numbers db.json (READ):
export async function NUMBERS_GET_ALL() {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/read.php', {
        headers: { "Accept": "application/json" },
   });

   // console.log(response.data);
   return response.data;
}
// READ //




// Pega Grupo pelo ID (READ):
export async function GRUPO_GET_ID(idGrupo) {
   console.log('CALL FUNCTION API');
   const response = await axios.get(API_URL + '/grupo/' + idGrupo, { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Adiciona novo Grupo (CREATE):
export async function GRUPO_POST_ADD(grupo) {
   console.log('CALL FUNCTION API');
   const response = await axios.post(API_URL + '/grupo', {
      "nome": grupo
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Edita nome do Grupo (UPDATE):
export async function GRUPO_POST_EDIT(idGrupo, newNome) {
   console.log('CALL FUNCTION API');
   const response = await axios.post(API_URL + '/grupo/' + idGrupo, {
      "nome": newNome,
      "_method": "patch"
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Deletar Grupo (DELETE):
export async function GRUPO_DELETE(idGrupo) {
   console.log('CALL FUNCTION API');
   const response = await axios.delete(API_URL + '/grupo/' + idGrupo, {
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}
// GRUPOS END //
