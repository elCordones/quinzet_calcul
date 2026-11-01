/**
 * EL QUINZET - CÀLCUL MENTAL ADAPTAT NESE (MULTINIVELL)
 * Lògica de l'aplicació, motor de càlcul adaptat a 6 nivells de progressió,
 * síntesi Web Audio API, interfície neutra sense estigmes d'edat i accessibilitat.
 * 
 * Autoria: David Cordones (2026)
 * Llicència del codi: AGPL v3
 */

(() => {
  'use strict';

  // ==========================================================================
  // CONFIGURACIÓ DE NIVELLS (Noms neutres i rigor matemàtic)
  // ==========================================================================
  const LEVELS_CONFIG = {
    1: {
      id: 1,
      title: 'Nivell 1',
      name: 'Iniciació',
      scope: 'Sumes i restes fins a 5',
      allowedModes: ['sumes', 'restes', 'variat'],
      allowScaffold: true
    },
    2: {
      id: 2,
      title: 'Nivell 2',
      name: 'Descoberta',
      scope: 'Sumes i restes fins a 10',
      allowedModes: ['sumes', 'restes', 'variat'],
      allowScaffold: true
    },
    3: {
      id: 3,
      title: 'Nivell 3',
      name: 'Consolidació',
      scope: 'Nombres fins a 20',
      allowedModes: ['sumes', 'restes', 'variat'],
      allowScaffold: true
    },
    4: {
      id: 4,
      title: 'Nivell 4',
      name: 'Progrés',
      scope: 'Taules de multiplicar (2 a 5)',
      allowedModes: ['sumes', 'restes', 'mult', 'variat'],
      allowScaffold: false
    },
    5: {
      id: 5,
      title: 'Nivell 5',
      name: 'Avançat',
      scope: 'Taules completes i divisions',
      allowedModes: ['sumes', 'restes', 'mult', 'div', 'variat'],
      allowScaffold: false
    },
    6: {
      id: 6,
      title: 'Nivell 6',
      name: 'Mestre',
      scope: 'Càlcul àgil amb 4 operacions',
      allowedModes: ['sumes', 'restes', 'mult', 'div', 'variat'],
      allowScaffold: false
    }
  };

  // ==========================================================================
  // ESTAT DE L'APLICACIÓ (Application State)
  // ==========================================================================
  const state = {
    activityType: 'quinzet', // 'quinzet' | 'tables'
    level: 1,
    mode: 'sumes',           // 'sumes' | 'restes' | 'mult' | 'div' | 'variat'

    // Configuració específica per al mode 'tables' (Practicar Taules)
    selectedTables: [2],     // Array de taules seleccionades (1..10)
    tablesMode: 'random',    // 'random' | 'ordered' | 'missing'
    tablesOpsCount: 20,      // 10 | 20 | 30 | 60

    timerEnabled: true,
    scaffoldEnabled: false,
    soundEnabled: true,
    theme: 'system',

    totalOps: 60,
    timeLimitSeconds: 180,  // 3 minuts
    timeRemaining: 180,
    timerInterval: null,
    startTime: null,

    operations: [],
    currentIndex: 0,
    userAnswers: [],
    hitsCount: 0,
    isDebouncing: false,
    isPaused: false,
    quizFinished: false
  };

  // ==========================================================================
  // SÍNTESI D'ÀUDIO (Web Audio API - 100% autònom sense arxius externs)
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTapSound() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Ignorar fallades si el navegador bloqueja l'àudio
    }
  }

  function playCelebrationSound() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.14, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.48);
      });
    } catch (e) {
      // Ignorar
    }
  }

  // ==========================================================================
  // GESTIÓ DEL TEMA (Clar / Fosc)
  // ==========================================================================
  function applyTheme(targetTheme) {
    state.theme = targetTheme;
    const root = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    if (targetTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Fosc';
    } else if (targetTheme === 'light') {
      root.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Clar';
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      if (themeIcon) themeIcon.textContent = '🌓';
      if (themeLabel) themeLabel.textContent = 'Auto';
    }
    localStorage.setItem('quinzet_theme_pref', targetTheme);
  }

  function cycleTheme() {
    if (state.theme === 'system') {
      applyTheme('light');
    } else if (state.theme === 'light') {
      applyTheme('dark');
    } else {
      applyTheme('system');
    }
  }

  // ==========================================================================
  // MOTOR MATEMÀTIC MULTINIVELL (Inspirat fidelment en les sèries Quinzet)
  // ==========================================================================

  // 1. GENERACIÓ DE SUMES
  function generateSum(level) {
    let n1, n2;
    if (level === 1) {
      // Nivell 1: sumes fins a 5 (esporàdic 6 com a pàg 4)
      const max = Math.random() < 0.2 ? 6 : 5;
      n1 = Math.floor(Math.random() * max);
      n2 = Math.floor(Math.random() * (max - n1 + 1));
    } else if (level === 2) {
      // Nivell 2: sumands fins a 5, resultat fins a 10
      n1 = Math.floor(Math.random() * 5) + 1;
      n2 = Math.floor(Math.random() * 5) + 1;
    } else if (level === 3) {
      // Nivell 3: sumands 1..9, resultats fins a 18
      n1 = Math.floor(Math.random() * 8) + 2;
      n2 = Math.floor(Math.random() * 8) + 2;
    } else if (level === 4) {
      // Nivell 4: sumes creuant desena (ex: 8+6, 9+7, 7+5)
      n1 = Math.floor(Math.random() * 5) + 5; // 5..9
      n2 = Math.floor(Math.random() * 6) + 4; // 4..9
    } else if (level === 5) {
      // Nivell 5: sumes amb desenes baixes (ex: 6+14, 7+12)
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 8) + 11;
    } else {
      // Nivell 6: sumes de dues xifres (ex: 18+7, 14+9, 13+8)
      n1 = [12, 13, 14, 15, 16, 17, 18, 19][Math.floor(Math.random() * 8)];
      n2 = Math.floor(Math.random() * 8) + 2;
    }

    return {
      num1: n1,
      num2: n2,
      operator: '+',
      solution: n1 + n2
    };
  }

  // 2. GENERACIÓ DE RESTES
  function generateSubtraction(level) {
    let n1, n2;
    if (level === 1) {
      // Nivell 1: Minuend 1..4, substrahend 0..Minuend
      n1 = Math.floor(Math.random() * 4) + 1;
      n2 = Math.floor(Math.random() * (n1 + 1));
    } else if (level === 2) {
      // Nivell 2: Minuend 2..6, substrahend 0..Minuend
      n1 = Math.floor(Math.random() * 5) + 2;
      n2 = Math.floor(Math.random() * (n1 + 1));
    } else if (level === 3) {
      // Nivell 3: Minuend fins a 10 (ex: 10-7, 9-7, 8-3)
      n1 = Math.floor(Math.random() * 6) + 5; // 5..10
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
    } else if (level === 4) {
      // Nivell 4: Restes ràpides creuant o tocant desena (ex: 10-7, 10-8, 9-4)
      n1 = Math.floor(Math.random() * 4) + 7; // 7..10
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
    } else if (level === 5) {
      // Nivell 5: Restes creuant desena (ex: 13-7, 14-6, 17-9)
      n1 = Math.floor(Math.random() * 8) + 11; // 11..18
      n2 = Math.floor(Math.random() * 8) + 2;
    } else {
      // Nivell 6: Restes avançades (ex: 21-6, 22-8, 23-9)
      n1 = Math.floor(Math.random() * 6) + 19; // 19..24
      n2 = Math.floor(Math.random() * 8) + 2;
    }

    return {
      num1: n1,
      num2: n2,
      operator: '-',
      solution: n1 - n2
    };
  }

  // 3. GENERACIÓ DE MULTIPLICACIONS
  function generateMultiplication(level) {
    let n1, n2;
    if (level <= 4) {
      // Taules inicials (2, 3, 4, 5) per nombres 1..9
      const tables = [2, 3, 4, 5];
      n1 = tables[Math.floor(Math.random() * tables.length)];
      n2 = Math.floor(Math.random() * 9) + 1;
    } else if (level === 5) {
      // Taules completes 2..9
      n1 = Math.floor(Math.random() * 8) + 2;
      n2 = Math.floor(Math.random() * 8) + 2;
    } else {
      // Nivell 6: inclou càlculs especials (ex: 15x2, 12x3, 14x2, 11x6, 25x2)
      if (Math.random() < 0.45) {
        n1 = [10, 11, 12, 13, 14, 15, 20, 25][Math.floor(Math.random() * 8)];
        n2 = Math.floor(Math.random() * 4) + 2; // x2, x3, x4, x5
      } else {
        n1 = Math.floor(Math.random() * 8) + 2;
        n2 = Math.floor(Math.random() * 8) + 2;
      }
    }

    // A vegades invertim l'ordre per variabilitat
    if (Math.random() < 0.5 && level <= 5) {
      const tmp = n1; n1 = n2; n2 = tmp;
    }

    return {
      num1: n1,
      num2: n2,
      operator: '×',
      solution: n1 * n2
    };
  }

  // 4. GENERACIÓ DE DIVISIONS EXACTES
  function generateDivision(level) {
    let divisor, quotient;
    if (level === 5) {
      // Divisions exactes de les taules estàndard (ex: 36:6, 72:8, 28:7)
      divisor = Math.floor(Math.random() * 8) + 2; // 2..9
      quotient = Math.floor(Math.random() * 8) + 2; // 2..9
    } else {
      // Nivell 6: Divisions amb divisors/quocients superiors (ex: 66:6, 80:8, 24:2, 50:5)
      if (Math.random() < 0.35) {
        divisor = [2, 3, 4, 5, 6, 8, 10, 11, 12][Math.floor(Math.random() * 9)];
        quotient = Math.floor(Math.random() * 9) + 2;
      } else {
        divisor = Math.floor(Math.random() * 8) + 2;
        quotient = Math.floor(Math.random() * 8) + 2;
      }
    }

    const dividend = divisor * quotient;
    return {
      num1: dividend,
      num2: divisor,
      operator: ':',
      solution: quotient
    };
  }

  // 5. GENERACIÓ DE DISTRACTORS INTEL·LIGENTS
  function generateSmartOptions(op) {
    const sol = op.solution;
    const options = new Set([sol]);

    let candidateOffsets;
    if (op.isMissingFactor) {
      // Quan es busca el factor ocult (1..10), els distractors han de ser factors propers >= 1
      candidateOffsets = [-1, 1, -2, 2, -3, 3];
    } else if (op.operator === '×' || op.operator === ':') {
      // Per a multiplicacions o divisions, afegim múltiples de la mateixa taula i variacions properes
      candidateOffsets = [-op.num1, op.num1, -op.num2, op.num2, -1, 1, -2, 2, 3, -3];
    } else {
      candidateOffsets = [-1, 1, -2, 2, -3, 3];
    }

    candidateOffsets.sort(() => Math.random() - 0.5);

    const minAllowed = op.isMissingFactor ? 1 : 0;
    for (const offset of candidateOffsets) {
      const candidate = sol + offset;
      if (candidate >= minAllowed && !options.has(candidate)) {
        options.add(candidate);
      }
      if (options.size === 3) break;
    }

    // Fallback garantit
    let fallback = minAllowed;
    while (options.size < 3) {
      if (!options.has(fallback)) {
        options.add(fallback);
      }
      fallback++;
    }

    const arr = Array.from(options);
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  // 6. GENERADOR DE LA LLISTA D'OPERACIONS DEL REPTE QUINZET
  function generateOperationsList(level, mode, count = 60) {
    const list = [];

    // Determinar els tipus d'operacions possibles per a 'variat'
    let variatPool = ['sumes', 'restes'];
    if (level === 4) variatPool = ['sumes', 'restes', 'mult'];
    if (level >= 5) variatPool = ['sumes', 'restes', 'mult', 'div'];

    for (let i = 0; i < count; i++) {
      let chosenType = mode;
      if (mode === 'variat') {
        chosenType = variatPool[i % variatPool.length];
      }

      let op;
      if (chosenType === 'sumes') {
        op = generateSum(level);
      } else if (chosenType === 'restes') {
        op = generateSubtraction(level);
      } else if (chosenType === 'mult') {
        op = generateMultiplication(level);
      } else if (chosenType === 'div') {
        op = generateDivision(level);
      } else {
        op = generateSum(level);
      }

      op.options = generateSmartOptions(op);
      op.index = i + 1;
      list.push(op);
    }

    if (mode === 'variat') {
      list.sort(() => Math.random() - 0.5);
      list.forEach((item, idx) => { item.index = idx + 1; });
    }

    return list;
  }

  // 7. GENERADOR D'OPERACIONS PER AL MODE «PRACTICAR TAULES DE MULTIPLICAR»
  function generateTablesOperationsList(selectedTables, tablesMode, count) {
    const sortedTables = [...selectedTables].sort((a, b) => a - b);
    const basePool = [];

    // Construïm el conjunt base de fets numèrics (t × 1 .. t × 10)
    sortedTables.forEach(t => {
      for (let m = 1; m <= 10; m++) {
        basePool.push({ table: t, multiplier: m });
      }
    });

    const rawPairs = [];

    if (tablesMode === 'ordered') {
      // En mode ordenat, recorrem seqüencialment de l'1 al 10 cada taula seleccionada
      for (let i = 0; i < count; i++) {
        rawPairs.push(basePool[i % basePool.length]);
      }
    } else {
      // En mode aleatori o factor ocult, barregem baralles completes per garantir
      // que tots els fets de la taula apareguin de manera equilibrada i sense repeticions consecutives
      while (rawPairs.length < count) {
        const deck = [...basePool].sort(() => Math.random() - 0.5);
        if (rawPairs.length > 0 && deck.length > 1) {
          const prev = rawPairs[rawPairs.length - 1];
          if (deck[0].table === prev.table && deck[0].multiplier === prev.multiplier) {
            const swapIdx = Math.floor(Math.random() * (deck.length - 1)) + 1;
            const tmp = deck[0];
            deck[0] = deck[swapIdx];
            deck[swapIdx] = tmp;
          }
        }
        rawPairs.push(...deck);
      }
      rawPairs.length = count;
    }

    return rawPairs.map((pair, idx) => {
      const product = pair.table * pair.multiplier;
      const isMissing = tablesMode === 'missing';
      const op = {
        num1: pair.table,
        num2: pair.multiplier,
        product: product,
        operator: '×',
        isMissingFactor: isMissing,
        solution: isMissing ? pair.multiplier : product,
        index: idx + 1
      };
      op.options = generateSmartOptions(op);
      return op;
    });
  }

  // ==========================================================================
  // RENDERITZAT DE LA BASTIDA VISUAL (PUNTS LINEALS I MATRIU MULTIPLICATIVA)
  // ==========================================================================
  function renderScaffold(containerEl, num) {
    containerEl.innerHTML = '';

    // En el mode Taules utilitzem la bastida matricial inferior, no la lineal
    if (state.activityType === 'tables') {
      containerEl.style.display = 'none';
      return;
    }

    const currentCfg = LEVELS_CONFIG[state.level];

    // Si la bastida no està habilitada o el nivell no l'admet, l'ocultem
    if (!state.scaffoldEnabled || !currentCfg.allowScaffold) {
      containerEl.style.display = 'none';
      return;
    }

    // Quan la bastida està activa, SEMPRE mantenim el contenidor visible per garantir una alineació vertical perfecta
    containerEl.style.display = 'flex';

    if (num === 0) {
      // Per al 0: cercle buit discontinu (simbolitza la safata buida / quantitat zero)
      const emptyDot = document.createElement('span');
      emptyDot.className = 'scaffold-dot empty';
      emptyDot.title = 'Zero (sense quantitat)';
      emptyDot.setAttribute('aria-label', 'Zero punts');
      containerEl.appendChild(emptyDot);
    } else {
      // Per a nombres > 0 (fins a 10)
      const count = Math.min(num, 10);
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'scaffold-dot';
        containerEl.appendChild(dot);
      }
    }
  }

  function renderMatrixScaffold(op) {
    const matrixContainer = document.getElementById('matrix-scaffold-container');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = '';

    if (state.activityType !== 'tables' || !state.scaffoldEnabled) {
      matrixContainer.classList.add('hidden');
      return;
    }

    matrixContainer.classList.remove('hidden');

    const caption = document.createElement('div');
    caption.className = 'matrix-caption';

    // Si és factor ocult (ex: 4 × ? = 12), mostrem files de 4 punts perquè pugui comptar quants grups hi ha
    const rowsCount = op.isMissingFactor ? op.num2 : op.num1;
    const colsCount = op.isMissingFactor ? op.num1 : op.num2;

    if (op.isMissingFactor) {
      caption.textContent = `Agrupem ${op.product} punts en files de ${op.num1}:`;
    } else {
      caption.textContent = `${op.num1} ${op.num1 === 1 ? 'grup' : 'grups'} de ${op.num2} ${op.num2 === 1 ? 'punt' : 'punts'} (${op.num1} × ${op.num2})`;
    }
    matrixContainer.appendChild(caption);

    const grid = document.createElement('div');
    grid.className = 'matrix-grid';

    for (let r = 1; r <= rowsCount; r++) {
      const row = document.createElement('div');
      row.className = 'matrix-row';

      const rowIndex = document.createElement('span');
      rowIndex.className = 'matrix-row-index';
      rowIndex.textContent = `${r}.`;
      row.appendChild(rowIndex);

      for (let c = 0; c < colsCount; c++) {
        const dot = document.createElement('span');
        dot.className = 'matrix-dot';
        row.appendChild(dot);
      }

      grid.appendChild(row);
    }

    matrixContainer.appendChild(grid);
  }

  // ==========================================================================
  // GESTIÓ DE PANTALLES I INTERFÍCIE DE CONFIGURACIÓ
  // ==========================================================================
  const screens = {
    setup: document.getElementById('setup-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen')
  };

  function switchScreen(targetScreenName) {
    Object.keys(screens).forEach(key => {
      if (key === targetScreenName) {
        screens[key].classList.add('active');
      } else {
        screens[key].classList.remove('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatSelectedTablesLabel(tables, short = false) {
    const sorted = [...tables].sort((a, b) => a - b);
    if (sorted.length === 10) {
      return short ? 'Taules 1..10' : 'Taules de l\'1 al 10';
    }
    if (sorted.length === 1) {
      const t = sorted[0];
      return t === 1 || t === 11 ? `Taula de l'${t}` : `Taula del ${t}`;
    }
    if (short && sorted.length > 4) {
      return `${sorted.length} taules`;
    }
    return `Taules: ${sorted.join(', ')}`;
  }

  function updateStartButtonLabel() {
    const startLabelEl = document.getElementById('start-btn-label');
    if (!startLabelEl) return;

    if (state.activityType === 'tables') {
      startLabelEl.textContent = `Practicar Taules (${state.tablesOpsCount} operacions)`;
    } else {
      startLabelEl.textContent = 'Començar el Repte (60 operacions)';
    }
  }

  function updateTablesSelectionUI() {
    const sorted = [...state.selectedTables].sort((a, b) => a - b);
    state.selectedTables = sorted;

    // Actualitzar botons de l'1 al 10
    document.querySelectorAll('.table-num-btn').forEach(btn => {
      const t = parseInt(btn.dataset.table, 10);
      const isSelected = sorted.includes(t);
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });

    // Actualitzar píndoles de famílies predefinides
    const currentKey = sorted.join(',');
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.tables === currentKey);
    });

    // Actualitzar resum informatiu
    const summaryEl = document.getElementById('selected-tables-summary');
    if (summaryEl) {
      summaryEl.textContent = sorted.length === 1
        ? `${formatSelectedTablesLabel(sorted)} seleccionada`
        : `${sorted.length} taules seleccionades (${sorted.join(', ')})`;
    }
  }

  function updateActivityModeUI(activityType) {
    state.activityType = activityType;

    // 1. Pestanyes superiors
    document.querySelectorAll('.activity-tab-btn').forEach(tab => {
      const isActive = tab.dataset.activity === activityType;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // 2. Panells de configuració
    const quinzetPanel = document.getElementById('quinzet-setup-panel');
    const tablesPanel = document.getElementById('tables-setup-panel');
    if (quinzetPanel) quinzetPanel.classList.toggle('hidden', activityType !== 'quinzet');
    if (tablesPanel) tablesPanel.classList.toggle('hidden', activityType !== 'tables');

    // 3. Adaptar etiqueta i disponibilitat de la Bastida Visual NESE
    const neseGroupLabel = document.getElementById('nese-group-label');
    const scaffoldCard = document.getElementById('scaffold-toggle').closest('.switch-card');
    const scaffoldIcon = document.getElementById('scaffold-icon');
    const scaffoldTitle = document.getElementById('scaffold-title');
    const scaffoldDesc = document.getElementById('scaffold-desc');

    if (activityType === 'tables') {
      if (neseGroupLabel) neseGroupLabel.textContent = '4. Adaptacions de suport (NESE):';
      if (scaffoldIcon) scaffoldIcon.textContent = '🟦';
      if (scaffoldTitle) scaffoldTitle.textContent = 'Bastida visual (Matriu de grups)';
      if (scaffoldDesc) scaffoldDesc.textContent = 'Mostra files i columnes de punts per visualitzar el producte';
      if (scaffoldCard) {
        scaffoldCard.style.opacity = '1';
        scaffoldCard.style.pointerEvents = 'auto';
      }
    } else {
      if (neseGroupLabel) neseGroupLabel.textContent = '3. Adaptacions de suport (NESE):';
      if (scaffoldIcon) scaffoldIcon.textContent = '🔴';
      if (scaffoldTitle) scaffoldTitle.textContent = 'Bastida visual (Punts)';
      if (scaffoldDesc) scaffoldDesc.textContent = 'Mostra punts de subitització sota les xifres';
      updateOperationModesForLevel(state.level);
    }

    updateStartButtonLabel();
  }

  // Actualitza la visibilitat dels botons de modalitat segons el nivell seleccionat
  function updateOperationModesForLevel(level) {
    const cfg = LEVELS_CONFIG[level];
    const modeBtns = document.querySelectorAll('#operation-modes-container .mode-btn');

    let isCurrentModeValid = false;

    modeBtns.forEach(btn => {
      const modeName = btn.dataset.mode;
      if (cfg.allowedModes.includes(modeName)) {
        btn.style.display = 'flex';
        if (modeName === state.mode) {
          isCurrentModeValid = true;
        }
      } else {
        btn.style.display = 'none';
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    // Si el mode seleccionat anteriorment ja no és vàlid (ex: divisions al nivell 1), revertim a sumes
    if (!isCurrentModeValid) {
      state.mode = 'sumes';
      const defaultBtn = document.querySelector('#operation-modes-container .mode-btn[data-mode="sumes"]');
      if (defaultBtn) {
        defaultBtn.classList.add('active');
        defaultBtn.setAttribute('aria-checked', 'true');
      }
    }

    // Gestionar la disponibilitat del switch de bastida visual en mode Quinzet
    if (state.activityType === 'quinzet') {
      const scaffoldCard = document.getElementById('scaffold-toggle').closest('.switch-card');
      if (scaffoldCard) {
        if (cfg.allowScaffold) {
          scaffoldCard.style.opacity = '1';
          scaffoldCard.style.pointerEvents = 'auto';
        } else {
          scaffoldCard.style.opacity = '0.5';
          scaffoldCard.style.pointerEvents = 'none';
          document.getElementById('scaffold-toggle').checked = false;
        }
      }
    }
  }

  function startQuiz() {
    initAudio();

    state.timerEnabled = document.getElementById('timer-toggle').checked;
    state.scaffoldEnabled = document.getElementById('scaffold-toggle').checked;

    // Inicialitzar partida
    state.currentIndex = 0;
    state.userAnswers = [];
    state.hitsCount = 0;
    state.quizFinished = false;
    state.isDebouncing = false;

    if (state.activityType === 'tables') {
      state.totalOps = state.tablesOpsCount;
      state.operations = generateTablesOperationsList(
        state.selectedTables,
        state.tablesMode,
        state.totalOps
      );
      document.getElementById('current-level-display').textContent = formatSelectedTablesLabel(state.selectedTables, true);
    } else {
      const activeLevelBtn = document.querySelector('.level-card-btn.active');
      state.level = activeLevelBtn ? parseInt(activeLevelBtn.dataset.level, 10) : 1;

      const activeModeBtn = document.querySelector('#operation-modes-container .mode-btn.active');
      state.mode = activeModeBtn ? activeModeBtn.dataset.mode : 'sumes';

      state.totalOps = 60;
      state.operations = generateOperationsList(state.level, state.mode, state.totalOps);

      const levelCfg = LEVELS_CONFIG[state.level];
      document.getElementById('current-level-display').textContent = levelCfg.title;
    }

    const totalOpCountEl = document.getElementById('total-op-count');
    if (totalOpCountEl) totalOpCountEl.textContent = `/ ${state.totalOps}`;

    state.startTime = Date.now();

    // Configurar cronòmetre i botó de pausa
    const timerContainer = document.getElementById('timer-display-container');
    const pauseBtn = document.getElementById('pause-btn');
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) pauseOverlay.classList.add('hidden');

    state.isPaused = false;
    if (state.timerEnabled) {
      timerContainer.style.display = 'inline-flex';
      timerContainer.classList.remove('urgent');
      if (pauseBtn) {
        pauseBtn.style.display = 'inline-flex';
        const pauseIcon = document.getElementById('pause-icon');
        const pauseLabel = document.getElementById('pause-label');
        if (pauseIcon) pauseIcon.textContent = '⏸️';
        if (pauseLabel) pauseLabel.textContent = 'Pausa';
      }
      state.timeRemaining = state.timeLimitSeconds;
      updateTimerDisplay();
      startTimer();
    } else {
      timerContainer.style.display = 'none';
      if (pauseBtn) pauseBtn.style.display = 'none';
      if (state.timerInterval) clearInterval(state.timerInterval);
    }

    displayCurrentOperation();
    switchScreen('quiz');
  }

  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
      state.timeRemaining--;
      updateTimerDisplay();

      const timerContainer = document.getElementById('timer-display-container');
      if (state.timeRemaining <= 20 && !timerContainer.classList.contains('urgent')) {
        timerContainer.classList.add('urgent');
      }

      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        finishQuiz('Temps esgotat');
      }
    }, 1000);
  }

  function togglePause() {
    if (state.quizFinished || !state.timerEnabled) return;
    state.isPaused = !state.isPaused;

    const pauseOverlay = document.getElementById('pause-overlay');
    const pauseIcon = document.getElementById('pause-icon');
    const pauseLabel = document.getElementById('pause-label');

    if (state.isPaused) {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
      if (pauseOverlay) pauseOverlay.classList.remove('hidden');
      if (pauseIcon) pauseIcon.textContent = '▶️';
      if (pauseLabel) pauseLabel.textContent = 'Reprendre';
      playTapSound();
    } else {
      if (pauseOverlay) pauseOverlay.classList.add('hidden');
      if (pauseIcon) pauseIcon.textContent = '⏸️';
      if (pauseLabel) pauseLabel.textContent = 'Pausa';
      startTimer();
      playTapSound();
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timeRemaining / 60);
    const secs = state.timeRemaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const timerEl = document.getElementById('timer-text');
    if (timerEl) timerEl.textContent = formatted;
  }

  function displayCurrentOperation() {
    if (state.currentIndex >= state.operations.length) {
      finishQuiz('Totes les operacions completades');
      return;
    }

    const op = state.operations[state.currentIndex];

    // Progrés
    document.getElementById('current-op-index').textContent = op.index;
    const progressPercent = ((state.currentIndex) / state.totalOps) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    // Operands, símbol i caixa d'incògnita (suport per a Factor Ocult: a × ? = c)
    const num1El = document.getElementById('num1');
    const operatorEl = document.getElementById('operator');
    const num2El = document.getElementById('num2');
    const resultBoxEl = document.getElementById('result-box');

    num1El.textContent = op.num1;
    operatorEl.textContent = op.operator;

    if (op.isMissingFactor) {
      num2El.textContent = '?';
      num2El.className = 'mystery-box';
      if (resultBoxEl) {
        resultBoxEl.textContent = op.product;
        resultBoxEl.className = 'math-num';
      }
    } else {
      num2El.textContent = op.num2;
      num2El.className = 'math-num';
      if (resultBoxEl) {
        resultBoxEl.textContent = '?';
        resultBoxEl.className = 'mystery-box';
      }
    }

    // Bastida visual lineal (mode Quinzet Nivells 1-3) i matricial (mode Taules)
    renderScaffold(document.getElementById('num1-scaffold'), op.num1);
    renderScaffold(document.getElementById('num2-scaffold'), op.num2);
    renderMatrixScaffold(op);

    // Opcions de resposta
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, idx) => {
      const numSpan = btn.querySelector('.option-num');
      const val = op.options[idx];
      numSpan.textContent = val;
      btn.dataset.value = val;
      btn.classList.remove('pressed');
      btn.setAttribute('aria-label', `Resposta ${val}`);
    });
  }

  function handleAnswerSelected(btnElement) {
    if (state.isDebouncing || state.quizFinished || state.isPaused) return;
    state.isDebouncing = true;

    const selectedValue = parseInt(btnElement.dataset.value, 10);
    const op = state.operations[state.currentIndex];
    const isCorrect = selectedValue === op.solution;

    if (isCorrect) {
      state.hitsCount++;
    }

    btnElement.classList.add('pressed');
    playTapSound();

    state.userAnswers.push({
      index: op.index,
      num1: op.num1,
      num2: op.num2,
      product: op.product,
      isMissingFactor: Boolean(op.isMissingFactor),
      operator: op.operator,
      solution: op.solution,
      userAnswer: selectedValue,
      isCorrect: isCorrect
    });

    setTimeout(() => {
      btnElement.classList.remove('pressed');
      state.currentIndex++;
      state.isDebouncing = false;
      displayCurrentOperation();
    }, 180);
  }

  function finishQuiz(reason = '') {
    if (state.quizFinished) return;
    state.quizFinished = true;

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    playCelebrationSound();

    const timeSpentSeconds = state.timerEnabled
      ? (state.timeLimitSeconds - Math.max(0, state.timeRemaining))
      : Math.floor((Date.now() - state.startTime) / 1000);

    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Actualitzar panell de resultats
    const resultsBadgeEl = document.getElementById('results-level-badge');
    if (state.activityType === 'tables') {
      const modeNames = {
        random: 'Aleatori',
        ordered: 'Ordenat (1 a 10)',
        missing: 'Factor ocult'
      };
      resultsBadgeEl.textContent = `${formatSelectedTablesLabel(state.selectedTables, false)} · ${modeNames[state.tablesMode] || 'Aleatori'}`;
    } else {
      const levelCfg = LEVELS_CONFIG[state.level];
      resultsBadgeEl.textContent = `${levelCfg.title} · ${levelCfg.name}`;
    }

    document.getElementById('total-hits').textContent = `${state.hitsCount}`;
    document.getElementById('total-attempted').textContent = `${state.userAnswers.length} / ${state.totalOps}`;
    document.getElementById('total-time-spent').textContent = timeStr;

    // Missatge motivador proporcional al total d'operacions de la sessió
    const motivationalEl = document.getElementById('motivational-message');
    const hitRatio = state.totalOps > 0 ? (state.hitsCount / state.totalOps) : 0;

    if (hitRatio >= 0.83) {
      motivationalEl.textContent = '🌟 Resultat excel·lent! Una gran rapidesa i concentració!';
    } else if (hitRatio >= 0.50) {
      motivationalEl.textContent = '🎉 Molt bona feina! Has superat un gran nombre d\'operacions!';
    } else if (hitRatio >= 0.25) {
      motivationalEl.textContent = '👏 Molt bon esforç! Cada dia l\'automatització és més àgil!';
    } else {
      motivationalEl.textContent = '💪 Bon treball! La pràctica constant ens ajuda a avançar!';
    }

    renderDetailedReview();
    switchScreen('results');
  }

  function renderDetailedReview() {
    const listContainer = document.getElementById('operations-review-list');
    listContainer.innerHTML = '';

    const detailsContent = document.getElementById('details-content');
    const toggleBtn = document.getElementById('toggle-details-btn');
    const indicator = document.getElementById('accordion-indicator');
    const icon = document.getElementById('accordion-icon');

    detailsContent.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
    indicator.textContent = 'Mostra el detall';
    icon.textContent = '👁️';

    state.userAnswers.forEach(ans => {
      const item = document.createElement('div');
      item.className = `review-item ${ans.isCorrect ? 'is-correct' : 'is-wrong'}`;

      const eqText = ans.isMissingFactor
        ? `${ans.num1} × [${ans.solution}] = ${ans.product}`
        : `${ans.num1} ${ans.operator} ${ans.num2} = ${ans.solution}`;

      item.innerHTML = `
        <div class="review-header">
          <span>Op. ${ans.index}</span>
          <span>${ans.isCorrect ? '✅ Encert' : '❌ Errada'}</span>
        </div>
        <div class="review-eq">${eqText}</div>
        <div class="review-user-ans ${ans.isCorrect ? 'correct-text' : 'wrong-text'}">
          La teva resposta: <strong>${ans.userAnswer}</strong>
        </div>
        ${!ans.isCorrect ? `<div class="review-sol">Solució correcta: ${ans.solution}</div>` : ''}
      `;

      listContainer.appendChild(item);
    });

    if (state.userAnswers.length === 0) {
      listContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-muted);">No s\'ha contestat cap operació.</p>';
    }
  }

  // ==========================================================================
  // BINDING D'ESDEVENIMENTS
  // ==========================================================================
  function bindEvents() {
    // 0. Selector superior de Modalitat d'Activitat (Repte Quinzet vs Practicar Taules)
    document.querySelectorAll('.activity-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        const chosenActivity = tab.dataset.activity;
        updateActivityModeUI(chosenActivity);
        playTapSound();
      });
    });

    // 1. Selector de Nivells (Nivell 1 a Nivell 6)
    document.querySelectorAll('.level-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.level-card-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');

        const chosenLevel = parseInt(btn.dataset.level, 10);
        state.level = chosenLevel;
        updateOperationModesForLevel(chosenLevel);
        playTapSound();
      });
    });

    // 2. Selector de tipus d'operació (Mode Quinzet)
    document.querySelectorAll('#operation-modes-container .mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#operation-modes-container .mode-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.mode = btn.dataset.mode;
        playTapSound();
      });
    });

    // 2b. Configurador del Mode «Practicar Taules»
    // Botons individuals de taula (1..10, selecció múltiple amb mínim 1 activa)
    document.querySelectorAll('.table-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tableNum = parseInt(btn.dataset.table, 10);
        const exists = state.selectedTables.includes(tableNum);

        if (exists) {
          // Garantim que sempre quedi com a mínim 1 taula seleccionada
          if (state.selectedTables.length > 1) {
            state.selectedTables = state.selectedTables.filter(t => t !== tableNum);
          }
        } else {
          state.selectedTables.push(tableNum);
        }

        updateTablesSelectionUI();
        playTapSound();
      });
    });

    // Dreceres per famílies de taules
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tablesArr = chip.dataset.tables
          .split(',')
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n));
        if (tablesArr.length > 0) {
          state.selectedTables = tablesArr;
          updateTablesSelectionUI();
          playTapSound();
        }
      });
    });

    // Modalitat de pràctica de taules (Aleatori | Ordenat | Factor ocult)
    document.querySelectorAll('.tables-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tables-mode-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.tablesMode = btn.dataset.tmode;
        playTapSound();
      });
    });

    // Quantitat d'operacions en el mode Taules (10, 20, 30, 60)
    document.querySelectorAll('.ops-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ops-count-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.tablesOpsCount = parseInt(btn.dataset.count, 10) || 20;
        updateStartButtonLabel();
        playTapSound();
      });
    });

    // 3. Botó d'inici
    document.getElementById('start-quiz-btn').addEventListener('click', () => {
      startQuiz();
    });

    // 4. Opcions de resposta
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        handleAnswerSelected(e.currentTarget);
      });
    });

    // 5. Dreceres de teclat (1, 2, 3 per respondre, Espai o P per pausar)
    window.addEventListener('keydown', (e) => {
      if (!screens.quiz.classList.contains('active')) return;

      // Tecles de pausa/represa (Espai o lletra P)
      if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
        if (state.timerEnabled) {
          togglePause();
          e.preventDefault();
        }
        return;
      }

      // Si està en pausa, bloquegem la selecció de respostes
      if (state.isPaused) return;

      const optionBtns = document.querySelectorAll('.option-btn');
      if (e.key === '1' && optionBtns[0]) {
        handleAnswerSelected(optionBtns[0]);
      } else if (e.key === '2' && optionBtns[1]) {
        handleAnswerSelected(optionBtns[1]);
      } else if (e.key === '3' && optionBtns[2]) {
        handleAnswerSelected(optionBtns[2]);
      }
    });

    // 6. Botons de Pausa i Represa
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) resumeBtn.addEventListener('click', togglePause);

    // 7. Botó d'aturar abans d'hora
    document.getElementById('end-early-btn').addEventListener('click', () => {
      if (confirm('Vols finalitzar la sessió de càlcul ara i consultar el teu resultat?')) {
        finishQuiz('Finalitzat manualment');
      }
    });

    // 7. Botó de tornar a jugar
    document.getElementById('play-again-btn').addEventListener('click', () => {
      playTapSound();
      switchScreen('setup');
    });

    // 8. Botó d'imprimir informe
    document.getElementById('print-results-btn').addEventListener('click', () => {
      const detailsContent = document.getElementById('details-content');
      detailsContent.classList.remove('hidden');
      window.print();
    });

    // 9. Botó Acordió Detalls
    const toggleBtn = document.getElementById('toggle-details-btn');
    const detailsContent = document.getElementById('details-content');
    const indicator = document.getElementById('accordion-indicator');
    const icon = document.getElementById('accordion-icon');

    toggleBtn.addEventListener('click', () => {
      const isHidden = detailsContent.classList.toggle('hidden');
      const isExpanded = !isHidden;
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
      indicator.textContent = isExpanded ? 'Amaga el detall' : 'Mostra el detall';
      icon.textContent = isExpanded ? '🙈' : '👁️';
      playTapSound();
    });

    // 10. Control de so
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      const iconSpan = soundBtn.querySelector('.btn-icon');
      const labelSpan = soundBtn.querySelector('.btn-label');
      if (state.soundEnabled) {
        iconSpan.textContent = '🔊';
        labelSpan.textContent = 'So';
        playTapSound();
      } else {
        iconSpan.textContent = '🔇';
        labelSpan.textContent = 'Mut';
      }
    });

    // 11. Selector de tema
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn.addEventListener('click', () => {
      cycleTheme();
      playTapSound();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') {
        applyTheme('system');
      }
    });

    // 12. Gestió de la finestra modal de Guia Docent
    const guideModal = document.getElementById('teacher-guide-modal');
    const openGuideHeaderBtn = document.getElementById('teacher-guide-btn');
    const openGuideLinkBtn = document.getElementById('open-guide-link-btn');
    const closeGuideBtn = document.getElementById('close-guide-btn');
    const closeGuideFooterBtn = document.getElementById('close-guide-footer-btn');

    function openGuide() {
      if (guideModal && typeof guideModal.showModal === 'function') {
        guideModal.showModal();
        playTapSound();
      }
    }

    function closeGuide() {
      if (guideModal && typeof guideModal.close === 'function') {
        guideModal.close();
        playTapSound();
      }
    }

    if (openGuideHeaderBtn) openGuideHeaderBtn.addEventListener('click', openGuide);
    if (openGuideLinkBtn) openGuideLinkBtn.addEventListener('click', openGuide);
    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeGuide);
    if (closeGuideFooterBtn) closeGuideFooterBtn.addEventListener('click', closeGuide);

    // Tancar en prémer sobre el fons fosc (backdrop)
    if (guideModal) {
      guideModal.addEventListener('click', (e) => {
        const rect = guideModal.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          closeGuide();
        }
      });
    }
  }

  // Inicialització en carregar la pàgina
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('quinzet_theme_pref') || 'system';
    applyTheme(savedTheme);
    bindEvents();
    // Inicialitzar visibilitat de modes i configurador de taules
    updateTablesSelectionUI();
    updateOperationModesForLevel(1);
    updateActivityModeUI('quinzet');
  });

})();
