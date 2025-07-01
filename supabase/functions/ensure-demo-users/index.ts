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

// Demo user credentials
const demoUsers = [
  {
    email: 'demo-org-admin@wecr8.info',
    password: 'demo1234*',
    name: 'Demo Organization Admin',
    role: 'organization_admin',
    department: 'Administration',
  },
  {
    email: 'demo-operator@wecr8.info',
    password: 'demo1234*',
    name: 'Demo Operator',
    role: 'operator',
    department: 'cnc-machining',
  }
];

// Function to ensure demo users exist
async function ensureDemoUsers() {
  try {
    console.log('Ensuring demo users exist...');
    
    // Get demo account type
    const { data: accountTypes, error: accountTypeError } = await supabase
      .from('account_types')
      .select('id')
      .eq('name', 'demo')
      .single();
    
    if (accountTypeError) {
      console.error('Error fetching demo account type:', accountTypeError);
      return { success: false, error: 'Failed to fetch demo account type' };
    }
    
    const demoAccountId = accountTypes.id;
    
    // Get or create demo organization
    let orgId;
    const { data: existingOrg, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', 'Demo Organization')
      .maybeSingle();
    
    if (orgError && orgError.code !== 'PGRST116') {
      console.error('Error fetching organization:', orgError);
      return { success: false, error: 'Failed to fetch organization' };
    }
    
    if (!existingOrg) {
      const { data: newOrg, error: createOrgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Demo Organization',
          industry: 'Manufacturing',
          primary_contact_name: 'Demo Admin',
          primary_contact_email: 'demo-org-admin@wecr8.info',
          is_active: true
        })
        .select()
        .single();
      
      if (createOrgError) {
        console.error('Error creating organization:', createOrgError);
        return { success: false, error: 'Failed to create organization' };
      }
      
      orgId = newOrg.id;
    } else {
      orgId = existingOrg.id;
    }
    
    // Create demo data status entry
    await supabase
      .from('demo_data_status')
      .insert({
        organization_id: orgId,
        is_seeded: false,
        seed_status: 'pending'
      })
      .on_conflict('organization_id')
      .ignore();
    
    // Process each demo user
    for (const demoUser of demoUsers) {
      // Check if user exists in auth
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
        filter: { email: demoUser.email }
      });
      
      if (listError) {
        console.error(`Error checking if user ${demoUser.email} exists:`, listError);
        continue;
      }
      
      let userId;
      const userExists = users && users.length > 0;
      
      if (!userExists) {
        // Create auth user
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true,
          user_metadata: { name: demoUser.name }
        });
        
        if (createError) {
          console.error(`Error creating auth user ${demoUser.email}:`, createError);
          continue;
        }
        
        userId = authData.user.id;
      } else {
        userId = users[0].id;
      }
      
      // Check if user exists in users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', demoUser.email)
        .maybeSingle();
      
      if (userError && userError.code !== 'PGRST116') {
        console.error(`Error checking if user ${demoUser.email} exists in users table:`, userError);
        continue;
      }
      
      if (!existingUser) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
            department: demoUser.department,
            organization_id: orgId,
            account_type_id: demoAccountId,
            is_active: true
          });
        
        if (profileError) {
          console.error(`Error creating user profile for ${demoUser.email}:`, profileError);
          continue;
        }
        
        // Add to organization_users
        const { error: orgUserError } = await supabase
          .from('organization_users')
          .insert({
            organization_id: orgId,
            user_id: userId,
            role: demoUser.role,
            is_admin: demoUser.role === 'organization_admin',
            is_primary: demoUser.role === 'organization_admin'
          });
        
        if (orgUserError) {
          console.error(`Error adding user ${demoUser.email} to organization:`, orgUserError);
        }
        
        // Create user account settings
        const { error: settingsError } = await supabase
          .from('user_account_settings')
          .insert({
            user_id: userId,
            account_type_id: demoAccountId,
            is_demo: true,
            settings: { demo_profile: true, demo_features_enabled: true },
            expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
          });
        
        if (settingsError) {
          console.error(`Error creating account settings for ${demoUser.email}:`, settingsError);
        }
      }
    }
    
    return { success: true, message: 'Demo users created successfully' };
  } catch (error) {
    console.error('Error ensuring demo users:', error);
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
    const result = await ensureDemoUsers();
    
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