<template>
  <v-container fluid  :style="{ backgroundColor: '#EBEBEB'}">
    <Carrusel />
    
    
    <v-container>
    <h3 class=" 1.5rem hidden-sm-and-down">Productos recomendados para ti:</h3>
    <div class="text-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-show="loading"
        ></v-progress-circular>
    </div>
      <v-row class="hidden-sm-and-down my-15 mx-xl-16" max-height="560">
         <v-carousel show-arrows-on-hover hide-delimiters  interval="5000" :continuous="false" class="  d-flex flex-row justify-center "> 
            <template v-slot:prev="{ on, attrs }">
                <v-btn v-bind="attrs" fab v-on="on" color="white"><v-icon color="blue">mdi-chevron-left</v-icon></v-btn>
            </template>
            <template v-slot:next="{ on, attrs }">
                <v-btn v-bind="attrs" fab v-on="on" color="white" ><v-icon color="blue">mdi-chevron-right</v-icon></v-btn>
            </template>
            <v-carousel-item  v-for="(i,j) of parseInt(Productos.length/columns)" :key="j" class="mx-12 " >
                     
                 
                <v-col class="d-flex flex-row justify-center "   >
                    <div  v-for="(producto,index)  of Productos.slice(j*columns, columns*(j+1))" :key="index">
                    <v-card @mouseover="producto.hover=true"  @mouseleave="producto.hover = false"  max-width="345"  class="mr-4 " :elevation="producto.hover ? 24 : 2" >
                        <v-img max-height="224" v-if="!producto.url"  min-width="345" contain src="../assets/productoVacio.png" class="text-right "></v-img>
                        <v-img height="224" min-width="345" contain :src="producto.url" class="text-right ">
                            <v-spacer></v-spacer>
                            <v-btn :style="{opacity: 0.7}" color="gray" v-show="producto.hover" fab small class="mt-3 mr-4"><v-icon  color="blue">mdi-heart-outline</v-icon> </v-btn>
                        </v-img>
                        
                        <div v-show='producto.descuento&&producto.hover' class="caption ml-5 text-decoration-line-through">$ {{producto.precio}}</div>
                        <v-card-title class="py-0 ">$ {{descuentoTotal(index+j*columns)}} <span class="ml-5 mt-1 green--text body-2" v-show='producto.descuento'>{{producto.descuento}}% OFF</span></v-card-title>
                        
                        <v-card-text >
                            <!-- <div class="my-4 text-subtitle-1 " :class="{'green--text':(producto.envio==='Envio gratis!')}" >{{producto.envio}}</div> -->
                            <div class="my-4 text-subtitle-1 green--text" v-if="producto.envio===false">Envío gratis!</div>
                            <div class="my-4 text-subtitle-1 " v-else>Envio: {{producto.envio}}</div>
                            <v-expand-transition><div v-if="producto.hover">{{producto.descripcion}} </div></v-expand-transition>
                        </v-card-text>
                        
                        <v-card-actions >
                            <v-btn color="deep-purple lighten-2" text  v-show="producto.hover">Comprar</v-btn>
                        </v-card-actions>
                        
                    </v-card>
                    </div>
                </v-col>
               <!-- {{sigSlider()}} -->
            </v-carousel-item>
            
        </v-carousel>
      </v-row>
      </v-container>
        
      <v-container >
        
        <h3 class=" 1.5rem ">Productos recomendados para ti:</h3>
      <v-row class="mb-12" height="760px" style="height: 500px">
          
        <v-col lg="3" md="4" sm="6" v-for="(producto,index) of Productos.slice(0, 4)" :key="index" >
            
          <v-card @mouseover="producto.hover=true" @mouseleave="producto.hover = false" class="mx-auto my-12" max-width="374" :elevation="producto.hover ? 24 : 2" >

            <v-img height="224" min-width="345" contain :src="producto.url" class="text-right">
                <v-spacer></v-spacer>
                <v-btn :style="{opacity: 0.7}" color="gray" v-show="producto.hover" fab small class="mt-3 mr-4"><v-icon  color="blue">mdi-heart-outline</v-icon> </v-btn>
            </v-img>

            <div v-show='producto.descuento&&producto.hover' class="caption ml-5 text-decoration-line-through">$ {{producto.precio}}</div>
            <v-card-title class="py-0 ">$ {{descuentoTotal(index)}} <span class="ml-5 green--text caption" v-show='producto.descuento'>{{producto.descuento}}% OFF</span></v-card-title>
            
            <v-card-text >
              <div class="my-4 text-subtitle-1 green--text" v-if="producto.envio===false">Envío gratis!</div>
              <div class="my-4 text-subtitle-1 " v-else>{{producto.envio}}</div>
              <v-expand-transition><div v-if="producto.hover">{{producto.descripcion}} </div></v-expand-transition>
            </v-card-text>
            
            <v-card-actions >
              <v-btn color="deep-purple lighten-2" text  v-show="producto.hover" >Comprar</v-btn>
            </v-card-actions>
            
          </v-card>

        </v-col>
        
      </v-row>
      
    </v-container>
  </v-container>
</template>
<script>
import Carrusel from "../components/Carrusel.vue";
import {db} from '../main'
import {storage} from '../main'
const ref=storage.ref()
export default {
  
  name: "Tienda",
  components: {
    Carrusel,
  },
  data() {
      return {
          descuento:false,
          loading:true,
          
          min:0,
          max:4,
          /*Productos:[
              {id:1, descripcion :'Gamepad Gamesir X2 Bluetooth Android Ios Codm Pubg',precio:'289.990',envio:false,url:'https://http2.mlstatic.com/D_NQ_NP_702622-MCO46020660293_052021-O.webp',hover:false,descuento:false},
              {id:2, titulo :'Gamesir F4 Falcon Gatillos Electrónicos Turboshooting',precio:'129.890',envio:'$20.000',url:'https://http2.mlstatic.com/D_NQ_NP_904351-MCO45418962870_042021-O.webp',hover:false,descuento:10},
              {id:1, titulo :'Gamepad Gamesir X2 Bluetooth Android Ios Codm Pubg',precio:'289.990',envio:false,url:'https://http2.mlstatic.com/D_NQ_NP_702622-MCO46020660293_052021-O.webp',hover:false,descuento:false},
                
          ],*/
          Productos:[],
          hover:[]
      }
  },
  created() {
    this.cargarProductos()
        
  },
  methods: {
      descuentoTotal(index){
          let precio=this.Productos[index].precio
          if (this.Productos[index].descuento) {
              let descuento=parseInt(precio*(this.Productos[index].descuento/100))
              precio=(precio-descuento)
          }
          return precio

      },
      async cargarProductos(){
           try {
               const snapshot= await db.collection('productos').get();
               const events=[]
               snapshot.forEach(doc=>{
                  ref.child(`productos/${doc.id}.jpg`).getDownloadURL()
                  .then(url =>{
                    let eventoData = doc.data()
                   eventoData.id=doc.id
                   eventoData.url=url
                   eventoData.hover=false
                   events.push(eventoData);
                  })  
               })
               this.Productos=events
               this.loading=false
           } catch (error) {
            console.log(error);
           }
        }
      
  },
  computed: {
    columns() {
      if (this.$vuetify.breakpoint.xl) {
        return 4;
      }

      if (this.$vuetify.breakpoint.lg) {
        return 3;
      }

      if (this.$vuetify.breakpoint.md) {
        return 2;
      }
      return 1;
    },
    
  },
  
};
</script>