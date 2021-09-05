<template>
    <v-container>
        <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer= !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
          Calendario y Productos
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn text class="success mr-5">ingreso</v-btn> -->
      <v-btn :to="{name: 'Home'}" exact text class="gray">
        <span>Home</span>
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-btn text class="gray">
        <span>Log out</span>
        <v-icon>mdi-login-variant </v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" temporary >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            vuetify
          </v-list-item-title>
          <v-list-item-subtitle>
            prueba de modulos con vue 
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        nav
        dense
      >
        <v-list-item-group  active-class="deep-purple--text text--accent-4">
          <v-list-item :to="{name: 'Calendar'}" exact>
            <v-list-item-icon >
              <v-icon>mdi-calendar-month</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Calendario</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{name: 'Crud'}">
            <v-list-item-icon>
              <v-icon>mdi-file-table</v-icon>
            </v-list-item-icon >
            <v-list-item-title >Crud</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{name: 'Tienda'}">
            <v-list-item-icon>
              <v-icon>mdi-store-outline</v-icon>
            </v-list-item-icon >
            <v-list-item-title >Tienda</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>
    
    </v-container>
    
</template>

<script>
export default {
    name:'Navbar',

    data: () => ({
    drawer:false
    }),
}
</script>