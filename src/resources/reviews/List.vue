<template>
  <base-material-card :icon="resource.icon" :title="title">
   <v-card v-for="review in reviews" :key="review.longname">
     <p>{{review.longname}}</p>
   </v-card>
  </base-material-card>
</template>

<script>
import axios from "axios";
const baseURI = 'http://wuksapi.herokuapp.com/reviews/micazu'
const axios2 = axios.create({
  baseURI,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});
export default {
  props: ["resource", "title"],
  data() {
    return {
        reviews: [],
        fields: ["title", "body"],
        
    };
  },
  methods: {
            fetchReviews: function () {
                alert('fetch')
                const baseURI = 'http://wuksapi.herokuapp.com/reviews/micazu'
                axios2.get(baseURI)
                .then((result) => {
                    this.reviews = result.data
                    console.warn[result.data]
                })
            }
        },        
  mounted() {
          alert('mounted')
            this.fetchReviews()
        },    
};
</script>

