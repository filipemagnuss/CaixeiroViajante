// Cada par de coodenada representa x e y em um "mapa" plano
let cidades = [
    [-8, -3],
    [7, -1],
    [-10, 4],
    [6, -9],
    [-3, -7],
    [-9, 2],
    [-1, -8],
    [4, -6],
    [-2, 5],
    [-10, 7]
];

// Calcula a distância entre duas cidades
function calcularDistancia(cidadeA, cidadeB) {
    return Math.sqrt(Math.pow((cidadeB[0] - cidadeA[0]), 2) + Math.pow((cidadeB[1] - cidadeA[1]), 2));
}

// Cria um percurso aleatório
function criarPercurso() {
    let percurso = [];
    let listaCidades = JSON.parse(JSON.stringify(cidades));

    while (listaCidades.length > 0) {
        let cidadeEscolhida = Math.floor(Math.random() * listaCidades.length);
        percurso.push(listaCidades[cidadeEscolhida]);
        listaCidades.splice(cidadeEscolhida, 1);
    }
    return percurso;
}

// Cria uma população de percursos
function criarPopulacao(tamanho) {
    const populacao = [];
    for (let i = 0; i < tamanho; i++) {
        populacao.push(criarPercurso());
    }
    return populacao;
}

// Vê se o percurso é bom
function calcularAptidao(percurso) {
    let distanciaTotal = 0;
    for (let i = 0; i < percurso.length; i++) {
        let proximoIndice = (i + 1) % percurso.length; // Volta ao início
        distanciaTotal += calcularDistancia(percurso[i], percurso[proximoIndice]);
    }
    return 1 / distanciaTotal; // Inversamente proporcional à distância total
}

// Seleciona dois percursos
function selecionarPais(populacao) {
    const selecionados = [];
    for (let i = 0; i < 2; i++) {
        const percurso1 = escolherAleatorio(populacao);
        const percurso2 = escolherAleatorio(populacao);
        selecionados.push(calcularAptidao(percurso1) > calcularAptidao(percurso2) ? percurso1 : percurso2);
    }
    return selecionados;
}

function escolherAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Realiza o cruzamento entre dois percursos
function cruzarPercursos(percurso1, percurso2) {
    const pontoDeCorte = Math.floor(Math.random() * percurso1.length);
    const novoPercurso = percurso1.slice(0, pontoDeCorte);
    

    percurso2.forEach(cidade => {
        if (!novoPercurso.includes(cidade)) {
            novoPercurso.push(cidade);
        }
    });
    
    return novoPercurso;
}

// Realiza mutações
function mutarPercurso(percurso, taxaDeMutacao) {
    for (let i = 0; i < percurso.length; i++) {
        if (Math.random() < taxaDeMutacao) {
            let j = Math.floor(Math.random() * percurso.length);
            [percurso[i], percurso[j]] = [percurso[j], percurso[i]]; // Troca as cidades
        }
    }
}

// Evolui a população 
function evoluirPopulacao(populacao, taxaDeMutacao) {
    const novaPopulacao = [];
    while (novaPopulacao.length < populacao.length) {
        const [pai1, pai2] = selecionarPais(populacao);
        const filho = cruzarPercursos(pai1, pai2);
        mutarPercurso(filho, taxaDeMutacao);
        novaPopulacao.push(filho);
    }
    return novaPopulacao;
}

// Encontra o melhor percurso 
function encontrarMelhorPercurso(populacao) {
    let melhorAptidao = -Infinity;
    let melhorPercurso = null;
    populacao.forEach(percurso => {
        const aptidao = calcularAptidao(percurso);
        if (aptidao > melhorAptidao) {
            melhorAptidao = aptidao;
            melhorPercurso = percurso;
        }
    });
    return melhorPercurso;
}

const tamanhoPopulacao = 100;
const numeroGeracoes = 1000; 
const taxaDeMutacao = 0.01; 

// Cria a população 
let populacao = criarPopulacao(tamanhoPopulacao);

// Evolui a população 
for (let geracao = 0; geracao < numeroGeracoes; geracao++) {
    populacao = evoluirPopulacao(populacao, taxaDeMutacao);
}

// Encontra o melhor percurso após a evolução
const melhorPercurso = encontrarMelhorPercurso(populacao);
const distanciaMelhorPercurso = 1 / calcularAptidao(melhorPercurso); // Distância total do melhor percurso

// Exibe o resultado
console.log("Melhor caminho encontrado:", melhorPercurso);
console.log("Distância do melhor caminho:", distanciaMelhorPercurso);
