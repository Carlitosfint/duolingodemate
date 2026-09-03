import { ProblemData } from '../types';

export const metodosBank: Omit<ProblemData, "isGolden">[] = [
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 6, al resultado lo divido entre 3 y finalmente le resto 15, obtengo 84. ¿Cuál es el número que pensé?",
    "expectedAnswer": "97",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 84.\n2. Sumamos 15 -> 99\n3. Multiplicamos por 3 -> 297\n4. Restamos 6 -> 291\n5. Dividimos entre 3 -> 97.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 6
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 15
        }
      ],
      "result": 84
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 67 elementos y 194 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "30",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (67)\n   - Derecha: Total acumulado (194)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (67 × 4 - 194) / (4 - 2)\n   = (268 - 194) / 2\n   = 37 motos.\n3. Como nos piden autos:\n   Restamos del total: 67 - 37 = 30 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 67,
      "right": 194,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 10, al resultado lo divido entre 2 y finalmente le resto 99, obtengo 41. ¿Cuál es el número que pensé?",
    "expectedAnswer": "90",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 41.\n2. Sumamos 99 -> 140\n3. Multiplicamos por 2 -> 280\n4. Restamos 10 -> 270\n5. Dividimos entre 3 -> 90.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 10
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 99
        }
      ],
      "result": 41
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 46 elementos y 134 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "21",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (46)\n   - Derecha: Total acumulado (134)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (46 × 4 - 134) / (4 - 2)\n   = (184 - 134) / 2\n   = 25 motos.\n3. Como nos piden autos:\n   Restamos del total: 46 - 25 = 21 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 46,
      "right": 134,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 10, al resultado lo divido entre 5 y finalmente le resto 31, obtengo 9. ¿Cuál es el número que pensé?",
    "expectedAnswer": "38",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 9.\n2. Sumamos 31 -> 40\n3. Multiplicamos por 5 -> 200\n4. Restamos 10 -> 190\n5. Dividimos entre 5 -> 38.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 10
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 31
        }
      ],
      "result": 9
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 27 elementos y 78 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "12",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (27)\n   - Derecha: Total acumulado (78)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (27 × 4 - 78) / (4 - 2)\n   = (108 - 78) / 2\n   = 15 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 27 - 15 = 12 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 27,
      "right": 78,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 35, al resultado lo divido entre 4 y finalmente le resto 18, obtengo 59. ¿Cuál es el número que pensé?",
    "expectedAnswer": "91",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 59.\n2. Sumamos 18 -> 77\n3. Multiplicamos por 4 -> 308\n4. Restamos 35 -> 273\n5. Dividimos entre 3 -> 91.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 35
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 18
        }
      ],
      "result": 59
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 63 elementos y 195 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "23",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (63)\n   - Derecha: Total acumulado (195)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (63 × 5 - 195) / (5 - 2)\n   = (315 - 195) / 3\n   = 40 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 63 - 40 = 23 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 63,
      "right": 195,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 14, al resultado lo divido entre 4 y finalmente le resto 33, obtengo 5. ¿Cuál es el número que pensé?",
    "expectedAnswer": "69",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 5.\n2. Sumamos 33 -> 38\n3. Multiplicamos por 4 -> 152\n4. Restamos 14 -> 138\n5. Dividimos entre 2 -> 69.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 14
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 33
        }
      ],
      "result": 5
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 51 elementos y 141 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (51)\n   - Derecha: Total acumulado (141)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (51 × 5 - 141) / (5 - 2)\n   = (255 - 141) / 3\n   = 38 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 51 - 38 = 13 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 51,
      "right": 141,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 25, al resultado lo divido entre 3 y finalmente le resto 22, obtengo 85. ¿Cuál es el número que pensé?",
    "expectedAnswer": "74",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 85.\n2. Sumamos 22 -> 107\n3. Multiplicamos por 3 -> 321\n4. Restamos 25 -> 296\n5. Dividimos entre 4 -> 74.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 25
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 22
        }
      ],
      "result": 85
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 47 elementos y 122 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "14",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (47)\n   - Derecha: Total acumulado (122)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (47 × 4 - 122) / (4 - 2)\n   = (188 - 122) / 2\n   = 33 motos.\n3. Como nos piden autos:\n   Restamos del total: 47 - 33 = 14 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 47,
      "right": 122,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 39, al resultado lo divido entre 5 y finalmente le resto 13, obtengo 62. ¿Cuál es el número que pensé?",
    "expectedAnswer": "84",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 62.\n2. Sumamos 13 -> 75\n3. Multiplicamos por 5 -> 375\n4. Restamos 39 -> 336\n5. Dividimos entre 4 -> 84.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 39
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 13
        }
      ],
      "result": 62
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 43 elementos y 131 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "15",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (43)\n   - Derecha: Total acumulado (131)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (43 × 5 - 131) / (5 - 2)\n   = (215 - 131) / 3\n   = 28 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 43 - 28 = 15 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 43,
      "right": 131,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 19, al resultado lo divido entre 3 y finalmente le resto 24, obtengo 9. ¿Cuál es el número que pensé?",
    "expectedAnswer": "20",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 9.\n2. Sumamos 24 -> 33\n3. Multiplicamos por 3 -> 99\n4. Restamos 19 -> 80\n5. Dividimos entre 4 -> 20.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 19
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 24
        }
      ],
      "result": 9
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 34 elementos y 92 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "12",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (34)\n   - Derecha: Total acumulado (92)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (34 × 4 - 92) / (4 - 2)\n   = (136 - 92) / 2\n   = 22 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 34 - 22 = 12 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 34,
      "right": 92,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 6, al resultado lo divido entre 3 y finalmente le resto 12, obtengo 59. ¿Cuál es el número que pensé?",
    "expectedAnswer": "69",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 59.\n2. Sumamos 12 -> 71\n3. Multiplicamos por 3 -> 213\n4. Restamos 6 -> 207\n5. Dividimos entre 3 -> 69.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 6
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 12
        }
      ],
      "result": 59
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 37 elementos y 107 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "11",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (37)\n   - Derecha: Total acumulado (107)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (37 × 5 - 107) / (5 - 2)\n   = (185 - 107) / 3\n   = 26 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 37 - 26 = 11 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 37,
      "right": 107,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 22, al resultado lo divido entre 5 y finalmente le resto 6, obtengo 47. ¿Cuál es el número que pensé?",
    "expectedAnswer": "81",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 47.\n2. Sumamos 6 -> 53\n3. Multiplicamos por 5 -> 265\n4. Restamos 22 -> 243\n5. Dividimos entre 3 -> 81.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 22
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 6
        }
      ],
      "result": 47
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 32 elementos y 84 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "10",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (32)\n   - Derecha: Total acumulado (84)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (32 × 4 - 84) / (4 - 2)\n   = (128 - 84) / 2\n   = 22 motos.\n3. Como nos piden autos:\n   Restamos del total: 32 - 22 = 10 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 32,
      "right": 84,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 30, al resultado lo divido entre 5 y finalmente le resto 85, obtengo 12. ¿Cuál es el número que pensé?",
    "expectedAnswer": "91",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 12.\n2. Sumamos 85 -> 97\n3. Multiplicamos por 5 -> 485\n4. Restamos 30 -> 455\n5. Dividimos entre 5 -> 91.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 30
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 85
        }
      ],
      "result": 12
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 40 elementos y 106 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (40)\n   - Derecha: Total acumulado (106)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (40 × 4 - 106) / (4 - 2)\n   = (160 - 106) / 2\n   = 27 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 40 - 27 = 13 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 40,
      "right": 106,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 9, al resultado lo divido entre 3 y finalmente le resto 6, obtengo 22. ¿Cuál es el número que pensé?",
    "expectedAnswer": "25",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 22.\n2. Sumamos 6 -> 28\n3. Multiplicamos por 3 -> 84\n4. Restamos 9 -> 75\n5. Dividimos entre 3 -> 25.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 9
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 6
        }
      ],
      "result": 22
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 57 elementos y 152 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "19",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (57)\n   - Derecha: Total acumulado (152)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (57 × 4 - 152) / (4 - 2)\n   = (228 - 152) / 2\n   = 38 motos.\n3. Como nos piden autos:\n   Restamos del total: 57 - 38 = 19 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 57,
      "right": 152,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 18, al resultado lo divido entre 3 y finalmente le resto 55, obtengo 23. ¿Cuál es el número que pensé?",
    "expectedAnswer": "54",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 23.\n2. Sumamos 55 -> 78\n3. Multiplicamos por 3 -> 234\n4. Restamos 18 -> 216\n5. Dividimos entre 4 -> 54.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 18
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 55
        }
      ],
      "result": 23
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 55 elementos y 185 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "25",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (55)\n   - Derecha: Total acumulado (185)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (55 × 5 - 185) / (5 - 2)\n   = (275 - 185) / 3\n   = 30 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 55 - 30 = 25 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 55,
      "right": 185,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 24, al resultado lo divido entre 5 y finalmente le resto 1, obtengo 17. ¿Cuál es el número que pensé?",
    "expectedAnswer": "33",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 17.\n2. Sumamos 1 -> 18\n3. Multiplicamos por 5 -> 90\n4. Restamos 24 -> 66\n5. Dividimos entre 2 -> 33.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 24
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 1
        }
      ],
      "result": 17
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 54 elementos y 177 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "23",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (54)\n   - Derecha: Total acumulado (177)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (54 × 5 - 177) / (5 - 2)\n   = (270 - 177) / 3\n   = 31 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 54 - 31 = 23 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 54,
      "right": 177,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 9, al resultado lo divido entre 4 y finalmente le resto 67, obtengo 44. ¿Cuál es el número que pensé?",
    "expectedAnswer": "87",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 44.\n2. Sumamos 67 -> 111\n3. Multiplicamos por 4 -> 444\n4. Restamos 9 -> 435\n5. Dividimos entre 5 -> 87.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 9
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 67
        }
      ],
      "result": 44
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 55 elementos y 164 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "27",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (55)\n   - Derecha: Total acumulado (164)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (55 × 4 - 164) / (4 - 2)\n   = (220 - 164) / 2\n   = 28 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 55 - 28 = 27 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 55,
      "right": 164,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 12, al resultado lo divido entre 2 y finalmente le resto 15, obtengo 29. ¿Cuál es el número que pensé?",
    "expectedAnswer": "38",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 29.\n2. Sumamos 15 -> 44\n3. Multiplicamos por 2 -> 88\n4. Restamos 12 -> 76\n5. Dividimos entre 2 -> 38.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 12
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 15
        }
      ],
      "result": 29
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 49 elementos y 118 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "10",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (49)\n   - Derecha: Total acumulado (118)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (49 × 4 - 118) / (4 - 2)\n   = (196 - 118) / 2\n   = 39 motos.\n3. Como nos piden autos:\n   Restamos del total: 49 - 39 = 10 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 49,
      "right": 118,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 3, al resultado lo divido entre 3 y finalmente le resto 78, obtengo 7. ¿Cuál es el número que pensé?",
    "expectedAnswer": "63",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 7.\n2. Sumamos 78 -> 85\n3. Multiplicamos por 3 -> 255\n4. Restamos 3 -> 252\n5. Dividimos entre 4 -> 63.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 3
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 78
        }
      ],
      "result": 7
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 62 elementos y 193 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "23",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (62)\n   - Derecha: Total acumulado (193)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (62 × 5 - 193) / (5 - 2)\n   = (310 - 193) / 3\n   = 39 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 62 - 39 = 23 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 62,
      "right": 193,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 12, al resultado lo divido entre 2 y finalmente le resto 8, obtengo 40. ¿Cuál es el número que pensé?",
    "expectedAnswer": "28",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 40.\n2. Sumamos 8 -> 48\n3. Multiplicamos por 2 -> 96\n4. Restamos 12 -> 84\n5. Dividimos entre 3 -> 28.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 12
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 8
        }
      ],
      "result": 40
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 54 elementos y 186 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "26",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (54)\n   - Derecha: Total acumulado (186)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (54 × 5 - 186) / (5 - 2)\n   = (270 - 186) / 3\n   = 28 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 54 - 28 = 26 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 54,
      "right": 186,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 21, al resultado lo divido entre 3 y finalmente le resto 21, obtengo 22. ¿Cuál es el número que pensé?",
    "expectedAnswer": "36",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 22.\n2. Sumamos 21 -> 43\n3. Multiplicamos por 3 -> 129\n4. Restamos 21 -> 108\n5. Dividimos entre 3 -> 36.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 21
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 21
        }
      ],
      "result": 22
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 33 elementos y 90 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "12",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (33)\n   - Derecha: Total acumulado (90)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (33 × 4 - 90) / (4 - 2)\n   = (132 - 90) / 2\n   = 21 motos.\n3. Como nos piden autos:\n   Restamos del total: 33 - 21 = 12 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 33,
      "right": 90,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 21, al resultado lo divido entre 2 y finalmente le resto 26, obtengo 19. ¿Cuál es el número que pensé?",
    "expectedAnswer": "23",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 19.\n2. Sumamos 26 -> 45\n3. Multiplicamos por 2 -> 90\n4. Restamos 21 -> 69\n5. Dividimos entre 3 -> 23.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 21
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 26
        }
      ],
      "result": 19
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 40 elementos y 110 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "15",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (40)\n   - Derecha: Total acumulado (110)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (40 × 4 - 110) / (4 - 2)\n   = (160 - 110) / 2\n   = 25 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 40 - 25 = 15 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 40,
      "right": 110,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 36, al resultado lo divido entre 4 y finalmente le resto 19, obtengo 12. ¿Cuál es el número que pensé?",
    "expectedAnswer": "44",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 12.\n2. Sumamos 19 -> 31\n3. Multiplicamos por 4 -> 124\n4. Restamos 36 -> 88\n5. Dividimos entre 2 -> 44.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 36
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 19
        }
      ],
      "result": 12
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 59 elementos y 175 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "19",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (59)\n   - Derecha: Total acumulado (175)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (59 × 5 - 175) / (5 - 2)\n   = (295 - 175) / 3\n   = 40 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 59 - 40 = 19 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 59,
      "right": 175,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 21, al resultado lo divido entre 3 y finalmente le resto 74, obtengo 53. ¿Cuál es el número que pensé?",
    "expectedAnswer": "72",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 53.\n2. Sumamos 74 -> 127\n3. Multiplicamos por 3 -> 381\n4. Restamos 21 -> 360\n5. Dividimos entre 5 -> 72.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 21
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 74
        }
      ],
      "result": 53
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 54 elementos y 168 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "30",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (54)\n   - Derecha: Total acumulado (168)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (54 × 4 - 168) / (4 - 2)\n   = (216 - 168) / 2\n   = 24 motos.\n3. Como nos piden autos:\n   Restamos del total: 54 - 24 = 30 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 54,
      "right": 168,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 5, al resultado lo divido entre 4 y finalmente le resto 35, obtengo 12. ¿Cuál es el número que pensé?",
    "expectedAnswer": "61",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 12.\n2. Sumamos 35 -> 47\n3. Multiplicamos por 4 -> 188\n4. Restamos 5 -> 183\n5. Dividimos entre 3 -> 61.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 5
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 35
        }
      ],
      "result": 12
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 55 elementos y 164 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "27",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (55)\n   - Derecha: Total acumulado (164)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (55 × 4 - 164) / (4 - 2)\n   = (220 - 164) / 2\n   = 28 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 55 - 28 = 27 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 55,
      "right": 164,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 12, al resultado lo divido entre 3 y finalmente le resto 19, obtengo 50. ¿Cuál es el número que pensé?",
    "expectedAnswer": "65",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 50.\n2. Sumamos 19 -> 69\n3. Multiplicamos por 3 -> 207\n4. Restamos 12 -> 195\n5. Dividimos entre 3 -> 65.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 12
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 19
        }
      ],
      "result": 50
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 51 elementos y 162 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "30",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (51)\n   - Derecha: Total acumulado (162)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (51 × 4 - 162) / (4 - 2)\n   = (204 - 162) / 2\n   = 21 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 51 - 21 = 30 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 51,
      "right": 162,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 11, al resultado lo divido entre 3 y finalmente le resto 5, obtengo 22. ¿Cuál es el número que pensé?",
    "expectedAnswer": "14",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 22.\n2. Sumamos 5 -> 27\n3. Multiplicamos por 3 -> 81\n4. Restamos 11 -> 70\n5. Dividimos entre 5 -> 14.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 11
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 5
        }
      ],
      "result": 22
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 50 elementos y 148 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "24",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (50)\n   - Derecha: Total acumulado (148)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (50 × 4 - 148) / (4 - 2)\n   = (200 - 148) / 2\n   = 26 motos.\n3. Como nos piden autos:\n   Restamos del total: 50 - 26 = 24 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 50,
      "right": 148,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 24, al resultado lo divido entre 5 y finalmente le resto 15, obtengo 9. ¿Cuál es el número que pensé?",
    "expectedAnswer": "32",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 9.\n2. Sumamos 15 -> 24\n3. Multiplicamos por 5 -> 120\n4. Restamos 24 -> 96\n5. Dividimos entre 3 -> 32.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 24
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 15
        }
      ],
      "result": 9
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 29 elementos y 91 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "11",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (29)\n   - Derecha: Total acumulado (91)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (29 × 5 - 91) / (5 - 2)\n   = (145 - 91) / 3\n   = 18 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 29 - 18 = 11 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 29,
      "right": 91,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 6, al resultado lo divido entre 3 y finalmente le resto 20, obtengo 32. ¿Cuál es el número que pensé?",
    "expectedAnswer": "50",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 32.\n2. Sumamos 20 -> 52\n3. Multiplicamos por 3 -> 156\n4. Restamos 6 -> 150\n5. Dividimos entre 3 -> 50.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 6
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 20
        }
      ],
      "result": 32
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 58 elementos y 154 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "19",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (58)\n   - Derecha: Total acumulado (154)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (58 × 4 - 154) / (4 - 2)\n   = (232 - 154) / 2\n   = 39 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 58 - 39 = 19 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 58,
      "right": 154,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 16, al resultado lo divido entre 3 y finalmente le resto 38, obtengo 20. ¿Cuál es el número que pensé?",
    "expectedAnswer": "79",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 20.\n2. Sumamos 38 -> 58\n3. Multiplicamos por 3 -> 174\n4. Restamos 16 -> 158\n5. Dividimos entre 2 -> 79.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 16
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 38
        }
      ],
      "result": 20
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 43 elementos y 110 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "12",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (43)\n   - Derecha: Total acumulado (110)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (43 × 4 - 110) / (4 - 2)\n   = (172 - 110) / 2\n   = 31 motos.\n3. Como nos piden autos:\n   Restamos del total: 43 - 31 = 12 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 43,
      "right": 110,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 32, al resultado lo divido entre 3 y finalmente le resto 56, obtengo 63. ¿Cuál es el número que pensé?",
    "expectedAnswer": "65",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 63.\n2. Sumamos 56 -> 119\n3. Multiplicamos por 3 -> 357\n4. Restamos 32 -> 325\n5. Dividimos entre 5 -> 65.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 32
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 56
        }
      ],
      "result": 63
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 54 elementos y 136 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "14",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (54)\n   - Derecha: Total acumulado (136)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (54 × 4 - 136) / (4 - 2)\n   = (216 - 136) / 2\n   = 40 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 54 - 40 = 14 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 54,
      "right": 136,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 43, al resultado lo divido entre 4 y finalmente le resto 31, obtengo 27. ¿Cuál es el número que pensé?",
    "expectedAnswer": "63",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 27.\n2. Sumamos 31 -> 58\n3. Multiplicamos por 4 -> 232\n4. Restamos 43 -> 189\n5. Dividimos entre 3 -> 63.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 43
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 31
        }
      ],
      "result": 27
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 46 elementos y 112 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "10",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (46)\n   - Derecha: Total acumulado (112)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (46 × 4 - 112) / (4 - 2)\n   = (184 - 112) / 2\n   = 36 motos.\n3. Como nos piden autos:\n   Restamos del total: 46 - 36 = 10 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 46,
      "right": 112,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 18, al resultado lo divido entre 2 y finalmente le resto 114, obtengo 59. ¿Cuál es el número que pensé?",
    "expectedAnswer": "82",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 59.\n2. Sumamos 114 -> 173\n3. Multiplicamos por 2 -> 346\n4. Restamos 18 -> 328\n5. Dividimos entre 4 -> 82.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 18
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 114
        }
      ],
      "result": 59
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 49 elementos y 161 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "21",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (49)\n   - Derecha: Total acumulado (161)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (49 × 5 - 161) / (5 - 2)\n   = (245 - 161) / 3\n   = 28 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 49 - 28 = 21 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 49,
      "right": 161,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 28, al resultado lo divido entre 4 y finalmente le resto 32, obtengo 23. ¿Cuál es el número que pensé?",
    "expectedAnswer": "96",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 23.\n2. Sumamos 32 -> 55\n3. Multiplicamos por 4 -> 220\n4. Restamos 28 -> 192\n5. Dividimos entre 2 -> 96.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 28
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 32
        }
      ],
      "result": 23
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 57 elementos y 164 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "25",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (57)\n   - Derecha: Total acumulado (164)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (57 × 4 - 164) / (4 - 2)\n   = (228 - 164) / 2\n   = 32 motos.\n3. Como nos piden autos:\n   Restamos del total: 57 - 32 = 25 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 57,
      "right": 164,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 8, al resultado lo divido entre 4 y finalmente le resto 31, obtengo 10. ¿Cuál es el número que pensé?",
    "expectedAnswer": "39",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 10.\n2. Sumamos 31 -> 41\n3. Multiplicamos por 4 -> 164\n4. Restamos 8 -> 156\n5. Dividimos entre 4 -> 39.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 8
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 31
        }
      ],
      "result": 10
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 38 elementos y 100 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "12",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (38)\n   - Derecha: Total acumulado (100)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (38 × 4 - 100) / (4 - 2)\n   = (152 - 100) / 2\n   = 26 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 38 - 26 = 12 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 38,
      "right": 100,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 45, al resultado lo divido entre 5 y finalmente le resto 15, obtengo 30. ¿Cuál es el número que pensé?",
    "expectedAnswer": "90",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 30.\n2. Sumamos 15 -> 45\n3. Multiplicamos por 5 -> 225\n4. Restamos 45 -> 180\n5. Dividimos entre 2 -> 90.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 45
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 15
        }
      ],
      "result": 30
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 44 elementos y 146 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "29",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (44)\n   - Derecha: Total acumulado (146)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (44 × 4 - 146) / (4 - 2)\n   = (176 - 146) / 2\n   = 15 motos.\n3. Como nos piden autos:\n   Restamos del total: 44 - 15 = 29 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 44,
      "right": 146,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 6, al resultado lo divido entre 3 y finalmente le resto 22, obtengo 10. ¿Cuál es el número que pensé?",
    "expectedAnswer": "45",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 10.\n2. Sumamos 22 -> 32\n3. Multiplicamos por 3 -> 96\n4. Restamos 6 -> 90\n5. Dividimos entre 2 -> 45.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 6
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 22
        }
      ],
      "result": 10
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 53 elementos y 145 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (53)\n   - Derecha: Total acumulado (145)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (53 × 5 - 145) / (5 - 2)\n   = (265 - 145) / 3\n   = 40 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 53 - 40 = 13 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 53,
      "right": 145,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 30, al resultado lo divido entre 5 y finalmente le resto 6, obtengo 9. ¿Cuál es el número que pensé?",
    "expectedAnswer": "15",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 9.\n2. Sumamos 6 -> 15\n3. Multiplicamos por 5 -> 75\n4. Restamos 30 -> 45\n5. Dividimos entre 3 -> 15.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 30
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 6
        }
      ],
      "result": 9
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 44 elementos y 139 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "17",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (44)\n   - Derecha: Total acumulado (139)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (44 × 5 - 139) / (5 - 2)\n   = (220 - 139) / 3\n   = 27 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 44 - 27 = 17 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 44,
      "right": 139,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 20, al resultado lo divido entre 5 y finalmente le resto 9, obtengo 35. ¿Cuál es el número que pensé?",
    "expectedAnswer": "40",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 35.\n2. Sumamos 9 -> 44\n3. Multiplicamos por 5 -> 220\n4. Restamos 20 -> 200\n5. Dividimos entre 5 -> 40.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 20
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 9
        }
      ],
      "result": 35
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 45 elementos y 150 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "30",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (45)\n   - Derecha: Total acumulado (150)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (45 × 4 - 150) / (4 - 2)\n   = (180 - 150) / 2\n   = 15 motos.\n3. Como nos piden autos:\n   Restamos del total: 45 - 15 = 30 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 45,
      "right": 150,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 22, al resultado lo divido entre 4 y finalmente le resto 21, obtengo 4. ¿Cuál es el número que pensé?",
    "expectedAnswer": "39",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 4.\n2. Sumamos 21 -> 25\n3. Multiplicamos por 4 -> 100\n4. Restamos 22 -> 78\n5. Dividimos entre 2 -> 39.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 22
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 21
        }
      ],
      "result": 4
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 57 elementos y 171 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "19",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (57)\n   - Derecha: Total acumulado (171)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (57 × 5 - 171) / (5 - 2)\n   = (285 - 171) / 3\n   = 38 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 57 - 38 = 19 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 57,
      "right": 171,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 37, al resultado lo divido entre 5 y finalmente le resto 23, obtengo 20. ¿Cuál es el número que pensé?",
    "expectedAnswer": "89",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 20.\n2. Sumamos 23 -> 43\n3. Multiplicamos por 5 -> 215\n4. Restamos 37 -> 178\n5. Dividimos entre 2 -> 89.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 37
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 23
        }
      ],
      "result": 20
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 46 elementos y 140 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "24",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (46)\n   - Derecha: Total acumulado (140)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (46 × 4 - 140) / (4 - 2)\n   = (184 - 140) / 2\n   = 22 motos.\n3. Como nos piden autos:\n   Restamos del total: 46 - 22 = 24 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 46,
      "right": 140,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 25, al resultado lo divido entre 5 y finalmente le resto 41, obtengo 29. ¿Cuál es el número que pensé?",
    "expectedAnswer": "65",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 29.\n2. Sumamos 41 -> 70\n3. Multiplicamos por 5 -> 350\n4. Restamos 25 -> 325\n5. Dividimos entre 5 -> 65.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 25
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 41
        }
      ],
      "result": 29
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 40 elementos y 106 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (40)\n   - Derecha: Total acumulado (106)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (40 × 4 - 106) / (4 - 2)\n   = (160 - 106) / 2\n   = 27 motos.\n3. Como nos piden autos:\n   Restamos del total: 40 - 27 = 13 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 40,
      "right": 106,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 15, al resultado lo divido entre 2 y finalmente le resto 105, obtengo 42. ¿Cuál es el número que pensé?",
    "expectedAnswer": "93",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 42.\n2. Sumamos 105 -> 147\n3. Multiplicamos por 2 -> 294\n4. Restamos 15 -> 279\n5. Dividimos entre 3 -> 93.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 15
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 105
        }
      ],
      "result": 42
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 44 elementos y 166 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "26",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (44)\n   - Derecha: Total acumulado (166)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (44 × 5 - 166) / (5 - 2)\n   = (220 - 166) / 3\n   = 18 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 44 - 18 = 26 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 44,
      "right": 166,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 12, al resultado lo divido entre 4 y finalmente le resto 14, obtengo 64. ¿Cuál es el número que pensé?",
    "expectedAnswer": "75",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 64.\n2. Sumamos 14 -> 78\n3. Multiplicamos por 4 -> 312\n4. Restamos 12 -> 300\n5. Dividimos entre 4 -> 75.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 12
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 14
        }
      ],
      "result": 64
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 50 elementos y 132 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "16",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (50)\n   - Derecha: Total acumulado (132)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (50 × 4 - 132) / (4 - 2)\n   = (200 - 132) / 2\n   = 34 motos.\n3. Como nos piden autos:\n   Restamos del total: 50 - 34 = 16 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 50,
      "right": 132,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 2, luego le sumo 14, al resultado lo divido entre 2 y finalmente le resto 16, obtengo 12. ¿Cuál es el número que pensé?",
    "expectedAnswer": "21",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 12.\n2. Sumamos 16 -> 28\n3. Multiplicamos por 2 -> 56\n4. Restamos 14 -> 42\n5. Dividimos entre 2 -> 21.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 2
        },
        {
          "op": "+",
          "val": 14
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 16
        }
      ],
      "result": 12
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 58 elementos y 154 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "19",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (58)\n   - Derecha: Total acumulado (154)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (58 × 4 - 154) / (4 - 2)\n   = (232 - 154) / 2\n   = 39 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 58 - 39 = 19 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 58,
      "right": 154,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 24, al resultado lo divido entre 3 y finalmente le resto 68, obtengo 10. ¿Cuál es el número que pensé?",
    "expectedAnswer": "42",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 10.\n2. Sumamos 68 -> 78\n3. Multiplicamos por 3 -> 234\n4. Restamos 24 -> 210\n5. Dividimos entre 5 -> 42.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 24
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 68
        }
      ],
      "result": 10
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 37 elementos y 104 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "15",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (37)\n   - Derecha: Total acumulado (104)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (37 × 4 - 104) / (4 - 2)\n   = (148 - 104) / 2\n   = 22 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 37 - 22 = 15 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 37,
      "right": 104,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 43, al resultado lo divido entre 5 y finalmente le resto 12, obtengo 56. ¿Cuál es el número que pensé?",
    "expectedAnswer": "99",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 56.\n2. Sumamos 12 -> 68\n3. Multiplicamos por 5 -> 340\n4. Restamos 43 -> 297\n5. Dividimos entre 3 -> 99.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 43
        },
        {
          "op": "÷",
          "val": 5
        },
        {
          "op": "-",
          "val": 12
        }
      ],
      "result": 56
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 47 elementos y 120 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (47)\n   - Derecha: Total acumulado (120)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (47 × 4 - 120) / (4 - 2)\n   = (188 - 120) / 2\n   = 34 motos.\n3. Como nos piden autos:\n   Restamos del total: 47 - 34 = 13 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 47,
      "right": 120,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 23, al resultado lo divido entre 3 y finalmente le resto 13, obtengo 60. ¿Cuál es el número que pensé?",
    "expectedAnswer": "49",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 60.\n2. Sumamos 13 -> 73\n3. Multiplicamos por 3 -> 219\n4. Restamos 23 -> 196\n5. Dividimos entre 4 -> 49.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 23
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 13
        }
      ],
      "result": 60
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 45 elementos y 120 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "15",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (45)\n   - Derecha: Total acumulado (120)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (45 × 4 - 120) / (4 - 2)\n   = (180 - 120) / 2\n   = 30 motos.\n3. Como nos piden autos:\n   Restamos del total: 45 - 30 = 15 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 45,
      "right": 120,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 14, al resultado lo divido entre 2 y finalmente le resto 61, obtengo 63. ¿Cuál es el número que pensé?",
    "expectedAnswer": "78",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 63.\n2. Sumamos 61 -> 124\n3. Multiplicamos por 2 -> 248\n4. Restamos 14 -> 234\n5. Dividimos entre 3 -> 78.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 14
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 61
        }
      ],
      "result": 63
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay motos y autos. Si se cuentan en total 59 elementos y 178 llantas, ¿cuántos(as) autos hay?",
    "expectedAnswer": "30",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (59)\n   - Derecha: Total acumulado (178)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (motos):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (59 × 4 - 178) / (4 - 2)\n   = (236 - 178) / 2\n   = 29 motos.\n3. Como nos piden autos:\n   Restamos del total: 59 - 29 = 30 autos.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 59,
      "right": 178,
      "leftLabel": "Total elementos",
      "rightLabel": "Total llantas",
      "topLabel": "autos (4)",
      "bottomLabel": "motos (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 3, luego le sumo 24, al resultado lo divido entre 3 y finalmente le resto 27, obtengo 5. ¿Cuál es el número que pensé?",
    "expectedAnswer": "24",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 5.\n2. Sumamos 27 -> 32\n3. Multiplicamos por 3 -> 96\n4. Restamos 24 -> 72\n5. Dividimos entre 3 -> 24.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 3
        },
        {
          "op": "+",
          "val": 24
        },
        {
          "op": "÷",
          "val": 3
        },
        {
          "op": "-",
          "val": 27
        }
      ],
      "result": 5
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 49 elementos y 146 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "24",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (49)\n   - Derecha: Total acumulado (146)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (49 × 4 - 146) / (4 - 2)\n   = (196 - 146) / 2\n   = 25 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 49 - 25 = 24 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 49,
      "right": 146,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 5, luego le sumo 2, al resultado lo divido entre 2 y finalmente le resto 45, obtengo 51. ¿Cuál es el número que pensé?",
    "expectedAnswer": "38",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 51.\n2. Sumamos 45 -> 96\n3. Multiplicamos por 2 -> 192\n4. Restamos 2 -> 190\n5. Dividimos entre 5 -> 38.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 5
        },
        {
          "op": "+",
          "val": 2
        },
        {
          "op": "÷",
          "val": 2
        },
        {
          "op": "-",
          "val": 45
        }
      ],
      "result": 51
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay gallinas y vacas. Si se cuentan en total 38 elementos y 102 patas, ¿cuántos(as) vacas hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (38)\n   - Derecha: Total acumulado (102)\n   - Arriba: Valor mayor (4)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (gallinas):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (38 × 4 - 102) / (4 - 2)\n   = (152 - 102) / 2\n   = 25 gallinas.\n3. Como nos piden vacas:\n   Restamos del total: 38 - 25 = 13 vacas.",
    "visualData": {
      "type": "rombo",
      "top": 4,
      "bottom": 2,
      "left": 38,
      "right": 102,
      "leftLabel": "Total elementos",
      "rightLabel": "Total patas",
      "topLabel": "vacas (4)",
      "bottomLabel": "gallinas (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "Pienso en un número. Si lo multiplico por 4, luego le sumo 4, al resultado lo divido entre 4 y finalmente le resto 33, obtengo 53. ¿Cuál es el número que pensé?",
    "expectedAnswer": "85",
    "explanation": "Método del cangrejo (operaciones inversas):\n1. Empezamos en 53.\n2. Sumamos 33 -> 86\n3. Multiplicamos por 4 -> 344\n4. Restamos 4 -> 340\n5. Dividimos entre 4 -> 85.",
    "visualData": {
      "type": "cangrejo",
      "steps": [
        {
          "op": "×",
          "val": 4
        },
        {
          "op": "+",
          "val": 4
        },
        {
          "op": "÷",
          "val": 4
        },
        {
          "op": "-",
          "val": 33
        }
      ],
      "result": 53
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  },
  {
    "intro": "En un grupo hay monedas de S/2 y monedas de S/5. Si se cuentan en total 35 elementos y 109 soles, ¿cuántos(as) monedas de S/5 hay?",
    "expectedAnswer": "13",
    "explanation": "Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (35)\n   - Derecha: Total acumulado (109)\n   - Arriba: Valor mayor (5)\n   - Abajo: Valor menor (2)\n2. Aplicamos la fórmula para hallar el valor de ABAJO (monedas de S/2):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (35 × 5 - 109) / (5 - 2)\n   = (175 - 109) / 3\n   = 22 monedas de S/2.\n3. Como nos piden monedas de S/5:\n   Restamos del total: 35 - 22 = 13 monedas de S/5.",
    "visualData": {
      "type": "rombo",
      "top": 5,
      "bottom": 2,
      "left": 35,
      "right": 109,
      "leftLabel": "Total elementos",
      "rightLabel": "Total soles",
      "topLabel": "monedas de S/5 (5)",
      "bottomLabel": "monedas de S/2 (2)"
    },
    "unit": "",
    "type": "Métodos Operativos",
    "mathData": [],
    "hintsType": "numeric"
  }
];
