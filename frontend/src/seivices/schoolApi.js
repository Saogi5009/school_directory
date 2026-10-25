async function loadMap(id) {
    try {
        const response = await fetch(
        `${API_URL}/schools/${id/location}`
        );
            
        if (!response.ok) {
            throw new Error(`HTTP error: ${"Location not found"}`);
        }
        return await response.json();

    } catch (error) {
        errorMessage.value = error.message;
    }
}