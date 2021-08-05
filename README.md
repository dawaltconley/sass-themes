# sass-themes

This module provides functions, mixins, and stylesheets for sass themes: a special set of classes that define colors through inheritance.

## Themes

The easiest way to define themes is using a map of three colors: `text-color`, `background-color`, and (optionally) `brand-color`. Maps can also have an `accessibility` key (`AA`, `AAA`, or `null`), which warns if the contrast ratios of the theme colors fail those WCAG standards (default is `AA`).

```scss
$themes: (
    "light": (                          // other accepted keys:
        text-color: #171717,            // text, color
        background-color: white,        // bg, background
        brand-color: royalblue,         // brand
        accessibility: AAA
    ),
    "dark": (
        text-color: white,
        background-color: #171717,
        brand-color: royalblue,
    ),
);

@use "sass-themes/build" with ($themes: $themes);
```

This produces `.light` and `.dark` classes, which are used to style the colors of an element ***and*** all of it's children. This allows an element to be styled according to a given theme by either inheritance...

```html
<div class="light">
  <a class="button" href="/foo">Theme Button</a>
</div>
```

...or direct assignment.

```html
<a class="light button" href="/foo">Theme Button</a>
```

This allows you to style elements within a theme differently without extra markup.

```html
<div class="light">
  <p>I am the color set by the light theme.</p>
  <p class="dark">I'm the color set by the dark theme!</p>
</div>
```

## Theme subclasses

You can create classes that inherit theme colors using the `themeify` mixin, found in the `_mixins.scss` partial. The include passes a map of theme properties to its content that can be referenced as follows:

```scss
@use "sass:map";
@use "sass-themes/mixins";

.text-light {
    @include mixins.themeify using ($theme) {
        color: map.get($theme, 'text-light');
    }
}
```

This sets the class `.text-light` to apply the `text-light` property, which is a mix of the theme's text and background colors. If the theme is a light one (dark text on a light background), this will lighten the text, as the name implies. If the theme has light text on a dark background, this will _darkening_ it, to bring it closer to the background color.

Perhaps counter-intuitive. But when styling a site I am usually thinking of the colors of elements as relative to the rest of the page, or as serving the same _role_ within a theme. Theme classes are meant to do exactly that; they perform a function which is relative to the theme. This means that themes can be tried out, updated, and adjusted easily, even well into a site's development.

The full list of properties is defined in by the `register` mixin, and is as follows:

```scss
(
    bg: /* background color */,
    brand: /* brand color */,
    text: /* text color */,
    text-light: /* mix of text and bg */,
    button: (
        bg: /* brand, if available */,
        text: /* the lighter of text or bg */
    ),
    light: /* true if text is darker than bg */,
    dark: /* true if bg is darker than text */,
);

```

Default theme subclasses are defined in the `styles` directory, and can be imported with some configurable variables, all at once through `styles/_all.scss` or individually. They should be imported _after_ registering all your themes and setting the `$theme-depth`.

```scss
$themes: (
    // map of themes
);

@use "sass-themes/build" with ($themes: $themes);
@use "sass-themes/styles/all";
```

## Themes and specificity

Specificity can get a little tricky when working like this. Theme styles automatically have more specificity, since they are relative to a class. The CSS output for `text-light` looks like this:

```scss
.light .text-light, .light.text-light {
  color: #787878; }
```

As a result, the recommended approach is to _only_ use theme classes to control colors, and for _all_ colors on a site to be defined through themes. The specificity of theme classes makes it difficult (though not impossible) to control colors in other ways.

## Depth

The intended (and intuitive) behavior of theme classes is that they will be styled relative to the _nearest parent theme_. Unfortunately, CSS needs some coaxing to work like this.

This is what the `$theme-depth` setting is for. `$theme-depth` controls the level at which nested themes will inherit from their nearest parent, reworking the generated CSS like so:

```scss
// $theme-depth: 1;
.light.text-light, .light .text-light,
.dark .light.text-light, .dark .light .text-light {
    color: #787878; }

// $theme-depth: 2;
.light.text-light, .light .text-light,
.dark .light.text-light, .dark .light .text-light, 
.dark .light .dark .light.text-light, .dark .light .dark .light .text-light {
    color: #787878; }
```

As you can see, increasing the `$theme-depth` makes each theme class _significantly_ heavier—even more so if you have three or four theme classes! The default value is 1 and there is rarely a good reason to set it higher (why are you nesting so many themes inside each other, anyway?!).

Even with a `$theme-depth` of 1, is best paired with a post-processor like [uncss](https://www.npmjs.com/package/uncss).

You set the `$theme-depth` when using the `_manifest.scss`, `_build.scss`, and `_mixins.scss` partials; whichever you are using to build your themes. This will also set it for all mixins and theme styles `@use`d afterwards.

```scss
@use "sass-themes/mixins" with ($theme-depth: 0); // nested themes handled by cascade
@include constructor((
    // map of theme styles
));
```

## Partials

The structure of partials in the package looks like this:

```
.
├── _build.scss
├── _manifest.scss
├── _mixins.scss
└── styles
    ├── _all.scss
    ├── _base.scss
    ├── _bg.scss
    ├── _borders.scss
    ├── _buttons.scss
    ├── _svg.scss
    └── _text.scss
```
