<template>
<v-container>
    <v-row class="ml-3">
        <v-col>
           
            <v-btn color="success" @click="dialog=true;formTitle='Agregar producto';resetearProducto()">Añadir producto</v-btn>
            
        </v-col>
    </v-row>
    <v-row class="d-flex justify-center" cols="12" md="12">
        
        <v-data-table :headers="columnas" :loading="loading" loading-text="Cargando...Porfavor espere" :items="articulos" sort-by="descripcion" class="elevation-19">
            <template v-slot:[`item.imagen`]="{ item }">
                 <v-img class="my-2"  contain max-height="200" max-width="100"  :src="item.url"></v-img> 
                
            </template>
            <template v-slot:[`item.envio`]="{ item }">
                <div v-if="item.envio==false">Envio gratuito</div>
                <div v-else>${{item.envio}}</div>
            </template>
            <template v-slot:[`item.descuento`]="{ item }">
                <div v-if="item.descuento==false">No tiene</div>
                <div v-else>{{item.descuento}}%</div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="prepararEdicion(item)"> mdi-pencil </v-icon>
                <v-icon small @click="idDelete=item.id;dialogDelete=true"> mdi-delete </v-icon>
            </template>
            
        </v-data-table>
    </v-row>
    <!-- ventana modal para crear/editar -->
    <v-dialog   v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-form  @submit.prevent="agregaryeditarProducto">
            
                
                <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="producto.descripcion" label="Titulo del producto"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field type="number" v-model.number="producto.precio" label="Precio del producto" ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field type="number" v-model.number="producto.stock" label="Stock disponible" ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="6">
                            <v-row>
                                <v-col md="6">
                                    <v-checkbox color="success" v-model="envioForm" label="Envio gratis"></v-checkbox>
                                </v-col>
                                <v-col md="6">
                                    <v-expand-transition><v-text-field v-model.number="producto.envio" type="number" v-show="!envioForm" label="Costo del envío" ></v-text-field></v-expand-transition>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col md="6">
                            <v-row>
                                <v-col md="6">
                                   <v-checkbox color="indigo" v-model="descuentoForm" label="Descuento incluido"></v-checkbox> 
                                </v-col>
                                <v-col md="6">
                                    <v-expand-transition><v-text-field v-model.number="producto.descuento" type="number" v-show="descuentoForm" label="Ingrese el descuento" ></v-text-field></v-expand-transition>
                                </v-col>
                                
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="8">
                            <v-file-input @change="clickImagen" v-model="imagen"  type="file" accept="image/*" label="Imagen del producto"></v-file-input>
                        </v-col>
                        <v-col    md="2">
                            <div v-if="imagenEdit!=''" class="subtitle-2">imagen anterior</div>
                            <v-img v-if="imagenEdit!=''" class="my-2"  max-height="250" max-width="80"  :src="imagenEdit"></v-img> 
                        </v-col>
                        <v-col  v-if="imagen!=null"  md="2">
                            <div class="subtitle-2">imagen cargada</div>
                            <v-img class="my-2"  max-height="250" max-width="80"  :src="urlImagen"></v-img> 
                        </v-col>
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="dialog=false"> Cancelar </v-btn>
                <v-btn color="blue darken-1" type="submit" text > Guardar </v-btn>
                </v-card-actions>
            </v-form>
            <!-- <v-form v-else @submit.prevent="agregarProducto"> -->
          </v-card>
        </v-dialog>

        <!-- modal para borrar -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5 text-center">estas seguro de borrar el producto con id: {{idDelete}}?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary darken-1" text @click="dialogDelete=false">cancelar</v-btn>
              <v-btn color="error darken-1" text @click="borrarProducto(idDelete)">si</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- SNACKBAR PARA MIRAR -->
        <v-snackbar  v-model="snackbar" >
            {{ mensaje }}
            <v-btn color="error" class="ml-5"  @click="snackbar = false">cerrar</v-btn>
        </v-snackbar>
</v-container>
</template>

<script>
import {db} from '../main'
import {storage} from '../main'
const ref=storage.ref()
export default {
    name:'Crud',
    data() {
        return {
            snackbar:false,
            mensaje:'',
            dialog:false,
            dialogDelete:false,
            idDelete:'',
            formTitle:'',
            envioForm:true,
            descuentoForm:false,
            imagen:null,
            urlImagen:'',
            imagenEdit:'',
            loading:true,
            imagenes:[],
            columnas:[
                {text:'ID' ,value:'id', class:'primary white--text'},
                {text:'IMAGEN DEL PRODUCTO' ,value:'imagen', class:'primary white--text'},
                {text:'DESCRIPCION' ,value:'descripcion', class:'primary white--text'},
                {text:'PRECIO' ,value:'precio', class:'primary white--text'},
                {text:'STOCK' ,value:'stock', class:'primary white--text'},
                {text:'ENVIO' ,value:'envio', class:'primary white--text'},
                {text:'DESCUENTO' ,value:'descuento', class:'primary white--text'},
                { text: 'ACCIONES', value: 'actions', class:'primary white--text', sortable: false },
            ] ,
            articulos:[],
            producto: {
                id:'',
                descripcion: '',
                precio: '',
                stock: '',
                envio: '',
                descuento: '',
            },
            
        }
    },
    created() {
        this.verProductos()
        
    },
    methods: {
        prepararEdicion(productoAeditar){
            this.producto=JSON.parse(JSON.stringify(productoAeditar))
            this.formTitle='Editando el producto: '+productoAeditar.descripcion
            this.imagenEdit=this.producto.url
            this.imagen=null
            if(this.producto.envio!=false)this.envioForm=false
            if(this.producto.descuento!=false)this.descuentoForm=true
            this.dialog=true
        },
        async verProductos(){
           try {
               this.loading=true
               const snapshot= await db.collection('productos').get();
               const events=[]
               snapshot.forEach(doc=>{
                   ref.child(`productos/${doc.id}.jpg`).getDownloadURL()
                  .then(url =>{
                   let eventoData = doc.data()
                   eventoData.id=doc.id
                   eventoData.url=url
                   events.push(eventoData);
                    })
                        
                    
               })
               this.articulos=events
               this.loading=false
               
           } catch (error) {
            console.log(error);
           }
        },
        async agregaryeditarProducto(){
            try {
                if(this.envioForm)this.producto.envio=false
                if(!this.descuentoForm)this.producto.descuento=false
                if(this.producto.id==''){
                    await db.collection('productos').add({
                    descripcion: this.producto.descripcion,
                    precio:this.producto.precio,
                    stock:this.producto.stock,
                    envio:this.producto.envio,
                    descuento:this.producto.descuento,
                })
                .then(docRef => {
                    const refImg= ref.child(`productos/${docRef.id}.jpg`)
                    const metadata={contentType: 'img/jpeg'}
                    refImg.put(this.imagen,metadata)
                    .then(()=>{
                        this.verProductos() 
                        this.resetearProducto()
                    })
                    .catch(error=>{ console.error("Error al subir la imagen: ", error);})
                    
                })
                .catch(function(error) {
                    console.error("Error al añadir documento: ", error);
                });
                this.dialog=false
                this.snackbar=true
                this.mensaje='producto añadido exitosamente'
                }else{
                    await db.collection('productos').doc(this.producto.id).update({
                        descripcion: this.producto.descripcion,
                        precio:this.producto.precio,
                        stock:this.producto.stock,
                        envio:this.producto.envio,
                        descuento:this.producto.descuento,
                    })
                    if (this.imagen!=null) {
                        const refImg= ref.child(`productos/${this.producto.id}.jpg`)
                        const metadata={contentType: 'img/jpeg'}
                        refImg.put(this.imagen,metadata)
                        .then(()=>{
                            this.verProductos() 
                            this.dialog=false
                            this.snackbar=true
                            this.resetearProducto()
                            this.mensaje='tarea editada exitosamente'
                        })  
                    }else{
                        this.verProductos() 
                        this.dialog=false
                        this.snackbar=true
                        this.resetearProducto()
                        this.mensaje='tarea editada exitosamente'
                    }
                    
                    
                }
                

            } catch (error) {
                console.log(error);
            }
            
        },
        async borrarProducto(id){
            try {
                await db.collection('productos').doc(id).delete()
                await ref.child(`productos/${id}.jpg`).delete()
                this.verProductos();
                this.dialogDelete=false
                this.snackbar=true
                this.mensaje='tarea borrada exitosamente'
            } catch (error) {
                console.log(error);
            }
       },async actualizarProducto(){
           try {
               await db.collection('productos').doc(this.producto.id).update({
                    descripcion: this.producto.descripcion,
                    precio:this.producto.precio,
                    stock:this.producto.stock,
               })
                this.snackbar=true
                this.mensaje='tarea editada exitosamente'
           } catch (error) {
               console.log(error);
           }
       },
       resetearProducto(){
            this.imagen=null
            this.producto.id=''
            this.producto.descripcion=''
            this.producto.precio=''
            this.producto.stock=''
            this.producto.envio=''
            this.producto.descuento=''
            this.imagenEdit=''  
            this.envioForm=true
            this.descuentoForm=false  
       },
       clickImagen(){
           if (this.imagen!== null) {
              this.urlImagen=URL.createObjectURL(this.imagen)
           }
           
      },
       async subirImagen(id){
        const refImg= ref.child(`productos/${id}.jpg`)
        const metadata={contentType: 'img/jpeg'}
        await refImg.put(this.imagen,metadata)
        .then(e=>console.log(e))
      },
        cargarImagen(id){
         ref.child(`productos/${id}.jpg`).getDownloadURL()
          .then(url =>{
            this.imagenes[id]=url
          })   
          
      },
    },
}
</script>