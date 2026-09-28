# Proposed public-data Worker

`worker.mjs` is a reviewed-source candidate copied from the currently hosted Profile
Bridge and modified in this pull request. It has NOT replaced the live bridge yet.
The live source repository remains managed by Sites project
`appgprj_6aba38952d94819181bcf002a36980d8`.

Changes: allow official clans and user_religionBonuses; fresh uncached character
responses; one-minute in-isolate shared clan/rating data with request coalescing;
structured upstream error codes; size-bounded reads; text/plain JSON bug reports
without a browser preflight. Existing JSON report clients remain supported.

Allowed frontend origins remain the current GitHub Pages and original Site origins.
This is not an arbitrary URL proxy. D1 binding DB and existing bug_report tables are
required for actual report storage. The local regression test uses an in-memory
stub and cannot prove production storage health.

Rollout after review: publish the compatible backend first, confirm methods and
both report content types from the frontend origin, then release the frontend.
Rollback the frontend to main a93516fc06f53ebb2a1a17dbafc89b9fa05266a8 if needed;
server changes remain compatible with old clients. Preserve all existing report
rows and local saves. Do not expose credentials or copy production reports into
this public repository.
