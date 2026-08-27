import { createHash } from 'node:crypto';

export const DATASET_VERSION = '1.0.0';
export const RELEASE_DATE = '2026-08-27';
export const EXPECTED_LANGUAGES = ['de', 'es', 'fr', 'it', 'ko', 'ru'];
export const EXPECTED_LEVELS = ['A1', 'A2', 'B1', 'B2'];
export const EXPECTED_STORY_COUNTS = {
  de: { A1: 6, A2: 7, B1: 6, B2: 6 },
  es: { A1: 7, A2: 5, B1: 6, B2: 6 },
  fr: { A1: 6, A2: 6, B1: 6, B2: 6 },
  it: { A1: 6, A2: 7, B1: 6, B2: 6 },
  ko: { A1: 5, A2: 5, B1: 0, B2: 0 },
  ru: { A1: 5, A2: 5, B1: 0, B2: 0 },
};

export const LANGUAGE_METADATA = {
  de: { name: 'German', locale: 'de-DE', script: 'Latin' },
  es: { name: 'Spanish', locale: 'es-ES', script: 'Latin' },
  fr: { name: 'French', locale: 'fr-FR', script: 'Latin' },
  it: { name: 'Italian', locale: 'it-IT', script: 'Latin' },
  ko: { name: 'Korean', locale: 'ko-KR', script: 'Hangul' },
  ru: { name: 'Russian', locale: 'ru-RU', script: 'Cyrillic' },
};

export function semanticPayload(story) {
  return {
    title: story.title,
    subtitle: story.subtitle,
    language: story.language,
    cefr_level: story.cefr_level,
    summary: story.summary,
    themes: story.themes,
    grammar_focus: story.grammar_focus,
    communicative_outcome: story.communicative_outcome,
    target_phrases: story.target_phrases,
    sentences: story.sentences,
    vocabulary: story.vocabulary,
    pre_reading_vocabulary: story.pre_reading_vocabulary,
    language_notes: story.language_notes,
    comprehension_questions: story.comprehension_questions,
    sentence_building: story.sentence_building,
  };
}

export function semanticHash(story) {
  return createHash('sha256')
    .update(JSON.stringify(semanticPayload(story)))
    .digest('hex')
    .slice(0, 16);
}

export function sourceHash(value) {
  return createHash('sha256')
    .update(JSON.stringify(value))
    .digest('hex')
    .slice(0, 16);
}

export function csvCell(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function csvLine(values) {
  return `${values.map(csvCell).join(',')}\n`;
}
