<template>
<div>
  <v-card
    :color="note.color"
    dark
  >
    <div  class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title
          class="text-h3 px-4 pt-4 pb-3"
          v-text="note.title"
        ></v-card-title>
       
        <v-card-subtitle 
        class="subtitle-2"
        color="darken"
        v-text="note.date"></v-card-subtitle>

        <v-card-text v-text="note.details"></v-card-text>

        <v-card-actions>           

              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon @click="dialog = true">mdi-delete</v-icon>
              </v-btn>

              

              

        </v-card-actions>
      </div>
    </div>
  </v-card>
<!-- confirm delete dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
     
      <v-card>
        
        <v-card-text>Are you sure you want to delete this note? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            No, cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteNote(note.id)"
          >
            Yes, delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- snackbar -->
        <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="snackbarColor"
      rounded="pill"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="snackbarColor"
          snackbarText
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    
  </div>
</template>
<script>
export default {
  props: ['note'],
  data: () => ({
    dialog: false,
    snackbar: false,
    snackbarColor: 'default',
    snackbarText: '',
    timeout: 3000,
  }),
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
    async deleteNote(id){   
          // console.log(this.selectedEvent)
          this.dialog = false         

          await this.$admin.http.delete('/notes/' + id , {
            
          })
          .then( (response) => {
            
           console.log(response.data)
           this.$parent.showNotes('all')
           this.doSnackbar('success', 'Event deleted')
          })
          .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then(() => {
            // always executed  
            this.selectedOpen = false          
            this.dialog = false          
          });
          
      },
    }
  }

</script>
