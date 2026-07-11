import { Resend } from 'resend';
import env from '../config/env.js';
import { sessionSummaryTemplate, reminderTemplate } from '../templates/emailTemplates.js';

let resendClient = null;

const getClient = () => {
    if (!resendClient) {
        if (!env.resendApiKey) {
            console.warn('RESEND_API_KEY not set. Emails will not be sent.');
            return null;
        }
        resendClient = new Resend(env.resendApiKey);
    }
    return resendClient;
};

export const sendSessionSummaryEmail = async (summary, student, session, tutor) => {
    const client = getClient();
    if (!client) {
        return { success: false, error: 'Email service not configured' };
    }

    if (!student.parentEmail) {
        return { success: false, error: 'No parent email on file' };
    }

    try {
        const html = sessionSummaryTemplate(summary, student, session, tutor);

        const result = await client.emails.send({
            from: env.resendFromEmail,
            to: student.parentEmail,
            subject: `Math Session Summary - ${student.name} - ${new Date(session.date).toLocaleDateString()}`,
            html,
        });

        return {
            success: true,
            emailId: result.data?.id || result.id,
        };
    } catch (error) {
        console.error('Email send error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

export const sendReminderEmail = async (student, session, tutor) => {
    const client = getClient();
    if (!client) {
        return { success: false, error: 'Email service not configured' };
    }

    if (!student.parentEmail) {
        return { success: false, error: 'No parent email on file' };
    }

    try {
        const html = reminderTemplate(student, session, tutor);

        const result = await client.emails.send({
            from: env.resendFromEmail,
            to: student.parentEmail,
            subject: `Session Reminder - ${student.name} - ${new Date(session.date).toLocaleDateString()}`,
            html,
        });

        return {
            success: true,
            emailId: result.data?.id || result.id,
        };
    } catch (error) {
        console.error('Reminder email error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

export const sendTestEmail = async (toEmail) => {
    const client = getClient();
    if (!client) {
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const result = await client.emails.send({
            from: env.resendFromEmail,
            to: toEmail,
            subject: 'Test Email - Math Tutor System',
            html: `
                <!DOCTYPE html>
                <html><head><meta charset="UTF-8"></head>
                <body style="font-family: sans-serif; text-align: center; padding: 40px;">
                    <h1>Email Integration Working!</h1>
                    <p>The Resend email service is configured correctly.</p>
                </body></html>`,
        });

        return {
            success: true,
            emailId: result.data?.id || result.id,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};
