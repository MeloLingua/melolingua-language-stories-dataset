# Release checklist

## Public data

- [x] Every record links to a public MeloLingua learning page
- [x] Record fields match the published JSON Schema
- [x] Provenance contains canonical URLs, source identifiers, hashes, and dates
- [x] Repository files pass the secret and integrity guard

## Data integrity

- [x] 118 unique stories are present
- [x] Language and CEFR counts match the release matrix
- [x] Target-language and English sentence pairs are non-empty
- [x] Question answer indexes are valid
- [x] Source hashes and dataset semantic hashes are present
- [x] JSON and all four CSV views match
- [x] `npm run check` passes

## Metadata and discoverability

- [x] README starts with a direct dataset definition and current statistics
- [x] Language-level composition is machine- and human-readable
- [x] Source, methodology, limits, provenance, license, and attribution are explicit
- [x] Repository links to https://melolingua.com
- [x] `CITATION.cff`, `.zenodo.json`, dataset cards, and changelog use version 1.0.0
- [ ] Zenodo DOI added after archival

## Distribution

- [x] GitHub repository public
- [ ] Hugging Face dataset uploaded and viewer verified
- [ ] Zenodo archive and DOI verified
- [ ] Kaggle dataset uploaded with correct license
- [ ] Educator-directory listings submitted
