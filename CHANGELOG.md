# Changelog

## [3.3.4](https://github.com/eslint/eslintrc/compare/eslintrc-v3.3.3...eslintrc-v3.3.4) (2026-02-22)


### Bug Fixes

* update `ajv` to `6.14.0` to address security vulnerabilities ([#221](https://github.com/eslint/eslintrc/issues/221)) ([9139140](https://github.com/eslint/eslintrc/commit/9139140aece172fa4c11a466c493609be31cfa54))
* update `minimatch` to `3.1.3` to address security vulnerabilities ([#224](https://github.com/eslint/eslintrc/issues/224)) ([30339d0](https://github.com/eslint/eslintrc/commit/30339d036361c13362d5a38191bb2388ad56bb6f))

## [3.3.3](https://github.com/eslint/eslintrc/compare/eslintrc-v3.3.2...eslintrc-v3.3.3) (2025-11-28)


### Bug Fixes

* release v3.3.3 because publishing v3.3.2 failed ([#211](https://github.com/eslint/eslintrc/issues/211)) ([8aa555a](https://github.com/eslint/eslintrc/commit/8aa555a3f5fcfb7d99249fb57e819a7b6f635496))

## [3.3.2](https://github.com/eslint/eslintrc/compare/eslintrc-v3.3.1...eslintrc-v3.3.2) (2025-11-25)


### Bug Fixes

* Remove name property from all and recommended configs ([#200](https://github.com/eslint/eslintrc/issues/200)) ([344da49](https://github.com/eslint/eslintrc/commit/344da491898a2a3595943d4528ba78fe2f238217))

## [3.3.1](https://github.com/eslint/eslintrc/compare/v3.3.0...v3.3.1) (2025-03-11)


### Bug Fixes

* correct `types` field in package.json ([#184](https://github.com/eslint/eslintrc/issues/184)) ([2f4cf3f](https://github.com/eslint/eslintrc/commit/2f4cf3fe36ee0df93c1c53f32c030c58db1816a2))

## [3.3.0](https://github.com/eslint/eslintrc/compare/v3.2.0...v3.3.0) (2025-02-21)


### Features

* Add types to package ([#179](https://github.com/eslint/eslintrc/issues/179)) ([cb546be](https://github.com/eslint/eslintrc/commit/cb546be8ba53abcb4c64ed2fdd3a729dd1337f61))

## [3.2.0](https://github.com/eslint/eslintrc/compare/v3.1.0...v3.2.0) (2024-11-14)


### Features

* merge rule.meta.defaultOptions before validation ([#166](https://github.com/eslint/eslintrc/issues/166)) ([d02f914](https://github.com/eslint/eslintrc/commit/d02f91452b81caff971f7895237cc4fb002e31da))

## [3.1.0](https://github.com/eslint/eslintrc/compare/v3.0.2...v3.1.0) (2024-05-17)


### Features

* Expose loadConfigFile() function ([#160](https://github.com/eslint/eslintrc/issues/160)) ([59e890f](https://github.com/eslint/eslintrc/commit/59e890fcd9e03663ac185640d5bed5f1a85bd39b))


### Chores

* run tests in Node.js 22 ([#154](https://github.com/eslint/eslintrc/issues/154)) ([5e526f2](https://github.com/eslint/eslintrc/commit/5e526f2e2897b87d7a704391cec74702d4bed38c))
* update dependency shelljs to ^0.8.5 ([#156](https://github.com/eslint/eslintrc/issues/156)) ([903b887](https://github.com/eslint/eslintrc/commit/903b8875581ee731fd1a9424f83f785359cfb22e))

## [3.0.2](https://github.com/eslint/eslintrc/compare/v3.0.1...v3.0.2) (2024-02-12)


### Chores

* maintenance update of `globals` to `v14` ([#152](https://github.com/eslint/eslintrc/issues/152)) ([4151865](https://github.com/eslint/eslintrc/commit/4151865b09084369e89d591eb2e01b9617287982))

## [3.0.1](https://github.com/eslint/eslintrc/compare/v3.0.0...v3.0.1) (2024-02-09)


### Documentation

* fix changelog for v3.0.0 ([#144](https://github.com/eslint/eslintrc/issues/144)) ([a613847](https://github.com/eslint/eslintrc/commit/a61384731aff386a8260a80d9710c912e4f62aaa))
* More explicit about all and recommended configs ([#150](https://github.com/eslint/eslintrc/issues/150)) ([0fabc74](https://github.com/eslint/eslintrc/commit/0fabc7406e5a281a4e72be33de6e3bf8642aa746))


### Chores

* upgrade espree@10.0.1 ([#151](https://github.com/eslint/eslintrc/issues/151)) ([8c39944](https://github.com/eslint/eslintrc/commit/8c399441f47009344888e181c6aa2ecdc74ce8ea))

## [3.0.0](https://github.com/eslint/eslintrc/compare/v2.1.4...v3.0.0) (2023-12-27)


### ⚠ BREAKING CHANGES

* Require Node.js `^18.18.0 || ^20.9.0 || >=21.1.0` ([#142](https://github.com/eslint/eslintrc/issues/142))
* Set default `schema: []`, drop support for function-style rules ([#139](https://github.com/eslint/eslintrc/issues/139))

### Features

* Require Node.js `^18.18.0 || ^20.9.0 || >=21.1.0` ([#142](https://github.com/eslint/eslintrc/issues/142)) ([737eb25](https://github.com/eslint/eslintrc/commit/737eb25ac686550020b838ccf6efd5cd2aaa449e))
* Set default `schema: []`, drop support for function-style rules ([#139](https://github.com/eslint/eslintrc/issues/139)) ([a6c240d](https://github.com/eslint/eslintrc/commit/a6c240de244b0e94ace4a518f2c67876a91f5882))


### Chores

* upgrade github actions ([#143](https://github.com/eslint/eslintrc/issues/143)) ([de34faf](https://github.com/eslint/eslintrc/commit/de34fafed28aaf1936845d51309f28484ed29e2f))

## [2.1.4](https://github.com/eslint/eslintrc/compare/v2.1.3...v2.1.4) (2023-11-27)


### Bug Fixes

* Use original plugin from disk in FlatCompat ([#137](https://github.com/eslint/eslintrc/issues/137)) ([1c4cf6a](https://github.com/eslint/eslintrc/commit/1c4cf6a71378d480323bfdd404c9585bd0d21d65))

## [2.1.3](https://github.com/eslint/eslintrc/compare/v2.1.2...v2.1.3) (2023-11-01)


### Documentation

* Add CommonJS example to README ([#134](https://github.com/eslint/eslintrc/issues/134)) ([ad511f8](https://github.com/eslint/eslintrc/commit/ad511f80971301199b74973fef196c8f6ebd36bc)), closes [#133](https://github.com/eslint/eslintrc/issues/133)


### Chores

* run tests in Node.js 21 ([#130](https://github.com/eslint/eslintrc/issues/130)) ([3b386f7](https://github.com/eslint/eslintrc/commit/3b386f790119553fb0d800b65454abf89b56a7aa))

## [2.1.2](https://github.com/eslint/eslintrc/compare/v2.1.1...v2.1.2) (2023-08-05)


### Bug Fixes

* Ensure environments in overrides respect files patterns ([#126](https://github.com/eslint/eslintrc/issues/126)) ([6745421](https://github.com/eslint/eslintrc/commit/67454216a9dc4ecb850fd80d67ae39cf5799986d)), closes [#125](https://github.com/eslint/eslintrc/issues/125)


### Chores

* Remove add-to-triage ([#123](https://github.com/eslint/eslintrc/issues/123)) ([6827766](https://github.com/eslint/eslintrc/commit/6827766123137592b13c16c2ddd241fea42aae10))
* standardize npm script names ([#122](https://github.com/eslint/eslintrc/issues/122)) ([6cfa046](https://github.com/eslint/eslintrc/commit/6cfa0466c192f5c2aff1cdf9554836acd4fcce68))

## [2.1.1](https://github.com/eslint/eslintrc/compare/v2.1.0...v2.1.1) (2023-07-27)


### Chores

* Add PRs to triage ([#121](https://github.com/eslint/eslintrc/issues/121)) ([b3c2d70](https://github.com/eslint/eslintrc/commit/b3c2d70fff4134c6602ad10257776db45281817c))
* generate provenance statements when release ([#119](https://github.com/eslint/eslintrc/issues/119)) ([584cf79](https://github.com/eslint/eslintrc/commit/584cf79777fbb15147e929c7eeea6f7a56c485b5))

## [2.1.0](https://github.com/eslint/eslintrc/compare/v2.0.3...v2.1.0) (2023-06-30)


### Features

* add `es2023` and `es2024` environments ([#116](https://github.com/eslint/eslintrc/issues/116)) ([14ddd36](https://github.com/eslint/eslintrc/commit/14ddd3630843485f8f29f4b0402891a26f9fcf9b))


### Chores

* upgrade espree@9.6.0 ([#118](https://github.com/eslint/eslintrc/issues/118)) ([2d346d5](https://github.com/eslint/eslintrc/commit/2d346d5b0d926a9388c5a08adebfd218b1f48253))

## [2.0.3](https://github.com/eslint/eslintrc/compare/v2.0.2...v2.0.3) (2023-05-05)


### Chores

* run tests on Node.js v20 ([#108](https://github.com/eslint/eslintrc/issues/108)) ([86282a2](https://github.com/eslint/eslintrc/commit/86282a25a6b4411b3cdd90967956b121f17f04a7))
* set up release-please ([#111](https://github.com/eslint/eslintrc/issues/111)) ([3965c0b](https://github.com/eslint/eslintrc/commit/3965c0ba9994a0529caa4b17623ca8dae769068c))
* upgrade espree@9.5.2 ([#113](https://github.com/eslint/eslintrc/issues/113)) ([a17cd0a](https://github.com/eslint/eslintrc/commit/a17cd0af447286f66ecff26d2cd75413d15426fb))

v2.0.2 - March 28, 2023

* [`e5f9e7e`](https://github.com/eslint/eslintrc/commit/e5f9e7e58c955e879527368905e99e6bc2d971f9) chore: upgrade espree@9.5.1 (#106) (Milos Djermanovic)

v2.0.1 - March 10, 2023

* [`5ccb30c`](https://github.com/eslint/eslintrc/commit/5ccb30c229624dd06449570217949a65b9539d21) chore: upgrade espree@9.5.0 (#104) (Milos Djermanovic)

v2.0.0 - February 25, 2023

* [`013bdf3`](https://github.com/eslint/eslintrc/commit/013bdf3da1cd1509592d6df0dfed031608c23a7c) feat!: Require eslint:all and eslint:recommended as parameters. (#103) (Nicholas C. Zakas)
* [`f7d0f33`](https://github.com/eslint/eslintrc/commit/f7d0f33b30b3839800df046df1f5139941cdbd1a) chore: Add triage action (#101) (Nicholas C. Zakas)

v1.4.1 - December 30, 2022

* [`5be711e`](https://github.com/eslint/eslintrc/commit/5be711e4e81734f79c62cb9781921a9068de1c54) fix: Update FlatCompat docs + typings to reflect Array (#99) (Wes Bos)

v1.4.0 - December 16, 2022

* [`89c504f`](https://github.com/eslint/eslintrc/commit/89c504f216298b8aafc55371a9e75b2e2d4cac40) feat: update globals (#98) (Sébastien Règne)
* [`5438c6b`](https://github.com/eslint/eslintrc/commit/5438c6ba1e01fdfb02a7f09fafb73e6dabe31c2d) ci: add Node v19 (#96) (Milos Djermanovic)

v1.3.3 - October 7, 2022

* [`adafd11`](https://github.com/eslint/eslintrc/commit/adafd114292684d522c1119f3aef55be717e94cf) docs: Update README (#92) (Nicholas C. Zakas)
* [`56755d9`](https://github.com/eslint/eslintrc/commit/56755d9fea0abe43ff8c419a40950289132d96d4) chore: cascading-config-array: createBaseConfigArray not expect resolver (#95) (coderaiser)

v1.3.2 - September 12, 2022

* [`2a2bef1`](https://github.com/eslint/eslintrc/commit/2a2bef144e9b5ef0fbf780abae0890e0c1f9d23a) fix: Plugins should always use the same reference (#91) (Nicholas C. Zakas)

v1.3.1 - August 26, 2022

* [`495af93`](https://github.com/eslint/eslintrc/commit/495af93c1b2954824de02bd85ea9a822942d5c0d) chore: Upgrade to espree@9.4.0 (#87) (Milos Djermanovic)
* [`2632367`](https://github.com/eslint/eslintrc/commit/263236717bd0802ab36c44af475e25189fc2be0b) docs: Update README with FlatCompat options (#86) (Nicholas C. Zakas)
* [`ffba0c5`](https://github.com/eslint/eslintrc/commit/ffba0c5fa698e01e5d377896bd198218ceccb543) ci: update github actions (#85) (Amaresh  S M)
* [`9ff004e`](https://github.com/eslint/eslintrc/commit/9ff004e30687c35502ca600b5dce77ce1e89948d) chore: add funding field (#84) (Amaresh  S M)

v1.3.0 - May 20, 2022

* [`aefa2a7`](https://github.com/eslint/eslintrc/commit/aefa2a749eeab1d2b872824d2de952e97bc7aa4f) feat: update globals (#81) (Milos Djermanovic)

v1.2.3 - May 6, 2022

* [`c9047b4`](https://github.com/eslint/eslintrc/commit/c9047b4fcf7fe34b89066623df61db03656b2d39) chore: Upgrade espree@9.3.2 (#80) (Milos Djermanovic)
* [`baf145f`](https://github.com/eslint/eslintrc/commit/baf145f88deace39cc8a91eb7e20ea06ac49f028) chore: bump version of minimatch due to security issue PRISMA-2022-0039 (#76) (Jan Opravil)
* [`44415d3`](https://github.com/eslint/eslintrc/commit/44415d36197742e9efaf9d41cf3d1c7eb2645f98) chore: update license copyright (#79) (唯然)

v1.2.2 - April 22, 2022

* [`18b15ac`](https://github.com/eslint/eslintrc/commit/18b15ac0b0150ad0a4f69e61319e5adaea83a9c7) fix: use custom Rollup plugin for `import.meta.url` (#77) (Milos Djermanovic)
* [`a6e12e4`](https://github.com/eslint/eslintrc/commit/a6e12e4c7545cc7e091f577f644c4bf1f5d61dd7) build: add node v18 (#78) (唯然)

v1.2.1 - March 11, 2022

* [`98fb12d`](https://github.com/eslint/eslintrc/commit/98fb12d106f7f76132e64bce08aea4b79b45208f) chore: upgrade `ignore` to `v5.2.0` (#72) (Nitin Kumar)

v1.2.0 - February 25, 2022

* [`9b71981`](https://github.com/eslint/eslintrc/commit/9b719813fc6f023b722168a4f67d895106e875ce) feat: Avoid dirname for built-in configs (#71) (DoZerg)

v1.1.0 - February 11, 2022

* [`0f17fb1`](https://github.com/eslint/eslintrc/commit/0f17fb1077834f873bb31de950aa6eec38a0f8f3) chore: Upgrade to espree@9.3.1 (#69) (Milos Djermanovic)
* [`33b8ee7`](https://github.com/eslint/eslintrc/commit/33b8ee7edbe3c85eda04af8896db71021f172be5) feat: add esN envs for all post-es6 years (#68) (Jordan Harband)
* [`bc097b6`](https://github.com/eslint/eslintrc/commit/bc097b63ab66a2ebeaa18870c3acab52d63f4e75) chore: upgrade espree@9.3.0 (#65) (Gustavo Santana)

v1.0.5 - December 3, 2021

* [`870810a`](https://github.com/eslint/eslintrc/commit/870810a37804ab9a2e758529b2fd2325c2860950) chore: upgrade espree@9.2.0 (#64) (Milos Djermanovic)

v1.0.4 - November 5, 2021

* [`f0b528b`](https://github.com/eslint/eslintrc/commit/f0b528b91b741aa4b95f276e9ad81683366144fd) build: upgrade eslint-release to v3.2.0 to support conventional commits (#62) (Milos Djermanovic)
* [`731fa49`](https://github.com/eslint/eslintrc/commit/731fa4993e3b37d703cf2ba4f03429f89ae6e0a2) chore: update `js-yaml` dependency (#61) (Nitin Kumar)
* [`b657cea`](https://github.com/eslint/eslintrc/commit/b657ceafd64f2d5842b5c2d3d660cfd57660cd06) Build: add node v17 (#58) (唯然)

v1.0.3 - October 13, 2021

* [`6b5fc8b`](https://github.com/eslint/eslintrc/commit/6b5fc8b248aa66958ba0c1b05d402c3e509e3098) Fix: add `universal` export to root (#57) (Simen Bekkhus)

v1.0.2 - October 9, 2021

* [`347fe40`](https://github.com/eslint/eslintrc/commit/347fe4003226d35dac144d1f3e7efc5c4d4a6065) Build: Don't freeze Rollup output (#56) (Nicholas C. Zakas)
* [`3b8ae43`](https://github.com/eslint/eslintrc/commit/3b8ae43b32bbe08311a7de0b81bf1219c7cd52d7) Chore: ignore package manager lock files (#55) (Nitin Kumar)

v1.0.1 - September 10, 2021

* [`f2e2c33`](https://github.com/eslint/eslintrc/commit/f2e2c3374a810967d233b1ccd7b2e65cf27bc1e0) Upgrade: espree@9.0.0 (#54) (Milos Djermanovic)
* [`c5d4919`](https://github.com/eslint/eslintrc/commit/c5d49193a30b97e8c6bb2ad6306ee816afe8b3cc) Fix: ConfigArrayFactory was ignoring the resolver option in some places (#53) (Stéphane Goetz)

v1.0.0 - August 6, 2021

* [`aaf282e`](https://github.com/eslint/eslintrc/commit/aaf282e3b58636e9b66a58c2355fff671a8a9067) Update: Add /universal entrypoint (fixes #50) (#51) (Nicholas C. Zakas)
* [`3c6cfe6`](https://github.com/eslint/eslintrc/commit/3c6cfe6e1b749389c722eefb7fd25c93da3bb669) Upgrade: debug@4.3.2 (#52) (Milos Djermanovic)
* [`3983fde`](https://github.com/eslint/eslintrc/commit/3983fde4443b4d144c7ff6ff6231172cf28bb283) Upgrade: Espree (fixes #41) (#49) (Nicholas C. Zakas)
* [`7e5e4e5`](https://github.com/eslint/eslintrc/commit/7e5e4e5391ba7aea4f8fb61db27f4d679e517bd8) Update: Export environments (#46) (Nicholas C. Zakas)
* [`348e889`](https://github.com/eslint/eslintrc/commit/348e889240e94259c90eadf3256fda66b8ba2f6d) Chore: Use actions/setup-node@v2 (#47) (薛定谔的猫)
* [`bbcef88`](https://github.com/eslint/eslintrc/commit/bbcef88391972f6761d21bbe7d3524232cecbac7) Breaking: drop node v10/v13/v15 (refs eslint/eslint#14023) (#37) (薛定谔的猫)
* [`bdce01a`](https://github.com/eslint/eslintrc/commit/bdce01aad747393d13cd1ae17d8280e54c9c5191) Breaking: Switch to ESM (fixes #35) (#39) (Brett Zamir)

v0.4.3 - July 17, 2021

* [`ce78027`](https://github.com/eslint/eslintrc/commit/ce78027f6a319a29fdf0b78ac1e7071373acffc4) Fix: ensure config files are files (#42) (Tom Jenkinson)
* [`95b1c9b`](https://github.com/eslint/eslintrc/commit/95b1c9b30267479a75cd07768f8f9e9cfa63c105) Chore: pin fs-teardown@0.1.1 (#45) (Milos Djermanovic)
* [`593fbe3`](https://github.com/eslint/eslintrc/commit/593fbe3c2c1c5f723f71810963ed21a56caed4c1) Chore: fix failing test (#44) (Tom Jenkinson)

v0.4.2 - June 4, 2021

* [`cc79a4d`](https://github.com/eslint/eslintrc/commit/cc79a4db45a2ca0236a846ed8eba28eea07d4db5) Upgrade: update globals to version 13.6 (#32) (Rouven Weßling)

v0.4.1 - May 7, 2021

* [`aa38ef4`](https://github.com/eslint/eslintrc/commit/aa38ef40c3123f8f534c7f9b0b7c306f5f011dce) Fix: Properly export module resolver (#34) (Richie Bendall)
* [`62ea4bd`](https://github.com/eslint/eslintrc/commit/62ea4bd74b78fbeff12ffb21f1f978817601d4d1) Build: add node v16 (#33) (薛定谔的猫)
* [`7c43d77`](https://github.com/eslint/eslintrc/commit/7c43d7784e39cf0b7b102af64f703cade11252bb) Chore: add tests for built-in rules config schema validation (fixes #15) (#31) (Milos Djermanovic)
* [`d8ea601`](https://github.com/eslint/eslintrc/commit/d8ea601ecb4b9f81cdc332b012b6b1bbc984366c) Chore: Test on Node 15.x (#30) (Milos Djermanovic)
* [`0b2f80d`](https://github.com/eslint/eslintrc/commit/0b2f80d6f6b33e4c5e168b08468867653f726754) Chore: lint test files (#18) (Milos Djermanovic)

v0.4.0 - February 27, 2021

* [`d9a527b`](https://github.com/eslint/eslintrc/commit/d9a527bdb16af46a28d37fa9022131149970a438) New: Implement DotCompat class (#20) (Nicholas C. Zakas)
* [`dac76c0`](https://github.com/eslint/eslintrc/commit/dac76c035a9ab9d315050f688867373966aab288) Chore: Replace usage of lodash with cache set (#29) (Tim van der Lippe)
* [`3ae2d77`](https://github.com/eslint/eslintrc/commit/3ae2d770cb810c026de817e6861e25dac111da9f) Update: add AggregateError global to es2021 environment (#28) (Milos Djermanovic)

v0.3.0 - January 15, 2021

* [`5184490`](https://github.com/eslint/eslintrc/commit/51844902bc4132f264f05a0614f2cdeb89290f68) Upgrade: lodash@4.17.20 (#24) (Milos Djermanovic)
* [`f1179c5`](https://github.com/eslint/eslintrc/commit/f1179c587ae09fabb5c3402598363cfcec2494f7) Update: Implement missing functionality from ESLint port (fixes #12) (#23) (Nicholas C. Zakas)

v0.2.2 - December 5, 2020

* [`1746840`](https://github.com/eslint/eslintrc/commit/17468407c1baf05747cb261c91f7f7b7c2a82422) Fix: include loadRules in internalSlotsMap cache (#19) (Henry Q. Dineen)
* [`f30bb49`](https://github.com/eslint/eslintrc/commit/f30bb4935aaf3f4c1b268490da495a59647e58d8) Chore: Test fixes for CascadingConfigArrayFactory (#17) (Nicholas C. Zakas)
* [`4440df8`](https://github.com/eslint/eslintrc/commit/4440df8237a127e15cbde5c697353e1224f12ec1) Chore: Fix config-array tests (#16) (Nicholas C. Zakas)
* [`7890e02`](https://github.com/eslint/eslintrc/commit/7890e027df530a0fb53bcf5751c8c7a008b2a494) Chore: Test fixes for config-array-factory.js (#13) (Nicholas C. Zakas)

v0.2.1 - October 26, 2020

* [`8b202ff`](https://github.com/eslint/eslintrc/commit/8b202ff866a39efdaad6394fde9f88372afbfca8) Fix: validate schema for built-in rules (#14) (Milos Djermanovic)
* [`04f3cae`](https://github.com/eslint/eslintrc/commit/04f3cae17fe07b2fd0b74fd3e88482b3094e75e3) Fix: cache compiled config schema (#9) (Milos Djermanovic)

v0.2.0 - October 16, 2020

* [`cb12255`](https://github.com/eslint/eslintrc/commit/cb12255b85390e932e1942e479c2c97310149390) Update: Allow eslint:all and eslint:recommended paths to be passed in (#11) (Nicholas C. Zakas)
* [`a75bacd`](https://github.com/eslint/eslintrc/commit/a75bacd9a743a7bbcdb8c59e5d4f9de3dc8b0f20) Chore: use GitHub Actions (#10) (Milos Djermanovic)

v0.1.3 - September 1, 2020

* [`8647a61`](https://github.com/eslint/eslintrc/commit/8647a61991fe121f923d33e96232475209b78210) Fix: version number and eslint-release version (refs #6) (Nicholas C. Zakas)
