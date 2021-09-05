<template>
  <v-app>
    <Navbar/>
    
  <!-- <Calendario/> -->
  <v-main>
      <router-view/>
  </v-main>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario'
import Navbar from './components/Navbar';
export default {
  name: 'App',
  components: {
    Calendario,
    Navbar
    
  },
  data: () => ({
    drawer:false
  }),
};
</script>
