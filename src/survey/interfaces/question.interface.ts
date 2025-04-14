export interface ValidationRule {
  pattern?: string;
  message?: string;
}

export interface DependsOn {
  questionId: string;
  getOptions: (answer: string) => string[];
}

export interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "select" | "rating";
  options?: string[];
  hasOther?: boolean;
  required: boolean;
  category: "marketing" | "support";
  validation?: ValidationRule;
  dependsOn?: DependsOn;
}
