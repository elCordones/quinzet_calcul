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
1. **Doble Modalitat d'Activitat (Commutador Superior)**:
   * **🎯 Repte Quinzet (Nivells 1 a 6)**: Entrenament global per nivells amb 60 operacions.
   * **✖️ Practicar Taules de Multiplicar**: Entrenament focalitzat de les taules de l'1 al 10 amb:
     * Selecció lliure d'una o múltiples taules i dreceres didàctiques per famílies (*Inicials 2·5·10*, *Dobles 2·4·8*, *Grup del 3: 3·6·9*, *Reptes 7·8·9*, *Totes 1..10*).
     * Tres modalitats de pràctica: **Aleatori** (amb baralla equilibrada sense repeticions consecutives), **Ordenat (1 a 10)** i **Factor ocult ($a \times ? = c$)**.
     * Selector de quantitat d'operacions (**10, 20, 30 o 60**).
     * **Bastida visual matricial (files × columnes)**: Agrupaments visuals numerats per fila per facilitar la comprensió conceptual del producte i del factor ocult.
2. **Pausa i Regulació del Temps**:
   * Botó de pausa (`⏸️ Pausa` / `▶️ Reprendre`) a la barra superior quan el cronòmetre està actiu.
   * Cortina de pausa suau que oculta les operacions per permetre aturar-se sense penalització temporal.
   * Dreceres de teclat ràpides: barra d'espai o tecla `P`.
3. **Guia Docent Accessible**:
   * Botó destacat a la capçalera (`🎓 Guia docent`) i enllaç a la pantalla de configuració.
   * Finestra modal accessible (`<dialog>`) amb taula comparativa dels 6 nivells, correspondència curricular, selector dinàmic i guia del mode de Taules de Multiplicar.
4. **Configuració Inicial Adaptativa**:
   * **Selector de 6 Nivells progressius** amb targetes visuals de disseny net.
   * **Selector dinàmic d'operacions**: Els botons de multiplicar (`✖️`) i dividir (`➗`) s'activen automàticament segons el nivell triat.
   * **Cronòmetre flexible**: 3 minuts per defecte o desactivable per treballar al propi ritme.
   * **Bastida visual (Punts lineals i Matriu de grups)**: Activable als nivells inicials (1, 2, 3) amb safates de suport d'alçada constant (`38px`) i cercle buit discontinu per al $0$, i en format de matriu de files × columnes dins del mode Taules.
   * **Efectes de so**: Síntesi suau via *Web Audio API* (activable / desactivable).
   * **Tema Clar / Fosc**: S'adapta al sistema o es commuta manualment amb contrast d'alta llegibilitat WCAG AAA.
5. **Dinàmica de la Prova**:
   * Sèries de 60 operacions (o 10, 20, 30, 60 en mode Taules) amb 3 opcions de resposta (només 1 correcta).
   * Distractors intel·ligents calculats segons el tipus d'operació ($\pm 1$, $\pm 2$, múltiples propers i factors positius en mode factor ocult).
   * **Absència de retroacció d'error/encert en directe** per evitar l'ansietat en la tasca.
   * Debouncing de 180 ms per evitar dobles tocs involuntaris en tauletes.
   * Dreceres de teclat (tecles 1, 2, 3).
6. **Pantalla Final de Resultats**:
   * Resum de dades: encerts, operacions contestades i temps dedicat.
   * Indicador neutre del nivell o de les taules i modalitat practicades.
   * Missatge de reforç positiu empàtic proporcional al nombre d'operacions de la sessió.
   * **Desglossament detallat (acordió amagat per defecte)**: consulta d'operacions encertades i errades (incloent la notació `a × [b] = c` per al factor ocult).
   * Botó d'impressió optimitzat per al dossier docent o informe NESE.
7. **Privacitat i Llicenciament**:
   * 100% *client-side*, sense servidors ni recollida de dades.
   * Peu de pàgina discret i compactat amb atribució docent a David Cordones (2026), codi AGPL v3 i contingut CC BY-SA 4.0.
   * Favicon vectorial SVG personalitzat integrat.

---

## 2. Estat Actual i Punt de Control (Darrera sessió: 2026-11-01)

- **Estat del projecte**: **Funcional i verificat — Ampliat amb el nou mode «Practicar Taules de Multiplicar» i sincronitzat amb `quinzet-autonom.html`.**
- **Punt exacte de tancament**:
  - Implementat i verificat el commutador superior d'activitat (`🎯 Repte Quinzet` vs `✖️ Practicar Taules`) a la pantalla d'inici (`#setup-screen`).
  - Desenvolupat el panell configurador de taules amb selecció múltiple de l'1 al 10, dreceres pedagògiques per famílies (*Inicials 2·5·10*, *Dobles 2·4·8*, *Grup del 3: 3·6·9*, *Reptes 7·8·9* i *Totes 1..10*), selector de dinàmica (*Aleatori*, *Ordenat 1 a 10*, *Factor ocult $a \times ? = c$*) i selector de quantitat d'operacions (*10, 20, 30, 60*).
  - Implementada la bastida visual matricial (`#matrix-scaffold-container`) amb files numerades i agrupaments de punts per visualitzar geomètricament el producte i el factor ocult.
  - Ampliada la finestra modal de Guia Docent (`#teacher-guide-modal`) amb l'explicació pedagògica del nou mode.
  - Regenerada la versió autònoma tot en un per a ús fora de línia: `quinzet-autonom.html`.
- **Decisions tècniques i incidències resoltes**:
  - **Generació per baralles equilibrades (`generateTablesOperationsList`)**: En mode aleatori i factor ocult es generen permutacions completes del conjunt de fets seleccionats evitant que l'última operació d'una baralla coincideixi amb la primera de la següent, garantint representació homogènia i cap repetició consecutiva.
  - **Aïllament d'esdeveniments entre modes**: S'ha acotat el selector de botons d'operació del Quinzet a `#operation-modes-container .mode-btn` per evitar col·lisions d'estat amb els botons `.tables-mode-btn`.
  - **Barem motivacional proporcional**: Els missatges finals de reforç es calculen sobre la ràtio d'encerts (`hitsCount / totalOps`: $\ge 83\%$, $\ge 50\%$, $\ge 25\%$) perquè siguin coherents tant en sèries de 10, 20 o 30 operacions com en les de 60.
- **Fitxers clau del projecte**:
  - [index.html](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/index.html): Estructura semàntica de les 3 pantalles, commutador d'activitat, panell configurador de taules, contenidor de bastida matricial i guia docent ampliada.
  - [style.css](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/style.css): Estils responsius, pestanyes d'activitat, graella de taules, píndoles de famílies, matriu visual de files × columnes i impressió.
  - [app.js](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/app.js): Motor matemàtic per als 6 nivells + generador equilibrat de taules (`generateTablesOperationsList`), factor ocult, bastida matricial (`renderMatrixScaffold`), temporitzador amb pausa i Web Audio API.
  - [favicon.svg](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/favicon.svg): Icona vectorial amb la Q de Quinzet i operadors matemàtics.
  - [quinzet-autonom.html](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/quinzet-autonom.html): Fitxer únic tot en un actualitzat per a ús autònom fora de línia.
  - [README.md](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/README.md): Guia d'ús pedagògica per al professorat.
  - [QUINZET.pdf](file:///C:/Users/David/Desktop/ANTIGRAVITY/Quinzet%20MESI/QUINZET.pdf): Document original de referència metodològica.

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
- [x] Fase 9: Nou mode d'activitat «Practicar Taules de Multiplicar» (selecció per famílies, mode ordenat/aleatori/factor ocult, selector 10/20/30/60 operacions i bastida visual matricial).
- [ ] Propostes per a properes sessions:
  - **Publicació dels nous canvis a GitHub (`git commit` i `git push`)**: Actualitzar el desplegament a GitHub Pages amb el nou mode de Taules.
  - **Rècords personals locals**: Emmagatzematge a `localStorage` de la millor puntuació per nivell i per taula (sense dades personals) per motivar la superació pròpia.
  - **Instal·labilitat com a PWA (Progressive Web App)**: Afegir `manifest.json` i un *Service Worker* per instal·lar-la com a aplicació d'escriptori o tauleta amb un clic.
