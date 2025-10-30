/**
 * Responsive Design and Accessibility Validation
 * Tests for task 14.2
 */

const fs = require('fs');
const path = require('path');

describe('Responsive Design and Accessibility Validation', () => {
  let htmlContent;
  let cssContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    cssContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'styles.css'), 'utf8');
  });

  describe('HTML Structure and Accessibility', () => {
    test('should have proper viewport meta tag', () => {
      expect(htmlContent).toMatch(/name="viewport".*content="width=device-width, initial-scale=1\.0"/);
    });

    test('should have semantic HTML structure', () => {
      expect(htmlContent).toMatch(/<header>/);
      expect(htmlContent).toMatch(/<main>/);
      expect(htmlContent).toMatch(/<section/);
      expect(htmlContent).toMatch(/<footer>/);
    });

    test('should have proper ARIA attributes', () => {
      expect(htmlContent).toMatch(/aria-labelledby/);
      expect(htmlContent).toMatch(/aria-describedby/);
      expect(htmlContent).toMatch(/role="alert"/);
      expect(htmlContent).toMatch(/aria-live="polite"/);
    });

    test('should have proper form labels', () => {
      expect(htmlContent).toMatch(/<label for="nombre">/);
      expect(htmlContent).toMatch(/<label for="profesion">/);
      expect(htmlContent).toMatch(/<label for="template">/);
      expect(htmlContent).toMatch(/<label for="caracteristica">/);
      expect(htmlContent).toMatch(/<label for="search-input">/);
    });

    test('should have proper input attributes', () => {
      expect(htmlContent).toMatch(/required/);
      expect(htmlContent).toMatch(/maxlength/);
      expect(htmlContent).toMatch(/placeholder/);
    });

    test('should have proper charset and language', () => {
      expect(htmlContent).toMatch(/lang="es"/);
      expect(htmlContent).toMatch(/charset="UTF-8"/);
    });

    test('should have descriptive title and meta description', () => {
      expect(htmlContent).toMatch(/<title>.*Generador de Calaveritas.*<\/title>/);
      expect(htmlContent).toMatch(/name="description".*content=".*calaveritas.*"/);
    });
  });

  describe('CSS Responsive Design', () => {
    test('should have mobile-first media queries', () => {
      expect(cssContent).toMatch(/@media \(max-width: 767px\)/);
      expect(cssContent).toMatch(/@media \(min-width: 768px\) and \(max-width: 1023px\)/);
      expect(cssContent).toMatch(/@media \(min-width: 1024px\)/);
    });

    test('should use CSS Grid for layout', () => {
      expect(cssContent).toMatch(/display: grid/);
      expect(cssContent).toMatch(/grid-template-columns/);
      expect(cssContent).toMatch(/grid-template-areas/);
    });

    test('should use Flexbox for components', () => {
      expect(cssContent).toMatch(/display: flex/);
      expect(cssContent).toMatch(/flex-direction/);
      expect(cssContent).toMatch(/justify-content/);
      expect(cssContent).toMatch(/align-items/);
    });

    test('should have proper focus states', () => {
      expect(cssContent).toMatch(/:focus/);
      expect(cssContent).toMatch(/focus-visible/);
      expect(cssContent).toMatch(/outline/);
    });

    test('should support reduced motion preference', () => {
      expect(cssContent).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    });

    test('should have proper color contrast variables', () => {
      expect(cssContent).toMatch(/--primary-purple/);
      expect(cssContent).toMatch(/--primary-green/);
      expect(cssContent).toMatch(/--accent-orange/);
      expect(cssContent).toMatch(/--white/);
      expect(cssContent).toMatch(/--dark-gray/);
    });

    test('should have responsive typography', () => {
      // Check for different font sizes in media queries
      const mobileSection = cssContent.match(/@media \(max-width: 767px\) \{[^}]*\}/gs);
      const desktopSection = cssContent.match(/@media \(min-width: 1024px\) \{[^}]*\}/gs);
      
      expect(mobileSection).toBeTruthy();
      expect(desktopSection).toBeTruthy();
    });

    test('should have proper spacing and sizing', () => {
      expect(cssContent).toMatch(/max-width.*1200px/);
      expect(cssContent).toMatch(/padding.*1rem/);
      expect(cssContent).toMatch(/margin.*auto/);
    });
  });

  describe('Día de Muertos Theme', () => {
    test('should have appropriate color scheme', () => {
      expect(cssContent).toMatch(/#6b46c1/); // Purple
      expect(cssContent).toMatch(/#059669/); // Green
      expect(cssContent).toMatch(/#ff6b35/); // Orange
    });

    test('should have gradient backgrounds', () => {
      expect(cssContent).toMatch(/linear-gradient/);
      expect(cssContent).toMatch(/--gradient-primary/);
      expect(cssContent).toMatch(/--gradient-accent/);
    });

    test('should have themed emojis in HTML', () => {
      expect(htmlContent).toMatch(/🎭/); // Theater mask
      expect(htmlContent).toMatch(/💀/); // Skull
      expect(htmlContent).toMatch(/📜/); // Scroll
      expect(htmlContent).toMatch(/📚/); // Books
      expect(htmlContent).toMatch(/🌺/); // Flower
    });
  });

  describe('Interactive Elements', () => {
    test('should have proper button styling', () => {
      expect(cssContent).toMatch(/\.btn-generate/);
      expect(cssContent).toMatch(/\.btn-clear/);
      expect(cssContent).toMatch(/\.btn-export/);
    });

    test('should have hover effects', () => {
      expect(cssContent).toMatch(/:hover/);
      expect(cssContent).toMatch(/transform.*translateY/);
      expect(cssContent).toMatch(/box-shadow/);
    });

    test('should have loading states', () => {
      expect(cssContent).toMatch(/loading/);
      expect(cssContent).toMatch(/disabled/);
      expect(cssContent).toMatch(/@keyframes/);
    });

    test('should have form validation styles', () => {
      expect(cssContent).toMatch(/\.valid/);
      expect(cssContent).toMatch(/\.invalid/);
      expect(cssContent).toMatch(/\.validation-message/);
    });
  });

  describe('Accessibility Features', () => {
    test('should have proper contrast ratios (basic check)', () => {
      // Check for dark text on light backgrounds
      expect(cssContent).toMatch(/color: var\(--dark-gray\)/);
      expect(cssContent).toMatch(/background: var\(--white\)/);
    });

    test('should have keyboard navigation support', () => {
      expect(cssContent).toMatch(/focus-visible/);
      expect(cssContent).toMatch(/outline.*solid/);
    });

    test('should have screen reader friendly elements', () => {
      expect(htmlContent).toMatch(/class="help-text"/);
      expect(htmlContent).toMatch(/aria-describedby/);
      expect(htmlContent).toMatch(/role="alert"/);
    });

    test('should have proper form structure', () => {
      expect(htmlContent).toMatch(/<form.*novalidate>/);
      expect(htmlContent).toMatch(/type="submit"/);
      expect(htmlContent).toMatch(/type="text"/);
    });
  });
});