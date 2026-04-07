import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { toEmail, clientName, requestId, status, requirements, business, budget, timeline } = await req.json();

        if (!toEmail || !clientName || !requestId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const emailPass = (process.env.EMAIL_PASS || '').trim();
        const emailUser = (process.env.EMAIL_USER || 'algorysoft@gmail.com').trim();

        if (!emailPass) {
            console.error('SERVER ERROR: EMAIL_PASS is not set.');
            return NextResponse.json({ 
                message: 'Server configuration error: Email cannot be sent at this time.' 
            }, { status: 500 });
        }

        // Configuration for Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass, // Google App Password
            },
        });

        // Determine status text for the email
        let statusDisplay = status;
        if (status === 'In Development') statusDisplay = 'Accepted & Converted to Order';

        const mailOptions = {
            from: `"AlgorySoft Team" <${emailUser}>`,
            to: toEmail,
            subject: `Update on your Custom Project Request #${requestId} — AlgorySoft`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1a1a1a; max-width: 650px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #673ab7; margin: 0; font-size: 24px;">AlgorySoft</h1>
                        <p style="color: #64748b; margin: 4px 0 0 0;">Business Web Solutions</p>
                    </div>

                    <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px;">Hello ${clientName},</h2>
                    <p style="line-height: 1.6; color: #334155;">Thank you for reaching out to AlgorySoft. We've updated the status of your custom project request <strong>#${requestId}</strong>.</p>
                    
                    <div style="background-color: #f5f3ff; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #673ab7;">
                        <p style="margin: 0; font-size: 16px;"><strong>Current Status:</strong> <span style="color: #673ab7; font-weight: 700;">${statusDisplay}</span></p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 16px;">Project Overview</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; width: 100px;">Business:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-weight: 500;">${business || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;">Budget:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-weight: 500;">${budget || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;">Timeline:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-weight: 500;">${timeline || 'N/A'}</td>
                            </tr>
                        </table>

                        <h3 style="margin-top: 24px; font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 16px;">Project Requirements</h3>
                        <div style="color: #334155; line-height: 1.6; font-style: italic; white-space: pre-wrap;">
                            ${requirements}
                        </div>
                    </div>

                    <p style="margin-top: 32px; line-height: 1.6; color: #334155;">
                        Our team is reviewing your requirements to provide the best possible solution. If you have any additional details or questions, please feel free to reply to this email or contact us via WhatsApp.
                    </p>
                    
                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">Best Regards,</p>
                        <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 700; font-size: 16px;">The AlgorySoft Team</p>
                        <div style="margin-top: 16px;">
                            <a href="https://algorysoft.com" style="color: #673ab7; text-decoration: none; font-weight: 500; font-size: 14px;">Website</a>
                            <span style="margin: 0 8px; color: #cbd5e1;">&bull;</span>
                            <a href="mailto:${emailUser}" style="color: #673ab7; text-decoration: none; font-weight: 500; font-size: 14px;">Support</a>
                        </div>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully via AlgorySoft!' }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending request email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
