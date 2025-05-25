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
  horaSelect.innerHTML = "";
  for (let h = 6; h <= 22; h++) {
    const hora = h.toString().padStart(2, '0') + ":00";
    horaSelect.innerHTML += `<option>${hora}</option>`;
  }
}

dataInput.addEventListener('change', () => {
  const dia = new Date(dataInput.value).getDay();
  if (dia === 1) {
    alert("Agendamentos apenas de terça a domingo.");
    dataInput.value = "";
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const profissional = document.getElementById('profissional').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const agendamento = { nome, telefone, servico, profissional, data, hora };
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.push(agendamento);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  fetch('salvar_agendamento.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agendamento)
  }).then(res => res.json()).then(data => {
    if (data.status !== 'sucesso') {
      console.error("Erro ao salvar no backend:", data.mensagem);
    }
  }).catch(err => console.error("Erro de rede:", err));

  confirmacao.style.display = "block";
  confirmacao.innerHTML = `<strong>Agendamento confirmado!</strong><br>Nome: ${nome}<br>Telefone: ${telefone}<br>Serviço: ${servico}<br>Profissional: ${profissional}<br>Data: ${data}<br>Hora: ${hora}`;

  form.reset();
  gerarHorarios();
});

function mostrarLogin() {
  agendamentoArea.classList.add("hidden");
  loginArea.classList.remove("hidden");
}

function voltar() {
  loginArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
}

function fazerLogin() {
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
  const erro = document.getElementById('loginErro');

  if ((user === "mayra" || user === "karina") && pass === "studiohema") {
    loginArea.classList.add("hidden");
    painelArea.classList.remove("hidden");
    carregarAgendamentos();
  } else {
    erro.style.display = "block";
  }
}

function carregarAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentosDiv.innerHTML = "";
  agendamentos.forEach((a) => {
    agendamentosDiv.innerHTML += `
      <div class="agenda-item">
        <strong>${a.nome}</strong> - ${a.servico}<br>
        Telefone: ${a.telefone}<br>
        Profissional: ${a.profissional}<br>
        Data: ${a.data} às ${a.hora}
      </div>`;
  });
}

function logout() {
  painelArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
}

window.onload = gerarHorarios;
