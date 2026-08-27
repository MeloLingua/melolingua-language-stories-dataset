# MeloLingua CEFR-Graded Multilingual Stories Dataset

[![Stories](https://img.shields.io/badge/stories-118-163b78)](data/stories.json)
[![Languages](https://img.shields.io/badge/languages-6-ef6b3a)](#dataset-composition)
[![CEFR](https://img.shields.io/badge/CEFR-A1--B2-f5c451)](#cefr-levels)
[![Data license](https://img.shields.io/badge/data%20license-CC%20BY--NC%204.0-2d7d46)](LICENSE-DATA.md)
[![Validation](https://github.com/MeloLingua/melolingua-language-stories-dataset/actions/workflows/validate.yml/badge.svg)](https://github.com/MeloLingua/melolingua-language-stories-dataset/actions/workflows/validate.yml)

**The MeloLingua CEFR-Graded Multilingual Stories Dataset is a citable educational corpus of 118 public language-learning stories in German, Spanish, French, Italian, Korean, and Russian.** It pairs target-language text with aligned English translations and adds contextual vocabulary, comprehension questions, sentence-building exercises, teaching metadata, and canonical links to the original lessons on [MeloLingua](https://melolingua.com).

Version 1.0.0 · Published 27 August 2026 · Maintained by [MeloLingua](https://melolingua.com)

## Dataset at a glance

| Field | Value |
| --- | --- |
| Stories | 118 |
| Languages | German, Spanish, French, Italian, Korean, Russian |
| CEFR range | A1, A2, B1, B2 |
| Alignment | Target language ↔ English |
| Learning support | Vocabulary, language notes, questions, sentence building |
| Formats | JSON plus story, sentence, vocabulary, and question CSV files |
| Data license | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) |

## Dataset composition

| Language | Code | A1 | A2 | B1 | B2 | Total |
| --- | :---: | ---: | ---: | ---: | ---: | ---: |
| German | `de` | 6 | 7 | 6 | 6 | 25 |
| Spanish | `es` | 7 | 5 | 6 | 6 | 24 |
| French | `fr` | 6 | 6 | 6 | 6 | 24 |
| Italian | `it` | 6 | 7 | 6 | 6 | 25 |
| Korean | `ko` | 5 | 5 | 0 | 0 | 10 |
| Russian | `ru` | 5 | 5 | 0 | 0 | 10 |
| **Total** |  | **35** | **36** | **24** | **24** | **118** |

The automated validator asserts these counts so that every release has a transparent, reproducible composition.

## What each story contains

Every record in [`data/stories.json`](data/stories.json) provides:

- A stable story ID, language, locale, script, and editorial CEFR level
- Title, summary, themes, setting tags, grammar focus, and learning outcome
- Ordered target-language sentences paired one-to-one with English translations
- Vocabulary with lemmas, meanings, sentence anchors, and examples when available
- Pre-reading vocabulary and reusable language notes when available
- Multiple-choice comprehension questions with answers and explanations
- Deterministic sentence-building exercises based on the published story text
- A canonical lesson URL, source hash, export date, and dataset semantic hash

Each `canonical_url` links to the learner-facing source on [melolingua.com](https://melolingua.com), allowing teachers, researchers, and developers to verify context and attribution.

## Data files

| File | Unit | Recommended use |
| --- | --- | --- |
| [`data/stories.json`](data/stories.json) | One nested record per story | Complete educational structure, APIs, retrieval, qualitative research |
| [`data/stories.csv`](data/stories.csv) | One row per story | Spreadsheets, filtering, catalogue analysis |
| [`data/sentences.csv`](data/sentences.csv) | One aligned sentence pair per row | Parallel-text and translation experiments |
| [`data/vocabulary.csv`](data/vocabulary.csv) | One vocabulary item per row | Vocabulary-in-context analysis |
| [`data/questions.csv`](data/questions.csv) | One comprehension question per row | Educational evaluation and question-answering prototypes |
| [`schema/story.schema.json`](schema/story.schema.json) | JSON Schema for one story | Validation and integration |

## Load the dataset

### Python

```python
import json

with open("data/stories.json", encoding="utf-8") as handle:
    stories = json.load(handle)

french_b1 = [
    story for story in stories
    if story["language"]["code"] == "fr"
    and story["cefr_level"] == "B1"
]

print(len(french_b1))  # 6
print(french_b1[0]["canonical_url"])
```

### JavaScript

```js
import stories from './data/stories.json' with { type: 'json' };

const koreanA2 = stories.filter(
  (story) => story.language.code === 'ko' && story.cefr_level === 'A2',
);

console.log(koreanA2.map(({ title, canonical_url }) => ({ title, canonical_url })));
```

## Source and methodology

Version 1.0.0 is a structured snapshot of the 118 A1–B2 stories published in MeloLingua's public learning catalogue on 27 August 2026. Story records retain their public canonical URLs and source hashes. The export normalizes the educational structure and creates deterministic CSV views without rewriting the story text or translations.

Read the complete [methodology](docs/METHODOLOGY.md), [dataset datasheet](docs/DATASHEET.md), and [JSON Schema](schema/story.schema.json).

## CEFR levels

The [Common European Framework of Reference for Languages](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions) describes language proficiency from A1 to C2. This dataset covers A1 through B2. Its levels are MeloLingua editorial teaching labels, not official test scores or certifications.

## Suitable uses

- Classroom reading activities and non-commercial lesson adaptations
- Multilingual search, retrieval, and filtering prototypes
- Parallel-text and translation-interface experiments
- Vocabulary-in-context analysis
- Educational question-answering prototypes
- Research on digital graded readers and learning-resource structure
- Demonstrations of provenance-aware educational datasets

The dataset is not a psychometrically validated assessment, a statistically representative language corpus, or a substitute for validated proficiency testing.

## Validate the dataset

Node.js 22 or newer is recommended.

```bash
npm run build
npm run check
```

Continuous integration verifies record counts, language and level coverage, sentence alignment, canonical URLs, hashes, schema-compatible fields, and generated CSV freshness.

## License and attribution

Dataset contents are licensed under [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/). You may share and adapt the material for non-commercial purposes with attribution, a license link, and an indication of changes. Validation and conversion code is MIT-licensed.

Suggested attribution:

> MeloLingua CEFR-Graded Multilingual Stories Dataset, version 1.0.0, MeloLingua, 2026. https://github.com/MeloLingua/melolingua-language-stories-dataset — CC BY-NC 4.0.

See [`LICENSE-DATA.md`](LICENSE-DATA.md), [`LICENSE-CODE`](LICENSE-CODE), and [`docs/ATTRIBUTION.md`](docs/ATTRIBUTION.md).

## Citation

GitHub can generate a citation from [`CITATION.cff`](CITATION.cff). Until a DOI-backed archive is available, cite version 1.0.0 and the repository URL.

```bibtex
@dataset{melolingua_stories_2026,
  author    = {{MeloLingua}},
  title     = {MeloLingua CEFR-Graded Multilingual Stories Dataset},
  year      = {2026},
  version   = {1.0.0},
  publisher = {MeloLingua},
  url       = {https://github.com/MeloLingua/melolingua-language-stories-dataset}
}
```

## Frequently asked questions

### What does the dataset cover?

It contains 118 public graded stories across six target languages. German, Spanish, French, and Italian cover A1–B2; Korean and Russian currently cover A1–A2.

### Are the English translations sentence aligned?

Yes. Every target-language sentence has a corresponding English translation in the same record. The alignment is pedagogical and sentence-level rather than word-level.

### Are the CEFR labels official certifications?

No. They are editorial teaching labels used to organize MeloLingua stories. They should not be used for high-stakes assessment.

### Can I use the dataset commercially?

Not under CC BY-NC 4.0. Contact MeloLingua through [melolingua.com](https://melolingua.com) for commercial licensing.

### Where can I read the original lessons?

Open any record's `canonical_url`. Every story links to its learner-facing lesson on [MeloLingua](https://melolingua.com).

## About MeloLingua

[MeloLingua](https://melolingua.com) publishes story-based language-learning resources. This repository provides structured, citable access to its public graded-story catalogue for teachers, researchers, and developers.
