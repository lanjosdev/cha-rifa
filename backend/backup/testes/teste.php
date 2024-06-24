<?php
$obj = (object) [
    'id' => 1,
    'nome' => 'Lucas'
];

echo '<pre>';
var_dump($obj);

echo '<pre>';
$obj->nome = 'Maria';
var_dump($obj);