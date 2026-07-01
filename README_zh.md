# formulas-calculator-web

[`FrozenLemonTee/formulas-calculator`](https://github.com/FrozenLemonTee/formulas-calculator)
的轻量 Web 界面。

应用通过 MoonBit JavaScript bridge 完成公式发现、输入解析、计算、单位检查和输出格式化。浏览器界面使用普通 JavaScript、HTML 和 CSS。

## 功能

- 浏览已发布公式目录中的公式。
- 按所选公式生成具名数量输入。
- 使用 LunarUnits 支撑的量纲检查完成计算。
- 在 ASCII、SI 和 LaTeX 输出格式之间切换。
- 构建 MoonBit JavaScript bridge 后作为静态页面运行。

## 示例

```text
force: mass=2 kg, acceleration=3 m/s^2
ohm-voltage: current=2 A, resistance=3 Ohm
kinetic-energy: mass=2 kg, velocity=3 m/s
```

## 构建

```sh
moon build web-bridge --target js
```

## 本地运行

用任意静态文件服务器服务项目根目录，然后打开 `web/index.html`。

```sh
python -m http.server 8011
```

访问：

```text
http://localhost:8011/web/
```

## 依赖

本项目依赖已发布的 MoonBit 包：

```text
FrozenLemonTee/formulas-calculator@0.1.0
```