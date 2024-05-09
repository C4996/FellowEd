<script setup lang="ts">
import InputBox from './components/InputBox.vue'
import Message from './components/Message.vue'
import { computed, onMounted,ref} from 'vue';

export interface Message {
  text: string;
  user: string;

}
const curMsgs = ref([]) ;
  const msgs = computed(() => curMsgs ? curMsgs.value : []);


  onMounted(() => {
    console.log('this is fking you');
    window.addEventListener('receiveMmsgs', (event: Event) => {
        const customEvent = event as CustomEvent;
        curMsgs.value = customEvent.detail;
        console.log('this is fking you ' + curMsgs.value);
    });
});

</script>



<template>
  <div>
    <Message v-for="(m,index) in msgs" :key="index" :msg="m" />
    <InputBox />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background-color: dimgrey;
}


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
