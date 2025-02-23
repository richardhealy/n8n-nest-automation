export interface WorkflowConfig {
	nodes: Record<string, any>[];
	connections: Record<string, Connection>;
	[key: string]: any;
}

export interface Node {
	id: string;
	type: string;
	parameters: Record<string, any>;
	position: [number, number];
}

export interface Connection {
	main: Array<Array<{ node: string; type: string; index: number }>>;
}

export interface Organization {
	id: string;
	name: string;
	apiKey: string;
	whiteLabel: Record<string, any>;
}

export interface Template {
	id: string;
	name: string;
	description: string;
	tags: string[];
	config: WorkflowConfig;
	organizationId: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface WorkflowData {
	id?: string;
	name: string;
	nodes: any[];
	connections: any;
	settings?: any;
	// Add other workflow-specific fields as needed
}
