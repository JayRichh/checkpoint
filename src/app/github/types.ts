export interface Language {
  name: string;
  percentage: number;
  color: string;
  lineCount?: number;
  fileCount?: number;
}

export interface YearData {
  year: number;
  totalContributions: number;
  contributions: Array<{ day: string; value: number }>;
}

export interface LanguageData {
  languages: Language[];
  totalLines: number;
  totalFiles: number;
}
