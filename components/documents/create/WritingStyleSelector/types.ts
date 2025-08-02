export interface ToneAnalysis {
  formality?: string;
  emotion?: string;
}

export interface WritingStyle {
  id: string;
  styleName: string;
  vocabularyLevel: number | null;
  toneAnalysis: ToneAnalysis;
}

export interface WritingStyleSelectorProps {
  userId: string;
  selectedWritingStyleId?: string;
  onWritingStyleChange: (writingStyleId: string | undefined) => void;
  disabled?: boolean;
} 