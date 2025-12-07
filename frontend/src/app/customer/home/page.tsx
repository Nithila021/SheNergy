'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Zap, MapPin, Calendar, ChevronRight, Zap as ZapIcon } from 'lucide-react'
import SheNergyAssist from '@/components/SheNergyAssistV3'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'

interface Recommendation {
  service_code: string
  description?: string
  estimated_cost?: number
  urgency_score?: number
}

interface Appointment {
  id: string
  dealership_name: string
  requested_datetime: string
}

export default function CustomerHomePage() {
  const { customer } = useAuth()
  const [triggerChatbot, setTriggerChatbot] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const primaryVehicle = useMemo(() => customer?.vehicles?.[0], [customer]) as
    | { vin: string; model: string; year: number }
    | undefined

  useEffect(() => {
    const load = async () => {
      if (!customer || !primaryVehicle) return
      setLoading(true)
      setError(null)
      try {
        const [pred, appts] = await Promise.all([
          api.predictMaintenance({ customer_id: customer.customer_id, vin: primaryVehicle.vin }) as any,
          api.listAppointments(customer.customer_id) as any,
        ])

        setRecommendations(pred?.recommendations || [])
        setAppointments(appts?.appointments || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load vehicle insights')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [customer, primaryVehicle])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-dark bg-opacity-80 backdrop-blur-md border-b border-electric-blue border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-light">
              {customer ? `Welcome, ${customer.name}` : 'Welcome'}
            </h1>
            <p className="text-sm text-gray-400">Your vehicle health status</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
              <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
              <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Card */}
        <div className="mb-8 glass-card-dark p-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Image */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-full h-48 bg-gradient-to-br from-electric-blue to-electric-cyan opacity-10 rounded-xl flex items-center justify-center">
                <svg className="w-24 h-24 text-electric-blue opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-text-light mb-4">
                {primaryVehicle
                  ? `${primaryVehicle.year} ${primaryVehicle.model}`
                  : 'No vehicle on file'}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Customer ID</p>
                  <p className="text-lg font-semibold text-electric-blue">{customer?.customer_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">VIN</p>
                  <p className="text-lg font-semibold text-electric-blue">{primaryVehicle?.vin || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg font-semibold text-neon-green">{customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-lg font-semibold text-neon-green">{customer?.phone}</p>
                </div>
              </div>

              {/* Health Indicators */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center shadow-glow-green">
                    <span className="text-sm font-bold text-primary-dark">98%</span>
                  </div>
                  <span className="text-sm text-gray-400">Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center shadow-glow">
                    <span className="text-sm font-bold text-primary-dark">95%</span>
                  </div>
                  <span className="text-sm text-gray-400">Battery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning-yellow to-electric-cyan flex items-center justify-center shadow-glow-yellow">
                    <span className="text-sm font-bold text-primary-dark">72%</span>
                  </div>
                  <span className="text-sm text-gray-400">Brakes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Book Now */}
        <div className="mb-8 bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-40 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-light mb-2">Ready to Schedule Service?</h2>
              <p className="text-gray-300">Get predictive maintenance recommendations and book with the best dealership</p>
            </div>
            <button
              onClick={() => setTriggerChatbot(true)}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-bold text-lg shadow-glow hover:scale-105 transition-transform whitespace-nowrap"
            >
              📅 Book Now
            </button>
          </div>
        </div>

        {/* Alert Section - from predictive recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8 glass-card-dark p-6 rounded-2xl border-l-4 border-warning-yellow">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning-yellow flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-light mb-2">Maintenance Alerts</h3>
                <ul className="text-gray-300 mb-4 space-y-1">
                  {recommendations.map((rec) => (
                    <li key={rec.service_code} className="text-sm">
                      <span className="font-semibold text-text-light">{rec.service_code}</span>
                      {rec.description ? ` – ${rec.description}` : ''}
                      {typeof rec.estimated_cost === 'number' && ` • Est. ₹${rec.estimated_cost.toLocaleString('en-IN')}`}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTriggerChatbot(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform"
                  >
                    Book Service
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Book Service */}
          <div className="glass-card p-6 rounded-xl hover:shadow-glow transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center group-hover:shadow-glow-green transition-all">
                <Calendar className="w-6 h-6 text-primary-dark" />
              </div>
              <ChevronRight className="w-5 h-5 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Book Service</h3>
            <p className="text-sm text-gray-400">Schedule maintenance with nearby dealerships</p>
          </div>

          {/* Service History */}
          <div className="glass-card p-6 rounded-xl hover:shadow-glow transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center group-hover:shadow-glow transition-all">
                <Zap className="w-6 h-6 text-primary-dark" />
              </div>
              <ChevronRight className="w-5 h-5 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Service History</h3>
            <p className="text-sm text-gray-400">View all past maintenance records</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card-dark p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-text-light mb-6">Upcoming Appointments</h3>
          {loading && <p className="text-sm text-gray-400">Loading your appointments…</p>}
          {error && !loading && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && appointments.length === 0 && (
            <p className="text-sm text-gray-400">No upcoming appointments yet.</p>
          )}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-light">{appointment.dealership_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(appointment.requested_datetime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Chatbot - Triggered from CTA */}
      {triggerChatbot && primaryVehicle && customer && (
        <SheNergyAssist triggerBooking={true} customerId={customer.customer_id} vin={primaryVehicle.vin} />
      )}
    </div>
  )
}
