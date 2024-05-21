<script setup lang="ts">
const props = defineProps({
    msg: {
        type: Object,
        required: true
    }
});

</script>


<template>
    <p>Hello,this is a message</p>
    <p>{{ props.msg.user }}</p>
    <p>{{props.msg.text}}</p>
    <br />
</template>

<style>

</style>