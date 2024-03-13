<script setup>

import { ref, onBeforeMount } from 'vue';


const url = ref('http://localhost:3000')
const token = ref('your_jwt')

const submitHandler = () => {
    console.log(url.value, token.value)


    if (url.value.endsWith('/')) {
        url.value = url.value.substring(0, url.value.length - 1);
    }


    window.electron.saveConfig({
        url: url.value,
        token: token.value
    })

}


onBeforeMount(async () => {
    console.log('hi')
    const res = await window.electron.loadConfig()

    if (res) {
        url.value = res.url
        token.value = res.token
    }


})



</script>

<template>
    <div class=" h-screen w-screen px-3 flex justify-center">
        <div class=" my-auto w-full flex flex-col gap-2">
            <div class="flex justify-between items-center">
                <div class=" text-sm font-semibold">Open WebUI Assistant</div>

                <button class="bg-neutral-700 hover:bg-neutral-800 transition text-white text-xs px-3 py-1 rounded-lg"
                    @click="submitHandler">Save</button>
            </div>
            <div class="flex flex-col gap-1.5">


                <input v-model="url"
                    class=" w-full bg-gray-100 hover:bg-gray-200 transition rounded-lg py-1 px-2 text-sm outline-none"
                    placeholder="Open WebUI URL" />
                <input v-model="token"
                    class=" w-full bg-gray-100 hover:bg-gray-200 transition rounded-lg py-1 px-2 text-sm outline-none"
                    placeholder="Open WebUI Token" />



            </div>
        </div>


    </div>

</template>


<style>
@import './index.css';
</style>