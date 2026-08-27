import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import {
  DATASET_VERSION,
  EXPECTED_LANGUAGES,
  EXPECTED_LEVELS,
  EXPECTED_STORY_COUNTS,
  semanticHash,
} from './lib.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stories = JSON.parse(await readFile(join(repositoryRoot, 'data', 'stories.json'), 'utf8'));
const errors = [];

function requireCondition(condition, message) {
  if (!condition) errors.push(message);
}

requireCondition(Array.isArray(stories), 'data/stories.json must contain an array.');
requireCondition(stories.length === 118, `Expected 118 public stories, found ${stories.length}.`);

const seenIds = new Set();
const seenCanonicals = new Set();
const matrix = new Map();

for (const story of stories) {
  const label = story?.id ?? '<missing-id>';
  requireCondition(/^(de|es|fr|it|ko|ru)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(label), `${label}: invalid story ID.`);
  requireCondition(!seenIds.has(label), `${label}: duplicate story ID.`);
  seenIds.add(label);

  requireCondition(story.dataset_version === DATASET_VERSION, `${label}: unexpected dataset version.`);
  requireCondition(EXPECTED_LANGUAGES.includes(story.language?.code), `${label}: unexpected language code.`);
  requireCondition(EXPECTED_LEVELS.includes(story.cefr_level), `${label}: unexpected CEFR level.`);
  requireCondition(Boolean(story.title?.trim()), `${label}: missing title.`);
  requireCondition(/^https:\/\/melolingua\.com\/learn-/.test(story.canonical_url), `${label}: invalid canonical MeloLingua URL.`);
  requireCondition(!seenCanonicals.has(story.canonical_url), `${label}: duplicate canonical URL.`);
  seenCanonicals.add(story.canonical_url);

  const matrixKey = `${story.language.code}:${story.cefr_level}`;
  matrix.set(matrixKey, (matrix.get(matrixKey) ?? 0) + 1);

  requireCondition(Array.isArray(story.sentences) && story.sentences.length >= 1, `${label}: missing sentence pairs.`);
  const sentenceIds = new Set();
  for (const [index, sentence] of (story.sentences ?? []).entries()) {
    requireCondition(sentence.id === `s${index + 1}`, `${label}: sentence IDs must be sequential.`);
    requireCondition(!sentenceIds.has(sentence.id), `${label}: duplicate sentence ID ${sentence.id}.`);
    sentenceIds.add(sentence.id);
    requireCondition(Boolean(sentence.text?.trim()), `${label}/${sentence.id}: missing target text.`);
    requireCondition(Boolean(sentence.translation?.trim()), `${label}/${sentence.id}: missing English translation.`);
  }

  requireCondition(Array.isArray(story.vocabulary), `${label}: vocabulary must be an array.`);
  for (const item of story.vocabulary ?? []) {
    requireCondition(Boolean(item.id), `${label}: vocabulary entry is missing an ID.`);
    requireCondition(Boolean(item.surface?.trim()), `${label}/${item.id}: missing vocabulary surface.`);
    requireCondition(Boolean(item.translation?.trim()), `${label}/${item.id}: missing vocabulary translation.`);
    if (item.sentence_id != null) {
      requireCondition(sentenceIds.has(item.sentence_id), `${label}/${item.id}: unknown sentence ${item.sentence_id}.`);
    }
  }

  requireCondition(Array.isArray(story.comprehension_questions), `${label}: questions must be an array.`);
  for (const question of story.comprehension_questions ?? []) {
    requireCondition(Boolean(question.prompt?.trim()), `${label}/${question.id}: missing prompt.`);
    requireCondition(Array.isArray(question.choices) && question.choices.length >= 2, `${label}/${question.id}: too few choices.`);
    requireCondition(
      Number.isInteger(question.correct_index) && question.correct_index >= 0 && question.correct_index < question.choices.length,
      `${label}/${question.id}: correct index is out of range.`,
    );
  }

  requireCondition(story.sentence_building?.length >= 1, `${label}: missing sentence-building exercise.`);
  for (const exercise of story.sentence_building ?? []) {
    const sentence = story.sentences.find((candidate) => candidate.id === exercise.sentence_id);
    requireCondition(Boolean(sentence), `${label}/${exercise.id}: unknown sentence ${exercise.sentence_id}.`);
    requireCondition(exercise.answer === sentence?.text, `${label}/${exercise.id}: answer differs from source sentence.`);
    requireCondition(exercise.translation === sentence?.translation, `${label}/${exercise.id}: translation differs from source sentence.`);
    requireCondition(Array.isArray(exercise.prompt_tokens) && exercise.prompt_tokens.length >= 1, `${label}/${exercise.id}: missing prompt tokens.`);
  }

  requireCondition(story.provenance?.origin === 'melolingua-public-story-catalogue', `${label}: invalid provenance origin.`);
  requireCondition(story.provenance?.canonical_url === story.canonical_url, `${label}: provenance canonical mismatch.`);
  requireCondition(Boolean(story.provenance?.source_hash), `${label}: missing source hash.`);
  requireCondition(story.dataset_semantic_hash === semanticHash(story), `${label}: semantic hash is missing or stale.`);
  requireCondition(story.license === 'CC BY-NC 4.0', `${label}: unexpected data license.`);
}

for (const language of EXPECTED_LANGUAGES) {
  for (const level of EXPECTED_LEVELS) {
    const expected = EXPECTED_STORY_COUNTS[language][level];
    requireCondition(
      (matrix.get(`${language}:${level}`) ?? 0) === expected,
      `Expected ${expected} ${language}/${level} stories, found ${matrix.get(`${language}:${level}`) ?? 0}.`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Dataset validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Validated 118 public stories across 6 languages and CEFR A1-B2.');
