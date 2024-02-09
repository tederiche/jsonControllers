const fs = require('fs').promises;
const path = require('path');
const { MongoClient } = require('mongodb');
const JSONBigInt = require('json-bigint');

const uri = 'mongodb://localhost:27017';
const dbName = 'novoDB';

async function conectarAoMongoDB() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Conectado ao MongoDB');
  return client;
}

async function criarColecaoSeNaoExistir(db, colecaoNome) {
  const colecao = db.collection(colecaoNome);
  const existeColecao = await colecao.countDocuments({}) > 0;

  if (!existeColecao) {
    await db.createCollection(colecaoNome);
    console.log(`Criada coleção: ${colecaoNome}`);
  }

  return colecao;
}

async function processarLinha(linha, colecao, arquivo) {
  try {
    const conteudoArquivo = JSONBigInt.parse(linha);
    await colecao.insertOne(conteudoArquivo);
    console.log(`Inserido documento em ${colecao.s.namespace.collection}: ${arquivo}`);
  } catch (error) {
    console.error(`Erro ao processar o arquivo ${arquivo}: ${error.message}`);
  }
}

async function lerArquivoEInserirDocumentos(colecao, caminhoArquivo) {
  try {
    const conteudoArquivo = await fs.readFile(caminhoArquivo, 'utf-8');
    const linhas = conteudoArquivo.split('\n');

    for (const linha of linhas) {
      await processarLinha(linha, colecao, caminhoArquivo);
    }
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${caminhoArquivo}: ${error.message}`);
  }
}

async function fecharConexao(client) {
  await client.close();
  console.log('Conexão fechada');
}

async function criarColecaoEDocumentos(colecaoNome, diretorioBase) {
  const client = await conectarAoMongoDB();

  try {
    const db = client.db(dbName);
    const colecao = await criarColecaoSeNaoExistir(db, colecaoNome);
    const arquivos = await fs.readdir(diretorioBase);

    for (const arquivo of arquivos) {
      const caminhoArquivo = path.join(diretorioBase, arquivo);
      await lerArquivoEInserirDocumentos(colecao, caminhoArquivo);
    }

    console.log('Concluído');
  } finally {
    await fecharConexao(client);
  }
}

const colections = "CAT_200";
const diretorioBase = `C:/Users/PREDATOR/Documents/SERVIDOR/jsonsNovos/${colections}`;

criarColecaoEDocumentos(colections, diretorioBase);
