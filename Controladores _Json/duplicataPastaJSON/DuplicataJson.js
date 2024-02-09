const fs = require('fs');
const _ = require('lodash');

const folderPath = 'C:/Users/PREDATOR/Documents/SERVIDOR/DuplicatasJson'; // Substitua pelo caminho da sua pasta
const files = fs.readdirSync(folderPath);

const allItems = [];

// Loop para ler cada arquivo JSON na pasta
files.forEach(file => {
  const filePath = `${folderPath}/${file}`;
  
  // Verifica se é um arquivo JSON
  if (file.endsWith('.json')) {
    try {
      // Lê o conteúdo do arquivo e faz o parse para objeto JSON
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // Adiciona os itens ao array global
      allItems.push(...jsonData);
    } catch (error) {
      console.error(`Erro ao ler o arquivo ${filePath}: ${error.message}`);
    }
  }
});

// Verifica duplicatas usando o lodash
const duplicates = _.filter(allItems, (item, index, array) => array.indexOf(item) !== index);

if (duplicates.length > 0) {
  console.log('Itens duplicados encontrados:', duplicates);
} else {
  console.log('Nenhum item duplicado encontrado.');
}
