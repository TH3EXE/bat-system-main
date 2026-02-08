// js/prestadores.js
// Lógica para a página prestadores.html
// (Controle das Sub-Abas + Lógica de Pesquisa)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENTOS DA PÁGINA ---
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanels = document.querySelectorAll('.sub-tab-panel');
    
    // Elementos da Pesquisa
    const searchInput = document.getElementById('prestadores-search-input');
    const noResultsMsg = document.getElementById('prestadores-no-results');

    if (!searchInput) return; // Sai se não estiver na página certa 

    // --- 2. FUNÇÕES ---

    // Função para normalizar strings (remove acentos, minúsculas)
    function normalizarString(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Função principal de filtro (em tempo real)
    function filtrarTabelasAtivas() {
        const searchTerm = normalizarString(searchInput.value);
        let matchesFound = 0;

        // 1. Descobre qual aba está ativa
        // ATUALIZAÇÃO: Seletor agora busca qualquer painel ativo
        const activePanel = document.querySelector('.sub-tab-panel.active');
        if (!activePanel) return; 
        
        // 2. Pega todas as linhas (tr) APENAS da tabela ativa
        const rows = activePanel.querySelectorAll("tbody tr");

        // 3. Filtra as linhas
        rows.forEach(row => {
            const rowText = normalizarString(row.textContent);
            
            // Verifica se o texto da linha inclui o termo pesquisado
            if (searchTerm === '' || rowText.includes(searchTerm)) {
                row.style.display = ""; // Mostra a linha
                matchesFound++;
            } else {
                row.style.display = "none"; // Esconde a linha
            }
        });

        // 4. Mostra ou esconde a mensagem "Nenhum resultado"
        if (matchesFound === 0 && searchTerm !== '') {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    }

    // --- 3. EVENT LISTENERS ---

    // Adiciona o evento de 'input' (tempo real) à barra de pesquisa
    searchInput.addEventListener('input', filtrarTabelasAtivas);

    // Adiciona o evento de clique nas Sub-Abas
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSubTabId = button.dataset.subtab;

            // Troca as abas
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            subTabPanels.forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(targetSubTabId).classList.add('active');

            // Limpa a pesquisa anterior e refiltra
            // searchInput.value = ''; // Opcional: descomente para limpar
            filtrarTabelasAtivas();
        });
    });
    
    // Roda o filtro uma vez no início (para o caso de a pesquisa estar preenchida)
    filtrarTabelasAtivas();
});

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a escuta nos botões de cópia
    setupCopyButtons();
});

function setupCopyButtons() {
    // Seleciona todos os botões com a classe .btn-copy
    const buttons = document.querySelectorAll('.btn-copy');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Encontra a linha (TR) onde o botão foi clicado
            const row = e.target.closest('tr');
            const cells = row.querySelectorAll('td');

            // Mapeamento das células (baseado na ordem do seu HTML):
            // 0: Tipo, 1: Prestador, 2: Zona, 3: CNPJ, 4: CD Pessoa, 5: Endereço, 6: Telefone
            
            const prestador = cells[1].innerText.trim();
            const zona = cells[2].innerText.trim();
            
            // Remove tudo que não for número (pontos, traços, barras) para CNPJ e CD
            const cnpj = cells[3].innerText.trim().replace(/\D/g, ''); 
            const cdPessoa = cells[4].innerText.trim().replace(/\D/g, ''); 
            
            const endereco = cells[5].innerText.trim();
            const telefone = cells[6].innerText.trim();

            // Monta o texto formatado
            const textToCopy = `PRESTADOR> ${prestador}
ZONA OU REGIÃO> ${zona}
CNPJ> ${cnpj}
CD PESSOA> ${cdPessoa}
ENDEREÇO> ${endereco}
TELEFONE> ${telefone}`;

            // Executa a cópia para a área de transferência
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Feedback visual: Muda o texto do botão temporariamente
                const originalText = button.innerText;
                button.innerText = "COPIADO!";
                button.style.borderColor = "#00ff00"; // Verde tático
                button.style.color = "#00ff00";

                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.borderColor = ""; // Volta ao original (CSS)
                    button.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
                alert('Falha ao acessar o clipboard.');
            });
        });
    });
}