import { ref } from 'vue';

export const useEvents = () => {
  const events = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetch events from various sources
   */
  const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Try to get cached events first
      if (process.client) {
        const cachedEvents = localStorage.getItem('cachedEvents');
        const cacheTime = localStorage.getItem('eventsCacheTime');

        // Use cache if it's less than 6 hours old
        if (cachedEvents && cacheTime) {
          const cacheAge = Date.now() - parseInt(cacheTime);
          if (cacheAge < 6 * 60 * 60 * 1000) {
            // 6 hours
            events.value = JSON.parse(cachedEvents);
            return events.value;
          }
        }
      }

      // Fetch events from Eventim API
      const fetchedEvents = await fetchEventimEvents();

      // Store in state and cache
      events.value = fetchedEvents;

      if (process.client) {
        localStorage.setItem('cachedEvents', JSON.stringify(fetchedEvents));
        localStorage.setItem('eventsCacheTime', Date.now().toString());
      }

      return events.value;
    } catch (err) {
      console.error('Error fetching events:', err);
      error.value = 'Failed to fetch events';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch events from Eventim API
   */
  const fetchEventimEvents = async () => {
    const url =
      'https://public-api.eventim.com/websearch/search/api/exploration/v1/products?webId=web__eventim-de&language=de&page=1&retail_partner=EVE&city_names=K%C3%B6ln&sort=DateAsc&=&top=20';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Eventim API request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      // Map the API response to a format compatible with your app
      return data.products.map((product) => ({
        id: product.id,
        title: product.name,
        date: product.date,
        location: product.location?.name || 'Unbekannter Ort',
        description: product.description || 'Keine Beschreibung verfügbar',
        price: product.price?.min || 0,
      }));
    } catch (err) {
      console.error('Error fetching Eventim events:', err);
      throw err;
    }
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
  };
};
