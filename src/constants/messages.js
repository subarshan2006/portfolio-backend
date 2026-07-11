const MESSAGES = {
    // Auth
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    ALREADY_LOGGED_IN: 'Already logged in',

    // Tutor
    TUTOR_NOT_FOUND: 'Tutor not found',
    TUTOR_UPDATED: 'Tutor profile updated',
    SETTINGS_UPDATED: 'Settings updated successfully',

    // Student
    STUDENT_CREATED: 'Student created successfully',
    STUDENT_UPDATED: 'Student updated successfully',
    STUDENT_DELETED: 'Student deleted successfully',
    STUDENT_RESTORED: 'Student restored successfully',
    STUDENT_NOT_FOUND: 'Student not found',
    STUDENT_LIMIT_REACHED: 'Maximum student limit reached (10 students)',
    STUDENT_STATUS_UPDATED: 'Student status updated',

    // Session
    SESSION_CREATED: 'Session created successfully',
    SESSION_UPDATED: 'Session updated successfully',
    SESSION_CANCELLED: 'Session cancelled',
    SESSION_RESCHEDULED: 'Session rescheduled',
    SESSION_NOT_FOUND: 'Session not found',
    SESSION_CONFLICT: 'Session conflicts with existing session',
    SESSION_ALREADY_STARTED: 'Session already started',
    ATTENDANCE_MARKED: 'Attendance marked successfully',

    // Summary
    SUMMARY_CREATED: 'Session summary saved',
    SUMMARY_UPDATED: 'Session summary updated',
    SUMMARY_NOT_FOUND: 'Session summary not found',
    SUMMARY_EMAILED: 'Session summary sent via email',

    // Homework
    HOMEWORK_CREATED: 'Homework assigned successfully',
    HOMEWORK_UPDATED: 'Homework updated successfully',
    HOMEWORK_DELETED: 'Homework deleted',
    HOMEWORK_NOT_FOUND: 'Homework not found',
    HOMEWORK_MARKED_SUBMITTED: 'Homework marked as submitted',

    // Goal
    GOAL_CREATED: 'Goal created successfully',
    GOAL_UPDATED: 'Goal updated successfully',
    GOAL_DELETED: 'Goal deleted',
    GOAL_NOT_FOUND: 'Goal not found',

    // Notifications
    NOTIFICATION_READ: 'Notification marked as read',
    ALL_NOTIFICATIONS_READ: 'All notifications marked as read',
    NOTIFICATION_DELETED: 'Notification deleted',
    NOTIFICATION_NOT_FOUND: 'Notification not found',

    // Email
    EMAIL_SENT: 'Email sent successfully',
    EMAIL_FAILED: 'Failed to send email',
    EMAIL_TEST_SENT: 'Test email sent',

    // Backup
    BACKUP_CREATED: 'Backup created successfully',
    BACKUP_RESTORED: 'Backup restored successfully',
    BACKUP_NOT_FOUND: 'Backup not found',

    // General
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'Access forbidden',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
    DELETED_SUCCESSFULLY: 'Deleted successfully',
    UPDATED_SUCCESSFULLY: 'Updated successfully',
};

export default MESSAGES;
