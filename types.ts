
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  selectedVariant: number | null;
  currentQuestionIndex: number;
  score: number;
  showResults: boolean;
  userAnswers: (number | null)[];
  isStarted: boolean;
}
