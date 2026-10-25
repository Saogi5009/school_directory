<script setup>
  import { ref, computed } from "vue";
  import SchoolCard from "./components/SchoolCard.vue";

  const courseName = "Web Development";
  const pageTitle = "School Directory";
  const semester = "Semester 1";
  const visitCount = ref(0);
  const statusMessage = ref("No school selected");

  function recordVisit() {
    visitCount.value++;
    statusMessage.value = "The directory was used";
  }

  const searchText = ref("")
  const schools = ref([
    {id: 1, name: "KMIDS", province: "Bangkok", students: 1200 },
    {id: 2, name: "Rayong Technical School", province: "Rayong", students: 850 },
    {id: 3, name: "Chonburi Science School", province: "Chonburi", students: 640 },
    {id: 4, name: "Bangkok Digital School", province: "Bangkok", students: 980 },
    {id: 5, name: "Startorch Academy", province: "Solaris3", students: 1000 }
  ]);

  const filteredSchools = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    if (keyword === "") {
      return schools.value;
    }

    return schools.value.filter((school) =>
      school.name.toLowerCase().includes(keyword) ||
      school.province.toLowerCase().includes(keyword)
    );
  });

  const showStudentCount = ref(true);
  function toggleStudentCount() {
    showStudentCount.value = !showStudentCount.value;
  }

  const selectedSchoolId = ref(null);

  function selectSchool(id) {
    selectedSchoolId.value = id;
    statusMessage.value = `Selected school ID: ${id}`;
  }

  const selectedSchool = computed(() =>
    schools.value.find((school) => school.id === selectedSchoolId.value)
  );

  function reset() {
    visitCount.value = 0;
    searchText.value = "";
  }


</script>

<template>
  <div class="app-shell">
    
    <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/schools">Schools</RouterLink>
    </nav>
    </header>

    <RouterView />

  </div>
</template>

<style>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  .app-shell {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px 40px;
  }
  nav {
    display: flex;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
  }
  .page {
    padding-top: 20px;
  }
</style>