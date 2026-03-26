import React from "react";
import { Route } from "react-router-dom";
import Home from "../marketing/pages/Home";

// Lazy-loaded secondary pages
const PublicEventList = React.lazy(() => import("../marketing/pages/PublicEventList"));
const PublicSearchResults = React.lazy(() => import("../marketing/pages/PublicSearchResults"));
const PublicEventLanding = React.lazy(() => import("../marketing/pages/PublicEventLanding"));
const PublicEventRegister = React.lazy(() => import("../marketing/pages/PublicEventRegister"));
const PublicEventDetail = React.lazy(() => import("../marketing/pages/PublicEventDetail"));

const About = React.lazy(() => import("../marketing/pages/About"));
const HowItWorks = React.lazy(() => import("../marketing/pages/HowItWorks"));
const Reviews = React.lazy(() => import("../pages/ReviewsPage"));
const Contact = React.lazy(() => import("../marketing/pages/Contact"));

const Careers = React.lazy(() => import("../marketing/pages/Careers"));
const Privacy = React.lazy(() => import("../marketing/pages/Privacy"));
const Terms = React.lazy(() => import("../marketing/pages/Terms"));
const HelpCenter = React.lazy(() => import("../marketing/pages/HelpCenter"));

export default function MarketingRoutes() {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/events" element={<PublicEventList />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Existing Public Event Routes */}
      <Route path="/public/search" element={<PublicSearchResults />} />
      <Route path="/public/events/:id" element={<PublicEventDetail />} />
      <Route path="/public/events/:eventId/register" element={<PublicEventRegister />} />

      {/* Footer Static Pages */}
      <Route path="/careers" element={<Careers />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/help" element={<HelpCenter />} />
    </>
  );
}
