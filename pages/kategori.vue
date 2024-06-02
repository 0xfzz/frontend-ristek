<template>
  <div>
    <v-btn color="primary" @click="openTambahKategori" class="mb-4">Tambah Kategori</v-btn>
    <v-dialog v-model="dialogDelete" max-width="500">

      <template v-slot:default="{ isActive }">
        <v-card title="Apakah Anda Yakin?">
          <v-card-text>
            Aksi ini tidak dapat diulangi lagi.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" @click="ialogDelete = false"></v-btn>
            <v-btn text="Hapus" @click="go"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-data-table :items="kategori" :headers="headers">
      <template v-slot:item.actions="{ item }">
        <v-btn class="ms-auto" color="primary"
          @click="openUpdateKategori(item)"><v-icon>mdi-lead-pencil</v-icon></v-btn>
        <v-btn class="ms-auto" color="red" text="Hapus Kategori"
          @click="openConfirmationOnDelete(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400" 
        :title="(mode == 'update' ? 'Update' : 'Tambah') + ' Kategori'">
        <v-row class="pa-5">
          <v-col md="12"><v-text-field v-model="kategoriData.name" label="Nama Kategori*"
              required></v-text-field></v-col>
        </v-row>



        <template v-slot:actions>
          <v-btn class="ms-auto" color="primary" text="Submit" @click="go()"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { toast } from 'vue3-toastify'
const headers = useState("headers", () => {
  return [
    // Dynamic headers
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: 'Nama Kategori',
      key: 'name'
    },
    {
      title: 'Aksi',
      key: 'actions'
    },
  ]
})
const kategori = useState("kategori")
fetchKategori()
const dialogDelete = useState("dialogDelete")
const mode = useState("mode", () => "tambah")
const dialog = useState("dialog")
const selectedKategori = useState("selected")
const kategoriData = useState<{
  id: string,
  name: string
}>("kategoriData", () => {
  return {
    id: "",
    name: "",
  }
})

async function fetchKategori() {
  const responseKategori = await useApi("/kategori")

  kategori.value = responseKategori.data.value.data
}



function openTambahKategori() {
  kategoriData.value = {
    id: "0",
    name: ""
  }
  mode.value = "tambah"
  dialog.value = true
}
function openUpdateKategori(data: any) {
  kategoriData.value = {
    id: "0",
    name: "",
  }
  mode.value = "update"
  kategoriData.value.id = data.id
  kategoriData.value.name = data.name
  dialog.value = true
}
function openConfirmationOnDelete(id) {
  mode.value = "hapus"
  kategoriData.value.id = id
  dialogDelete.value = true
}
async function go() {
  if (mode.value == 'tambah') {
    tambahKategori()
  } else if (mode.value == "update") {
    updateKategori()
  } else if (mode.value == "hapus") {
    deleteKategori()
  }
}
async function deleteKategori() {
  await useApi("/kategori", {
    method: "DELETE",
    body: {
      id: parseInt(kategoriData.value.id)
    }
  })
  await fetchKategori()
  dialogDelete.value = false
  toast.success("Sukses menghapus barang", {theme: "dark"})
}
async function updateKategori() {

  await useApi("/kategori", {
    method: "PUT",
    body: {
      id: parseInt(kategoriData.value.id),
      name: kategoriData.value.name
    }
  })
  await fetchKategori()
  dialog.value = false
  toast.success("Sukses mengupdate kategori", {theme: "dark"})

}
async function tambahKategori() {

  const tambahKategori = await useApi("/kategori", {
    method: "POST",
    body: {
      name: kategoriData.value.name
    }
  })
  await fetchKategori()
  dialog.value = false
  toast.success("Sukses menambahkan kategori", {theme: "dark"})

}
</script>