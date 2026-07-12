module.exports = {
  content: [
    'index.html',
    'privacy.html',
    'terms.html',
    'licenses.html',
    'js/**/*.js'
  ],
  css: ['css/style.css'],
  safelist: {
    standard: [
      'stat-number',
      'faq-item',
      'faq-question',
      'faq-answer',
      'nav-toggle',
      'nav-menu-wrapper',
      'nav-overlay',
      'form-group',
      'checkbox-group',
      'toast',
      'toast-icon',
      'toast-content',
      'toast-title',
      'toast-message',
      'toast-close',
      'active',
      'error',
      'show',
      'highlight',
      'popular-badge'
    ]
  },
  output: 'css/',
};
