export interface TopicDocument {
    title: string;
    file: string;
    isPrincipal?: boolean; // true = tema oficial FORGA, false/undefined = documentación complementaria
}

export interface TopicDefinition {
    id: string; // Supabase UUID
    slug: string; // Unique string identifier
    title: string;
    category: 'common' | 'specific';
    sourceFile?: string; // Legacy: Path to MAIN markdown file
    documents?: TopicDocument[]; // Soporte para múltiples Sub-Documentos (PDFs partidos)
    icon?: string;
}

export const TOPIC_REGISTRY: Record<string, TopicDefinition> = {
    't-com-1-constitucion': {
        id: 'c1110000-0000-0000-0000-000000000000',
        slug: 't-com-1-constitucion',
        title: 'T1 Común: A Constitución española de 1978',
        category: 'common',
        documents: [{ "title": "1  Constitución Bombeiro Forestal C2", "file": "/temario/t-com-1-constitucion/1-_Constitución_bombeiro_forestal_C2.md", "isPrincipal": true }],
        icon: 'Scale'
    },
    't-com-2-estatuto': {
        id: 'c2220000-0000-0000-0000-000000000000',
        slug: 't-com-2-estatuto',
        title: 'T2 Común: Estatuto de autonomía para Galicia',
        category: 'common',
        documents: [{ "title": "2  Estatuto De Autonomia C2  Bombeiro", "file": "/temario/t-com-2-estatuto/2-_estatuto_de_Autonomia_C2-_bombeiro.md", "isPrincipal": true }],
        icon: 'Map'
    },
    't-com-3-procedemento': {
        id: 'c3330000-0000-0000-0000-000000000000',
        slug: 't-com-3-procedemento',
        title: 'T3 Común: Procedemento administrativo común',
        category: 'common',
        documents: [{ "title": "3  Procedemento Administrativo C2 Bombeiro", "file": "/temario/t-com-3-procedemento/3-_Procedemento_administrativo_C2_Bombeiro.md", "isPrincipal": true }],
        icon: 'FileText'
    },
    't-com-4-transparencia': {
        id: 'c4440000-0000-0000-0000-000000000000',
        slug: 't-com-4-transparencia',
        title: 'T4 Común: Transparencia e bo goberno',
        category: 'common',
        documents: [{ "title": "Lei 1/2016 Transparencia e Bo Goberno", "file": "/temario/t-com-4-transparencia/4-_lei_1-2016_transparencia_e_bo_goberno.md", "isPrincipal": true }],
        icon: 'Eye'
    },
    't-com-5-emprego': {
        id: 'c5550000-0000-0000-0000-000000000000',
        slug: 't-com-5-emprego',
        title: 'T5 Común: Emprego público de Galicia',
        category: 'common',
        documents: [{ "title": "5  Emprego Publico C2  Bombeiros", "file": "/temario/t-com-5-emprego/5-_Emprego_publico_C2-_bombeiros.md", "isPrincipal": true }, { "title": "Convocatoria Bombeiro C2", "file": "/temario/t-com-5-emprego/convocatoria_bombeiro_C2.md" }, { "title": "Opo Visor Novas (2) 260213 122755", "file": "/temario/t-com-5-emprego/opo_visor_novas_(2)_260213_122755.md" }],
        icon: 'Briefcase'
    },
    't-com-6-igualdade': {
        id: 'c6660000-0000-0000-0000-000000000000',
        slug: 't-com-6-igualdade',
        title: 'T6 Común: Igualdade de mulleres e homes',
        category: 'common',
        documents: [{ "title": "6 . Lei De Igualdade  Bombeiro", "file": "/temario/t-com-6-igualdade/6_._lei_de_igualdade-_bombeiro.md", "isPrincipal": true }],
        icon: 'Users'
    },
    't-com-7-discapacidade': {
        id: 'c7770000-0000-0000-0000-000000000000',
        slug: 't-com-7-discapacidade',
        title: 'T7 Común: Dereitos das persoas con discapacidade',
        category: 'common',
        documents: [{ "title": "7  Discapacidade   C2 Bombeiros", "file": "/temario/t-com-7-discapacidade/7-_DISCAPACIDADE_-_C2_BOMBEIROS.md", "isPrincipal": true }, { "title": "Decreto 1/2013 Discapacidade", "file": "/temario/t-com-7-discapacidade/Alunmos_decreto_1-2013_discapacidade.md" }],
        icon: 'Accessibility'
    },
    't-com-8-prl': {
        id: 'c8880000-0000-0000-0000-000000000000',
        slug: 't-com-8-prl',
        title: 'T8 Común: Prevención de riscos laborais',
        category: 'common',
        documents: [{ "title": "8.1.  Texto Consolidado Lei 31 1995", "file": "/temario/t-com-8-prl/8.1.-_Texto_Consolidado_Lei_31_1995.md", "isPrincipal": true }, { "title": "8.2.  Presentación Parte Xeral Lei Prl", "file": "/temario/t-com-8-prl/8.2.-_Presentación_parte_xeral_Lei_PRL.md" }],
        icon: 'Shield'
    },
    't-esp-1-defensa': {
        id: 'e1110000-0000-0000-0000-000000000000',
        slug: 't-esp-1-defensa',
        title: 'T1 Específico: Lei 3/2007 Prevención e Defensa',
        category: 'specific',
        documents: [{ "title": "Ley 3 2007 Incendios Consolidado", "file": "/temario/t-esp-1-defensa/ley_3-2007_incendios_consolidado.md", "isPrincipal": true }],
        icon: 'Flame'
    },
    't-esp-2-pladiga': {
        id: 'e2220000-0000-0000-0000-000000000000',
        slug: 't-esp-2-pladiga',
        title: 'T2 Específico: Plan PLADIGA',
        category: 'specific',
        documents: [{ "title": "Presentacion Plan Extinción", "file": "/temario/t-esp-2-pladiga/Presentacion_plan_extinción.md", "isPrincipal": true }, { "title": "Recollida E Transmisión De Datos", "file": "/temario/t-esp-2-pladiga/Recollida_transmision_datos.md" }],
        icon: 'Map'
    },
    't-esp-3-semop': {
        id: 'e3330000-0000-0000-0000-000000000000',
        slug: 't-esp-3-semop',
        title: 'T3 Específico: Sistema SEMOP',
        category: 'specific',
        documents: [{ "title": "SEMOP 2025", "file": "/temario/t-esp-3-semop/SEMOP_2025.md", "isPrincipal": true }, { "title": "Esquema Organizativo Lume Tipoc", "file": "/temario/t-esp-3-semop/Esquema_organizativo_lume_tipoC.md" }, { "title": "Exemplos Sectorizado", "file": "/temario/t-esp-3-semop/Exemplos_sectorización.md" }, { "title": "Guia Traballo E Comunicacións 2", "file": "/temario/t-esp-3-semop/Guia_traballo_e_comunicacións_2.md" }, { "title": "La Dirección Técnica De Extinción De Incendios", "file": "/temario/t-esp-3-semop/La_Direccion_Tecnica_de_Extincion_de_Incendios_For.md" }],
        icon: 'Radio'
    },
    't-esp-4-lume': {
        id: 'e4440000-0000-0000-0000-000000000000',
        slug: 't-esp-4-lume',
        title: 'T4 Específico: Comportamento do Lume',
        category: 'specific',
        documents: [{ "title": "O Lume Forestal 08 07 25", "file": "/temario/t-esp-4-lume/O_lume_forestal_08_07_25.md", "isPrincipal": true }, { "title": "Presentación O Lume Forestal", "file": "/temario/t-esp-4-lume/Presentación_o_lume_forestal.md", "isPrincipal": true }, { "title": "El Índice De Riesgo Diario De Incendio Forestal", "file": "/temario/t-esp-4-lume/EL_ÍNDICE_DE_RIESGO_DIARIO_DE_INCENDIO_FORESTAL.md" }, { "title": "Comportamento Lume Curso EGAP", "file": "/temario/t-esp-4-lume/Comportamento_lume_curso_egap.md" }, { "title": "Curso BB Navarra", "file": "/temario/t-esp-4-lume/Curso_BB_Navarra.md" }, { "title": "Doc Interesantes Definicions", "file": "/temario/t-esp-4-lume/Doc_interesantes_Definicions.md" }, { "title": "Manual Incendios Cuadrillas Aragon", "file": "/temario/t-esp-4-lume/MANUAL_INCENDIOS_CUADRILLAS_Aragon.md" }],
        icon: 'Thermometer'
    },
    't-esp-5-extincion': {
        id: 'e5550000-0000-0000-0000-000000000000',
        slug: 't-esp-5-extincion',
        title: 'T5 Específico: Técnicas de Extinción',
        category: 'specific',
        documents: [{ "title": "Forex Libro Incendio De Interfaz Manual De Actuacion", "file": "/temario/t-esp-5-extincion/FOREX_libro_incendio_de_interfaz_manual_de_actuacion.md", "isPrincipal": true }, { "title": "Manual Operaciones Interfaz Urbano Forestal", "file": "/temario/t-esp-5-extincion/Manual_operaciones_interfaz_urbano_forestal.md" }],
        icon: 'Droplet'
    },
    't-esp-6-prevencion': {
        id: 'e6660000-0000-0000-0000-000000000000',
        slug: 't-esp-6-prevencion',
        title: 'T6 Específico: Accións de Prevención',
        category: 'specific',
        documents: [{ "title": "A Prevencion De Incendios Forestais 2025 Def", "file": "/temario/t-esp-6-prevencion/A_prevencion_de_incendios_forestais_2025_def.md", "isPrincipal": true }, { "title": "Autoproteccion If Gal 2016", "file": "/temario/t-esp-6-prevencion/Autoproteccion_IF_Gal_2016.md" }, { "title": "Configuración Dos Fachos De Goteo", "file": "/temario/t-esp-6-prevencion/Configuración_dos_fachos_de_goteo.md" }, { "title": "Definición Y Recomendaciones Técnicas Puntos Estratégicos", "file": "/temario/t-esp-6-prevencion/DEFINICIÓN_Y_RECOMENDACIONES_TÉCNICAS_EN_EL_DISEÑO_DE_PUNTOS_ESTRATÉGICOS_DE_GESTIÓN.md" }, { "title": "Guia De Pirojardineria", "file": "/temario/t-esp-6-prevencion/Guia_de_pirojardineria.md" }, { "title": "Guía Interface 22.03.2023", "file": "/temario/t-esp-6-prevencion/Guía_interface_22.03.2023.md" }, { "title": "Guía Planificación", "file": "/temario/t-esp-6-prevencion/Guía_planificación.md" }, { "title": "Incendios Fuera De Control Wwf2025", "file": "/temario/t-esp-6-prevencion/Incendios_fuera_de_control_wwf2025.md" }, { "title": "Manual Queimas Prescritas", "file": "/temario/t-esp-6-prevencion/Manual_Queimas_Prescritas.md" }, { "title": "Orden De 31 De Julio De 2007 Biomasa Vegetal", "file": "/temario/t-esp-6-prevencion/ORDEN_de_31_de_julio_de_2007_por_la_que_se_establecen_los_criterios_para_la_gestión_de_la_biomasa_vegetal.md" }, { "title": "Recomendaciontecnica Quemas Def Clif", "file": "/temario/t-esp-6-prevencion/Recomendaciontecnica_quemas_def_clif_270521_tcm30-535069.md" }],
        icon: 'Shield'
    },
    't-esp-7-equipamento': {
        id: 'e7770000-0000-0000-0000-000000000000',
        slug: 't-esp-7-equipamento',
        title: 'T7 Específico: Ferramentas e Maquinaria',
        category: 'specific',
        documents: [{ "title": "Ferramentas Manuais 2025", "file": "/temario/t-esp-7-equipamento/FERRAMENTAS_MANUAIS_2025.md", "isPrincipal": true }, { "title": "A Maquinaria Pesada Na Extincion 2025", "file": "/temario/t-esp-7-equipamento/A_MAQUINARIA_PESADA_NA_EXTINCION_2025.md", "isPrincipal": true }, { "title": "05.1 Ferramentas Manuais", "file": "/temario/t-esp-7-equipamento/05.1_Ferramentas_manuais.md" }, { "title": "05.2 Ferramentas Desbrozador E Motoserra", "file": "/temario/t-esp-7-equipamento/05.2_Ferramentas_desbrozador_e_motoserra.md" }, { "title": "05.3 Ferramentas Motoserra", "file": "/temario/t-esp-7-equipamento/05.3_Ferramentas_motoserra.md" }, { "title": "Clasificación Lanzas Extinción Incendios", "file": "/temario/t-esp-7-equipamento/Clasificación_lanzas_extinción_incendios.md" }, { "title": "Curso De Prevención  De Riscos Laborais No  Manexo De Motoserra", "file": "/temario/t-esp-7-equipamento/CURSO_DE_PREVENCIÓN__DE_RISCOS_LABORAIS_NO__MANEXO_DE_MOTOSERRA.md" }, { "title": "Desrame Con   La Motosierra", "file": "/temario/t-esp-7-equipamento/Desrame_con___la_motosierra.md" }, { "title": "Pliego Condiciones Mquinaria Pesada", "file": "/temario/t-esp-7-equipamento/pliego_condiciones_mquinaria_pesada.md" }],
        icon: 'Hammer'
    },
    't-esp-8-conduccion': {
        id: 'e8880000-0000-0000-0000-000000000000',
        slug: 't-esp-8-conduccion',
        title: 'T8 Específico: Condución e Estiba',
        category: 'specific',
        documents: [{ "title": "A Condución Todoterreo 2025", "file": "/temario/t-esp-8-conduccion/A_CONDUCIÓN_TODOTERREO_2025.md", "isPrincipal": true }, { "title": "Circular 2021 Circulacion V1 Agasp", "file": "/temario/t-esp-8-conduccion/CIRCULAR_2021_CIRCULACION_V1_AGASP.md" }],
        icon: 'Truck'
    },
    't-esp-9-seguridade': {
        id: 'e9990000-0000-0000-0000-000000000000',
        slug: 't-esp-9-seguridade',
        title: 'T9 Específico: Seguridade e EPIs',
        category: 'specific',
        documents: [
            { "title": "Tema IX Seguridade e Saúde 2007", "file": "/temario/t-esp-9-seguridade/1.5.-_Tema_IX_Seguridade_e_Saúde_do_Manual_de_Prevención_e_Defensa_contra_Incendios_Forestais_2007.md", "isPrincipal": true },
            { "title": "Catálogo EPIs CLIF", "file": "/temario/t-esp-9-seguridade/2.9.-_Catalogo_EPIs_CLIF.md", "isPrincipal": true },
            { "title": "Manual PRL Defensa Incendios", "file": "/temario/t-esp-9-seguridade/1.1.-_Manual_de_prevención_de_riscos_laborais_na_defensa_contra_incendios_forestais.md" },
            { "title": "Dez Normas de Combate CLIF", "file": "/temario/t-esp-9-seguridade/1.2.-_Dez_normas_de_combate_(CLIF).md" },
            { "title": "18 Situacións de Atención CLIF", "file": "/temario/t-esp-9-seguridade/1.3.-_18_Situacións_de_Atención_(CLIF).md" },
            { "title": "Ficha Mangueiras MUGATRA", "file": "/temario/t-esp-9-seguridade/1.8.-_Ficha_nº_4_MUGATRA_Mangueiras.md" },
            { "title": "Ficha EPIs", "file": "/temario/t-esp-9-seguridade/13_Ficha_-_Epis.md" },
            { "title": "Análise Riscos Incendios Ministerio 2009", "file": "/temario/t-esp-9-seguridade/2.2.-_Análise_riscos_incendios_Ministerio_2009.md" },
            { "title": "STOP 10 Normas de Seguridade CLIF", "file": "/temario/t-esp-9-seguridade/2.4.-_STOP_10_Normas_de_Seguridade_(CLIF).md" },
            { "title": "STOP 18 Situacións Risco CLIF", "file": "/temario/t-esp-9-seguridade/2.5.-_STOP_18_Situacións_Risco_(CLIF).md" },
            { "title": "STOP OACEL CLIF", "file": "/temario/t-esp-9-seguridade/2.6.-_STOP_OACEL_(CLIF).md" },
            { "title": "Catálogo EPIs CLIF", "file": "/temario/t-esp-9-seguridade/2.9.-_Catalogo_EPIs_CLIF.md" },
            { "title": "Clase N2 Seguridade e Saúde", "file": "/temario/t-esp-9-seguridade/4.1.-_Presentación_clase_N2_Seguridade_e_Saúde_-_Setembro_25.md" },
            { "title": "Clase N3 Seguridade e Saúde", "file": "/temario/t-esp-9-seguridade/5.1.-_Presentación_clase_N3_seguridade_e_saúde.md" },
            { "title": "Clase N5 Repaso Seguridade", "file": "/temario/t-esp-9-seguridade/7.1.-_Presentación_clase_N5_Repaso.md" },
            { "title": "Apeo Del Árbol Con La Motosierra", "file": "/temario/t-esp-9-seguridade/Apeo_del_árbol___con_la_motosierra.md" },
            { "title": "Corte En Trozas Con La Motosierra", "file": "/temario/t-esp-9-seguridade/Corte_en_trozas___con_la_motosierra.md" },
            { "title": "Desbroce Con Desbrozadora", "file": "/temario/t-esp-9-seguridade/Desbroce_con__desbrozadora.md" },
            { "title": "Ficha 01 Riscos Comúns", "file": "/temario/t-esp-9-seguridade/Ficha_01_-_Riscos_Comúns.md" },
            { "title": "Ficha 02 Riscos Comúns Vehículos", "file": "/temario/t-esp-9-seguridade/Ficha_02_-_Riscos_Comúns_Vehículos.md" },
            { "title": "Ficha 03 Helitransportados", "file": "/temario/t-esp-9-seguridade/Ficha_03_-_Helitransportados.md" },
            { "title": "Ficha 04 Mangueiras", "file": "/temario/t-esp-9-seguridade/Ficha_04_-_Mangueiras.md" },
            { "title": "Ficha 05 Mochilas e Batelume", "file": "/temario/t-esp-9-seguridade/Ficha_05_-_Mochilas_e_Batelume.md" },
            { "title": "Ficha 07 Motoserra e Motodesbrozadora", "file": "/temario/t-esp-9-seguridade/Ficha_07_-_Utiles,_motoserra_e_motodesbrozadora.md" },
            { "title": "Ficha 08 Tractor e Apeiro", "file": "/temario/t-esp-9-seguridade/Ficha_08_-_Tractor_e_apeiro.md" },
            { "title": "Ficha 09 Maquinaria", "file": "/temario/t-esp-9-seguridade/Ficha_09_-_Maquinaria.md" },
            { "title": "Ficha Desbrozadora e Cortacésped", "file": "/temario/t-esp-9-seguridade/07_Ficha_-_desbrozadora_y_cortacesped.md" },
            { "title": "Ficha Motoserra 26", "file": "/temario/t-esp-9-seguridade/26_Ficha_-_motosierras.md" },
            { "title": "Ficha Sobreesforzos 36", "file": "/temario/t-esp-9-seguridade/36_Ficha_-_sobreesforzos.md" },
            { "title": "La Motosierra Seguridad", "file": "/temario/t-esp-9-seguridade/La_motosierra_seguridad.md" },
            { "title": "Poda En Altura Con Medios Mecánicos", "file": "/temario/t-esp-9-seguridade/Poda_en_altura_con__medios_mecánicos.md" },
            { "title": "Prevención Picadas Carrachas", "file": "/temario/t-esp-9-seguridade/Prevención_Picadas_Carrachas_01.md" },
            { "title": "Vespa Velutina ISSGA", "file": "/temario/t-esp-9-seguridade/Vespa_Velutina_Issga_cas.md" }
        ],
        icon: 'HardHat'
    },
    't-esp-10-accidentes': {
        id: 'eaaa0000-0000-0000-0000-000000000000',
        slug: 't-esp-10-accidentes',
        title: 'T10 Específico: Accidentes e Autoprotección',
        category: 'specific',
        documents: [{ "title": "Primeiros Auxilios Incendios (Libro Laranxa)", "file": "/temario/t-esp-10-accidentes/Tema_X_Primeiros_auxilios_incendios_libro_laranxa_2007.md", "isPrincipal": true }, { "title": "Clase Nº4 Seguridade e Saúde", "file": "/temario/t-esp-10-accidentes/6.1.-_Presentación_clase_nº_4_Seguridade_e_Saúde.md" }, { "title": "Módulo Atrapamentos AGASP", "file": "/temario/t-esp-10-accidentes/1.7.-_Módulo_Atrapamentos_AGASP.md" }, { "title": "Falecidos Incendios 1991-2015 CLIF", "file": "/temario/t-esp-10-accidentes/2.3.-_Falecidos_incendios_1991-2015_CLIF.md" }, { "title": "Ficha Primeiros Auxilios", "file": "/temario/t-esp-10-accidentes/31_Ficha_-_Primeiros_Auxilios.md" }, { "title": "Placa PAS", "file": "/temario/t-esp-10-accidentes/Placa_PAS_Cas.md" }],
        icon: 'AlertTriangle'
    },
    't-esp-11-comunicacions': {
        id: 'ebbb0000-0000-0000-0000-000000000000',
        slug: 't-esp-11-comunicacions',
        title: 'T11 Específico: Comunicacións',
        category: 'specific',
        documents: [{ "title": "Rede Dixital De Comunicacións TETRA 2025", "file": "/temario/t-esp-11-comunicacions/Rede_dixital_de_comunicacións_TETRA_2025.md", "isPrincipal": true }, { "title": "TETRA 2025", "file": "/temario/t-esp-11-comunicacions/TETRA_2025.md" }, { "title": "05 Cartografia Emisoristas Egap", "file": "/temario/t-esp-11-comunicacions/05_Cartografia_emisoristas_EGAP.md" }, { "title": "Modelo Prego Último", "file": "/temario/t-esp-11-comunicacions/modelo_prego_último.md" }],
        icon: 'Signal'
    },
};

export const getTopicBySlug = (slug: string) => TOPIC_REGISTRY[slug];
export const getAllTopics = () => Object.values(TOPIC_REGISTRY);
