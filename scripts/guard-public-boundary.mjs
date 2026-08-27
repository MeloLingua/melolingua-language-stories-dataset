import { lstat, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, relative, resolve } from 'node:path';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const expectedStoryKeys = new Set([
  'id', 'dataset_version', 'title', 'subtitle', 'language', 'cefr_level',
  'canonical_url', 'summary', 'reading_minutes', 'word_count', 'themes',
  'setting_tags', 'grammar_focus', 'communicative_outcome', 'target_phrases',
  'sentences', 'vocabulary', 'pre_reading_vocabulary', 'language_notes',
  'comprehension_questions', 'sentence_building', 'provenance',
  'dataset_semantic_hash', 'license',
]);
const expectedProvenanceKeys = new Set([
  'origin', 'source_story_id', 'source_hash', 'canonical_url', 'exported_at',
]);
const secretPatterns = [
  /\bgh[opsu]_[A-Za-z0-9]{20,}\b/g,
  /\bhf_[A-Za-z0-9]{20,}\b/g,
  /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  /-----BEGIN [A-Z0-9 ]+ KEY-----/g,
];

function checkExactKeys(value, expectedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label}: expected an object.`);
    return;
  }

  const actualKeys = Object.keys(value);
  for (const key of actualKeys) {
    if (!expectedKeys.has(key)) errors.push(`${label}: unexpected exported field ${key}.`);
  }
  for (const key of expectedKeys) {
    if (!(key in value)) errors.push(`${label}: missing required field ${key}.`);
  }
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const absolutePath = join(directory, entry.name);
    const stat = await lstat(absolutePath);
    const displayPath = relative(repositoryRoot, absolutePath);
    if (stat.isSymbolicLink()) {
      errors.push(`${displayPath}: symbolic links are not allowed in the dataset repository.`);
      continue;
    }
    if (entry.isDirectory()) {
      await walk(absolutePath);
      continue;
    }
    if (stat.size > 5_000_000) {
      errors.push(`${displayPath}: unexpected file larger than 5 MB.`);
      continue;
    }
    if (/\.(?:json|md|mjs|js|yml|yaml|cff|txt|csv)$/i.test(entry.name) || basename(absolutePath).startsWith('LICENSE')) {
      const fileText = await readFile(absolutePath, 'utf8');
      for (const pattern of secretPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(fileText)) errors.push(`${displayPath}: possible secret detected.`);
      }
    }
  }
}

const stories = JSON.parse(await readFile(join(repositoryRoot, 'data', 'stories.json'), 'utf8'));
for (const story of stories) {
  checkExactKeys(story, expectedStoryKeys, story.id ?? '<missing-id>');
  checkExactKeys(story.provenance, expectedProvenanceKeys, `${story.id ?? '<missing-id>'}.provenance`);

  if (story.provenance?.origin !== 'melolingua-public-story-catalogue') {
    errors.push(`${story.id}: invalid public-catalogue origin.`);
  }
  if (!story.canonical_url?.startsWith('https://melolingua.com/learn-')) {
    errors.push(`${story.id}: canonical URL must point to a public MeloLingua learning page.`);
  }
  if (story.provenance?.canonical_url !== story.canonical_url) {
    errors.push(`${story.id}: provenance canonical URL does not match the story URL.`);
  }
}

await walk(repositoryRoot);

if (errors.length > 0) {
  console.error(`Public-data guard failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Public-data guard passed for ${stories.length} records.`);
