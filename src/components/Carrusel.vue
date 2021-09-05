<template>
  <v-container fluid>
    <v-carousel  show-arrows-on-hover hide-delimiters :cycle="true" max-width="350"
      interval="5000"
      class="hidden-sm-and-down">
      <template v-slot:prev="{ on, attrs }">
                <v-btn v-bind="attrs" fab v-on="on" color="white"><v-icon color="blue">mdi-chevron-left</v-icon></v-btn>
            </template>
            <template v-slot:next="{ on, attrs }">
                <v-btn v-bind="attrs" fab v-on="on" color="white" ><v-icon color="blue">mdi-chevron-right</v-icon></v-btn>
            </template>
    <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
    </v-carousel>
    <v-container >
    <v-card  class="my-5  hidden-md-and-down">
        <v-row  >
            <v-col lg="3">
                <v-row class=" my-2 ">
                    <v-col lg="3" class="mr-4">
                        <v-btn  class="ml-2 mr-1 " fab  elevation="1"> <v-icon color="blue">mdi-credit-card-outline</v-icon> </v-btn>
                    </v-col>
                  <v-col lg="8">
                    
                        <div class="subtitle-1">Hasta 48 cuotas</div>
                        <div @click="verMas()" class="blue--text subtitle-2">Ver más</div>
                     
                  </v-col>
                </v-row>
            </v-col>
            <v-col lg="3">
                <v-row class=" my-2 ">
                    <v-col lg="3" class="mr-4">
                        <v-btn  class="ml-5 " fab  elevation="1"> <v-icon color="blue">mdi-bank</v-icon> </v-btn>
                    </v-col>
                  <v-col lg="8" class="mr-0">
                    
                        <div class="subtitle-1 mr-0">Transferencia desde tu banco</div>
                        <div @click="verMas()" class="blue--text subtitle-2 mr-0">Ver más</div>
                     
                  </v-col>
                </v-row>
            </v-col>
            <v-col lg="3">
                <v-row class=" my-2 ">
                    <v-col lg="3" class="mr-4">
                        <v-btn  class="ml-5 " fab  elevation="1"> <v-icon color="blue">mdi-cash-multiple</v-icon> </v-btn>
                    </v-col>
                  <v-col lg="8">
                    
                        <div class="subtitle-1">Paga en efectivo</div>
                        <div @click="verMas()" class="blue--text subtitle-2">Ver más</div>
                     
                  </v-col>
                </v-row>
            </v-col>
            <v-col lg="3">
                <v-row class=" my-2 ">
                    <v-col lg="3" class="mr-4">
                        <v-btn  class="ml-5 " fab  elevation="1"> <v-icon color="blue">mdi-plus-circle-outline</v-icon> </v-btn>
                    </v-col>
                  <v-col lg="8">
                    
                        <div class="subtitle-1">Más medios de pago</div>
                        <div @click="verMas()" class="blue--text subtitle-2">Ver más</div>
                     
                  </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
    </v-container>
  </v-container>
  
  
</template>
<script>
  export default {
    name:'Carrusel',
    data () {
      return {
        arrows:false,
        items: [
          {
            src: 'https://http2.mlstatic.com/D_NQ_680789-MLA47347522259_092021-OO.webp',
          },
          {
            src: 'https://http2.mlstatic.com/optimize/o:f_webp/resources/frontend/homes-korriban/assets/images/exhibitors/fallbacks/es-desktop.jpg',
          },
          {
            src: 'https://http2.mlstatic.com/D_NQ_653915-MLA47328283542_092021-OO.webp',
          },
          {
            src: 'https://http2.mlstatic.com/D_NQ_719502-MLA47175802690_082021-OO.webp',
          },
        ],
      }
    },
  }
</script>