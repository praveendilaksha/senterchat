/**
 * GenUI / A2UI Component Dispatcher for Senter AI
 * Strictly triggers rich interactive UI components ONLY when the user explicitly has a high-intent request
 * (e.g. buying tickets, viewing lineup, directions map, VIP booking).
 * Excludes support, policy, refund, or general informational inquiries.
 */

class GenUIService {
  static getUIComponent(query) {
    const q = (query || '').toLowerCase().trim();

    // 0. Support & Policy Exclusion Filter
    // Never show commercial action cards (like buy tickets or book tables) if the user is asking support/policy questions
    const isSupportOrPolicy = /\b(refund|refunds|cancel|cancellation|cancellations|transfer|transfers|resell|reselling|resale|lost|stolen|id|identification|age|rules|policy|policies|terms|conditions|security|prohibited|allowed|entry requirement|dress code|parking pass|weather)\b/i;

    // 1. Ticket Tiers Component
    // Trigger ONLY on explicit pricing, buying, tier selection, or presave inquiry
    if (!isSupportOrPolicy.test(q)) {
      const explicitTicketIntent = /\b(price|prices|pricing|how much|cost|costs|buy|buy ticket|buy tickets|purchase|purchase ticket|presave|pre-save|pre save|ticket tiers|pass tiers|ticket options|ticket rates|pass rates|ga price|vip price|ticket info|admission price|how to get tickets|where to get tickets)\b/i;
      const isExactTicketWord = /^(tickets|ticket|passes|pass|pricing|prices|buy)$/i.test(q);

      if (explicitTicketIntent.test(q) || isExactTicketWord) {
        return {
          type: 'ticket_tiers',
          title: 'Phase 1 Passes & Admission',
          subtitle: 'Pre-registration is open. 24h early access applies.',
          tiers: [
            {
              id: 'ga',
              name: 'General Admission',
              tag: 'Phase 1 Tier',
              price: 'LKR 15,000',
              priceSub: 'Per pass',
              featured: false,
              features: [
                'Main Stage Arena access',
                'Halloween Experience Zone',
                'F&B Village & food stalls',
                'Hydration points access'
              ],
              ctaText: 'Pre-Save GA',
              ctaUrl: 'https://www.sentermusicfestival.com/tickets'
            },
            {
              id: 'vip',
              name: 'VIP Pass',
              tag: 'Most Popular',
              price: 'LKR 45,000',
              priceSub: 'Per pass',
              featured: true,
              features: [
                'Elevated VIP Sky Lounge',
                'Express fast-track gate entry',
                'Dedicated VIP bars & restrooms',
                'Panoramic pyro sightlines',
                'Complimentary welcome drink'
              ],
              ctaText: 'Pre-Save VIP',
              ctaUrl: 'https://www.sentermusicfestival.com/tickets'
            },
            {
              id: 'vvip',
              name: 'VVIP Tables & Cabanas',
              tag: 'Ultra Luxury',
              price: 'Custom',
              priceSub: 'Concierge booking',
              featured: false,
              features: [
                'Private reserved cabana / table',
                'Dedicated bottle service & staff',
                'Prime ultra-VIP stage view',
                'Direct WhatsApp concierge'
              ],
              ctaText: 'WhatsApp Concierge',
              ctaUrl: 'https://wa.me/94771177118'
            }
          ]
        };
      }
    }

    // 2. VIP Concierge Component
    // Trigger ONLY on explicit VIP table, cabana, bottle service, or concierge contact inquiry
    const explicitVIPIntent = /\b(vip table|vip tables|cabana|cabanas|bottle service|table reservation|table reservations|table booking|table bookings|vip contact|whatsapp concierge|book table|reserve table)\b/i;
    if (explicitVIPIntent.test(q)) {
      return {
        type: 'vip_concierge',
        title: 'VIP Concierge & Table Reservations',
        subtitle: 'Direct personalized booking & concierge service',
        phone: '+94 77 117 7118',
        whatsappUrl: 'https://wa.me/94771177118',
        perks: [
          'Reserved private cabanas & tables',
          'Dedicated bottle service & waitstaff',
          'Express VIP priority access & dedicated parking',
          'Custom corporate & group VIP packages'
        ],
        ctaText: 'Chat on WhatsApp',
        ctaUrl: 'https://wa.me/94771177118'
      };
    }

    // 3. Artist / Lineup Spotlight Component
    // Trigger ONLY when asking about DJ Snake, headliner profile, or full lineup overview
    const isSpecificSupportingArtist = /\b(flecan|dj mass|mass|pem kekula|supporting acts|support acts)\b/i.test(q) && !q.includes('lineup') && !q.includes('snake');
    if (!isSpecificSupportingArtist) {
      const explicitLineupIntent = /\b(who is headlining|headliner|lineup|line-up|who is performing|artists lineup|performer lineup|snake hits|snake songs|billion streams|tell me about dj snake|who is dj snake)\b/i;
      const isExactLineupWord = /^(lineup|artists|artist|dj snake|snake|headliner)$/i.test(q);

      if (explicitLineupIntent.test(q) || isExactLineupWord) {
        return {
          type: 'artist_spotlight',
          artist: 'DJ Snake',
          role: 'Main Act · Headliner',
          tag: 'Billion Streams Club',
          description: 'Multi-platinum French hitmaker with over 60M followers performing an exclusive 2-night headline set.',
          hits: [
            { title: 'Let Me Love You', streams: '3.17B' },
            { title: 'Lean On', streams: '2.76B' },
            { title: 'Taki Taki', streams: '1.86B' },
            { title: 'Middle', streams: '1.33B' },
            { title: 'Turn Down for What', streams: '1.20B' },
            { title: 'Loco Contigo', streams: '995M' }
          ],
          supporting: [
            { name: 'DJ Mass', note: 'Producer of #1 EDM hit Pem Kekula' },
            { name: 'Flecan', note: 'Regional electronic artist' },
            { name: '+5 Support Acts', note: 'To be revealed' }
          ],
          ctaText: 'Book Tickets to DJ Snake',
          ctaUrl: 'https://www.sentermusicfestival.com/tickets'
        };
      }
    }

    // 4. Venue & Schedule Component
    // Trigger ONLY when asking about venue location, map/directions, or event operating hours
    const explicitVenueIntent = /\b(where is the festival|where is it|venue location|venue address|how to get to|directions|google map|event timings|festival hours|gate opening|what time do gates open|opening time|festival schedule|event schedule|what time does it start|when does it start)\b/i;
    const isExactVenueWord = /^(venue|location|schedule|timings|address|map)$/i.test(q);

    if (explicitVenueIntent.test(q) || isExactVenueWord) {
      return {
        type: 'venue_schedule',
        venueName: 'Port City Colombo',
        address: 'Colombo 00100, Western Province, Sri Lanka',
        dates: 'October 30 & 31, 2026',
        edition: 'Halloween 2-Day Edition',
        hours: '6:00 PM – 2:00 AM Daily',
        gateTimes: 'Gates open 3:00 PM · Entry from 5:00 PM',
        expectedCrowd: '30,000+ Electronic Music Fans',
        mapUrl: 'https://maps.google.com/?q=Port+City+Colombo+Sri+Lanka',
        ctaText: 'Pre-Save Tickets',
        ctaUrl: 'https://www.sentermusicfestival.com/tickets'
      };
    }

    // 5. Festival Zones Component
    // Trigger ONLY when explicitly exploring festival zones/areas
    const explicitZoneIntent = /\b(what are the zones|festival zones|7 zones|explore zones|zones and stages|festival areas|experience zones)\b/i;
    const isExactZoneWord = /^(zones|zone|stages)$/i.test(q);

    if (explicitZoneIntent.test(q) || isExactZoneWord) {
      return {
        type: 'zone_explorer',
        title: '7 Immersive Festival Zones',
        subtitle: 'Explore the festival ecosystem at Port City Colombo',
        zones: [
          { num: '01', name: 'Main Stage Arena', desc: 'Central ground with international audio-visual array & pyro.' },
          { num: '02', name: 'VIP Sky Lounge', desc: 'Elevated deck with private bars & panoramic stage view.' },
          { num: '03', name: 'Halloween Experience', desc: 'Themed walkthroughs, interactive installations & live actors.' },
          { num: '04', name: 'F&B Village', desc: 'International and local culinary stalls with hydration bars.' },
          { num: '05', name: 'Brand Activations', desc: 'Interactive sponsor pop-ups, games & festival merch.' },
          { num: '06', name: 'Content Creation', desc: '360 video pods and aesthetic neon backdrops for creators.' },
          { num: '07', name: 'Influencer Lounge', desc: 'Selective networking hub for creators, artists & VIP media.' }
        ]
      };
    }

    return null;
  }
}

module.exports = GenUIService;
