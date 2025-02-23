import type { WorkflowConfig } from '../types/workflow.types';

export const emailAutomationTemplate: WorkflowConfig = {
	nodes: [
		{
			id: 'email-trigger',
			type: 'n8n-nodes-base.emailTrigger',
			parameters: {
				mailbox: '{{$env.IMAP_MAILBOX}}',
				credentials: {
					imap: '{{$env.IMAP_CREDENTIALS}}',
				},
			},
			position: [250, 300],
		},
		{
			id: 'filter',
			type: 'n8n-nodes-base.if',
			parameters: {
				conditions: [
					{
						value1: '{{$node["email-trigger"].data.subject}}',
						operation: 'contains',
						value2: '[URGENT]',
					},
				],
			},
			position: [500, 300],
		},
		{
			id: 'send-notification',
			type: 'n8n-nodes-base.sendEmail',
			parameters: {
				fromEmail: '{{$env.NOTIFICATION_EMAIL}}',
				toEmail: '{{$env.ALERT_EMAIL}}',
				subject: 'Urgent Email Received',
				text: 'Subject: {{$node["email-trigger"].data.subject}}\nFrom: {{$node["email-trigger"].data.from}}',
			},
			position: [750, 300],
		},
	],
	connections: {
		'email-trigger': {
			main: [[{ node: 'filter', type: 'main', index: 0 }]],
		},
		filter: {
			main: [[{ node: 'send-notification', type: 'main', index: 0 }]],
		},
	},
};
