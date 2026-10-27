# Nikon Picture Control Comparison

The same scene rendered through every Nikon Picture Control, one JPEG per
preset per scene. 146 presets across 3 scenes — GolfCourseSunrise, GoreyCastle, GrouvilleSunrise —
so each look can be judged across different light.

Includes Nikon's built-in controls (numbered and lettered, e.g. `[01] Dream`,
`[SD] Standard`) plus a large set of custom and downloaded Picture Controls.

Live site: <https://slappymambadoo.github.io/NikonPictureControl/>

## How it works

Each scene is one Nikon NEF, batch-exported from NX Studio once per Picture
Control. The exported JPEGs are resized to 1600px on the long edge, converted
to sRGB, and written at quality 82 with 4:4:4 chroma (no subsampling) — the
settings that preserve the subtle tonal and colour differences between
controls. A generated `manifest.json` maps each preset name to its image in
every scene; `index.html` / `app.js` / `style.css` render the gallery from
that manifest.

## Structure

```
index.html        gallery page
app.js            renders grid + lightbox from manifest.json
style.css         dark UI
manifest.json     generated index: presets × scenes
GolfCourseSunrise/
GoreyCastle/
GrouvilleSunrise/
```

## Rebuilding

Clone the source repo containing `nx-studio_create_git.py` and run:

```
python3 nx-studio_create_git.py /path/to/nx-studio-exports .
```

The source NEFs and full-size exports are not in this repo.
