declare class WorkflowNode {
    id: string;
    name: string;
    type: string;
    parameters: Record<string, any>;
    position: {
        x: number;
        y: number;
    };
}
declare class WorkflowConnections {
    node: string;
    type: string;
    items: Array<{
        node: string;
        type: string;
        index: number;
    }>;
}
declare class WorkflowSettings {
    saveExecutionProgress?: boolean;
    saveManualExecutions?: boolean;
    saveDataErrorExecution?: string;
    saveDataSuccessExecution?: string;
    executionTimeout?: number;
    timezone?: string;
}
export declare class CreateWorkflowDto {
    name: string;
    description?: string;
    nodes: WorkflowNode[];
    connections: {
        [key: string]: WorkflowConnections[];
    };
    settings: WorkflowSettings;
    active?: boolean;
}
export {};
