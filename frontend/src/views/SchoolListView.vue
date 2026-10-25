<!-- SchoolListView.vue -->
<script setup>
    import { onMounted, ref } from "vue";
    import { API_URL } from "../config";
    import SchoolCard from "../components/SchoolCard.vue";
    import { useRouter } from "vue-router";
    import LeafletDemo from "../components/LeafletDemo.vue"

    const schools = ref([]);
    const loading = ref(false);
    const errorMessage = ref("");
    const searchText = ref("");
    const router = useRouter();

    const provinces = ref([]);
    const districts = ref([]);
    const subdistricts = ref([]);

    const selectedProvinceId = ref("");
    const selectedDistrictId = ref("");
    const selectedSubdistrictId = ref("");

    function openSchool(id) {
        router.push({
        name: "school-detail",
        params: { id }
        });
    }

    async function loadProvinces() {
        try {
            const response = await fetch(`${API_URL}/provinces`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            provinces.value = await response.json();
        } catch (error) {
            console.error("Error loading provinces:", error);
        }
    }

    async function loadSchools() {
        loading.value = true;
        errorMessage.value = "";
        

        try {
            const params = new URLSearchParams();
            const keyword = searchText.value.trim();

            if (keyword !== "") {
                params.set("keyword", keyword);
            }
            if (selectedProvinceId.value) params.set("province_id", selectedProvinceId.value);
            if (selectedDistrictId.value) params.set("district_id", selectedDistrictId.value);
            if (selectedSubdistrictId.value) params.set("subdistrict_id", selectedSubdistrictId.value);

            const query = params.toString();
            const url = `${API_URL}/schools${query ? `?${query}` : ""}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            schools.value = data.items;
        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            loading.value = false;
        }
    }

    async function onProvinceChanged() {
        selectedDistrictId.value = "";
        selectedSubdistrictId.value = "";
        districts.value = [];
        subdistricts.value = [];

        if (!selectedProvinceId.value) return;

        try {
            const response = await fetch(`${API_URL}/districts?province_id=${selectedProvinceId.value}`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            districts.value = await response.json();
        } catch (error) {
            console.error("Error loading districts:", error);
        }
    }

    async function onDistrictChanged() {
        selectedSubdistrictId.value = "";
        subdistricts.value = [];

        if (!selectedDistrictId.value) return;

        try {
            const response = await fetch(`${API_URL}/subdistricts?district_id=${selectedDistrictId.value}`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            subdistricts.value = await response.json();
        } catch (error) {
            console.error("Error loading subdistricts:", error);
        }
    }

    function clearSearch() {
        searchText.value = "";
        loadSchools();
    }

    onMounted(() => {
        loadProvinces();
        loadSchools();
    });
</script>

<template>
    <main class="page">
        <h1>Schools</h1>

        <form class="controls" @submit.prevent="loadSchools">
        <input
            v-model="searchText"
            type="text"
            placeholder="Search school name"
            >
        <select v-model="selectedProvinceId" @change="onProvinceChanged">
            <option value="">All provinces</option>
            <option v-for="p in provinces" :key="p.id" :value="String(p.id)">
            {{ p.name_th }}</option>
        </select>

        <select v-model="selectedDistrictId" @change="onDistrictChanged">
            <option value="">All districts</option>
            <option v-for="d in districts" :key="d.id" :value="String(d.id)">
            {{ d.name_th }}</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" @click="clearSearch">Clear</button>
        </form>

        <p v-if="loading">Loading schools...</p>
        <p v-else-if="errorMessage" class="error">
            {{ errorMessage }}
        </p>
        <p v-else-if="schools.length === 0">
            No schools found.
        </p>

        <section v-else>
            <p>Showing {{ schools.length }} school(s) from the current page</p>
            <SchoolCard
                v-for="school in schools"
                :key="school.id"
                :school="school"
                @select="openSchool"
            />

        </section>
    </main>
</template>