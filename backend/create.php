<?php
require('index.php');
// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;


// FUNÇÕES:
function createNumbers($qtd, $preco) {
    //Mudara para =array() e testar no dev1
    $createArray = [];

    for($idx = 0; $idx < $qtd; $idx++) {
        //Cria objeto mesmo OU array usando (object)
        $obj = new stdClass;
        $obj->id = $idx + 1;
        $obj->preco = floatval($preco); //retira floatval para teste no dev1
        $obj->carrinho = false;
        $obj->comprado_por = null;

        //Colocar [$idx] e testar no dev1 ???
        $createArray[$idx] = $obj;
    }

    // Cria novo ou sobreescreve arquivo "db.json"
    file_put_contents('db.json', json_encode($createArray, CONSTANTS));

    // Verifica se o arquivo foi escrito corretamente
    $jsonFileNovo = file_get_contents('db.json');
    $newJsonDecode = json_decode($jsonFileNovo);
    if(json_last_error()) {
        return [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];
    }

    return [
        'success' => true,
        'data' => $createArray
    ];    
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pega requisição via post
    $qtd = intval($_POST['qtd']) ?? null;
    $preco = $_POST['preco'] ?? 20.0;

    if($qtd && $qtd > 0) {
        $response = createNumbers($qtd, $preco);
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