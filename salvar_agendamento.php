<?php
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $arquivo = 'agendamentos.txt';
    $linha = implode(' | ', [
        $data['nome'],
        $data['telefone'],
        $data['servico'],
        $data['profissional'],
        $data['data'],
        $data['hora']
    ]) . PHP_EOL;

    file_put_contents($arquivo, $linha, FILE_APPEND | LOCK_EX);
    echo json_encode(['status' => 'sucesso']);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados inválidos']);
}
?>
