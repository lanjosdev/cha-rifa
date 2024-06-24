<?php
require('index.php');
// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('./db.json');
$jsonDecode = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function updateItem($id, $objEdit, $jsonDecode) {
    $objEdit->preco = floatval($objEdit->preco);
    if(isset($jsonDecode[$id - 1])) {
        $jsonDecode[$id - 1] = $objEdit;
    }
    else {
        return [
            'erro' => 'ID não encontrado'
        ];
    }

    $newFileString = file_put_contents('./db.json', json_encode($jsonDecode, CONSTANTS));

    // usar essa logica no create OU verificar permissões de edição de arquivo no dev1 ???
    if($newFileString) {
        $jsonFileAtualizado = file_get_contents('./db.json');
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

    if(isset($id) && isset($objEdit)) {
        $objEdit = json_decode($objEdit); //recebe em string e transforma em obj/array

        if(json_last_error()) {
            $response = [
                'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
            ];
        } 
        else if($id == $objEdit->id) {
            $response = updateItem(intval($id), $objEdit, $jsonDecode);
        } 
        else {
            $response = [
                'erro' => 'Erro de conflito'
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