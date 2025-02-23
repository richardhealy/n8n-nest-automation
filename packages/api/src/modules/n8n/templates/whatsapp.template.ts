import { WorkflowConfig } from '../types/workflow.types';

export const whatsappTemplate: WorkflowConfig = {
  nodes: [
    {
      id: 'whatsapp-trigger',
      type: 'n8n-nodes-base.whatsappTrigger',
      parameters: {
        phoneNumberId: '{{$env.WHATSAPP_PHONE_ID}}',
        event: ['messages'],
      },
      position: [250, 300],
    },
    {
      id: 'whatsapp-send',
      type: 'n8n-nodes-base.whatsapp',
      parameters: {
        phoneNumberId: '{{$env.WHATSAPP_PHONE_ID}}',
        text: '{{$node["whatsapp-trigger"].data.message}}',
      },
      position: [500, 300],
    },
  ],
  connections: {
    'whatsapp-trigger': {
      main: [
        [
          {
            node: 'whatsapp-send',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
  },
}; 