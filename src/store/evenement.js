import { defineStore } from 'pinia';
import axios from 'axios';

export const useEvenementStore = defineStore('evenement', {
  state: () => ({
    evenements: [],
    evenementProchain: null,
  }),
  actions: {
    async chargerEvenements() {
      const { data } = await axios.get('http://localhost:8000/api/evenements');
      this.evenements = data.member;
    },
    async chargerEvenementProchain() {
      const { data } = await axios.get('http://localhost:8000/api/evenements');
      const tous = data.member;
      const maintenant = new Date();
      const prochains = tous
        .filter(e => new Date(e.dateEvenement) > maintenant)
        .sort((a, b) => new Date(a.dateEvenement) - new Date(b.dateEvenement));
      this.evenementProchain = prochains[0] || null;
    },
  },
});
