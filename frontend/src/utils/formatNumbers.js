export function formatarCasasNumero(numero, tamanho=3) {
    return numero.toString().padStart(tamanho, '0');
}
