# Published public-data Worker

`worker.mjs` was copied from the hosted Profile Bridge and updated in this pull
request. It was published as Site version 9 on 28 September 2026, before the
frontend release. The live source repository remains managed by Sites project
`appgprj_6aba38952d94819181bcf002a36980d8`.

Changes: allow official clans and user_religionBonuses; fresh uncached character
responses; one-minute in-isolate shared clan/rating data with request coalescing;
structured upstream error codes; size-bounded reads; text/plain JSON bug reports
without a browser preflight. Existing JSON report clients remain supported.

Allowed frontend origins remain the current GitHub Pages and original Site origins.
This is not an arbitrary URL proxy. D1 binding DB and existing bug_report tables are
required for actual report storage. Both tables were observed in the live DB;
the deployed-server smoke test received a matching 201 receipt for one synthetic
report. The local regression test additionally uses an in-memory stub.

The backend was deployed and its official methods, CORS and text/plain report
storage passed [run 36466589988](https://github.com/emp1resin/chaosinventory/actions/runs/36466589988).
The remaining rollout is to release the frontend and test it from a player's network.
Rollback the frontend to main a93516fc06f53ebb2a1a17dbafc89b9fa05266a8 if needed;
server changes remain compatible with old clients. Preserve all existing report
rows and local saves. Do not expose credentials or copy production reports into
this public repository.
