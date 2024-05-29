<?php 

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;


// FUNÇÕES:
function createNumbers($qtd, $preco) {
    $createArray = [];

    for($idx = 0; $idx < $qtd; $idx++) {
        $obj = new stdClass;
        $obj->id = $idx + 1;
        $obj->preco = floatval($preco);
        $obj->carrinho = false;
        $obj->comprado = false;
        $obj->comprado_por = null;

        $createArray[] = $obj;
    }

    file_put_contents('db.json', json_encode($createArray, CONSTANTS));

    $jsonFileNovo = file_get_contents('db.json');
    $newJsonDecode = json_decode($jsonFileNovo);
    if(json_last_error()) {
        $response = [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];

        return $response;
    }

    return [
        'success' => true,
        'data' => $newJsonDecode
    ];    
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pega requisição via post
    $qtd = $_POST['qtd'] ?? null; //força ser inteiro
    $preco = $_POST['preco'] ?? 20.0;

    // if(json_last_error()) {
    //     $response = [
    //         'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
    //     ];
    // }
    // else {
        if($qtd && $qtd > 0) {
            $response = createNumbers($qtd, $preco);
        }
        else {
            $response = [
                'erro' => 'Erro no POST'
            ];
        }
    // }

    echo json_encode($response, CONSTANTS);
} else {
    // Se a requisição não for do tipo GET, retorna um erro
    $response = [
        'erro' => 'Método não permitido'
    ];

    http_response_code(405); // Método não permitido
    echo json_encode($response, CONSTANTS); // retorna um objeto
}