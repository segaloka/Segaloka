/* Role entry — Mitra Travel. Existing V7 routes only; no new behavior. */
route('/p/mitra', () => ({ html: maHome('mitra') }));
route('/p/mitra/packages', () => ({ html: maPackages('mitra') }));
route('/p/mitra/bookings', () => ({ html: maBookings('mitra') }));
route('/p/mitra/commission', () => ({ html: maCommission('mitra') }));
