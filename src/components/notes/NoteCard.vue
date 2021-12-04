<template>
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
</template>
<script>
export default {
 props: ['note']
}
</script>
