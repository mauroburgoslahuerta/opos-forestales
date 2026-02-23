# EL ÍNDICE DE RIESGO DIARIO DE INCENDIO FORESTAL (IRDI)

Desde los orígenes de la lucha contra los incendios forestales ha sido una constante la voluntad de poder prever con antelación la variación del riesgo de incendio, tanto para la predicción de las situaciones que han dado lugar a accidentes fatales, como para establecer el grado de despliegue del dispositivo. Para determinar esto, de los 3 lados del triángulo del comportamiento del fuego, de manera obvia, para un lugar dado, esto debía de pasar por el análisis de la meteorología. En un principio se basaba en el análisis del viento, temperatura e humedad relativa que, mediante el uso de una serie de tablas (que cada vez fueron incorporando más factores como la insolación, época del año, la característica del viento como terral o no, las famosas tablas psicométricas) dieron como resultado los primeros índices numéricos de riesgo, probabilidad de ignición e incluso estimar el comportamiento del fuego esperado. Con la llegada de las herramientas informáticas se pudieron implementar cálculos más complejos, mejorando la predicción y obteniendo nuevas estimaciones del comportamiento del fuego, como son la velocidad de propagación, intensidad lineal, calor por unidad de superficie, etc.

Pronto se vio la necesidad de dar a conocer estos resultados a la población (bien para que conocieran las limitaciones legales asociadas al riesgo, bien para que intensificaran las medidas de precaución en el uso del fuego), por lo que fue necesario trasladar ese resultado numérico del riesgo a un índice cualitativo, sencillo y comparable (riesgo alto, medio, bajo, etc) y, casi siempre, acompañado de una clave de colores. Finalmente, el desarrollo de los sistemas de información geográfica (SIG) permitió trasladar ese valor numérico a un mapa, donde aparecerían esos índices cualitativos con sus colores.

Actualmente todas las administraciones con responsabilidad en la lucha contra los incendios forestales disponen de índices de riesgo, basados en predicciones y observaciones meteorológicas, más o menos elaborados, generados a través de un SIG, y normalmente accesibles es un entorno web tanto para el personal del dispositivo como al público en general (que en algunas administraciones es distinto, más simplificado en el segundo caso, con índices homogéneos para cada unidad administrativa, para facilitar su interpretación por los administrados).

Actualmente hay múltiples índices de riesgo. Casi todos ellos integran las mismas variables, que son las que contribuyen al inicio del incendio. Realmente buscan estimar la probabilidad de que un foco de calor en contacto con los combustibles de un territorio provoque la ignición de los mismos y provoque un incendio. Esas variables son:

-   **Humedad del combustible** (normalmente del combustible muerto).
-   **Humedad relativa**.
-   **Temperatura**.
-   **Viento**.
-   **Precipitación acumulada** (o sequía acumulada).

Como ya hemos visto, hay múltiples índices. Citaremos algunos de ellos:

-   **FWI**: muy extendido, es el adoptado por Galicia para base de su índice de riesgo (**IRDI**), que es la base de diversos condicionantes legales (actividades permitidas, graduación de determinadas sanciones). También en otras CCAA y otros países (Portugal, Chile, etc) lo vimos en la ley 3/2007 y hace referencia a 5 índices de riesgo, pero no indica como calcularlo.
-   **Índice estadounidense (NFRD)**. Es más que un índice de planificación, ya que determina el esfuerzo que va a ser necesario durante la campaña en virtud de como se presenta climatológicamente la misma.
-   **Índice de Propagación Potencial (IPP)** desarrollado para Castilla-La Mancha, en un intento de superar las carencias de FWI por Fernando Chico Zamora. Caracteriza la intensidad, desarrollo y dificultad de extinción de un incendio para un momento y lugar determinado. Determina las ventanas para que se produzca un GIF.

Algunos autores recogen índices meteorológicos puros como índices de riesgo de incendio. Un ejemplo sería Haines o CAPE, pero en realidad son índices relacionados con la inestabilidad atmosférica. Está claro que un incendio en condiciones de inestabilidad tiene peor comportamiento, pero por si solos no explican ese comportamiento: de hecho, podemos tener valores altos de estos índices y estar lloviendo...

## FWI (Índice Canadiense)

El índice **FWI** (índice Canadiense) que es el que da lugar al IRDI, está diseñado para terrenos llanos (Canadá) y para masas monoespecíficas de coníferas, y se elabora a partir de 4 datos meteorológicos que se obtienen a partir de estaciones meteorológicas y de un modelo meteorológico, medidos a las 12 UTC del mismo día del cálculo (ya que se considera que los incendios serán más intensos alrededor de esa hora), siendo los datos meteorológicos de entrada los siguientes:

-   Humedad relativa a las 12 UTC
-   Velocidad del viento a metros de altura
-   Precipitación del día anterior
-   Temperatura a las 12 UTC

### Limitaciones del FWI en Galicia

Ojo al detalle, estos cuatro valores presentan unas limitaciones que llegan a dar errores en la predicción del IRDI, ya que el índice canadiense no tiene en cuenta factores meteorológicos y topográficos que en Galicia originan grandes incendios forestales como son:

-   No tiene en cuenta la topografía (incendios topográficos)
-   No tiene en cuenta la inestabilidad atmosférica (fuegos convectivos)
-   No tiene en cuenta los vientos locales (valle, ladera, brisas)
-   No tiene en cuenta fenómenos que tienen gran incidencia en los incendios forestales como las “Noches tropicales”, ya que como habíamos dicho la temperatura y la humedad se miden a las 12 UTC (Ojo, si por la noche la humedad no sube del 60% los combustibles finos muertos no recuperan la humedad (1 hora) y consecuentemente provoca que a la mañana siguiente ademas de estar disponibles para arder los combustibles finos muertos, tambien lo estaran los combustibles regulares (10 horas))

### Factores correctores aplicados al FWI

El índice FWI no se aplica directamente para calcular el riesgo, se le aplican correctores factores de correción que pueden ser de tipo:

-   Estadísticos: aplicando percentiles de frecuencia a cada intervalo
-   Sociológicos: según el historial de incendios por zonas y mes
-   Medio físico: vegetación y/o relieve
-   Climáticos: modulando valores o incluyendo nuevos factores

## Subíndices que componen el FWI

El FWI se obtiene a partir de la combinación de otros 6 subíndices, que se organizan en 3 “estratos”, ya que los segundos se calculan a partir de los primeros, y de los segundos se obtiene el FWI. Se basa en determinar la humedad de (de más superficial a más profunda).

Supongo que alguno de vosotros ya habrá oído hablar de estos terminos en algún momento pero vamos a desarrollarlos un poco.

### Primer nivel de subíndices (Contenido de humedad del combustible)

Los 3 primeros (**FMMC, DMC, DC**) se refieren al contenido de humedad del combustible considerando 3 capas de suelo orgánico de diferente profundidad lo que permite medir diferentes velocidades de desecación y una mayor eficacia en la ignición (se incluyeron en el modelo debido a que los bosques canadienses tienen un grueso estrato orgánico subyacente a la capa de hojarasca, pero este estrato es bastante menor en las zonas forestales de España).

-   **FFMC (Fine Fuel Moisture Code)** o Código de Humedad de los Combustibles Ligeros o Finos Muertos: estima la humedad de los combustibles ligeros muertos y de la materia orgánica en una capa de suelo superficial (1.2 cm de profundidad). Su valor depende de la temperatura, humedad relativa, velocidad del viento y precipitación acumulada de las últimas 24 horas así como del índice del día anterior, ya que es acumulativo. Es un buen indicador de la probabilidad de ignición de que un incendio sea producido por partículas incandescentes o que tenga origen antrópico, ya que este tipo de materiales son muy susceptibles de ser inflamados.
-   **DMC (Duff Moisture Code)** o Código del Contenido de Humedad de la Hojarasca: Estima el contenido de humedad de los combustibles de tamaño mediano (entre 3.8 y 7.6 cm de diámetro) y de la materia orgánica de una capa del suelo intermedia (unos 7 cm de profundidad) y un peso de materia seca de unas 50 t/ha. Depende de la temperatura, la humedad relativa del aire, la precipitación acumulada en 24 horas y de su valor del día anterior (otro índice acumulativo).
-   **DC (Drought Code)** o Código de Sequía: Estima el contenido de humedad de los combustibles de gran tamaño con un diámetro entre 12.7 y 17.8 cm y de la materia orgánica de una capa del suelo más profunda (unos 18 cm de profundidad y un peso de materia seca de unas 250 t/ha). Su valor depende de la temperatura del aire, la precipitación registrada en las últimas 24 horas, el valor del subíndice del día anterior (acumulativo) y de la duración del día. Es un buen indicador de los efectos estacionales de la sequía en los combustibles de gran tamaño.

### Segundo nivel de índices

El segundo nivel de índices es el siguiente:

-   **ISI (Initial Spread Index)** o Índice de Propagación Inicial: Mediante una combinación del FFMC y de la velocidad del viento se estima la velocidad de propagación del fuego en el frente, en terreno llano y en ausencia de medidas de extinción, sin la influencia de la variabilidad debida al combustible.
-   **BUI (Build-Up Index)** o Índice de Combustible Disponible: Se obtiene con una combinación de los índices DMC y DC. Estima el combustible total disponible (partículas medias y gruesas) para la combustión y propagación del fuego, incluyendo los combustibles pesados que se hallan en el suelo y que pueden alimentar el fuego.

### El último índice: FWI

El último índice FWI:

-   **FWI (Fire Weather Index)** o Índice Meteorológico de Incendios Forestales: Se obtiene combinando los dos anteriores; es decir, el FWI constituye una buena medida de la probabilidad de ignición, la posible extensión del incendio y la dificultad de extinción. El índice FWI representa la intensidad de propagación del fuego, medida como energía desarrollada por unidad de longitud del frente del incendio, y puede ser considerado como un índice de comportamiento del fuego.

Normalmente el valor del índice FWI se halla dentro del rango (0–100, Galicia 12-50) aunque en la práctica en Galicia se estratifica en 5 clases o niveles de riesgo (bajo, moderado, alto, muy alto y extremo) estimados a partir del método de calibración.

En redacciones del Pladiga se hace referencia a la relación entre el FWI y el IRDI: “El índice de riesgo diario de incendio forestal determina, para cada día, el riesgo de ocurrencia de un incendio forestal. Este índice está fundamentado en el denominado Forest Fire Weather Index (FWI), conocido también como índice canadiense, que consiste en el análisis de los diversos factores meteorológicos que influyen en el comportamiento del fuego, tales como:

1.  Condiciones de sequía de los últimos meses: estado de turgencia de los matorrales.
2.  Condiciones de sequía de las últimas semanas y días: estado del pasto y combustibles muertos medios y gruesos.
3.  Condiciones actuales de humedad y temperatura: estado de los combustibles muertos finos.
4.  Condiciones actuales de viento: efecto de la propagación del viento.