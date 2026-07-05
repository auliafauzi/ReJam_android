import http from './http'

export const wilayahApi = {
  listProvinsi() {
    return http.get('/api/wilayah/provinsi/')
  },
  listKota(provinsiKode) {
    // provinsiKode is optional — omit to get all 514 kota
    return http.get('/api/wilayah/kota/', {
      params: provinsiKode ? { provinsi: provinsiKode } : {},
    })
  },
  listKecamatan(kotaKode) {
    // kotaKode is effectively required — an unfiltered call returns all 7,215 records
    return http.get('/api/wilayah/kecamatan/', {
      params: { kota: kotaKode },
    })
  },
}
