export const WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const GOALS = ["Perder grasa abdominal", "Ganar masa muscular", "Aumentar glúteos", "Perder peso", "Ganar fuerza", "Mantenimiento"];
export const DEFAULT_PLAN = { 0: "torso", 1: "descanso", 2: "pierna", 3: "descanso", 4: "torso", 5: "pierna", 6: "descanso" };

export const ROUTINES = {
  torso: { name: "Torso / Brazos", ex: [
    { id: "inc", name: "Press inclinado mancuernas", en: "dumbbell incline bench press", sets: 4, reps: "8-10" },
    { id: "row", name: "Remo con mancuerna", en: "dumbbell one arm row", sets: 4, reps: "10" },
    { id: "lat", name: "Elevaciones laterales", en: "dumbbell lateral raise", sets: 3, reps: "12-15" },
    { id: "curl", name: "Curl de bíceps", en: "dumbbell biceps curl", sets: 3, reps: "10-12" },
    { id: "tri", name: "Tríceps en polea", en: "cable pushdown", sets: 3, reps: "12" },
    { id: "plank", name: "Plancha abdominal", en: "plank", sets: 3, reps: "45 s" },
  ]},
  pierna: { name: "Pierna / Glúteo", ex: [
    { id: "sq", name: "Sentadilla", en: "barbell squat", sets: 4, reps: "8-10" },
    { id: "rdl", name: "Peso muerto rumano", en: "barbell romanian deadlift", sets: 4, reps: "10" },
    { id: "hip", name: "Hip thrust", en: "barbell glute bridge", sets: 4, reps: "10-12" },
    { id: "lun", name: "Zancadas", en: "dumbbell lunge", sets: 3, reps: "10 c/l" },
    { id: "prs", name: "Prensa de pierna", en: "sled 45 leg press", sets: 3, reps: "12" },
    { id: "calf", name: "Elevación de gemelos", en: "standing calf raise", sets: 3, reps: "15" },
  ]},
  descanso: { name: "Descanso activo", ex: [] },
};

export const TIPS = [
  "Lee las etiquetas: 'jarabe', 'dextrosa' y 'maltodextrina' también son azúcar.",
  "Cambia refrescos por agua con limón o gas.",
  "Come proteína en el desayuno para reducir antojos dulces.",
  "Si quieres algo dulce, fruta entera antes que jugo.",
  "Duerme 7-8 h: dormir poco aumenta el antojo de azúcar.",
  "Endulza el café poco a poco hasta dejarlo sin azúcar.",
  "Ten snacks listos: frutos secos, yogur natural, huevo cocido.",
];

export const RECIPES = [
  { n: "Bowl de yogur griego y frutos rojos", t: ["proteina", "bajo-azucar", "rapida"], m: "5 min · 20 g prot", i: "Yogur griego natural, frutos rojos, nueces, canela." },
  { n: "Tortilla de claras con espinaca", t: ["proteina", "bajo-azucar", "rapida"], m: "10 min · 28 g prot", i: "4 claras, 1 huevo, espinaca, tomate, sal y pimienta." },
  { n: "Pollo a la plancha con quinua", t: ["proteina", "bajo-azucar"], m: "25 min · 40 g prot", i: "Pechuga, quinua, brócoli, limón, ajo." },
  { n: "Batido verde proteico", t: ["proteina", "rapida"], m: "5 min · 25 g prot", i: "Leche o agua, proteína, espinaca, 1/2 plátano, chía." },
  { n: "Ensalada de atún y garbanzos", t: ["proteina", "bajo-azucar", "rapida"], m: "10 min · 30 g prot", i: "Atún, garbanzos, pepino, cebolla morada, aceite de oliva." },
  { n: "Pancakes de avena y plátano", t: ["bajo-azucar"], m: "15 min · 12 g prot", i: "1 plátano, 1 huevo, 40 g avena, canela. Sin azúcar añadida." },
];
