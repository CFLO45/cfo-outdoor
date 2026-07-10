import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const lead = {
    name: body.name,
    email: body.email,
    phone: body.phone ?? null,
    listing_id: body.boardId ?? null,
    format: body.boardType ?? null,
    market: body.county ?? null,
    budget: body.budget ?? null,
    start_date: body.startDate ?? null,
    notes: body.notes ?? null,
    created_at: new Date().toISOString(),
  };

  // Save to Supabase
  if (supabase) {
    const { error } = await supabase.from("leads").insert(lead);
    if (error) {
      console.error("Supabase insert failed:", error.message);
    }
  } else {
    console.log("New lead (Supabase not configured):", lead);
  }

  // Send email notification via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      // Notify us
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "quotes@cfloutdoor.com",
          to: "info@cfloutdoor.com",
          subject: `New Quote Request from ${body.name}`,
          html: `
            <h2>New Quote Request</h2>
            <table style="border-collapse:collapse;width:100%;max-width:600px">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${body.name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${body.email}">${body.email}</a></td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${body.phone || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Board Type</td><td style="padding:8px;border:1px solid #ddd">${body.boardType || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">County</td><td style="padding:8px;border:1px solid #ddd">${body.county || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Budget</td><td style="padding:8px;border:1px solid #ddd">${body.budget || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Start Date</td><td style="padding:8px;border:1px solid #ddd">${body.startDate || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Board ID</td><td style="padding:8px;border:1px solid #ddd">${body.boardId || "—"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Notes</td><td style="padding:8px;border:1px solid #ddd">${body.notes || "—"}</td></tr>
            </table>
          `,
        }),
      });

      // Auto-reply to the client
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "info@cfloutdoor.com",
          to: body.email,
          reply_to: "info@cfloutdoor.com",
          subject: "We received your quote request — Central Florida Outdoor",
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2321">
              <div style="border-bottom:2px solid #B5462D;padding-bottom:16px;margin-bottom:24px">
                <h1 style="font-size:22px;margin:0">Central Florida <span style="color:#B5462D">Outdoor</span></h1>
                <p style="font-size:12px;color:#888;margin:4px 0 0">Independent OOH Advertising Broker</p>
              </div>

              <p>Hi ${body.name},</p>

              <p>Thank you for reaching out to Central Florida Outdoor. We've received your quote request and will follow up shortly with availability and pricing.</p>

              <p>In the meantime, feel free to browse our full inventory at <a href="https://cfloutdoor.com/map" style="color:#B5462D">cfloutdoor.com</a> or reply directly to this email with any questions.</p>

              <p style="margin-top:32px">
                Best regards,<br/>
                <strong>Central Florida Outdoor</strong><br/>
                <a href="mailto:info@cfloutdoor.com" style="color:#B5462D">info@cfloutdoor.com</a><br/>
                <a href="https://cfloutdoor.com" style="color:#B5462D">cfloutdoor.com</a>
              </p>

              <div style="border-top:1px solid #eee;margin-top:32px;padding-top:16px;font-size:11px;color:#aaa">
                <p>Central Florida Outdoor is an independent out-of-home advertising broker. All placements and pricing are subject to confirmation with the media owner. <a href="https://cfloutdoor.com/terms" style="color:#aaa">Terms of Service</a></p>
              </div>
            </div>
          `,
        }),
      });

    } catch (err) {
      console.error("Resend email failed:", err);
    }
  } else {
    console.log("Resend not configured — skipping email notification.");
  }

  return NextResponse.json({ ok: true });
}
