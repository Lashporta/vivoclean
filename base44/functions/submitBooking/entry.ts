import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    const name = (data.name || '').toString().trim();
    const email = (data.email || '').toString().trim();
    if (!name || !email) {
      return Response.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const phone = (data.phone || '').toString().trim();
    const address = (data.address || '').toString().trim();
    const preferredTime = (data.preferred_time || '').toString().trim();
    const service = (data.service || '').toString().trim();
    const message = (data.message || '').toString().trim();
    const hasVacuum = (data.has_vacuum || '').toString().trim();
    const promoCode = (data.promo_code || '').toString().trim();

    // Persist the booking request (service role so it works for any authenticated visitor)
    const record = await base44.asServiceRole.entities.BookingRequest.create({
      name,
      email,
      phone,
      address,
      preferred_time: preferredTime,
      service,
      message,
      has_vacuum: hasVacuum || 'No',
      promo_code: promoCode,
      status: 'new',
    });

    // Look up the business email to notify
    let businessEmail = 'info@vivoclean.cz';
    try {
      const contentList = await base44.asServiceRole.entities.SiteContent.list();
      if (contentList[0]?.email) businessEmail = contentList[0].email;
    } catch (_) { /* ignore — fall back to default */ }

    const body = [
      'A new cleaning quote request was submitted:',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      address ? `Address: ${address}` : '',
      service ? `Service: ${service}` : '',
      preferredTime ? `Preferred time: ${preferredTime}` : '',
      hasVacuum ? `Has own vacuum/mop: ${hasVacuum}` : '',
      promoCode ? `Promo code: ${promoCode}` : '',
      message ? `Message: ${message}` : '',
      '',
      'Review it in the admin dashboard.',
    ].filter(Boolean).join('\n');

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: businessEmail,
        subject: `New quote request from ${name}`,
        body,
      });
    } catch (mailErr) {
      // Record is still saved; surface a soft warning so the visitor is not blocked.
      return Response.json({ ok: true, id: record.id, warning: 'Saved but email could not be sent.' });
    }

    return Response.json({ ok: true, id: record.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}