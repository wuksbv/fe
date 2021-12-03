<template>
<div>
<base-material-card 
    icon="mdi-clipboard-check-multiple-outline" 
    title="Notes"
    ref="notes"
    >

   <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
        <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = general"          
            >
            all
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = general"          >
            general
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = personal"          >
            personal
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = match"          >
            match
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = training"          >
            training
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes = health"          >
            health
          </v-btn>         
         
          <v-spacer></v-spacer>
          
        </v-toolbar>
      </v-sheet>
      </v-col>
        </v-row>
  </base-material-card>
  </div>
</template>
<script>
const user_id = 'e7ed1def-3405-47fa-8c8a-fcc85526be46' // mark [admin]
export default {    
    data: () => ({
        loading: true,
        notes: [],
        snackbar: false,
        snackbarText: "",
        snackbarColor: 'blue'
    }),    
    mounted: function(){
        this.fetchNotes()
    },
    methods: {
        doSnackbar(type, message){
            switch (type) {
                case 'error':
                    this.snackbarColor = 'red'
                    break;
                case 'success':
                    this.snackbarColor = 'green'
                    break;
            
                default:
                    this.snackbarColor = 'blue'
                    break;
            }

            this.snackbarText = message
            this.snackbar = true
        },
        async fetchNotes(){
            let notes, tnotes = []
            await this.$admin.http.get('/notes', {
                params: {
                    user_id: user_id
                }
            })
            .then((response) => {
                notes = response.data['hydra:member']
                // console.log(notes)
                
                notes.forEach((e)=>{
                  tnotes.push({
                    title : e.title,
                    itemType : e.itemType,
                    details : e.details,
                    tags : e.tags,
                    date : e.publicationDate,                    
                    id: e.id
                   })
                })
                this.loading = false
          })
          .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then(function () {
            // always executed            
          });

          

          this.notes = tnotes
          // console.log(tevents)
      },
    },
}
</script>

 