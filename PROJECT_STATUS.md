# Estat del Projecte: El Quinzet · Càlcul Mental Adaptat NESE

## 1. Especificacions del Projecte

### 1.1 Objectiu Pedagògic
Desenvolupar una aplicació web interactiva, accessible i inclusiva per a l'entrenament del càlcul mental automàtic, inspirada en les sèries oficials de **"El Quinzet"** (des d'etapa inicial fins a 6è de primària), amb adaptacions específiques per a alumnat amb **Necessitats Específiques de Suport Educatiu (NESE)**.

### 1.2 Criteri Tecnopedagògic de No Estigmatització
- **Dignitat i Seguretat Emocional**: S'eliminen conscientment totes les etiquetes d'edat o curs escolar ("I5", "Infantil", "P5", "1r de Primària", etc.) de la interfície d'ús de l'alumne.
- **Atenció a la Diversitat**: Un alumne de cursos superiors amb dificultats en el càlcul o desfasament curricular pot entrenar els nivells inicials amb total tranquil·litat i sense sentir-se infantilinitzat davant del grup-classe.
- **Nomenclatura Neutra i Rigorosa**:
  - **Nivell 1 (Iniciació)**: Sumes i restes fins a 5 *(corresponent a Abans de 1r / I5)*.
  - **Nivell 2 (Descoberta)**: Sumes i restes fins a 10 *(corresponent a 1r de Primària)*.
  - **Nivell 3 (Consolidació)**: Nombres fins a 20 amb primer pas de desena *(corresponent a 2n de Primària)*.
  - **Nivell 4 (Progrés)**: Taules inicials de multiplicar (2, 3, 4, 5) i càlcul ràpid *(corresponent a 3r de Primària)*.
  - **Nivell 5 (Avançat)**: Taules completes (1..10) i divisions exactes elementals *(corresponent a 4t de Primària)*.
  - **Nivell 6 (Mestre)**: Les 4 operacions combinades i càlcul àgil amb dues xifres *(corresponent a 5è i 6è de Primària)*.

### 1.3 Funcionalitats Principals Implementades
1. **Pausa i Regulació del Temps**:
   * Botó de pausa (`⏸️ Pausa` / `▶️ Reprendre`) a la barra superior quan el cronòmetre està actiu.
   * Cortina de pausa suau que oculta les operacions per permetre aturar-se sense penalització temporal.
   * Dreceres de teclat ràpides: barra d'espai o tecla `P`.
2. **Guia Docent Accessible**:
   * Botó destacat a la capçalera (`🎓 Guia docent`) i enllaç a la pantalla de configuració.
   * Finestra modal accessible (`<dialog>`) amb taula comparativa dels 6 nivells, correspondència curricular i funcionament del selector dinàmic.
3. **Configuració Inicial Adaptativa**:
   * **Selector de 6 Nivells progressius** amb targetes visuals de disseny net.
   * **Selector dinàmic d'operacions**: Els botons de multiplicar (`✖️`) i dividir (`➗`) s'activen automàticament segons el nivell triat.
   * **Cronòmetre flexible**: 3 minuts per defecte o desactivable per treballar al propi ritme.
   * **Bastida visual (Punts)**: Activable als nivells inicials (1, 2, 3) amb safates de suport d'alçada constant (`38px`) i cercle buit discontinu per al $0$ per garantir una alineació geomètrica perfecta.
   * **Efectes de so**: Síntesi suau via *Web Audio API* (activable / desactivable).
   * **Tema Clar / Fosc**: S'adapta al sistema o es commuta manualment amb contrast d'alta llegibilitat WCAG AAA.
4. **Dinàmica de la Prova**:
   * 60 operacions consecutives amb 3 opcions de resposta (només 1 correcta).
   * Distractors intel·ligents calculats segons el tipus d'operació ($\pm 1$, $\pm 2$, sense negatius ni repetits).
   * **Absència de retroacció d'error/encert en directe** per evitar l'ansietat en la tasca.
   * Debouncing de 180 ms per evitar dobles tocs involuntaris en tauletes.
   * Dreceres de teclat (tecles 1, 2, 3).
5. **Pantalla Final de Resultats**:
   * Resum de dades: encerts, operacions contestades i temps dedicat.
   * Indicador neutre del nivell realitzat (ex. "Nivell 1 · Iniciació").
   * Missatge de reforç positiu empàtic i respectuós.
   * **Desglossament detallat (acordió amagat per defecte)**: consulta d'operacions encertades i errades.
   * Botó d'impressió optimitzat per al dossier docent o informe NESE.
6. **Privacitat i Llicenciament**:
   * 100% *client-side*, sense servidors ni recollida de dades.
   * Peu de pàgina discret i compactat amb atribució docent a David Cordones (2026), codi AGPL v3 i contingut CC BY-SA 4.0.
   * Favicon vectorial SVG personalitzat integrat.

---

## 2. Estat Actual i Punt de Control (Checkpoint de Tancament)

- **Estat del projecte**: **Finalitzat, auditat i publicat amb èxit.**
- **Punt exacte de tancament**:
  - Repositori GitHub creat i sincronitzat: [https://github.com/elCordones/quinzet_calcul](https://github.com/elCordones/quinzet_calcul).
  - Desplegament web llest per a GitHub Pages: `https://elcordones.github.io/quinzet_calcul/`.
  - Versió autònoma generada per a ús sense connexió: `quinzet-autonom.html`.
  - Servidor de desenvolupament local aturat de manera neta.
- **Fitxers clau del projecte**:
  - [index.html](file:///C:/Users/David/Desktop/Quinzet%20MESI/index.html): Estructura semàntica i accessible de les 3 pantalles, modal de guia docent i favicon.
  - [style.css](file:///C:/Users/David/Desktop/Quinzet%20MESI/style.css): Estils responsius, temes clar/fosc d'alt contrast (WCAG AAA), modal, cortina de pausa i impressió.
  - [app.js](file:///C:/Users/David/Desktop/Quinzet%20MESI/app.js): Motor matemàtic per als 6 nivells, distractors, temporitzador amb pausa, Web Audio API i bastida visual.
  - [favicon.svg](file:///C:/Users/David/Desktop/Quinzet%20MESI/favicon.svg): Icona vectorial amb la Q de Quinzet i operadors matemàtics.
  - [quinzet-autonom.html](file:///C:/Users/David/Desktop/Quinzet%20MESI/quinzet-autonom.html): Fitxer únic tot en un per a ús autònom fora de línia.
  - [README.md](file:///C:/Users/David/Desktop/Quinzet%20MESI/README.md): Guia d'ús pedagògica per al professorat.
  - [QUINZET.pdf](file:///C:/Users/David/Desktop/Quinzet%20MESI/QUINZET.pdf): Document original de referència metodològica.

---

## 3. Full de Ruta d'Implementació (Roadmap / Propers Passos)

- [x] Fase 1: Anàlisi del mètode Quinzet i definició del marc NESE.
- [x] Fase 2: Disseny d'interfície responsiva, tema clar/fosc i criteris d'accessibilitat.
- [x] Fase 3: Desplegament local i compactació del peu de pàgina.
- [x] Fase 4: Ampliació a 6 nivells progressius sense estigmatització d'edat.
- [x] Fase 5: Motor per a les 4 operacions bàsiques (sumes, restes, multiplicacions i divisions).
- [x] Fase 6: Panell informatiu i modal de Guia Docent per a les característiques dels nivells.
- [x] Fase 7: Sistema de pausa i regulació temporal de la prova per a NESE.
- [x] Fase 8: Disseny de Favicon SVG i publicació al repositori GitHub.
- [ ] Propostes per a properes sessions:
  - **Selector de quantitat d'operacions**: Permetre triar sèries de 20, 30 o 60 operacions per a alumnes amb temps d'atenció sostinguda molt breu.
  - **Rècords personals locals**: Emmagatzematge a `localStorage` de la millor puntuació per nivell (sense dades personals) per motivar la superació pròpia.
  - **Instal·labilitat com a PWA (Progressive Web App)**: Afegir `manifest.json` i un *Service Worker* per instal·lar-la com a aplicació d'escriptori o tauleta amb un clic.
