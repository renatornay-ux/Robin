import { NewsArticle, StoryThread } from '../types/news';

export const INITIAL_THREADS: StoryThread[] = [
  {
    id: 'transicion-energetica-regional',
    title: 'La Gran Red: El Nuevo Mapa Energético y sus Fisuras',
    dek: 'Seguimiento continuo al megaproyecto eólico multinacional, los desafíos de almacenamiento de litio y su impacto en las metrópolis.',
    category: 'Clima y Energía',
    status: 'en_desarrollo',
    articleIds: [
      'acuerdo-historico-red-eolica',
      'crisis-baterias-minerales-estrategicos',
      'ciudades-resilientes-movilidad'
    ]
  },
  {
    id: 'investigacion-contratos-publicos',
    title: 'Licitaciones Bajo Sospecha: El Caso Cables Submarinos',
    dek: 'Investigación judicial y forense sobre presuntos sobreprecios y adjudicaciones dirigidas en infraestructuras críticas.',
    category: 'Política y Justicia',
    status: 'en_desarrollo',
    articleIds: [
      'tribunal-investiga-contratos-energeticos'
    ]
  },
  {
    id: 'frontera-cuantica-aplicada',
    title: 'Salto Cuántico: De la Teoría a la Seguridad Crítica',
    dek: 'El despliegue de procesadores ópticos y su irrupción en el peritaje digital y la simulación climática.',
    category: 'Tecnología y Ciencia',
    status: 'en_desarrollo',
    articleIds: [
      'computacion-cuantica-criptoanalisis'
    ]
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'acuerdo-historico-red-eolica',
    slug: 'acuerdo-historico-red-eolica',
    kicker: 'TRANSICIÓN ENERGÉTICA REGIONAL',
    title: 'Tres naciones sellan el pacto para la megared eólica que transformará la matriz del cono sur',
    dek: 'El tratado multilateral destinará 14.000 millones de euros a interconectar parques marinos y terrestres, desatando tensiones regulatorias con los operadores tradicionales.',
    content: `En una sesión extraordinaria celebrada al atardecer en el Pabellón de Cristal, los ministros de energía de las tres principales economías del cono sur estamparon su firma en el protocolo vinculante de la **Red Austral Unificada**. El plan contempla levantar más de 3.200 kilómetros de tendido de alta tensión y habilitar 18 nuevos parques eólicos marinos frente a las costas patagónicas antes de 2030.

"No estamos ante una mera compraventa de excedentes, sino ante la columna vertebral que sostendrá toda la electrificación de nuestras metrópolis y sistemas de transporte durante el próximo medio siglo", enfatizó la [[acuerdo-historico-red-eolica|Dra. Elena Vidal]], jefa de la delegación técnica negociadora.

### Las cláusulas que despiertan reticencias

El núcleo del acuerdo exige que el 70% de los componentes industriales sean producidos en plantas locales y que los precios de inyección se fijen mediante subastas algorítmicas transparentes supervisadas por la [[tribunal-investiga-contratos-energeticos|Comisión Interministerial de Energía]]. Sin embargo, varias distribuidoras privadas manifestaron de inmediato su recelo, argumentando que la velocidad impuesta al calendario dejará sin margen de amortización a las centrales térmicas que aún mantienen contratos vigentes hasta 2032.

Asimismo, analistas del sector advierten que la estabilidad de esta inmensa red dependerá de si se resuelven a tiempo los cuellos de botella en el aprovisionamiento de acumuladores industriales, un frente ya tensionado por la [[crisis-baterias-minerales-estrategicos|crisis de suministro de litio y tierras raras]].

### Interconexión urbana inmediata

Como primer paso operativo, los fondos liberados durante el primer trimestre financiarán la conexión directa entre la subestación del Valle del Viento y las cabeceras del nuevo sistema de transporte metropolitano reflejado en el plan de [[ciudades-resilientes-movilidad|avenidas biófilas y tranvías urbanos]], cuya primera fase comenzará a operar en mayo próximo.

Pese al júbilo diplomático, la sombra de las sospechas administrativas ya se cierne sobre el reparto de los tramos submarinos, asunto que según trascendió ayer motiva ya las pesquisas preliminares de la [[tribunal-investiga-contratos-energeticos|Fiscalía Anticorrupción]].`,
    category: 'Clima y Energía',
    imageUrl: '/src/assets/images/news_energy_transition_1793674356466.jpg',
    imageCaption: 'Sesión plenaria de ministros y delegaciones técnicas al atardecer frente a las colinas eólicas del Valle del Viento.',
    author: {
      name: 'Victoria Salgado',
      role: 'Corresponsal de Energía e Industria',
      location: 'Valle del Viento'
    },
    publishedAt: '2026-11-02',
    readTime: '6 min',
    featured: true,
    threadId: 'transicion-energetica-regional',
    threadOrder: 1,
    connections: [
      {
        targetArticleId: 'ciudades-resilientes-movilidad',
        relationshipType: 'consecuencia',
        description: 'La energía eólica generada por este pacto alimentará directamente el nuevo sistema de tranvías metropolitanos.'
      },
      {
        targetArticleId: 'crisis-baterias-minerales-estrategicos',
        relationshipType: 'contrapunto',
        description: 'El plan carece de suficientes baterías de respaldo debido al encarecimiento del litio y conflictos mineros.'
      },
      {
        targetArticleId: 'tribunal-investiga-contratos-energeticos',
        relationshipType: 'antecedente',
        description: 'Las cláusulas de licitación de los cables de este acuerdo originaron la investigación de la Fiscalía.'
      }
    ],
    entities: [
      { id: 'elena-vidal', name: 'Dra. Elena Vidal', type: 'persona', roleInArticle: 'Negociadora jefa del tratado' },
      { id: 'comision-energia', name: 'Comisión Interministerial de Energía', type: 'organizacion', roleInArticle: 'Ente regulador del pacto' },
      { id: 'valle-del-viento', name: 'Valle del Viento', type: 'lugar', roleInArticle: 'Sede del congreso y parque eólico matriz' },
      { id: 'red-austral', name: 'Red Austral Unificada', type: 'concepto', roleInArticle: 'Megaproyecto de interconexión' }
    ],
    sources: [
      { title: 'Tratado Marco de Interconexión Eólica Austral (Doc. Oficial)', type: 'Documento público' },
      { title: 'Informe de Balance Técnico Energético 2026', type: 'Estudio independiente' }
    ]
  },
  {
    id: 'tribunal-investiga-contratos-energeticos',
    slug: 'tribunal-investiga-contratos-energeticos',
    kicker: 'TRIBUNAL SUPREMO DE JUSTICIA',
    title: 'La Fiscalía Anticorrupción abre diligencias por presuntos sobreprecios en la licitación del tendido submarino',
    dek: 'Los magistrados ordenan inspeccionar los servidores ministeriales tras detectar anomalías en la adjudicación de cables a dos consorcios extranjeros.',
    content: `En una providencia de dieciocho folios notificada a primera hora en la escalinata del Tribunal Supremo de Justicia, la Sala de lo Penal admitió a trámite la querella del Ministerio Fiscal contra tres directores generales y dos intermediarios corporativos por los presuntos delitos de prevaricación, tráfico de influencias y fraude en la contratación pública.

Las pesquisas apuntan al tramo submarino número cuatro de la recientemente suscrita [[acuerdo-historico-red-eolica|megared eólica regional]], valorado en 840 millones de euros. Según el escrito del fiscal Marcos Benítez, el pliego técnico habría sido redactado con especificaciones que solo cumplía una firma ligada al [[acuerdo-historico-red-eolica|Consorcio Marítimo Austral]], descartando ofertas competidoras un 22% más económicas.

### Requerimiento de correos y peritaje informático

Agentes de la Policía Judicial se personaron esta mañana en las dependencias de la Secretaría de Estado con mandamiento judicial para clonar los correos electrónicos y minutas de reunión de los últimos siete meses. Entre los despachos precintados temporalmente figura el de la asesora legal del equipo que encabezó la [[acuerdo-historico-red-eolica|Dra. Elena Vidal]], si bien fuentes judiciales aclaran que la negociadora jefa no figura en calidad de investigada.

Para analizar el volumen de casi cuatro terabytes de comunicaciones cifradas incautadas en los servidores, el juzgado ha solicitado el apoyo técnico de los nuevos algoritmos de análisis forense desarrollados por el [[computacion-cuantica-criptoanalisis|Instituto de Fotónica y Computación Cuántica]], un método pionero en los tribunales del país.

### Repercusiones en las obras urbanas

El temor inmediato en los despachos gubernamentales es que una orden cautelar de suspensión paralice el desembolso de los fondos, lo que retrasaría de rebote los plazos de entrega de las subestaciones auxiliares destinadas a las [[ciudades-resilientes-movilidad|nuevas líneas de tranvía metropolitano]].`,
    category: 'Política y Justicia',
    imageUrl: '/src/assets/images/news_court_investigation_1793674358115.jpg',
    imageCaption: 'Magistrados y periodistas de tribunales en la explanada de la Suprema Corte tras notificarse la apertura de diligencias.',
    author: {
      name: 'Ignacio Larrea',
      role: 'Cronista Jurídico e Investigación',
      location: 'Sede Judicial Central'
    },
    publishedAt: '2026-11-02',
    readTime: '5 min',
    featured: false,
    threadId: 'investigacion-contratos-publicos',
    threadOrder: 1,
    connections: [
      {
        targetArticleId: 'acuerdo-historico-red-eolica',
        relationshipType: 'antecedente',
        description: 'El sumario investiga irregularidades en la licitación de los cables del acuerdo eólico recién firmado.'
      },
      {
        targetArticleId: 'computacion-cuantica-criptoanalisis',
        relationshipType: 'investigacion',
        description: 'Los peritos judiciales usan algoritmos del nuevo laboratorio cuántico para descifrar correos de los servidores incautados.'
      },
      {
        targetArticleId: 'ciudades-resilientes-movilidad',
        relationshipType: 'consecuencia',
        description: 'Una eventual paralización judicial retrasaría las subestaciones eléctricas del tranvía metropolitano.'
      }
    ],
    entities: [
      { id: 'fiscal-benitez', name: 'Fiscal Marcos Benítez', type: 'persona', roleInArticle: 'Fiscal instructor de la querella' },
      { id: 'elena-vidal', name: 'Dra. Elena Vidal', type: 'persona', roleInArticle: 'Mencionada en el expediente como jefa negociadora' },
      { id: 'tribunal-supremo', name: 'Tribunal Supremo de Justicia', type: 'organizacion', roleInArticle: 'Sede del tribunal que instruye el caso' },
      { id: 'consorcio-maritimo', name: 'Consorcio Marítimo Austral', type: 'organizacion', roleInArticle: 'Empresa adjudicataria bajo sospecha' }
    ],
    sources: [
      { title: 'Auto de Diligencias Previas 142/2026 (Juzgado Central)', type: 'Documento judicial' }
    ]
  },
  {
    id: 'computacion-cuantica-criptoanalisis',
    slug: 'computacion-cuantica-criptoanalisis',
    kicker: 'INNOVACIÓN CIENTÍFICA',
    title: 'El Laboratorio Central logra el primer procesador cuántico con corrección de errores por fotónica aplicada',
    dek: 'El avance de 128 cúbits estables revoluciona tanto el modelado de redes energéticas complejas como la auditoría forense de bases de datos masivas.',
    content: `En una sala blanca de aislamiento criogénico bañada por tenues haces láser de zafiro, el equipo liderado por el doctor Julián Sotomayor confirmó hoy un hito que la física del estado sólido perseguía desde hace una década: mantener la coherencia cuántica de 128 cúbits durante más de cuatro minutos continuos sin degradación por decoherencia térmica.

El ingenio, bautizado comercialmente como **Cúbit-X**, prescinde de las voluminosas columnas de helio líquido ultrarrefrigerado gracias a guías de ondas de silicio fotónico que modulan paquetes de luz cuántica a temperatura ambiente.

### De la teoría a los tribunales y los tendidos eléctricos

La relevancia de este avance ha rebasado instantáneamente los límites del ámbito académico. Por un lado, el Ministerio Público ha comisionado al laboratorio un peritaje especial en el marco de la causa de la [[tribunal-investiga-contratos-energeticos|Fiscalía Anticorrupción sobre licitaciones de cables]], donde se requiere examinar registros ofuscados en bases de datos relacionales blindadas sin comprometer la cadena de custodia probatoria.

Por otro lado, los ingenieros de la [[acuerdo-historico-red-eolica|Red Austral Unificada]] han comenzado a correr simulaciones en tiempo real de turbulencias atmosféricas para predecir fluctuaciones eólicas con 48 horas de antelación, multiplicando la eficiencia de inyección en la red troncal.

"No construimos esta máquina para ganar una carrera de laboratorio, sino para resolver problemas donde el cómputo clásico simplemente tarda siglos", apuntó el Dr. Sotomayor mientras calibraba el interferómetro principal.`,
    category: 'Tecnología y Ciencia',
    imageUrl: '/src/assets/images/news_tech_quantum_lab_1793674358552.jpg',
    imageCaption: 'Investigadores en la sala limpia ajustando el interferómetro fotónico del procesador cuántico Cúbit-X.',
    author: {
      name: 'Martín Calvo',
      role: 'Editor de Ciencia y Frontera Tecnológica',
      location: 'Laboratorio Central de Fotónica'
    },
    publishedAt: '2026-11-01',
    readTime: '4 min',
    featured: false,
    threadId: 'frontera-cuantica-aplicada',
    threadOrder: 1,
    connections: [
      {
        targetArticleId: 'tribunal-investiga-contratos-energeticos',
        relationshipType: 'investigacion',
        description: 'La tecnología de este procesador fue comisionada por la fiscalía para peritajes de correos encriptados.'
      },
      {
        targetArticleId: 'acuerdo-historico-red-eolica',
        relationshipType: 'consecuencia',
        description: 'El procesador se utilizará para el software de predicción meteorológica y balance de carga de la red eólica.'
      }
    ],
    entities: [
      { id: 'julian-sotomayor', name: 'Dr. Julián Sotomayor', type: 'persona', roleInArticle: 'Director de investigación del laboratorio' },
      { id: 'instituto-fotonica', name: 'Instituto de Fotónica Avanzada', type: 'organizacion', roleInArticle: 'Centro de desarrollo' },
      { id: 'cubit-x', name: 'Procesador Cúbit-X', type: 'concepto', roleInArticle: 'Hardware cuántico desarrollado' }
    ],
    sources: [
      { title: 'Nature Photonics: Fault-tolerant photonic qubits at scale', type: 'Paper revisado por pares' }
    ]
  },
  {
    id: 'ciudades-resilientes-movilidad',
    slug: 'ciudades-resilientes-movilidad',
    kicker: 'URBANISMO Y SOSTENIBILIDAD',
    title: 'Metrópolis verdes: el plan que peatonaliza las grandes avenidas y expande el tranvía biófilo con energía renovable',
    dek: 'La capital estrena corredores ecológicos que reducen un 40% las emisiones y reorientan el consumo eléctrico hacia la nueva red limpia pactada.',
    content: `Donde antes rugían cuatro carriles de asfalto congestionado por motores de combustión, hoy brota un tapiz vegetal de gramíneas autóctonas escoltado por vías férreas de césped drenante. La inauguración de la remodelada Avenida de los Parques marca el punto de inflexión del plan de transformación urbana más ambicioso del último siglo.

La flota de tranvías ligeros de piso bajo ya transporta a más de 85.000 pasajeros diarios mediante tracción 100% eléctrica. Lo singular del modelo es su contrato de suministro directo: la energía que mueve los convoyes procede directamente de los primeros aerogeneradores habilitados tras la firma de la [[acuerdo-historico-red-eolica|megared eólica regional promovida por Elena Vidal]].

### Mitigación de islas de calor

Las fachadas de madera tratada y jardinería vertical no son solo un reclamo paisajístico: los sensores municipales registraron este mediodía una temperatura en superficie 4,2 grados centígrados inferior a la del pavimento tradicional circundante.

"La ciudad ha dejado de ser una máquina devoradora de hidrocarburos para convertirse en un ecosistema que respira", declaró la arquitecta jefa del Consorcio de Movilidad Verde durante el recorrido inaugural.

### La inquietud por el suministro de flotas

A pesar de la aclamación popular, los sindicatos de transporte expresaron su inquietud por el retraso en la entrega de las 200 unidades complementarias de autobuses de recarga rápida, atribuible directamente a la [[crisis-baterias-minerales-estrategicos|escasez internacional de celdas de litio]] que paraliza los pedidos en aduanas.`,
    category: 'Urbanismo y Sociedad',
    imageUrl: '/src/assets/images/news_urban_climate_1793674358402.jpg',
    imageCaption: 'Avenida de los Parques con tranvía biófilo sobre césped y edificios residenciales con jardines verticales integrados.',
    author: {
      name: 'Sofía Mendonça',
      role: 'Redactora de Hábitat Urbano y Ecología',
      location: 'Distrito Central'
    },
    publishedAt: '2026-10-31',
    readTime: '4 min',
    featured: false,
    threadId: 'transicion-energetica-regional',
    threadOrder: 2,
    connections: [
      {
        targetArticleId: 'acuerdo-historico-red-eolica',
        relationshipType: 'antecedente',
        description: 'El plan de tranvías se financia y abastece con la energía garantizada por el tratado eólico regional.'
      },
      {
        targetArticleId: 'crisis-baterias-minerales-estrategicos',
        relationshipType: 'contrapunto',
        description: 'La escasez de litio frena la entrega de la segunda fase de autobuses eléctricos urbanos.'
      }
    ],
    entities: [
      { id: 'elena-vidal', name: 'Dra. Elena Vidal', type: 'persona', roleInArticle: 'Promotora del enlace energético con la ciudad' },
      { id: 'consorcio-movilidad', name: 'Consorcio de Movilidad Verde', type: 'organizacion', roleInArticle: 'Ente gestor de los tranvías biófilos' },
      { id: 'avenida-parques', name: 'Avenida de los Parques', type: 'lugar', roleInArticle: 'Eje urbano transformado' }
    ],
    sources: [
      { title: 'Auditoría de Calidad del Aire y Descarbonización Urbana', type: 'Informe municipal' }
    ]
  },
  {
    id: 'crisis-baterias-minerales-estrategicos',
    slug: 'crisis-baterias-minerales-estrategicos',
    kicker: 'GEOPOLÍTICA DE RECURSOS',
    title: 'La batalla por el litio y las tierras raras desafía los plazos de electrificación prometidos',
    dek: 'Las trabas arancelarias y las disputas comunitarias en los salares amenazan con encarecer los acumuladores industriales indispensables para estabilizar las redes.',
    content: `En las alturas áridas del Salar del Norte, donde el blanco de la salmuera se pierde en el horizonte andino, la paralización de dos plantas de extracción por mandato judicial ha desatado una onda expansiva en los centros financieros globales.

La producción de carbonato de litio grado batería ha caído un 31% este trimestre, encareciendo el coste por megavatio hora almacenado justo cuando entran en vigor las exigencias del [[acuerdo-historico-red-eolica|Tratado de la Red Eólica Austral]].

### El eslabón más vulnerable de la transición

"Sin sistemas de almacenamiento electroquímico de escala giga, la energía del viento se disipa inútilmente en las madrugadas ventosas", advierte el informe conjunto presentado ante el Ministerio de Minería. La situación golpea tanto a los promotores de los parques eólicos como a los operadores municipales que esperan renovar sus flotas de [[ciudades-resilientes-movilidad|transporte urbano sostenible]].

Las asambleas comunitarias locales exigen una participación del 15% en los cánones mineros y la garantía de que el consumo de agua subterránea no secará las lagunas salinas donde nidifican los flamencos, un debate socioambiental que pone a prueba la retórica verde de los gobiernos firmantes.`,
    category: 'Economía',
    imageUrl: '/src/assets/images/news_energy_transition_1793674356466.jpg',
    imageCaption: 'Salares andinos donde se libran las disputas por las cuotas de extracción de litio.',
    author: {
      name: 'Victoria Salgado',
      role: 'Corresponsal de Energía e Industria',
      location: 'Salar del Norte'
    },
    publishedAt: '2026-10-30',
    readTime: '5 min',
    featured: false,
    threadId: 'transicion-energetica-regional',
    threadOrder: 3,
    connections: [
      {
        targetArticleId: 'acuerdo-historico-red-eolica',
        relationshipType: 'contrapunto',
        description: 'Advierte que el acuerdo eólico no podrá cumplir sus metas sin resolver el almacenamiento de litio.'
      },
      {
        targetArticleId: 'ciudades-resilientes-movilidad',
        relationshipType: 'consecuencia',
        description: 'La caída de producción de litio demora la flota de autobuses eléctricos metropolitanos.'
      }
    ],
    entities: [
      { id: 'elena-vidal', name: 'Dra. Elena Vidal', type: 'persona', roleInArticle: 'Interlocutora en la mesa de diálogo minero' },
      { id: 'salar-del-norte', name: 'Salar del Norte', type: 'lugar', roleInArticle: 'Yacimiento en disputa' },
      { id: 'ministerio-mineria', name: 'Ministerio de Minería', type: 'organizacion', roleInArticle: 'Autoridad concedente' }
    ],
    sources: [
      { title: 'Boletín de Comercio Exterior de Minerales Críticos', type: 'Datos oficiales aduaneros' }
    ]
  }
];
