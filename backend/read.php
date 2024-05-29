<?php 

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('db.json');
$jsonDeco = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function getAllNumbers($jsonDeco) {
    // echo json_encode([
    //     'success' => true,
    //     'data' => [5, 4, 3.0]
    // ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
    
    return [
        'success' => true,
        'data' => $jsonDeco
    ];
}

function getIdNumber($id, $jsonDeco) {
    // $sql_code = "SELECT * FROM clientes WHERE id=$idCliente";
    $itemGet = $jsonDeco[$id - 1]; // Objeto [idx]

    return [
        'success' => true,
        'data' => $itemGet
    ];    
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(json_last_error()) {
        $response = [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];

        echo json_encode($response, CONSTANTS);
    }
    else {
        $id = $_GET['id'] ?? null;

        if($id) {
            //get por id:
            $response = getIdNumber($id, $jsonDeco);
        }
        else {
            // get All:
            $response = getAllNumbers($jsonDeco);
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