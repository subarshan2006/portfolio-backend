import sessionRepository from '../repositories/sessionRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import * as notificationService from './notificationService.js';
import { sendReminderEmail } from './emailService.js';
import { addDays, formatDate } from '../utils/dateUtils.js';

export const checkUpcomingReminders = async () => {
    const tomorrow = addDays(new Date(), 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = addDays(tomorrow, 1);

    const sessions = await sessionRepository.findUpcomingSessionsForReminders(tomorrow, dayAfterTomorrow);

    let remindersSent = 0;

    for (const session of sessions) {
        try {
            const student = await studentRepository.findByIdAndTutor(session.studentId, session.tutorId);
            if (!student) continue;

            const sessionDate = formatDate(new Date(session.date));

            await notificationService.createNotification(session.tutorId, {
                type: 'SESSION_REMINDER',
                title: `Tomorrow: Session with ${student.name}`,
                message: `${student.name} has a session tomorrow at ${session.startTime} - ${session.endTime}`,
                priority: 'MEDIUM',
                entityId: session._id,
                entityType: 'SESSION',
                metadata: { studentId: student._id, date: session.date, startTime: session.startTime },
            });

            if (student.parentEmail) {
                await sendReminderEmail(student, session, { name: session.tutorId.toString() });
            }

            remindersSent++;
        } catch (error) {
            console.error(`Reminder failed for session ${session._id}:`, error.message);
        }
    }

    return { remindersSent };
};

export const checkMissedSessions = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missedSessions = await sessionRepository.findMissedSessionsForDate(yesterday, today);

    let notificationsCreated = 0;

    for (const session of missedSessions) {
        try {
            await notificationService.createNotification(session.tutorId, {
                type: 'SESSION_MISSED',
                title: `Missed session`,
                message: `Session on ${formatDate(new Date(session.date))} was not completed`,
                priority: 'HIGH',
                entityId: session._id,
                entityType: 'SESSION',
                metadata: { studentId: session.studentId, date: session.date },
            });
            notificationsCreated++;
        } catch (error) {
            console.error(`Missed session notification failed for ${session._id}:`, error.message);
        }
    }

    return { notificationsCreated };
};

export const checkStudentBirthdays = async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const students = await studentRepository.findByBirthdate(month, day);

    let birthdayNotifications = 0;

    for (const student of students) {
        try {
            await notificationService.createNotification(student.tutorId, {
                type: 'BIRTHDAY',
                title: `Happy Birthday ${student.name}!`,
                message: `Today is ${student.name}'s birthday`,
                priority: 'LOW',
                entityId: student._id,
                entityType: 'STUDENT',
                metadata: { studentName: student.name },
            });
            birthdayNotifications++;
        } catch (error) {
            console.error(`Birthday notification failed for ${student._id}:`, error.message);
        }
    }

    return { birthdayNotifications };
};

export const checkOverdueHomework = async () => {
    const Session = (await import('../models/Session.js')).default;

    const overdueSessions = await Session.find({
        homeworkStatus: 'ASSIGNED',
        status: 'COMPLETED',
        date: { $lte: addDays(new Date(), -3) },
        deletedAt: null,
    }).populate('studentId', 'name');

    let notificationsCreated = 0;

    for (const session of overdueSessions) {
        try {
            await notificationService.createNotification(session.tutorId, {
                type: 'HOMEWORK_OVERDUE',
                title: `Homework overdue - ${session.studentId?.name || 'Student'}`,
                message: `Homework from session on ${formatDate(new Date(session.date))} is overdue`,
                priority: 'HIGH',
                entityId: session._id,
                entityType: 'HOMEWORK',
                metadata: { studentId: session.studentId?._id, date: session.date },
            });
            notificationsCreated++;
        } catch (error) {
            console.error(`Overdue homework notification failed for ${session._id}:`, error.message);
        }
    }

    return { notificationsCreated };
};
