<?php
require('index.php');
// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('db.json');
$jsonDecode = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function getAllNumbers($jsonDecode) {
    
    return [
        'success' => true,
        'data' => $jsonDecode
    ];
}

function getIdNumber($id, $jsonDecode) {
    if(isset($jsonDecode[$id - 1])) {
        $objGet = $jsonDecode[$id - 1];
    }
    else {
        return [
            'erro' => 'Item não encontrado'
        ];
    }

    return [
        'success' => true,
        'data' => $objGet
    ];    
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(json_last_error()) {
        $response = [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];
    }
    else {
        $id = $_GET['id'] ?? null;

        if($id) {
            //get por id:
            $id = intval($id);
            $response = getIdNumber($id, $jsonDecode);
        }
        else if($id === null) {
            // get All:
            $response = getAllNumbers($jsonDecode);            
        } 
        else {
            $response = [
                'erro' => 'Parametro Invalido'
            ];
        }
    }

    echo json_encode($response, CONSTANTS);
} 
else {
    // Se a requisição não for do tipo GET, retorna um erro
    $response = [
        'erro' => 'Método não permitido'
    ];

    http_response_code(405); // Método não permitido
    echo json_encode($response, CONSTANTS); // retorna um objeto
}