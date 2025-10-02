// Area de Estudio

var departamentosColombia = table.filter(ee.Filter.eq('ADM0_NAME', 'Colombia'));
var nombresDeptos = ['Amazonas', 'Vaupes', 'Guainia', 'Guaviare', 'Caqueta', 'Putumayo'];
var areaEstudio = departamentosColombia.filter(ee.Filter.inList('ADM1_NAME', nombresDeptos));
Map.addLayer(areaEstudio, {color: '00FF00'}, 'Area de Estudio - 6 Deptos', true, 0.5);
Map.centerObject(areaEstudio, 6);
var aoiCombinada = areaEstudio.union();
print('ROIs independientes (departamentos):', areaEstudio);

// Colección SENTINEL-2 (2018-2023)

var fechaInicio = '2018-01-01';
var fechaFin = '2023-12-31';

var coleccionS2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoiCombinada)
  .filterDate(fechaInicio, fechaFin)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(function(imagen){
    var scl = imagen.select('SCL');
    var mascaraNubes = scl.neq(8).and(scl.neq(9)).and(scl.neq(3)).and(scl.neq(10));
    return imagen.updateMask(mascaraNubes);
  });

var bandasS2 = ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'];
coleccionS2 = coleccionS2.select(bandasS2);
print('Colección Sentinel-2 preprocesada (2018-2023):', coleccionS2);

// Comupuesto multianual SENTINEL-2 (2018-2023)

var compuestoMultianualS2 = coleccionS2.median().clip(aoiCombinada);
Map.addLayer(compuestoMultianualS2, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 
             'Compuesto Multianual S2 (2018-2023)', true, 0.8);

// CÁLCULO DE ÍNDICES ESPECTRALES SOBRE COMPUESTO MULTIANUAL

var ndviComp = compuestoMultianualS2.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwiComp = compuestoMultianualS2.normalizedDifference(['B3', 'B8']).rename('NDWI');

// COLECCIÓN Y COMPUESTO SENTINEL-1 (2018-2023)

var coleccionS1 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(aoiCombinada)
    .filterDate('2018-01-01', '2023-12-31')
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .select(['VV']);

var s1Compuesta = coleccionS1.mean().clip(aoiCombinada);
var vvEntero = s1Compuesta.select('VV').multiply(100).toInt16();
var texturaEntropia = vvEntero.glcmTexture({size: 5}).select('VV_ent').rename('entropia_VV');

// STACK FINAL DE CARACTERÍSTICAS

var stackCaracteristicas = compuestoMultianualS2
    .addBands(ndviComp)
    .addBands(ndwiComp)
    .addBands(texturaEntropia);
print('Stack de Características (Compuesto 2018-2023):', stackCaracteristicas);


// Toma de muestras 4 clases

// Clase 0: No minería Bosque conservado, vegetación densa, rio sano
var noMinerias = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[
    [-69.98727797349272, -4.115365814476065],
    [-69.98726724465666, -4.115957054039104],
    [-69.98668252309142, -4.115951703456796],
    [-69.98672812064467, -4.115331035664561],
    [-69.98727797349272, -4.115365814476065]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.98663424332915, -4.115339061544283],
    [-69.98659132798491, -4.115943677583257],
    [-69.98623995860396, -4.115924950544695],
    [-69.98624264081297, -4.115325685078055],
    [-69.98663424332915, -4.115339061544283]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.8466518744505, -2.7745924467558454],
    [-69.8466518744505, -2.7752139895947],
    [-69.84589012709027, -2.775205952404901],
    [-69.84593572464352, -2.774552260785182],
    [-69.8466518744505, -2.7745924467558454]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.84584730855501, -2.7745708096087283],
    [-69.84575074903047, -2.7752218221549523],
    [-69.84519016734636, -2.775165561825605],
    [-69.8455227612642, -2.7745199073780777],
    [-69.84584730855501, -2.7745708096087283]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.50631931092548, -0.6452678180343236],
    [-72.50626164343166, -0.6454032609979469],
    [-72.50604170229244, -0.6453160947346412],
    [-72.50617581274318, -0.6451484673009972],
    [-72.50631931092548, -0.6452678180343236]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.50499483411913, -0.6435544428571189],
    [-72.50461932485705, -0.6438172827528528],
    [-72.50428136652117, -0.6433988845451051],
    [-72.50471588438158, -0.6431306805477209],
    [-72.50499483411913, -0.6435544428571189]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.50889147501655, -0.6428250617739527],
    [-72.50879491549202, -0.6432220037088225],
    [-72.50835503321358, -0.64286261033668],
    [-72.50853742342659, -0.6425461295850233],
    [-72.50889147501655, -0.6428250617739527]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.64653877948494, -0.6525242454291466],
    [-72.64657230709763, -0.6526663932859728],
    [-72.64634431933136, -0.6526945546533572],
    [-72.64630810950966, -0.6525309505168214],
    [-72.64653877948494, -0.6525242454291466]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.69594947886615, -0.6096358568734858],
    [-72.696012510778, -0.6097605725311956],
    [-72.69587035370022, -0.6098048264735473],
    [-72.69580329847484, -0.6096667005310386],
    [-72.69594947886615, -0.6096358568734858]
  ]]), {clase: 0}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-72.69409323902751, -0.6109583506878161],
    [-72.69420320959712, -0.6111246381898913],
    [-72.69402752490664, -0.6112104639953988],
    [-72.69392560096408, -0.611049540608943],
    [-72.69409323902751, -0.6109583506878161]
  ]]), {clase: 0})
]).map(function(feat){ return feat.set('clase', 0); });

// Clase 1: Minería (dragas y sedimentación en rios)

var minerias = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[
    [-69.9470931989435, -4.221510493021517],
    [-69.9470931989435, -4.2218475343732536],
    [-69.94680888478793, -4.221767286445634],
    [-69.94688398664034, -4.221523867681126],
    [-69.9470931989435, -4.221510493021517]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.94834598811127, -4.2191042320588785],
    [-69.9482601574228, -4.219320902187554],
    [-69.94801875861145, -4.219267403395966],
    [-69.9481528690622, -4.219066782894707],
    [-69.94834598811127, -4.2191042320588785]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.9481996391268, -4.219396051985729],
    [-69.94808698634817, -4.219604697217499],
    [-69.94784826974585, -4.219556548322836],
    [-69.94801188449576, -4.219305104046622],
    [-69.9481996391268, -4.219396051985729]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.94885821257617, -4.218033618224375],
    [-69.94869728003528, -4.218456259248812],
    [-69.94846124564197, -4.21839741051235],
    [-69.9487187377074, -4.21798279428823],
    [-69.94885821257617, -4.218033618224375]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.16688668949793, -3.9564245962854203],
    [-70.16681963427256, -3.956619930889653],
    [-70.16658359987925, -3.9567296393458027],
    [-70.16663992626856, -3.9564807884365627],
    [-70.16677671892832, -3.9563523492283625],
    [-70.16688668949793, -3.9564245962854203]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.18052793599, -3.919224221395863],
    [-70.18038577891221, -3.919497166864691],
    [-70.18024362183442, -3.919449000023721],
    [-70.18027312613359, -3.919240277014133],
    [-70.1805091605269, -3.919218869523025],
    [-70.18052793599, -3.919224221395863]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.22252374629026, -3.8479321879893873],
    [-70.22232526282316, -3.8481355763110696],
    [-70.22218042353636, -3.848100786206854],
    [-70.22241645792967, -3.847811760670756],
    [-70.22252374629026, -3.8479321879893873]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.25562659297765, -3.8243976775946935],
    [-70.2557258347112, -3.824499374562622],
    [-70.25559440646947, -3.824585014105191],
    [-70.25554880891622, -3.8244271161919117],
    [-70.25562659297765, -3.8243976775946935]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.25218347577416, -3.8256988516808828],
    [-70.25227735308968, -3.8258273108117207],
    [-70.25217006472909, -3.825995913391738],
    [-70.25204131869637, -3.8258835116754204],
    [-70.25203595427834, -3.825808577189678],
    [-70.25218347577416, -3.8256988516808828]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.94576930677302, -4.224973493108541],
    [-69.94597315465815, -4.225021641667148],
    [-69.94568884050257, -4.225952513212449],
    [-69.94550108587153, -4.225893665044403],
    [-69.94554668342478, -4.225666297080414],
    [-69.94563519632227, -4.225575349876167],
    [-69.94568347608454, -4.225273084091247],
    [-69.94569956933863, -4.225083164821001],
    [-69.94576930677302, -4.224973493108541]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.95278893452678, -4.211725572229884],
    [-69.9524509761909, -4.212249865315528],
    [-69.95226858597789, -4.212287314808124],
    [-69.95231686574016, -4.212051917967568],
    [-69.95227395039592, -4.211977018957911],
    [-69.95263336640392, -4.211629273461454],
    [-69.95278893452678, -4.211725572229884]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.95365591036811, -4.210858875628511],
    [-69.95315701949134, -4.211249420946624],
    [-69.95294244277015, -4.211575766884021],
    [-69.95276005255714, -4.21149016796286],
    [-69.95290489184394, -4.211308270224135],
    [-69.95322675692573, -4.210896325188052],
    [-69.95342524039283, -4.210767926690684],
    [-69.95365591036811, -4.210858875628511]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.95773672705968, -4.2000066135615075],
    [-69.95753824359258, -4.199872863257102],
    [-69.9577581847318, -4.199391361971399],
    [-69.957972761453, -4.199444862128933],
    [-69.95773672705968, -4.2000066135615075]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.95685675002059, -4.202612756243034],
    [-69.95688625431976, -4.202869555905147],
    [-69.95666631318053, -4.2029578307694635],
    [-69.95665021992644, -4.2026823061598755],
    [-69.95666631318053, -4.202636831214948],
    [-69.95685675002059, -4.202612756243034]
  ]]), {clase: 1}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.94922407686789, -4.2171853578993],
    [-69.94902022898276, -4.217554500475612],
    [-69.94889148295005, -4.21753042596512],
    [-69.94891562283118, -4.217396678670969],
    [-69.94907387316306, -4.2171211591724695],
    [-69.94922407686789, -4.2171853578993]
  ]]), {clase: 1})
]).map(function(feat){ return feat.set('clase', 1); });

// Clase 2: Ciudades
var ciudades = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[
    [-69.93276823922932, -4.2092379783699965],
    [-69.93346353658717, -4.210364279017983],
    [-69.9320473302273, -4.210792274148872],
    [-69.931811295834, -4.2092942901611385],
    [-69.93276823922932, -4.2092379783699965]
  ]]), {clase: 2}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.94300321141749, -4.210522061803872],
    [-69.94263843099147, -4.2121163421484],
    [-69.94025662938624, -4.211345952054204],
    [-69.94075015584498, -4.209698170681357],
    [-69.94300321141749, -4.210522061803872]
  ]]), {clase: 2}),

  ee.Feature(ee.Geometry.Polygon([[
    [-76.6161148081326, 1.0294890257478388],
    [-76.6147844324612, 1.027150516172209],
    [-76.61244554620022, 1.0281159561129054],
    [-76.61360426049465, 1.0309693657855958],
    [-76.6161148081326, 1.0294890257478388]
  ]]), {clase: 2})
]).map(function(feat){ return feat.set('clase', 2); });


// CLASE 3: Deforestación no minera (Gnaderia, pistas, tala ilegal)
var deforestacionNoMinera = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[
    [-75.23687904076128, 0.5325493028481628],
    [-75.23685758308916, 0.5320772544348574],
    [-75.23615752653627, 0.5321201679284692],
    [-75.23625408606081, 0.5326539044803129],
    [-75.23687904076128, 0.5325493028481628]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-75.24092762846381, 0.5283519412832993],
    [-75.24093031067282, 0.5276787354083845],
    [-75.24007468599707, 0.5276680070273164],
    [-75.24010150808722, 0.5284082652774916],
    [-75.24092762846381, 0.5283519412832993]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-75.23878634916176, 0.5242837811495552],
    [-75.23877025590767, 0.5232699485061169],
    [-75.23784757600654, 0.5232967694776224],
    [-75.23798168645729, 0.524289145343009],
    [-75.23878634916176, 0.5242837811495552]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-75.24570468954657, 0.5241282480325852],
    [-75.2456912785015, 0.5234067639545533],
    [-75.24501804403876, 0.5234228565371284],
    [-75.24511728577231, 0.5241309301293757],
    [-75.24570468954657, 0.5241282480325852]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.2403648131135, 0.6883573022389894],
    [-70.24084761073618, 0.6871128469106842],
    [-70.23976399829417, 0.6868017330279385],
    [-70.23932411601572, 0.6881856532474918],
    [-70.2403648131135, 0.6883573022389894]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-70.07321064903525, -2.6577768933913197],
    [-70.07348691656378, -2.6581546779908427],
    [-70.07327770426062, -2.6583234753277245],
    [-70.07304971649435, -2.6580394670968652],
    [-70.07321064903525, -2.6577768933913197]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.45344820752652, -1.3351211050055685],
    [-69.45316925778897, -1.3352954012536282],
    [-69.45268377795728, -1.3350728383500787],
    [-69.45279106631787, -1.3347162013662375],
    [-69.45314243569882, -1.3347564235850466],
    [-69.45344820752652, -1.3351211050055685]
  ]]), {clase: 3}),
  
  ee.Feature(ee.Geometry.Polygon([[
    [-69.57449399421975, -1.3246490681849021],
    [-69.57370006035134, -1.3251853665692832],
    [-69.57328163574502, -1.3247402389184295],
    [-69.57382880638406, -1.324075228785072],
    [-69.57449399421975, -1.3246490681849021]
  ]]), {clase: 3})
]).map(function(feat){ return feat.set('clase', 3); });

var muestrasEntrenamiento = minerias.merge(noMinerias)
                                   .merge(ciudades)
                                   .merge(deforestacionNoMinera);

var datosEntrenamiento = stackCaracteristicas.sampleRegions({
  collection: muestrasEntrenamiento,
  properties: ['clase'],
  scale: 30,  
  tileScale: 2
});

// Modelo Random forest

if (datosEntrenamiento.size().getInfo() > 0) {
  var datosConRandom = datosEntrenamiento.randomColumn();
  var trainData = datosConRandom.filter(ee.Filter.lt('random', 0.7));
  var testData = datosConRandom.filter(ee.Filter.gte('random', 0.7));
  
  var predictores = stackCaracteristicas.bandNames();
  
  var modelo = ee.Classifier.smileRandomForest(100).train({
    features: trainData,
    classProperty: 'clase',
    inputProperties: predictores
  });
  
  var clasificacion = stackCaracteristicas.classify(modelo);
  
  Map.addLayer(clasificacion, {
    min: 0, 
    max: 3,
    palette: ['darkgreen', 'red', 'gray', 'orange']
  }, 'Clasificación Random Forest - 4 Clases', true);
  
  var testPredicciones = testData.classify(modelo);
  var matrizConfusion = testPredicciones.errorMatrix({
    actual: 'clase', 
    predicted: 'classification'
  });
  
  print('Matriz de Confusión (4x4):', matrizConfusion);
  print('Precisión General:', matrizConfusion.accuracy());
} else {
  print('ERROR: No hay muestras superpuestas con el stack.');
}

// PROTOCOLO DE ALERTAS TEMPRANAS 
// ==========================================================================
var roi_putumayo = areaEstudio.filter(ee.Filter.eq('ADM1_NAME', 'Putumayo')).first().geometry();
Map.addLayer(roi_putumayo, {color: 'FFFF00'}, 'ROI Alertas - Putumayo');

var generarAlertasMensuales = function(mes, año) {
  var diasPorMes = {
    '01': 31, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30,
    '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31
  };
  var ultimoDia = diasPorMes[mes] || 30;
  var fechaInicio = año + '-' + mes + '-01';
  var fechaFin = año + '-' + mes + '-' + ultimoDia;

  var s2Mensual = coleccionS2.filterDate(fechaInicio, fechaFin).median().clip(roi_putumayo);
  var s1Mensual = coleccionS1.filterDate(fechaInicio, fechaFin).mean().clip(roi_putumayo);
  
  var ndviMensual = s2Mensual.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var ndwiMensual = s2Mensual.normalizedDifference(['B3', 'B8']).rename('NDWI');
  var vvEnteroMensual = s1Mensual.select('VV').multiply(100).toInt16();
  var entropiaMensual = vvEnteroMensual.glcmTexture({size: 5}).select('VV_ent').rename('entropia_VV');

  var stackMensual = s2Mensual.addBands(ndviMensual).addBands(ndwiMensual).addBands(entropiaMensual);

  var clasificacionMensual = stackMensual.classify(modelo);
  var alertas = clasificacionMensual.eq(1).selfMask();

  Map.addLayer(alertas, {palette: 'FF0000'}, 'Alertas ' + mes + '/' + año, false);
  print('Alertas generadas para ' + mes + '/' + año);
  
  return alertas;
};


// Cuantifiacion putumayo
// ==========================================================================

var putumayo = areaEstudio.filter(ee.Filter.eq('ADM1_NAME', 'Putumayo'));
var putumayoGeometry = putumayo.geometry();

Map.addLayer(putumayo, {color: 'FF8000'}, 'Departamento Putumayo', true, 0.3);
Map.centerObject(putumayo, 8);


var clasificacionPutumayo = stackCaracteristicas.clip(putumayoGeometry).classify(modelo);


var areaMineriaPutumayo = clasificacionPutumayo.eq(1)
    .multiply(ee.Image.pixelArea())
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: putumayoGeometry,
      scale: 50,  
      maxPixels: 1e13,
      tileScale: 2
    });

var hectareasMineriaPutumayo = ee.Number(areaMineriaPutumayo.get('classification')).divide(10000);
print('Área de minería detectada en el Putumayo (ha):', hectareasMineriaPutumayo);

// 4. Degradacion currpos de agua (NDWI) 
var ndwiPutumayo = compuestoMultianualS2.normalizedDifference(['B3', 'B8']).rename('NDWI')
    .clip(putumayoGeometry);

var muestrasNDWI_Mineria = ndwiPutumayo.updateMask(clasificacionPutumayo.eq(1))
    .sample({
      region: putumayoGeometry,
      scale: 50, 
      numPixels: 1000,
      tileScale: 2
    });

var statsNDWI_Mineria = muestrasNDWI_Mineria.aggregate_stats('NDWI');
print(' Estadísticas NDWI en zonas MINERAS (Putumayo):', statsNDWI_Mineria);

// 5. Areas protegidas

var areasProtegidas = ee.FeatureCollection('WCMC/WDPA/current/polygons')
    .filterBounds(putumayoGeometry);

var areasProtegidasImagen = ee.Image().byte().paint({
    featureCollection: areasProtegidas,
    color: 1
}).clip(putumayoGeometry);

var mineriaEnProtegidas = clasificacionPutumayo.eq(1).updateMask(areasProtegidasImagen);


var areaMineriaProtegida = mineriaEnProtegidas.multiply(ee.Image.pixelArea())
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: putumayoGeometry,
      scale: 50, 
      maxPixels: 1e13,
      tileScale: 2
    });

var hectareasMineriaProtegida = ee.Number(areaMineriaProtegida.get('classification')).divide(10000);
print(' Minería dentro de Áreas Protegidas en Putumayo (ha):', hectareasMineriaProtegida);

// 6. Impacto cuenca hidrograficas
var cuencasPutumayo = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_7')
    .filterBounds(putumayoGeometry);

var mineriaPorCuenca = clasificacionPutumayo.eq(1).paint(cuencasPutumayo, 'mineria');

var estadisticasCuencas = mineriaPorCuenca.reduceRegions({
  collection: cuencasPutumayo,
  reducer: ee.Reducer.sum(),
  scale: 50 
});

print('Distribución de minería por cuencas hidrográficas:', estadisticasCuencas);

// 7. VISUALIZACIÓN
Map.addLayer(clasificacionPutumayo, {
    min: 0, max: 3,
    palette: ['darkgreen', 'red', 'gray', 'orange']
}, 'Clasificación - Putumayo', true);

Map.addLayer(areasProtegidasImagen, {palette: 'yellow'}, 'Áreas Protegidas', false);


// DASHBOARD OPERATIVO pendiente terminar
// ==========================================================================
var panels = Map.widgets();
if (panels.length > 0) {
  Map.remove(panels[0]);
}

var panelControl = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    position: 'top-right',
    width: '320px',
    backgroundColor: 'white',
    padding: '15px',
    border: '2px solid #c23b22',
    borderRadius: '8px'
  }
});

var titulo = ui.Label('🚨 SISTEMA DE ALERTAS TEMPRANAS', {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#c23b22',
  textAlign: 'center'
});

var info = ui.Label('Monitoreo de Minería Ilegal\nAmazonía Colombiana', {
  fontSize: '14px',
  textAlign: 'center'
});

var fechaPanel = ui.Panel({
  widgets: [
    ui.Label('📅 SELECCIONAR PERÍODO:', {fontWeight: 'bold'}),
    ui.Label('Mes:'),
    ui.Select({
      items: ['01-Ene', '02-Feb', '03-Mar', '04-Abr', '05-May', '06-Jun', 
              '07-Jul', '08-Ago', '09-Sep', '10-Oct', '11-Nov', '12-Dic'],
      value: '03-Mar'
    }),
    ui.Label('Año:'),
    ui.Select({
      items: ['2022', '2023', '2024'],
      value: '2023'
    })
  ],
  layout: ui.Panel.Layout.flow('vertical')
});

var botonAlertas = ui.Button({
  label: ' Ver Alertas en Mapa',
  onClick: function() {
    print('Mostrando alertas en el mapa...');
    Map.addLayer(clasificacion, {min: 0, max: 3, palette: ['darkgreen', 'red', 'gray', 'orange']}, 'Clasificación 4 Clases');
  }
});

var botonReporte = ui.Button({
  label: ' Generar Reporte PDF',
  onClick: function() {
    print('Generando reporte para autoridades...');
  }
});

var contacto = ui.Label('Contacto: diegooquevedo17@gmail.com', {
  fontSize: '12px',
  color: '#666',
  textAlign: 'center'
});

panelControl.add(titulo);
panelControl.add(info);
panelControl.add(fechaPanel);
panelControl.add(botonAlertas);
panelControl.add(botonReporte);
panelControl.add(contacto);

Map.add(panelControl);

print('Muestras de entrenamiento (4 clases):', datosEntrenamiento);
print('Número total de muestras:', datosEntrenamiento.size());
