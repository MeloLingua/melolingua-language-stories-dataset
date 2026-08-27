# Dataset and teaching methodology

## Purpose

The MeloLingua CEFR-Graded Multilingual Stories Dataset provides structured educational data for teachers, researchers, and developers. Version 1.0.0 contains the 118 A1–B2 stories published in MeloLingua's public learning catalogue on 27 August 2026.

## Source

Every record corresponds to a learner-facing story on [melolingua.com](https://melolingua.com). The dataset retains the canonical lesson URL, stable source identifier, source hash, and export date so that records can be traced to their published context.

## Transformation

The source educational material is normalized into a shared multilingual structure. The dataset process:

- preserves target-language text and sentence-aligned English translations;
- normalizes ordered lines into sentences with sequential IDs;
- maps vocabulary anchors to sentence IDs when an anchor is available;
- normalizes comprehension activities into a shared multiple-choice structure;
- creates deterministic sentence-building exercises from published lines;
- calculates a semantic hash over each educational record; and
- generates four deterministic CSV views from the canonical JSON.

The process does not generatively rewrite story text or translations.

## CEFR labels

CEFR levels are MeloLingua editorial classifications used to organize learner-facing stories. They are not official certifications or psychometric measurements. Version 1.0.0 covers A1–B2 using the level descriptions published by the [Council of Europe](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions).

## Translation and alignment

Target-language sentences are paired one-to-one with English translations from the published lesson. This pedagogical alignment supports close reading and interface research, but it is not word-level alignment or a professionally adjudicated reference corpus.

## Learning support

Vocabulary, pre-reading items, notes, and questions reflect the published lesson data. Sentence-building items are deterministic derivatives: tokens are rotated to create a reconstruction prompt while the original sentence and aligned translation remain the answer key.

## Reproducibility

The canonical JSON is committed under `data/`. The generated CSV views and integrity checks can be reproduced with Node.js 22 or newer:

```bash
npm run build
npm run check
```

Continuous integration checks the composition matrix, aligned text, canonical URLs, hashes, required fields, and generated-file freshness.
