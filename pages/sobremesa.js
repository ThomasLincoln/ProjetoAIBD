/**
 * Aguarda o conteúdo da página carregar completamente antes de rodar o script.
 */
document.addEventListener('DOMContentLoaded', () => {
    carregarSobremesa();
  });
  
  /**
   * Função principal que busca os dados da API e renderiza os cards.
   */
  async function carregarSobremesa() {
    const container = document.getElementById('cards-container');
    // O ID da categoria que definimos na nossa API do CouchDB
    const categoriaId = 'categoria:sobremesas'; 
    const apiUrl = `http://localhost:3000/api/pratos/categoria/${categoriaId}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Não foi possível carregar os dados das entradas.');
      }
      const pratos = await response.json();
  
      if (pratos.length === 0) {
        container.innerHTML = '<p class="col-12">Nenhuma entrada encontrada no momento.</p>';
        return;
      }
  
      // Limpa o container e gera o HTML para cada prato
      container.innerHTML = '';
      pratos.forEach(prato => {
        container.innerHTML += criarCardHTML(prato);
      });
  
      // Ativa os controles de quantidade DEPOIS que os cards foram criados
      ativarControlesQuantidade();
  
    } catch (error) {
      console.error('Erro:', error);
      container.innerHTML = '<p class="col-12 text-danger">Falha ao carregar o cardápio. Tente novamente mais tarde.</p>';
    }
  }
  
  /**
   * Retorna o HTML de um único card de produto, baseado na sua estrutura.
   * @param {object} prato - O objeto do prato com titulo, preco, etc.
   * @returns {string} - A string HTML do card.
   */
  function criarCardHTML(prato) {
    console.log
    const precoFormatado = formatAsCurrency(prato.preco);
    return `
      <div class="col-12 col-md-6 col-lg-4 col-xxl-3">
        <div class="card h-100 d-flex flex-column" data-base-price="${prato.preco}">
          <img src=${prato.imagem} class="card-img-top" alt="${prato.titulo}">
          <div class="card-body">
            <h5 class="card-title">${prato.titulo}</h5>
            <p class="card-text">${prato.descricao}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <div class="d-flex justify-content-between align-items-center">
              <p class="mb-0 fs-5 fw-bold text-success price-display">${precoFormatado}</p>
              <div class="input-group" style="width: 120px;">
                <button class="btn btn-outline-secondary btn-minus" type="button">-</button>
                <input type="text" class="form-control text-center" value="1" aria-label="Quantidade" readonly>
                <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Adiciona os eventos de clique aos botões de mais e menos de todos os cards na página.
   * Esta função é chamada DEPOIS que os cards são inseridos no DOM.
   */
  function ativarControlesQuantidade() {
    const productCards = document.querySelectorAll('.card[data-base-price]');
  
    productCards.forEach(card => {
      const minusBtn = card.querySelector('.btn-minus');
      const plusBtn = card.querySelector('.btn-plus');
      const quantityInput = card.querySelector('input[type="text"]');
  
      plusBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updatePriceDisplay(card);
      });
  
      minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          updatePriceDisplay(card);
        }
      });
    });
  }
  
  /**
   * Atualiza o preço exibido no card com base na quantidade.
   * @param {HTMLElement} card - O elemento do card a ser atualizado.
   */
  function updatePriceDisplay(card) {
    const basePrice = parseFloat(card.dataset.basePrice);
    const quantity = parseInt(card.querySelector('input[type="text"]').value);
    const priceDisplay = card.querySelector('.price-display');
    priceDisplay.textContent = formatAsCurrency(basePrice * quantity);
  };
  
  /**
   * Formata um número como moeda brasileira (BRL).
   * @param {number} value - O valor numérico.
   * @returns {string} - O valor formatado como moeda.
   */
  const formatAsCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };