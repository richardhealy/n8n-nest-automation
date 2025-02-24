export interface WorkflowConfig {
	nodes: Record<string, unknown>[];
	connections: Record<string, Connection>;
	[key: string]:
		| Record<string, unknown>
		| Record<string, unknown>[]
		| Connection;
}

export interface Node {
	id: string;
	type: string;
	parameters: Record<string, unknown>;
	position: [number, number];
}

export interface Connection {
	main: Array<Array<{ node: string; type: string; index: number }>>;
}

export interface Organization {
	id: string;
	name: string;
	apiKey: string;
	whiteLabel: Record<string, unknown>;
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
	nodes: Record<string, unknown>[];
	connections: Record<string, unknown>;
	settings?: Record<string, unknown>;
}
