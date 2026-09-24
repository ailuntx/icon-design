# Art direction and prompt research

An app name provides a clue, not a drawing assignment. A product about gathering can use compactness or visual rhythm; a connection tool can suggest continuity through negative space. An abstract mark can be appropriate without spelling an initial or depicting hardware. Respect the user's requested degree of association.

## References into decisions

Inspect the actual reference when available. Describe what makes it work: outer contour, relative area, positive/negative space, contrast, color transitions, depth and background. Brand names alone do not specify these. Do not assume a company's logo was AI-generated or claim to know its undisclosed prompt. Distinguish an observed reference from an image actually supplied to the generation model.

Possible design languages, not recipes:

- Precise and quiet: deliberate proportions, generous negative space, controlled curvature and restrained depth. Glass is optional.
- Fluent and colorful: broad continuous curves, a deliberate palette, clear hierarchy and a silhouette that survives monochrome.
- Direct and graphic: strong light/dark mass, a memorable cut, minimal surfaces and confident scale.

For a new set, vary the shape and composition as well as the finish. A folded plane, a flat organic mass and a sparse separated cluster explore different ideas. Three identical cradles in porcelain, gradient and black do not.

## Prompt shape

Use the shortest prompt that communicates the intended direction. More structure is useful for reproducing a chosen result; it can prematurely fix the geometry during exploration.

```text
Original app icon for [name], [one-sentence purpose].
Association: [literal, suggestive or mostly abstract, according to the brief].
Direction: [one coherent visual language].
Mark: [broad shape relationship, with room to invent a contour].
Field and finish: [foreground/background colors, contrast, degree of depth].
Composition: [optical balance, scale, spacing].
Deliver one square artwork, no text or mockup; [a few relevant exclusions].
```

For concept art, describe the intended field, not necessarily white. Full-bleed square artwork can be masked in a review sheet. Do not ask the model to draw a rounded tile floating on another square unless that presentation is specifically desired. For layer delivery, make a separate extraction or reconstruction decision after selection; do not run white-matte removal on colored full-square artwork.

## Review

For character icons, evaluate eyes, ears, muzzle and skull as one pose. Two eyes must share a plausible eye-line and orientation, with size differences justified by perspective; ears attach to the same head plane. Adding an eye to an unchanged side-profile silhouette can break the whole face. If the requested feature changes the viewpoint, redraw the connected head geometry while preserving the chosen palette, character and composition. Label the reference as a style/composition guide when its contour must change. Show the structural correction at 32px before adding material polish.

1. Read the image at small size before admiring its large render. Watch for stock symbols, unintended faces, familiar lettermarks or game-character associations.
2. Compare the candidates without names: do they actually differ? Does the preferred mark work without an elaborate story?
3. Check optical centering, relative scale and clean silhouette. A successful prompt response is not aesthetic approval.
4. Inspect edges against light and dark surroundings. This is not a native appearance test; Composer Dark/Clear/Tinted must be tested separately after packaging.
5. Identify the weakest dimension and change it deliberately. If all candidates fail, change the shared art direction instead of adding polish to the same structure.

## Public sources inspected, 2026-09-10

- [xzhih/app-icon-skill — semantic prompt examples](https://github.com/xzhih/app-icon-skill/tree/main/skills/app-icon-gen/examples/semantic-image-prompts): published families separate shape, field, composition and later layer conversion. Useful as workflow research; examples vary in visual quality. Adapt the principles, not its exact marks or all its packaging restrictions.
- [Recraft — prompting guide](https://www.recraft.ai/docs/prompt-engineering-guide/prompting-with-recraft-v4): distinguishes short prompts for exploration from structured prompts for control; its vector guidance emphasizes geometry, palette, line consistency and layout. [Icon service](https://www.recraft.ai/generate/icons) offers styles and vector-oriented workflows. These are documented capabilities, not an independent quality ranking.
- [Ideogram — public magic-prompt source](https://github.com/ideogram-oss/ideogram4/blob/main/src/ideogram4/magic_prompt_system_prompts/v1.txt): separates an overall description from background and elements, then asks for concrete shape, material and color. Its JSON contract is model-specific, not a required format for OpenRouter GPT Image. [Official caveat](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md): the open-source expansion prompt differs from the hosted product's production prompt.
- [schwa/icon-generator — actual prompt implementation](https://github.com/schwa/icon-generator/blob/main/Sources/icon-generator/IconGenerator.swift): asks an LLM for JSON selecting background, SF Symbols/short text and layers, then renders deterministically. A polished generated icon does not necessarily involve image-model-generated pixels.

These sources inform the workflow. They do not establish how Apple, Google, X or Jimeng designed their own logos, and no provider switch is implied.
