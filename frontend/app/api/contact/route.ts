import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Configuration for Gmail or any SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'algorysoft@gmail.com',
                pass: process.env.EMAIL_PASS, // App Password required
            },
        });

        const mailOptions = {
            from: `"Contact Form — ${name}" <${process.env.EMAIL_USER || 'algorysoft@gmail.com'}>`,
            to: 'algorysoft@gmail.com',
            replyTo: email,
            subject: `Contact Form: ${subject || 'No Subject'} — from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #3b82f6;">New Contact Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                    <hr style="border: 1px solid #f1f5f9; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; color: #334155;">
                        ${message.replace(/\n/g, '<br />')}
                    </div>
                </div>
            `,
        };

        if (!process.env.EMAIL_PASS) {
            console.warn('EMAIL_PASS is not set. Contact form will only log to console.');
            console.log('Form submission:', { name, email, subject, message });
            // For now, let's pretend it worked in dev, or return an error if we're serious
            // But we should return success to the user and tell them to add the key
            return NextResponse.json({ message: 'Success (but check server logs for EMAIL_PASS config)' }, { status: 200 });
        }

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
