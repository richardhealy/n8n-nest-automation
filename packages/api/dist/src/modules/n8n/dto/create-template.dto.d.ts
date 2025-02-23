import { WorkflowConfig } from '../types/workflow.types';
export declare class CreateTemplateDto {
    name: string;
    description: string;
    tags: string[];
    config: WorkflowConfig;
    organizationId: string;
}
