import cron from 'node-cron';
import { checkUpcomingReminders, checkMissedSessions, checkStudentBirthdays, checkOverdueHomework } from '../services/reminderService.js';

const scheduledJobs = [];

export const startCronJobs = () => {
    console.log('[CRON] Starting scheduled jobs...');

    // Session reminders - daily at 8:00 PM (remind for next day's sessions)
    const reminderJob = cron.schedule('0 20 * * *', async () => {
        console.log('[CRON] Running session reminders...');
        try {
            const result = await checkUpcomingReminders();
            console.log(`[CRON] Sent ${result.remindersSent} session reminders`);
        } catch (error) {
            console.error('[CRON] Reminder job failed:', error.message);
        }
    }, { timezone: 'Asia/Kolkata' });

    // Missed session check - daily at 9:00 AM
    const missedJob = cron.schedule('0 9 * * *', async () => {
        console.log('[CRON] Checking for missed sessions...');
        try {
            const result = await checkMissedSessions();
            console.log(`[CRON] Created ${result.notificationsCreated} missed session notifications`);
        } catch (error) {
            console.error('[CRON] Missed session check failed:', error.message);
        }
    }, { timezone: 'Asia/Kolkata' });

    // Student birthdays - daily at 7:00 AM
    const birthdayJob = cron.schedule('0 7 * * *', async () => {
        console.log('[CRON] Checking student birthdays...');
        try {
            const result = await checkStudentBirthdays();
            console.log(`[CRON] Created ${result.birthdayNotifications} birthday notifications`);
        } catch (error) {
            console.error('[CRON] Birthday check failed:', error.message);
        }
    }, { timezone: 'Asia/Kolkata' });

    // Overdue homework check - daily at 10:00 AM
    const homeworkJob = cron.schedule('0 10 * * 1', async () => {
        console.log('[CRON] Checking overdue homework...');
        try {
            const result = await checkOverdueHomework();
            console.log(`[CRON] Created ${result.notificationsCreated} overdue homework notifications`);
        } catch (error) {
            console.error('[CRON] Homework check failed:', error.message);
        }
    }, { timezone: 'Asia/Kolkata' });

    scheduledJobs.push(reminderJob, missedJob, birthdayJob, homeworkJob);

    console.log('[CRON] 4 jobs scheduled:');
    console.log('  - Session reminders: daily at 20:00 IST');
    console.log('  - Missed sessions: daily at 09:00 IST');
    console.log('  - Student birthdays: daily at 07:00 IST');
    console.log('  - Overdue homework: weekly Monday at 10:00 IST');
};

export const stopCronJobs = () => {
    scheduledJobs.forEach((job) => job.stop());
    scheduledJobs.length = 0;
    console.log('[CRON] All jobs stopped');
};
