<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="600">

          <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

        <div v-if="loading" class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>&nbsp; Loading events
    </div>

        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :type="type"
          :events="events"
          :event-color="getEventColor"
          :event-ripple="false"
          @change="fetchEvents"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag"
          @click:event="showEvent"
        >
    

         <!-- drag -->
          <template v-slot:event="{ event, timed, eventSummary }">
              
            <div
              class="v-event-draggable"
              v-html="eventSummary()"
            ></div>
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
          
          <!-- dayline -->
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>

        </v-calendar>

        <!-- refresh button -->
        <v-btn icon
        @click="fetchEvents">
                <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <!-- opened event dialog -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >

            

            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              
              <v-toolbar-title v-if="!selectedEvent.edit" v-html="selectedEvent.name" v-on:click="$set(selectedEvent, 'edit', !selectedEvent.edit)"></v-toolbar-title>
              <input type="text" style="color:white" v-else v-model="selectedEvent.name">
              <v-spacer></v-spacer>
              
              <v-btn icon @click="editSelectedEvent()">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="dialog = true">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
               <v-btn icon @click="saveSelectedEvent()">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
              <v-btn icon @click="colorSelectedEvent()">
                <v-icon>mdi-eyedropper</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p v-if="!selectedEvent.edit" v-html="selectedEvent.details" v-on:click="$set(selectedEvent, 'edit', !selectedEvent.edit)"></p>
              <textarea v-else v-model="selectedEvent.details"></textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
              <v-btn
                v-if="isEditing"
                text
                color="secondary"
                @click="updateSelectedEvent()"
              >
              <v-icon>mdi-save</v-icon>
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
            
        </v-menu>

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
        
        

      </v-sheet>
    </v-col>

    <!-- confirm delete dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
     
      <v-card>
        
        <v-card-text>Are you sure you want to delete this event? </v-card-text>
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
            @click="deleteSelectedEvent()"
          >
            Yes, delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  const calendar_id = '4b8fface-fb90-4bc2-b369-e586fc745829'
  export default {
    data: () => ({
      loading: true,
      snackbar: false,
      snackbarText: 'My timeout is set to 2000.',
      snackbarColor: 'blue',
      timeout: 3000,
      dialog: false,
      isEditing: false,
      focus: '',
      value: '',
      ready: false,
      events: [],
      colors: ['#2196F3', '#3F51B5', '#673AB7', '#00BCD4', '#4CAF50', '#FF9800', '#757575'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,
      type: 'day',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      items: [
        { title: 'Edit', icon: "mdi-edit" },
        { title: 'Delete', icon: "mdi-delete" },
        { title: 'Color', icon: "mdi-eyedropper" },
      ],
    }),
    computed: {
      cal () {
        return this.ready ? this.$refs.calendar : null
      },
      nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
      this.ready = true
      this.scrollToTime()
      this.updateTime()
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
      colorSelectedEvent(){
          alert('Color selected events')
      },
      editSelectedEvent(){
          this.isEditing = true
          alert('Edit selected events')
      },
      async deleteSelectedEvent(){
          // console.log(this.selectedEvent)
          this.dialog = false         

          if(!this.selectedEvent.id){
              this.fetchEvents()
              return;
          }

          await this.$admin.http.delete('/calendar_events/' + this.selectedEvent.id , {
            
          })
          .then( (response) => {
            
           // console.log(response.data)
           this.fetchEvents()
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
      async saveSelectedEvent(){
          let event = []
          const start = this.timeConverter(this.selectedEvent.start);
          const end = this.timeConverter(this.selectedEvent.end);
          let body = this.selectedEvent.details ? this.selectedEvent.details : "&nbsp;";
          
          await this.$admin.http.post('/calendar_events', {
             
                name: this.selectedEvent.name,
                calendar: 'api/calendars/' + calendar_id,
                start: start,
                end: end,
                body: body,
                timed: this.selectedEvent.timed,
                author: 'admin',
                color: this.selectedEvent.color
            
          })
          .then( (response) => {
            
           // console.log(response.data)
           this.fetchEvents()
           this.doSnackbar('success', 'Event saved')
          })
           .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then( () => {
            // always executed  
            this.selectedOpen = false          
            this.dialog = false          
          });
      },
      async updateSelectedEvent(){
          let event = []
          const start = this.timeConverter(this.selectedEvent.start);
          const end = this.timeConverter(this.selectedEvent.end);
          let body = this.selectedEvent.details ? this.selectedEvent.details : "&nbsp;";
         
          await this.$admin.http.put('/calendar_events/' + this.selectedEvent.id, {
             
                name: this.selectedEvent.name,
                calendar: 'api/calendars/' + calendar_id,
                start: start,
                end: end,
                body: body,
                timed: this.selectedEvent.timed,
                author: 'admin',
                color: this.selectedEvent.color
            
          })
          .then( (response) => {
            
           // console.log(response.data)
           this.fetchEvents()
           this.doSnackbar('success', 'Event saved')
          })
           .catch((error) => {
            // console.log(error);
            this.doSnackbar('error', error)
          })
          .then( () => {
            // always executed  
            this.selectedOpen = false          
            this.dialog = false          
          });
      },
      timeConverter(timestamp){
        var a = new Date(timestamp)
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        month = a.getMonth() + 1;
        var date = a.getDate();
        var hour = a.getHours() -1;
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
        return time;
        },
      optionsSelectedEvent(){
          alert('Options selected events')
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      getCurrentTime () {
        return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
      },
      scrollToTime () {
        const time = this.getCurrentTime()
        const first = Math.max(0, time - (time % 30) - 30)

        this.cal.scrollToTime(first)
      },
      updateTime () {
        setInterval(() => this.cal.updateTimes(), 60 * 1000)
      },
      async fetchEvents(){
        let events, tevents = []
        await this.$admin.http.get('/calendar_events', {
            params: {
              calendar_id: calendar_id
            }
          })
          .then((response) => {
            events = response.data['hydra:member']
            // console.log(events)
            events.forEach((e)=>{
            const first = new Date(e.start).getTime()
            //const start = new Date(first - (first % 900000))
            const second = new Date(e.endDate).getTime()
           // const end = new Date(second - (second % 900000))

            const firstTimestamp = first
            const secondTimestamp = second
            const start = firstTimestamp 
            const end = secondTimestamp
            // const end = start + secondTimestamp
                

                tevents.push({
                start : start,
                end : end,
                timed : e.timed,
                color : e.color,
                name : e.name,
                details: e.body,
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

          

          this.events = tevents
          // console.log(tevents)
      },
      startDrag ({ event, timed }) {
        if (event && timed) {
          this.dragEvent = event
          this.dragTime = null
          this.extendOriginal = null
        }
      },
      startTime (tms) {
        const mouse = this.toTime(tms)

        if (this.dragEvent && this.dragTime === null) {
          const start = this.dragEvent.start

          this.dragTime = mouse - start
        } else {
          this.createStart = this.roundTime(mouse)
          this.createEvent = {
            name: `Event #${this.events.length}`,
            color: this.rndElement(this.colors),
            start: this.createStart,
            end: this.createStart,
            timed: true,
          }

          this.events.push(this.createEvent)
        }
      },
      extendBottom (event) {
        this.createEvent = event
        this.createStart = event.start
        this.extendOriginal = event.end
      },
      mouseMove (tms) {
        const mouse = this.toTime(tms)

        if (this.dragEvent && this.dragTime !== null) {
          const start = this.dragEvent.start
          const end = this.dragEvent.end
          const duration = end - start
          const newStartTime = mouse - this.dragTime
          const newStart = this.roundTime(newStartTime)
          const newEnd = newStart + duration

          this.dragEvent.start = newStart
          this.dragEvent.end = newEnd
        } else if (this.createEvent && this.createStart !== null) {
          const mouseRounded = this.roundTime(mouse, false)
          const min = Math.min(mouseRounded, this.createStart)
          const max = Math.max(mouseRounded, this.createStart)

          this.createEvent.start = min
          this.createEvent.end = max
        }
      },
      endDrag () {
        this.dragTime = null
        this.dragEvent = null
        this.createEvent = null
        this.createStart = null
        this.extendOriginal = null
      },
      cancelDrag () {
        if (this.createEvent) {
          if (this.extendOriginal) {
            this.createEvent.end = this.extendOriginal
          } else {
            const i = this.events.indexOf(this.createEvent)
            if (i !== -1) {
              this.events.splice(i, 1)
            }
          }
        }

        this.createEvent = null
        this.createStart = null
        this.dragTime = null
        this.dragEvent = null
      },
      roundTime (time, down = true) {
        const roundTo = 15 // minutes
        const roundDownTime = roundTo * 60 * 1000

        return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
      },
      toTime (tms) {
        return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
      },
      getEventColor (event) {
        const rgb = parseInt(event.color.substring(1), 16)
        const r = (rgb >> 16) & 0xFF
        const g = (rgb >> 8) & 0xFF
        const b = (rgb >> 0) & 0xFF

        return event === this.dragEvent
          ? `rgba(${r}, ${g}, ${b}, 0.7)`
          : event === this.createEvent
            ? `rgba(${r}, ${g}, ${b}, 0.7)`
            : event.color
      },
      getEvents ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`).getTime()
        const max = new Date(`${end.date}T23:59:59`).getTime()
        const days = (max - min) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const timed = this.rnd(0, 3) !== 0
          const firstTimestamp = this.rnd(min, max)
          const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000
          const start = firstTimestamp - (firstTimestamp % 900000)
          const end = start + secondTimestamp

          events.push({
            name: this.rndElement(this.names),
            color: this.rndElement(this.colors),
            start,
            end,
            timed,
          })
        }

        this.events = events
      },
      showEvent ({ nativeEvent, event }) {
          // console.log(event)
        this.isEditing = false
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      rndElement (arr) {
        return arr[this.rnd(0, arr.length - 1)]
      },
    },
  }
</script>
<style scoped lang="scss">

/* drag */

.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}

/* dayline */
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
