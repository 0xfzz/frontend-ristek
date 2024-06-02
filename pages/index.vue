<template>
  <div>
    <v-row>
      <v-col><v-btn color="primary" @click="openTambahBarang" class="">Tambah Barang</v-btn></v-col>
      <v-col><v-select v-model="kategoriId" :items="kategoriSelect" item-title="name" item-value="id"></v-select></v-col>
    </v-row>
    <v-data-table :items="barang" :headers="headers" :loading="loadingTable">
      <template v-slot:item.kategori="{ item }">
        <v-chip color="primary" variant="flat" class="mr-2" v-if="item.kategori.length > 0"
          v-for="kat in item.kategori">
          {{ kat.name }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn class="ms-auto" color="primary" @click="openUpdateBarang(item)"><v-icon>mdi-lead-pencil</v-icon></v-btn>
        <v-btn class="ms-auto" color="red" text="Hapus Barang"
          @click="openConfirmationOnDelete(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" max-width="500">

      <template v-slot:default="{ isActive }">
        <v-card title="Apakah Anda Yakin?">
          <v-card-text>
            Aksi ini tidak dapat diulangi lagi.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" @click="dialogDelete = false"></v-btn>
            <v-btn text="Hapus" @click="go"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400"  :title="(mode == 'update' ? 'Update' : 'Tambah') + ' Barang'">
        <v-row class="pa-5">
          <v-col md="12"><v-text-field v-model="barangData.name" label="Nama Barang*" required></v-text-field></v-col>
          <v-col md="12"><v-text-field v-model="barangData.quantity" label="Quantity*" required
              type="number"></v-text-field></v-col>
          <v-col md="12"><v-text-field v-model="barangData.price" label="Price*" required
              type="number"></v-text-field></v-col>
          <v-col md="12"><v-select v-model="selectedKategori" :items="kategori" item-title="name" item-value="id"
              label="Kategori" chips multiple></v-select></v-col>
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

const barang = useState("barang", () => [])
const headers = useState("headers", () => {
  return [
    // Dynamic headers
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: 'Nama Barang',
      key: 'name'
    },
    {
      title: 'Kuantitas',
      key: 'quantity'
    },
    {
      title: 'Harga',
      key: 'price'
    },
    {
      title: 'Kategori',
      key: 'kategori'
    },
    {
      title: 'Aksi',
      key: 'actions'
    },
  ]
})
const kategori = useState("kategori")
const loadingTable = useState("loadingTable")
const kategoriSelect = useState("kategoriSelect")
fetchKategori()
const kategoriId = useState("kategoriId", () => 0)
fetchBarang()

const mode = useState("mode", () => "tambah")
const dialogDelete = useState("dialogDelete", () => false)
const dialog = useState("dialog", () => false)
const selectedKategori = useState("selected")
const barangData = useState<{
  id: string,
  name: string,
  price: string,
  quantity: string
}>("barangData", () => {
  return {
    name: "",
    price: "0",
    quantity: "0"
  }
})

async function fetchKategori() {
  const responseKategori = await useApi("/kategori")

  kategori.value = responseKategori.data.value.data
  kategoriSelect.value = kategori.value
  kategoriSelect.value.unshift({
    id: 0,
    name: "all"
  })
}
watch(kategoriId, async (newQuestion, oldQuestion) => {
  await fetchBarang()
})
async function fetchBarang() {
  loadingTable.value = true
  let query = {}
  if(kategoriId.value != 0){
    query = {
      kategori_id: kategoriId.value
    }
  }
  const responseBarang = await useApi("/barang", {
    query
  })
  barang.value = responseBarang.data.value.data.map((el: any) => {
    const { createdAt, updatedAt, ...rest } = el
    return { ...rest }
  })
  loadingTable.value = false

}
function openTambahBarang() {
  barangData.value = {
    id: "0",
    name: "",
    price: "0",
    quantity: "0"
  }
  selectedKategori.value = []
  mode.value = "tambah"
  dialog.value = true
}
function openUpdateBarang(data: any) {
  barangData.value = {
    id: "0",
    name: "",
    price: "0",
    quantity: "0"
  }
  selectedKategori.value = []
  mode.value = "update"
  barangData.value.id = data.id
  barangData.value.name = data.name
  barangData.value.quantity = data.quantity
  barangData.value.price = data.price
  let kategori = []
  if (data.kategori.length > 0) {
    kategori = data.kategori.map((el: any) => {
      return el.id
    })
  }
  selectedKategori.value = kategori
  dialog.value = true
}
function openConfirmationOnDelete(id: string) {
  mode.value = "hapus"
  barangData.value.id = parseInt(id)
  dialogDelete.value = true
}
async function go() {
  if (mode.value == 'tambah') {
    tambahBarang()
  } else if (mode.value == "update") {
    updateBarang()
  } else if (mode.value == "hapus") {
    deleteBarang()
  }
}
async function deleteBarang() {
  await useApi("/barang", {
    method: "DELETE",
    body: {
      id: parseInt(barangData.value.id)
    }
  })
  await fetchBarang()
  dialogDelete.value = false
  toast.success("Sukses menghapus barang", {theme: "dark"})
}
async function updateBarang() {

  await useApi("/barang", {
    method: "PUT",
    body: {
      id: parseInt(barangData.value.id),
      name: barangData.value.name,
      price: parseInt(barangData.value.price),
      quantity: parseInt(barangData.value.quantity),
      categories: selectedKategori.value
    }
  })
  await fetchBarang()
  dialog.value = false
  toast.success("Sukses mengupdate barang", {theme: "dark"})
}
async function tambahBarang() {

  const tambahBarang = await useApi("/barang", {
    method: "POST",
    body: {
      name: barangData.value.name,
      price: parseInt(barangData.value.price),
      quantity: parseInt(barangData.value.quantity),
      categories: selectedKategori.value
    }
  })
  await fetchBarang()
  dialog.value = false
  toast.success("Sukses menambahkan barang", {theme: "dark"})


}
</script>