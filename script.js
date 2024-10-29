const horarioSelect = document.getElementById('horario');
const dataInput = document.getElementById('data');
const nomeInput = document.getElementById('nome');
const numeroInput = document.getElementById('numero');
const mensagemDiv = document.getElementById('mensagem');
const agendamentosList = document.getElementById('agendamentosList');

document.addEventListener('DOMContentLoaded', carregarAgendamentos);
dataInput.addEventListener('change', atualizarHorarios);
horarioSelect.addEventListener('change', () => {
    mensagemDiv.textContent = ''; // Limpa a mensagem ao mudar o horário
});

document.getElementById('agendar').addEventListener('click', agendar);

function atualizarHorarios() {
    const data = new Date(dataInput.value);
    const diaDaSemana = data.getDay();
    
    // Limpa horários anteriores
    horarioSelect.innerHTML = '';

    // Verifica se a data está dentro dos dias de funcionamento (terça a domingo)
    if (diaDaSemana < 2 || diaDaSemana > 6) {
        mensagemDiv.textContent = 'A barbearia está fechada nas segundas-feiras.';
        return;
    }

    // Adiciona horários disponíveis
    for (let i = 10; i <= 21; i++) {
        const option = document.createElement('option');
        option.value = `${i}:00`;
        option.textContent = `${i}:00`;
        horarioSelect.appendChild(option);
    }
}

function agendar() {
    const nome = nomeInput.value;
    const numero = numeroInput.value;
    const procedimento = document.getElementById('procedimento').value;
    const data = dataInput.value;
    const horario = horarioSelect.value;

    if (!nome || !numero || !data || !horario) {
        mensagemDiv.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    const agendamento = {
        nome,
        numero,
        procedimento,
        data,
        horario
    };

    salvarAgendamento(agendamento);
    mensagemDiv.textContent = `Agendamento realizado para ${procedimento} no dia ${data} às ${horario}.`;
    carregarAgendamentos();
}

function salvarAgendamento(agendamento) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function carregarAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentosList.innerHTML = '';

    agendamentos.forEach(agendamento => {
        const li = document.createElement('li');
        li.textContent = `Nome: ${agendamento.nome}, Telefone: ${agendamento.numero}, Procedimento: ${agendamento.procedimento}, Data: ${agendamento.data}, Horário: ${agendamento.horario}`;
        agendamentosList.appendChild(li);
    });
}
