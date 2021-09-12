<template>
    <v-row >
    <v-col>
      <v-sheet >
        <v-toolbar flat color="white">

          <!-- Botón Agregar Evento -->
            <v-btn color="primary" dark class="mr-4" @click="dialog = true">agregar</v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-2" outlined @click="dialogConfig=true" fab small ><v-icon >mdi-cog</v-icon></v-btn>
              <v-btn
                outlined
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            
            <v-list>
              <v-list-item @click="changeType=true; type = 'day'">
                <v-list-item-title>Dia</v-list-item-title>
              </v-list-item>
              <v-list-item @click="changeType=true; type = '4day'">
                <v-list-item-title>4 Dias</v-list-item-title>
              </v-list-item>
              <v-list-item @click="changeType=true; type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="changeType=true; type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="100%">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="height"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
         
        :weekdays="weekFormat"
        
        :short-weekdays="false"
        :first-interval= intervaloInicial
        :interval-minutes= 10
        :interval-count= intervaloFinal
        locale="es"
        ></v-calendar>
        <!-- configuracion -->
        <v-dialog persistent max-width="700px"  v-model="dialogConfig">
          <v-container>
            <v-form @submit.prevent="saveConfig">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Configuracion</span>
                </v-card-title>
                <v-card-text>
                  <v-row >
                    <v-col  lg="6"  md="6" xs="12" class="d-flex flex-column justify-center">
                        <h2>Hora de apertura:</h2>
                        <v-time-picker v-model="configStart" :max="configEnd"></v-time-picker>
                    </v-col>
                    <v-col lg="6" md="6" xs="12" class="d-flex flex-column justify-center">
                        <h2>Hora de cierre:</h2>
                        <v-time-picker v-model="configEnd" :min="configStart"></v-time-picker>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" text color="primary" class="mr-2" >Guardar configuracion</v-btn>
                    <v-btn  color="error" text class="mr-4" @click.stop="dialogConfig=false">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-container>
        </v-dialog>

        <!-- Agregar Modal Agregar Evento :first-interval= 8   :interval-minutes= 60 :interval-count= 12 locale="es"-->
        <v-dialog persistent max-width="700px"  v-model="dialog">
            <v-card>
                <v-container>
                    <v-card>
                    <v-card-title>
                        <span class="text-h5">Crear evento</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="addEvent">
                        <v-row>
                            <v-col md="6">
                                <v-text-field type="text" label="Agregar título" v-model="name"  required></v-text-field>  
                            </v-col>
                            <v-col md="6">
                                <v-text-field type="text" label="Agregar detalle " v-model="details"  required></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="4">
                                <v-text-field type="date" label="Inicio del evento" @change="dateEnd=dateStart" :min="today" :max="dateEnd" v-model="dateStart"  required></v-text-field>
                                
                            </v-col>
                            <v-col md="4">
                                <v-text-field type="date" label="fin del evento" v-if="dateStart" :min="dateStart" v-model="dateEnd" required></v-text-field>
                            </v-col>
                            <v-col md="4">
                                <h5>color del evento:</h5>
                                <v-input-colorpicker class="ml-5" type="color" label="color del evento" v-model="color" value="color"></v-input-colorpicker>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col md="6" v-if="dateStart">
                                <v-menu ref="menu"  v-model="menuStart" :close-on-content-click="false" :nudge-right="40" :return-value.sync="clockStart">
                                  <template v-slot:activator="{ on }">
                                    <v-text-field v-model="clockStart" label="Hora inicial"  readonly v-on="on"></v-text-field>
                                  </template>
                                  <v-time-picker v-if="menuStart" v-model="clockStart" min="09:00" max="19:00" @click:minute="$refs.menu.save(clockStart)"></v-time-picker>
                                </v-menu>
                                
                            </v-col>
                            <v-col md="6" >
                                <v-menu v-if="clockStart" ref="menu2" v-model="menuEnd" :close-on-content-click="false" :nudge-right="40" :return-value.sync="clockEnd">
                                  <template v-slot:activator="{ on }">
                                    <v-text-field v-model="clockEnd" label="Hora final"  readonly v-on="on"></v-text-field>
                                  </template> 
                                  <v-time-picker v-if="menuEnd" v-model="clockEnd" :min="clockStart" max="19:00" @click:minute="$refs.menu2.save(clockEnd)"></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                            <v-spacer></v-spacer>
                            <v-card-actions>
                                <v-btn type="submit" color="primary" class="mr-2" >Agregar</v-btn>
                                <v-btn  color="error" class="mr-4" @click.stop="dialog=false">Cancelar</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card-text>
                    </v-card>
                </v-container>
                
            </v-card>
        </v-dialog>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <!-- Agregar Funcionalidades Editar y Eliminar -->
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon  @click="deleteEvent(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon v-if="currentlyEditing!== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              
            </v-toolbar>

            <v-card-text>
              <v-form v-if="currentlyEditing!== selectedEvent.id">
                  <div>de {{horaInicial()}} a {{horaFinal()}}</div> 
                  {{selectedEvent.details}}
              </v-form>
              <v-form v-else>
                  <v-text-field type="text" v-model="selectedEvent.name" label="editar titulo"></v-text-field>
                  <h5>detalle del evento:</h5>
                  <textarea-autosize v-model="selectedEvent.details"  type="text" style="width:100%" :min-heigth="100"></textarea-autosize>
                  <h5>color del evento:</h5>
                  <v-input-colorpicker class="ml-5" type="color" label="color del evento" v-model="selectedEvent.color" value="color"></v-input-colorpicker>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text
                color="error"
                @click="selectedOpen = false;esperarFuncion(selectedEvent)"
              >
                Cancelar
              </v-btn>
              <v-btn text v-if="currentlyEditing === selectedEvent.id" @click.prevent="updateEvent(selectedEvent)"> Guardar cambios</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <!-- SNACKBAR PARA MIRAR -->
    <v-snackbar :color="colorSnackbar" v-model="snackbar" >
    {{ mensaje }}
    <v-btn color="error" class="ml-5"  @click="snackbar = false">cerrar</v-btn>
    </v-snackbar>
  </v-row>
</template>
<script>
import {db} from '../main'
export default {
    name:'Calendario',
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'week',
      changeType:false,
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        '4day': '4 Dias',
      },
      start: null,
      end: null,
      dateStart:null,
      dateEnd:null,
      clockStart:null,
      clockEnd:null,
      menuStart:false,
      menuEnd:false,
      selectedEvent: {},
      selectedElement: null,
      oldColor:null,
      selectedOpen: false,
      events: [],
      // Adicionales...
      name: null,
      details: null,
      color: '#1976D2',
      dialog: false,
      currentlyEditing: null,
      mensaje:'',
      snackbar:false,
      colorSnackbar:'black',
      //especial para configuraciones
      dialogConfig:false,
      configStart:'09:30',
      configEnd:'19:30',
      intervaloInicial:50,
      intervaloFinal:60

    }),
    computed: {
      height () {
        if (!this.changeType) {
          switch (this.$vuetify.breakpoint.name) {
          case 'xs': this.type='day';return this.type
          case 'sm': this.type='4day';return this.type
          case 'md': this.type='4day';return this.type
          case 'lg': this.type='week';return this.type
          case 'xl': this.type='week';return this.type
          }
        }else{
          return this.type
        }
        
      },
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day 
        // const startDay = start.day + this.nth(start.day)
        const endDay = end.day 

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay}  - ${suffixMonth} ${endDay} del ${suffixYear} ${startYear}`
          case 'day':
            return `${startMonth} ${startDay} del ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
      weekFormat(){
        var dia = new Date().getDay();
        let array=[]
        for (let index = 0; index < 7; index++) {
          array.push(dia) 
          dia++
          if (dia==7)dia=0   
        }
        return array
      }
    },
    created() {
        this.loadConfig()
        this.getEvents()
        
    },
    mounted () {
      this.$refs.calendar.checkChange()
      
    },
    methods: {
        horaInicial(){if(Object.keys(this.selectedEvent).length !== 0)return this.selectedEvent.start.slice(10)},
        horaFinal(){if(Object.keys(this.selectedEvent).length !== 0)return this.selectedEvent.end.slice(10)},
        checkEvent(){
          let check=false
          this.events.forEach(event=>{
            var x=new Date(event.start).getTime();
            var y=new Date(event.end).getTime();
            var a = new Date(this.dateStart+' '+this.clockStart).getTime();
            var b = new Date(this.dateEnd+' '+this.clockEnd).getTime();
            if (Math.min(x, y) < Math.max(a, b) && Math.max(x, y) > Math.min(a, b)) {
              check=true
            }
          })
          return check
        },
        async addEvent(){
          
            try {
                if(this.name && this.dateStart && this.dateEnd &&this.clockStart&&this.clockEnd){
                    if (!this.checkEvent()) {
                      await db.collection('eventos').add({
                        name: this.name,
                        details:this.details,
                        start:this.dateStart+' '+this.clockStart,
                        end:this.dateEnd+' '+this.clockEnd,
                        color:this.color
                      })
                      this.getEvents()
                      this.name=null
                      this.details=null
                      this.dateStart=null
                      this.dateEnd=null
                      this.clockStart=null
                      this.clockEnd=null
                      this.color='#1976D2'
                      this.colorSnackbar='success'
                      this.snackbar=true
                      this.mensaje='tarea guardada correctamente'
                      this.dialog=false
                    }else{
                      this.colorSnackbar='black'
                      this.snackbar=true
                      this.mensaje='El rango de horario se cruza con otro evento, porfavor verifica tus eventos'
                    }
                    
                    
                }else{
                    this.colorSnackbar='black'
                    this.snackbar=true
                    this.mensaje='Porfavor rellena todos los campos'
                    
                }
                
            } catch (error) {
                console.log(error);
            }
        },
       async getEvents(){
           try {
               const snapshot= await db.collection('eventos').get();
               const events=[]
               
               snapshot.forEach(doc=>{
                //    console.log(doc.data());
                   let eventoData = doc.data()
                   eventoData.id=doc.id
                   events.push(eventoData);
               })
               this.events=events
           } catch (error) {
            console.log(error);
           }
       },
       async deleteEvent(evento){
            try {
                await db.collection('eventos').doc(evento.id).delete()
                this.selectedOpen=false;
                this.getEvents();
                this.colorSnackbar='success'
                this.snackbar=true
                this.mensaje='tarea borrada exitosamente'
            } catch (error) {
                console.log(error);
            }
       },
       editEvent(event){
           this.currentlyEditing = event.id
           this.oldColor=event.color
       },
       async updateEvent(event){
           try {
               await db.collection('eventos').doc(event.id).update({
                   name:event.name,
                   details:event.details,
                   color:event.color
               })
               this.selectedOpen=false;
               this.currentlyEditing=null;
               this.colorSnackbar='success'
                this.snackbar=true
                this.mensaje='tarea editada exitosamente'
           } catch (error) {
               console.log(error);
           }
       },
       esperarFuncion(event){
            setTimeout(() => {  
              this.currentlyEditing=null 
              if (this.oldColor!=null) {
                  event.color=this.oldColor;
              }
              
            }, 500);
       },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
      //configs
      async createConfig(){
        await db.collection('Configuraciones').doc('Config').set({
            start:'09:30',
            end:'19:40',
        });
      },
      async loadConfig(){
        const snapshot= await db.collection('Configuraciones').doc('Config').get();
        if (snapshot.exists) {
          let config=snapshot.data() 
          this.configStart=config.start
          this.configEnd=config.end
          this.intervaloInicial=(Number(this.configStart.slice(0,2))*6)+Number(this.configStart.slice(3,4))
          this.intervaloFinal=(Number(this.configEnd.slice(0,2))*6)+Number(this.configEnd.slice(3,4))-this.intervaloInicial
        }
      },
      async saveConfig(){
        await db.collection('Configuraciones').doc('Config').set({
            start:this.configStart,
            end:this.configEnd,
        });
        this.loadConfig()
        this.colorSnackbar='success'
        this.snackbar=true
        this.mensaje='configuracion guardada correctamente'
        this.dialogConfig=false

      }
    },
}
</script>