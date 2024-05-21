<script setup lang="ts">


</script>

<template>
  <div id="user-list">
    <ul>
      <li class="user-item" v-for="user in users" :key="user.userId" @click="viewDetails(user)">
        <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Avatar" class="avatar">
        <span class="username">{{ user.name }}</span>
        <span class="status">{{ user.status }}</span>
      </li>
    </ul>
    <div class="actions">
      <button @click="inviteUser">Invite User</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    users.value = response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const viewDetails = (user) => {
  // Logic to view user details
  console.log('Viewing details for:', user);
};

const inviteUser = async () => {
  try {
    // Assume this API call sends an invitation
    await axios.post('/api/invite');
    console.log('Invitation sent');
    // Refresh the user list after inviting a new user
    fetchUsers();
  } catch (error) {
    console.error('Failed to invite user:', error);
  }
};

fetchUsers(); // Initial fetch on component load
</script>

<style scoped>
#user-list {
  padding: 10px;
  background-color: #fff;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
}

.user-item:hover {
  background-color: #f0f0f0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  margin-right: 10px;
}

.status {
  font-size: 12px;
  color: #888;
}

.actions {
  margin-top: 10px;
  text-align: right;
}

.actions button {
  padding: 5px 10px;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
