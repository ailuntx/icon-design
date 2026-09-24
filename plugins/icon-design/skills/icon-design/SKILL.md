---
name: icon-design
description: Design original app icons with image generation, compare visual directions at real icon sizes, and prepare transparent layers for Apple Icon Composer. Use for app rebranding, icon redesign and macOS/iOS icon delivery; prefer the imagegen skill when available, with an optional authorized OpenRouter adapter and legacy ICNS packaging.
---

# Icon Design

Respond in the user's language. Inspect the app's purpose, existing icons and build references before designing. A proposed product name is a creative brief, not permission to rename package IDs, storage paths or the whole app. For an empty invocation, ask which app or workflow the icon represents.

## Art direction

Start with a sentence explaining the product. Treat the app name as context; let the user's desired strength of association guide how literal the mark should be. For a loose association, explore a quality such as compactness or continuity without illustrating the name or forcing an initial. Translate brand references into observed proportions, curvature, contrast, color and depth. Choose a coherent visual language for each direction.

Generate a small set of genuinely distinct directions, normally 3–4. Change silhouette, composition and visual language between directions; recoloring or rematerializing one structure is refinement, not breadth. Use a concise saved prompt describing the intended mark, field, proportions and finish, leaving room for invention. Use a few relevant exclusions rather than a large inherited ban list. Read [art-direction.md](references/art-direction.md) for prompt construction, reference research and review.

Choose the canvas for the current stage: a full square composition is useful for comparing the symbol against its intended background; an isolated symbol is useful for layer preparation. Do not force white-background product renders on every concept to simplify extraction. For full square sources, leave platform corner masking to packaging and label any preview mask as a simulation. Separate or reconstruct layers after a direction is selected; a flattened concept is not a ready-made Composer layer set.

When the user supplies a visual reference, inspect it and extract a few concrete properties before writing prompts. If the chosen provider supports image references, use the supplied image to guide style as well as the text brief, clearly distinguishing style guidance from a mark to preserve. The OpenRouter adapter accepts `--reference IMAGE.png`; read its reference before using this paid route. Do not merely claim reference-guided generation when the image was never sent. The user's selected direction is stronger evidence of taste than the assistant's earlier recommendation.

Use an available image-generation tool for creative raster work. Do not replace requested AI-generated concepts with hand-coded SVG or claim a deterministic drawing was generated. Once a concept is chosen, intentional vector reconstruction is useful when it preserves the chosen design; disclose that step.

## Image generation and cost

Prefer the `imagegen` skill's built-in `image_gen` tool when available. Before sending an image request, inspect the actual image provider and base URL when exposed; a provider label alone does not establish that the endpoint is OpenAI. If that image route is third-party, name its endpoint in a native `request_user_input_async` question when available and wait for authorization before calling it.

When the built-in tool is unavailable, do not jump directly to OpenRouter. Read the `imagegen` skill's CLI fallback rules and check the image CLI's effective `OPENAI_BASE_URL` (or SDK default) and key availability without displaying secrets. Codex's text-model `model_provider` or `base_url` is not proof of the image CLI's endpoint. Unless the user already chose an image endpoint for this task, use `request_user_input_async` to ask which image API base URL they want and whether they explicitly choose and authorize the Imagegen CLI route, including any third-party cost. Show the image URL if known, without embedded credentials or query parameters; allow a user-supplied URL, and never request an API key in chat. Wait for the answer before using the CLI. If the user chooses OpenRouter instead, or already authorized it for this task, use [openrouter.md](references/openrouter.md) and the bundled `scripts/openrouter-image.mjs`. Never assume `gpt-image-2.5` exists. Check the selected provider's current model and endpoint if they change or requests fail. An image generation tool, a text-only Codex API adapter and a ChatGPT subscription are separate capabilities.

Start API concept exploration at low quality and 1024 square when supported. Save usage cost returned by the provider. Fewer generations and lower generation quality can reduce cost; resizing or compressing an already-generated image does not refund generation cost. A failed or timed-out request may still have incurred a charge; do not automatically retry. Increase quality for the selected direction when needed, within the user's cost authorization.

## Review before integration

For faces and mascots, check that eyes, ears, muzzle and skull share one coherent pose. When a correction changes the viewpoint, redraw those connected features together; do not paste a second eye onto an unchanged side-profile head. Preserve the selected character and palette while allowing the faulty contour to change.

Save source images and exact prompts under a project-local exploration directory. Inspect actual images. Show a compact comparison and representative small sizes on light and dark surroundings. Judge recognizability, balance, distinctiveness, small-size readability, unwanted symbolism, edge quality and visual fit with the app. Distinguish a dark surrounding from a native Dark appearance. Explain the recommended direction and its weaknesses without claiming brand-level quality from a successful render. When a whole set is rejected, revisit its shared assumptions before producing more variations. Wait for user selection if they requested a review gate; do not publish or replace shipping icons before that gate.

## Icon Composer delivery

Read [icon-composer.md](references/icon-composer.md) before preparing Apple assets. Separate a concept image, importable layers, a native `.icon` document and a legacy `.icns` export in the handoff. None proves the others work.

Use native transparency when supported. The optional `scripts/icon-assets.py prepare INPUT.png OUTDIR --white-matte` handles near-white exterior backgrounds only; it is not general object segmentation. Inspect on dark backgrounds for halos and lost white details. It requires Pillow and a 1024 square input, preserves original files and refuses existing output directories. Omit `--white-matte` for an already transparent image.

Import aligned SVG or transparent PNG layers into the real Icon Composer app when available. A background plus one raster foreground is a valid minimal document, but its internal folds are not independently editable layers. For fuller Liquid Glass control, reconstruct or regenerate flat, opaque, separately editable shapes; do not apply baked glass effects twice. Validate native opening, layer presence, appearances and a flattened export. If Composer cannot be run, deliver importable layers and instructions and clearly state that native validation is pending. Do not fabricate an undocumented `.icon` JSON schema.

A full-square raster may be imported into a copy of a validated Composer document for native concept previews. Label it a flattened preview: this does not establish editable layers or Dark support. After selection, preserve the chosen silhouette and rebuild simple flat color regions as clean paths when useful; verify against the original before adding material effects. See the native export caveat in [icon-composer.md](references/icon-composer.md) before producing legacy macOS resources.

For legacy macOS builds, `scripts/icon-assets.py legacy EXPORTED_1024.png OUTDIR --name AppIcon` creates an iconset and runs Apple's `iconutil`. Feed it a reviewed export with the intended macOS mask and padding; it does not invent these or create dynamic appearance variants.

The scripts need Node.js 22+ for the optional OpenRouter route, Python 3 with Pillow for raster preparation, and macOS `iconutil` for ICNS. Use an existing compatible runtime or install Pillow in a project-local virtual environment. No npm service, daemon or MCP server is required. Report delivered paths, real generation cost if known, validation performed, and what still needs user approval.
