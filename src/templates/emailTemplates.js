import { formatDate } from '../utils/dateUtils.js';

const baseStyles = `
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: 600; color: #555; }
        .info-value { color: #333; }
        .rating { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600; }
        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; }
        .section h3 { margin: 0 0 10px 0; color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .section p { margin: 0; color: #333; line-height: 1.6; }
        .footer { padding: 20px 30px; background: #f8f9fa; text-align: center; color: #888; font-size: 12px; }
        .divider { height: 1px; background: #eee; margin: 20px 0; }
    </style>
`;

export const sessionSummaryTemplate = (summary, student, session, tutor) => {
    const sessionDate = formatDate(new Date(session.date));

    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8">${baseStyles}</head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Session Summary</h1>
            </div>
            <div class="content">
                <p>Dear ${student.parentName || 'Parent'},</p>
                <p>Here is the summary of ${student.name}'s math tutoring session.</p>

                <div class="divider"></div>

                <div class="info-row">
                    <span class="info-label">Student:</span>
                    <span class="info-value">${student.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${sessionDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">${session.startTime} - ${session.endTime}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tutor:</span>
                    <span class="info-value">${tutor.name}</span>
                </div>

                <div class="divider"></div>

                <div class="section">
                    <h3>Topics Covered</h3>
                    <p>${summary.topicsCovered}</p>
                </div>

                ${summary.topicsPlanned ? `
                <div class="section">
                    <h3>Topics Planned</h3>
                    <p>${summary.topicsPlanned}</p>
                </div>` : ''}

                ${summary.performanceNotes ? `
                <div class="section">
                    <h3>Performance Notes</h3>
                    <p>${summary.performanceNotes}</p>
                </div>` : ''}

                <div style="display: flex; gap: 10px; margin: 20px 0;">
                    ${summary.understandingLevel ? `<div class="section" style="flex:1; text-align:center; border-left: 4px solid #28a745;">
                        <h3>Understanding</h3>
                        <p style="font-size: 24px; margin: 5px 0;">${summary.understandingLevel}/5</p>
                    </div>` : ''}
                </div>

                ${summary.areasOfStrength ? `
                <div class="section">
                    <h3>Areas of Strength</h3>
                    <p>${summary.areasOfStrength}</p>
                </div>` : ''}

                ${summary.areasForImprovement ? `
                <div class="section">
                    <h3>Areas for Improvement</h3>
                    <p>${summary.areasForImprovement}</p>
                </div>` : ''}

                ${summary.homeworkSummary ? `
                <div class="section">
                    <h3>Homework</h3>
                    <p>${summary.homeworkSummary}</p>
                </div>` : ''}

                ${summary.nextSessionPlan ? `
                <div class="section">
                    <h3>Plan for Next Session</h3>
                    <p>${summary.nextSessionPlan}</p>
                </div>` : ''}
            </div>
            <div class="footer">
                <p>This is an automated message from ${tutor.name}'s Math Tutoring System.</p>
                <p>If you have questions, please reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export const reminderTemplate = (student, session, tutor) => {
    const sessionDate = formatDate(new Date(session.date));

    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8">${baseStyles}</head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Session Reminder</h1>
            </div>
            <div class="content">
                <p>Dear ${student.parentName || 'Parent'},</p>
                <p>This is a friendly reminder about ${student.name}'s upcoming math tutoring session.</p>

                <div class="divider"></div>

                <div class="info-row">
                    <span class="info-label">Student:</span>
                    <span class="info-value">${student.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${sessionDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">${session.startTime} - ${session.endTime}</span>
                </div>
                ${session.topicPlanned ? `
                <div class="info-row">
                    <span class="info-label">Topic:</span>
                    <span class="info-value">${session.topicPlanned}</span>
                </div>` : ''}

                <div class="divider"></div>

                <p>Please ensure ${student.name} is prepared with any required materials.</p>
            </div>
            <div class="footer">
                <p>Automated reminder from ${tutor.name}'s Math Tutoring System.</p>
            </div>
        </div>
    </body>
    </html>`;
};
