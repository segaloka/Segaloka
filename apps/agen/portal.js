/* Role entry — Agen. Existing V7 routes only; no new behavior. */
route('/p/agen', () => ({ html: maHome('agen') }));
route('/p/agen/packages', () => ({ html: maPackages('agen') }));
route('/p/agen/bookings', () => ({ html: maBookings('agen') }));
route('/p/agen/commission', () => ({ html: maCommission('agen') }));
