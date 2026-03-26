import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import CountUp from "react-countup";
import { CalendarDays, ClipboardList, CreditCard, IndianRupee, Layers3 } from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/ui/Skeleton";
import PageWrapper from "../../components/common/PageWrapper";

import KpiCard from "./components/KpiCard";
import EarningsChart from "./components/analytics/EarningsChart";
import BookingsChart from "./components/analytics/BookingsChart";
import EventTypesChart from "./components/analytics/EventTypesChart";
import UpcomingEvents from "./components/UpcomingEvents";
import BookingRequests from "./components/BookingRequests";
import ManagerCalendar from "./ManagerCalendar";
import EventDetailDrawer from "./components/EventDetailDrawer";

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,]/g, "").trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function buildLast12Months() {
  const end = dayjs().startOf("month");
  return Array.from({ length: 12 })
    .map((_, i) => end.subtract(11 - i, "month"))
    .map((d) => ({
      key: d.format("YYYY-MM"),
      label: d.format("MMM"),
      monthStart: d,
      monthEnd: d.endOf("month"),
    }));
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const displayName =
    user?.name || user?.full_name || user?.email || user?.username || "Manager";

  const [earnings, setEarnings] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const fetchAllData = async () => {
    try {
      const [earningsRes, requestsRes] = await Promise.all([
        api.get("/accounts/manager/earnings/"),
        api.get("/bookings/manager/requests/"),
      ]);
      setEarnings(earningsRes.data);
      setBookings(Array.isArray(requestsRes.data) ? requestsRes.data : []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAccept = async (bookingId) => {
    try {
      await api.post(`/bookings/accept/${bookingId}/`);
      toast.success("Booking accepted!");
      fetchAllData();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to accept booking.";
      toast.error(typeof msg === "object" ? JSON.stringify(msg) : msg);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await api.post(`/bookings/reject/${bookingId}/`);
      toast.success("Booking rejected.");
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject booking.");
    }
  };

  const { pendingRequests, upcomingEvents } = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "PENDING");

    const today = dayjs().startOf("day");
    const upcoming = bookings.filter((b) => {
      const statusOk = ["ACCEPTED", "CONFIRMED"].includes(b.status);
      const d =
        b.start_date || b.date || b.end_date
          ? dayjs(b.start_date || b.date || b.end_date)
          : null;
      return statusOk && d && (d.isAfter(today) || d.isSame(today));
    });

    return { pendingRequests: pending, upcomingEvents: upcoming };
  }, [bookings]);

  const { monthlyBookings, monthlyEarnings } = useMemo(() => {
    const months = buildLast12Months();

    const bookingsSeries = months.map((m) => ({ month: m.label, bookings: 0 }));
    const earningsSeries = months.map((m) => ({ month: m.label, earnings: 0 }));

    for (const b of bookings) {
      const when = b.start_date || b.date || b.end_date;
      if (!when) continue;
      const d = dayjs(when);
      const key = d.format("YYYY-MM");

      const idx = months.findIndex((m) => m.key === key);
      if (idx === -1) continue;

      if (b.status !== "REJECTED" && b.status !== "CANCELLED") {
        bookingsSeries[idx].bookings += 1;
      }

      if (b.status === "COMPLETED") {
        earningsSeries[idx].earnings += toNumber(b.price);
      }
    }

    return { monthlyBookings: bookingsSeries, monthlyEarnings: earningsSeries };
  }, [bookings]);

  const eventTypeData = useMemo(() => {
    const counts = new Map();
    for (const b of bookings) {
      if (b.status === "REJECTED" || b.status === "CANCELLED") continue;
      const type = b.event_category || "Other";
      counts.set(type, (counts.get(type) || 0) + 1);
    }

    const sorted = Array.from(counts.entries())
      .map(([type, value]) => ({ type, value }))
      .sort((a, b) => b.value - a.value);

    const top = sorted.slice(0, 4);
    const rest = sorted.slice(4).reduce((acc, x) => acc + x.value, 0);
    if (rest > 0) top.push({ type: "Other", value: rest });
    return top.length ? top : [{ type: "Other", value: 1 }];
  }, [bookings]);

  if (loading) {
    return (
      <div className="py-6 sm:py-8">
        <Skeleton className="h-10 w-64 mb-6" variant="text" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Skeleton className="h-28 w-full" variant="rect" />
          <Skeleton className="h-28 w-full" variant="rect" />
          <Skeleton className="h-28 w-full" variant="rect" />
          <Skeleton className="h-28 w-full" variant="rect" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-80 w-full" variant="rect" />
          <Skeleton className="h-80 w-full" variant="rect" />
        </div>
      </div>
    );
  }

  const totalEarned = toNumber(earnings?.total_earned);
  const pendingClearance = toNumber(earnings?.pending_clearance);
  const eventsCompleted = toNumber(earnings?.events_completed);

  return (
    <PageWrapper className="py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
        <div>
          <p className="section-badge">
            <span className="inline-flex w-2 h-2 rounded-full bg-primary" />
            Manager
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="gradient-text">{displayName}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Here’s what’s happening across your bookings and calendar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/manager/bank-details"
            className="btn-secondary !px-4 !py-2.5 !rounded-xl text-sm flex items-center gap-2"
          >
            <CreditCard size={16} />
            Bank details
          </Link>
          <Link
            to="/manager/review"
            className="btn-secondary !px-4 !py-2.5 !rounded-xl text-sm"
          >
            Leave review
          </Link>
          <Link
            to="/manager/packages"
            className="btn-primary !px-4 !py-2.5 !rounded-xl text-sm"
          >
            Manage packages
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <KpiCard
          label="Total Earnings"
          tone="emerald"
          icon={<IndianRupee size={20} />}
          helper={
            pendingClearance > 0
              ? `₹${pendingClearance.toLocaleString()} pending clearance`
              : "All cleared"
          }
          value={
            <span>
              ₹
              <CountUp
                end={totalEarned}
                separator=","
                duration={1.8}
                preserveValue
              />
            </span>
          }
        />
        <KpiCard
          label="Events Managed"
          tone="violet"
          icon={<Layers3 size={20} />}
          helper="Completed events"
          value={<CountUp end={eventsCompleted} duration={1.4} preserveValue />}
        />
        <KpiCard
          label="Upcoming Events"
          tone="blue"
          icon={<CalendarDays size={20} />}
          helper="Accepted or confirmed"
          value={
            <CountUp end={upcomingEvents.length} duration={1.2} preserveValue />
          }
        />
        <KpiCard
          label="Pending Requests"
          tone="amber"
          icon={<ClipboardList size={20} />}
          helper="Need your response"
          value={
            <CountUp
              end={pendingRequests.length}
              duration={1.2}
              preserveValue
            />
          }
        />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <EarningsChart
          data={monthlyEarnings}
          subtitle="Last 12 months (completed bookings)"
        />
        <BookingsChart
          data={monthlyBookings}
          subtitle="Last 12 months (all non-rejected)"
        />
      </div>

      {/* Mix + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 items-start">
        <EventTypesChart
          data={eventTypeData}
          subtitle="Based on your bookings’ event categories"
        />

        <div className="glass-card rounded-2xl overflow-hidden ring-1 ring-indigo-500/10">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Calendar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Tap a date to block/unblock, or open a booked event.
                </p>
              </div>
              <Link
                to="/manager/calendar"
                className="text-sm font-bold text-primary hover:text-primary-hover"
              >
                Full view →
              </Link>
            </div>
          </div>
          <div className="px-2 sm:px-3 pb-4 sm:pb-5">
            {/* Re-mount calendar to fetch fresh availability if bookings change */}
            <ManagerCalendar
              key={bookings.length}
              isEmbedded={true}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 items-start">
        <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
        <BookingRequests
          bookings={pendingRequests}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>

      <EventDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        event={selectedEvent}
      />
    </PageWrapper>
  );
}
