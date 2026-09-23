const item = (name, art, answer) => ({ name, art, answer });

const LEVELS = [{
  title: "Food Group Sorter",
  instruction: "Sort each food by how it helps your body.",
  showNames: true,
  maxOnBelt: 3,
  beltTravelRate: 0.076,
  bins: [
    { id: "energy", label: "Energy-giving", art: "rice" },
    { id: "building", label: "Body-building", art: "milk" },
    { id: "protective", label: "Protective", art: "carrot" },
  ],
  items: [
    item("Rice", "rice", "energy"), item("Potato", "potato", "energy"),
    item("Banana", "banana", "energy"), item("Millets", "millets", "energy"),
    item("Pulses", "pulses", "building"), item("Milk", "milk", "building"), item("Eggs", "eggs", "building"),
    item("Carrot", "carrot", "protective"), item("Spinach", "spinach", "protective"), item("Orange", "orange", "protective"),
  ],
}];

function buildTutorial(level) {
  const examples = level.bins.map((bin) => level.items.find((entry) => entry.answer === bin.id));
  const demonstration = examples[0]; const interactive = examples[1];
  const labelFor = (entry) => level.bins.find((bin) => bin.id === entry.answer)?.label ?? entry.answer;
  return { concept: level.title, intro: level.instruction, mandatory: true, steps: [
    { type: "concept", instruction: level.instruction },
    { type: "demonstration", objectName: demonstration.name, instruction: `${demonstration.name} → ${labelFor(demonstration)}` },
    { type: "interactive", objectName: interactive.name, instruction: `Sort ${interactive.name}!`, allowHints: true },
    { type: "completion", instruction: "You're ready!" },
  ] };
}

export const MATH_LEVELS = LEVELS.map((level, index) => ({
  ...level, goal: level.items.length, requiredCorrectPerItem: 1, assetSet: `level${index + 1}`,
  bins: level.bins.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  items: level.items.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })), tutorial: buildTutorial(level),
}));
export const getLevel = (index) => MATH_LEVELS[index];
