# Apple Icon Composer handoff

Checked against Apple's documentation and WWDC25 session on 2026-09-10. Use the installed Composer version as the final format authority.

For iPhone, iPad and Mac, prepare a 1024 × 1024 square canvas; Watch uses 1088 × 1088. Prefer SVG for vector shapes and transparent PNG for raster artwork. Convert text to outlines and preserve alignment across layer exports. See [Apple's creation guide](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer).

A practical handoff contains:

- Source concept and prompt, for creative review.
- Foreground layer files with the same canvas and transparent exterior. Name by stacking order, such as `01-back.png`, `02-front.png`.
- A background color or gradient specification, usually configured inside Composer.
- A real `.icon` document saved and opened by Composer, if the app is available.
- Reviewed flat PNG exports and optional `.icns` for a legacy build.

Do not bake the platform rounded mask into source layers. Keep glass-oriented shapes flat and opaque; Composer supplies specular effects, shadow and translucency. A background plus one foreground can be sufficient. Groups describe depth/material behavior; the WWDC25 tool supports up to four groups. Preview Default, Dark, Clear light/dark and Tinted light/dark as supported by the installed tool. [Apple's workflow demonstration](https://developer.apple.com/videos/play/wwdc2025/361/).

A single already-shaded AI foreground should normally start with its glass treatment disabled; otherwise it may acquire double highlights and muddy colors. Label it a raster concept. Separating editable colors and overlapping parts requires intentional reconstruction or consistent generated layers, not merely splitting a PNG into arbitrary regions.

Launch via Xcode → Open Developer Tool → Icon Composer. A common bundled path is `/Applications/Xcode.app/Contents/Applications/Icon Composer.app`; discover it instead of assuming it exists. Through app UI: create a document, Add Layer → New Image, import the foreground, choose background/material, save and reopen. For long paths, set the file dialog's path field directly; simulated typing can lose underscores or submit too early. Read the fresh UI state before using element IDs.

The `.icon` package is not `.icns`. Avoid hard-coding undocumented JSON fields; create or inspect a file made by the installed Composer and verify any changes by opening it. If editing such a local document structurally, retain the original and document the version-specific assumption.

Use the platform's own export and appearance controls. A generic rounded rectangle preview is only a comparison mockup, not evidence of native masking or Liquid Glass. Dynamic appearances are not preserved by the legacy ICNS path. Check the app's build references before replacing assets. [Apple app-icon guidance](https://developer.apple.com/design/human-interface-guidelines/app-icons).

## Tested exporter distinction

Icon Composer 1.6 includes a CLI at `Icon Composer.app/Contents/Executables/ictool`. It is different from the `ictool` found by `xcrun`. Check the selected executable's `--help` before invoking it. The tested form is:

```sh
ictool App.icon --export-image --output-file Default.png --platform iOS --rendition Default --width 1024 --height 1024 --scale 1
```

Use this for repeatable native previews of an already validated document. Do not infer that its `--platform macOS` result includes legacy Dock padding. In the MiniBridge test, both iOS and macOS CLI exports filled the canvas, whereas UI export with **macOS pre-Tahoe** included a smaller tile, cast shadow and transparent margin. They were not pixel-identical. Package the reviewed UI export for a legacy ICNS build; retain it as an explicit build input and re-export when the source changes. Never add a second mask or margin to an already padded export.

For precise color edits, first create/save a fill in the actual app and inspect its encoding. Modify only observed fields, reopen and verify. In the tested app, the saved solid fill used `extended-srgb:r,g,b,a`; the version-specific structure is not a universal format contract. A `.icon/` trailing slash in a Go To path avoids completion to a similarly named `.iconset` directory.
