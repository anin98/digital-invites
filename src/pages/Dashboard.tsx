import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Types
interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'attending' | 'not_attending' | 'pending';
  rsvpDate: string | null;
  plusOne: boolean;
}

interface Invitation {
  id: string;
  templateType: 'birthday-elegant' | 'wedding-romantic' | 'corporate-modern' | 'hangout';
  title: string;
  eventDate: string;
  createdAt: string;
  guests: Guest[];
  maxGuests: number;
  status: 'active' | 'expired' | 'draft';
}

// Template metadata
const TEMPLATE_INFO = {
  'birthday-elegant': { name: 'Birthday', emoji: '🎂', color: '#d4af37' },
  'wedding-romantic': { name: 'Wedding', emoji: '💒', color: '#e8b4b8' },
  'corporate-modern': { name: 'Corporate', emoji: '🏢', color: '#5dade2' },
  'hangout': { name: 'Hangout', emoji: '🎈', color: '#f39c12' },
};

const FREE_TIER_TOTAL_LIMIT = 30;

// Mock data - replace with API calls later
const MOCK_INVITATIONS: Invitation[] = [
  {
    id: 'inv-001',
    templateType: 'birthday-elegant',
    title: "Sarah's 30th Birthday",
    eventDate: '2026-12-25',
    createdAt: '2026-01-15',
    maxGuests: 10,
    status: 'active',
    guests: [
      { id: 'g1', name: 'John Smith', email: 'john@email.com', rsvpStatus: 'attending', rsvpDate: '2026-01-16', plusOne: true },
      { id: 'g2', name: 'Emily Davis', email: 'emily@email.com', rsvpStatus: 'attending', rsvpDate: '2026-01-17', plusOne: false },
      { id: 'g3', name: 'Michael Brown', email: 'michael@email.com', rsvpStatus: 'not_attending', rsvpDate: '2026-01-18', plusOne: false },
      { id: 'g4', name: 'Lisa Wilson', email: 'lisa@email.com', rsvpStatus: 'pending', rsvpDate: null, plusOne: false },
      { id: 'g5', name: 'David Lee', email: 'david@email.com', rsvpStatus: 'pending', rsvpDate: null, plusOne: false },
    ],
  },
  {
    id: 'inv-002',
    templateType: 'wedding-romantic',
    title: 'Emma & James Wedding',
    eventDate: '2026-06-15',
    createdAt: '2026-01-10',
    maxGuests: 12,
    status: 'active',
    guests: [
      { id: 'g6', name: 'Robert Johnson', email: 'robert@email.com', rsvpStatus: 'attending', rsvpDate: '2026-01-12', plusOne: true },
      { id: 'g7', name: 'Sarah Miller', email: 'sarah@email.com', rsvpStatus: 'attending', rsvpDate: '2026-01-13', plusOne: true },
      { id: 'g8', name: 'Chris Taylor', email: 'chris@email.com', rsvpStatus: 'pending', rsvpDate: null, plusOne: false },
    ],
  },
  {
    id: 'inv-003',
    templateType: 'corporate-modern',
    title: 'Annual Tech Conference 2026',
    eventDate: '2026-03-20',
    createdAt: '2026-01-05',
    maxGuests: 5,
    status: 'active',
    guests: [
      { id: 'g9', name: 'Jennifer White', email: 'jennifer@company.com', rsvpStatus: 'attending', rsvpDate: '2026-01-08', plusOne: false },
      { id: 'g10', name: 'Mark Anderson', email: 'mark@company.com', rsvpStatus: 'attending', rsvpDate: '2026-01-09', plusOne: false },
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [invitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [filterTemplate, setFilterTemplate] = useState<string>('all');

  // Calculate totals
  const totalInvitesSent = invitations.reduce((sum, inv) => sum + inv.guests.length, 0);
  const remainingInvites = FREE_TIER_TOTAL_LIMIT - totalInvitesSent;

  // Filter invitations
  const filteredInvitations = filterTemplate === 'all'
    ? invitations
    : invitations.filter(inv => inv.templateType === filterTemplate);

  // Get RSVP stats for an invitation
  const getRsvpStats = (guests: Guest[]) => {
    const attending = guests.filter(g => g.rsvpStatus === 'attending').length;
    const notAttending = guests.filter(g => g.rsvpStatus === 'not_attending').length;
    const pending = guests.filter(g => g.rsvpStatus === 'pending').length;
    return { attending, notAttending, pending };
  };

  // Overall stats
  const overallStats = {
    totalEvents: invitations.length,
    totalGuests: totalInvitesSent,
    attending: invitations.reduce((sum, inv) => sum + inv.guests.filter(g => g.rsvpStatus === 'attending').length, 0),
    pending: invitations.reduce((sum, inv) => sum + inv.guests.filter(g => g.rsvpStatus === 'pending').length, 0),
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>My Dashboard</h1>
          <button className="create-invite-btn" onClick={() => navigate('/templates')}>
            + Create New Invite
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">📨</div>
            <div className="stat-content">
              <span className="stat-value">{totalInvitesSent}/{FREE_TIER_TOTAL_LIMIT}</span>
              <span className="stat-label">Invitations Used</span>
            </div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{ width: `${(totalInvitesSent / FREE_TIER_TOTAL_LIMIT) * 100}%` }}
              />
            </div>
            {remainingInvites <= 5 && (
              <span className="stat-warning">
                {remainingInvites === 0 ? 'Limit reached!' : `Only ${remainingInvites} left`}
              </span>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎉</div>
            <div className="stat-content">
              <span className="stat-value">{overallStats.totalEvents}</span>
              <span className="stat-label">Active Events</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <span className="stat-value">{overallStats.attending}</span>
              <span className="stat-label">Attending</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-value">{overallStats.pending}</span>
              <span className="stat-label">Pending RSVP</span>
            </div>
          </div>
        </section>

        {/* Invitations List */}
        <section className="invitations-section">
          <div className="section-header">
            <h2>My Invitations</h2>
            <div className="filter-tabs">
              <button
                className={filterTemplate === 'all' ? 'active' : ''}
                onClick={() => setFilterTemplate('all')}
              >
                All
              </button>
              {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
                <button
                  key={key}
                  className={filterTemplate === key ? 'active' : ''}
                  onClick={() => setFilterTemplate(key)}
                >
                  {info.emoji} {info.name}
                </button>
              ))}
            </div>
          </div>

          <div className="invitations-grid">
            {filteredInvitations.map((invitation) => {
              const template = TEMPLATE_INFO[invitation.templateType];
              const stats = getRsvpStats(invitation.guests);

              return (
                <div
                  key={invitation.id}
                  className={`invitation-card ${selectedInvitation?.id === invitation.id ? 'selected' : ''}`}
                  onClick={() => setSelectedInvitation(invitation)}
                  style={{ '--accent-color': template.color } as React.CSSProperties}
                >
                  <div className="invitation-card-header">
                    <span className="template-badge">
                      {template.emoji} {template.name}
                    </span>
                    <span className={`status-badge ${invitation.status}`}>
                      {invitation.status}
                    </span>
                  </div>

                  <h3 className="invitation-title">{invitation.title}</h3>

                  <div className="invitation-meta">
                    <span>📅 {new Date(invitation.eventDate).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}</span>
                  </div>

                  <div className="invitation-stats">
                    <div className="rsvp-bar">
                      <div
                        className="rsvp-attending"
                        style={{ width: `${(stats.attending / invitation.guests.length) * 100}%` }}
                      />
                      <div
                        className="rsvp-pending"
                        style={{ width: `${(stats.pending / invitation.guests.length) * 100}%` }}
                      />
                    </div>
                    <div className="rsvp-numbers">
                      <span className="attending">{stats.attending} attending</span>
                      <span className="pending">{stats.pending} pending</span>
                      <span className="total">{invitation.guests.length} invited</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredInvitations.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No invitations found</p>
                <button onClick={() => navigate('/templates')}>Create your first invite</button>
              </div>
            )}
          </div>
        </section>

        {/* Guest List Panel */}
        {selectedInvitation && (
          <section className="guest-panel">
            <div className="guest-panel-header">
              <h2>Guest List - {selectedInvitation.title}</h2>
              <button className="close-panel" onClick={() => setSelectedInvitation(null)}>✕</button>
            </div>

            <div className="guest-panel-stats">
              <div className="guest-stat attending">
                <span className="count">{getRsvpStats(selectedInvitation.guests).attending}</span>
                <span className="label">Attending</span>
              </div>
              <div className="guest-stat not-attending">
                <span className="count">{getRsvpStats(selectedInvitation.guests).notAttending}</span>
                <span className="label">Not Attending</span>
              </div>
              <div className="guest-stat pending">
                <span className="count">{getRsvpStats(selectedInvitation.guests).pending}</span>
                <span className="label">Pending</span>
              </div>
            </div>

            <div className="guest-list">
              {selectedInvitation.guests.map((guest) => (
                <div key={guest.id} className={`guest-item ${guest.rsvpStatus}`}>
                  <div className="guest-avatar">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="guest-info">
                    <span className="guest-name">
                      {guest.name}
                      {guest.plusOne && <span className="plus-one">+1</span>}
                    </span>
                    <span className="guest-email">{guest.email}</span>
                  </div>
                  <div className="guest-rsvp">
                    <span className={`rsvp-status ${guest.rsvpStatus}`}>
                      {guest.rsvpStatus === 'attending' && '✓ Attending'}
                      {guest.rsvpStatus === 'not_attending' && '✗ Not Attending'}
                      {guest.rsvpStatus === 'pending' && '⏳ Pending'}
                    </span>
                    {guest.rsvpDate && (
                      <span className="rsvp-date">
                        {new Date(guest.rsvpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="guest-panel-actions">
              <button className="action-btn secondary">
                📋 Copy Invite Link
              </button>
              <button className="action-btn secondary">
                📧 Send Reminder
              </button>
              <button className="action-btn primary">
                ✏️ Edit Invitation
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Upgrade Banner */}
      {remainingInvites <= 10 && (
        <div className="upgrade-banner">
          <div className="upgrade-content">
            <span className="upgrade-icon">⭐</span>
            <div className="upgrade-text">
              <strong>Running low on invites?</strong>
              <span>Upgrade to Pro for unlimited invitations and premium features</span>
            </div>
            <button className="upgrade-btn">Upgrade Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
