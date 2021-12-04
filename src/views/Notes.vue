<template>
<div>
<base-material-card 
    icon="mdi-clipboard-check-multiple-outline" 
    :title="notesTitle"
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
            @click="showNotes('all')"          
            >
            all
          </v-btn>
        <v-btn v-for="(itemType, i) in itemTypes"
                :key="i.title"
                outlined
            class="mr-4"
            :color="itemType.color"
            @click="showNotes(itemType.title)"
          
                >{{getBtnTitle(itemType.title)}}</v-btn>

        
         
          
        </v-toolbar>
      </v-sheet>
      </v-col>
        </v-row>

          <v-spacer></v-spacer>
        <v-row>
            <v-col
                v-for="(note, i) in theseNotes"
                :key="i"
                cols="12"
                >
                
                 <v-card
            :color="note.color"
            dark
          >
            <div  class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text-h3"
                  v-text="note.title"
                ></v-card-title>

                <v-card-text v-text="note.details"></v-card-text>

                <v-card-actions>
                  <v-btn
                    v-if="note.artist === 'Ellie Goulding'"
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>

                  <v-btn
                    v-else
                    class="ml-2 mt-5"
                    outlined
                    rounded
                    small
                  >
                    START RADIO
                  </v-btn>
                </v-card-actions>
              </div>

              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img :src="note.src"></v-img>
              </v-avatar>
            </div>
          </v-card>

          <NoteCard>

            </v-col>

        </v-row>


  </base-material-card>
  </div>
</template>
<script>
const user_id = 'e7ed1def-3405-47fa-8c8a-fcc85526be46' // mark [admin]
import NoteCard from "@/components/notes/NoteCard";
export default {    
  components: {
    NoteCard
  },
    data: () => ({
        loading: true,
        itemType: 'all',
        itemTypes: [],
        notesTitle: 'Notes',
        notes: [],
        theseNotes: [],
        snackbar: false,
        snackbarText: "",
        snackbarColor: 'blue',
    }),    

    beforeMount: function(){
      this.fetchItemTypes()
    },
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
                    itemType : e.itemType.title,
                    details : e.details,
                    tags : e.tags,
                    date : e.publicationDate,                    
                    id: e.id,
                    color: this.getColor(e.itemType.title)
                   })
                })
                this.loading = false
                console.log(tnotes)
          })
          .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then(function () {
            // always executed            
          });         

          this.notes = tnotes
          this.theseNotes = tnotes
          this.notesTitle = 'Notes | ' + this.itemType
          // console.log(tevents)
      },
        async fetchItemTypes(){
            let types, ttypes = []
            await this.$admin.http.get('/item_types')
            .then((response) => {
                types = response.data['hydra:member']
                // console.log(types)
                
                types.forEach((e)=>{
                  ttypes.push({
                    title : e.title,
                    color: this.getColor(e.title)
                   })
                })
                this.loading = false
                console.log(ttypes)
          })
          .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then(function () {
            // always executed            
          });         

          this.itemTypes = ttypes
          // console.log(tevents)
      },
      showNotes(type){
        let tnotes = []
        if(type !== 'all'){
           tnotes = this.notes.filter(function(t){
            return t.itemType == type
          })
        } else {
          tnotes = this.notes
        }
        this.notesTitle = 'Notes | ' + type
        this.theseNotes = tnotes
        console.log(this.theseNotes)
      },
      getColor(itemType){
        let color = ""
        switch (itemType) {
            case 'general': color = 'primary'; break;
            case 'personal': color = 'success'; break;
            case 'match': color = 'warning'; break;
            case 'training': color = 'error'; break;
        
            default: 
                color = 'default'
                break;
        }

        return color;
      },
      getBtnTitle(i){
        return i
      },
      getTitle(){
        return 'Notes' + this.itemType
      }

    },
    
}
</script>

 