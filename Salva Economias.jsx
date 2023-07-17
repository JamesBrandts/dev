
//const lista = [55877, 68322, 8505, 4186, 57411, 85536, 6757, 9949, 1081, 7800, 79485, 188, 88340, 7306, 6892, 101464, 50461, 86898, 101749, 99839, 54725, 18306, 29161, 96989, 69194, 18330, 85804, 45837, 29908, 85223, 64532, 45462, 21792, 77779, 33801, 40669, 42393, 12763, 101142, 29062, 53574, 30856, 44917, 10243, 99209, 29232, 54253, 54234, 80554, 80522, 89662, 89715, 54469, 54476, 78126, 30092, 52205, 20412, 36007, 82228, 83703, 64517]
const lista = [55877, 68322, 8505, 4186, 57411, 85536]
const t1 = Date.now()
const economias = []

for(const eco of lista)
  economias.push(await getEconomiaInfo(eco))
console.log({economias})
let out = "Inscrição\tDívidas 2019\tDívidas Cobraveis\tDívida Total\r\n"
for(const eco of economias){
  out += eco.inscrição + "\t" + eco.dividas2019 + "\t" + eco.dividasCobraveis + "\t" + eco.dividasTudo + "\r\n"
}
console.log({TotalTime:(Date.now()-t1)})
console.log({out})
downloadFile(out,"economias.txt")


async function getEconomiaInfo(eco){
  document.getElementById("form_imobiliarioM:botaoLocalizar").click();
  let insc = await getElement("form_imobiliarioM:inscricaoImobiliarioLocalizar:field");
  insc.value = eco;
  document.getElementById("form_imobiliarioM:botaoRecuperar").click();
  let tributos = await getElement("form_imobiliarioM:aba_670302:header:inactive");
  tributos.click();
  const tipo = await getElement("form_imobiliarioM:dataTableFiltrosFiltrosTributo:tipoTributoFiltroCampos");
  tipo.value = "N";
  const ano1 = await getElement("form_imobiliarioM:dataTableFiltrosFiltrosTributo:exercicioFiltroCampos");
  ano1.value = "2019";
  const vencidos1 = await getElement("form_imobiliarioM:dataTableDividasVencidasVencerTributo:dividaVencida");
  const dividasTudo = vencidos1.innerHTML;
  let filtrar = await getElement("form_imobiliarioM:dataTableFiltrosFiltrosTributo:botaoFiltrar")
  filtrar.click();
  let vencidos2 = document.getElementById("form_imobiliarioM:dataTableDividasVencidasVencerTributo:dividaVencida");
  for (let i = 0; i < 500 && vencidos1 === vencidos2; i++) {
    vencidos2 = document.getElementById("form_imobiliarioM:dataTableDividasVencidasVencerTributo:dividaVencida");
    await new Promise((r) => setTimeout(r, 20));
  }
  const dividas2019 = vencidos2?.innerHTML || 0;
  ano2 = await getElement("form_imobiliarioM:dataTableFiltrosFiltrosTributo:exercicioFiltroCamposFim")
  ano2.value = "2022";
  filtrar = await getElement("form_imobiliarioM:dataTableFiltrosFiltrosTributo:botaoFiltrar")
  filtrar.click();
  let vencidos3 = document.getElementById("form_imobiliarioM:dataTableDividasVencidasVencerTributo:dividaVencida");
  for (let i = 0; i < 500 && vencidos3 === vencidos2; i++) {
    vencidos3 = document.getElementById("form_imobiliarioM:dataTableDividasVencidasVencerTributo:dividaVencida");
    await new Promise((r) => setTimeout(r, 20));
  }
  const dividasCobraveis = vencidos3?.innerHTML || 0;
  return {
    inscrição:eco,
    dividasTudo,
    dividas2019,
    dividasCobraveis
  }
}


async function getElement(elementId) {
  let element = null;
  for (let i = 0; i < 500; i++) {
    element = document.getElementById(elementId);
    if (element) return element;
    await new Promise((r) => setTimeout(r, 20));
  }
  return element;
}

async function downloadFile(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }