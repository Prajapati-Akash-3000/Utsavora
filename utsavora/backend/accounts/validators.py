import re
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email

# ─── Constants ───
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
MOBILE_REGEX = re.compile(r"^\+?[0-9]{10,15}$")  # optional +, 10–15 digits
PASSWORD_MIN_LENGTH = 8
FULL_NAME_MIN_LENGTH = 2
FULL_NAME_MAX_LENGTH = 255
CERTIFICATE_MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_CERTIFICATE_EXTENSIONS = (".pdf", ".jpg", ".jpeg", ".png")

def validate_email(value):
    if not value or not str(value).strip():
        return ["Email is required."]
    value = str(value).strip().lower()
    if not EMAIL_REGEX.match(value):
        return ["Enter a valid email address."]
    try:
        django_validate_email(value)
    except ValidationError:
        return ["Enter a valid email address."]
    return []

def validate_password(value):
    errors = []
    if not value:
        return ["Password is required."]
    s = str(value)
    if len(s) < PASSWORD_MIN_LENGTH:
        errors.append(f"Password must be at least {PASSWORD_MIN_LENGTH} characters.")
    if not re.search(r"[A-Za-z]", s):
        errors.append("Password must contain at least one letter.")
    if not re.search(r"[0-9]", s):
        errors.append("Password must contain at least one digit.")
    return errors

def validate_full_name(value):
    if value is None:
        return ["Full name is required."]
    s = str(value).strip()
    if not s:
        return ["Full name is required."]
    if len(s) < FULL_NAME_MIN_LENGTH:
        return [f"Full name must be at least {FULL_NAME_MIN_LENGTH} characters."]
    if len(s) > FULL_NAME_MAX_LENGTH:
        return [f"Full name must be at most {FULL_NAME_MAX_LENGTH} characters."]
    return []

def validate_mobile(value):
    if value is None or (isinstance(value, str) and not value.strip()):
        return []
    s = str(value).strip().replace(" ", "")
    if not s:
        return []
    if not MOBILE_REGEX.match(s):
        return ["Enter a valid mobile number (10–15 digits, optional +)."]
    return []

def validate_role(value):
    if not value:
        return ["Role is required."]
    r = str(value).upper()
    if r not in ("USER", "MANAGER"):
        return ["Invalid role. Must be User or Manager."]
    return []

def validate_manager_extra(company_name, certificate_file):
    errors = {}
    if not company_name or not str(company_name).strip():
        errors["company_name"] = ["Company name is required for Managers."]
    if not certificate_file:
        errors["certificate"] = ["Certificate file is required for Managers."]
    else:
        name = getattr(certificate_file, "name", "") or ""
        if not any(name.lower().endswith(ext) for ext in ALLOWED_CERTIFICATE_EXTENSIONS):
            errors["certificate"] = [
                f"Allowed formats: {', '.join(ALLOWED_CERTIFICATE_EXTENSIONS)}."
            ]
        try:
            size = certificate_file.size
        except AttributeError:
            size = 0
        if size > CERTIFICATE_MAX_SIZE_BYTES:
            max_mb = CERTIFICATE_MAX_SIZE_BYTES // (1024 * 1024)
            errors.setdefault("certificate", []).append(f"File must be under {max_mb} MB.")
    return errors

def validate_otp_value(value):
    if not value:
        return ["OTP is required."]
    s = str(value).strip()
    if len(s) != 6 or not s.isdigit():
        return ["OTP must be 6 digits."]
    return []

def validate_registration_data(data, files):
    errors = {}
    email = (data.get("email") or "").strip().lower() if data.get("email") else ""
    password = data.get("password")
    full_name = (data.get("full_name") or data.get("name") or "").strip()
    role = (data.get("role") or "USER").upper()
    mobile = (data.get("mobile") or data.get("phone") or "").strip()
    company_name = (data.get("company_name") or "").strip()
    certificate = files.get("certificate") if files else None

    for msg in validate_email(email):
        errors.setdefault("email", []).append(msg)
    for msg in validate_password(password):
        errors.setdefault("password", []).append(msg)
    for msg in validate_full_name(full_name):
        errors.setdefault("full_name", []).append(msg)
    for msg in validate_role(role):
        errors.setdefault("role", []).append(msg)
    for msg in validate_mobile(mobile):
        errors.setdefault("mobile", []).append(msg)

    if role == "MANAGER":
        for field, msgs in validate_manager_extra(company_name, certificate).items():
            errors[field] = errors.get(field, []) + msgs

    if errors:
        return errors, None

    cleaned = {
        "email": email,
        "password": password,
        "full_name": full_name,
        "role": role,
        "mobile": mobile or None,
        "company_name": company_name or None,
        "certificate": certificate,

    }
    return None, cleaned
