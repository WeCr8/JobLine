<template>
  <div class="onboarding">
    <h2>Welcome to JobLine!</h2>
    <p>How would you like to get started?</p>
    <div>
      <button @click="choice = 'join'">Join an existing team</button>
      <button @click="choice = 'create'">Create a new organization</button>
    </div>

    <div v-if="choice === 'join'" class="onboarding-join">
      <input v-model="inviteCode" placeholder="Enter invite code or your invite email" />
      <button @click="joinTeam" :disabled="loading">Join</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-if="choice === 'create'" class="onboarding-create">
      <input v-model="orgName" placeholder="Organization Name" />
      <input v-model="teamName" placeholder="(Optional) Team Name" />
      <button @click="createOrg" :disabled="loading">Create</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const choice = ref<'join' | 'create' | null>(null)
const inviteCode = ref('')
const orgName = ref('')
const teamName = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const joinTeam = async () => {
  loading.value = true
  error.value = ''
  try {
    if (!authStore.user || !authStore.user.id || !authStore.user.email) {
      throw new Error('User not authenticated. Please log in again.')
    }
    // Try to find invite by code or email
    let { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .or(`code.eq.${inviteCode.value},email.eq.${authStore.user.email}`)
      .eq('status', 'pending')
      .single()

    if (inviteError || !invite) throw new Error('Invite not found or already used.')

    // Add user to org/team with role from invite
    await supabase.from('user_organizations').upsert({
      user_id: authStore.user.id,
      organization_id: invite.organization_id,
      role_id: invite.role_id,
    })
    if (invite.team_id) {
      await supabase.from('user_teams').upsert({
        user_id: authStore.user.id,
        team_id: invite.team_id,
        role_id: invite.role_id,
      })
    }
    // Mark invite as accepted
    await supabase.from('invites').update({ status: 'accepted' }).eq('id', invite.id)
    // Mark onboarding complete
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', authStore.user.id)
    router.push('/') // Go to main app
  } catch (e: any) {
    error.value = e.message || 'Failed to join team'
  } finally {
    loading.value = false
  }
}

const createOrg = async () => {
  loading.value = true
  error.value = ''
  try {
    if (!authStore.user || !authStore.user.id) {
      throw new Error('User not authenticated. Please log in again.')
    }
    // Create org
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: orgName.value, created_by: authStore.user.id })
      .select()
      .single()
    if (orgError || !org) throw new Error('Failed to create organization')
    // Add user as owner
    const { data: ownerRole, error: ownerRoleError } = await supabase.from('roles').select('id').eq('name', 'owner').single()
    if (ownerRoleError || !ownerRole) throw new Error('Owner role not found. Please contact support.')
    await supabase.from('user_organizations').insert({
      user_id: authStore.user.id,
      organization_id: org.id,
      role_id: ownerRole.id,
    })
    // Optionally create team
    if (teamName.value) {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({ name: teamName.value, organization_id: org.id, created_by: authStore.user.id })
        .select()
        .single()
      if (teamError || !team) throw new Error('Failed to create team')
      await supabase.from('user_teams').insert({
        user_id: authStore.user.id,
        team_id: team.id,
        role_id: ownerRole.id,
      })
    }
    // Mark onboarding complete
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', authStore.user.id)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Failed to create organization'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.onboarding { max-width: 400px; margin: 2rem auto; }
.error { color: red; }
</style> 