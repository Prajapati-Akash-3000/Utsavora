import os
import django
import sys

# Add backend to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from events.models import InvitationTemplate

def seed_templates():
    print("Seeding templates...")
    
    templates_data = [
        {
            "name": "Wedding Classic",
            "template_key": "wedding_classic",
            "category": "Wedding",
            "html_content": """
<div style="text-align:center; font-family:serif; padding: 40px; border: 5px double #d4af37; background-color: #fffaf0; color: #333;">
  <h1 style="color: #d4af37;">{{ event_name }}</h1>
  <p style="font-size: 1.2em;">Request the honor of your presence</p>
  <hr style="border: 0; border-top: 1px solid #d4af37; width: 50%; margin: 20px auto;">
  <p><strong>Date:</strong> {{ start_date }} to {{ end_date }}</p>
  <p><strong>Venue:</strong> {{ location }}, {{ city }}</p>
  <br>
  <p><em>{{ description }}</em></p>
  <br>
  <p style="font-size: 0.9em;">RSVP: {{ contact_numbers }}</p>
</div>
            """
        },
        {
            "name": "Birthday Fun",
            "template_key": "birthday_fun",
            "category": "Birthday",
            "html_content": """
<div style="text-align:center; font-family: 'Comic Sans MS', sans-serif; padding: 40px; background-color: #e0f7fa; color: #006064; border-radius: 20px; border: 3px dashed #00bcd4;">
  <h1 style="color: #00bcd4;">🎉 {{ event_name }} 🎉</h1>
  <p style="font-size: 1.5em;">It's Party Time!</p>
  <p><strong>When:</strong> {{ start_date }} | {{ end_date }}</p>
  <p><strong>Where:</strong> {{ location }}, {{ city }}</p>
  <p>{{ description }}</p>
  <br>
  <p>Call us: {{ contact_numbers }}</p>
</div>
            """
        },
        {
             "name": "Corporate Elegant",
             "template_key": "corporate_elegant",
             "category": "Corporate",
             "html_content": """
<div style="font-family: 'Arial', sans-serif; padding: 40px; background-color: #f5f5f5; color: #333; border-left: 10px solid #2c3e50;">
  <h1 style="color: #2c3e50; border-bottom: 2px solid #ccc; padding-bottom: 10px;">{{ event_name }}</h1>
  <p style="font-size: 1.1em; margin-top: 20px;">You are invited to an exclusive event.</p>
  
  <table style="width: 100%; margin-top: 30px;">
    <tr>
      <td style="font-weight: bold; width: 100px;">Date:</td>
      <td>{{ start_date }} - {{ end_date }}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Location:</td>
      <td>{{ location }}, {{ city }}</td>
    </tr>
  </table>
  
  <div style="margin-top: 30px; padding: 20px; background-color: white; border: 1px solid #ddd;">
      {{ description }}
  </div>
  
  <p style="margin-top: 40px; font-size: 0.9em; color: #666;">Inquiries: {{ contact_numbers }}</p>
</div>
             """
        }
    ]

    for data in templates_data:
        # Check if exists by name or key
        if not InvitationTemplate.objects.filter(template_key=data["template_key"]).exists():
            InvitationTemplate.objects.create(**data)
            print(f"Created template: {data['name']}")
        else:
            # Update existing for development convenience
            t = InvitationTemplate.objects.get(template_key=data["template_key"])
            t.html_content = data["html_content"]
            t.save()
            print(f"Updated template: {data['name']}")

if __name__ == "__main__":
    seed_templates()
