const confirmacao = document.getElementById('confirmacao');
const agendamentosDiv = document.getElementById('agendamentos');
const form = document.getElementById('formAgendamento');
const dataInput = document.getElementById('data');
const horaSelect = document.getElementById('hora');

const agendamentoArea = document.getElementById('agendamentoArea');
const loginArea = document.getElementById('loginArea');
const painelArea = document.getElementById('painelArea');

const hoje = new Date().toISOString().split("T")[0];
dataInput.min = hoje;

function gerarHorarios() {
  horaSelect.innerHTML = ""; // Limpa opções anteriores
  for (let h = 6; h <= 22; h++) {
    const hora = h.toString().padStart(2, '0') + ":00";
    horaSelect.innerHTML += `<option value="${hora}">${hora}</option>`; // Adicionado value="${hora}"
  }
}

dataInput.addEventListener('change', () => {
  const dataSelecionada = new Date(dataInput.value + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso horário
  const diaDaSemana = dataSelecionada.getDay();

  // getDay() retorna 0 para Domingo, 1 para Segunda, ..., 6 para Sábado
  // Queremos bloquear agendamentos às segundas-feiras (diaDaSemana === 1)
  if (diaDaSemana === 1) {
    alert("Agendamentos apenas de terça a domingo.");
    dataInput.value = ""; // Limpa a data inválida
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value; // Campo de telefone adicionado
  const servico = document.getElementById('servico').value;
  const profissional = document.getElementById('profissional').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  // Validação básica para campos obrigatórios (embora o HTML 'required' já ajude)
  if (!nome || !telefone || !servico || !profissional || !data || !hora) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const agendamento = { nome, telefone, servico, profissional, data, hora };
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.push(agendamento);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  // Formata a data para exibição (DD/MM/AAAA)
  const [ano, mes, dia] = data.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  confirmacao.style.display = "block";
  confirmacao.innerHTML = `<strong>Agendamento confirmado!</strong><br>
                            Nome: ${nome}<br>
                            Telefone: ${telefone}<br>
                            Serviço: ${servico}<br>
                            Profissional: ${profissional}<br>
                            Data: ${dataFormatada}<br>
                            Hora: ${hora}`;

  form.reset();
  //dataInput.min = hoje; // Reaplicar o min após o reset, se necessário, mas gerarHorarios já é chamado
  gerarHorarios(); // Regera os horários, o que também limpa a seleção
});

function mostrarLogin() {
  agendamentoArea.classList.add("hidden");
  loginArea.classList.remove("hidden");
  document.getElementById('loginErro').style.display = "none"; // Esconde erro ao mostrar login
  document.getElementById('loginUser').value = ""; // Limpa campos de login
  document.getElementById('loginPass').value = "";
}

function voltar() {
  loginArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
  confirmacao.style.display = "none"; // Esconde confirmação ao voltar
}

function fazerLogin() {
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
  const erro = document.getElementById('loginErro');

  if ((user === "mayra" || user === "karina") && pass === "studiohema") {
    loginArea.classList.add("hidden");
    painelArea.classList.remove("hidden");
    carregarAgendamentos();
    erro.style.display = "none";
  } else {
    erro.style.display = "block";
  }
}

function carregarAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentosDiv.innerHTML = ""; // Limpa a lista antes de recarregar

  if (agendamentos.length === 0) {
    agendamentosDiv.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
    return;
  }

  // Ordena os agendamentos por data e hora antes de exibir
  agendamentos.sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return dataHoraA - dataHoraB;
  });


  agendamentos.forEach((a) => {
    const [ano, mes, dia] = a.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    agendamentosDiv.innerHTML += `
      <div class="agenda-item">
        <strong>${a.nome}</strong> (${a.telefone}) - ${a.servico}<br>
        Profissional: ${a.profissional}<br>
        Data: ${dataFormatada} às ${a.hora}
      </div>`;
  });
}

function logout() {
  painelArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
  confirmacao.style.display = "none"; // Esconde confirmação ao deslogar
}

// Chama gerarHorarios quando a página carrega
window.onload = function() {
    gerarHorarios();
    dataInput.min = hoje; // Garante que a data mínima seja definida no carregamento
};
