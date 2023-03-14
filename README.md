# sass-themes

This module provides functions, mixins, and style sheets for a set of classes 
called themes. These classes use CSS properties to define the primary colors of 
a website in terms of their role.

For more details, refer to the [full 
documentation](https://dawaltconley.github.io/sass-themes/).

## Installation

When installing from npm, make sure to include `node_modules` in your 
`SASS_PATH` to resolve dependencies. `sass-themes` depends on other sass 
libraries and needs to know where to find them.

```
npm install sass-themes
SASS_PATH=node_modules
```

## Themes

Define themes using the `create` mixin. All themes take a `$text` and 
`$background` color, and optionally a `$brand` color.

```scss
@use 'sass-themes';

body, .light {
  // using keyword arguments
  @include sass-themes.create(
    $tx: #111,
    $bg: white,
    $br: royalblue
  )
}
```

This outputs CSS properties for use in theme classes. These properties are 
defined using the [scss-properties 
library](https://github.com/dawaltconley/scss-properties) so that they can be 
manipulated later.

The following sample output is simplified for readability, with the actual 
output shown in comments.

```scss
body, .light {
  --light-theme:      1;                                          // 1 if text color is darker than background, else 0
  --dark-theme:       0;                                          // opposite --light-theme
  --theme-tx:         #111;                                       // hsla(var(--theme-tx-h), var(--theme-tx-s), var(--theme-tx-l), var(--theme-tx-a));
  --theme-bg:         white;                                      // hsla(var(--theme-bg-h), var(--theme-bg-s), var(--theme-bg-l), var(--theme-bg-a));
  --theme-br:         royalblue                                   // hsla(var(--theme-br-h), var(--theme-br-s), var(--theme-br-l), var(--theme-br-a));
  --button-text:      if($brand and not $light-theme, $text, $bg) // hsla(var(--button-text-h), var(--button-text-s), var(--button-text-l), var(--button-text-a));
  --button-bg:        $brand or $text                             // hsla(var(--button-bg-h), var(--button-bg-s), var(--button-bg-l), var(--button-bg-a));
  --theme-tx--light:  #{scss-properties.mix(                      // rgba(calc((var(--theme-tx-r) * (0.58 + (0.18 * var(--theme-dark)))) + (var(--theme-bg-r) * (1 - (0.58 + (0.18 * var(--theme-dark)))))),
                        --theme-tx,                               //      calc((var(--theme-tx-g) * (0.58 + (0.18 * var(--theme-dark)))) + (var(--theme-bg-g) * (1 - (0.58 + (0.18 * var(--theme-dark)))))),
                        --theme-bg,                               //      calc((var(--theme-tx-b) * (0.58 + (0.18 * var(--theme-dark)))) + (var(--theme-bg-b) * (1 - (0.58 + (0.18 * var(--theme-dark)))))),
                        '(0.58 + (0.18 * var(--theme-dark)))'     //      calc((var(--theme-tx-a) * (0.58 + (0.18 * var(--theme-dark)))) + (var(--theme-bg-a) * (1 - (0.58 + (0.18 * var(--theme-dark)))))));
                      )};

  color:              var(--theme-tx);
  background-color:   var(--theme-bg);
  border-color:       var(--theme-tx);
}
```

### Accessibility

The `accessibility` mixin checks the color contrast ratios against the WCAG 
standards. It throws a warning when the provided colors do not meet the 
standard.

```scss
@use 'sass-themes';

@include sass-themes.accessibility($text: #111, $bg: white, $brand: blue, $accessibility: 'AA');
```

The `create` mixin calls this mixin automatically using your theme colors. You 
can set it's accessibility standard using the `accessibility` keyword for each 
theme. Or you can set it globally when importing this library.

```scss
@use 'sass-themes' with ($accessibility: 'AAA');
```

`$accessibility` can be either `'AA'`, `'AAA'`, or `false` to turn off the 
warnings. It defaults to `AA`.

### Keyword aliases

The `$text`, `$background`, and `$brand` keywords have a number of aliases:

- `$text`: `text`, `text-color`, `--theme-text`
- `$background`: `background`, `bg`, `background-color`, `--theme-bg`
- `$brand`: `brand`, `brand-color`, `--theme-brand`

These aliases can be used as alternate keyword arguments. You can also pass a 
map of keywords as the only argument.

```scss
.dark {
  // using a map of keyword arguments
  @include sass-themes.create((
    --theme-tx:   white;
    --theme-bg:     #111;
    --theme-br:  royalblue;
  ));
}
```

You can even pass a map that defines multiple theme class names and their 
colors all at once:

```scss
@include sass-themes.create((
  // using a map of class names and keyword arguments
  'light': (
      text-color:       #111,
      background-color: white,
      brand-color:      royalblue ),
  'dark': (
      text-color:       white,
      background-color: #111,
      brand-color:      royalblue )));
```

### Additional options

The behavior of the `create` mixin can be tweaked using optional 
flags, which cannot be passed as positional arguments; they must be 
specified using keywords or a map argument.

```scss
body, .light {
  @include sass-themes.create(
    $tx: #111,
    $bg: white,
    $br: royalblue,
    $styles: 'extend' // or 'include', false: controls how base styles are included
  )
}
```

## Working with themes

You create classes that inherit theme colors by referencing the CSS properties 
created by the `create` mixin:

```css
.button {
    color: var(--theme-br);
}
```

These properties are used to style the colors of an element ***and*** all of 
it's children. This allows an element to be styled according to a given theme 
by either inheritance...

```html
<div class="light">
  <a class="button" href="/foo">Theme Button</a>
</div>
```

...or direct assignment.

```html
<a class="light button" href="/foo">Theme Button</a>
```

This allows you to style elements within a theme differently without extra 
markup.

```html
<div class="light">
  <p>I am the color set by the light theme.</p>
  <p class="dark">I'm the color set by the dark theme!</p>
</div>
```

## Style sheets

Default theme subclasses are defined in the `styles` directory, and can be 
imported with some configurable variables, all at once or individually.

```scss
// import all styles with optional default overrides
@use 'sass-themes/styles' with ($btn-hover-mix: 50%);

// importing individual styles
@use 'sass-themes/styles/base';
@use 'sass-themes/styles/text';
```

## Tailwind CSS

This package exports a plugin for integrating with Tailwind CSS via 
`require('sass-themes/tailwind')`. This adds `theme-tx`, `theme-bg`, and 
`theme-br` colors to your Tailwind CSS theme, which use the corresponding CSS 
property.

`sass-themes` still requires a Sass build step in order to create the theme 
classes that these Tailwind colors depend on. You may not want to import 
certain (or any) theme subclasses when using Tailwind; consider only importing 
the mixins and utility functions.

## Partials

The structure of partials in the package looks like this:

```
.
├── _index.scss
├── _mixins.scss
├── _utils.scss
└── styles
    ├── _index.scss
    ├── _base.scss
    ├── _bg.scss
    ├── _borders.scss
    ├── _buttons.scss
    ├── _svg.scss
    ├── _text.scss
    └── _theme.scss
```
