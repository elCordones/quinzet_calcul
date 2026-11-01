# 🧮 El Quinzet · Gimnàstica de Càlcul Mental Adaptat (NESE)

Aplicació web pedagògica interactiva, accessible i multinivell per a l'entrenament del càlcul mental automàtic, inspirada en les sèries de **"El Quinzet"** (des d'etapa inicial fins a 6è de primària), dissenyada amb criteris específics per a alumnat amb **Necessitats Específiques de Suport Educatiu (NESE)**.

---

## 🎯 Criteri Tecnopedagògic: Disseny No Estigmatitzador

En l'atenció a la diversitat i l'educació inclusiva, la **seguretat emocional** de l'alumne és clau per a l'èxit de l'aprenentatge. Quan un alumne de 3r, 4t o 5è de primària amb dificultats en el càlcul o discalcúlia s'enfronta a materials on apareix explícitament "I5", "P5" o "Infantil", sol experimentar rebuig, vergonya o desmotivació.

Per aquest motiu:
* **S'eliminen totes les etiquetes d'edat o curs escolar** tant a la capçalera com a les pantalles de joc i resultats.
* L'aprenentatge s'estructura en **6 Nivells de Repte Matemàtic**:
  1. **Nivell 1 (Iniciació)**: Sumes i restes bàsiques fins a 5 *(corresponent a Abans de 1r / I5)*.
  2. **Nivell 2 (Descoberta)**: Sumes i restes fins a 10 *(corresponent a 1r de Primària)*.
  3. **Nivell 3 (Consolidació)**: Nombres fins a 20 amb primer creuament de desena *(corresponent a 2n de Primària)*.
  4. **Nivell 4 (Progrés)**: Taules inicials de multiplicar (2, 3, 4, 5) i càlcul àgil *(corresponent a 3r de Primària)*.
  5. **Nivell 5 (Avançat)**: Taules completes (1..10) i iniciació a divisions exactes *(corresponent a 4t de Primària)*.
  6. **Nivell 6 (Mestre)**: Càlcul complet amb les 4 operacions i nombres de dues xifres *(corresponent a 5è i 6è)*.

---

## ⚙️ Característiques Principals

1. **Dues Grans Modalitats d'Activitat**:
   * **🎯 Repte Quinzet (Nivells 1 a 6)**: Entrenament de càlcul mental global fidel a les sèries progressives del Quinzet.
   * **✖️ Practicar Taules de Multiplicar**: Mode d'entrenament específic que permet:
     * **Selecció a mida d'una o múltiples taules (1 al 10)** i dreceres pedagògiques per famílies (*Inicials 2·5·10*, *Dobles 2·4·8*, *Grup del 3: 3·6·9*, *Reptes 7·8·9* i *Totes*).
     * **Tres dinàmiques d'entrenament**: **Aleatori** (sense repeticions consecutives), **Ordenat (1 a 10)** (construcció de l'escala) i **Factor ocult ($4 \times ? = 20$)** (reversibilitat cap a la divisió).
     * **Dosificació d'operacions**: Selector de **10** (1 volta ràpida), **20**, **30** o **60** operacions.
     * **Bastida Visual en Matriu (Files × Columnes)**: Representació d'agrupaments de punts per files per visualitzar geomètricament el producte.
2. **Guia Docent Interactiva**:
   * Botó destacat a la capçalera (`🎓 Guia docent`) i a la pantalla inicial que obre una finestra modal amb la taula comparativa de tots els nivells, la correspondència curricular orientativa, el detall del selector dinàmic i les pautes del mode de Taules de Multiplicar.
3. **Adaptabilitat i Accessibilitat NESE**:
   * **Control de Pausa en Directe**: Botó de pausa (`⏸️ Pausa`) al costat del cronòmetre (també accionable amb la barra d'espai o la tecla `P`), que congela el temps i desplega una cortina de descans per atendre l'infant sense penalització de temps.
   * **Selector dinàmic d'operacions**: Els botons de multiplicar (`✖️`) i dividir (`➗`) apareixen de manera natural a partir dels nivells on són curricularment pertinents.
   * **Cronòmetre flexible**: 3 minuts per defecte (fidel a la prova Quinzet), o desactivable per treballar al propi ritme.
   * **Bastida visual (Punts)**: Activable per donar suport a la subitització i representació icònica en els nivells 1, 2 i 3, amb alçada constant i cercle buit per al $0$ per mantenir l'alineació geomètrica.
   * **Botons gegants i espaiats (>85px)** amb prevenció de dobles tocs per a pantalles tàctils i PDI.
   * **Suport de teclat**: Permet respondre amb les tecles `1`, `2` i `3` de l'ordinador, i pausar amb `Espai` o `P`.
2. **Neutralitat durant la Prova**:
   * Cap missatge d'error ni alerta durant la sessió per protegir la concentració i evitar la frustració primerenca.
3. **Revisió Final i Avaluació**:
   * Indicador del nivell assolit, recompte d'encerts, operacions fetes i temps emprat.
   * **Acordió desplegable (amagat per defecte)** per analitzar individualment les operacions encertades i errades.
   * **Botó d'impressió** preparat amb estils d'informe net per al dossier docent de seguiment.
4. **Tema i So**:
   * Selector Clar / Fosc / Automàtic de contrast elevat (WCAG AAA).
   * Sons suaus sintetitzats via *Web Audio API* (100% autònom i desactivable).
5. **Privacitat Total**:
   * 100% *client-side*, sense servidors ni recollida de dades.

---

## 📜 Llicenciament i Atribució

- **Autoria**: David Cordones
- **Any**: 2026
- **Llicència de codi**: AGPL v3
- **Llicència de continguts educatius**: Creative Commons Reconeixement-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)
