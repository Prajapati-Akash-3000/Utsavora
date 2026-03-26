import { getTemplateById } from "../templates/templateData";

export default function InvitationRenderer({ template, data }) {
  // Resolve template: accept either a template object or a string ID
  let resolved = template;

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a template
      </div>
    );
  }

  if (typeof template === "string") {
    resolved = getTemplateById(template);
  } else if (template && typeof template === "object" && template.id) {
    resolved = getTemplateById(template.id) || template;
  }

  const TemplateComponent = resolved?.component;
  if (!TemplateComponent) return (
    <div className="flex items-center justify-center h-full text-gray-400">Select a template</div>
  );

  return <TemplateComponent data={data} />;
}
