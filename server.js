const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

const boiasMonitoradas = [
    { id: 1, codigo: "SW-BOAVIAGEM-01", latitude: -8.1132, longitude: -34.8912, local: "Posto 4 - Boa Viagem" },
    { id: 2, codigo: "SW-PIEDADE-02", latitude: -8.1744, longitude: -34.9231, local: "Igrejinha de Piedade" }
];

app.post('/api/telemetria', (req, res) => {
    const { codigo_tag, codigo_boia, dbm_sinal, timestamp } = req.body;

    if (!codigo_tag || !codigo_boia) {
        return res.status(400).json({ 
            sucesso: false, 
            erro: "Dados de telemetria incompletos. Código da TAG e da Boia são obrigatórios." 
        });
    }

    const boiaAlvo = boiasMonitoradas.find(b => b.codigo === codigo_boia);
    
    if (!boiaAlvo) {
        return res.status(404).json({ 
            sucesso: false, 
            erro: "Boia receptora não catalogada no sistema SharkWave." 
        });
    }

    const areaDeRisco = true; 

    console.log(`\n🚨 [ALERTA SHARKWAVE] Tubarão detectado!`);
    console.log(`TAG do Animal: ${codigo_tag} | Local: ${boiaAlvo.local}`);
    console.log(`Coordenadas: Lat ${boiaAlvo.latitude} / Long ${boiaAlvo.longitude}`);

    if (areaDeRisco) {
        console.log(`>>>> ENVIANDO NOTIFICAÇÃO PUSH PARA BANHISTAS NO QUADRANTE: ${boiaAlvo.local} <<<<`);
        console.log(`>>>> ENVIANDO ALERTA VIA API PARA O CORPO DE BOMBEIROS (GBMAR) <<<<`);
    }

    return res.status(201).json({
        sucesso: true,
        mensagem: "Telemetria processada. Alertas de segurança disparados com sucesso.",
        detalhes_evento: {
            animal_tag: codigo_tag,
            localizacao: boiaAlvo.local,
            coordenadas: { lat: boiaAlvo.latitude, lng: boiaAlvo.longitude },
            timestamp_processamento: new Date().toISOString()
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor SharkWave online na porta ${PORT}`);
    console.log(`Pronto para receber dados de telemetria das boias.`);
});