'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const formDummy = [
      {
        id: "form-123",
        title: "Surat Keterangan Kelahiran",
        description: "Surat Keterangan Kelahiran adalah sebuah dokumen resmi yang mencatat dan menyatakan bahwa seseorang telah lahir di suatu tempat dan tanggal tertentu.",
        completeness: "Kartu Keluarga, Surat Nikah Orang Tua bayi, Surat Keterangan Lahir dari Rumah Sakit, Bidan atau Desa dan Bukti Identitas Orang Tua",
      },
      {
        id: "form-345",
        title: "Surat Keterangan Kematian",
        description: "Surat Keterangan Kematian adalah dokumen resmi yang mencatat kematian seseorang dan berfungsi sebagai bukti sah bahwa seseorang telah meninggal dunia.",
        completeness: "surat keterangan kematian dari dokter atau Rumah Sakit, KTP almarhum/almarhumah",
      },
      {
        id: "form-678",
        title: "Surat Izin Mendirikan Bangunan (IMB)",
        description: "Surat Izin Mendirikan Bangunan adalah dokumen resmi yang dikeluarkan oleh pihak berwenang untuk mengizinkan pembangunan atau renovasi suatu bangunan.",
        completeness: "Desain Bangunan,  Surat Keterangan Tanah, Surat Izin Lingkungan, Sertifikat Keamanan Bangunan",
      },
    ];
    await queryInterface.bulkInsert("Forms", formDummy);
  },

  async down (queryInterface, Sequelize) {
  }
};
