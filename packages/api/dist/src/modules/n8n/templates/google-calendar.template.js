"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCalendarTemplate = void 0;
exports.googleCalendarTemplate = {
    nodes: [
        {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
                path: 'calendar-event',
                responseMode: 'lastNode',
            },
            position: [250, 300],
        },
        {
            id: 'gcal-create',
            type: 'n8n-nodes-base.googleCalendar',
            parameters: {
                authentication: 'serviceAccount',
                credentials: '{{$env.GOOGLE_CREDENTIALS}}',
                operation: 'create',
                calendar: '{{$env.GOOGLE_CALENDAR_ID}}',
                summary: '{{$node["webhook"].data.title}}',
                description: '{{$node["webhook"].data.description}}',
                start: '{{$node["webhook"].data.startTime}}',
                end: '{{$node["webhook"].data.endTime}}',
                attendees: '{{$node["webhook"].data.attendees}}',
            },
            position: [500, 300],
        },
        {
            id: 'notification',
            type: 'n8n-nodes-base.sendEmail',
            parameters: {
                fromEmail: '{{$env.NOTIFICATION_EMAIL}}',
                toEmail: '{{$node["webhook"].data.organizerEmail}}',
                subject: 'Event Created: {{$node["webhook"].data.title}}',
                text: 'Your event has been created successfully.',
            },
            position: [750, 300],
        },
    ],
    connections: {
        webhook: {
            main: [[{ node: 'gcal-create', type: 'main', index: 0 }]],
        },
        'gcal-create': {
            main: [[{ node: 'notification', type: 'main', index: 0 }]],
        },
    },
};
//# sourceMappingURL=google-calendar.template.js.map