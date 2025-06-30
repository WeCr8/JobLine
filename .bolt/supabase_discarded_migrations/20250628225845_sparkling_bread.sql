/*
  # Fix users table RLS policies

  1. Changes
    - Update RLS policies for users table to allow new user creation during signup
    - Add policy for auth.users to create their own profile
    - Ensure proper access control for user management
*/

-- First, let's ensure RLS is enabled on the users table
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Managers can read all users" ON public.users;
DROP POLICY IF EXISTS "Organization admins can view users in their organization" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" 
  ON public.users
  FOR SELECT 
  TO authenticated
  USING ((auth.uid())::text = (id)::text);

-- Create policy to allow managers, admins, and supervisors to read all users
CREATE POLICY "Managers can read all users" 
  ON public.users
  FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE ((users_1.id)::text = (auth.uid())::text) 
    AND (users_1.role = ANY (ARRAY['manager'::user_role, 'admin'::user_role, 'supervisor'::user_role]))
  ));

-- Create policy to allow organization admins to view users in their organization
CREATE POLICY "Organization admins can view users in their organization" 
  ON public.users
  FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM organization_users
    WHERE (organization_users.organization_id = users.organization_id) 
    AND ((organization_users.user_id)::text = (auth.uid())::text) 
    AND (organization_users.is_admin = true)
  ));

-- CRITICAL: Add policy to allow users to create their own profile during signup
CREATE POLICY "Users can create their own profile" 
  ON public.users
  FOR INSERT 
  TO authenticated
  WITH CHECK ((auth.uid())::text = (id)::text);

-- Add policy for admins to manage all users
CREATE POLICY "Admins can manage all users" 
  ON public.users
  FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users admin_users
    WHERE ((admin_users.id)::text = (auth.uid())::text) 
    AND (admin_users.role = 'admin'::user_role)
  ));

-- Add policy for organization admins to manage users in their organization
CREATE POLICY "Organization admins can manage their organization users" 
  ON public.users
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_users
      WHERE (organization_users.organization_id = users.organization_id) 
      AND ((organization_users.user_id)::text = (auth.uid())::text) 
      AND (organization_users.is_admin = true)
    )
  );