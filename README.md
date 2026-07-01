# formulas-calculator-web

A lightweight web interface for
[`FrozenLemonTee/formulas-calculator`](https://github.com/FrozenLemonTee/formulas-calculator).

The app uses a MoonBit JavaScript bridge for formula discovery, input parsing,
calculation, unit checking, and output formatting. The browser UI is plain
JavaScript, HTML, and CSS.

## Features

- Browse formulas from the published formula catalog.
- Generate named quantity inputs for the selected formula.
- Calculate with LunarUnits-backed dimension checks.
- Switch output format between ASCII, SI, and LaTeX.
- Run as a static web page after building the MoonBit JavaScript bridge.

## Examples

```text
force: mass=2 kg, acceleration=3 m/s^2
ohm-voltage: current=2 A, resistance=3 Ohm
kinetic-energy: mass=2 kg, velocity=3 m/s
```

## Build

```sh
moon build web-bridge --target js
```

## Run Locally

Serve the project root with any static file server, then open `web/index.html`.

```sh
python -m http.server 8011
```

Then visit:

```text
http://localhost:8011/web/
```

## Dependency

This project depends on the published MoonBit package:

```text
FrozenLemonTee/formulas-calculator@0.1.0
```