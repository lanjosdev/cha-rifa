<?php 

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('db.json');
$jsonDeco = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function updateNumber($id, $objEdit, $jsonDeco) {
    $jsonDeco[$id - 1] = $objEdit;

    file_put_contents('db.json', json_encode($jsonDeco, CONSTANTS));

    $jsonFileAtualizado = file_get_contents('db.json');
    $newJsonDecode = json_decode($jsonFileAtualizado);
    if(json_last_error()) {
        $response = [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];

        return $response;
    }

    return [
        'success' => true,
        'data' => $newJsonDecode[$id - 1]
    ];    
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pega requisição via post
    $id = intval($_POST['id']); //força ser inteiro
    $objEdit = json_decode(($_POST['editObj'])); //força ser obj??? melhor(object)?

    if(json_last_error()) {
        $response = [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];

        echo json_encode($response, CONSTANTS);
    }
    else {
        if($id == $objEdit->id) {
            $response = updateNumber($id, $objEdit, $jsonDeco);
        }
        else {
            $response = [
                'erro' => 'Erro no POST'
            ];
        }

        echo json_encode($response, CONSTANTS);
    }
} else {
    // Se a requisição não for do tipo GET, retorna um erro
    $response = [
        'erro' => 'Método não permitido'
    ];

    http_response_code(405); // Método não permitido
    echo json_encode($response, CONSTANTS); // retorna um objeto
}