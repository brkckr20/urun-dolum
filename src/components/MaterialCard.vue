<template>
    <div class="container mt-4">
        <div class="card p-0">
            <div class="card-header">
                <h4>Malzeme Kartları</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Malzeme Adı</label>
                        <input type="text" class="form-control" v-model="materialName" required>
                    </div>
                    <!-- <div class="mb-3"> gerektiğinde ekleyebiliriz
                        <label class="form-label">Birim</label>
                        <input type="text" class="form-control" v-model="unit" required>
                    </div> -->
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                </form>

                <div class="mt-4">
                    <h5>Malzeme Listesi</h5>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Malzeme Adı</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 15px;">
                            <tr v-for="material in materials" :key="material.id">
                                <td>{{ material.name }}</td>
                                <td>
                                    <button @click="editMaterial(material)" class="btn btn-sm btn-warning me-2"><i
                                            class="bi bi-pencil-fill"></i></button>
                                    <button @click="deleteMaterial(material.id)" class="btn btn-sm btn-danger"><i
                                            class="bi bi-trash-fill"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
const materials = ref([])
const editMode = ref(false)
const currentId = ref(null)
const { withLoading } = useLoading()

const handleSubmit = async () => {
    await withLoading(async () => {
        try {
            if (editMode.value) {
                await updateDoc(doc(db, 'materials', currentId.value), {
                    name: materialName.value,
                    unit: unit.value
                })
                toast.success('Malzeme güncellendi')
            } else {
                await addDoc(collection(db, 'materials'), {
                    name: materialName.value,
                    unit: unit.value
                })
                toast.success('Malzeme eklendi')
            }

            materialName.value = ''
            unit.value = ''
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
        }))
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
}

onMounted(() => {
    loadMaterials()
})
</script>