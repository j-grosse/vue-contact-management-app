# Eventtim Public API
Die Webseite www.eventim.de verwendet eine öffentliche API für die Suche nach Events.

## Events suchen
Ein Event suchen.

### Request
Endpoint: GET https://public-api.eventim.com/websearch/search/api/exploration/v1/products

Beispiel: https://public-api.eventim.com/websearch/search/api/exploration/v1/products?webId=web__eventim-de&language=de&page=1&retail_partner=EVE&city_names=Frankfurt&sort=DateAsc&=&top=50

Parameter
| Name | Beschreibung | Inhalt |
| - | - | - |
| webId | - | web__eventim-de (required) |
| search_term | Suchanfrage | xyz (optional) |
| language | Sprache | de (required) |
| page | Seite | 1 (required) |
| retail_partner | - | TUG (optional) |
| in_stock | Sind die Tickets noch buchbar? | true (optional, boolean) |
| tags | Tags | TICKETDIRECT, MOBILE_TICKET (optional, multiple) |
| city_names | Filtern nach Statt | Frankfurt (optional, multiple) |
| categories | Filtern nach Kategorie | Konzerte (optional, multiple) |
| date_from | Range Start Datum | 2024-05-28 (optional) |
| date_to | Range Ende Datum | 2024-05-29 (optional) |
| time_from | Range Start Uhrzeit | 00:00 (optional) |
| time_to | Range Ende Uhrzeit | 10:59 (optional) |
| sort | Sortieren mit | Recommendation, NameAsc, Rating, DateAsc (required, one of listed) |
| top | Ergebnisse pro Seite | 50 (required, max: 50) |

### Response
```json
{
  "products": [
    {
      "productId": "17352258",
      "productGroupId": "3446553",
      "name": "Rabauken & Trompeten III",
      "type": "LiveEntertainment",
      "status": "Available",
      "link": "https://www.eventim.de/event/rabauken-trompeten-familienkonzerte-fuer-kinder-von-3-bis-6-j-alte-oper-frankfurt-albert-mangelsdorff-foyer-17352258/",
      "url": {
        "path": "/event/rabauken-trompeten-familienkonzerte-fuer-kinder-von-3-bis-6-j-alte-oper-frankfurt-albert-mangelsdorff-foyer-17352258/",
        "domain": "https://www.eventim.de"
      },
      "inStock": false,
      "typeAttributes": {
        "liveEntertainment": {
          "startDate": "2024-06-16T10:00:00+02:00",
          "location": {
            "name": "Albert Mangelsdorff Foyer",
            "city": "Frankfurt",
            "geoLocation": {
              "longitude": 8.683330026516533,
              "latitude": 50.116699986578915
            }
          }
        }
      },
      "attractions": [
        {
          "name": "Alte Oper Frankfurt"
        }
      ],
      "categories": [
        {
          "name": "Konzerte"
        },
        {
          "name": "Weitere Konzerte",
          "parentCategory": {
            "name": "Konzerte"
          }
        }
      ],
      "rating": {
        "count": 51,
        "average": 4.176499843597412
      },
      "hasRecommendation": false
    },
    ...
  ],
  "facets": [
    {
      "name": "cities",
      "facetItems": [
        {
          "value": "Bad Kissingen",
          "count": 17
        },
        ...
      ]
    },
    {
      "name": "productTypes",
      "facetItems": [
        {
          "value": "LiveEntertainment",
          "count": 3
        }
      ]
    },
    {
      "name": "venues",
      "facetItems": [
        {
          "value": "Albert Mangelsdorff Foyer",
          "count": 3
        }
      ]
    },
    {
      "name": "categories",
      "facetHierarchicalItems": [
        {
          "value": "Freizeit",
          "count": 6,
          "hierarchicalItems": [
            {
              "value": "Ausstellungen",
              "count": 1
            },
            ...
          ]
        },
        ...
      ]
    },
    {
      "name": "priceRange",
      "facetRangeItems": [
        {
          "name": "priceMin",
          "value": 17.00
        },
        {
          "name": "priceMax",
          "value": 17.00
        }
      ]
    },
    {
      "name": "recommendations",
      "facetItems": [
        {
          "value": "false",
          "count": 3
        }
      ]
    },
    {
      "name": "topCities",
      "facetHierarchicalItems": [
        {
          "value": "otherCities",
          "count": 18,
          "facetItems": [
            {
              "value": "Berlin",
              "count": 16,
              "info": "berlin-1"
            },
            ...
          ]
        }
      ]
    }
  ],
  "results": 3,
  "totalResults": 3,
  "page": 1,
  "totalPages": 1
}
```

## Ticket Preise pro Artist pro Stadt
Ticketpreise für einen Artist in einer Stadt abfragen.

### Request
Endpoint: GET https://public-api.eventim.com/travel/flexhub/prod/api/v2/min-prices

Beispiel: https://public-api.eventim.com/travel/flexhub/prod/api/v2/min-prices/?city=BERLIN&firstEventDate=2025-12-06&language=de&lastEventDate=2025-12-06&ids=3608435

Parameter
| Name | Beschreibung | Inhalt |
| - | - | - |
| city | Stadt | BERLIN (required) |
| firstEventDate | Range Start Datum | 2025-12-06 (required) |
| lastEventDate | Range Ende Datum | 2025-12-06 (required) |
| language | Sprache | de (required) |
| ids | Artist Id | 3608435 (required) |

### Response
```json
[
  {
    "hotelPricePerPersonPerNight": 66,
    "ticketPricePerPerson": 59.5,
    "id": 3608435,
    "title": "<b>Inklusivleistungen des Ticket + Hotel Angebots:</b>",
    "contentTitle": "<ul style='list-style-type: disc; padding-left: 30px; margin-bottom: 10px'> <li style='line-height: 120%'> <small> <b>Ticket </b>in der gewählten Preiskategorie ab € 59,50 </small> </li> <li style='line-height: 120%'> <small> Übernachtung im<b> Hotel deiner Wahl </b>- direkt in der <b>Nähe des Events</b> ab € 66,00 </small> </li> <li style='line-height: 120%'> <small>Option auf<b> weitere Extras </b>wie Frühstück, Zusatznächte und mehr</small> </li> <li style='line-height: 120%'> <small>Alle Vorteile einer<b> Pauschalreise </b>wie eine komfortable Absicherung</small> </li> <li style='line-height: 120%'> <small>Bei Buchung wird<b> nur die Anzahlung </b>fällig</small> </li></ul><travel-custom style='line-height: 120%; font-size: 90%'> <b>Diese und weitere Vorteile bei EVENTIM.Travel entdecken.</b></travel-custom>",
    "contentBulletPoints": [],
    "startingPrice": 125.5,
    "priceInformation": "",
    "currency": "EUR",
    "url": {
      "path": "/de/event/3608435?utm_source=eventim&utm_medium=dp&utm_campaign=made_ticket_hotel_deta",
      "domain": "https://www.eventim-travel.de"
    }
  }
]
```
