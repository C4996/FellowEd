<script setup lang="ts">
import { ref } from 'vue';
let content = ref('');

</script>


<template>
    <!-- <container>
        <textarea></textarea>
        <button>Send</button>
    </container> -->
    <v-container id="chat-input-box">
        <v-text-field v-model="content" label="Type your message here" outlined></v-text-field>
    </v-container>
</template>

<style></style>