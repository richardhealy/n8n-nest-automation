"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiTemplate = void 0;
exports.openaiTemplate = {
    nodes: [
        {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: {
                path: 'ai-process',
                responseMode: 'lastNode',
            },
            position: [250, 300],
        },
        {
            id: 'openai',
            type: 'n8n-nodes-base.openAi',
            parameters: {
                apiKey: '{{$env.OPENAI_API_KEY}}',
                prompt: '{{$node["webhook"].data.prompt}}',
                model: 'gpt-4',
            },
            position: [500, 300],
        },
    ],
    connections: {
        webhook: {
            main: [
                [
                    {
                        node: 'openai',
                        type: 'main',
                        index: 0,
                    },
                ],
            ],
        },
    },
};
//# sourceMappingURL=openai.template.js.map