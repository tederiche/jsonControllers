const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

function convertDirectoryCsvToJson(inputDirectory, outputDirectory) {
  // Lê a lista de arquivos no diretório de entrada
  fs.readdir(inputDirectory, (err, files) => {
    if (err) {
      console.error('Erro ao ler o diretório:', err);
      return;
    }

    // Para cada arquivo CSV encontrado, converte para JSON
    files.forEach((file) => {
      if (path.extname(file) === '.csv') {
        const csvFilePath = path.join(inputDirectory, file);
        const jsonFilePath = path.join(outputDirectory, `${path.parse(file).name}.json`);

        convertCsvFileToJson(csvFilePath, jsonFilePath);
      }
    });
  });
}

function convertCsvFileToJson(csvFilePath, jsonFilePath) {
  const data = [];

  // Lê o conteúdo do arquivo com iconv-lite para converter para UTF-8
  const csvStream = fs.createReadStream(csvFilePath)
    .pipe(iconv.decodeStream('latin1')) // ou o encoding usado no seu CSV
    .pipe(iconv.encodeStream('utf-8'));

  csvStream
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      // Remove espaços em branco no início e no final de cada valor
      Object.keys(row).forEach((key) => {
        row[key] = row[key].trim();
      });

      data.push(row);
    })
    .on('end', () => {
      // Escreve os dados em um arquivo JSON
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Conversão concluída para ${jsonFilePath}`);
    });
}

const pasta = "CAT_NICOLAS_PLAN14_FEITO"
// Substitua 'input_directory' pelo caminho do diretório contendo os arquivos CSV e 'output_directory' pelo diretório desejado para os arquivos JSON
convertDirectoryCsvToJson(`C:/Users/PREDATOR/Documents/SERVIDOR/csv/${pasta}`, `C:/Users/PREDATOR/Documents/SERVIDOR/jsonsNovos/${pasta}`);
