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
        <li class="nav-item">
        </li>
    </ul>
    <div class="d-flex flex-row gap-2">        
        <p class="text-white m-0">{{ user.toUpperCase() }}</p>
        <router-link class="nav-link text-white border px-2 bg-danger" to="/">ÇIKIŞ</router-link>
    </div>
    </div>



  </nav>
    <div class="container mt-4">
        <div class="card p-0">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center gap-2">
                    <button class="btn btn-outline-primary " @click="changeDate(-1)">
                        < </button>
                            <h4 class="mb-0">
                                {{ formatDate(selectedDate) }}
                            </h4>
                            <button class="btn btn-outline-primary" @click="changeDate(1)">
                                >
                            </button>
                </div>
            </div>
            <div class="card-body">
                <div class="mb-4">
                    <div style="max-height: 200px; overflow-y: auto;">
                        <div v-for="material in materials" :key="material.id" class="form-check mb-2">
                            <input class="form-check-input" type="radio" :id="material.id" :value="material.id"
                                v-model="selectedMaterial" name="materialRadio">
                            <label class="form-check-label" :for="material.id">
                                {{ material.name }}<!--  ({{ material.unit }}) -->
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Miktar</label>
                    <input type="number" class="form-control" v-model="quantity" required>
                </div>

                <button @click="saveEntry" class="btn btn-primary" :disabled="!selectedMaterial || !quantity">
                    Kaydet
                </button>

                <div class="mt-4">
                    <h6>Günlük Kayıtlar</h6>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Malzeme</th>
                                <th>Miktar</th>
                                <th>Sil</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider" style="font-size: 15px;">
                            <tr v-for="entry in dailyEntries" :key="entry.id">
                                <td>{{ entry.materialName }}</td>
                                <td>{{ entry.quantity }}</td>
                                <td>
                                    <button @click="editEntry(entry)" class="btn btn-sm btn-warning me-2">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button @click="deleteEntry(entry.id)" class="btn btn-sm btn-danger">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-end mt-3">
                    <button class="btn btn-info text-white" @click="showReportModal">
                        <i class="bi bi-clipboard-data"></i> Rapor
                    </button>
                </div>

                <!-- Rapor Modal -->
                <div class="modal fade" id="reportModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Günlük Rapor</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <textarea class="form-control" rows="10" readonly
                                    ref="reportText">{{ generateReport }}</textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" @click="copyReport">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                                <button type="button" class="btn btn-success btn-sm" @click="shareOnWhatsApp">
                                    <i class="bi bi-whatsapp"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Düzenleme Modal -->
                <div class="modal fade" id="editModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Kayıt Düzenle</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="form-label">Malzeme</label>
                                    <select class="form-select" v-model="editForm.materialId">
                                        <option v-for="material in materials" :key="material.id" :value="material.id">
                                            {{ material.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Miktar</label>
                                    <input type="number" class="form-control" v-model="editForm.quantity">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Kullanıcı</label>
                                    <input type="text" class="form-control" v-model="editForm.unit">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                                <button type="button" class="btn btn-primary" @click="updateEntry">Güncelle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { db } from '../firebase/config'
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { Modal } from 'bootstrap'
import { useLoading } from '../composables/loading'

const toast = useToast()
const materials = ref([])
const selectedMaterial = ref(null)
const quantity = ref('')
const selectedDate = ref(new Date())
const dailyEntries = ref([])
const reportText = ref(null)
let reportModal = null
const user = ref('');
const { withLoading } = useLoading()

// Düzenleme formu için state
const editForm = ref({
    id: null,
    materialId: '',
    quantity: ''
})

let editModal = null

const formatDate = (date) => {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date)
}

/* const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
} */

const changeDate = (days) => {
    const newDate = new Date(selectedDate.value)
    newDate.setDate(newDate.getDate() + days)
    selectedDate.value = newDate
}

const loadDailyEntries = async () => {
    await withLoading(async () => {
        try {
            const startOfDay = new Date(selectedDate.value)
            startOfDay.setHours(0, 0, 0, 0)

            const endOfDay = new Date(selectedDate.value)
            endOfDay.setHours(23, 59, 59, 999)

            const q = query(
                collection(db, 'entries'),
                where('date', '>=', Timestamp.fromDate(startOfDay)),
                where('date', '<=', Timestamp.fromDate(endOfDay))
            )

            const querySnapshot = await getDocs(q)
            dailyEntries.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(entry => entry.unit === user.value)
        } catch (error) {
            toast.error('Kayıtlar yüklenirken bir hata oluştu')
            console.log(error);
            
        }
    })
}

const loadMaterials = async () => {
    const q = query(
        collection(db, 'materials'),
        where('unit', '==', user.value)  // 'user' alanı, user.value ile eşit olanları getir
    )
    const querySnapshot = await getDocs(q)
        materials.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
  }))
}

const saveEntry = async () => {
    await withLoading(async () => {
        try {
            const material = materials.value.find(m => m.id === selectedMaterial.value)
            await addDoc(collection(db, 'entries'), {
                materialId: selectedMaterial.value,
                materialName: material.name,
                quantity: Number(quantity.value),
                date: Timestamp.fromDate(new Date()),
                unit: user.value
            })


            toast.success('Giriş kaydedildi')
            selectedMaterial.value = null
            quantity.value = ''
            loadDailyEntries()
        } catch (error) {
            toast.error('Kayıt işlemi başarısız')
        }
    })
}

// Rapor oluşturma computed property
const generateReport = computed(() => {
    //const date = formatDate(selectedDate.value)
    //let report = `${date}\n\n`
    let report = ''
    // Malzemeleri grupla
    const groupedEntries = dailyEntries.value.reduce((acc, entry) => {
        if (!acc[entry.materialName]) {
            acc[entry.materialName] = 0
        }
        acc[entry.materialName] += entry.quantity
        return acc
    }, {})

    // Gruplanmış verileri rapora ekle
    Object.entries(groupedEntries).forEach(([material, total]) => {
        report += `✅${total} adet ${material} dolduruldu\n`
    })

    // En alta transfer mesajını ekle
    const totalQuantity = Object.values(groupedEntries).reduce((sum, qty) => sum + qty, 0)
    report += `\n✅Ürünler sisteme girildi transfer yapıldı`
    report += `\n✅${totalQuantity} adet epoksi dolduruldu`

    return report
})

// Modal'ı göster
const showReportModal = () => {
    if (!reportModal) {
        reportModal = new Modal(document.getElementById('reportModal'))
    }
    reportModal.show()
}

// Raporu panoya kopyala
const copyReport = async () => {
    try {
        await navigator.clipboard.writeText(generateReport.value)
        toast.success('Rapor panoya kopyalandı')
    } catch (error) {
        toast.error('Kopyalama işlemi başarısız oldu')
    }
}

const shareOnWhatsApp = () => {
    const message = generateReport.value
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
}

const deleteEntry = async (id) => {
    await withLoading(async () => {
        try {
            await deleteDoc(doc(db, 'entries', id))
            toast.success('Kayıt silindi')
            loadDailyEntries()
        } catch (error) {
            toast.error('Silme işlemi başarısız oldu')
        }
    })
}

// Düzenleme modalını aç
const editEntry = (entry) => {
    editForm.value = {
        id: entry.id,
        materialId: entry.materialId,
        quantity: entry.quantity,
        unit: entry.unit
    }
    if (!editModal) {
        editModal = new Modal(document.getElementById('editModal'))
    }

    editModal.show()
}

// Kayıt güncelleme
const updateEntry = async () => {
    await withLoading(async () => {
        try {
            const material = materials.value.find(m => m.id === editForm.value.materialId)
            await updateDoc(doc(db, 'entries', editForm.value.id), {
                materialId: editForm.value.materialId,
                materialName: material.name,
                quantity: Number(editForm.value.quantity),
                unit: user.value
            })


            toast.success('Kayıt güncellendi')
            editModal.hide()
            loadDailyEntries()
        } catch (error) {
            toast.error('Güncelleme işlemi başarısız oldu')
        }
    })
}

watch(selectedDate, () => {
    loadDailyEntries()
})

onMounted(() => {
    user.value = sessionStorage.getItem('user');
    loadMaterials()
    loadDailyEntries()
    reportModal = new Modal(document.getElementById('reportModal'))
    editModal = new Modal(document.getElementById('editModal'))
})


</script>

<style scoped>
.bi-chevron-left,
.bi-chevron-right {
    font-size: 1.2rem;
}
</style>