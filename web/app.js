import { calc_json, list_json, show_json } from "../_build/js/debug/build/web-bridge/web-bridge.js";

const formulaList = document.querySelector("#formula-list");
const search = document.querySelector("#formula-search");
const form = document.querySelector("#calc-form");
const title = document.querySelector("#formula-title");
const domain = document.querySelector("#formula-domain");
const equation = document.querySelector("#formula-equation");
const details = document.querySelector("#formula-details");
const result = document.querySelector("#result");
const calculate = document.querySelector("#calculate");
const exampleButtons = document.querySelectorAll("[data-example]");

const defaults = {
  force: { mass: "2 kg", acceleration: "3 m/s^2" },
  "ohm-voltage": { current: "2 A", resistance: "3 Ohm" },
  "kinetic-energy": { mass: "2 kg", velocity: "3 m/s" },
  "sensible-heat": {
    mass: "2 kg",
    specific_heat: "4186 J/(kg*K)",
    temperature_difference: "10 K",
  },
};

let formulas = [];
let selected = null;
let currentInputs = [];

function parsePayload(text) {
  return JSON.parse(text);
}

function selectedFormat() {
  return document.querySelector('input[name="format"]:checked')?.value || "ascii";
}

function parseCatalog(text) {
  return text
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, group, display] = line.split("\t");
      return { name, group, display };
    });
}

function parseInputs(showText) {
  return showText
    .split("\n")
    .map((line) => line.match(/^\s+--([^\s]+)\s+<quantity>\s+dimension:\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({ name: match[1], dimension: match[2] }));
}

function parseShow(showText) {
  const lines = showText.split("\n");
  const field = (prefix) =>
    lines.find((line) => line.startsWith(prefix))?.slice(prefix.length) || "";
  return {
    name: field("name: "),
    group: field("domain: "),
    display: field("formula: "),
    description: field("description: "),
    inputs: parseInputs(showText),
  };
}

function renderFormulaList() {
  const query = search.value.trim().toLowerCase();
  formulaList.textContent = "";
  for (const formula of formulas) {
    if (query && !`${formula.name} ${formula.group} ${formula.display}`.toLowerCase().includes(query)) {
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "formula-item";
    button.classList.toggle("is-selected", formula.name === selected);
    button.innerHTML = `<span>${formula.name}</span><code>${formula.display}</code>`;
    button.addEventListener("click", () => selectFormula(formula.name));
    formulaList.append(button);
  }
}

function renderInputs(model) {
  form.textContent = "";
  currentInputs = model.inputs;
  const values = defaults[model.name] || {};
  for (const input of model.inputs) {
    const label = document.createElement("label");
    label.className = "input-row";
    label.innerHTML = `<span>${input.name}</span><small>${input.dimension}</small>`;
    const control = document.createElement("input");
    control.name = input.name;
    control.value = values[input.name] || "";
    control.autocomplete = "off";
    label.append(control);
    form.append(label);
  }
}

function renderResult(payload) {
  result.classList.toggle("is-error", !payload.ok);
  result.textContent = payload.ok ? payload.value : payload.error;
}

function inputBindings() {
  const data = new FormData(form);
  return currentInputs
    .map((input) => `${input.name}=${String(data.get(input.name) || "").trim()}`)
    .join("\n");
}

function calculateCurrent() {
  if (!selected) {
    return;
  }
  renderResult(parsePayload(calc_json(selected, inputBindings(), selectedFormat())));
}

function selectFormula(name) {
  selected = name;
  renderFormulaList();
  const payload = parsePayload(show_json(name));
  if (!payload.ok) {
    renderResult(payload);
    return;
  }
  const model = parseShow(payload.value);
  domain.textContent = model.group;
  title.textContent = model.name;
  equation.textContent = model.display;
  details.textContent = model.description;
  renderInputs(model);
  calculateCurrent();
}

function loadCatalog() {
  const payload = parsePayload(list_json());
  if (!payload.ok) {
    renderResult(payload);
    return;
  }
  formulas = parseCatalog(payload.value);
  const first = formulas.find((formula) => formula.name === "force") || formulas[0];
  renderFormulaList();
  if (first) {
    selectFormula(first.name);
  }
}

search.addEventListener("input", renderFormulaList);
calculate.addEventListener("click", calculateCurrent);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateCurrent();
});
for (const control of document.querySelectorAll('input[name="format"]')) {
  control.addEventListener("change", calculateCurrent);
}
for (const button of exampleButtons) {
  button.addEventListener("click", () => selectFormula(button.dataset.example));
}

loadCatalog();