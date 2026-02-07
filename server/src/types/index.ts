export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface SubTopic {
  label: string;
  quiz: QuizData | null;
}

export interface ScoutResponse {
  subTopics: SubTopic[];
}

export interface HoverResponse {
  funFact: string;
}
