# Vanguard Conventions

## Workload

### Task states
- `Backlog` → not ready / not prioritized
- `Ready` → fully defined, can be picked up
- `In Progress` → being worked on
- `Blocked` → waiting on external dependency (must include blocker note)
- `In Review` → PR opened, waiting for CR
- `QA` → validated in staging (or locally if no staging)
- `Done` → merged + deployed (or scheduled), verified

### Definition of Ready (DoR)

#### A task can move to Ready only if it has:
- Clear goal and acceptance criteria
- Expected inputs/outputs (API contract if relevant)
- Any design / UX reference (Figma, screenshot, text spec)
- Known dependencies listed (service, table, event, permission, etc.)

### Definition of Done (DoD)

#### A task is Done only if:
- Code is merged to main (or release branch)
- Tests pass (unit/integration where applicable)
- Lint/typecheck passes
- Feature is verified (local + staging when possible)
- Observability added when relevant (logs/metrics/traces)
- Docs/README updated if behavior changed
- No critical TODOs left in code

#### Estimation
- Use t-shirt sizes:
- `S (≤3 hours)`, `M (3–6 hours)`, `L (up to a day)`, `XL (needs splitting)`
- Any task bigger than L must be split.

#### Ownership
- Every task must have:
    - Owner (single person)
    - Reviewer (single person)

## Github
### Branches
- Branches names should follow this pattern `service/<type>/branch-name`
- \<type\> should one of thoes:
    * `feature`: For new functionality or feature development.
    * `bugfix`: For fixing bugs in existing features.
    * `hotfix`: For urgent fixes that must be applied immediately to production.
    * `refactor`: For code improvements or restructuring without changing functionality.
    * `docs`: For documentation-only changes.
    * `chore`: For routine maintenance tasks, dependency updates, etc..
    * `test`: For adding or modifying tests.

### Commits
- Commits are similar to branches, just use the pattern `<type>: commit message`
- Make sure you divide to small commits, your commit shouldn't be more than 250 changes.

### PR
#### Open a PR only when:
- Task is marked Done (implementation done)
- You tested it and you believe it’s production-ready
- CI is passing or clearly explain why it isn’t


#### PR title
`[service] <type>: short description`
- Example: [vitals] feat: add some madar

#### PR description must include
- What changed + why
- How to test (exact steps)
- Risk/impact notes
- Screenshots/video (if UI)
- Linked issue/task (From Jira)

#### PR size rule
- Prefer PRs under 400–600 lines changed
- If larger: justify and/or split

#### Approval rule
- At least 1 approval for low-risk changes
- At least 2 approvals for high-risk areas:
    * data migrations, gateways, infra

Merge strategy
- Default: `Squash merge` (clean history)
- Exceptions: long-running feature branches with meaningful commits → rebase+merge (team decision)
### CR
#### Reviewer responsibilities

##### Reviewer must validate:
- Correctness (logic, edge cases)
- Security (authz/authn, injection, secrets)
- Performance & scalability (especially for gateway/events)
- API compatibility (no breaking changes unless planned)
- Tests: meaningful coverage + failure paths
- Observability: logs/metrics for important flows
- Maintainability: naming, structure, duplication

#### Author responsibilities

##### Author must provide:
- Clean PR description + testing steps
- Small PR scope (or explanation why not)
- Respond to comments within agreed SLA (e.g., same day)

##### Comment rules
- Prefer suggestions with concrete alternatives
- Use labels:
    - `blocking`: must be fixed before merge
    - `nit`: optional style/cleanup
    - `question`: clarify intent
    - `idea`: optional improvement

##### Security & secrets policy
- Never commit secrets
- Use env vars + secret manager
- Any secret leak → rotate immediately


## Releases & Environments

### Environments
- local → dev machine
- staging → production-like testing
- prod

### Deploy rule
- No direct production deploys from feature branches
- Production deploys only from: `main`

### Rollback
- Every service must have a rollback plan:
- last stable image/tag
- DB migrations must be reversible or forward-fixable

## Services


## Code

### React:
- Components name should follow PascalCase, e.g: MadarComponent.tsx
- Components should not contain 
- Alawys divide every page into 3 layers, API Layer, Query Layer, And Presentational Components d


### NestJS: 

### Project structure (your structure, extended)
- Each domain module should include:
- `entity/` (TypeORM entities)
- `inputs/` and `outputs/` (DTOs)
- `controllers/` or single controller file
- `services/` or single controller file
- `repositories/` (optional but recommended for complex queries)
- `events/` (publish/consume handlers if using messaging)


### DTO naming
- Kebab-case filenames:
- create-vital.input.ts
- get-vital.output.ts

### Validation
- All DTOs must be validated using class-validator + class-transformer
- Never accept raw any body

### Database
- Only TypeORM (as you wrote)
- Rules:
- No raw SQL unless reviewed and justified
- Migrations required for schema changes
- Index changes must be intentional and documented

### Error handling
- Use consistent error format
- Map domain errors to HTTP status codes
- No leaking internal stack traces to clients in prod

### Testing
- Unit tests for services with meaningful edge cases
- Integration tests for controllers (at least for critical endpoints)

/modules\
    &emsp;/vitals\
    &emsp;&emsp; /entity\
    &emsp;&emsp;&emsp; /vital.entity.ts - TypeORM\
    &emsp;&emsp; /inputs\
    &emsp;&emsp;&emsp; create-vital.input.ts\
    &emsp;&emsp; /outputs\
    &emsp;&emsp;&emsp; get-vital.output.ts\
    &emsp;&emsp; vitals.service.ts\
    &emsp;&emsp; vitals.controller.ts\
    &emsp;&emsp; vitals.modules.ts


## Documentation

### Required docs

#### Each service must have:
- README with:
- purpose
- how to run locally
- env vars
- how to test
- endpoints/events summary

#### ADRs (Architecture Decision Records)
- Any “big” change needs an ADR:
- DB choice, queue choice, API versioning approach, auth strategy, etc.


### Quality gates (CI)

#### Every PR must pass:
- lint
- typecheck
- unit tests
- build
- (optional) integration tests for changed services
