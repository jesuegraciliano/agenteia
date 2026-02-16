const fatoresOscilacao = [
  0.88, 0.92, 0.95, 0.98, 1.0, 0.98, 0.91, 0.74,
  0.52, 0.3, 0.11, 0.03, 0.0, 0.03, 0.11, 0.3,
  0.52, 0.74, 0.91, 0.98, 1.0, 0.98, 0.95, 0.92,
];

function val(id) {
  return Number(document.getElementById(id).value);
}

function round(value, casas = 2) {
  return Number(value.toFixed(casas));
}

function calcular() {
  const largura = val('largura');
  const comprimento = val('comprimento');
  const peDireito = val('peDireito');
  const pessoas = val('pessoas');
  const tInt = val('tInt');
  const tExt = val('tExt');
  const amplitude = val('amplitude');
  const areaFachada = val('areaFachada');
  const areaVidro = val('areaVidro');
  const cltdBase = val('cltdBase');
  const sclVidro = val('sclVidro');
  const shgc = val('shgc');
  const uParede = val('uParede');
  const uVidro = val('uVidro');
  const cah = val('cah');
  const densidadeEquip = val('densidadeEquip');

  const areaPiso = largura * comprimento;
  const volume = areaPiso * peDireito;
  const areaParede = Math.max(0, areaFachada - areaVidro);

  const horaPico = 15;
  const fatorOsc = fatoresOscilacao[horaPico];
  const tExtHora = tExt - fatorOsc * amplitude;
  const deltaT = Math.max(0, tExtHora - tInt);

  const correcaoInterna = 25.5 - tInt;
  const correcaoLocal = tExt - 29.4;
  const cltdCorrigido = Math.max(0, cltdBase + correcaoInterna + correcaoLocal);

  const qParede = uParede * areaParede * cltdCorrigido;
  const qVidroSolar = areaVidro * sclVidro * shgc;
  const qVidroConducao = Math.max(0, uVidro * areaVidro * deltaT);

  const qPessoas = pessoas * 75;
  const qEquip = areaPiso * densidadeEquip;
  const vazaoM3s = (volume * cah) / 3600;
  const qAr = Math.max(0, 1200 * vazaoM3s * deltaT);

  const qExterno = qParede + qVidroSolar + qVidroConducao;
  const qInterno = qPessoas + qEquip + qAr;
  const qTotal = qExterno + qInterno;

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <strong>Carga térmica total (hora de referência ${horaPico}:00):</strong> ${round(qTotal)} W<br>
    <strong>Capacidade:</strong> ${round(qTotal * 3.412)} BTU/h | ${round(qTotal / 3517, 3)} TR<br>
    <strong>Composição:</strong> Externo ${round(qExterno)} W + Interno ${round(qInterno)} W
  `;

  const passos = [
    `Geometria: área do piso = largura × comprimento = ${largura} × ${comprimento} = ${round(areaPiso)} m².`,
    `Volume do ambiente = área do piso × pé-direito = ${round(areaPiso)} × ${peDireito} = ${round(volume)} m³.`,
    `Temperatura externa horária (15h): T_h = T_max - (fator × amplitude) = ${tExt} - (${fatorOsc} × ${amplitude}) = ${round(tExtHora)} °C.`,
    `Diferença de temperatura útil: ΔT = max(0, T_ext_h - T_int) = max(0, ${round(tExtHora)} - ${tInt}) = ${round(deltaT)} °C.`,
    `CLTD corrigido: CLTDc = CLTD_base + (25.5 - T_int) + (T_média - 29.4) = ${cltdBase} + (${round(correcaoInterna)}) + (${round(correcaoLocal)}) = ${round(cltdCorrigido)}.`,
    `Área líquida de parede = área de fachada - área de vidro = ${areaFachada} - ${areaVidro} = ${round(areaParede)} m².`,
    `Parcela 1 (Parede): Q_parede = U_parede × área_parede × CLTDc = ${uParede} × ${round(areaParede)} × ${round(cltdCorrigido)} = ${round(qParede)} W.`,
    `Parcela 2 (Vidro solar): Q_vidro_solar = área_vidro × SCL × SHGC = ${areaVidro} × ${sclVidro} × ${shgc} = ${round(qVidroSolar)} W.`,
    `Parcela 3 (Vidro condução): Q_vidro_cond = max(0, U_vidro × área_vidro × ΔT) = max(0, ${uVidro} × ${areaVidro} × ${round(deltaT)}) = ${round(qVidroConducao)} W.`,
    `Parcela 4 (Pessoas): Q_pessoas = número de pessoas × 75 = ${pessoas} × 75 = ${round(qPessoas)} W.`,
    `Parcela 5 (Equipamentos e luz): Q_equip = área do piso × densidade = ${round(areaPiso)} × ${densidadeEquip} = ${round(qEquip)} W.`,
    `Parcela 6 (Renovação de ar): vazão = (volume × CAH) / 3600 = (${round(volume)} × ${cah}) / 3600 = ${round(vazaoM3s, 4)} m³/s.`,
    `Parcela 6 (continuação): Q_ar = max(0, 1200 × vazão × ΔT) = max(0, 1200 × ${round(vazaoM3s, 4)} × ${round(deltaT)}) = ${round(qAr)} W.`,
    `Soma externa: Q_externo = Q_parede + Q_vidro_solar + Q_vidro_cond = ${round(qParede)} + ${round(qVidroSolar)} + ${round(qVidroConducao)} = ${round(qExterno)} W.`,
    `Soma interna: Q_interno = Q_pessoas + Q_equip + Q_ar = ${round(qPessoas)} + ${round(qEquip)} + ${round(qAr)} = ${round(qInterno)} W.`,
    `Total final: Q_total = Q_externo + Q_interno = ${round(qExterno)} + ${round(qInterno)} = ${round(qTotal)} W (${round(qTotal * 3.412)} BTU/h).`,
  ];

  const memorialLista = document.getElementById('memorialLista');
  memorialLista.innerHTML = '';
  passos.forEach((texto) => {
    const item = document.createElement('li');
    item.textContent = texto;
    memorialLista.appendChild(item);
  });
}

document.getElementById('calcularBtn').addEventListener('click', calcular);
document.getElementById('imprimirBtn').addEventListener('click', () => window.print());

calcular();
