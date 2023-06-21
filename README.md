# ares-registry

[![Build status](https://img.shields.io/github/actions/workflow/status/axios/axios/ci.yml?branch=v1.x&label=CI&logo=github&style=flat-square)](https://github.com/AdamSchinzel/ares-registry/blob/master/.github/workflows/npm-publish-github-packages.yml)

Node module for interacting with [the ARES Registry](https://wwwinfo.mfcr.cz/ares/ares_es.html.cz).

## Install and use the package

Install the package with your favorite package manager:

```bash
// with npm
npm i @adamschinzel/ares-registry

// with yarn
yarn add @adamschinzel/ares-registry

// with pnpm
pnpm i @adamschinzel/ares-registry
```

Then use it in your project (works only on server side):

```ts
import getCompanyData from '@adamschinzel/ares-registry';

// pass IČO as a parameter
const data = getCompanyData('63473291');
```

## Licence

[The MIT License](LICENSE)
