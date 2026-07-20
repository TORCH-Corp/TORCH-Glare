---
title: ColorPicker
description: A full Figma-style color picker with a saturation/value area, hue and opacity sliders, an eyedropper, switchable HEX/RGB/HSL inputs, and preset swatches
group: Forms
keywords: [color-picker, color, palette, hex, rgb, hsl, hsv, opacity, alpha, eyedropper, swatch]
---

# ColorPicker

> A full Figma-style color palette opened from a field-styled swatch trigger: a draggable
> saturation/value area, a hue slider, an optional opacity slider, an eyedropper (where the
> browser supports it), switchable **HEX / RGB / HSL** numeric inputs, and preset swatches.
> The value is always a hex string.

## Installation

```bash
npx torch-glare@latest init
npx torch-glare@latest add ColorPicker
```

`add` also copies its dependencies — `utils/color` (the pure hex/RGB/HSV/HSL math), plus the
`Popover` and `Input` components.

## Import

```tsx
import { ColorPicker } from "@/components/ColorPicker";
```

## Usage

```tsx
const [color, setColor] = useState("#3B82F6");

<ColorPicker value={color} onChange={setColor} />;
```

With presets and opacity disabled (always emits `#rrggbb`):

```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  alpha={false}
  presets={["#005ECC", "#047854", "#E30C30", "#F5A623"]}
/>
```

## Props

| Prop        | Type                       | Default       | Description                                                                 |
| ----------- | -------------------------- | ------------- | --------------------------------------------------------------------------- |
| `value`     | `string`                   | `"#000000"`   | Current color as a hex string (`#rrggbb` or `#rrggbbaa`).                    |
| `onChange`  | `(hex: string) => void`    | —             | Called on every change. Emits `#rrggbbaa` only when opacity < 100%.         |
| `presets`   | `string[]`                 | —             | Quick-pick swatches shown at the bottom of the panel.                       |
| `alpha`     | `boolean`                  | `true`        | Show the opacity slider + input and allow 8-digit output.                    |
| `disabled`  | `boolean`                  | `false`       | Disable the trigger and all controls.                                       |
| `theme`     | `"dark" \| "light" \| "default"` | —       | Applied as `data-theme`.                                                     |
| `className` | `string`                   | —             | Merged onto the trigger button.                                             |

## Value format

The value stays `#rrggbb` while fully opaque (backward-compatible with plain hex fields) and is
promoted to `#rrggbbaa` only when opacity drops below 100%. Feeding a 3-, 6-, or 8-digit hex
(with or without `#`) back in via `value` is always accepted.

## Notes

- The **eyedropper** button appears only where the native [`EyeDropper` API](https://developer.mozilla.org/docs/Web/API/EyeDropper)
  is available (Chromium/Edge); it is hidden on Firefox/Safari.
- Used by `FormBuilder.Color` — see [form-builder.md](./form-builder.md).
- Color math lives in `utils/color` (`parseHex`, `formatHex`, `rgbToHsv`, `hsvToRgb`,
  `rgbToHsl`, `hslToRgb`) and is reusable on its own.
