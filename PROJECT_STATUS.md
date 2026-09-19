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

### 1.3 Funcionalitats Principals
1. **Pausa i Regulació del Temps (Nova)**:
   * Botó de pausa (`⏸️ Pausa` / `▶️ Reprendre`) disponible a la barra superior quan el cronòmetre està actiu.
   * Capa de pausa suau que cobreix l'àrea d'operació per evitar distraccions o bloquejos emocionals, i que congela el temps amb precisió.
   * Dreceres ràpides de pausa: barra d'espai o tecla `P`.
2. **Guia Docent Accessible**:
   * Botó d'accés ràpid a la capçalera (`🎓 Guia docent`) i enllaç discret a la targeta inicial.
   * Finestra modal accessible amb taula comparativa de correspondències curriculars, operacions i explicació detallada del selector dinàmic.
3. **Configuració Inicial Adaptativa**:
   * **Selector de 6 Nivells progressius** amb targetes visuals clares.
   * **Selector dinàmic d'operacions**: Segons el nivell triat, es mostren les operacions pedagògicament pertinents (sumes, restes, multiplicacions, divisions o variat).
   * **Cronòmetre flexible**: 3 minuts per defecte o opció de desactivar-lo per treballar al propi ritme.
   * **Bastida visual (Punts)**: Activable als nivells inicials (1, 2, 3) amb safates de suport d'alçada constant i cercle buit per al $0$ per mantenir una alineació geomètrica perfecta.
   * **Efectes de so**: Sons suaus sintetitzats via *Web Audio API* (activable / desactivable).
   * **Tema Clar / Fosc**: S'adapta al sistema o es commuta manualment amb contrast WCAG AAA.
4. **Dinàmica de la Prova**:
   * 60 operacions consecutives amb 3 opcions de resposta (només 1 correcta).
   * Distractors intel·ligents calculats segons el tipus d'operació.
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

---

## 2. Estat Actual i Punt de Control (Checkpoint)

- **Estat del projecte**: Codi publicat al repositori GitHub i servidor local actiu.
- **Punt exacte**:
  - Repositori GitHub creat i sincronitzat: `https://github.com/elCordones/quinzet_calcul`.
  - Tots els fitxers pujats a la branca `main` (incloent `quinzet-autonom.html` per a ús autònom fora de línia).
  - Llesta per activar GitHub Pages i obtenir l'enllaç públic `https://elcordones.github.io/quinzet_calcul/`.
- **Fitxers clau**:
  - [index.html](file:///C:/Users/David/Desktop/Quinzet%20MESI/index.html): Capçalera, botó de pausa, capa de pausa, modal de guia docent, selector de nivells i resultats.
  - [style.css](file:///C:/Users/David/Desktop/Quinzet%20MESI/style.css): Estils de la capa de pausa (`.pause-overlay`), botó de pausa d'alerta suau, bastida amb alçada uniforme i tema clar/fosc.
  - [app.js](file:///C:/Users/David/Desktop/Quinzet%20MESI/app.js): Lògica de congelació del temps, protecció d'interacció durant la pausa i motor multinivell.
  - [README.md](file:///C:/Users/David/Desktop/Quinzet%20MESI/README.md): Guia d'ús pedagògica actualitzada.
  - [QUINZET.pdf](file:///C:/Users/David/Desktop/Quinzet%20MESI/QUINZET.pdf): Document original de referència.

---

## 3. Full de Ruta d'Implementació (Roadmap)

- [x] Fase 1: Anàlisi del mètode Quinzet i definició del marc NESE.
- [x] Fase 2: Disseny d'interfície responsiva, tema clar/fosc i criteris d'accessibilitat.
- [x] Fase 3: Desplegament local i compactació del peu de pàgina.
- [x] Fase 4: Ampliació a 6 nivells progressius sense estigmatització d'edat.
- [x] Fase 5: Motor per a les 4 operacions bàsiques (sumes, restes, multiplicacions i divisions).
- [x] Fase 6: Panell informatiu i modal de Guia Docent per a les característiques dels nivells.
- [x] Fase 7: Sistema de pausa i regulació temporal de la prova per a NESE.
- [ ] Propers passos:
  - Opcionalment permetre triar el volum d'operacions (ex. 20, 40 o 60) per a sessions molt concentrades.
