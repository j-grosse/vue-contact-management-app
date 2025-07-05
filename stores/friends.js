import { defineStore } from 'pinia';

export const useFriendsStore = defineStore('friends', {
  state: () => ({
    friends: [],
    isFriendModalOpen: false,
    showDeleteConfirmation: false,
    friendForm: {
      id: null,
      name: '',
      photo: '',
      notes: '',
      lastContactDate: new Date().toISOString().split('T')[0],
      contactInterval: 30,
      nextContactDate: null,
      interactions: [],
    },
  }),

  actions: {
    initializeFriends() {
      if (process.client) {
        try {
          const savedFriends = localStorage.getItem('friends');
          if (savedFriends) {
            this.friends = JSON.parse(savedFriends);
          } else {
            // Add default friends
            this.friends = this.getDefaultFriends();
          }
        } catch (error) {
          console.error('Error initializing friends:', error);
          this.friends = this.getDefaultFriends();
        }
      }
    },

    getDefaultFriends() {
      const today = new Date();

      // Helper function to create a date with offset days from today
      const createDateWithOffset = (offsetDays) => {
        const date = new Date(today);
        date.setDate(date.getDate() + offsetDays);
        return date.toISOString().split('T')[0];
      };

      // Helper function to calculate next contact date
      const calcNextContactDate = (lastContactDate, intervalDays) => {
        const date = new Date(lastContactDate);
        date.setDate(date.getDate() + intervalDays);
        return date.toISOString().split('T')[0];
      };

      return [
        {
          id: '1',
          name:'Zoe Schneider',
          photo: 'https://randomuser.me/api/portraits/women/27.jpg',
          notes: 'Liebt Wandern und Fotografie',
          lastContactDate: createDateWithOffset(-6),
          contactInterval: 7,
          nextContactDate: createDateWithOffset(0), // -1 + 7
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414181",
              date: createDateWithOffset(-6),
              text: "Wanderung auf den Drachenfels in Bonn"
            }
          ]
        },
        {
          id: '2',
          name: 'Rick Smith',
          photo: 'https://randomuser.me/api/portraits/men/54.jpg',
          notes: 'Fußballfan, trifft sich gerne zum Sport',
          lastContactDate: createDateWithOffset(-25),
          contactInterval: 30,
          nextContactDate: createDateWithOffset(5), // -25 + 30
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414182",
              date: createDateWithOffset(-20),
              text: "Fußballspiel im Park - Bayern vs Dortmund geschaut"
            },
            {
              id: "1750855414183",
              date: createDateWithOffset(-15),
              text: "Jogging-Runde zusammen gemacht"
            }
          ]
        },
        {
          id: '3',
          name: 'Frank Tepel',
          photo: 'https://randomuser.me/api/portraits/men/22.jpg',
          notes: 'Studiert Medizin, mag Konzerte',
          lastContactDate: createDateWithOffset(-12),
          contactInterval: 14,
          nextContactDate: createDateWithOffset(2), // -12 + 14
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414184",
              date: createDateWithOffset(-10),
              text: "Konzert von Die Ärzte besucht - war mega!"
            },
            {
              id: "1750855414185",
              date: createDateWithOffset(-8),
              text: "Über Medizinstudium und Prüfungen gesprochen"
            }
          ]
        },
        {
          id: '4',
          name: 'Dev Singh',
          photo: 'https://randomuser.me/api/portraits/men/39.jpg',
          notes: 'Arbeitet als Grafiker, Kaffee-Enthusiast',
          lastContactDate: createDateWithOffset(-80),
          contactInterval: 60,
          nextContactDate: createDateWithOffset(-20), // -80 + 60, fällig!
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414186",
              date: createDateWithOffset(-75),
              text: "Neue Kaffeerösterei in der Stadt entdeckt"
            },
            {
              id: "1750855414187",
              date: createDateWithOffset(-70),
              text: "Über Design-Projekte und Adobe Creative Suite gesprochen"
            }
          ]
        },
        {
          id: '5',
          name: 'Julia Klein',
          photo: 'https://randomuser.me/api/portraits/women/47.jpg',
          notes: 'Reist viel, sammelt Postkarten',
          lastContactDate: createDateWithOffset(-2),
          contactInterval: 21,
          nextContactDate: createDateWithOffset(19), // -2 + 21
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414188",
              date: createDateWithOffset(-5),
              text: "Postkarte aus Barcelona erhalten - war dort im Urlaub"
            },
            {
              id: "1750855414189",
              date: createDateWithOffset(-3),
              text: "Über nächste Reisepläne nach Portugal gesprochen"
            }
          ]
        },
        {
          id: '6',
          name: 'Mike Becker',
          photo: 'https://randomuser.me/api/portraits/men/23.jpg',
          notes: 'Buchliebhaber, hat gute Filmempfehlungen',
          lastContactDate: createDateWithOffset(-45),
          contactInterval: 45,
          nextContactDate: createDateWithOffset(0), // -45 + 45, heute!
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414190",
              date: createDateWithOffset(-40),
              text: "Neues Buch 'Der Alchemist' empfohlen bekommen"
            },
            {
              id: "1750855414191",
              date: createDateWithOffset(-35),
              text: "Filmabend - 'Inception' zusammen geschaut"
            }
          ]
        },
        {
          id: '7',
          name: 'Lu Chen',
          photo: 'https://randomuser.me/api/portraits/women/2.jpg',
          notes: 'Fitnesstrainerin, teilt gesunde Rezepte',
          lastContactDate: createDateWithOffset(-27),
          contactInterval: 30,
          nextContactDate: createDateWithOffset(3), // -27 + 30
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414192",
              date: createDateWithOffset(-25),
              text: "Neues Protein-Smoothie Rezept ausgetauscht"
            },
            {
              id: "1750855414193",
              date: createDateWithOffset(-22),
              text: "Gemeinsames Workout im Fitnessstudio"
            }
          ]
        },
        {
          id: '8',
          name: 'David Bukowski',
          photo: 'https://randomuser.me/api/portraits/men/14.jpg',
          notes: 'Programmierer, DJ, kennt sich mit Technik aus, war bei seiner Party 03/2025',
          lastContactDate: createDateWithOffset(-3),
          contactInterval: 10,
          nextContactDate: createDateWithOffset(7), // -3 + 10
          showDeleteConfirm: false,
          interactions: [
            {
              id: "1750855414194",
              date: createDateWithOffset(-8),
              text: "Über neue JavaScript-Frameworks diskutiert"
            },
            {
              id: "1750855414195",
              date: createDateWithOffset(-5),
              text: "DJ-Set bei seiner Geburtstagsparty gehört"
            }
          ]
        },
      ];
    },

    resetFriendForm() {
      this.friendForm = {
        id: null,
        name: '',
        photo: '',
        notes: '',
        lastContactDate: new Date().toISOString().split('T')[0],
        contactInterval: 30,
        nextContactDate: null,
      };
    },

    addFriend(friendData) {
      const newFriend = {
        ...friendData,
        id: Date.now().toString(),
      };
      this.friends.push(newFriend);
      this.saveFriendsToStorage();
    },

    updateFriend(id, friendData) {
      const index = this.friends.findIndex((f) => f.id === id);
      if (index !== -1) {
        // Preserve the existing friend's data and update with new data
        const existingFriend = this.friends[index];
        this.friends[index] = {
          ...existingFriend,
          ...friendData,
          id, // Ensure ID stays the same
          interactions: friendData.interactions || existingFriend.interactions || [] // Preserve interactions
        };
        this.saveFriendsToStorage();
      }
    },

    deleteFriend(id) {
      this.friends = this.friends.filter((f) => f.id !== id);
      this.saveFriendsToStorage();
    },

    markAsContacted(id) {
      const index = this.friends.findIndex((f) => f.id === id);
      if (index !== -1) {
        const friend = this.friends[index];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if the friend was already contacted today
        if (friend.lastContactDate === today) {
          return false; // Already contacted today, no change needed
        }
        
        const nextContactDate = new Date();
        nextContactDate.setDate(
          nextContactDate.getDate() + parseInt(friend.contactInterval)
        );

        this.friends[index] = {
          ...friend,
          lastContactDate: today,
          nextContactDate: nextContactDate.toISOString().split('T')[0],
        };

        this.saveFriendsToStorage();
        return true; // Indicate that something changed
      }
    },

    getUpcomingContacts() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      return this.friends
        .filter((friend) => {
          const nextContactDate = new Date(friend.nextContactDate);
          nextContactDate.setHours(0, 0, 0, 0);

          // Include overdue contacts (before today) and contacts due within 7 days
          return nextContactDate <= sevenDaysFromNow;
        })
        .sort((a, b) => {
          return new Date(a.nextContactDate) - new Date(b.nextContactDate);
        });
    },

    getRecentlyContactedFriends() {
      // Sort by lastContactDate (newest first) and take the top 5
      return [...this.friends]
        .sort(
          (a, b) => new Date(b.lastContactDate) - new Date(a.lastContactDate)
        )
        .slice(0, 5);
    },

    saveFriendsToStorage() {
      if (process.client) {
        try {
          localStorage.setItem('friends', JSON.stringify(this.friends));
        } catch (error) {
          console.error('Error saving friends to localStorage:', error);
        }
      }
    },

    addInteraction(friendId, interaction) {
      const index = this.friends.findIndex(f => f.id === friendId);
      if (index !== -1) {
        const friend = this.friends[index];
        this.friends[index] = {
          ...friend,
          interactions: [
            ...(friend.interactions || []),
            {
              id: Date.now().toString(),
              date: interaction.date,
              text: interaction.text,
              photo: interaction.photo
            }
          ]
        };
        this.saveFriendsToStorage();
      }
    }
  },
});
