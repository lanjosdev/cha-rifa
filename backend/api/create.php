<?php
require('../index.php');

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;


// FUNÇÕES:
function createNumbers($qtd, $preco) 
{
    $createArray = [];

    for($idx = 0; $idx < $qtd; $idx++) {
        $obj = new stdClass; //cria um objeto
        $obj->id = $idx + 1;
        $obj->preco = $preco;
        $obj->carrinho = false;
        $obj->comprado_por = null;
        $obj->contato = null;
        $obj->update = null;

        //Colocar [$idx]?
        $createArray[] = $obj;
    }

    // Cria novo ou sobreescreve arquivo "db.json"
    file_put_contents('../db.json', json_encode($createArray, CONSTANTS));

    // Verifica se o arquivo foi escrito corretamente
    $jsonFileNovo = file_get_contents('../db.json');
    $newJsonDecode = json_decode($jsonFileNovo);
    if(json_last_error()) {
        return [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];
    }

    return $createArray;    
}

function createNumber($newObj)
{
    $dbJsonArray = json_decode(file_get_contents('../db.json'));
    if(json_last_error()) {
        return [
            'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
        ];
    }

    $lastObjDB = $dbJsonArray[count($dbJsonArray) - 1];
    $newObj->id = $lastObjDB->id + 1;

    $dbJsonArray[] = $newObj;
    

    //Salva nova lista no arquivo db.json
    $newFileString = file_put_contents('../db.json', json_encode($dbJsonArray, CONSTANTS));

    if($newFileString) {
        $newDbJsonArray = json_decode(file_get_contents('../db.json'));
        if(json_last_error()) {
            return [
                'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
            ];
        }

        return $newDbJsonArray[count($dbJsonArray) - 1]; 
    }
    else {
        return [
            'erro' => 'Houve algum erro ao salvar no arquivo'
        ];
    }
    //return $dbJsonArray;
}


// REQUESTS & RESPONSES:
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pega requisição via post
    $qtd = $_POST['qtd'] ?? null;
    $preco = $_POST['preco'] ?? 15.0;
    //OU
    $newObj = $_POST['newObj'] ?? null; //sem precisar da prop id

    if(isset($qtd) && $qtd > 0) {
        $response = createNumbers(intval($qtd), floatval($preco));
    }
    else if(isset($newObj) && $newObj != null) {
        $newObj = json_decode($newObj); //recebe em string e transforma em obj/array
        //var_dump($newObj);
        if(json_last_error()) {
            $response = [
                'erro' => 'Erro de JSON: Code (' . json_last_error() . ')'
            ];
        } 

        $response = createNumber($newObj);
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