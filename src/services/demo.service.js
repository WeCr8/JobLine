export const demoService = {
    /**
     * Seed demo data for the application
     */
    async seedDemoData() {
        try {
            // In hardcoded demo mode, we'll just return success
            // No need to actually call the Supabase function
            console.log('Seeding demo data in hardcoded mode');
            return { success: true, message: 'Demo data initialized successfully' };
        }
        catch (err) {
            console.error('Error seeding demo data:', err);
            return { success: false, error: err.message };
        }
    },
    /**
     * Shuffle job priorities to simulate changing conditions
     */
    async shuffleJobPriorities() {
        try {
            console.log('Shuffling job priorities in hardcoded mode');
            return {
                success: true,
                message: 'Successfully shuffled priorities for demo jobs'
            };
        }
        catch (err) {
            console.error('Error shuffling job priorities:', err);
            return { success: false, error: err.message };
        }
    },
    /**
     * Reorder job statuses to simulate production progress
     */
    async advanceJobStatuses() {
        try {
            console.log('Advancing job statuses in hardcoded mode');
            return {
                success: true,
                message: 'Successfully advanced statuses for demo jobs'
            };
        }
        catch (err) {
            console.error('Error advancing job statuses:', err);
            return { success: false, error: err.message };
        }
    },
    /**
     * Reset demo data to initial state
     */
    async resetDemoData() {
        try {
            console.log('Resetting demo data in hardcoded mode');
            return { success: true, message: 'Demo data reset successfully' };
        }
        catch (err) {
            console.error('Error resetting demo data:', err);
            return { success: false, error: err.message };
        }
    },
    /**
     * Get hardcoded demo data for various entities
     */
    getDemoData(entity) {
        switch (entity) {
            case 'jobs':
                return this.getDemoJobs();
            case 'machines':
                return this.getDemoMachines();
            case 'users':
                return this.getDemoUsers();
            case 'departments':
                return this.getDemoDepartments();
            case 'passdownNotes':
                return this.getDemoPassdownNotes();
            case 'operations':
                return this.getDemoOperations();
            default:
                return [];
        }
    },
    /**
     * Get hardcoded demo jobs
     */
    getDemoJobs() {
        return [
            {
                id: 'job-1',
                jobNumber: 'J2024-001',
                partNumber: 'PN-12345',
                partName: 'Hydraulic Cylinder Housing',
                customer: 'Acme Manufacturing',
                quantity: 50,
                completedQuantity: 35,
                status: 'running',
                priority: 'high',
                dueDate: '2024-07-15',
                startDate: '2024-06-20',
                estimatedHours: 40,
                actualHours: 28,
                operator: 'John Operator',
                machine: 'CNC-001',
                operation: 'Manufacture Hydraulic Cylinder Housing',
                notes: 'Critical customer order, needs quality check at 25 units',
                operations: this.getDemoOperations().filter(op => op.jobId === 'job-1'),
                dncPrograms: [
                    {
                        id: 'prog-1',
                        programNumber: 'O1234',
                        name: 'CYLINDER_HOUSING_OP10',
                        description: 'Facing and roughing operations',
                        filePath: '/programs/O1234.nc',
                        version: '1.2',
                        lastModified: '2024-06-18T10:30:00Z',
                        operationId: 'op-1',
                        machine: 'CNC-001',
                        estimatedRunTime: 45,
                        status: 'active',
                        toolList: [
                            {
                                id: 'tool-1',
                                toolNumber: 1,
                                description: '2" Face Mill',
                                type: 'face-mill',
                                diameter: 2.0,
                                length: 4.0,
                                material: 'Carbide',
                                status: 'available'
                            },
                            {
                                id: 'tool-2',
                                toolNumber: 2,
                                description: '1/2" End Mill',
                                type: 'end-mill',
                                diameter: 0.5,
                                length: 3.0,
                                material: 'Carbide',
                                status: 'available'
                            }
                        ],
                        parameters: [
                            { name: 'FEED_RATE', value: '12.5', unit: 'IPM' },
                            { name: 'SPINDLE_SPEED', value: '2400', unit: 'RPM' }
                        ]
                    }
                ],
                history: [
                    {
                        id: 'hist-1',
                        timestamp: '2024-06-20T08:00:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'created',
                        notes: 'Job created and assigned'
                    },
                    {
                        id: 'hist-2',
                        timestamp: '2024-06-20T09:30:00Z',
                        userId: 'user-2',
                        userName: 'Sarah Johnson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'pending',
                        newValue: 'setup'
                    },
                    {
                        id: 'hist-3',
                        timestamp: '2024-06-20T11:15:00Z',
                        userId: 'user-2',
                        userName: 'Sarah Johnson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'setup',
                        newValue: 'running'
                    }
                ],
                qualityRequirements: [
                    {
                        id: 'qr-1',
                        feature: 'Bore Diameter',
                        specification: '2.500"',
                        tolerance: '±0.002"',
                        inspectionMethod: 'CMM',
                        frequency: 'first-piece'
                    },
                    {
                        id: 'qr-2',
                        feature: 'Surface Finish',
                        specification: '32 Ra',
                        tolerance: 'Max',
                        inspectionMethod: 'Visual/Tactile',
                        frequency: 'in-process'
                    }
                ],
                tooling: [],
                materials: [
                    {
                        id: 'mat-1',
                        material: 'Aluminum 6061-T6',
                        specification: 'AMS 4027',
                        quantity: 55,
                        unit: 'pcs',
                        lotNumber: 'LOT-2024-123',
                        certificationRequired: true,
                        received: true
                    }
                ],
                drawings: [
                    {
                        id: 'drw-1',
                        name: 'Hydraulic Cylinder Housing',
                        revision: 'B',
                        filePath: '/drawings/HCH-001-B.pdf',
                        type: 'part',
                        lastModified: '2024-05-15T14:30:00Z'
                    }
                ],
                createdAt: '2024-06-20T08:00:00Z',
                updatedAt: '2024-06-25T15:45:00Z'
            },
            {
                id: 'job-2',
                jobNumber: 'J2024-002',
                partNumber: 'PN-67890',
                partName: 'Gear Assembly',
                customer: 'TechCorp Industries',
                quantity: 25,
                completedQuantity: 0,
                status: 'setup',
                priority: 'medium',
                dueDate: '2024-07-20',
                startDate: '2024-06-25',
                estimatedHours: 30,
                actualHours: 5,
                operator: 'Sarah Johnson',
                machine: 'CNC-002',
                operation: 'Manufacture Gear Assembly',
                notes: 'New customer, first article inspection required',
                operations: this.getDemoOperations().filter(op => op.jobId === 'job-2'),
                dncPrograms: [],
                history: [
                    {
                        id: 'hist-4',
                        timestamp: '2024-06-25T08:00:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'created',
                        notes: 'Job created and assigned'
                    },
                    {
                        id: 'hist-5',
                        timestamp: '2024-06-25T13:30:00Z',
                        userId: 'user-3',
                        userName: 'Sarah Johnson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'pending',
                        newValue: 'setup'
                    }
                ],
                qualityRequirements: [],
                tooling: [],
                materials: [],
                drawings: [],
                createdAt: '2024-06-25T08:00:00Z',
                updatedAt: '2024-06-25T13:30:00Z'
            },
            {
                id: 'job-3',
                jobNumber: 'J2024-003',
                partNumber: 'PN-24680',
                partName: 'Valve Body',
                customer: 'Fluid Dynamics Company',
                quantity: 100,
                completedQuantity: 0,
                status: 'on-hold',
                priority: 'urgent',
                dueDate: '2024-07-10',
                startDate: null,
                estimatedHours: 60,
                actualHours: 0,
                operator: null,
                machine: null,
                operation: 'Manufacture Valve Body',
                notes: 'On hold due to material quality issues',
                operations: this.getDemoOperations().filter(op => op.jobId === 'job-3'),
                dncPrograms: [],
                history: [
                    {
                        id: 'hist-6',
                        timestamp: '2024-06-22T09:15:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'created',
                        notes: 'Job created'
                    },
                    {
                        id: 'hist-7',
                        timestamp: '2024-06-22T14:45:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'pending',
                        newValue: 'on-hold',
                        notes: 'Material quality issues detected in incoming inspection'
                    }
                ],
                qualityRequirements: [],
                tooling: [],
                materials: [],
                drawings: [],
                createdAt: '2024-06-22T09:15:00Z',
                updatedAt: '2024-06-22T14:45:00Z'
            },
            {
                id: 'job-4',
                jobNumber: 'J2024-004',
                partNumber: 'PN-13579',
                partName: 'Mounting Bracket',
                customer: 'Aerospace Systems Inc.',
                quantity: 75,
                completedQuantity: 75,
                status: 'completed',
                priority: 'medium',
                dueDate: '2024-06-30',
                startDate: '2024-06-15',
                estimatedHours: 25,
                actualHours: 22,
                operator: 'Mike Wilson',
                machine: 'CNC-003',
                operation: 'Manufacture Mounting Bracket',
                notes: 'Completed ahead of schedule',
                operations: this.getDemoOperations().filter(op => op.jobId === 'job-4'),
                dncPrograms: [],
                history: [
                    {
                        id: 'hist-8',
                        timestamp: '2024-06-15T08:00:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'created',
                        notes: 'Job created and assigned'
                    },
                    {
                        id: 'hist-9',
                        timestamp: '2024-06-15T09:30:00Z',
                        userId: 'user-4',
                        userName: 'Mike Wilson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'pending',
                        newValue: 'setup'
                    },
                    {
                        id: 'hist-10',
                        timestamp: '2024-06-15T11:00:00Z',
                        userId: 'user-4',
                        userName: 'Mike Wilson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'setup',
                        newValue: 'running'
                    },
                    {
                        id: 'hist-11',
                        timestamp: '2024-06-28T16:45:00Z',
                        userId: 'user-4',
                        userName: 'Mike Wilson',
                        action: 'status-changed',
                        field: 'status',
                        oldValue: 'running',
                        newValue: 'completed'
                    }
                ],
                qualityRequirements: [],
                tooling: [],
                materials: [],
                drawings: [],
                createdAt: '2024-06-15T08:00:00Z',
                updatedAt: '2024-06-28T16:45:00Z'
            },
            {
                id: 'job-5',
                jobNumber: 'J2024-005',
                partNumber: 'PN-97531',
                partName: 'Control Arm',
                customer: 'Automotive Innovations',
                quantity: 200,
                completedQuantity: 0,
                status: 'pending',
                priority: 'low',
                dueDate: '2024-08-15',
                startDate: null,
                estimatedHours: 80,
                actualHours: 0,
                operator: null,
                machine: null,
                operation: 'Manufacture Control Arm',
                notes: 'Waiting for material delivery',
                operations: this.getDemoOperations().filter(op => op.jobId === 'job-5'),
                dncPrograms: [],
                history: [
                    {
                        id: 'hist-12',
                        timestamp: '2024-06-27T10:30:00Z',
                        userId: 'user-1',
                        userName: 'John Smith',
                        action: 'created',
                        notes: 'Job created'
                    }
                ],
                qualityRequirements: [],
                tooling: [],
                materials: [],
                drawings: [],
                createdAt: '2024-06-27T10:30:00Z',
                updatedAt: '2024-06-27T10:30:00Z'
            }
        ];
    },
    /**
     * Get hardcoded demo operations
     */
    getDemoOperations() {
        return [
            {
                id: 'op-1',
                jobId: 'job-1',
                operationNumber: 1,
                name: 'Setup',
                description: 'Initial setup and fixturing',
                workCenter: 'WC-001',
                machine: 'CNC-001',
                setupTime: 60,
                cycleTime: 0,
                status: 'completed',
                completedQuantity: 50,
                operator: 'John Operator',
                startTime: '2024-06-20T09:00:00Z',
                endTime: '2024-06-20T10:00:00Z',
                notes: 'Setup completed successfully',
                tooling: ['Vise', 'Parallels', 'Soft Jaws'],
                programs: ['O1234'],
                qualityChecks: [],
                instructions: ['Mount part in vise', 'Align with dowel pins', 'Zero machine to part']
            },
            {
                id: 'op-2',
                jobId: 'job-1',
                operationNumber: 2,
                name: 'Face Mill',
                description: 'Face milling operation',
                workCenter: 'WC-001',
                machine: 'CNC-001',
                setupTime: 0,
                cycleTime: 15,
                status: 'completed',
                completedQuantity: 50,
                operator: 'John Operator',
                startTime: '2024-06-20T10:15:00Z',
                endTime: '2024-06-21T14:30:00Z',
                notes: 'Operation completed successfully',
                tooling: ['2" Face Mill'],
                programs: ['O1234'],
                qualityChecks: [],
                instructions: ['Run program O1234', 'Check surface finish after first piece']
            },
            {
                id: 'op-3',
                jobId: 'job-1',
                operationNumber: 3,
                name: 'Drill & Tap',
                description: 'Drilling and tapping operations',
                workCenter: 'WC-001',
                machine: 'CNC-001',
                setupTime: 0,
                cycleTime: 20,
                status: 'running',
                completedQuantity: 35,
                operator: 'John Operator',
                startTime: '2024-06-21T15:00:00Z',
                endTime: null,
                notes: 'In progress',
                tooling: ['1/2" Drill', 'M12 Tap'],
                programs: ['O1235'],
                qualityChecks: [],
                instructions: ['Run program O1235', 'Check thread depth on first piece']
            },
            {
                id: 'op-4',
                jobId: 'job-1',
                operationNumber: 4,
                name: 'Inspection',
                description: 'Final inspection',
                workCenter: 'WC-005',
                machine: null,
                setupTime: 0,
                cycleTime: 10,
                status: 'pending',
                completedQuantity: 0,
                operator: null,
                startTime: null,
                endTime: null,
                notes: 'Waiting for previous operation to complete',
                tooling: ['CMM', 'Calipers', 'Thread Gauges'],
                programs: [],
                qualityChecks: [],
                instructions: ['Check all critical dimensions', 'Verify thread quality', 'Document results']
            },
            {
                id: 'op-5',
                jobId: 'job-2',
                operationNumber: 1,
                name: 'Setup',
                description: 'Initial setup and fixturing',
                workCenter: 'WC-002',
                machine: 'CNC-002',
                setupTime: 90,
                cycleTime: 0,
                status: 'setup',
                completedQuantity: 0,
                operator: 'Sarah Johnson',
                startTime: '2024-06-25T13:30:00Z',
                endTime: null,
                notes: 'Setup in progress',
                tooling: ['4-Jaw Chuck', 'Tailstock', 'Live Center'],
                programs: ['O2345'],
                qualityChecks: [],
                instructions: ['Mount part in 4-jaw chuck', 'Align with dial indicator', 'Zero machine to part']
            },
            {
                id: 'op-6',
                jobId: 'job-2',
                operationNumber: 2,
                name: 'Turn OD',
                description: 'Turn outside diameter',
                workCenter: 'WC-002',
                machine: 'CNC-002',
                setupTime: 0,
                cycleTime: 25,
                status: 'pending',
                completedQuantity: 0,
                operator: null,
                startTime: null,
                endTime: null,
                notes: 'Waiting for setup to complete',
                tooling: ['CNMG Insert', 'DNMG Insert'],
                programs: ['O2345'],
                qualityChecks: [],
                instructions: ['Run program O2345', 'Check diameter after first piece']
            },
            {
                id: 'op-7',
                jobId: 'job-3',
                operationNumber: 1,
                name: 'Setup',
                description: 'Initial setup and fixturing',
                workCenter: 'WC-001',
                machine: 'CNC-001',
                setupTime: 120,
                cycleTime: 0,
                status: 'on-hold',
                completedQuantity: 0,
                operator: null,
                startTime: null,
                endTime: null,
                notes: 'On hold due to material issues',
                tooling: ['Custom Fixture', 'Parallels', 'Soft Jaws'],
                programs: ['O3456'],
                qualityChecks: [],
                instructions: ['Mount part in custom fixture', 'Align with dowel pins', 'Zero machine to part']
            },
            {
                id: 'op-8',
                jobId: 'job-4',
                operationNumber: 1,
                name: 'Setup',
                description: 'Initial setup and fixturing',
                workCenter: 'WC-003',
                machine: 'CNC-003',
                setupTime: 45,
                cycleTime: 0,
                status: 'completed',
                completedQuantity: 75,
                operator: 'Mike Wilson',
                startTime: '2024-06-15T09:00:00Z',
                endTime: '2024-06-15T09:45:00Z',
                notes: 'Setup completed successfully',
                tooling: ['Vise', 'Parallels'],
                programs: ['O4567'],
                qualityChecks: [],
                instructions: ['Mount part in vise', 'Align with dowel pins', 'Zero machine to part']
            },
            {
                id: 'op-9',
                jobId: 'job-4',
                operationNumber: 2,
                name: 'Mill Profile',
                description: 'Mill the bracket profile',
                workCenter: 'WC-003',
                machine: 'CNC-003',
                setupTime: 0,
                cycleTime: 18,
                status: 'completed',
                completedQuantity: 75,
                operator: 'Mike Wilson',
                startTime: '2024-06-15T10:00:00Z',
                endTime: '2024-06-28T16:30:00Z',
                notes: 'Operation completed successfully',
                tooling: ['1/2" End Mill', '1/4" End Mill'],
                programs: ['O4567'],
                qualityChecks: [],
                instructions: ['Run program O4567', 'Check profile dimensions after first piece']
            },
            {
                id: 'op-10',
                jobId: 'job-5',
                operationNumber: 1,
                name: 'Setup',
                description: 'Initial setup and fixturing',
                workCenter: 'WC-001',
                machine: 'CNC-001',
                setupTime: 90,
                cycleTime: 0,
                status: 'pending',
                completedQuantity: 0,
                operator: null,
                startTime: null,
                endTime: null,
                notes: 'Waiting for material delivery',
                tooling: ['Custom Fixture', 'Parallels', 'Soft Jaws'],
                programs: ['O5678'],
                qualityChecks: [],
                instructions: ['Mount part in custom fixture', 'Align with dowel pins', 'Zero machine to part']
            }
        ];
    },
    /**
     * Get hardcoded demo machines
     */
    getDemoMachines() {
        return [
            {
                id: 'CNC-001',
                name: 'Haas VF-4SS',
                type: 'CNC Vertical Machining Center',
                department: 'cnc-machining',
                status: 'running',
                capabilities: ['milling', 'drilling', 'tapping', 'boring'],
                specifications: {
                    workEnvelope: '50" x 20" x 25"',
                    spindle: '12,000 RPM',
                    toolChanger: '30 Position ATC',
                    accuracy: '±0.0002"'
                },
                currentJob: 'J2024-001',
                operator: 'John Operator',
                condition: 'running',
                lastMaintenance: '2024-05-15',
                nextMaintenance: '2024-08-15',
                utilizationRate: 92,
                efficiency: 87,
                location: 'Bay A-1',
                serialNumber: 'SN-12345',
                manufacturer: 'Haas',
                model: 'VF-4SS',
                yearInstalled: 2020
            },
            {
                id: 'CNC-002',
                name: 'Mazak QTN-200',
                type: 'CNC Turning Center',
                department: 'cnc-machining',
                status: 'setup',
                capabilities: ['turning', 'threading', 'boring', 'facing'],
                specifications: {
                    chuckSize: '8"',
                    spindleSpeed: '6,000 RPM',
                    barCapacity: '2"',
                    accuracy: '±0.0001"'
                },
                currentJob: 'J2024-002',
                operator: 'Sarah Johnson',
                condition: 'in-setup',
                lastMaintenance: '2024-06-01',
                nextMaintenance: '2024-09-01',
                utilizationRate: 78,
                efficiency: 82,
                location: 'Bay A-2',
                serialNumber: 'SN-23456',
                manufacturer: 'Mazak',
                model: 'QTN-200',
                yearInstalled: 2019
            },
            {
                id: 'CNC-003',
                name: 'DMG Mori DMU 50',
                type: 'CNC 5-Axis Machining Center',
                department: 'cnc-machining',
                status: 'idle',
                capabilities: ['5-axis milling', 'drilling', 'tapping', 'boring'],
                specifications: {
                    workEnvelope: '20" x 20" x 20"',
                    spindle: '18,000 RPM',
                    toolChanger: '60 Position ATC',
                    accuracy: '±0.0001"'
                },
                currentJob: null,
                operator: null,
                condition: 'idle',
                lastMaintenance: '2024-04-10',
                nextMaintenance: '2024-07-10',
                utilizationRate: 65,
                efficiency: 90,
                location: 'Bay B-1',
                serialNumber: 'SN-34567',
                manufacturer: 'DMG Mori',
                model: 'DMU 50',
                yearInstalled: 2021
            },
            {
                id: 'CNC-004',
                name: 'Okuma LB3000 EX',
                type: 'CNC Lathe',
                department: 'cnc-machining',
                status: 'maintenance',
                capabilities: ['turning', 'threading', 'grooving', 'parting'],
                specifications: {
                    chuckSize: '10"',
                    spindleSpeed: '5,000 RPM',
                    barCapacity: '3"',
                    accuracy: '±0.0001"'
                },
                currentJob: null,
                operator: null,
                condition: 'maintenance',
                lastMaintenance: '2024-06-25',
                nextMaintenance: '2024-09-25',
                utilizationRate: 0,
                efficiency: 0,
                location: 'Bay B-2',
                serialNumber: 'SN-45678',
                manufacturer: 'Okuma',
                model: 'LB3000 EX',
                yearInstalled: 2018
            },
            {
                id: 'CNC-005',
                name: 'Doosan DNM 4500',
                type: 'CNC Vertical Machining Center',
                department: 'cnc-machining',
                status: 'down',
                capabilities: ['milling', 'drilling', 'tapping'],
                specifications: {
                    workEnvelope: '45" x 18" x 20"',
                    spindle: '12,000 RPM',
                    toolChanger: '30 Position ATC',
                    accuracy: '±0.0002"'
                },
                currentJob: null,
                operator: null,
                condition: 'down',
                lastMaintenance: '2024-03-15',
                nextMaintenance: '2024-07-05',
                utilizationRate: 0,
                efficiency: 0,
                location: 'Bay C-1',
                serialNumber: 'SN-56789',
                manufacturer: 'Doosan',
                model: 'DNM 4500',
                yearInstalled: 2017
            }
        ];
    },
    /**
     * Get hardcoded demo users
     */
    getDemoUsers() {
        return [
            {
                id: 'user-1',
                email: 'demo-org-admin@wecr8.info',
                name: 'Demo Organization Admin',
                role: 'organization_admin',
                department: 'Administration',
                organization_id: 'org-1',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'user-2',
                email: 'demo-operator@wecr8.info',
                name: 'John Operator',
                role: 'operator',
                department: 'cnc-machining',
                organization_id: 'org-1',
                is_active: true,
                created_at: '2024-01-05T00:00:00Z'
            },
            {
                id: 'user-3',
                email: 'sarah.johnson@demo.com',
                name: 'Sarah Johnson',
                role: 'lead',
                department: 'cnc-machining',
                organization_id: 'org-1',
                is_active: true,
                created_at: '2024-01-10T00:00:00Z'
            },
            {
                id: 'user-4',
                email: 'mike.wilson@demo.com',
                name: 'Mike Wilson',
                role: 'operator',
                department: 'cnc-machining',
                organization_id: 'org-1',
                is_active: true,
                created_at: '2024-01-15T00:00:00Z'
            },
            {
                id: 'user-5',
                email: 'emily.davis@demo.com',
                name: 'Emily Davis',
                role: 'supervisor',
                department: 'quality-control',
                organization_id: 'org-1',
                is_active: true,
                created_at: '2024-01-20T00:00:00Z'
            }
        ];
    },
    /**
     * Get hardcoded demo departments
     */
    getDemoDepartments() {
        return [
            {
                id: 'cnc-machining',
                name: 'CNC Machining',
                description: 'Computer-controlled precision machining operations',
                department_type: 'production',
                supervisor: 'Sarah Johnson',
                supervisor_id: 'user-3',
                shift: 'day',
                capabilities: ['milling', 'turning', 'drilling', 'tapping', 'boring'],
                quality_standards: ['ISO 9001', 'AS9100'],
                active_jobs: 3,
                efficiency: 87,
                utilization_rate: 92,
                integrations: ['erp', 'cam'],
                location: 'Building A, Floor 1',
                operators: ['user-2', 'user-4'],
                machines: ['CNC-001', 'CNC-002', 'CNC-003', 'CNC-004', 'CNC-005'],
                kpis: [
                    { name: 'Efficiency', value: 87, target: 85, unit: '%', trend: 'up' },
                    { name: 'Utilization', value: 92, target: 80, unit: '%', trend: 'stable' }
                ]
            },
            {
                id: 'quality-control',
                name: 'Quality Control',
                description: 'Quality assurance and inspection',
                department_type: 'support',
                supervisor: 'Emily Davis',
                supervisor_id: 'user-5',
                shift: 'day',
                capabilities: ['cmm-inspection', 'visual-inspection', 'material-testing'],
                quality_standards: ['ISO 9001', 'AS9100', 'ITAR'],
                active_jobs: 0,
                efficiency: 95,
                utilization_rate: 78,
                integrations: ['erp', 'quality-management-system'],
                location: 'Building A, Floor 1',
                operators: [],
                machines: [],
                kpis: [
                    { name: 'First Pass Yield', value: 95, target: 90, unit: '%', trend: 'up' },
                    { name: 'Inspection Time', value: 78, target: 85, unit: '%', trend: 'down' }
                ]
            },
            {
                id: 'assembly',
                name: 'Assembly',
                description: 'Product assembly and integration',
                department_type: 'production',
                supervisor: 'David Wilson',
                supervisor_id: null,
                shift: 'day',
                capabilities: ['mechanical-assembly', 'electrical-assembly', 'testing'],
                quality_standards: ['ISO 9001'],
                active_jobs: 2,
                efficiency: 82,
                utilization_rate: 88,
                integrations: ['erp'],
                location: 'Building B, Floor 1',
                operators: [],
                machines: [],
                kpis: [
                    { name: 'Efficiency', value: 82, target: 80, unit: '%', trend: 'stable' },
                    { name: 'Defect Rate', value: 1.2, target: 2.0, unit: '%', trend: 'down' }
                ]
            },
            {
                id: 'shipping-receiving',
                name: 'Shipping & Receiving',
                description: 'Material handling and logistics',
                department_type: 'support',
                supervisor: 'Jennifer Martinez',
                supervisor_id: null,
                shift: 'day',
                capabilities: ['packaging', 'shipping', 'receiving', 'inventory-management'],
                quality_standards: ['ISO 9001'],
                active_jobs: 0,
                efficiency: 90,
                utilization_rate: 85,
                integrations: ['erp', 'warehouse-management-system'],
                location: 'Building C, Floor 1',
                operators: [],
                machines: [],
                kpis: [
                    { name: 'On-Time Delivery', value: 98, target: 95, unit: '%', trend: 'up' },
                    { name: 'Inventory Accuracy', value: 99.5, target: 99, unit: '%', trend: 'stable' }
                ]
            },
            {
                id: 'programming',
                name: 'Programming',
                description: 'CNC programming and toolpath generation',
                department_type: 'support',
                supervisor: 'Robert Taylor',
                supervisor_id: null,
                shift: 'day',
                capabilities: ['cam-programming', 'post-processing', 'simulation'],
                quality_standards: ['ISO 9001'],
                active_jobs: 5,
                efficiency: 88,
                utilization_rate: 92,
                integrations: ['cam', 'plm'],
                location: 'Building A, Floor 2',
                operators: [],
                machines: [],
                kpis: [
                    { name: 'Program Efficiency', value: 88, target: 85, unit: '%', trend: 'up' },
                    { name: 'First-Run Success', value: 92, target: 90, unit: '%', trend: 'stable' }
                ]
            }
        ];
    },
    /**
     * Get hardcoded demo passdown notes
     */
    getDemoPassdownNotes() {
        return [
            {
                id: 'note-1',
                workOrder: 'J2024-001',
                shift: 'day',
                date: '2024-06-25',
                operator: 'John Operator',
                machine: 'CNC-001',
                laborType: 'run',
                machineCondition: 'running',
                hoursWorked: 8,
                partsCompleted: 15,
                qualityIssues: '',
                machineIssues: '',
                fiveSChecklist: {
                    coolantLevel: true,
                    coolantCondition: 'good',
                    chipBinEmptied: true,
                    chipBinCondition: 'empty',
                    deskCleaned: true,
                    toolingReturned: true,
                    toolingCondition: 'good',
                    workAreaOrganized: true,
                    safetyChecked: true,
                    notes: ''
                },
                nextShiftNotes: 'Completed 15 parts. Tool 2 will need replacement after approximately 10 more parts.',
                createdAt: '2024-06-25T14:30:00Z',
                updatedAt: '2024-06-25T14:30:00Z'
            },
            {
                id: 'note-2',
                workOrder: 'J2024-001',
                shift: 'evening',
                date: '2024-06-25',
                operator: 'Sarah Johnson',
                machine: 'CNC-001',
                laborType: 'run',
                machineCondition: 'running',
                hoursWorked: 8,
                partsCompleted: 20,
                qualityIssues: 'Found 2 parts with dimensional issues on the bore diameter',
                machineIssues: '',
                fiveSChecklist: {
                    coolantLevel: true,
                    coolantCondition: 'needs-change',
                    chipBinEmptied: true,
                    chipBinCondition: 'empty',
                    deskCleaned: true,
                    toolingReturned: true,
                    toolingCondition: 'worn',
                    workAreaOrganized: true,
                    safetyChecked: true,
                    notes: 'Coolant needs to be changed at start of next shift'
                },
                nextShiftNotes: 'Completed 20 parts. Replaced Tool 2 after 10 parts as recommended. Coolant needs to be changed at start of shift.',
                createdAt: '2024-06-25T22:45:00Z',
                updatedAt: '2024-06-25T22:45:00Z'
            },
            {
                id: 'note-3',
                workOrder: 'J2024-002',
                shift: 'day',
                date: '2024-06-25',
                operator: 'Sarah Johnson',
                machine: 'CNC-002',
                laborType: 'setup',
                machineCondition: 'in-setup',
                hoursWorked: 5,
                partsCompleted: 0,
                qualityIssues: '',
                machineIssues: '',
                fiveSChecklist: {
                    coolantLevel: true,
                    coolantCondition: 'good',
                    chipBinEmptied: true,
                    chipBinCondition: 'empty',
                    deskCleaned: true,
                    toolingReturned: true,
                    toolingCondition: 'good',
                    workAreaOrganized: true,
                    safetyChecked: true,
                    notes: ''
                },
                nextShiftNotes: 'Setup is about 80% complete. Custom jaws are machined and program is verified. Need to complete tool offsets and run first article.',
                createdAt: '2024-06-25T14:45:00Z',
                updatedAt: '2024-06-25T14:45:00Z'
            },
            {
                id: 'note-4',
                workOrder: 'J2024-004',
                shift: 'day',
                date: '2024-06-28',
                operator: 'Mike Wilson',
                machine: 'CNC-003',
                laborType: 'run',
                machineCondition: 'running',
                hoursWorked: 8,
                partsCompleted: 25,
                qualityIssues: '',
                machineIssues: '',
                fiveSChecklist: {
                    coolantLevel: true,
                    coolantCondition: 'good',
                    chipBinEmptied: true,
                    chipBinCondition: 'empty',
                    deskCleaned: true,
                    toolingReturned: true,
                    toolingCondition: 'good',
                    workAreaOrganized: true,
                    safetyChecked: true,
                    notes: ''
                },
                nextShiftNotes: 'Completed final 25 parts. All parts have been moved to inspection. Machine is clean and ready for next job.',
                createdAt: '2024-06-28T14:30:00Z',
                updatedAt: '2024-06-28T14:30:00Z'
            }
        ];
    }
};
