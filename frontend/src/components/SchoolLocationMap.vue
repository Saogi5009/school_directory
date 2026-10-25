<script setup>
    import { ref, onMounted, onBeforeUnmount, watch } from "vue";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";

    const props = defineProps({
    latitude: Number,
    longitude: Number
    });

    const mapElement = ref(null);
    let map = null;

    const initMap = (lat, lng) => {
    if (map) {
        map.remove();
    }
    
    if (lat && lng) {
        map = L.map(mapElement.value).setView([lat, lng], 15);
        
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
        }).addTo(map);

        L.marker([lat, lng]).addTo(map).bindPopup("School Location");
    }
    };

    onMounted(() => {
        initMap(props.latitude, props.longitude);
    });

    // เฝ้าระวังเมื่อ Props (พิกัด) เปลี่ยนแปลง เช่น เวลาเปลี่ยนหน้าโรงเรียน
    watch(() => [props.latitude, props.longitude], ([newLat, newLng]) => {
    initMap(newLat, newLng);
    });

    onBeforeUnmount(() => {
    if (map) {
        map.remove();
    }
    });
</script>

<template>
  <div ref="mapElement" class="school-map"></div>
</template>

<style scoped>
.school-map {
  height: 300px;
  width: 100%;
  margin-top: 20px;
  border-radius: 8px;
}
</style>
```[cite: 10, 11]

---

