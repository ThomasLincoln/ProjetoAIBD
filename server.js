const express = require('express');
const cors = require('cors');
const NodeCouchDb = require('node-couchdb');
const app = express();
const port = 3000;
app.use(cors());
const couch = new NodeCouchDb({
  host: '127.0.0.1',
  protocol: 'http',
  port: 5984,
  auth: {
    user: 'nicolas',
    pass: 'senha123'
  }
});

// Rota para buscar TODOS os pratos
app.get('/api/pratos', async (req, res) => {
  // CORRIGIDO: Nome do banco padronizado. Verifique se 'bancorestaurante' é o nome correto.
  const dbName = 'bancorestaurante'; 
  // CORRIGIDO: Apontando para a view que busca todos os pratos
  const viewUrl = '_design/consultas/_view/todos_pratos_por_nome';

  try {
    const { data } = await couch.get(dbName, viewUrl, { include_docs: true });

    const pratos = data.rows.map(item => {
      if (!item.doc) return null;
      return {
        id: item.doc._id,
        // CORRIGIDO: Mapeando doc.nome para o campo 'titulo'
        titulo: item.doc.nome, 
        descricao: item.doc.descricao,
        preco: item.doc.preco,
        ingredientes: item.doc.ingredientes,
        tags: item.doc.tags,
        imagem: item.doc.imagem_url || 'https://via.placeholder.com/400x300.png?text=Prato+sem+imagem'
      };
    }).filter(prato => prato !== null);

    res.json(pratos);

  } catch (error) {
    console.error('Erro ao buscar pratos:', error);
    res.status(500).json({ error: 'Falha ao buscar pratos' });
  }
});

// Rota para buscar pratos por CATEGORIA
app.get('/api/pratos/categoria/:categoriaId', async (req, res) => {
  const { categoriaId } = req.params;
  // CORRIGIDO: Nome do banco padronizado.
  const dbName = 'bancorestaurante'; 
  // CORRIGIDO: URL da view consertada (sem duplicar _design/)
  const viewUrl = '_design/consultas/_view/pratos_por_categoria';

  try {
    const { data } = await couch.get(dbName, viewUrl, {
      key: categoriaId,
      include_docs: true
    });

    const pratos = data.rows.map(item => {
      if (!item.doc) return null;
      return {
        id: item.doc._id,
        // CORRIGIDO: Mapeando doc.nome para o campo 'titulo' para manter a consistência
        titulo: item.doc.nome, 
        descricao: item.doc.descricao,
        preco: item.doc.preco,
        ingredientes: item.doc.ingredientes,
        tags: item.doc.tags,
        imagem: item.doc.imagem_url|| 'https://via.placeholder.com/400x300.png?text=Prato+sem+imagem'
      };
    }).filter(prato => prato !== null);

    res.json(pratos);

  } catch (error) {
    console.error(`Erro ao buscar dados do CouchDB:`, error);
    res.status(500).json({ error: 'Erro ao buscar dados do servidor.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

