<!-- SchoolDetailView.vue -->
 <script setup>
    import { onMounted, ref } from "vue";
    import { useRoute } from "vue-router";
    import { API_URL } from "../config";
    import SchoolLocationMap from "../components/SchoolLocationMap.vue";

    const route = useRoute();
    const school = ref(null);
    const location = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const locationError = ref("");

    async function loadSchool() {
        loading.value = true;
        errorMessage.value = "";
        locationError.value = "";
        school.value = null;
        location.value = null;

        try {
            const response = await fetch(
            `${API_URL}/schools/${route.params.id}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            school.value = await response.json();


            const locResponse = await fetch(`${API_URL}/schools/${route.params.id}/location`);
            if (!locResponse.ok) {
                throw new Error("School location unavailable");
            }
            location.value = await locResponse.json();

        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            loading.value = false;
        }
    }
    onMounted(loadSchool);
</script>

<template>
    <main class="page">
        <RouterLink to="/schools">Back to schools</RouterLink>
        <p v-if="loading">Loading school...</p>
        <p v-else-if="errorMessage" class="error">
        {{ errorMessage }}
        </p>

        <section v-else-if="school" class="school-detail">
            <h1>{{ school.name_th }}</h1>
            <p>Province: {{ school.province_name_th }}</p>
            <p>District: {{ school.district_name_th }}</p>
            <p>Subdistrict: {{ school.subdistrict_name_th }}</p>
            <p>SMIS code: {{ school.smis_code }}</p>
            <p v-if="school.name_en">English name: {{ school.name_en }}</p>
        </section>

        <div class="map-section" style="margin-top: 25px;">
            <h2>School Location</h2>
            <SchoolLocationMap 
                v-if="location" 
                :latitude="location.latitude" 
                :longitude="location.longitude" 
            />
            <p v-else class="error">
                {{ locationError || "Location unavailable for this school." }}
            </p>
        </div>
    </main>
</template>