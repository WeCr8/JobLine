import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo data constants
const DEMO_ORGANIZATIONS = 3;
const DEMO_USERS_PER_ORG = 10;
const DEMO_DEPARTMENTS_PER_ORG = 5;
const DEMO_MACHINES_PER_DEPT = 3;
const DEMO_JOBS_PER_ORG = 25;
const DEMO_OPERATIONS_PER_JOB = 4;

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

// Helper function to pick random item from array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random number in range
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random boolean with probability
function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

// Generate demo data
async function generateDemoData() {
  try {
    console.log('Starting demo data generation...');
    
    // Create demo organizations
    const organizations = [];
    const orgNames = [
      'Acme Manufacturing', 'TechCorp Industries', 'Global Precision', 
      'Advanced Fabrication', 'Quantum Machining', 'Stellar Engineering',
      'Precision Dynamics', 'Atlas Manufacturing', 'Innovative Solutions'
    ];
    
    const industries = [
      'Aerospace', 'Automotive', 'Medical Devices', 'Defense', 
      'Electronics', 'Consumer Products', 'Industrial Equipment'
    ];
    
    for (let i = 0; i < DEMO_ORGANIZATIONS; i++) {
      const orgName = orgNames[i % orgNames.length];
      organizations.push({
        id: crypto.randomUUID(),
        name: orgName,
        industry: randomItem(industries),
        address: `${randomNumber(100, 999)} Industrial Parkway, Suite ${randomNumber(100, 999)}`,
        phone: `(${randomNumber(100, 999)}) ${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`,
        website: `https://www.${orgName.toLowerCase().replace(/\s+/g, '')}.com`,
        primary_contact_name: `John Smith ${i + 1}`,
        primary_contact_email: `contact${i + 1}@example.com`,
        max_users: 25,
        current_user_count: DEMO_USERS_PER_ORG,
        is_active: true,
        created_at: randomDate(new Date('2023-01-01'), new Date('2023-12-31'))
      });
    }
    
    const { error: orgError } = await supabase.from('organizations').upsert(organizations);
    if (orgError) throw new Error(`Error creating organizations: ${orgError.message}`);
    console.log(`Created ${organizations.length} organizations`);
    
    // Create demo users for each organization
    const users = [];
    const roles = ['operator', 'lead', 'supervisor', 'manager', 'organization_admin'];
    const names = [
      'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
      'Jennifer Martinez', 'Robert Taylor', 'Lisa Anderson', 'James Thomas', 'Jessica Garcia',
      'William Rodriguez', 'Amanda Martinez', 'Christopher Lee', 'Michelle Harris', 'Daniel Clark',
      'Stephanie Lewis', 'Matthew Walker', 'Nicole Hall', 'Anthony Allen', 'Melissa Young'
    ];
    
    for (const org of organizations) {
      // Create organization admin
      users.push({
        id: crypto.randomUUID(),
        email: `admin@${org.name.toLowerCase().replace(/\s+/g, '')}.com`,
        name: `${randomItem(names)} (Admin)`,
        role: 'organization_admin',
        organization_id: org.id,
        is_active: true,
        created_at: org.created_at
      });
      
      // Create regular users
      for (let i = 0; i < DEMO_USERS_PER_ORG - 1; i++) {
        const role = randomItem(roles.filter(r => r !== 'organization_admin'));
        users.push({
          id: crypto.randomUUID(),
          email: `user${i + 1}@${org.name.toLowerCase().replace(/\s+/g, '')}.com`,
          name: randomItem(names),
          role,
          organization_id: org.id,
          is_active: randomBoolean(0.9),
          created_at: randomDate(new Date(org.created_at), new Date())
        });
      }
    }
    
    const { error: userError } = await supabase.from('users').upsert(users);
    if (userError) throw new Error(`Error creating users: ${userError.message}`);
    console.log(`Created ${users.length} users`);
    
    // Create organization_users entries
    const orgUsers = [];
    for (const user of users) {
      orgUsers.push({
        id: crypto.randomUUID(),
        organization_id: user.organization_id,
        user_id: user.id,
        role: user.role,
        is_admin: user.role === 'organization_admin',
        is_primary: user.role === 'organization_admin',
        joined_at: user.created_at
      });
    }
    
    const { error: orgUserError } = await supabase.from('organization_users').upsert(orgUsers);
    if (orgUserError) throw new Error(`Error creating organization users: ${orgUserError.message}`);
    console.log(`Created ${orgUsers.length} organization user relationships`);
    
    // Create departments for each organization
    const departments = [];
    const departmentTypes = ['production', 'support'];
    const departmentNames = [
      'CNC Machining', 'Quality Control', 'Assembly', 'Shipping & Receiving',
      'Programming', 'Maintenance', 'Tool Room', 'Inspection', 'Finishing'
    ];
    
    for (const org of organizations) {
      const orgUsers = users.filter(u => u.organization_id === org.id);
      
      for (let i = 0; i < DEMO_DEPARTMENTS_PER_ORG; i++) {
        const deptName = departmentNames[i % departmentNames.length];
        const deptId = `${deptName.toLowerCase().replace(/\s+/g, '-')}-${org.id.substring(0, 8)}`;
        const supervisors = orgUsers.filter(u => u.role === 'supervisor' || u.role === 'manager');
        
        departments.push({
          id: deptId,
          name: deptName,
          description: `${deptName} department for ${org.name}`,
          department_type: randomItem(departmentTypes),
          supervisor_id: supervisors.length > 0 ? randomItem(supervisors).id : null,
          shift: randomItem(['day', 'evening', 'night']),
          capabilities: ['milling', 'turning', 'drilling', 'grinding', 'inspection'].slice(0, randomNumber(2, 5)),
          quality_standards: ['ISO 9001', 'AS9100', 'ITAR'].slice(0, randomNumber(1, 3)),
          active_jobs: randomNumber(3, 15),
          efficiency: randomNumber(75, 98),
          utilization_rate: randomNumber(70, 95),
          location: `Building ${randomItem(['A', 'B', 'C'])}, Floor ${randomNumber(1, 3)}`,
          created_at: org.created_at
        });
      }
    }
    
    const { error: deptError } = await supabase.from('departments').upsert(departments);
    if (deptError) throw new Error(`Error creating departments: ${deptError.message}`);
    console.log(`Created ${departments.length} departments`);
    
    // Create machines for each department
    const machines = [];
    const machineTypes = [
      'CNC Mill', 'CNC Lathe', 'Grinding Machine', 'EDM', 'Inspection CMM',
      '3D Printer', 'Laser Cutter', 'Waterjet', 'Press Brake', 'Welding Robot'
    ];
    
    for (const dept of departments) {
      for (let i = 0; i < DEMO_MACHINES_PER_DEPT; i++) {
        const machineType = machineTypes[randomNumber(0, machineTypes.length - 1)];
        const machineId = `${machineType.replace(/\s+/g, '-').toLowerCase()}-${randomNumber(100, 999)}`;
        
        machines.push({
          id: machineId,
          name: `${machineType} ${randomNumber(100, 999)}`,
          type: machineType,
          department_id: dept.id,
          status: randomItem(['running', 'idle', 'maintenance', 'down']),
          condition: randomItem(['running', 'idle', 'maintenance', 'down']),
          capabilities: ['milling', 'turning', 'drilling', 'grinding', 'inspection'].slice(0, randomNumber(2, 5)),
          specifications: {
            workEnvelope: `${randomNumber(10, 50)}" x ${randomNumber(10, 50)}" x ${randomNumber(10, 50)}"`,
            spindle: `${randomNumber(5, 15)},000 RPM`,
            toolChanger: `${randomNumber(10, 40)} Position ATC`,
            accuracy: `±0.000${randomNumber(1, 5)}"`
          },
          location: `${dept.location}, Bay ${randomNumber(1, 10)}`,
          serial_number: `SN-${randomNumber(10000, 99999)}`,
          manufacturer: randomItem(['Haas', 'DMG Mori', 'Mazak', 'Okuma', 'Doosan']),
          model: `Model ${randomItem(['A', 'B', 'C', 'D', 'E'])}-${randomNumber(100, 999)}`,
          year_installed: randomNumber(2010, 2023),
          last_maintenance: randomDate(new Date('2023-01-01'), new Date()),
          next_maintenance: randomDate(new Date(), new Date('2024-12-31')),
          utilization_rate: randomNumber(70, 95),
          efficiency: randomNumber(75, 98),
          created_at: dept.created_at
        });
      }
    }
    
    const { error: machineError } = await supabase.from('machines').upsert(machines);
    if (machineError) throw new Error(`Error creating machines: ${machineError.message}`);
    console.log(`Created ${machines.length} machines`);
    
    // Create jobs for each organization
    const jobs = [];
    const jobStatuses = ['pending', 'setup', 'running', 'on-hold', 'completed'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    const partNames = [
      'Hydraulic Cylinder', 'Gear Assembly', 'Valve Body', 'Turbine Blade',
      'Mounting Bracket', 'Control Arm', 'Pump Housing', 'Manifold Block',
      'Bearing Housing', 'Impeller', 'Shaft Coupling', 'Piston', 'Flange',
      'Connector Block', 'Rotor Assembly', 'Transmission Case', 'Nozzle'
    ];
    const customers = [
      'Aerospace Systems Inc.', 'Automotive Innovations', 'Medical Devices Co.',
      'Defense Technologies', 'Energy Solutions Ltd.', 'Marine Systems',
      'Industrial Equipment Corp.', 'Transportation Systems', 'Electronics Manufacturing'
    ];
    
    for (const org of organizations) {
      const orgUsers = users.filter(u => u.organization_id === org.id);
      const operators = orgUsers.filter(u => u.role === 'operator' || u.role === 'lead');
      const orgDepartments = departments.filter(d => d.id.includes(org.id.substring(0, 8)));
      const orgMachines = machines.filter(m => orgDepartments.some(d => d.id === m.department_id));
      
      for (let i = 0; i < DEMO_JOBS_PER_ORG; i++) {
        const jobNumber = `J${new Date().getFullYear()}-${randomNumber(1000, 9999)}`;
        const partName = randomItem(partNames);
        const partNumber = `PN-${randomNumber(10000, 99999)}`;
        const customer = randomItem(customers);
        const quantity = randomNumber(10, 100);
        const status = randomItem(jobStatuses);
        const completedQuantity = status === 'completed' ? quantity : (status === 'running' ? randomNumber(1, quantity - 1) : 0);
        const priority = randomItem(priorities);
        const dueDate = randomDate(new Date(), new Date('2024-12-31'));
        const startDate = status !== 'pending' ? randomDate(new Date('2023-01-01'), new Date()) : null;
        const estimatedHours = randomNumber(10, 100);
        const actualHours = status === 'completed' ? estimatedHours * (randomNumber(80, 120) / 100) : (status === 'running' ? estimatedHours * (completedQuantity / quantity) : 0);
        const operator = operators.length > 0 ? randomItem(operators) : null;
        const machine = orgMachines.length > 0 ? randomItem(orgMachines) : null;
        
        const jobId = crypto.randomUUID();
        jobs.push({
          id: jobId,
          job_number: jobNumber,
          part_number: partNumber,
          part_name: partName,
          customer,
          quantity,
          completed_quantity: completedQuantity,
          status,
          priority,
          due_date: dueDate.split('T')[0],
          start_date: startDate ? startDate.split('T')[0] : null,
          estimated_hours: estimatedHours,
          actual_hours: actualHours,
          operator_id: operator?.id || null,
          machine_id: machine?.id || null,
          work_center_id: null,
          operation: `Manufacture ${partName}`,
          notes: `Job for ${customer} to produce ${quantity} units of ${partName}`,
          export_control_classification: randomBoolean(0.2) ? 'ITAR' : null,
          is_itar_controlled: randomBoolean(0.2),
          customer_po: `PO-${randomNumber(10000, 99999)}`,
          created_by: orgUsers.length > 0 ? randomItem(orgUsers).id : null,
          created_at: startDate || randomDate(new Date('2023-01-01'), new Date())
        });
        
        // Create operations for each job
        const operations = [];
        const operationNames = ['Setup', 'Machining', 'Inspection', 'Finishing'];
        const operationStatuses = ['pending', 'setup', 'running', 'completed', 'on-hold'];
        
        for (let j = 0; j < DEMO_OPERATIONS_PER_JOB; j++) {
          const operationName = operationNames[j % operationNames.length];
          let operationStatus;
          
          // Set operation status based on job status
          if (status === 'completed') {
            operationStatus = 'completed';
          } else if (status === 'pending') {
            operationStatus = 'pending';
          } else if (status === 'setup' && j === 0) {
            operationStatus = 'setup';
          } else if (status === 'running') {
            if (j < 2) {
              operationStatus = 'completed';
            } else if (j === 2) {
              operationStatus = 'running';
            } else {
              operationStatus = 'pending';
            }
          } else {
            operationStatus = randomItem(operationStatuses);
          }
          
          const operationCompletedQuantity = operationStatus === 'completed' ? quantity : (operationStatus === 'running' ? randomNumber(1, quantity - 1) : 0);
          
          operations.push({
            id: crypto.randomUUID(),
            job_id: jobId,
            operation_number: j + 1,
            name: operationName,
            description: `${operationName} operation for ${partName}`,
            work_center_id: null,
            machine_id: machine?.id || null,
            setup_time: randomNumber(30, 120),
            cycle_time: randomNumber(5, 60),
            status: operationStatus,
            completed_quantity: operationCompletedQuantity,
            operator_id: operator?.id || null,
            start_time: operationStatus !== 'pending' ? randomDate(new Date(startDate || '2023-01-01'), new Date()) : null,
            end_time: operationStatus === 'completed' ? randomDate(new Date(), new Date('2024-12-31')) : null,
            notes: `${operationName} operation notes for ${partName}`,
            tooling: ['End Mill', 'Drill', 'Tap', 'Reamer'].slice(0, randomNumber(1, 4)),
            programs: [`Program-${randomNumber(1000, 9999)}`],
            instructions: [
              `Step 1: Setup ${partName} in fixture`,
              `Step 2: Run program`,
              `Step 3: Verify dimensions`,
              `Step 4: Deburr edges`
            ]
          });
        }
        
        const { error: operationError } = await supabase.from('job_operations').upsert(operations);
        if (operationError) throw new Error(`Error creating operations: ${operationError.message}`);
      }
    }
    
    const { error: jobError } = await supabase.from('jobs').upsert(jobs);
    if (jobError) throw new Error(`Error creating jobs: ${jobError.message}`);
    console.log(`Created ${jobs.length} jobs with operations`);
    
    // Create passdown notes
    const passdownNotes = [];
    for (const org of organizations) {
      const orgUsers = users.filter(u => u.organization_id === org.id);
      const operators = orgUsers.filter(u => u.role === 'operator' || u.role === 'lead');
      const orgJobs = jobs.filter(j => j.created_by && orgUsers.some(u => u.id === j.created_by));
      const orgMachines = machines.filter(m => m.department_id && departments.some(d => d.id === m.department_id && d.id.includes(org.id.substring(0, 8))));
      
      // Create 10 passdown notes per organization
      for (let i = 0; i < 10; i++) {
        const job = orgJobs.length > 0 ? randomItem(orgJobs) : null;
        const operator = operators.length > 0 ? randomItem(operators) : null;
        const machine = orgMachines.length > 0 ? randomItem(orgMachines) : null;
        
        if (job && operator && machine) {
          const noteDate = randomDate(new Date('2023-06-01'), new Date());
          const noteId = crypto.randomUUID();
          
          passdownNotes.push({
            id: noteId,
            work_order: job.job_number,
            shift: randomItem(['day', 'evening', 'night']),
            date: noteDate.split('T')[0],
            operator_id: operator.id,
            operator_name: operator.name,
            machine_id: machine.id,
            labor_type: randomItem(['setup', 'run', 'teardown', 'maintenance', 'inspection']),
            machine_condition: randomItem(['in-setup', 'running', 'idle', 'maintenance', 'down']),
            hours_worked: randomNumber(4, 12),
            parts_completed: randomNumber(5, 50),
            quality_issues: randomBoolean(0.3) ? `Found ${randomNumber(1, 5)} parts with dimensional issues` : null,
            machine_issues: randomBoolean(0.3) ? `Machine ${randomBoolean(0.5) ? 'vibration' : 'coolant level low'}` : null,
            next_shift_notes: `Completed ${randomNumber(5, 50)} parts. ${randomBoolean(0.5) ? 'Tool change needed soon.' : 'Setup for next job is complete.'}`,
            created_at: noteDate
          });
          
          // Create 5S checklist for each passdown note
          const fiveSChecklist = {
            id: crypto.randomUUID(),
            passdown_note_id: noteId,
            coolant_level: randomBoolean(0.8),
            coolant_condition: randomItem(['good', 'needs-change', 'low']),
            chip_bin_emptied: randomBoolean(0.7),
            chip_bin_condition: randomItem(['empty', 'half-full', 'full']),
            desk_cleaned: randomBoolean(0.9),
            tooling_returned: randomBoolean(0.8),
            tooling_condition: randomItem(['good', 'worn', 'damaged']),
            work_area_organized: randomBoolean(0.85),
            safety_checked: randomBoolean(0.95),
            notes: randomBoolean(0.3) ? 'Additional cleaning needed around machine base' : null,
            created_at: noteDate
          };
          
          const { error: checklistError } = await supabase.from('five_s_checklists').upsert([fiveSChecklist]);
          if (checklistError) throw new Error(`Error creating 5S checklists: ${checklistError.message}`);
        }
      }
    }
    
    const { error: passdownError } = await supabase.from('passdown_notes').upsert(passdownNotes);
    if (passdownError) throw new Error(`Error creating passdown notes: ${passdownError.message}`);
    console.log(`Created ${passdownNotes.length} passdown notes with 5S checklists`);
    
    // Create quality requirements and checks
    const qualityRequirements = [];
    const qualityChecks = [];
    
    for (const job of jobs.slice(0, Math.floor(jobs.length * 0.5))) { // Only create for 50% of jobs
      const jobOperations = await supabase
        .from('job_operations')
        .select('*')
        .eq('job_id', job.id);
      
      if (jobOperations.error) throw new Error(`Error fetching job operations: ${jobOperations.error.message}`);
      
      const operations = jobOperations.data || [];
      
      // Create 2-3 quality requirements per job
      for (let i = 0; i < randomNumber(2, 3); i++) {
        const operation = operations.length > 0 ? randomItem(operations) : null;
        const requirementId = crypto.randomUUID();
        
        qualityRequirements.push({
          id: requirementId,
          job_id: job.id,
          operation_id: operation?.id || null,
          feature: randomItem(['Diameter', 'Length', 'Width', 'Depth', 'Flatness', 'Roundness']),
          specification: `${randomNumber(1, 100)}.${randomNumber(10, 99)} mm`,
          tolerance: `±0.${randomNumber(1, 5)} mm`,
          inspection_method: randomItem(['CMM', 'Caliper', 'Micrometer', 'Visual', 'Go/No-Go Gauge']),
          frequency: randomItem(['first-piece', 'in-process', 'final', 'statistical'])
        });
        
        // Create 1-2 quality checks per requirement
        if (job.status === 'running' || job.status === 'completed') {
          const orgUsers = users.filter(u => u.organization_id === job.created_by);
          const inspectors = orgUsers.filter(u => u.role === 'operator' || u.role === 'lead' || u.role === 'supervisor');
          
          for (let j = 0; j < randomNumber(1, 2); j++) {
            const inspector = inspectors.length > 0 ? randomItem(inspectors) : null;
            
            if (inspector) {
              qualityChecks.push({
                id: crypto.randomUUID(),
                requirement_id: requirementId,
                operation_id: operation?.id || null,
                inspector_id: inspector.id,
                inspector_name: inspector.name,
                result: randomItem(['pass', 'fail', 'rework']),
                actual_value: `${randomNumber(1, 100)}.${randomNumber(10, 99)} mm`,
                notes: randomBoolean(0.3) ? 'Dimensions within tolerance' : null,
                timestamp: randomDate(new Date(job.created_at), new Date())
              });
            }
          }
        }
      }
    }
    
    const { error: requirementError } = await supabase.from('quality_requirements').upsert(qualityRequirements);
    if (requirementError) throw new Error(`Error creating quality requirements: ${requirementError.message}`);
    console.log(`Created ${qualityRequirements.length} quality requirements`);
    
    const { error: checkError } = await supabase.from('quality_checks').upsert(qualityChecks);
    if (checkError) throw new Error(`Error creating quality checks: ${checkError.message}`);
    console.log(`Created ${qualityChecks.length} quality checks`);
    
    // Create performance metrics for users
    const performanceMetrics = [];
    const periods = ['daily', 'weekly', 'monthly'];
    
    for (const user of users.filter(u => u.role === 'operator' || u.role === 'lead')) {
      const period = randomItem(periods);
      let startDate, endDate;
      
      if (period === 'daily') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date();
      } else if (period === 'weekly') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date();
      } else {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date();
      }
      
      performanceMetrics.push({
        id: crypto.randomUUID(),
        user_id: user.id,
        period,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        efficiency: randomNumber(75, 98),
        quality: randomNumber(80, 99),
        safety: randomNumber(90, 100),
        productivity: randomNumber(70, 95),
        teamwork: randomNumber(75, 95),
        innovation: randomNumber(60, 90),
        attendance: randomNumber(80, 100),
        skill_development: randomNumber(70, 90),
        total_score: randomNumber(75, 95),
        rank: randomNumber(1, 20),
        bonus_earned: randomNumber(100, 1000),
        created_at: randomDate(new Date('2023-01-01'), new Date())
      });
    }
    
    const { error: metricsError } = await supabase.from('performance_metrics').upsert(performanceMetrics);
    if (metricsError) throw new Error(`Error creating performance metrics: ${metricsError.message}`);
    console.log(`Created ${performanceMetrics.length} performance metrics`);
    
    console.log('Demo data generation completed successfully!');
    return { success: true, message: 'Demo data generated successfully' };
  } catch (error) {
    console.error('Error generating demo data:', error);
    return { success: false, error: error.message };
  }
}

// HTTP handler
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const result = await generateDemoData();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});