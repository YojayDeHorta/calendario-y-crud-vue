<template>
  <v-form @submit.prevent="subirImagen" enctype="multipart/form-data">
    <v-container>
      <v-row>
        <v-col md="6"> 
          <h1>forrmulario para imagenes</h1>
          <v-file-input @change="clickVue" type="file" accept="image/*" label="File input"></v-file-input>
          <input @change="clickImagen($event)" type="file">
          <v-btn type="submit">subir imagen</v-btn>
        </v-col>
        <v-col md="6">
          <v-btn @click="cargarImagen" >cargar imagen</v-btn>
          <v-img v-if="imagendesc=!null" :src="imagenDescargada"></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
            <v-btn @click="cargarImagenes" >cargar imagenes</v-btn>
            <div v-for="img in imagenes" :key="img">
              <v-img max-height="150" max-width="250" :src="img" ></v-img>
            </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import {storage} from '../main'
const ref=storage.ref()
export default {
  data() {
    return {
      imagenes:[],
      imagen:null,
      imagenDescargada:null,
    }
  },
  methods: {
      clickImagen(e){
          this.imagen=e.target.files[0]
          console.log(this.imagen);
      },
      clickVue(file){
          this.imagen=file
          console.log(file);
      },
      subirImagen(){
          const refImg=ref.child('imagenes/'+this.imagen.name)
          const metadata={contentType: 'img/jpeg'}
          refImg.put(this.imagen,metadata)
          .then(e=>console.log(e))
      },
      cargarImagen(){
          ref.child('imagenes/000.jpg').getDownloadURL()
          .then( (url)=>{
            this.imagenDescargada=url
              console.log(url);
          })  
      },
      cargarImagenes(){
          ref.child('imagenes').listAll()
          .then((res)=>{
            res.items.map((item)=>{
              ref.child(item.location.path_).getDownloadURL()
              .then((url=>{
                  this.imagenes.push(url)
                  console.log(this.imagenes);
              }))
            })
            console.log(res);
          })
      }
  },
}
</script>