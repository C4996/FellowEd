<template>
    <div class="profile">
      <div class="avatar">
        <img :src="avatarUrl" alt="User Avatar" @click="isEditMode = true" />
      </div>
      <div v-if="isEditMode">
        <label>Username:</label>
        <input type="text" v-model="username" />
        <label>Email:</label>
        <input type="email" v-model="email" />
        <div class="avatar-picker">
          <button v-for="avatar in avatars" :key="avatar" @click="selectAvatar(avatar)">
            <img :src="avatar" alt="Avatar" class="avatar-thumb" />
          </button>
        </div>
        <button @click="updateProfile">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <div v-else>
        <h2>{{ username }}</h2>
        <p>{{ email }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // 示例用户信息
  const username = ref('ABC');
  const email = ref('ABC@example.com');
  const avatarUrl = ref('@/assets/images/avatars/default-avatar.jpg'); // 默认头像URL
  const avatars = ref([
    require('@/assets/images/avatars/avatar1.jpg'),
    require('@/assets/images/avatars/avatar2.jpg'),
  ]);
  
  // 控制编辑模式的布尔值
  const isEditMode = ref(false);
  
  // 选择头像
  const selectAvatar = (avatarSrc: string) => {
    avatarUrl.value = avatarSrc;
    isEditMode.value = false;
  };
  
  // 更新用户信息
  const updateProfile = () => {
    console.log('Updated profile:', { username: username.value, email: email.value, avatarUrl: avatarUrl.value });
    isEditMode.value = false;
  };
  
  // 取消编辑
  const cancelEdit = () => {
    // 可以添加代码来重置表单或保持当前状态
    isEditMode.value = false;
  };
  </script>
  
  <style scoped>
  .profile {
    background-color: #f0f0f0;
    padding: 20px;
    border: 1px solid #ccc;
  }
  
  .avatar {
    width: 50px;   
    height: 50px;  
    border-radius: 50%; 
    border: 2px solid #ccc;
  }
  
  .avatar-picker button {
    display: inline-block; /* 内联块级元素，可以设置宽度和高度 */
    margin: 5px; /* 按钮之间的间隔 */
    cursor: pointer; /* 鼠标悬停时显示为手形图标 */
    transition: transform 0.2s; /* 平滑过渡效果 */
  }

  .avatar-picker button:hover {
    transform: scale(1.1); /* 鼠标悬停时放大按钮 */
  }
  
  /* 缩略图样式 */
  .avatar-thumb {
    width: 50px; 
    height: 50px; 
    border-radius: 25px; /* 圆形缩略图 */
    border: 2px solid #ccc; /* 灰色边框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  }

  .avatar-picker button img {
    width: 100%; /* 缩略图图片宽度填满按钮 */
    height: auto; /* 高度自适应 */
    border-radius: 25px; /* 图片也显示为圆形 */
  }
  </style>