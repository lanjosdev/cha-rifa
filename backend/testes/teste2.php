<?php
$lista = array(
    'id' => 1,
    'nome' => 'Lucas'
);

echo '<pre>';
// $obj = json_decode(json_encode($lista));
$obj = json_decode('{"nome":"Lol"}');
var_dump($obj);

// echo '<pre>';
// $obj->nome = 'Maria';
// var_dump($obj);