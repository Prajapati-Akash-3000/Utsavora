import { templates, getTemplatesForCategory } from "../templates/templateData";

const EVENT_CATEGORY_LABELS = {
  birthday: "Birthday",
  wedding: "Wedding",
  corporate: "Corporate",
  concert: "Concert",
  festival: "Festival",
  engagement: "Engagement",
  social: "Social",
  other: "Any Event",
  general: "All Events",
};

export default function TemplateSelector({ selected, onSelect, categorySlug }) {
  const list = categorySlug ? getTemplatesForCategory(categorySlug) : templates;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {list.map((template) => {
        const isSelected = selected?.id === template.id;

        return (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              isSelected
                ? "border-purple-600 ring-2 ring-purple-200 shadow-lg scale-[1.02]"
                : "border-gray-100 hover:border-purple-200"
            }`}
          >
            <div
              className="aspect-[2/3] w-full flex flex-col items-center justify-end pb-5 relative"
              style={{ background: template.color }}
            >
              <div
                className="absolute top-0 left-0 w-20 h-20 rounded-full opacity-30 -translate-x-6 -translate-y-6"
                style={{ background: template.accent }}
              />
              <div
                className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-20 translate-x-8 translate-y-8"
                style={{ background: template.accent }}
              />

              <span
                className="text-xs font-bold px-4 py-1.5 rounded-full shadow-sm z-10"
                style={{ background: template.accent, color: "#fff" }}
              >
                {template.name}
              </span>
            </div>

            <div className="p-3 bg-white border-t border-gray-50 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">{template.name}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.style && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {template.style}
                  </span>
                )}
                {template.eventCategory && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-600">
                    {EVENT_CATEGORY_LABELS[template.eventCategory] || template.eventCategory}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
