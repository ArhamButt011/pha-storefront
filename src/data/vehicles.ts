export const YEARS = Array.from({ length: 15 }, (_, i) => `${2026 - i}`);

export const MODELS_BY_MAKE: Record<string, string[]> = {
  BMW: ["3 Series", "5 Series", "M3", "M4", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "AMG GT", "GLE"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan"],
};

export const MAKES = Object.keys(MODELS_BY_MAKE);

export const ENGINES = ["Petrol", "Diesel", "Electric", "Hybrid"];
