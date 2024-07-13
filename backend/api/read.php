<?php
require('../index.php');

// VARIAVEIS:
const CONSTANTS = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION;
$jsonFileString = file_get_contents('../db.json');
$jsonDecode = json_decode($jsonFileString); // array com Objetos


// FUNÇÕES:
function getAllNumbers($jsonDecode) 
{
    // return [
    //     'success' => true,
    //     'data' => $jsonDecode
    // ];
    return $jsonDecode;
}

function getIdNumber($id, $jsonDecode) 
{
    if(isset($jsonDecode[$id - 1])) {
        $objGet = $jsonDecode[$id - 1];
    }
    else {
        return [
            'erro' => 'Item não encontrado'
        ];
    }

    // return [
    //     'success' => true,
    //     'data' => $objGet
    // ]; 
    return $objGet;   
}

function getIdsNumbers($ids, $jsonDecode) 
{
    $resultsBusca = [];

    foreach($ids as $id) {
        if(isset($jsonDecode[$id - 1])) {
            $resultsBusca[] = $jsonDecode[$id - 1];
        }        
    }    

    if(count($resultsBusca) > 0) {
        return $resultsBusca;
    }
    else {
        return [
            'erro' => 'Nenhum item encontrado'
        ];
    }  
}
function getParamsNumbers($param, $op, $jsonDecode) 
{
    $resultsBusca = [];

    switch($op) {
        case 1:
            //echo "carrinho \n";
            
            foreach($jsonDecode as $item) {
                $strCarrinho = json_encode($item->carrinho);
                if($strCarrinho == $param) {
                    $resultsBusca[] = $item;
                }        
            }   
            break;         
        case 2:
            //echo "comprado_por \n";

            foreach($jsonDecode as $item) {
                $strComprador = $item->comprado_por;
                if($param === 'null') {
                    $strComprador = json_encode($item->comprado_por);
                }
                
                if($strComprador === $param) {
                    $resultsBusca[] = $item;
                }      
            }  
            break;
        default:
            return [
                'erro' => 'Opção de parametro invalido'
            ];
            break;
    }    

    if(count($resultsBusca) > 0) {
        return $resultsBusca;
    }
    else {
        return [
            'erro' => 'Nenhum item encontrado'
        ];
    }  
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
        $carrinho = $_GET['carrinho'] ?? null;
        $comprado_por = $_GET['comprado_por'] ?? null;

        if($id) {
            if(strpos($id, ",")) {
                //echo "por array \n";

                $ids = explode(",", $id);
                $response = getIdsNumbers($ids, $jsonDecode);
            }
            else {
                //echo "por id \n";

                $id = intval($id);
                $response = getIdNumber($id, $jsonDecode);
            }
        }
        else if($carrinho || isset($comprado_por)) {
            echo "por params \n";

            if($carrinho) {
                $response = getParamsNumbers($carrinho, 1, $jsonDecode);
            }
            else {
                $response = getParamsNumbers($comprado_por, 2, $jsonDecode);
            }
        }
        else if($id === null) {
            //echo "get All \n";

            $response = getAllNumbers($jsonDecode);            
        } 
        else {
            $response = [
                'erro' => 'Parametro sem valor'
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