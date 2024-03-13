<script setup>

import { ref, onBeforeMount } from 'vue';


const url = ref('http://localhost:3000')
const token = ref('your_jwt')

const connected = ref(false)


const models = ref([])
const selectedModel = ref('')

const saveHandler = async () => {
    console.log(url.value, token.value)

    if (url.value.endsWith('/')) {
        url.value = url.value.substring(0, url.value.length - 1);
    }

    window.electron.saveConfig({
        url: url.value,
        token: token.value
    })


    connected.value = await window.electron.checkConnection()

    new Notification("Open WebUI", { body: connected.value ? 'Server Connection Verified' : 'Server Connection Failed' })

    if (connected.value) {
        models.value = await window.electron.getModels()
        console.log(models.value)
    }
}

const editHandler = () => {
    connected.value = false
}

const selectModelHandler = async () => {
    console.log(selectedModel.value)

    if (selectedModel.value) {
        selectedModel.value = await window.electron.selectModel(selectedModel.value)

    }

}


onBeforeMount(async () => {
    const res = await window.electron.loadConfig()

    if (res) {
        url.value = res.url
        token.value = res.token
    }
})


</script>

<template>
    <div class=" h-screen w-screen p-3 flex justify-center">
        <form class=" my-auto w-full flex flex-col gap-2" @submit.prevent="saveHandler">
            <div class="flex justify-between items-center">
                <div class=" text-sm font-semibold">Open WebUI Assistant</div>

                <div v-if="connected">
                    <button
                        class="bg-green-100 hover:bg-green-200 text-green-700 font-medium transition  text-xs px-3 py-1 rounded-lg"
                        @click="editHandler">Connected</button>
                </div>

                <div v-else>
                    <button
                        class="bg-neutral-700 hover:bg-neutral-800 transition text-white text-xs px-3 py-1 rounded-lg"
                        type="submit">Connect</button>
                </div>


            </div>
            <div class="flex flex-col gap-1.5">


                <input v-model="url"
                    class=" w-full bg-gray-100 hover:bg-gray-200 transition rounded-lg py-1 px-2 text-xs outline-none disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:text-gray-500"
                    placeholder="Open WebUI URL" :disabled='connected' required />
                <input v-model="token"
                    class=" w-full bg-gray-100 hover:bg-gray-200 transition rounded-lg py-1 px-2 text-xs outline-none disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:text-gray-500"
                    placeholder="Open WebUI Token" :disabled='connected' required />

                <hr />

                <div class="flex gap-1">


                    <select v-model="selectedModel"
                        class=" w-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition rounded-lg py-1 px-2 outline-none">
                        <option value="" disabled class="text-xs text-gray-200">Select a model</option>
                        <option v-for="model in models" v-bind:value="model.name">{{ model.name }}</option>
                    </select>

                    <button class="p-1 bg-gray-100 hover:bg-gray-200 transition rounded-lg" type="button"
                        @click="selectModelHandler">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                            <path fill-rule="evenodd"
                                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                                clip-rule="evenodd" />
                        </svg>

                    </button>

                </div>



            </div>
        </form>


    </div>

</template>


<style>
@import './index.css';

select {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* for Chrome */
    -webkit-appearance: none;
}
</style>