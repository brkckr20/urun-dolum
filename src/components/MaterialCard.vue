<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary"
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000;">
        <div class=" container">
            <ul class="navbar-nav d-flex flex-row gap-2">
                <li class="nav-item">
                    <router-link class="nav-link" to="/materials">🗂️ Ürünler</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/entry">✅ Girişler</router-link>
                </li>
            </ul>
            <div class="d-flex flex-row gap-2" style="font-size:13px">
                <p class="text-white m-0">{{ epoxyOrPaint }}</p>
                <span class="text-white"> - </span>
                <p class="text-white m-0">{{ user.toUpperCase() }}</p>
                <router-link class="nav-link text-white border px-2 bg-danger" to="/">Çıkış</router-link>
            </div>
        </div>
    </nav>
    <div class="container mt-4">
        <div class="card p-0"
            style="position: fixed; top: 60px; left: 0; right: 0; z-index: 1000; max-width: 94%; margin: 0 auto;">
            <div class="card-header">
                <h4 class="fs-6">Malzeme Kartları</h4>
            </div>
            <div class="card-body">
                <form class="row gap" @submit.prevent="handleSubmit">
                    <div class="mb-3 col-4">
                        <label class="form-label">Ürün</label>
                        <input type="text" class="form-control form-control-sm" v-model="materialName" required>
                    </div>
                    <div class="mb-3 col-3">
                        <label class="form-label form-label-sm">Gram</label>
                        <input type="text" class="form-control form-control-sm" v-model="gram">
                    </div>
                    <div class="mb-3 col-3">
                        <label class="form-label">Tür</label>
                        <input type="text" class="form-control form-control-sm" v-model="paintOrEpoxy">
                    </div>
                    <div class="col-2 d-flex align-items-center mt-3 justify-content-center">
                        <button type="submit" class="btn btn-sm btn-success">Kayıt</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="mt-4" style="padding-top: 165px;">
            <h5 class="fs-6">Malzeme Listesi</h5>
            <table class="table table-striped table-sm">
                <thead class="fs-6">
                    <tr>
                        <th>Malzeme Adı</th>
                        <th>Gram</th>
                        <th>Tip</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody style="font-size: 13px;">
                    <tr v-for="material in materials" :key="material.id">
                        <td>{{ material.name }}</td>
                        <td>{{ material.gram }}</td>
                        <td>{{ material.paintOrEpoxy }}</td>
                        <td>
                            <button @click="editMaterial(material)" class="btn btn-sm p-1 btn-warning"><i
                                    class="bi bi-pencil-fill"></i></button>
                            <button @click="deleteMaterial(material.id)" class="btn p-1 btn-sm btn-danger"><i
                                    class="bi bi-trash-fill"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { useLoading } from '../composables/loading'

const toast = useToast()
const materialName = ref('')
const unit = ref('')
const gram = ref('')
const paintOrEpoxy = ref('')
const materials = ref([])
const editMode = ref(false)
const currentId = ref(null)
const { withLoading } = useLoading()
const user = ref('');
const epoxyOrPaint = ref('');
const handleSubmit = async () => {
    await withLoading(async () => {
        try {
            if (editMode.value) {
                await updateDoc(doc(db, 'materials', currentId.value), {
                    name: materialName.value,
                    unit: user.value,
                    gram: gram.value,
                    paintOrEpoxy: paintOrEpoxy.value,
                })
                toast.success('Malzeme güncellendi')

            } else {
                await addDoc(collection(db, 'materials'), {
                    name: materialName.value,
                    unit: user.value,
                    gram: gram.value,
                    paintOrEpoxy: paintOrEpoxy.value,
                })
                toast.success('Malzeme eklendi')
            }

            materialName.value = ''
            unit.value = ''
            gram.value = ''
            paintOrEpoxy.value = ''
            editMode.value = false
            loadMaterials()
        } catch (error) {
            toast.error('Bir hata oluştu')
        }
    })
}

const loadMaterials = async () => {
    await withLoading(async () => {
        const querySnapshot = await getDocs(collection(db, 'materials'))
        materials.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).filter(material => material.unit === user.value)
    })
}

const deleteMaterial = async (id) => {
    await withLoading(async () => {
        try {
            await deleteDoc(doc(db, 'materials', id))
            toast.success('Malzeme silindi')
            loadMaterials()
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    })
}

const editMaterial = (material) => {
    materialName.value = material.name
    unit.value = material.unit
    editMode.value = true
    currentId.value = material.id
    gram.value = material.gram
    paintOrEpoxy.value = material.paintOrEpoxy
}

onMounted(() => {
    user.value = sessionStorage.getItem('user');
    epoxyOrPaint.value = sessionStorage.getItem('paintOrEpoxy') === "paint" ? "Boya" : "Epoksi";
    loadMaterials()
})
</script>