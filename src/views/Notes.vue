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
            small 
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="showNotes('all')"          
            >
            all
          </v-btn>
        <v-btn v-for="(itemType, i) in itemTypes"
                :key="i.title"
                small
                
            class="mr-4"
            :color="itemType.color"
            @click="showNotes(itemType.title)"
          
                >{{getBtnTitle(itemType.title)}}</v-btn>

        <v-btn
            outlined
            small             
            class="mr-4"
            color="grey darken-2"
            @click="dialog = true"          
            >
            <v-icon left>
        mdi-plus
      </v-icon> new
          </v-btn>
         
          
        </v-toolbar>
      </v-sheet>
      </v-col>
        </v-row>

          <v-spacer></v-spacer>
        <v-row v-if="theseNotes.length > 0">
            <v-col            
                v-for="(note, i) in theseNotes"
                :key="i"
                cols="12"
                >           

          <NoteCard :note="note" />

            </v-col>
        </v-row>
        <v-row v-else>
          <p class="pl-5">No notes available.</p>
        </v-row>


  </base-material-card>
  <!--  dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
     <v-card class="pl-5 pr-5 pb-5 ">
     <NewNote />
     </v-card>
      
    </v-dialog>
  </div>
</template>
<script>
const user_id = 'e7ed1def-3405-47fa-8c8a-fcc85526be46' // mark [admin]
import NoteCard from "@/components/notes/NoteCard";
import NewNote from "@/components/forms/NewNote";
export default {    
  components: {
    NewNote,
    NoteCard
  },
    data: () => ({
      dialog: false,
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
               // console.log(tnotes)
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
               // console.log(ttypes)
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
        //console.log(this.theseNotes)
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

 