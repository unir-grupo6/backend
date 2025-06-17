const mjml2html = require('mjml');

const renderTemplate = (templateFunction, data) => {
  const mjmlString = templateFunction(data);
  const { html, errors } = mjml2html(mjmlString);
  if (errors && errors.length) {
    console.error("MJML errors:", errors);
  }
  return html;
};

module.exports = renderTemplate;
