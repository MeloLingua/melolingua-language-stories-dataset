# Dataset datasheet

## Dataset identity

- Name: MeloLingua CEFR-Graded Multilingual Stories Dataset
- Version: 1.0.0
- Release date: 2026-08-27
- Maintainer: MeloLingua
- Website: https://melolingua.com
- Repository: https://github.com/MeloLingua/melolingua-language-stories-dataset
- Data license: CC BY-NC 4.0

## Motivation

Language-learning stories are often published as web lessons but are harder to cite, filter, and study as structured educational material. This dataset makes MeloLingua's public graded-story catalogue available as aligned, provenance-aware records.

## Composition

- 118 stories
- 6 target languages: German, Spanish, French, Italian, Korean, Russian
- 4 editorial CEFR bands: A1, A2, B1, B2
- 35 A1 stories, 36 A2 stories, 24 B1 stories, and 24 B2 stories
- Sentence-aligned English translations for every story

The primary unit is one story. Secondary units are aligned sentence pairs, vocabulary entries, comprehension questions, and sentence-building exercises.

## Collection and preprocessing

The records are structured from lessons published in MeloLingua's public learning catalogue. The process normalizes fields and generates deterministic JSON and CSV representations without changing the story text or translations.

## Intended uses

- Non-commercial classroom materials and lesson adaptations
- Qualitative graded-reader research
- Multilingual search and retrieval prototypes
- Parallel-text interface experiments
- Vocabulary-in-context analysis
- Educational question-answering prototypes
- Dataset provenance and schema examples

## Uses requiring caution

- CEFR benchmarking: labels are editorial and not official certifications
- Automated scoring: questions are lesson activities, not validated assessment items
- Translation evaluation: alignments are pedagogical, not adjudicated references
- Cross-script comparison: whitespace word counts behave differently across scripts
- Model training: users must determine whether their use complies with CC BY-NC 4.0

## Known limitations

- Korean and Russian currently cover A1 and A2 only.
- English is the only aligned translation language.
- Some records contain more learning metadata than others.
- The corpus reflects MeloLingua's editorial catalogue rather than a statistically sampled language population.

## Maintenance

Corrections and releases are recorded in `CHANGELOG.md`. Each record includes a source hash and a dataset semantic hash. Meaningful changes to text or annotations produce a new semantic hash and should be released as a new version.
