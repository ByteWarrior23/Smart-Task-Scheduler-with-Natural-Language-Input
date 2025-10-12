# TaskMaster Styling System

A comprehensive, production-ready styling system for the TaskMaster application.

## 📁 File Structure

```
styles/
├── main.css          # Global styles, CSS variables, base component enhancements
├── theme.js          # Material-UI theme configuration
├── components.css    # Component-specific styles and layouts
├── animations.css    # Animation library with 40+ keyframes
├── utilities.css     # Utility classes for rapid development
└── README.md         # This file
```

## 🎨 CSS Variables

All colors, spacing, and design tokens are defined as CSS variables in `main.css`:

### Colors
- `--primary-color`: #2563eb (Blue)
- `--secondary-color`: #8b5cf6 (Purple)
- `--success-color`: #10b981 (Green)
- `--warning-color`: #f59e0b (Orange)
- `--error-color`: #ef4444 (Red)

### Spacing
- `--spacing-xs` to `--spacing-2xl`: 0.25rem to 3rem

### Border Radius
- `--radius-sm` to `--radius-full`: Various border radius values

### Transitions
- `--transition-fast`: 150ms
- `--transition-base`: 250ms
- `--transition-slow`: 350ms

## 🎭 Animation Library

Over 40 animations available in `animations.css`:

### Entrance Animations
- `fadeIn`, `fadeInDown`, `fadeInUp`, `fadeInLeft`, `fadeInRight`
- `zoomIn`, `rotateIn`, `flipInX`, `flipInY`

### Exit Animations
- `fadeOut`, `fadeOutUp`, `fadeOutDown`, `fadeOutLeft`, `fadeOutRight`

### Attention Seekers
- `heartBeat`, `wobble`, `shake`, `swing`, `tada`, `jello`

### Special Effects
- `slideInBlur`, `glow`, `neon`, `float`, `wave`, `ripple`

### Usage Example
```html
<div class="animate-fade-in-up delay-200">Content</div>
```

## 🧩 Component Styles

`components.css` includes:
- Voice page enhancements
- Login/Register page styling
- Task list and card effects
- Loading states and skeletons
- Empty states
- Toast notifications
- Timeline components
- Progress bars
- And more...

## 🛠️ Utility Classes

`utilities.css` provides 200+ utility classes:

### Spacing
```html
<div class="m-3 p-4">Margin 1rem, Padding 1.5rem</div>
<div class="mt-5 mb-3">Margin top 2rem, bottom 1rem</div>
```

### Flexbox
```html
<div class="d-flex justify-center align-center gap-3">
  Centered flex container with gap
</div>
```

### Typography
```html
<p class="text-center font-bold text-xl">Bold, large, centered text</p>
```

### Colors
```html
<div class="bg-primary text-white">Primary background with white text</div>
```

### Interactive States
```html
<button class="hover-lift hover-shadow">Hover effects</button>
```

## 🎯 Material-UI Theme

`theme.js` provides a comprehensive MUI theme with:
- Custom color palette
- Enhanced typography scale
- Component overrides for all MUI components
- Consistent shadows and elevations
- Custom animations and transitions

## 🚀 Features

### Performance Optimizations
- Critical CSS inlined in `index.html`
- Optimized animations with `transform` and `opacity`
- GPU-accelerated transitions
- Reduced motion support for accessibility

### Responsive Design
- Mobile-first approach
- Breakpoint utilities (sm, md, lg)
- Responsive utility classes
- Touch-friendly interactions

### Accessibility
- Focus states on all interactive elements
- ARIA-compliant components
- Reduced motion preferences honored
- High contrast support
- Screen reader utilities

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS Custom Properties
- Backdrop filters with fallbacks

## 💡 Best Practices

1. **Use CSS Variables**: Reference variables for consistency
2. **Utility-First**: Use utility classes for quick styling
3. **Component Classes**: Use component classes for complex layouts
4. **Animations**: Apply animations sparingly for best UX
5. **Responsive**: Test on multiple screen sizes

## 🎨 Design System

### Color Hierarchy
1. Primary: Main brand color (blue)
2. Secondary: Accent color (purple)
3. Success: Positive actions (green)
4. Warning: Caution states (orange)
5. Error: Destructive actions (red)

### Typography Scale
- Headings: h1 (2.5rem) → h6 (1.125rem)
- Body: body1 (1rem), body2 (0.875rem)
- All use system font stack for performance

### Spacing Scale
Based on 4px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## 🔧 Customization

To customize the theme:

1. **Colors**: Edit CSS variables in `main.css`
2. **MUI Components**: Modify `theme.js`
3. **Animations**: Add to `animations.css`
4. **Utilities**: Extend `utilities.css`

## 📱 Responsive Breakpoints

- Small (sm): 640px
- Medium (md): 768px
- Large (lg): 1024px
- Extra Large (xl): 1280px

## 🌙 Future Enhancements

- Dark mode theme toggle
- More color scheme options
- Advanced animation sequences
- Component library documentation
- Storybook integration

## 📄 License

Part of the TaskMaster project.
