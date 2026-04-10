import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const position = formData.get('position') as string;
        const portfolio = formData.get('portfolio') as string;
        const message = formData.get('message') as string;
        const resumeFile = formData.get('resume') as File | null;

        if (!name || !email || !position || !resumeFile) {
            return NextResponse.json({ message: 'Missing required fields or resume file' }, { status: 400 });
        }

        const emailPass = (process.env.EMAIL_PASS || '').trim();

        if (!emailPass) {
            console.error('SERVER ERROR: EMAIL_PASS is missing.');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: (process.env.EMAIL_USER || 'algorysoft@gmail.com').trim(),
                pass: emailPass,
            },
        });

        // Convert file buffer for nodemailer
        const bytes = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const mailOptions = {
            from: `"Career Application — ${name}" <${process.env.EMAIL_USER || 'algorysoft@gmail.com'}>`,
            to: 'algorysoft@gmail.com',
            replyTo: email,
            subject: `New Job Application: ${position} — ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #6db03a;">New Job Application</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Portfolio/GitHub:</strong> ${portfolio || 'N/A'}</p>
                    <p style="color: #6db03a; font-weight: bold;">📎 Resume attached to this email</p>
                    <hr style="border: 1px solid #f1f5f9; margin: 20px 0;">
                    <p><strong>Applicant Message:</strong></p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; color: #334155;">
                        ${(message || 'No message provided').replace(/\n/g, '<br />')}
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: resumeFile.name,
                    content: buffer,
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Application submitted successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending career email:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
