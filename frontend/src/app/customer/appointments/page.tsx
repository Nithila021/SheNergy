'use client'

import { Calendar, MapPin, Clock, Phone, AlertCircle, Star, CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Dealership {
  id: string
  name: string
  distance: number
  waitDays: number
  hasAllParts: boolean
  rating: number
  availability: string
  estimatedCost: string
}

export default function CustomerAppointmentsPage() {
  const searchParams = useSearchParams()
  const showDealerships = searchParams.get('filter') === 'dealerships'
  const [selectedDealership, setSelectedDealership] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all')

  const dealerships: Dealership[] = [
    {
      id: '1',
      name: 'Bangalore EV Service Center',
      distance: 2.3,
      waitDays: 0,
      hasAllParts: true,
      rating: 4.8,
      availability: 'Ready',
      estimatedCost: '₹7,499',
    },
    {
      id: '2',
      name: 'Whitefield Tata Service',
      distance: 5.1,
      waitDays: 2,
      hasAllParts: false,
      rating: 4.5,
      availability: 'Delay - Missing parts',
      estimatedCost: '₹7,499',
    },
    {
      id: '3',
      name: 'Koramangala Auto Care',
      distance: 8.7,
      waitDays: 1,
      hasAllParts: true,
      rating: 4.6,
      availability: 'Ready',
      estimatedCost: '₹7,499',
    },
    {
      id: '4',
      name: 'Indiranagar Service Hub',
      distance: 12.3,
      waitDays: 5,
      hasAllParts: true,
      rating: 4.3,
      availability: 'Delayed',
      estimatedCost: '₹7,299',
    },
  ]

  const appointments = [
    {
      id: 1,
      date: 'Dec 18, 2024',
      time: '10:00 AM',
      dealership: 'Bangalore EV Service Center',
      service: 'Regular Maintenance',
      status: 'confirmed',
      phone: '+91 80 4040 4040',
    },
    {
      id: 2,
      date: 'Dec 25, 2024',
      time: '2:30 PM',
      dealership: 'Whitefield Tata Service',
      service: 'Brake Pad Replacement',
      status: 'pending',
      phone: '+91 80 2345 6789',
    },
    {
      id: 3,
      date: 'Jan 8, 2025',
      time: '9:30 AM',
      dealership: 'Bangalore EV Service Center',
      service: 'Battery Health Check',
      status: 'confirmed',
      phone: '+91 80 4040 4040',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">My Appointments</h1>
        <p className="text-gray-400">Manage and track your service appointments</p>
      </div>

      {/* Show Dealerships if Filter Active */}
      {showDealerships && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-light mb-1">Available Service Centers</h2>
              <p className="text-gray-400">Browse and select your preferred dealership</p>
            </div>
            <span className="badge badge-success">Filtered Results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dealerships.map((dealership) => (
              <div
                key={dealership.id}
                onClick={() => setSelectedDealership(dealership.id)}
                className={`glass-card-dark p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedDealership === dealership.id
                    ? 'border-electric-blue shadow-glow'
                    : 'border-electric-blue border-opacity-20 hover:border-opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-light">{dealership.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{dealership.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning-yellow fill-warning-yellow" />
                        <span className="text-sm text-text-light font-semibold">{dealership.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      dealership.hasAllParts ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {dealership.availability}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">
                    {dealership.hasAllParts ? (
                      <span className="flex items-center gap-2 text-neon-green">
                        <CheckCircle2 className="w-4 h-4" />
                        All parts in stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-warning-yellow">
                        <AlertCircle className="w-4 h-4" />
                        Wait: {dealership.waitDays} days
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Estimated Cost: {dealership.estimatedCost}</p>
                </div>

                <button
                  className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedDealership === dealership.id
                      ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                      : 'bg-card-dark border border-electric-blue text-electric-blue hover:bg-opacity-50'
                  }`}
                >
                  {selectedDealership === dealership.id ? '✓ Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          {selectedDealership && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neon-green to-electric-cyan bg-opacity-10 border border-neon-green border-opacity-40">
              <p className="text-text-light font-semibold mb-3">Ready to book?</p>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                Proceed to Booking
              </button>
            </div>
          )}
        </div>
      )}

      {!showDealerships && (
        <>
          {/* Action Buttons */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                Book New Appointment
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-electric-blue text-electric-blue hover:border-opacity-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'confirmed'
                    ? 'bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-neon-green text-neon-green hover:border-opacity-100'
                }`}
              >
                ✓ Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-gradient-to-r from-warning-yellow to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-warning-yellow text-warning-yellow hover:border-opacity-100'
                }`}
              >
                ⏳ Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-electric-blue text-electric-blue hover:border-opacity-100'
                }`}
              >
                ✅ Completed
              </button>
            </div>
          </div>

          {/* Appointments List */}
        </>
      )}

      {/* Appointments List */}
      {!showDealerships && (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">{appointment.service}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Right Side */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.dealership}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-card-dark border border-warning-yellow text-warning-yellow font-semibold hover:bg-opacity-50 transition-all">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!showDealerships && appointments.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No appointments scheduled</p>
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold">
            Book Your First Appointment
          </button>
        </div>
      )}
    </div>
  )
}
