const TemplateRenderer = ({ htmlContent, data }) => {
  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a template
      </div>
    );
  }

  let renderedHtml = htmlContent;

  Object.entries(data || {}).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    renderedHtml = renderedHtml.replace(regex, value || "");
  });

  // Remove any leftover placeholders
  renderedHtml = renderedHtml.replace(/{{.*?}}/g, "");

  return (
    <div
      className="w-full h-full"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default TemplateRenderer;
