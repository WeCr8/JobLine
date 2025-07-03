import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const { inviteId } = await req.json()
    if (!inviteId) return new Response('Missing inviteId', { status: 400 })

    // Auth: get user from JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const authHeader = req.headers.get('Authorization') || ''
    const jwt = authHeader.replace('Bearer ', '')
    const { data: user, error: userError } = await supabase.auth.getUser(jwt)
    if (userError || !user?.user) return new Response('Unauthorized', { status: 401 })

    // Fetch invite, org, and role
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*, organizations(*), roles(*)')
      .eq('id', inviteId)
      .single()
    if (inviteError || !invite) return new Response('Invite not found', { status: 404 })

    // Check if user is org admin
    const { data: orgUser } = await supabase
      .from('user_organizations')
      .select('role')
      .eq('user_id', user.user.id)
      .eq('organization_id', invite.organization_id)
      .single()
    if (!orgUser || !['admin', 'organization_admin'].includes(orgUser.role))
      return new Response('Forbidden', { status: 403 })

    // Compose invite link
    const inviteLink = `${Deno.env.get('PUBLIC_SITE_URL')}/accept-invite?code=${invite.code}`

    // Send email (replace with your provider)
    // Example: using Resend API
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'JobLine <noreply@jobline.ai>',
        to: invite.email,
        subject: `You\'re invited to join ${invite.organizations.name} on JobLine`,
        html: `
          <p>Hello,</p>
          <p>You have been invited to join <b>${invite.organizations.name}</b> as <b>${invite.roles.name}</b>.</p>
          <p><a href="${inviteLink}">Accept your invite</a></p>
          <p>If you did not expect this, you can ignore this email.</p>
        `
      })
    })
    if (!emailRes.ok) {
      const err = await emailRes.text()
      return new Response(`Failed to send email: ${err}`, { status: 500 })
    }

    // Audit log (optional)
    await supabase.from('audit_logs').insert({
      action: 'resend_invite',
      user_id: user.user.id,
      organization_id: invite.organization_id,
      target_id: invite.id,
      details: { email: invite.email }
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 })
  }
}) 