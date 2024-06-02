
import { NuxtPage } from '#build/components';
<template>
    <v-app theme="dark">
      <v-navigation-drawer>
        <v-list-item title="Aplikasi Inventaris" subtitle="PT. Jaya Bahagia"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link title="Barang" to="/"</v-list-item>
        <v-list-item link title="Kategori" to="/kategori"></v-list-item>
      </v-navigation-drawer>
      <v-main class="ma-4">
        <NuxtPage />
      </v-main>
    </v-app>
</template>
