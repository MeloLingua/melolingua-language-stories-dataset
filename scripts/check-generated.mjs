import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import {
  buildQuestionCsv,
  buildSentenceCsv,
  buildStoryCsv,
  buildVocabularyCsv,
} from './build-csv.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stories = JSON.parse(await readFile(join(repositoryRoot, 'data', 'stories.json'), 'utf8'));
const expected = {
  'stories.csv': buildStoryCsv(stories),
  'sentences.csv': buildSentenceCsv(stories),
  'vocabulary.csv': buildVocabularyCsv(stories),
  'questions.csv': buildQuestionCsv(stories),
};
const stale = [];

for (const [fileName, content] of Object.entries(expected)) {
  const actual = await readFile(join(repositoryRoot, 'data', fileName), 'utf8').catch(() => null);
  if (actual !== content) stale.push(fileName);
}

if (stale.length > 0) {
  console.error(`Generated data is stale or missing: ${stale.join(', ')}. Run npm run build.`);
  process.exit(1);
}

console.log('All generated CSV views match the canonical JSON.');
