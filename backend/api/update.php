<?php
require('../index.php');

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('../db.json');
$jsonDecode = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function updateItem($id, $objEdit, $jsonDecode) {
    $objEdit->id = $id;
    $objEdit->preco = floatval($objEdit->preco);
    if(isset($jsonDecode[$id - 1])) {
        date_default_timezone_set('America/Sao_Paulo'); // Defina o fuso horário
        $dataHora = date('d/m/Y H:i:s');
        // echo "Data e hora atual: $dataHora";
        $objEdit->update = $dataHora;

        $jsonDecode[$id - 1] = $objEdit;
    }
    else {
        return [
            'erro' => 'ID não encontrado'
        ];
    }

    $newFileString = file_put_contents('../db.json', json_encode($jsonDecode, CONSTANTS));
    
    if($newFileString) {
        $jsonFileAtualizado = file_get_contents('../db.json');
        $newJsonDecode = json_decode($jsonFileAtualizado);
        if(json_last_error()) {
            return [
                'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
            ];
        }

        return $newJsonDecode[$id - 1]; 
    }
    else {
        return [
            'erro' => 'Houve algum erro ao salvar no arquivo'
        ];
    }   
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pega requisição via post
    $id = $_POST['id'] ?? null;
    $objEdit = $_POST['editObj'] ?? null;
    $token = $_POST['token'] ?? null;

    if(isset($id) && isset($objEdit)) {
        if($token == $API_KEY) {
            $id = intval($id);
            $objEdit = json_decode($objEdit); //recebe em string e transforma em obj/array

            if(json_last_error()) {
                $response = [
                    'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
                ];
            }
            else if($id > 0) {
                // var_dump($id);
                // var_dump($objEdit);
                $response = updateItem($id, $objEdit, $jsonDecode);
            }
            else {
                $response = [
                    'erro' => 'ID não definido'
                ];
            }
        }
        else {
            $response = [
                'erro' => 'Token inválido'
            ];
        }
    }
    else {
        $response = [
            'erro' => 'Erro no POST'
        ];
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