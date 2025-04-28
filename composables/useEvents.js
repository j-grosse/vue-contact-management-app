import { ref } from 'vue';


export const useEvents = () => {
  const events = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  /**
   * Fetch events from multiple sources and merge them.
   */
  const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch events concurrently from different sources
      const [eventimEvents, koelnEvents] = await Promise.all([
        fetchEventimEvents(),
        // fetchKoelnEvents(),
      ]);

      // Try to get cached events first
      // if (process.client) {
      //   const cachedEvents = localStorage.getItem('cachedEvents');
      //   const cacheTime = localStorage.getItem('eventsCacheTime');

      //   // Use cache if it's less than 6 hours old
      //   if (cachedEvents && cacheTime) {
      //     const cacheAge = Date.now() - parseInt(cacheTime);
      //     if (cacheAge < 6 * 60 * 60 * 1000) {
      //       // 6 hours
      //       events.value = JSON.parse(cachedEvents);
      //       return events.value;
      //     }
      //   }
      // }

      // Fetch events from Eventim API
      const fetchedEvents = await fetchEventimEvents();

      // Store in state and cache
      // events.value = fetchedEvents;
      events.value = eventimEvents;

      // Merge events and sort them by date
      // events.value = [...eventimEvents, ...koelnEvents].sort(
      //   (a, b) => new Date(a.date) - new Date(b.date)
      // );

      if (process.client) {
        localStorage.setItem('cachedEvents', JSON.stringify(events.value));
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

      // Map the API response to a format compatible with your app (using data.products)
      return data.products.map((product) => ({
        id: product.productId,
        title: product.name,
        date: product.typeAttributes.liveEntertainment.startDate,
        location:
          product.typeAttributes.liveEntertainment.location?.name ||
          'Unbekannter Ort',
        description: product.link || 'Keine Beschreibung verfügbar',
        price: (product.price && product.currency) || 0,
        link: product.link || '#',
      }));
    } catch (err) {
      console.error('Error fetching Eventim events:', err);
      throw err;
    }
  };

  /**
   * Fetch events from Cologne's open data API.
   * This API returns a JSON object where the main events array is stored in "items".
   */
  const fetchKoelnEvents = async () => {
    const url =
      'https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Köln API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      // Map the API response to a format compatible with the app
      return data.items.map((item) => ({
        title: item.title,
        date: item.beginndatum, // adjust if the field name differs
        location: item.veranstaltungsort || 'Unbekannter Ort',
        description: item.description || 'Keine Beschreibung verfügbar',
        price: item.preis || 0,
        link: item.link || '#',
      }));
    } catch (err) {
      console.error('Error fetching Köln events:', err);
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
