import os
import glob
import re

template_dir = r"c:\Users\Akash\OneDrive\Desktop\new ut\utsavora\frontend\src\invitations\templates"

for filepath in glob.glob(os.path.join(template_dir, "*.jsx")):
    # Skip BirthdayCard and WeddingCard as they are already done
    if os.path.basename(filepath) in ["BirthdayCard.jsx", "WeddingCard.jsx"]:
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already has timeStr to avoid double processing
    if "const timeStr =" in content:
        continue

    # 1. Inject timeStr variable
    content = content.replace(
        "const date = formatDate(data?.start_date, data?.end_date);",
        "const date = formatDate(data?.start_date, data?.end_date);\n  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';"
    )

    # 2. Inject UI JSX
    # Most templates have something like: <span style={...}>{date || "Date TBD"}</span>
    # Or generically: >{date || "Date TBD"}</span>
    
    # We use regex to find `{date || "Date TBD"}` inside whatever tag it is, and then the closing tag.
    # Ex: <span style={...}>{date || "Date TBD"}</span>
    
    pattern = r"(\{date\s*\|\|\s*[\"']Date TBD[\"']\})([\s]*</[a-zA-Z]+>)"
    replacement = r"\1\2\n        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}"
    
    new_content = re.sub(pattern, replacement, content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Batch update complete.")
