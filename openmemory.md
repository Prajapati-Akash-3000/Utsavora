# Utsavora – Project Guide (OpenMemory)

## Overview

**Utsavora** is an event management platform: users create events, hire managers (event planners), manage bookings, and handle payments (Razorpay, escrow). Public events support free/paid registration. Invitation templates and PDF export are supported.

- **Backend:** Django 6, Django REST Framework, PostgreSQL, JWT (SimpleJWT), Razorpay, django-crontab, WeasyPrint (optional).
- **Frontend:** React 19, Vite 7, Tailwind, MUI, Framer Motion, React Router 7, Axios.
- **Auth:** Email + password, OTP verification, role-based (USER, MANAGER, ADMIN).

---

## Architecture

### Backend (`utsavora/backend/`)

- **config:** Django project (settings, root urls). API base: `/api/`.
- **accounts:** Custom User (email, role, manager_status), UserProfile, ManagerProfile, BankDetails, EmailOTP, AuditLog, **ManagerAvailability (single source of truth for manager blocked/booked dates)**.
- **events:** EventCategory, InvitationTemplate, Event (with visibility, pricing_type, registration_fee), EventMedia, ServicePackage (legacy?), PublicEventRegistration.
- **packages:** Package (linked to ManagerProfile + EventCategory).
- **bookings:** Booking (event, package, user, manager, status, payment_status). Uses ManagerAvailability for blocking dates after payment.
- **payments:** Payment (booking, amount, platform_fee, manager_amount, status: PENDING/ESCROW/RELEASED/REFUNDED). Razorpay create order → verify → block dates.
- **manager:** (Legacy) manager calendar endpoints deprecated; calendar uses `accounts.ManagerAvailability`.

**URL layout:**  
`/api/auth/` + `/api/accounts/` (accounts), `/api/events/`, `/api/bookings/`, `/api/payments/`, `/api/` (packages), `/api/manager/`.

**Cron:** `bookings.tasks.expire_unpaid_bookings` (every 5 min), `bookings.tasks.complete_events` (daily 1 AM).

### Frontend (`utsavora/frontend/`)

- **Entry:** `main.jsx` → `App.jsx` (AuthProvider, BrowserRouter, AppRoutes).
- **Routes:** MarketingRoutes (/, /about, /events, /event/:id, etc.), AuthRoutes (/login/user, /login/manager, /register, verify-otp, forgot/reset password), UserRoutes (/user/...), ManagerRoutes (/manager/...), AdminRoutes (/admin with nested dashboard, escrow, payments, events).
- **Layouts:** MarketingLayout (header/footer), AuthLayout, AppLayout (Navbar + Outlet).
- **Auth:** AuthContext stores `user` from `localStorage.auth`; login stores access/refresh in localStorage; api.js attaches Bearer and refreshes on 401.
- **API:** `services/api.js` baseURL `http://127.0.0.1:8000/api/`; eventService, bookingService, managerService call api.

---

## User-defined namespaces

- (Leave blank – user can add e.g. frontend, backend, database.)

---

## Components (summary)

| Area | Purpose |
|------|--------|
| accounts (backend) | User, ManagerProfile, OTP, manager approval, availability, bank details |
| events (backend) | Events, categories, templates, public events, registration, public payment |
| bookings (backend) | Create/request/accept/reject booking, list user/manager bookings |
| payments (backend) | Razorpay order/verify, escrow/release/refund, admin escrow |
| packages (backend) | Packages by manager + category |
| manager (backend) | ManagerBlockedDate, calendar, block-date (separate from ManagerAvailability) |
| Django admin modules | Schema-aligned admin registration for accounts/events/bookings/payments/packages/reviews |
| App.jsx / AppRoutes | Root routing and auth wrapper |
| AuthContext | user, login, logout; persistence via localStorage.auth |
| Navbar | Role-based links; displayName from user.name/full_name/email |
| ProtectedRoute / AdminRoute | Role-based access |
| MarketingLayout / AppLayout | Layouts for public vs dashboard |

---

## Patterns

- **Backend:** JWT on all API auth; AllowAny for public event/list/register and payment verify; IsAdminUser for admin/escrow/templates; IsActiveManager for manager-only endpoints.
- **Frontend:** Login pages store access/refresh and optionally unified `auth` object; Navbar and ProtectedRoute use `useAuth().user` and `user.role`.
- **Frontend auth UI:** Auth pages (`/login/user`, `/login/manager`, `/register`) use `components/auth/AuthShell.jsx` for a premium split-layout card + side panel, inside `components/layout/AuthLayout.jsx` which provides the global auth background.
- **Branding assets:** App uses local SVG branding: `public/utsavora-icon.svg` (favicon/app icon) and `src/assets/brand/utsavora-mark.svg` (header/footer/navbar/logo). Marketing + dashboard nav + auth shell reference the same mark for consistency.
- **Manager dashboard analytics:** `GET /api/bookings/manager/requests/` includes `event_category` so the manager dashboard can compute “Event Types Distribution” from real booking data (not mocks).
- **Dashboard navigation:** Avoid duplicating the same “Requests/Calendar/Packages” links in multiple places; rely on `Navbar` for global manager navigation and keep at most one primary CTA in the dashboard header.
- **Reviews (platform feedback):** `/api/reviews/` returns `reviewer_name` (`User.full_name`), `reviewer_email`, `role_label` (User/Manager), rating/comment/date; frontend hides the review form by matching the current user by `id` (or fallback `email`).
- **Event status:** Draft → Pending (booking requested) → Active (manager accepted) → Completed (past end_date) or Cancelled; `update_event_status()` used in my_events and event_detail.
- **Booking flow:** User creates/requests booking → Manager accept/reject → User pays (Razorpay) → verify_payment sets CONFIRMED + PAID and creates ManagerAvailability (BOOKED) for date range.
- **Public event registration:** FREE → immediate confirm + email; PAID → create order → Razorpay → verify_public_payment → confirm + email.
- **Django admin coverage:** Register each active model explicitly; keep list/search/filter fields aligned with concrete DB columns and FK relations from `schema_production.sql`.
- **Django admin UX redesign:** Use custom auth-style `UserAdmin` with grouped fieldsets (`Login Credentials`, `Profile`, `Verification & Access`, `Permissions`, `Important Dates`), focused add-user form with password confirmation, model-level `fieldsets` for major entities, `date_hierarchy` for time-driven tables, and `list_select_related` for heavy FK lists.
- **Seed data command:** Use `python manage.py seed_project_showcase_data` to populate realistic showcase records across accounts/events/packages/bookings/payments/reviews, including both past and upcoming timeline data for admin demonstrations.
- **User profile feature:** Implemented `GET/PUT /api/accounts/profile/` for USER accounts to view account details + event analytics and to edit full name, mobile, and profile picture (upload after registration).

---

## Critical issues found (to fix)

1. **events/models.py:** Duplicate field definitions on `Event`: `status`, `visibility`, `pricing_type`, `registration_fee`, and `__str__` defined twice; second `status` defaults to DRAFT and overwrites first. Remove the duplicate block (lines ~100–130).
2. **accounts/views.py (ManagerSearchView):** `ManagerProfile.objects.filter(status='APPROVED')` – ManagerProfile has no `status`; use `user__manager_status='ACTIVE'`.
3. **events/views.py (generate_invitation_pdf):** Uses `event.template.background_image`; model has `preview_image`. Use `preview_image` or remove background draw.
4. **events/views.py (get_event_media):** Duplicate lines (media query and double return). Remove duplicate.
5. **events/views.py (public_events):** Filters with `template__category__iexact=category`; Event has FK `category` (EventCategory). Prefer filtering by `category` (id or slug) for consistency with other public endpoints.
6. **events/views.py (search_public_events):** `category__iexact=category` on Event; `category` is FK. Use `category_id` or `category__slug`/`category__name` depending on what frontend sends.
7. **pages/auth/Login.jsx:** Uses `res.data.token.access`/`refresh`; backend returns `res.data.access`/`refresh`. Also does not store unified `auth` object like UserLogin, so Navbar may miss user after generic login.
8. **services/bookingService.js:** Uses `bookings/${id}/accept/` and likely `reject`; backend paths are `bookings/accept/<id>/` and `bookings/reject/<id>/`.
9. **payments/views.py (refund_payment):** Sets `booking.payment_status = 'REFUNDED'`; Booking model only has choices UNPAID/PAID. Consider adding REFUNDED to choices or use a separate flag.
10. **settings.py:** Default DB password and email app password in code; ensure production uses env only.

---

## Security / deployment notes

- Move SECRET_KEY, DB_*, EMAIL_*, RAZORPAY_* to .env; no defaults for secrets in production.
- CORS: currently allow all; restrict in production.
- Media/static and CSRF_TRUSTED_ORIGINS already consider production URL.

---

## File structure (key files)

```
utsavora/
├── backend/
│   ├── config/          settings.py, urls.py
│   ├── accounts/        models, views, urls, serializers, permissions, admin_views
│   ├── events/          models, views, urls, serializers, serializers_public, admin, services (email)
│   ├── bookings/        models, views, urls, serializers, tasks
│   ├── payments/        models, views, urls
│   ├── packages/        models, views, urls, serializers
│   └── manager/         models, views, urls, serializers (blocked dates + calendar)
└── frontend/
    └── src/
        ├── App.jsx, main.jsx, index.css
        ├── context/     AuthContext
        ├── routes/      AppRoutes, MarketingRoutes, AuthRoutes, UserRoutes, ManagerRoutes, AdminRoutes, ProtectedRoute, AdminRoute
        ├── components/  layout (Navbar, AppLayout, MarketingLayout, etc.), ui, booking, event, payment, admin, common
        ├── app/         user, manager, admin (dashboard pages)
        ├── pages/       auth (Login, UserLogin, ManagerLogin, Register, etc.), NotFound
        ├── marketing/   pages (Home, PublicEventList, etc.), sections
        ├── services/    api, eventService, bookingService, managerService
        ├── invitations/ engine, templates
        └── layouts/     AdminLayout
```

---

*Last updated from deep analysis. Use this as the single source of truth for architecture and patterns.*
