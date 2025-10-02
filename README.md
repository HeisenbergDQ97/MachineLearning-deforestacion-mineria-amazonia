# MachineLearning-deforestacion-mineria-amazonia
Modelo ML para análisis de la deforestación por minería Ilegal en la amazonía Colombiana mediante Técnicas de Teledetección y Ciencia de Datos

# Análisis de la Deforestación por Minería Ilegal en la Amazonía Colombiana mediante Técnicas de Teledetección y Ciencia de Datos

## Objetivo General
Desarrollar un modelo analítico basado en técnicas de ciencia de datos y teledetección para el monitoreo, detección temprana y cuantificación de la deforestación asociada a la minería ilegal en la Amazonía colombiana.

## Objetivos Específicos
1.  Caracterizar las áreas afectadas por minería ilegal (2018-2023).
2.  Diseñar e implementar un algoritmo de clasificación Random Forest en GEE.
3.  Cuantificar el impacto ambiental (pérdida de bosque, degradación de agua, proximidad a áreas protegidas).
4.  Proponer un protocolo de alertas tempranas.

## Estructura del Repositorio
- `/scripts`: Código para GEE y Python.
- `/docs`: Documentación y avances de la monografía.
- `/data`: Metadatos y enlaces a conjuntos de datos.

## Metodología
El proyecto sigue un flujo de trabajo de cinco fases: 1. Adquisición de datos, 2. Procesamiento, 3. Modelado, 4. Análisis, 5. Protocolo de alertas.

## Funcionalidades del Proyecto 
**Clasificación de 4 categorías: Bosque conservado, Minería, Zonas urbanas, Deforestación no minera
**Análisis multitemporal: Procesamiento de series temporales 2018-2023
**Detección automatizada: Modelo Random Forest con 91.7% de precisión
**Sistema de alertas: Protocolo de detección temprana mensual
**Dashboard interactivo: Interfaz para monitoreo en tiempo real
**Análisis de impacto: Cuantificación de hectáreas afectadas por minería

## 🛠️ Tecnologías Utilizadas
Plataformas y Herramientas:
- https://img.shields.io/badge/Google%2520Earth%2520Engine-Platform-blue
- https://img.shields.io/badge/QGIS-Spatial%2520Analysis-green
- https://img.shields.io/badge/GitHub-Repository%2520Hosting-black

Lenguajes y Librerías:
- https://img.shields.io/badge/JavaScript-GEE%2520API-yellow
- https://img.shields.io/badge/Python-scikit--learn%252FTensorFlow-blue
- https://img.shields.io/badge/Random%2520Forest-Classifier-orange

## Resultados Destacados
Métricas del Modelo
- Precisión General: 91.7% 
- Matriz de Confusión (4x4):
- Bosque: 100% de precisión
- Minería: 80% de precisión
- Ciudades: 93.7% de precisión
- Deforestación no minera: 94.7% de precisión

## Hallazgos Cuantitativos
**Área total de minería detectada en Putumayo: 948.37 hectáreas
**Distribución por cuencas hidrográficas: 12 cuencas analizadas
**Degradación de cuerpos de agua (NDWI): Valores promedio de -0.334 en zonas mineras vs valores positivos en bosque conservado

