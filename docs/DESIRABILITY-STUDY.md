# Game Off 2026 — Desirability Study
**Date:** 2026-10-03 | **Analyst:** Jinx | **Status:** pre-theme (no concept scoring until Nov 1)

## Method
Pattern analysis across three years of official GitHub Game Off results (2023: SCALE, 632 entries; 2024: SECRETS, 500+ entries; 2025: WAVES, 700+ entries), drawn from the official GitHub Blog winners posts, plus itch.io's published jam-rating mechanics. ~34 officially highlighted games.

**Honest limits:** itch.io does not publish per-game play counts or rating counts publicly, so this is qualitative pattern-matching, not statistical modeling. No precise predictions are offered. No concept is scored — the theme is unknown.

## How "gravitating" actually works in this jam
The rater pool is fellow participants — developers playing and rating dozens of games during December (GitHub Blog: "rated and reviewed by the developers themselves," "thousands of hours... playing, rating, and reviewing each other's games").

The funnel:
1. **Jam page browse** → cover thumbnail + title is the entire pitch.
2. **Click** → itch page: screenshots, GIF, description, controls.
3. **Play** → browser embed = zero friction. Downloads = friction.
4. **First 60 seconds** → understood or closed.
5. **Finish / replay** → short complete games get finished; finished games get rated.
6. **Rate** → 5-star per criterion; Overall = average of criteria.

Structural fact that matters (itch.io docs, `docs/creators/game-jams.md`; community-confirmed formula): entries are ranked by average score **adjusted by rating count** — `adjustment = sqrt(min(median, votes_received) / median)`. A game rated by fewer people than the jam median gets its score discounted. Translation: **breadth of plays beats depth of a few perfect scores.** Organic reach converts directly into rank. Nobody in this jam has an ad budget — everyone faces the same jam page. "Marketing" here = cover art, title, and the first minute of play.

## Audience profile
- **Who:** game developers, hobbyist to professional, rating between their own dev sessions.
- **Motivations:** discover something clever; quick satisfying sessions; see an interesting theme interpretation; support the community (rating others drives return plays).
- **Frustrations:** games that don't load or need downloads; no idea what to do after 60 seconds; 10-minute tutorials; crashes; unfinished-feeling scope; generic reskins of the theme.
- **Session reality:** they are skimming 30–50+ games. Your game competes against the *next thumbnail*, not against a store page.

## Patterns across 34 highlighted winners (2023–2025)

**1. One verb, legible in seconds.** Grapple (Grapple Pack), drift (Wave Drifter), stack cats (Tower of Cat-astrophe), type (La Ola), slide tiles (Tidal Town, A Kingdom Slightly Out Of Tune), merge planets (Sputnika). Every winner's core action can be explained in one sentence.

**2. The theme lives in the mechanics, not the story.** Water levels ARE the level design (Where the Water Flows). Light waves reveal paths (BEACON). Typing speed sustains the stadium wave (La Ola). CCTV surveillance played as a squirrel (Squirveillance). Demon bodies stacked on literal scales (The Scales of Judgement). Judges reward theme-as-verb.

**3. Short, complete arcs.** "Three handcrafted levels" (Froggy Love). "Short, meticulous, unforgettable" (The Last Wave). "Short, atmospheric puzzles" (BEACON). Raters finish games that end — and only finished games get full ratings.

**4. A replay hook, always.** 12 endings to collect (Trail of Secrets). Speedrun timers (Evaw, Scale Travel). Leaderboards (Ooqo, Arithmometer). Procedural surprise (Untitled Dungeon Crawler, La Ola's Markov-chain text, Shuffle Macabre's procedural puzzles). Score-chase "one more run" loops (Wave Drifter, Ooqo).

**5. A memorable identity — comedy, coziness, or mood.** Comedy: Secondhand (cult quest for a free couch), The Secret Scoffer of Saffron Walden (ex-wrestler wife Doris), Squirveillance (vigilant squirrel), Erase the Secret (the Mind-Erase-3000). Cozy: BEACON (glow-slug), Froggy Love, Where the Water Flows, Shaki Shaki Island. Mood: Evaw, Aurora, Glory to Scale. After 40 games, raters remember the one that made them laugh or feel something.

**6. Audio is a scored category — winners get praised for it constantly.** Dynamic music (Trail of Secrets), punchy combos (A Kingdom Slightly Out Of Tune), hypnotic soundtrack (Ooqo), funny voice acting (Grapple Pack). Sound can't be a stretch goal.

**7. Polish density beats scope.** "One of the most polished games I've played in this jam" (Grapple Pack). "Just put it on Steam already" (Merlin: Scale of the Magic). Small + finished + juicy wins; big + rough doesn't place.

**8. Engine is irrelevant.** Godot, Unity, Construct 3, GameMaker, Unreal, custom JS all appear among winners. No engine advantage exists.

## Design principles (theme-agnostic, apply on Nov 1)
1. **The 10-second test:** a stranger must understand the verb from the cover GIF alone.
2. **Theme-as-verb:** the theme must change what the player *does*, not just what the game is *about*.
3. **Zero-friction entry:** browser embed, loads fast, playing within 15 seconds of the itch page, no reading required (proximity prompts, show-don't-tell).
4. **A 5–15 minute complete arc** with a visible ending — then a replay hook (score, endings, timer, or procgen surprise).
5. **One quotable identity:** a funny premise, a cozy mood, or a striking aesthetic. Forgettable = unrated.
6. **Audio from day one:** music + feedback sounds are a judging category, not polish.
7. **Cover + title do the marketing:** the title should create a question; the cover GIF should show the verb in under 3 seconds.
8. **Kill the tutorial:** if it needs explaining, simplify the verb.

## Opportunity lanes (directions, NOT locked concepts)
- **Cozy curiosity:** proven (BEACON, Froggy Love) but rarely combined with a mechanical twist — room to innovate.
- **Arcade with a novel input:** Ooqo (movement-as-rhythm) and La Ola (typing) show score-chasers win when the input itself is the twist.
- **Endings collection:** Trail of Secrets' 12-endings structure gives replayability without procgen complexity — cheap to build, strong retention.
- **Comedy vehicle:** a funny premise played straight (Secondhand, Squirveillance). Humor is the cheapest memorability there is.
- **Anti-patterns to avoid:** pure platformer or pure puzzle with no twist (the most saturated lanes); long onboarding; download-only builds; theme-as-wallpaper.

## Open questions for Nov 1
- 2026 AI-use policy (2023 welcomed AI tools for assets and code — precedent only, not assumed).
- 2026 pre-jam coding policy (determines whether the template shell stays).
- Exact itch submission fields (capture at dry run).

## Sources
- GitHub Blog: Game Off 2025 winners (WAVES) — github.blog/open-source/gaming/light-waves-rising-tides-and-drifting-ships-game-off-2025-winners/
- GitHub Blog: Game Off 2024 winners (SECRETS) — github.blog/open-source/game-off-2024-winners/
- GitHub Blog: Game Off 2023 results (SCALE) — github.blog/open-source/gaming/game-off-2023-results/
- itch.io jam docs: docs/creators/game-jams.md (ranking = criteria averages; Overall = average of criteria)
- itch.io community: jam rating adjustment formula `sqrt(min(median, votes)/median)`
- Wikipedia: Game Off (theme history; public-repo requirement)
