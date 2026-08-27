import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { csvLine } from './lib.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');

export function buildStoryCsv(stories) {
  const columns = [
    'id', 'title', 'subtitle', 'language_code', 'language_name', 'locale', 'script',
    'cefr_level', 'canonical_url', 'summary', 'reading_minutes', 'word_count',
    'themes', 'setting_tags', 'grammar_focus', 'communicative_outcome',
    'target_phrases', 'original_text', 'english_translation', 'sentence_count',
    'vocabulary_json', 'questions_json', 'sentence_building_json',
    'source_hash', 'dataset_semantic_hash', 'license',
  ];

  let output = csvLine(columns);
  for (const story of stories) {
    output += csvLine([
      story.id,
      story.title,
      story.subtitle,
      story.language.code,
      story.language.name,
      story.language.locale,
      story.language.script,
      story.cefr_level,
      story.canonical_url,
      story.summary,
      story.reading_minutes,
      story.word_count,
      JSON.stringify(story.themes),
      JSON.stringify(story.setting_tags),
      JSON.stringify(story.grammar_focus),
      story.communicative_outcome,
      JSON.stringify(story.target_phrases),
      story.sentences.map((sentence) => sentence.text).join(' '),
      story.sentences.map((sentence) => sentence.translation).join(' '),
      story.sentences.length,
      JSON.stringify(story.vocabulary),
      JSON.stringify(story.comprehension_questions),
      JSON.stringify(story.sentence_building),
      story.provenance.source_hash,
      story.dataset_semantic_hash,
      'CC BY-NC 4.0',
    ]);
  }
  return output;
}

export function buildSentenceCsv(stories) {
  const columns = [
    'story_id', 'sentence_id', 'language_code', 'language_name', 'locale',
    'cefr_level', 'canonical_url', 'text', 'translation', 'license',
  ];

  let output = csvLine(columns);
  for (const story of stories) {
    for (const sentence of story.sentences) {
      output += csvLine([
        story.id,
        sentence.id,
        story.language.code,
        story.language.name,
        story.language.locale,
        story.cefr_level,
        story.canonical_url,
        sentence.text,
        sentence.translation,
        'CC BY-NC 4.0',
      ]);
    }
  }
  return output;
}

export function buildVocabularyCsv(stories) {
  const columns = [
    'story_id', 'vocabulary_id', 'language_code', 'cefr_level', 'sentence_id',
    'surface', 'lemma', 'translation', 'part_of_speech', 'details', 'canonical_url', 'license',
  ];

  let output = csvLine(columns);
  for (const story of stories) {
    for (const item of story.vocabulary) {
      output += csvLine([
        story.id,
        item.id,
        story.language.code,
        story.cefr_level,
        item.sentence_id,
        item.surface,
        item.lemma,
        item.translation,
        item.part_of_speech,
        item.details,
        story.canonical_url,
        'CC BY-NC 4.0',
      ]);
    }
  }
  return output;
}

export function buildQuestionCsv(stories) {
  const columns = [
    'story_id', 'question_id', 'language_code', 'cefr_level', 'prompt', 'choices_json',
    'correct_index', 'correct_answer', 'explanation', 'canonical_url', 'license',
  ];

  let output = csvLine(columns);
  for (const story of stories) {
    for (const question of story.comprehension_questions) {
      output += csvLine([
        story.id,
        question.id,
        story.language.code,
        story.cefr_level,
        question.prompt,
        JSON.stringify(question.choices),
        question.correct_index,
        question.choices[question.correct_index],
        question.explanation,
        story.canonical_url,
        'CC BY-NC 4.0',
      ]);
    }
  }
  return output;
}

async function main() {
  const stories = JSON.parse(await readFile(join(repositoryRoot, 'data', 'stories.json'), 'utf8'));
  await writeFile(join(repositoryRoot, 'data', 'stories.csv'), buildStoryCsv(stories), 'utf8');
  await writeFile(join(repositoryRoot, 'data', 'sentences.csv'), buildSentenceCsv(stories), 'utf8');
  await writeFile(join(repositoryRoot, 'data', 'vocabulary.csv'), buildVocabularyCsv(stories), 'utf8');
  await writeFile(join(repositoryRoot, 'data', 'questions.csv'), buildQuestionCsv(stories), 'utf8');
  console.log(`Generated four CSV views for ${stories.length} stories.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
